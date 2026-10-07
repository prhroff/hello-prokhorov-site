/* A focused viewer: one image as large as the screen allows, on the same
   near-black. Previous / next (the rail, the arrow keys, a swipe on touch), Escape
   or a click outside the image to close. It sits over the page in a modal
   <dialog>, so the page keeps its scroll position and focus returns to the
   image it was opened from.
   Given a count, a rail of every image floats on the right (along the foot
   on a phone): a glass pill of square thumbnails. Scrolling it changes the
   image, as each thumbnail settles in the middle it is the one shown; it
   follows when the image is changed any other way, and a click on a
   thumbnail opens its image. The wheel over the image steps through them. */

const ICON = {
  close: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M4 4l10 10M14 4 4 14"/></svg>',
};

/* source(i) → { alt, title, category, year, low (an already loaded URL or ''),
   sources: [{ type, srcset }], src } for entry i, or null past the end
   (more(i) is asked to load further first). count: how many there are, for
   the rail (sources that wrap round are read at 0 … count − 1). */
export function createViewer({ source, more, count = 0 }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'ar-viewer';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML = `
    <div class="ar-viewer__bar"><button class="ar-viewer__btn" type="button" data-close aria-label="Close the viewer">${ICON.close}</button></div>
    <div class="ar-viewer__stage" data-stage>
      <img class="ar-viewer__low" alt="" data-low>
      <picture data-pic></picture>
    </div>
    <div class="ar-viewer__foot">
      <p class="ar-viewer__meta" data-meta></p>
    </div>
    ${count ? '<nav class="ar-viewer__rail" aria-label="All images"><span class="ar-viewer__grip" aria-hidden="true"></span><div class="ar-viewer__scroller" data-scroller><ol data-rail></ol></div></nav>' : ''}`;
  document.body.append(dialog);
  const $ = (s) => dialog.querySelector(s);
  const low = $('[data-low]');
  const pic = $('[data-pic]');
  const stage = $('[data-stage]');
  const meta = $('[data-meta]');
  let current = -1;
  let opener = null;

  /* --- the rail: built on first open, thumbnails load as it scrolls --- */
  const rail = $('[data-rail]');
  const scroller = $('[data-scroller]');
  const wrap = (i) => ((i % count) + count) % count;
  /* Endless: the list is there three times over. Whenever the scroll drifts
     out of the middle copy it is moved back by exactly one copy, which
     looks the same, so the rail never reaches an end in either direction.
     Only the middle copy is read out and reachable by Tab. */
  const SETS = 3;
  function buildRail() {
    if (!rail || rail.children.length) return;
    const one = (set) => Array.from({ length: count }, (_, k) => {
      const s = source(k);
      const copy = set !== 1;
      return `<li${copy ? ' aria-hidden="true"' : ''}><button class="ar-viewer__thumb" type="button" data-thumb="${k}"${copy ? ' tabindex="-1"' : ''} aria-label="${String(k + 1).padStart(2, '0')}: ${s.alt.replace(/"/g, '&quot;')}">`
        + `<img src="${s.src}" alt="" loading="lazy" decoding="async" width="100" height="100"></button></li>`;
    }).join('');
    rail.innerHTML = Array.from({ length: SETS }, (_, set) => one(set)).join('');
  }
  const vertical = () => scroller.scrollHeight > scroller.clientHeight + 1;
  const pos = (v) => (v ? scroller.scrollTop : scroller.scrollLeft);
  const at = (btn, v) => (v ? btn.offsetTop - (scroller.clientHeight - btn.offsetHeight) / 2 : btn.offsetLeft - (scroller.clientWidth - btn.offsetWidth) / 2);
  // the length of one copy of the list
  function period(v) {
    const t = rail.querySelectorAll('[data-thumb="0"]');
    return t.length > 1 ? (v ? t[1].offsetTop - t[0].offsetTop : t[1].offsetLeft - t[0].offsetLeft) : 0;
  }
  function recentre() {
    const v = vertical();
    const p = period(v);
    if (!p) return;
    const x = pos(v);
    const shift = x < p * 0.5 ? p : x > p * 1.5 ? -p : 0;
    if (shift) scroller.scrollTo({ [v ? 'top' : 'left']: x + shift, behavior: 'auto' });
  }
  function mark(k) {
    rail.querySelectorAll('.is-current').forEach((b) => { b.classList.remove('is-current'); b.removeAttribute('aria-current'); });
    const all = rail.querySelectorAll(`[data-thumb="${k}"]`);
    all.forEach((b) => b.classList.add('is-current'));
    all[1]?.setAttribute('aria-current', 'true');
    return all;
  }
  // bring the current thumbnail to the middle, by the shortest way round;
  // the rail's own scroll listener ignores the movement this causes
  let steering = 0;
  function follow(i, smooth, middleCopy = false) {
    if (!rail) return;
    const all = mark(wrap(i));
    if (!all.length) return;
    const v = vertical();
    const now = pos(v);
    const to = middleCopy ? at(all[1], v)
      : [...all].map((b) => at(b, v)).reduce((a, b) => (Math.abs(b - now) < Math.abs(a - now) ? b : a));
    if (Math.abs(now - to) < 1) return;
    clearTimeout(steering);
    steering = setTimeout(() => { steering = 0; recentre(); }, smooth ? 700 : 80);
    scroller.scrollTo({ [v ? 'top' : 'left']: to, behavior: smooth ? 'smooth' : 'auto' });
  }
  // the thumbnail nearest the middle of the rail
  function middle() {
    const v = vertical();
    const r = scroller.getBoundingClientRect();
    const c = v ? r.top + r.height / 2 : r.left + r.width / 2;
    let best = null, d = Infinity;
    for (const btn of rail.querySelectorAll('[data-thumb]')) {
      const b = btn.getBoundingClientRect();
      const dd = Math.abs((v ? b.top + b.height / 2 : b.left + b.width / 2) - c);
      if (dd < d) { d = dd; best = btn; }
    }
    return best;
  }

  function show(i, fromRail = false) {
    let s = source(i);
    if (!s) { more(i); s = source(i); }
    if (!s) return;
    current = i;
    // a quick stand-in while the large image loads: the card's or the thumbnail's
    const thumb = rail?.querySelector(`[data-thumb="${wrap(i)}"] img`);
    const quick = s.low || (thumb?.complete && thumb.naturalWidth ? thumb.currentSrc : '');
    low.src = quick;
    low.hidden = !quick;
    const sources = s.sources.map((x) => `<source type="${x.type}" srcset="${x.srcset}" sizes="100vw">`).join('');
    pic.innerHTML = `${sources}<img class="ar-viewer__full" src="${s.src}" alt="">`;
    const full = pic.querySelector('img');
    full.alt = s.alt;
    const done = () => { full.classList.add('is-loaded'); low.hidden = true; };
    if (full.complete && full.naturalWidth) done(); else full.addEventListener('load', done, { once: true });
    meta.innerHTML = [s.title, [s.category, s.year].filter(Boolean).join(' · ')].filter(Boolean).map((t) => `<span>${t}</span>`).join('');
    if (fromRail) mark(wrap(i));
    else follow(i, dialog.open && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function open(i, from) {
    opener = from;
    buildRail();
    show(i);
    document.documentElement.classList.add('ar-locked');
    dialog.showModal();
    follow(i, false, true);   // now that the rail has a size, in the middle copy
    $('[data-close]').focus({ preventScroll: true });
  }

  function close() { if (dialog.open) dialog.close(); }

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('ar-locked');
    pic.innerHTML = '';
    opener?.focus({ preventScroll: true });
  });
  $('[data-close]').addEventListener('click', close);
  // a click on the dark around the image closes it
  stage.addEventListener('click', (e) => { if (e.target === stage) close(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  rail?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-thumb]');
    if (btn) show(+btn.dataset.thumb);
  });
  // scrolling the rail changes the image
  let railRaf = 0;
  scroller?.addEventListener('scroll', () => {
    if (steering || railRaf) return;
    railRaf = requestAnimationFrame(() => {
      railRaf = 0;
      recentre();
      const btn = middle();
      if (btn && +btn.dataset.thumb !== wrap(current)) show(+btn.dataset.thumb, true);
    });
  }, { passive: true });

  // the wheel over the image: one image per gesture, not one per notch
  let wheelSum = 0, wheelAt = 0;
  stage.addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.timeStamp - wheelAt < 320) return;   // the rest of a gesture already counted
    wheelSum += d;
    if (Math.abs(wheelSum) < 40) return;
    show(current + Math.sign(wheelSum));
    wheelSum = 0;
    wheelAt = e.timeStamp;
  }, { passive: false });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(current - 1); }
  });

  // a sideways swipe moves through the images; vertical drags are left alone
  let swipe = null;
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') swipe = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener('pointerup', (e) => {
    if (!swipe) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { swipe = null; });

  return { open, close, get isOpen() { return dialog.open; } };
}
