/* A 5×7 arcade bitmap font, drawn pixel by pixel on the game canvas. No font
   file to download, and the letters sit on exactly the same pixel grid as the
   sprites. Each glyph is seven rows of five; "#" is a lit pixel. */

const G = {
  A: '.###. #...# #...# ##### #...# #...# #...#',
  B: '####. #...# #...# ####. #...# #...# ####.',
  C: '.###. #...# #.... #.... #.... #...# .###.',
  D: '####. #...# #...# #...# #...# #...# ####.',
  E: '##### #.... #.... ####. #.... #.... #####',
  F: '##### #.... #.... ####. #.... #.... #....',
  G: '.###. #...# #.... #.### #...# #...# .####',
  H: '#...# #...# #...# ##### #...# #...# #...#',
  I: '.###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.',
  J: '..### ...#. ...#. ...#. ...#. #..#. .##..',
  K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#',
  L: '#.... #.... #.... #.... #.... #.... #####',
  M: '#...# ##.## #.#.# #.#.# #...# #...# #...#',
  N: '#...# #...# ##..# #.#.# #..## #...# #...#',
  O: '.###. #...# #...# #...# #...# #...# .###.',
  P: '####. #...# #...# ####. #.... #.... #....',
  Q: '.###. #...# #...# #...# #.#.# #..#. .##.#',
  R: '####. #...# #...# ####. #.#.. #..#. #...#',
  S: '.#### #.... #.... .###. ....# ....# ####.',
  T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..',
  U: '#...# #...# #...# #...# #...# #...# .###.',
  V: '#...# #...# #...# #...# #...# .#.#. ..#..',
  W: '#...# #...# #...# #.#.# #.#.# #.#.# .#.#.',
  X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
  Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..',
  Z: '##### ....# ...#. ..#.. .#... #.... #####',
  0: '.###. #...# #..## #.#.# ##..# #...# .###.',
  1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.',
  2: '.###. #...# ....# ...#. ..#.. .#... #####',
  3: '##### ...#. ..#.. ...#. ....# #...# .###.',
  4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.',
  5: '##### #.... ####. ....# ....# #...# .###.',
  6: '..##. .#... #.... ####. #...# #...# .###.',
  7: '##### ....# ...#. ..#.. .#... .#... .#...',
  8: '.###. #...# #...# .###. #...# #...# .###.',
  9: '.###. #...# #...# .#### ....# ...#. .##..',
  '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....',
  '-': '..... ..... ..... ##### ..... ..... .....',
  x: '..... ..... #...# .#.#. ..#.. .#.#. #...#',
  '.': '..... ..... ..... ..... ..... ..... ..#..',
  ',': '..... ..... ..... ..... ..#.. ..#.. .#...',
  '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.',
  ':': '..... ..#.. ..... ..... ..... ..#.. .....',
  '/': '....# ....# ...#. ..#.. .#... #.... #....',
  '!': '..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..',
  '?': '.###. #...# ....# ...#. ..#.. ..... ..#..',
  ' ': '..... ..... ..... ..... ..... ..... .....',
};
for (const k of Object.keys(G)) G[k] = G[k].replace(/ /g, '');

export const GLYPH_W = 5;
export const GLYPH_H = 7;
const ADVANCE = 6;


const cache = new Map();   // colour → canvas strip of every glyph
const ORDER = Object.keys(G);

function strip(color) {
  let c = cache.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = ORDER.length * GLYPH_W;
  c.height = GLYPH_H;
  const g = c.getContext('2d');
  g.fillStyle = color;
  ORDER.forEach((ch, i) => {
    const bits = G[ch];
    for (let p = 0; p < 35; p++) if (bits[p] === '#') g.fillRect(i * GLYPH_W + (p % 5), (p / 5) | 0, 1, 1);
  });
  cache.set(color, c);
  return c;
}

export const textWidth = (text, size = 1) => (text.length ? text.length * ADVANCE - 1 : 0) * size;

/* Draw text with its top-left corner at x, y (or centred on x with
   align "center", ending at x with "right"). size is a whole-pixel multiple. */
export function drawText(ctx, text, x, y, { color = '#fff', size = 1, align = 'left', chars = Infinity } = {}) {
  const s = strip(color);
  const w = textWidth(text, size);
  let cx = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  y = Math.round(y);
  const n = Math.min(text.length, chars);
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    const idx = ORDER.indexOf(G[ch] ? ch : ch.toUpperCase());
    if (idx > -1 && ch !== ' ') ctx.drawImage(s, idx * GLYPH_W, 0, GLYPH_W, GLYPH_H, cx, y, GLYPH_W * size, GLYPH_H * size);
    cx += ADVANCE * size;
  }
  return w;
}

/* The largest whole-pixel size (up to max) at which text fits a width. */
export const fitSize = (text, width, max) => Math.max(1, Math.min(max, Math.floor(width / Math.max(1, textWidth(text)))));

/* The same letters as inline SVG, for real buttons and headings outside the
   canvas: one rect run per lit row segment, drawn on the game's pixel grid. */
export function textSvg(text) {
  let d = '';
  [...text].forEach((ch, i) => {
    const bits = G[ch] || G[ch.toUpperCase()];
    if (!bits) return;
    for (let y = 0; y < GLYPH_H; y++) {
      const row = bits.slice(y * GLYPH_W, y * GLYPH_W + GLYPH_W);
      row.replace(/#+/g, (run, x) => { d += `M${i * ADVANCE + x} ${y}h${run.length}v1h-${run.length}z`; return run; });
    }
  });
  const w = textWidth(text);
  return { w, h: GLYPH_H, svg: `<svg viewBox="0 0 ${w} ${GLYPH_H}" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><path d="${d}"/></svg>` };
}
