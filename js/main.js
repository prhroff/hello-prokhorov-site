/* Prokhorov® — interaction layer (v7). No dependencies.
   Everything here is progressive: the page is complete without it. */

const html = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = matchMedia('(max-width: 767px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

if (!reduceMotion) html.classList.add('motion-ok');

/* ---------- Words ----------
   [data-words] text is wrapped one span per word so the words can come into
   focus one after another on load. Inline children (the grey half of a
   sentence, line breaks, the small ® marks) are kept. */
function splitWords(root) {
  let i = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of child.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(part); continue; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.setProperty('--i', i++);
          w.textContent = part;
          frag.append(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('r') && child.tagName !== 'BR' && !child.hasAttribute('data-nosplit')) {
        walk(child);
      }
    }
  };
  walk(root);
  // a mark glued to a word (Prokhorov®) travels inside that word
  $$('.r', root).forEach((r) => { const w = r.previousElementSibling; if (w && w.classList.contains('w') && r.previousSibling === w) w.append(r); });
}
if (!reduceMotion) $$('[data-words]').forEach(splitWords);

/* ---------- Preloader ----------
   Home page only, once per session (the head script marks a returning visit
   with .is-seen before the first paint, and CSS hides the sheet). The counter
   follows the real loading (the font and the first images) and never runs
   faster than a minimum time. When it reaches 100 the sheet lifts away and the
   page comes into focus beneath it. Inner pages have no preloader and no
   entrance: they arrive from under the page transition's colour sheets. */
const reveal = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('is-loaded')));
const loader = $('[data-loader]');

function runLoader() {
  html.classList.add('is-loading');
  const count = $('[data-loader-count]', loader);
  const tasks = [document.fonts.ready, ...$$('main img[fetchpriority="high"]').map((img) => img.decode())];
  let done = 0;
  tasks.forEach((t) => Promise.resolve(t).catch(() => {}).then(() => { done++; }));

  try { sessionStorage.setItem('pk-seen', '1'); } catch { /* storage blocked */ }
  const minDur = 1700;
  const maxDur = 5000;            // the CSS safety net takes over at 6s
  const t0 = performance.now();
  let shown = 0;

  const frame = (now) => {
    const elapsed = now - t0;
    let target = Math.min(done / tasks.length, elapsed / minDur, 1);
    if (elapsed > maxDur) target = 1;
    shown += (target - shown) * 0.14;
    if (target - shown < 0.003) shown = target;
    count.textContent = String(Math.round(shown * 100)).padStart(3, '0');
    if (shown >= 1) exit(); else requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  function exit() {
    $$('.loader__top, .loader__bottom', loader).forEach((el) => el.animate(
      [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -24px' }],
      { duration: 450, delay: 200, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' },
    ));
    loader.animate(
      [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }],
      { duration: 1000, delay: 450, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' },
    ).onfinish = () => loader.remove();
    setTimeout(() => { html.classList.remove('is-loading'); reveal(); }, 380);
  }
}

if (!loader) html.classList.add('is-loaded');                  // inner page: shown as is
else if (!reduceMotion && !html.classList.contains('is-seen')) runLoader();
else {
  loader.remove();
  // arriving through a page transition: the entrance starts as the last colour sheet lifts
  Promise.all([
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]),
    window.pkRevealed,
  ]).then(reveal);
}

/* ---------- Hello ----------
   "Artem" becomes a colourful "Hello!" under the pointer (CSS). Touch has no
   hover, so a tap shows it for a moment instead. */
const swap = $('[data-swap]');
if (swap && !finePointer) {
  let swapTimer;
  swap.addEventListener('click', () => {
    swap.classList.add('is-on');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => swap.classList.remove('is-on'), 1800);
  });
}

/* ---------- Things arrive as they enter ----------
   Work images settle in; ruled lists draw their hairlines one after another. */
const enterIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    enterIO.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });
$$('.item, .block, .post, .vzf, .doc__figure').forEach((el) => enterIO.observe(el));
// case pages: each part's text and pictures as they arrive
$$('.cs-fig, .cs-top, .cs-facts, .cs-wip__title, .cs-wip__bar').forEach((el) => enterIO.observe(el));
$$('.services, .socials, .rows, .faq, .reviews__track, .cs-facts').forEach((list) => {
  [...list.children].forEach((el, k) => el.style.setProperty('--k', k));
});

/* ---------- Reviews ----------
   A native sideways scroller with snap points, so swipe, trackpad and keyboard
   scrolling work on their own. On top: arrow buttons, a counter, and mouse
   dragging (snap is paused while dragging, then the nearest card settles). */
$$('[data-reviews]').forEach((root) => {
  const track = $('[data-reviews-track]', root);
  const cards = [...track.children];
  const prev = $('[data-reviews-prev]', root);
  const next = $('[data-reviews-next]', root);
  const index = $('[data-reviews-index]', root);
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const behavior = reduceMotion ? 'auto' : 'smooth';

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const i = track.scrollLeft >= max - 2 ? cards.length - 1 : Math.round(track.scrollLeft / step());
    index.textContent = String(i + 1).padStart(2, '0');
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  let syncTick = false;
  track.addEventListener('scroll', () => {
    if (syncTick) return;
    syncTick = true;
    requestAnimationFrame(() => { syncTick = false; sync(); });
  }, { passive: true });
  addEventListener('resize', sync);
  sync();

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior }));
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    track.scrollBy({ left: e.key === 'ArrowRight' ? step() : -step(), behavior });
  });

  // Mouse dragging (touch already scrolls natively). The row follows the
  // pointer one to one. On release, a flick or a drag past a quarter of a card
  // goes on to the next card in that direction; less than that settles back.
  // The settle is eased here with snapping still off, and snapping comes back
  // only once the row has landed — so nothing jumps.
  let drag = null;
  let settle = 0;
  let justDragged = false;
  const maxLeft = () => track.scrollWidth - track.clientWidth;
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  function stopSettle() {
    cancelAnimationFrame(settle);
    settle = 0;
    track.classList.remove('is-dragging');
  }
  function settleTo(left) {
    const from = track.scrollLeft;
    const to = clamp(left, 0, maxLeft());
    if (reduceMotion || Math.abs(to - from) < 1) { track.scrollLeft = to; stopSettle(); return; }
    const dur = clamp(Math.abs(to - from) * 1.2, 380, 720);
    const t0 = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      track.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) settle = requestAnimationFrame(frame); else stopSettle();
    };
    cancelAnimationFrame(settle);
    settle = requestAnimationFrame(frame);
  }

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('a')) return;          // a link in a card (the full review) opens, it does not drag
    cancelAnimationFrame(settle);                  // catch the row mid-settle
    settle = 0;
    drag = { x: e.clientX, left: track.scrollLeft, from: Math.round(track.scrollLeft / step()), moved: false, v: 0, lastX: e.clientX, lastT: e.timeStamp };
    track.setPointerCapture(e.pointerId);         // keep the drag even outside the row
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 4) return;
    if (!drag.moved) { drag.moved = true; track.classList.add('is-dragging'); }
    track.scrollLeft = drag.left - dx;
    const dt = e.timeStamp - drag.lastT;
    if (dt > 0) drag.v = drag.v * 0.3 + ((e.clientX - drag.lastX) / dt) * 0.7;   // px per ms, smoothed
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
  });
  const release = (e) => {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!d.moved) return;
    justDragged = true;
    setTimeout(() => { justDragged = false; }, 0);
    const s = step();
    const dx = e.clientX - d.x;
    const v = e.timeStamp - d.lastT > 90 ? 0 : d.v;   // the pointer stopped before letting go: no flick
    let dir = 0;
    if (Math.abs(v) > 0.3) dir = v < 0 ? 1 : -1;      // dragging left brings the next card
    else if (Math.abs(dx) > s * 0.25) dir = dx < 0 ? 1 : -1;
    let index = Math.round(track.scrollLeft / s);
    if (dir && index === d.from) index = d.from + dir;
    settleTo(clamp(index, 0, cards.length - 1) * s);
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  // the arrows and the keyboard scroll with snapping: stop any settle first
  [prev, next].forEach((btn) => btn.addEventListener('pointerdown', stopSettle));
  // a drag that ends over a link or text must not click it
  track.addEventListener('click', (e) => { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
});

/* ---------- Text roll ----------
   [data-roll] links and buttons carry their label twice; on hover the first
   copy rolls up and out while the second rolls in from below. */
$$('[data-roll]').forEach((el) => {
  const label = el.innerHTML.trim();            // the label as written, its inline marks included
  const roll = document.createElement('span');
  roll.className = 'roll';
  const a = document.createElement('span');
  const b = document.createElement('span');
  a.innerHTML = label;
  b.innerHTML = label;
  b.setAttribute('aria-hidden', 'true');
  roll.append(a, b);
  el.replaceChildren(roll);
});

/* ---------- Scroll progress under the bar ----------
   The current nav link is set by the build from the address (aria-current="page");
   scrolling never changes it. */
const bar = $('[data-nav]');
function markNav() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : 0);
}
let navTick = false;
addEventListener('scroll', () => {
  if (navTick) return;
  navTick = true;
  requestAnimationFrame(() => { navTick = false; markNav(); });
}, { passive: true });
markNav();

/* ---------- Local time in Bishkek ----------
   The colon keeps a slow pulse, like a clock on a desk. */
const clockFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bishkek', hour: '2-digit', minute: '2-digit' });
const clocks = $$('[data-clock]');
function tickClock() {
  const now = new Date();
  const [h, m] = clockFmt.format(now).split(':');
  clocks.forEach((t) => {
    t.dateTime = now.toISOString();
    if (t.dataset.hm === h + m) return;
    t.dataset.hm = h + m;
    const colon = document.createElement('span');
    colon.className = 'colon';
    colon.textContent = ':';
    t.replaceChildren(h, colon, m);
  });
}
tickClock();
setInterval(tickClock, 15000);

/* ---------- Copy email ----------
   The label rolls over to "Copied!" and a handful of small stars burst out of
   the button, drift and fade. */
const STAR = '<use href="#pk-mark"/>';   // the logotype star, defined once in the page
const EASE_OUT_ = 'cubic-bezier(0.16, 1, 0.3, 1)';

function rollLabel(label, text) {
  if (reduceMotion) { label.textContent = text; return; }
  label.getAnimations().forEach((an) => an.cancel());
  const out = label.animate(
    [{ translate: '0 0', opacity: 1 }, { translate: '0 -0.9em', opacity: 0 }],
    { duration: 200, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' },
  );
  out.onfinish = () => {
    label.textContent = text;
    out.cancel();
    label.animate([{ translate: '0 0.9em', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 520, easing: EASE_OUT_ });
  };
}

function burst(el) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const count = 9;
  for (let i = 0; i < count; i++) {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    star.setAttribute('viewBox', '1 0 47 48');
    star.setAttribute('class', 'spark');
    star.innerHTML = STAR;
    const size = 10 + Math.random() * 9;
    star.style.cssText = `left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px`;
    if (i % 3 === 1) star.style.fill = 'var(--mute)';
    document.body.append(star);
    // spread evenly around the label, with a little chance in each direction
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 28 + Math.random() * 26;
    const dx = Math.cos(angle) * (dist + r.width * 0.45);
    const dy = Math.sin(angle) * dist;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 160);
    // out fast, hang for a moment, then drift down and fade
    star.animate([
      { transform: 'translate(0, 0) scale(0) rotate(0deg)', opacity: 1, easing: EASE_OUT_ },
      { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(${spin * 0.7}deg)`, opacity: 1, offset: 0.4, easing: 'ease-in-out' },
      { transform: `translate(${dx * 1.08}px, ${dy + 6}px) scale(0.85) rotate(${spin * 0.85}deg)`, opacity: 1, offset: 0.7, easing: 'ease-in' },
      { transform: `translate(${dx * 1.12}px, ${dy + 18}px) scale(0) rotate(${spin}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 300, delay: i * 12, fill: 'backwards' }).onfinish = () => star.remove();
  }
}

$$('[data-copy]').forEach((btn) => {
  const label = $('[data-copy-label]', btn);
  const idle = label.textContent;
  let timer;
  label.setAttribute('aria-live', 'polite');
  btn.addEventListener('click', async () => {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      rollLabel(label, 'Copied!');
      burst(label);
    } catch {
      rollLabel(label, btn.dataset.copyFail || btn.dataset.copy);
    }
    timer = setTimeout(() => rollLabel(label, idle), 2200);
  });
});

/* ---------- FAQ ----------
   Height and opacity animate on open and close; one answer open at a time. */
const faqItems = $$('[data-faq] details');
function animateFaq(item, open) {
  const answer = $('.faq__answer', item);
  if (reduceMotion) {
    item.open = open;
    return;
  }
  answer.getAnimations().forEach((a) => a.cancel());
  item.dataset.closing = String(!open);
  if (open) item.open = true;
  const h = answer.scrollHeight;
  const anim = answer.animate(
    open ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }]
         : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
    { duration: open ? 650 : 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  );
  if (!open) anim.onfinish = () => { item.open = false; };
}
faqItems.forEach((item) => {
  $('summary', item).addEventListener('click', (e) => {
    e.preventDefault();
    const opening = !item.open || item.dataset.closing === 'true';
    faqItems.forEach((other) => { if (other !== item && other.open) animateFaq(other, false); });
    animateFaq(item, opening);
  });
});

/* ---------- Mobile menu ---------- */
const menu = $('[data-menu]');
const menuToggle = $('[data-menu-toggle]');
const main = $('#main');
// Opening: the photo fades up and settles, the cards rise one after another,
// and the page links follow inside their card. Closing plays it backwards,
// faster, the lowest card first. Either can interrupt the other.
const EASE_OUT_Q = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_IN_Q = 'cubic-bezier(0.64, 0, 0.78, 0)';
let menuOpen = false;
let menuAnims = [];
function stopMenuAnims() { menuAnims.forEach((an) => an.cancel()); menuAnims = []; }

function setMenu(open) {
  if (open === menuOpen) return;
  menuOpen = open;
  menuToggle.setAttribute('aria-expanded', String(open));
  html.classList.toggle('menu-open', open);
  main.inert = open;
  // start from wherever things are now, so a close during the opening (or the
  // other way round) reverses smoothly instead of jumping
  const bg = $('.menu__bg', menu);
  const cards = $$('.mcard', menu);
  const links = $$('.mbig li', menu);
  const parts = [menu, bg, ...cards, ...links];
  const now = new Map(parts.map((el) => { const cs = getComputedStyle(el); return [el, { opacity: +cs.opacity, transform: cs.transform === 'none' ? 'none' : cs.transform }]; }));
  const midway = menuAnims.length > 0;
  stopMenuAnims();
  if (open) {
    menu.hidden = false;
    menu.scrollTop = 0;
    $('.mbig a', menu).focus({ preventScroll: true });
  }
  if (reduceMotion) { menu.hidden = !open; return; }

  const run = (el, frames, opts) => {
    if (midway) frames = [now.get(el), frames[frames.length - 1]];   // continue from the current state
    const an = el.animate(frames, { fill: 'both', ...opts });
    menuAnims.push(an);
    return an;
  };
  if (open) {
    run(menu, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'linear' });
    run(bg, [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 900, easing: EASE_OUT_Q });
    cards.forEach((c, i) => run(c, [{ opacity: 0, transform: 'translateY(36px)' }, { opacity: 1, transform: 'none' }],
      { duration: 720, delay: 80 + i * 70, easing: EASE_OUT_Q }));
    links.forEach((l, i) => run(l, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
      { duration: 620, delay: 200 + i * 45, easing: EASE_OUT_Q }));
    // once everything has landed, drop the fills so nothing stays pinned
    const mine = menuAnims;
    Promise.all(mine.map((an) => an.finished)).then(() => { if (menuOpen && menuAnims === mine) stopMenuAnims(); }, () => {});
  } else {
    const n = cards.length;
    cards.forEach((c, i) => run(c, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(28px)' }],
      { duration: 300, delay: (n - 1 - i) * 45, easing: EASE_IN_Q }));
    run(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 120, easing: 'linear' });
    const last = run(menu, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, delay: 230, easing: 'linear' });
    last.finished.then(() => { if (!menuOpen) { menu.hidden = true; stopMenuAnims(); } }, () => {});
  }
}
menuToggle.addEventListener('click', () => setMenu(!menuOpen));
$$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { setMenu(false); menuToggle.focus(); } });
// "Ask AI about me" and "Socials (4)" open a short list inside their card
$$('[data-disclose]', menu).forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    panel.getAnimations().forEach((an) => an.cancel());
    if (open) panel.hidden = false;
    if (reduceMotion) { panel.hidden = !open; return; }
    const h = panel.scrollHeight;
    const anim = panel.animate(
      open ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }]
           : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: open ? 500 : 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
    if (!open) anim.onfinish = () => { panel.hidden = true; };
  });
});
// The toggle disappears above phone width; never leave the menu open without it.
phone.addEventListener('change', (e) => { if (!e.matches && menuOpen) setMenu(false); });

/* ---------- Case pages ----------
   Each case is its own page (/work/<slug>/). A case grows out of whatever
   opened it: the project picture (a work card, or the next case at the foot
   of a case) becomes the window a full-screen copy of it expands through,
   then the case page loads onto its full-bleed cover, which settles while the
   title rises. Without a picture on screen, the usual page transition plays. */
const EASE_IO = 'cubic-bezier(0.76, 0, 0.24, 1)';
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const insetFrom = (r) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
const onScreen = (el) => {
  const r = el && el.getBoundingClientRect();
  return r && r.width > 0 && r.bottom > 0 && r.top < innerHeight ? r : null;
};

$$('[data-case-link]').forEach((link) => link.addEventListener('click', (e) => {
  if (reduceMotion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const img = $('.item__media img', link);
  const r = img && onScreen(img.closest('.item__media'));
  if (!r) return;
  e.preventDefault();
  const layer = document.createElement('div');
  layer.className = 'case-grow';
  layer.setAttribute('aria-hidden', 'true');
  const copy = new Image();
  copy.alt = '';
  copy.src = img.currentSrc || img.src;
  copy.style.objectPosition = getComputedStyle(img).objectPosition;
  layer.append(copy);
  document.body.append(layer);
  copy.animate([{ scale: 1.25 }, { scale: 1.1 }], { duration: 1100, easing: EASE_OUT, fill: 'both' });
  layer.animate([{ clipPath: insetFrom(r) }, { clipPath: 'inset(0px 0px 0px 0px)' }], { duration: 1100, easing: EASE_IO, fill: 'both' })
    .onfinish = () => {
      try { sessionStorage.setItem('pk-grow', '1'); } catch (err) { /* the case page simply shows */ }
      location.href = link.href;
    };
}));
// back to the page the case grew out of (history cache): the picture is back in its place
addEventListener('pageshow', (e) => { if (e.persisted) $$('.case-grow').forEach((el) => el.remove()); });

// on a case page: the cover settles, then the title and its line of facts rise
const caseCover = $('main.case [data-case-cover]');
if (caseCover && !reduceMotion) {
  const grown = html.classList.contains('pt-grow');       // arrived out of a picture (js/transitions.js)
  const play = () => {
    const img = $('img', caseCover);
    if (img) img.animate([{ scale: grown ? 1.1 : 1.25 }, { scale: 1 }], { duration: 1600, easing: EASE_OUT });
    $$(':is(.case__type > *, .case__over > *)', caseCover).forEach((el, i) => el.animate(
      [{ opacity: 0, translate: '0 56px' }, { opacity: 1, translate: '0 0' }],
      { duration: 1100, delay: (grown ? 150 : 250) + i * 110, easing: EASE_OUT, fill: 'backwards' },
    ));
  };
  if (grown) play(); else window.pkRevealed.then(play);
}

/* ---------- Smooth scroll ----------
   Desktop (mouse, trackpad, keyboard). Every input moves a target and the
   scroller eases towards it with time-based damping, so it feels the same at
   60 or 120 Hz. It still drives the native scroll position: sticky columns,
   observers, anchors and the scrollbar all keep working. Touch keeps its
   native momentum. */
if (finePointer && !reduceMotion) {
  html.style.scrollBehavior = 'auto';
  const DAMPING = 8.5;                 // higher is snappier
  const page = document.scrollingElement || html;
  const st = { el: null, target: 0, current: 0 };
  let raf = 0;
  let last = 0;

  const scroller = () => page;
  const maxOf = (el) => el.scrollHeight - el.clientHeight;
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 1 / 60;
    last = now;
    st.current += (st.target - st.current) * (1 - Math.exp(-DAMPING * dt));
    if (Math.abs(st.target - st.current) < 0.25) st.current = st.target;
    st.el.scrollTop = st.current;
    raf = st.current === st.target ? 0 : requestAnimationFrame(frame);
  }
  // where a new input should add to: the running target, or where we are now
  const base = (el) => (raf && st.el === el ? st.target : el.scrollTop);
  function glide(el, y) {
    if (!raf || st.el !== el) { stop(); st.el = el; st.current = el.scrollTop; }
    st.target = clamp(y, 0, maxOf(el));
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  // the scrollbar, find-in-page or a script moved the page: let go and follow
  const follow = (el) => () => { if (raf && st.el === el && Math.abs(el.scrollTop - st.current) > 2) stop(); };
  addEventListener('scroll', follow(page), { passive: true });

  // an inner area that can itself scroll this way keeps the wheel (e.g. a long list)
  const innerTakes = (node, el, dy) => {
    for (let n = node; n && n !== el && n.nodeType === 1; n = n.parentElement) {
      const oy = getComputedStyle(n).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 1) {
        if (dy > 0 ? n.scrollTop < n.scrollHeight - n.clientHeight - 1 : n.scrollTop > 0) return true;
      }
    }
    return false;
  };

  addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.defaultPrevented || html.classList.contains('menu-open')) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;           // sideways: the reviews row
    const el = scroller();
    if (innerTakes(e.target, el, e.deltaY)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? el.clientHeight : 1;
    glide(el, base(el) + e.deltaY * unit);
  }, { passive: false });

  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || html.classList.contains('menu-open')) return;
    const t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable], [data-reviews-track]')) return;
    if (e.key === ' ' && t.closest && t.closest('button, a, summary, [role="button"]')) return;  // space presses buttons
    const el = scroller();
    const pageStep = el.clientHeight * 0.85;
    let y;
    switch (e.key) {
      case 'ArrowDown': y = base(el) + 90; break;
      case 'ArrowUp': y = base(el) - 90; break;
      case 'PageDown': y = base(el) + pageStep; break;
      case 'PageUp': y = base(el) - pageStep; break;
      case ' ': y = base(el) + (e.shiftKey ? -pageStep : pageStep); break;
      case 'Home': y = 0; break;
      case 'End': y = maxOf(el); break;
      default: return;
    }
    e.preventDefault();
    glide(el, y);
  });

  // in-page links glide too ("#top" is the top of the document, not an element)
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const toTop = a.hash === '#top';
    const target = !toTop && a.hash.length > 1 ? document.querySelector(a.hash) : null;
    if (!toTop && !target) return;
    e.preventDefault();
    const pad = parseFloat(getComputedStyle(html).scrollPaddingTop) || 0;
    glide(page, toTop ? 0 : target.getBoundingClientRect().top + page.scrollTop - pad);
    history.replaceState(null, '', a.hash);
  }));
}

/* ---------- Cursor ----------
   Mouse and trackpad only: over a project the pointer becomes a small white
   disc that says "View", over the reviews a dark one that says "Drag" (it
   gives a little while held). It follows with a little lag; nothing follows the
   pointer anywhere else. */
if (finePointer && !reduceMotion && $('[data-cursor]')) {
  const cursor = $('[data-cursor]');
  const label = $('span', cursor);
  const kinds = [['.item__link', 'View'], ['[data-reviews-track]', 'Drag']];
  const targets = kinds.flatMap(([sel, text]) => $$(sel).map((el) => { el.dataset.cursorLabel = text; return el; }));
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const cur = { ...pos };
  let running = false;
  html.classList.add('has-cursor');

  const loop = () => {
    cur.x += (pos.x - cur.x) * 0.2;
    cur.y += (pos.y - cur.y) * 0.2;
    cursor.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
    running = Math.abs(pos.x - cur.x) > 0.2 || Math.abs(pos.y - cur.y) > 0.2;
    if (running) requestAnimationFrame(loop);
  };
  const show = (on) => cursor.classList.toggle('is-on', on);

  addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    // appear where the pointer is, not where it was last seen
    if (!cursor.classList.contains('is-on')) { cur.x = pos.x; cur.y = pos.y; }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });
  targets.forEach((t) => {
    t.addEventListener('pointerenter', () => {
      label.textContent = t.dataset.cursorLabel;
      cursor.classList.toggle('is-dark', !t.matches('.item__link'));   // white page behind the reviews: a dark disc
      show(true);
    });
    t.addEventListener('pointerleave', () => { show(false); cursor.classList.remove('is-pressed'); });
    // the case page covers the project: the disc goes with it
    if (t.matches('.item__link')) t.addEventListener('click', () => show(false));
    else t.addEventListener('pointerdown', (e) => { if (e.button === 0) cursor.classList.add('is-pressed'); });
  });
  addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  // a project can scroll out from under a still pointer, and back
  addEventListener('scroll', () => {
    if (document.querySelector('dialog[open]')) return;
    show(targets.some((t) => t.matches(':hover')));
  }, { passive: true });
}

/* ---------- Process ----------
   Desktop: while the section's runway scrolls by, the section itself holds
   still (CSS sticky) and the page position becomes its progress. The row of
   steps slides with it, the phase line runs, each card comes forward as the
   progress nears it (--d, 0…1: its colour, its icon, its list fill in) and
   the nearest one is the current step. A step can be clicked (or reached with
   Tab) to scroll there.
   Phone: no hold; the steps stack, and the one in the middle of the screen
   is the current one. */
$$('[data-process]').forEach((root) => {
  const pin = $('.process__pin', root);
  const runway = $('.process__runway', root);
  const view = $('.process__view', root);
  const track = $('[data-process-track]', root);
  const steps = $$('.process__step', root);
  const now = $('[data-process-now]', root);
  const n = steps.length;
  steps.forEach((s, k) => s.style.setProperty('--k', k));
  let current = 0;

  function setCurrent(i) {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    now.textContent = String(i + 1).padStart(2, '0');
  }

  const held = () => getComputedStyle(pin).position === 'sticky';
  const stickTop = () => parseFloat(getComputedStyle(pin).top) || 0;
  const progress = () => clamp((stickTop() - root.getBoundingClientRect().top) / runway.offsetHeight);

  function update() {
    if (!held()) return;
    const p = progress();
    const travel = track.scrollWidth - view.clientWidth;
    track.style.transform = `translate3d(${(-travel * p).toFixed(1)}px, 0, 0)`;
    root.style.setProperty('--p', p.toFixed(4));
    // how current each card is, 0…1: the colour, size and content follow it
    const f = p * (n - 1);
    steps.forEach((s, k) => s.style.setProperty('--d', Math.max(0, 1 - Math.abs(f - k)).toFixed(3)));
    setCurrent(Math.round(f));
  }
  let tick = false;
  const onScroll = () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { tick = false; update(); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();

  // phone: the step in the middle of the screen
  const middle = new IntersectionObserver((entries) => {
    if (held()) return;
    for (const e of entries) if (e.isIntersecting) setCurrent(steps.indexOf(e.target));
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => middle.observe(s));
  phone.addEventListener('change', () => {
    track.style.transform = '';
    steps.forEach((s) => s.style.removeProperty('--d'));     // the phone rows follow .is-active
    update();
  });

  // a step, clicked or tabbed to, brings the page to where it is current
  $$('[data-process-step]', root).forEach((btn, i) => {
    const go = (behavior) => {
      if (!held()) { setCurrent(i); return; }
      const y = scrollY + root.getBoundingClientRect().top - stickTop() + (runway.offsetHeight * i) / (n - 1);
      scrollTo({ top: y, behavior });
    };
    btn.addEventListener('click', () => go(reduceMotion ? 'auto' : 'smooth'));
    btn.addEventListener('focus', () => { if (!btn.matches(':hover')) go('auto'); });
  });
});

/* ---------- Arcade ----------
   The invader in the footer opens Invader, a small hidden 8-bit game. Its
   code and styles (js/game/, css/game.css) load on the first click; until
   then the portfolio carries none of it, and nothing of it runs. */
$$('[data-game]').forEach((btn) => btn.addEventListener('click', () => {
  import('./game/index.js').then((m) => m.openGame(btn)).catch(() => {});
}));
