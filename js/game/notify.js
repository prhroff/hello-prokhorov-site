/* Score milestones on the way to the secret, and the small notices they
   raise. A notice never pauses the game or takes input: it dissolves in
   pixel by pixel above the action, holds for a beat, and dissolves out.
   Each milestone fires once per run, and only until the secret is found. */

import { COLORS } from './config.js';
import { drawText, textWidth, GLYPH_H } from './font.js';

export const SECRET_SCORE = 25000;

// [score, text, a hint about the secret (set in its green)]
const MILESTONES = [
  [1000, 'NICE', false],
  [5000, 'KEEP GOING', false],
  [10000, 'SECRET IS GETTING CLOSER', true],
  [15000, 'KEEP FLYING', false],
  [20000, 'SOMETHING IS WAITING', true],
];

const IN = 0.18;
const HOLD = 0.95;
const OUT = 0.22;

export function createNotes() {
  let active = false;
  let next = 0;          // index of the next milestone to reach
  let note = null;       // { text, color, t, pixels, w, h, size }

  /* A new run: milestones count only while the secret is still hidden. */
  function reset(on) { active = on; next = 0; note = null; }

  /* Called as the score changes. Crossing several milestones at once (a big
     wave bonus) marks them all and shows only the highest. */
  function check(score) {
    if (!active) return;
    let hit = null;
    while (next < MILESTONES.length && score >= MILESTONES[next][0]) hit = MILESTONES[next++];
    if (hit) show(hit[1], hit[2] ? COLORS.green : COLORS.white);
  }

  function show(text, color) { note = { text, color, t: 0, pixels: null }; }

  function update(dt) {
    if (!note) return;
    note.t += dt;
    if (note.t > IN + HOLD + OUT) note = null;
  }

  /* The lit pixels of the text, each with a fixed place in the dissolve. */
  function bake(n, field) {
    n.size = textWidth(n.text) * 2 <= field.W * 0.7 ? 2 : 1;
    n.w = textWidth(n.text, n.size);
    n.h = GLYPH_H * n.size;
    const c = document.createElement('canvas');
    c.width = n.w;
    c.height = n.h;
    const g = c.getContext('2d');
    drawText(g, n.text, 0, 0, { color: '#fff', size: n.size });
    const data = g.getImageData(0, 0, n.w, n.h).data;
    n.pixels = [];
    for (let y = 0; y < n.h; y++) {
      for (let x = 0; x < n.w; x++) {
        if (data[(y * n.w + x) * 4 + 3] > 127) n.pixels.push({ x, y, order: ((x * 73 + y * 151) % 97) / 97 });
      }
    }
  }

  function draw(ctx, field, reduced) {
    if (!note) return;
    if (!note.pixels) bake(note, field);
    const t = note.t;
    const shown = reduced ? 1 : t < IN ? t / IN : t < IN + HOLD ? 1 : 1 - (t - IN - HOLD) / OUT;
    // upper centre: clear of the HUD, above where the plane usually flies
    const x = Math.round(field.W / 2 - note.w / 2);
    const y = Math.round(field.top + (field.bottom - field.top) * 0.16);
    ctx.fillStyle = note.color;
    for (const p of note.pixels) if (p.order < shown) ctx.fillRect(x + p.x, y + p.y, 1, 1);
  }

  return { reset, check, update, draw, clear: () => { note = null; }, get text() { return note?.text ?? null; } };
}
