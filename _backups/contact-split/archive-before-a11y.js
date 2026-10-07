/* The Archive — an endless canvas of pinned-up cards. No dependencies.

   · items.js holds the collection; this file lays it out and moves it.
   · Layout: a pattern of cells, eight columns wide, filled column by column
     in the authored order. Each cell holds one card (the image, its caption
     under it, four small handles at its corners) at a seeded place and a
     slight seeded tilt, and each column sits a seeded distance lower than
     its neighbour, so the field looks loosely pinned up but is the same on
     every visit. The pattern repeats in every direction: the canvas never
     ends.
   · Moving: drag, wheel or trackpad (both axes), or the arrow keys. The
     canvas glides after the pointer and coasts a little when let go, and
     the cards lean with the movement and settle back when it stops.
   · Light: only the cells on and near the screen exist; the rest are made
     when they come close and dropped when they leave.
   · A click opens the viewer, which moves through the whole collection. */

import { ARCHIVE_ITEMS } from './items.js';
import { createViewer } from './viewer.js';

const html = document.documentElement;
html.classList.replace('no-js', 'js');
const root = document.querySelector('[data-archive]');
const world = root.querySelector('[data-archive-world]');
const status = document.querySelector('[data-archive-status]');

const COLS = 8;            // columns in the repeating pattern
const CARD = 0.62;         // a card's width, as a share of its cell
const TALLEST = 1.3;       // height / width; taller pieces are cropped
const CAPTION = 34;        // room under each image for its caption
const EASE = 0.1;          // how quickly the canvas follows (per 60 Hz frame)
const EASE_DRAG = 0.3;
const COAST = 260;         // ms of the release velocity carried on
const LEAN = 0.22;         // degrees of lean per px/frame of sideways speed
const LEAN_MAX = 6;

const still = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- the collection ---------- */
const IMG = '/assets/img/';

function describe(item, manifest) {
  if (item.img) {
    const m = manifest[item.img];
    if (!m) return null;
    const base = `${IMG}${item.img}`;
    const set = (ext) => m.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
    return {
      ...item, ar: 1 / m.ratio,
      sources: [{ type: 'image/avif', srcset: set('avif') }, { type: 'image/webp', srcset: set('webp') }],
      src: `${base}-${m.widths[0]}.webp`,
      full: `${base}-${m.widths.at(-1)}.webp`,
    };
  }
  if (item.src && item.w && item.h) return { ...item, ar: item.w / item.h, sources: [], src: item.src, full: item.src };
  return null;
}

function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mod = (a, n) => ((a % n) + n) % n;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- the page ---------- */
async function start() {
  let manifest = {};
  try { manifest = await (await fetch(`${IMG}manifest.json`)).json(); } catch { /* only src items will show */ }
  const items = ARCHIVE_ITEMS.map((it) => describe(it, manifest)).filter(Boolean);
  if (!items.length) { status.textContent = 'The archive is empty for now.'; return; }
  status.textContent = `${items.length} images. Drag, scroll or use the arrow keys to move around.`;

  /* --- the pattern: column by column, each cell's place and tilt seeded --- */
  const rows = Math.ceil(items.length / COLS);
  const rand = seeded(23);
  const drop = Array.from({ length: COLS }, () => rand());          // each column's offset
  const cells = Array.from({ length: COLS * rows }, (_, c) => (
    { k: c < items.length ? c : -1, fx: rand(), fy: rand(), size: 0.9 + rand() * 0.2, r: (rand() * 2 - 1) * 3 }
  ));
  const cellAt = (i, j) => cells[mod(i, COLS) * rows + mod(j, rows)];

  /* --- measures --- */
  let L;
  function measure() {
    const W = root.clientWidth;
    const H = root.clientHeight;
    const cw = W < 768 ? W * 0.78 : clamp(W / 4.2, 280, 420);
    return { W, H, cw, ch: Math.round(cw * 1.45) };
  }
  L = measure();

  // a card's box on the canvas, from its cell
  function box(i, j, cell) {
    const it = items[cell.k];
    const w = L.cw * CARD * cell.size;
    const ih = w * Math.min(1 / it.ar, TALLEST);
    const h = ih + CAPTION;
    const x = i * L.cw + cell.fx * (L.cw - w);
    const y = j * L.ch + drop[mod(i, COLS)] * L.ch * 0.5 + cell.fy * Math.max(0, L.ch - h - 72);   // at least 72px of air to the card below
    return { x, y, w, h, ih };
  }

  // where the canvas is (x, y) and where it is headed (tx, ty)
  let x = L.cw * 0.18, y = 24;
  let tx = x, ty = y;
  let lean = 0;

  /* --- cards: only the cells on and near the screen exist --- */
  const cards = new Map();     // "i,j" → element

  function makeCard(i, j, cell) {
    const it = items[cell.k];
    const b = box(i, j, cell);
    const a = document.createElement('a');
    a.className = 'ar-card';
    a.href = it.full;
    a.tabIndex = -1;
    a.draggable = false;
    a.dataset.k = cell.k;
    a._i = i; a._j = j; a._b = b;
    a.setAttribute('aria-label', it.alt);
    a.style.cssText = `left:${b.x.toFixed(1)}px;top:${b.y.toFixed(1)}px;width:${b.w.toFixed(1)}px;--ih:${b.ih.toFixed(1)}px;--r:${cell.r.toFixed(2)}deg`;
    const caption = [it.title, it.category].filter(Boolean).join(' - ');
    const sizes = `${Math.ceil(b.w)}px`;
    const sources = it.sources.map((s) => `<source type="${s.type}" srcset="${s.srcset}" sizes="${sizes}">`).join('');
    a.innerHTML = `<span class="ar-card__sel" aria-hidden="true"></span>`
      + `<span class="ar-card__frame"><picture>${sources}<img src="${it.src}" alt="" decoding="async" draggable="false"></picture></span>`
      + (caption ? `<span class="ar-card__cap" aria-hidden="true">${caption}</span>` : '');
    const img = a.querySelector('img');
    const done = () => a.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) done(); else img.addEventListener('load', done, { once: true });
    return a;
  }

  // cards stay in reading order in the document, so Tab walks them row by row
  const after = (a, i, j) => a._j > j || (a._j === j && a._i > i);
  function insert(el) {
    const next = [...world.children].find((c) => after(c, el._i, el._j));
    world.insertBefore(el, next || null);
  }

  let range = '';
  function sync() {
    const i0 = Math.floor(-x / L.cw) - 1, i1 = Math.floor((L.W - x) / L.cw) + 1;
    const j0 = Math.floor(-y / L.ch) - 2, j1 = Math.floor((L.H - y) / L.ch) + 1;
    const key = `${i0},${i1},${j0},${j1}`;
    if (key === range) return;
    range = key;
    const keep = new Set();
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const cell = cellAt(i, j);
        if (cell.k < 0) continue;
        const id = `${i},${j}`;
        keep.add(id);
        if (!cards.has(id)) { const el = makeCard(i, j, cell); cards.set(id, el); insert(el); }
      }
    }
    for (const [id, el] of cards) {
      if (keep.has(id) || el === document.activeElement) continue;
      el.remove();
      cards.delete(id);
    }
  }

  function paint() {
    world.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    world.style.setProperty('--lean', `${lean.toFixed(2)}deg`);
    sync();
  }

  // once the canvas is still: only the cards wholly on screen take Tab
  function settle() {
    for (const el of cards.values()) {
      const { x: bx, y: by, w, h } = el._b;
      const l = bx + x, t = by + y;
      el.tabIndex = l >= 0 && t >= 0 && l + w <= L.W && t + h <= L.H ? 0 : -1;
    }
  }

  /* --- motion --- */
  let raf = 0, last = 0;
  let drag = null;
  function tick(now) {
    const dt = last ? Math.min(64, now - last) : 16.67;
    last = now;
    const f = dt / 16.67;
    const e = still.matches ? 1 : 1 - Math.pow(1 - (drag?.moved ? EASE_DRAG : EASE), f);
    const px = x;
    x += (tx - x) * e;
    y += (ty - y) * e;
    if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) { x = tx; y = ty; }
    // the cards lean with the sideways speed and come back upright
    const want = still.matches ? 0 : clamp(((x - px) / f) * LEAN, -LEAN_MAX, LEAN_MAX);
    lean += (want - lean) * (1 - Math.pow(0.85, f));
    if (Math.abs(lean) < 0.02 && !want) lean = 0;
    paint();
    if (x !== tx || y !== ty || lean || drag?.moved) raf = requestAnimationFrame(tick);
    else { raf = 0; last = 0; settle(); }
  }
  function go() { if (!raf) raf = requestAnimationFrame(tick); }
  function moveBy(dx, dy) { tx += dx; ty += dy; go(); }

  paint();
  settle();

  // wheel and trackpad, anywhere on the page
  addEventListener('wheel', (e) => {
    if (e.ctrlKey || viewer.isOpen) return;   // pinch-zoom stays the browser's
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? L.H : 1;
    let dx = e.deltaX * unit, dy = e.deltaY * unit;
    if (e.shiftKey && !dx) { dx = dy; dy = 0; }
    moveBy(-dx, -dy);
  }, { passive: false });

  // drag: a press only becomes a drag once it travels, so a click still opens
  let dragged = false;
  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragged = false;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, tx0: tx, ty0: ty, moved: false, trail: [] };
  });
  root.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      drag.moved = true;
      root.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
    }
    tx = drag.tx0 + dx;
    ty = drag.ty0 + dy;
    drag.trail.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    while (drag.trail.length > 2 && e.timeStamp - drag.trail[0].t > 100) drag.trail.shift();
    go();
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { moved, trail } = drag;
    drag = null;
    if (!moved) return;
    dragged = true;
    root.classList.remove('is-dragging');
    const a = trail[0], b = trail.at(-1);
    if (a && b && b.t > a.t && e.timeStamp - b.t < 80 && !still.matches) {
      moveBy(((b.x - a.x) / (b.t - a.t)) * COAST, ((b.y - a.y) / (b.t - a.t)) * COAST);
    }
    go();
  }
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // the arrow keys move the canvas a cell at a time
  root.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: [L.cw, 0], ArrowRight: [-L.cw, 0], ArrowUp: [0, L.ch], ArrowDown: [0, -L.ch] }[e.key];
    if (!step || e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    moveBy(...step);
  });

  /* --- the viewer: the whole collection in order, round and round --- */
  const viewer = createViewer({
    source(i) {
      const k = mod(i, items.length);
      const img = world.querySelector(`.ar-card.is-loaded[data-k="${k}"] img`);
      return { ...items[k], low: img?.currentSrc || '' };
    },
    more() {},
    count: items.length,
  });
  root.addEventListener('click', (e) => {
    if (dragged) { e.preventDefault(); dragged = false; return; }
    const card = e.target.closest('.ar-card');
    if (!card || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;   // new tab: the image file
    e.preventDefault();
    viewer.open(+card.dataset.k, card);
  });

  /* --- a new size keeps the same place on the canvas --- */
  let resizeRaf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const next = measure();
      if (next.W === L.W && next.H === L.H) return;
      const u = tx / L.cw, v = ty / L.ch;
      const resized = next.cw !== L.cw;
      L = next;
      x = tx = u * L.cw;
      y = ty = v * L.ch;
      if (resized) { cards.forEach((el) => el.remove()); cards.clear(); }
      range = '';
      paint();
      settle();
    });
  }).observe(root);
}

/* ---------- the way back ----------
   If the visitor came here from the site, "Back" is the browser's back: the
   portfolio returns exactly where it was. Opened directly, it is a link home. */
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-back-to-site]');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  let from = null;
  try { from = document.referrer ? new URL(document.referrer) : null; } catch { /* no referrer */ }
  if (from && from.origin === location.origin && !from.pathname.startsWith('/archive') && history.length > 1) {
    e.preventDefault();
    (window.pkLeave || ((go) => go()))(() => history.back());   // through the colour sheets
  }
});

start();
