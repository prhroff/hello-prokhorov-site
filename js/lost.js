/* 404 — the Archive's pictures in one endless column. No dependencies.

   · The pictures are the Archive's own (js/archive/items.js, in its order),
     each in its own shape: portrait, landscape or square, all of about the
     same area. Add work to the Archive and it shows here too.
   · Moving: wheel or trackpad, a drag, or the arrow keys. The column glides
     after the input and settles with a picture in the middle; that picture
     grows a little, its category, title and number roll into their lines
     each side. Left alone, it moves on by one every few seconds.
   · On the left, one stripe per picture: the current one the longest, its
     neighbours shorter, the rest short, and the further from it the paler.
     The column stands still in the middle of the left edge; the current
     stripe moves down it. Hovering a stripe brings its picture.
   · Light: a picture loads only when it comes near the screen.
   · A click on any picture but the middle one brings it to the middle. */

import { ARCHIVE_ITEMS } from './archive/items.js';

const root = document.querySelector('[data-lost]');

/* The local time in the bar, in Bishkek, as on the rest of the site. */
function clock() {
  const el = document.querySelector('[data-lost-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bishkek', hour: '2-digit', minute: '2-digit' });
  const tick = () => { const now = new Date(); el.dateTime = now.toISOString(); el.textContent = fmt.format(now); };
  tick();
  setInterval(tick, 15000);
}

const IMG = '/assets/img/';
const SHAPE = [0.56, 1.6];   // height / width kept to this range; the rest is cropped

/* An Archive entry as a picture: its sources, and its shape */
function describe(item, manifest) {
  if (item.img) {
    const m = manifest[item.img];
    if (!m) return null;
    const base = `${IMG}${item.img}`;
    const set = (ext) => m.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
    return { ...item, r: m.ratio, avif: set('avif'), webp: set('webp'), src: `${base}-${m.widths[0]}.webp` };
  }
  if (item.src && item.w && item.h) return { ...item, r: item.h / item.w, src: item.src };
  return null;
}

async function start() {
  const reel = root.querySelector('[data-lost-reel]');
  const ticksBox = root.querySelector('[data-lost-ticks]');
  const kind = root.querySelector('[data-lost-kind]');
  const type = root.querySelector('[data-lost-type]');
  const num = root.querySelector('[data-lost-num]');

  let manifest = {};
  try { manifest = await (await fetch(`${IMG}manifest.json`)).json(); } catch { /* only src items will show */ }
  const items = ARCHIVE_ITEMS.map((it) => describe(it, manifest)).filter(Boolean);
  const n = items.length;
  if (!n) return;

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 0.09;          // how quickly the column follows (per 60 Hz frame)
  const AUTO = 3800;          // ms left alone before it moves on by one
  const NEAR = 1.5;           // pictures load within this many screens of the middle
  const mod = (a, b) => ((a % b) + b) % b;

  /* --- the cards: empty frames in their shape until they come near --- */
  const shaped = (it) => {
    const card = document.createElement('div');
    card.className = 'lost-card';
    const r = Math.min(SHAPE[1], Math.max(SHAPE[0], it.r));
    card.style.setProperty('--r', r.toFixed(3));
    card.style.setProperty('--k', (1 / Math.sqrt(r)).toFixed(3));
    card.item = it;
    reel.append(card);
    return card;
  };
  const originals = items.map(shaped);
  function fill(card) {
    if (card.filled) return;
    card.filled = true;
    const it = card.item;
    const pic = document.createElement('picture');
    const sizes = '(min-width: 768px) 26vw, 84vw';
    if (it.avif) {
      for (const [mime, srcset] of [['image/avif', it.avif], ['image/webp', it.webp]]) {
        const s = document.createElement('source');
        Object.assign(s, { type: mime, srcset, sizes });
        pic.append(s);
      }
    }
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.onload = () => card.classList.add('is-loaded');
    img.src = it.src;
    pic.append(img);
    card.append(pic);
  }

  /* --- the stripes, one per picture --- */
  const ticks = items.map((_, i) => {
    const t = document.createElement('span');
    t.className = 'lost-tick';
    t.addEventListener('pointerenter', () => goTo(i));
    ticksBox.append(t);
    return t;
  });

  reel.classList.add('is-live');

  /* The cards differ in shape, so each has its own place on the loop: mid[k]
     is its centre, loop the whole length. pos is the point of the loop at the
     middle of the screen. */
  const cards = originals.slice();
  let mid = [], tall = [], loop = 0, gap = 0, grow = 1.15;
  let pos = 0, target = 0, last = performance.now(), touched = performance.now();
  let current = -1;

  function measure() {
    const css = getComputedStyle(document.documentElement);
    grow = parseFloat(css.getPropertyValue('--grow')) || 1.15;
    gap = originals[0].offsetWidth * Math.sqrt(parseFloat(originals[0].style.getPropertyValue('--r'))) * 0.12;
    const set = originals.map((c) => c.offsetHeight);
    const setLength = set.reduce((a, h) => a + h + gap, 0);
    // enough copies that the loop is longer than two screens
    while (cards.length / n * setLength < reel.clientHeight * 2) items.forEach((it) => cards.push(shaped(it)));
    tall = cards.map((_, k) => set[k % n]);
    mid = [];
    let y = 0;
    tall.forEach((h, k) => { if (k) y += tall[k - 1] / 2 + gap + h / 2; mid.push(y); });
    loop = y + tall.at(-1) / 2 + gap + tall[0] / 2;
  }

  const offset = (k, at = pos) => mod(mid[k] - at + loop / 2, loop) - loop / 2;   // card k from the middle
  function nearest(at) {
    let best = 0;
    cards.forEach((_, k) => { if (Math.abs(offset(k, at)) < Math.abs(offset(best, at))) best = k; });
    return best;
  }

  function render() {
    const reach = reel.clientHeight * NEAR;
    cards.forEach((card, k) => {
      const y = offset(k);
      if (Math.abs(y) > reach) { card.style.visibility = 'hidden'; return; }
      card.style.visibility = '';
      fill(card);
      const near = Math.max(0, 1 - Math.abs(y) / (tall[k] / 2 + gap));
      card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${(1 + (grow - 1) * near).toFixed(4)})`;
      card.style.zIndex = near > 0.5 ? 1 : 0;
    });
    const i = nearest(pos) % n;
    if (i !== current) show(i);
  }

  /* A label changes as on the reference: the new one rolls up into its line,
     the old one rolls out above it. */
  let first = true;
  function roll(el, text) {
    const old = el.querySelector('.lost-roll:not(.is-out)');
    if (old && old.textContent === text) return;
    if (old) {
      if (still.matches) old.remove();
      else { old.classList.add('is-out'); old.addEventListener('animationend', () => old.remove(), { once: true }); }
    }
    const span = document.createElement('span');
    span.className = first ? 'lost-roll' : 'lost-roll is-next';
    span.textContent = text;
    el.append(span);
  }

  function show(i) {
    current = i;
    const it = items[i];
    // the further from the current stripe, the shorter and the paler, down to a floor
    ticks.forEach((t, k) => {
      const d = Math.abs(k - i);
      t.dataset.d = d < 3 ? d : 'far';
      t.style.setProperty('--o', Math.max(0.15, 1 - d * 0.09).toFixed(2));
    });
    roll(kind, it.category || '');
    roll(type, it.title || '');
    roll(num, String(i + 1).padStart(2, '0'));
    first = false;
  }

  // the shortest way round the loop to picture i
  function goTo(i) {
    let best = null;
    cards.forEach((_, k) => { if (k % n === i && (best === null || Math.abs(offset(k)) < Math.abs(offset(best)))) best = k; });
    target = pos + offset(best);
    touched = performance.now();
  }
  const snap = () => { target += offset(nearest(target), target); };
  function by(step) {   // one picture on (or back) from where the column is heading
    snap();
    const k = mod(nearest(target) + step, cards.length);
    target += offset(k, target);
    touched = performance.now();
  }

  let dragging = false;
  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;
    if (!dragging && !still.matches && !document.hidden && now - touched > AUTO) by(1);
    const k = still.matches ? 1 : 1 - Math.pow(1 - (dragging ? 0.35 : EASE), dt / 16.67);
    pos += (target - pos) * k;
    if (Math.abs(target - pos) < 0.05) pos = target;
    render();
    requestAnimationFrame(frame);
  }

  /* --- wheel and trackpad: follow, then settle on the nearest picture --- */
  let settle = 0;
  addEventListener('wheel', (ev) => {
    ev.preventDefault();
    const d = ev.deltaMode === 1 ? ev.deltaY * 32 : ev.deltaMode === 2 ? ev.deltaY * innerHeight : ev.deltaY;
    target += d;
    touched = performance.now();
    clearTimeout(settle);
    settle = setTimeout(snap, 140);
  }, { passive: false });

  /* --- drag (touch or mouse): the column follows the finger, coasts a little, settles --- */
  let startY = 0, startT = 0, moved = 0, lastY = 0, lastT = 0, speed = 0;
  reel.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    dragging = true; moved = 0;
    startY = lastY = ev.clientY; startT = target; lastT = performance.now(); speed = 0;
    reel.setPointerCapture(ev.pointerId);
  });
  reel.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const now = performance.now();
    speed = (lastY - ev.clientY) / Math.max(1, now - lastT);
    lastY = ev.clientY; lastT = now;
    moved = Math.max(moved, Math.abs(ev.clientY - startY));
    if (moved > 6) reel.classList.add('is-dragging');
    target = startT + (startY - ev.clientY);
    touched = now;
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    reel.classList.remove('is-dragging');
    target += speed * 180;   // the release velocity, carried on a little
    snap();
    touched = performance.now();
  };
  reel.addEventListener('pointerup', release);
  reel.addEventListener('pointercancel', release);

  /* --- a click on a picture away from the middle brings it there --- */
  reel.addEventListener('click', (ev) => {
    const card = ev.target.closest('.lost-card');
    if (!card || moved > 6) return;
    const k = cards.indexOf(card);
    const y = offset(k);
    if (Math.abs(y) > tall[k] / 2) {
      target = pos + y;
      touched = performance.now();
    }
  });

  /* --- keys --- */
  addEventListener('keydown', (ev) => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const step = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 }[ev.key];
    if (!step) return;
    ev.preventDefault();
    by(step);
  });

  addEventListener('resize', () => {
    const k = nearest(pos);
    measure();
    pos = target = mid[k];
    current = -1;
  });

  measure();
  render();
  requestAnimationFrame(frame);
}

if (root) start();
clock();
