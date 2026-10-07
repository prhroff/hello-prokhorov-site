/* Pixel sprites. Each is a list of rows; every character is one game pixel,
   "." is empty and any other letter is a colour from the key passed to bake().
   Baked once into small canvases, so drawing a sprite is one drawImage. */

import { COLORS } from './config.js';

/* The invader from assets/img/invader.svg. The asset is drawn on a 22×16
   grid of 2-unit blocks, which is the classic 11×8 crab; frame B is its
   arms-up twin (assets/img/invader-mono-2.svg). */
const CRAB_A = [
  '..#.....#..',
  '...#...#...',
  '..#######..',
  '.##.###.##.',
  '###########',
  '#.#######.#',
  '#.#.....#.#',
  '...##.##...',
];
const CRAB_B = [
  '..#.....#..',
  '#..#...#..#',
  '#.#######.#',
  '###.###.###',
  '###########',
  '.#########.',
  '..#.....#..',
  '.#.......#.',
];

/* Fast invader: the same crab pressed into 9×7, eyes narrowed. */
const SCOUT_A = [
  '.#.....#.',
  '..#####..',
  '.##.#.##.',
  '#########',
  '#.#####.#',
  '#.#...#.#',
  '...#.#...',
];
const SCOUT_B = [
  '.#.....#.',
  '#.#####.#',
  '###.#.###',
  '#########',
  '.#######.',
  '..#...#..',
  '.#.....#.',
];

/* Sine invader: the crab with its antennae up, so it reads as different
   without relying on colour. */
const WAVER_A = [
  '.#.......#.',
  '..#.....#..',
  '..#######..',
  '.##.###.##.',
  '###########',
  '#.#######.#',
  '#.#.....#.#',
  '...##.##...',
];
const WAVER_B = [
  '#.........#',
  '.#.......#.',
  '#.#######.#',
  '###.###.###',
  '###########',
  '.#########.',
  '..#.....#..',
  '.#.......#.',
];

const up = (rows) => rows.flatMap((r) => { const w = r.replace(/./g, (c) => c + c); return [w, w]; });

/* Heavy invader: the asset at its full 22×16 resolution. */
const HEAVY_A = up(CRAB_A);
const HEAVY_B = up(CRAB_B);

/* Dents for a heavy invader that has been hit: pixels knocked out of it. */
const dent = (rows, holes) => rows.map((r, y) => [...r].map((c, x) => (holes.some(([hx, hy]) => hx === x && hy === y) ? '.' : c)).join(''));
const DENTS_1 = [[8, 9], [9, 9], [14, 4], [15, 5], [3, 8], [18, 11]];
const DENTS_2 = [...DENTS_1, [6, 4], [7, 5], [12, 9], [13, 8], [1, 9], [20, 8], [10, 4], [16, 9]];

/* The player: a little propeller plane, facing right. Tail fin, canopy,
   wing and spinner; the blade turns over three frames.
   w white · m grey · a warm accent (canopy) · p propeller */
const PLANE = [
  'w...............',
  'ww..............',
  'www......maa....',
  'wwwwwwwwwaaaw...',
  '.wwwwwwwwwwwwww.',
  'mmwwwwwwwwwwww..',
  '.....mmmmmm.....',
  '......mmmm......',
];
const PROPS = [
  [0, 1, 2, 3, 5, 6, 7],   // blade upright (the spinner sits in the middle)
  [3, 5],                  // edge-on
  [1, 2, 6, 7],            // turning
];
const planeFrame = (rows) => (cells) => rows.map((r, y) => (cells.includes(y) ? r.slice(0, 15) + 'p' : r));

/* Engine glow under the cowling: two flickering frames */
export const EXHAUST = [[[12, 5]], [[11, 5], [12, 5]]];

const HEART = [
  '.##.##.',
  '#######',
  '#######',
  '.#####.',
  '..###..',
  '...#...',
];
const HEART_EMPTY = [
  '.##.##.',
  '#..#..#',
  '#.....#',
  '.#...#.',
  '..#.#..',
  '...#...',
];

/* The footer button icons share the 7×7 pixel grid. */
export const ICONS = {
  close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
  pause: ['.......', '.##.##.', '.##.##.', '.##.##.', '.##.##.', '.##.##.', '.......'],
  play: ['.#.....', '.##....', '.###...', '.####..', '.###...', '.##....', '.#.....'],
  soundOn: ['...#...', '..##.#.', '####..#', '####..#', '####..#', '..##.#.', '...#...'],
  soundOff: ['...#...', '..##...', '####.#.', '####..#', '####.#.', '..##...', '...#...'],
};

function bake(rows, key) {
  const c = document.createElement('canvas');
  c.width = Math.max(...rows.map((r) => r.length));
  c.height = rows.length;
  const g = c.getContext('2d');
  rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === '.' || !key[ch]) return;
    g.fillStyle = key[ch];
    g.fillRect(x, y, 1, 1);
  }));
  return c;
}

/* The lit pixels of a sprite, for breaking it into particles. */
export const pixelsOf = (rows, key) => rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch !== '.' && key[ch] ? [{ x, y, color: key[ch] }] : [])));

const one = (color) => ({ '#': color });

export function makeSprites() {
  const plane = { w: COLORS.white, m: COLORS.mute, a: COLORS.warm, p: COLORS.white };
  const planeWhite = { w: COLORS.white, m: COLORS.white, a: COLORS.white, p: COLORS.white };
  const planeFrames = PROPS.map((p) => planeFrame(PLANE)(p));
  const pair = (a, b, color) => [bake(a, one(color)), bake(b, one(color))];

  return {
    plane: planeFrames.map((f) => bake(f, plane)),
    planeFlash: planeFrames.map((f) => bake(f, planeWhite)),
    planeHurt: planeFrames.map((f) => bake(f, { ...plane, w: COLORS.warm })),
    planePixels: pixelsOf(planeFrames[0], plane),
    enemies: {
      basic: { frames: pair(CRAB_A, CRAB_B, COLORS.green), flash: pair(CRAB_A, CRAB_B, COLORS.white) },
      fast: { frames: pair(SCOUT_A, SCOUT_B, COLORS.green), flash: pair(SCOUT_A, SCOUT_B, COLORS.white) },
      sine: { frames: pair(WAVER_A, WAVER_B, COLORS.green), flash: pair(WAVER_A, WAVER_B, COLORS.white) },
      heavy: {
        frames: pair(HEAVY_A, HEAVY_B, COLORS.green),
        flash: pair(HEAVY_A, HEAVY_B, COLORS.white),
        // index by hits taken: whole, dented, battered
        damaged: [
          pair(HEAVY_A, HEAVY_B, COLORS.green),
          pair(dent(HEAVY_A, DENTS_1), dent(HEAVY_B, DENTS_1), COLORS.green),
          pair(dent(HEAVY_A, DENTS_2), dent(HEAVY_B, DENTS_2), COLORS.green),
        ],
      },
    },
    title: pair(CRAB_A, CRAB_B, COLORS.green),
    heart: bake(HEART, one(COLORS.warm)),
    heartEmpty: bake(HEART_EMPTY, one(COLORS.dim)),
  };
}

/* An icon as inline SVG markup, one rect per pixel row run. */
export function iconSvg(rows) {
  let d = '';
  rows.forEach((r, y) => r.replace(/#+/g, (run, x) => { d += `M${x} ${y}h${run.length}v1h-${run.length}z`; return run; }));
  return `<svg viewBox="0 0 7 7" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}
