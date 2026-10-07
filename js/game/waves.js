/* Waves and formations. A wave is planned up front as a short list of groups;
   each group is a formation that enters from the right edge after a delay.
   Formations are fixed shapes (no random scatter), small enough that there is
   always open space above or below them, and kinds of invader are introduced
   one at a time as the waves go on. */

import { reach } from './enemies.js';

const UX = 16;   // horizontal step between members, game pixels
const UY = 14;   // vertical step

/* [dx, dy] in steps. The first member leads. */
const FORMATIONS = {
  single: { from: 1, cells: [[0, 0]] },
  pair: { from: 1, cells: [[0, -1], [0, 1]] },
  diagonal: { from: 2, cells: [[0, -1], [1, 0], [2, 1]], mirror: true },
  train: { from: 3, cells: [[0, 0], [1.2, 0], [2.4, 0]], same: 'sine' },
  column: { from: 3, cells: [[0, -1.5], [0, 0], [0, 1.5]] },
  vee: { from: 4, cells: [[0, 0], [1, -1], [1, 1], [2, -2], [2, 2]] },
  fastPair: { from: 4, cells: [[0, -1.3], [0.7, 1.3]], same: 'fast' },
  block: { from: 5, cells: [[0, -0.8], [0, 0.8], [1.4, -0.8], [1.4, 0.8]] },
  escort: { from: 5, cells: [[0, 0], [1.9, -1.9], [1.9, 1.9]], lead: 'heavy' },
  // a wall with one way through it (or shoot a way through)
  gate: { from: 7, cells: [[0, -2.5], [0, -1.25], [0, 1.25], [0, 2.5]], same: 'basic' },
};

function kindWeights(wave) {
  if (wave <= 2) return { basic: 1 };
  if (wave === 3) return { basic: 0.65, sine: 0.35 };
  if (wave === 4) return { basic: 0.5, sine: 0.25, fast: 0.25 };
  return { basic: 0.4, sine: 0.22, fast: 0.22, heavy: 0.16 };
}

function pick(weights) {
  let r = Math.random() * Object.values(weights).reduce((a, b) => a + b, 0);
  for (const [k, w] of Object.entries(weights)) { r -= w; if (r <= 0) return k; }
  return Object.keys(weights)[0];
}

export const waveSize = (wave) => Math.min(24, 2 + wave);

/* Groups for one wave: [{ at, members: [{ type, dx, dy, phase }] }].
   gapFor(size) gives the pause before the next group, from the difficulty. */
export function planWave(wave, gapFor) {
  const groups = [];
  let left = waveSize(wave);
  let at = 0.5;
  while (left > 0) {
    const options = Object.entries(FORMATIONS).filter(([, f]) => f.from <= wave && f.cells.length <= left);
    // later waves lean towards the bigger shapes
    const weights = Object.fromEntries(options.map(([k, f]) => [k, 1 + (f.cells.length - 1) * Math.min(1, wave / 8)]));
    const name = options.length ? pick(weights) : 'single';
    const f = FORMATIONS[name];
    const flip = f.mirror && Math.random() < 0.5 ? -1 : 1;
    // one kind per group reads clearly; from wave 7 some groups mix
    const kinds = kindWeights(wave);
    let kind = f.same || pick(kinds);
    if (kind === 'heavy' && f.cells.length > 1 && !f.lead) kind = 'basic';
    const mixed = wave >= 7 && !f.same && !f.lead && Math.random() < 0.35;
    const members = f.cells.map(([cx, cy], i) => {
      let type = i === 0 && f.lead ? f.lead : mixed ? pick({ basic: 1, sine: 0.5, fast: 0.5 }) : kind;
      if (f.lead && i > 0) type = 'basic';
      return { type, dx: cx * UX, dy: cy * UY * flip, phase: name === 'train' ? i * 0.9 : 0 };
    });
    // from wave 6 some groups cross the screen on a diagonal
    const slope = wave >= 6 && name !== 'gate' && Math.random() < 0.4 ? (Math.random() < 0.5 ? -1 : 1) : 0;
    groups.push({ at, members, slope });
    left -= members.length;
    at += gapFor(members.length);
  }
  return groups;
}

/* Where a group's centre line can go so every member's path stays inside
   the field, keeping clear of the previous group's line when it can. */
export function placeGroup(members, field, lastY, slope = 0) {
  const tops = members.map((m) => m.dy - reach(m.type) / 2);
  const bottoms = members.map((m) => m.dy + reach(m.type) / 2);
  const lo = field.top - Math.min(...tops) + 2;
  const hi = field.bottom - Math.max(...bottoms) - 2;
  if (hi <= lo) return (field.top + field.bottom) / 2;
  // a diagonal group starts on the side it drifts away from
  if (slope) return slope > 0 ? lo + (hi - lo) * 0.15 : hi - (hi - lo) * 0.15;
  let y = lo + Math.random() * (hi - lo);
  for (let i = 0; i < 6 && lastY != null && Math.abs(y - lastY) < (field.bottom - field.top) * 0.25; i++) y = lo + Math.random() * (hi - lo);
  return y;
}
