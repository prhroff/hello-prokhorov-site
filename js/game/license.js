/* The Pilot License: a small pixel card with the player's result, drawn on
   its own canvas at game resolution (so it is the same pixel art on screen
   and in the saved PNG), and exported by plain canvas scaling. */

import { COLORS } from './config.js';
import { drawText, textWidth } from './font.js';

export const LICENSE_W = 132;
export const LICENSE_H = 88;

/* A pilot number from this browser's seed and the result: the same pilot
   and the same run always get the same number. */
export function pilotNumber(seed, score, wave) {
  let h = 2166136261 ^ seed;
  for (const c of `${score}:${wave}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 9999) + 1;
}

const REG = [   // ® on the font's 7-pixel height
  '.#####.',
  '#.##..#',
  '#.#.#.#',
  '#.##..#',
  '#.#.#.#',
  '#.#.#.#',
  '.#####.',
];

export const formatScore = (n) => Math.floor(n).toLocaleString('en-US');
export const formatPilot = (n) => `#${String(n).padStart(4, '0')}`;

export function drawLicense({ score, wave, pilot, sprites }) {
  const c = document.createElement('canvas');
  c.width = LICENSE_W;
  c.height = LICENSE_H;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = COLORS.space;
  g.fillRect(0, 0, LICENSE_W, LICENSE_H);

  // a double rule: white outside, grey inside
  const frame = (inset, color) => {
    g.fillStyle = color;
    g.fillRect(inset, inset, LICENSE_W - inset * 2, 1);
    g.fillRect(inset, LICENSE_H - inset - 1, LICENSE_W - inset * 2, 1);
    g.fillRect(inset, inset, 1, LICENSE_H - inset * 2);
    g.fillRect(LICENSE_W - inset - 1, inset, 1, LICENSE_H - inset * 2);
  };
  frame(0, COLORS.white);
  frame(2, COLORS.dim);

  g.drawImage(sprites.title[0], 8, 8);
  drawText(g, 'INVADER PILOT', 24, 9, { color: COLORS.white });
  const rule = (y) => { g.fillStyle = COLORS.dim; for (let x = 8; x < LICENSE_W - 8; x += 2) g.fillRect(x, y, 1, 1); };
  rule(21);

  const rows = [['PILOT', formatPilot(pilot)], ['SCORE', formatScore(score)], ['WAVE', String(wave).padStart(2, '0')]];
  rows.forEach(([label, value], i) => {
    const y = 27 + i * 11;
    drawText(g, label, 8, y, { color: COLORS.mute });
    drawText(g, value, 8 + textWidth('SCORE '), y, { color: i === 1 ? COLORS.green : COLORS.white });
  });
  rule(62);

  drawText(g, 'PROKHOROV', 8, 70, { color: COLORS.white });
  g.fillStyle = COLORS.mute;
  REG.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') g.fillRect(8 + textWidth('PROKHOROV') + 2 + x, 70 + y, 1, 1); }));
  drawText(g, String(new Date().getFullYear()), LICENSE_W - 8, 70, { color: COLORS.mute, align: 'right' });
  return c;
}

/* Save as a PNG: the card on a little night sky, eight times larger, every
   pixel still square. */
export function exportLicense(card, pilot, scale = 8) {
  const pad = 8;
  const out = document.createElement('canvas');
  out.width = (LICENSE_W + pad * 2) * scale;
  out.height = (LICENSE_H + pad * 2) * scale;
  const g = out.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = COLORS.void;
  g.fillRect(0, 0, out.width, out.height);
  g.drawImage(card, pad * scale, pad * scale, LICENSE_W * scale, LICENSE_H * scale);
  return new Promise((resolve) => out.toBlob((blob) => {
    if (!blob) { resolve(false); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invader-pilot-${String(pilot).padStart(4, '0')}.png`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    resolve(true);
  }, 'image/png'));
}
