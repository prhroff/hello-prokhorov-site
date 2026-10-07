/* What the game says: the HUD and the full-screen messages (title, ready,
   wave banners, pause, game over). Everything is set in the pixel font on
   the game's own grid. Prompts blink; nothing else moves for show. */

import { COLORS } from './config.js';
import { drawText, textWidth, fitSize, GLYPH_H } from './font.js';

const pad = (n, len) => String(Math.max(0, Math.floor(n))).padStart(len, '0');
const blink = (time, rate = 1.6, duty = 0.68) => (time * rate) % 1 < duty;

/* Text line for stack(). */
const line = (text, { size = 1, color = COLORS.white, gap = 5, show = true, chars } = {}) => ({
  h: GLYPH_H * size, gap,
  draw: (ctx, field, y) => { if (show && text) drawText(ctx, text, field.W / 2, y, { color, size, align: 'center', chars }); },
});

/* Items ({ h, gap, draw(ctx, field, y) }) stacked and centred on the field. */
function stack(ctx, field, items) {
  const h = items.reduce((a, it) => a + it.h + it.gap, 0) - items.at(-1).gap;
  let y = Math.round((field.top + field.bottom) / 2 - h / 2);
  for (const it of items) { it.draw(ctx, field, y); y += it.h + it.gap; }
}

const big = (text, field, max = 2) => fitSize(text, field.W - 16, max);

export function drawHud(ctx, field, s) {
  const x = 4;
  const y = 4;
  drawText(ctx, 'SCORE', x, y, { color: COLORS.mute });
  const vx = x + textWidth('SCORE ');
  drawText(ctx, pad(s.score, 6), vx, y, { color: COLORS.white });
  // the combo sits beside the score only while it counts
  if (s.multiplier > 1) drawText(ctx, `x${s.multiplier}`, vx + textWidth('000000 '), y, { color: COLORS.green });

  const waveText = `WAVE ${pad(s.wave, 2)}`;
  // wide screens: wave in the middle of the top line; narrow: bottom right
  if (field.W >= 250) drawText(ctx, waveText, field.W / 2, y, { color: COLORS.mute, align: 'center' });
  else drawText(ctx, waveText, field.W - 4, field.H - 4 - GLYPH_H, { color: COLORS.mute, align: 'right' });

  // lives, bottom left: full hearts and empty outlines (shape, not only colour)
  for (let i = 0; i < 3; i++) {
    const img = i < s.lives ? s.sprites.heart : s.sprites.heartEmpty;
    ctx.drawImage(img, 4 + i * 9, field.H - 4 - img.height);
  }
}

export function drawTitle(ctx, field, s) {
  const size = big('INVADER', field, 3);
  // the invader from the footer, marching on the spot above its name
  const art = s.sprites.title[((s.time * 2) | 0) % 2];
  const k = size;
  const step = [0, 1, 0, -1][Math.floor(s.time * 2) % 4];
  stack(ctx, field, [
    { h: art.height * k, gap: 10, draw: (c, f, y) => c.drawImage(art, Math.round(f.W / 2 - (art.width * k) / 2) + step * k, y, art.width * k, art.height * k) },
    line('INVADER', { size, gap: 6 }),
    line('8-BIT AIR RAID', { color: COLORS.green, gap: 18 }),
    line(s.touch ? 'TAP TO START' : 'SPACE TO START', { show: blink(s.time) }),
  ]);
  const foot = [s.touch ? 'DRAG TO MOVE' : 'ARROWS OR W S TO MOVE'];
  if (s.best > 0) foot.unshift(`BEST ${pad(s.best, 6)}`);
  foot.forEach((t, i) => drawText(ctx, t, field.W / 2, field.H - 6 - GLYPH_H - (foot.length - 1 - i) * (GLYPH_H + 4), { color: COLORS.mute, align: 'center' }));
}

export function drawReady(ctx, field, s) {
  stack(ctx, field, [
    line(`WAVE ${pad(s.wave, 2)}`, { size: big('WAVE 00', field), gap: 6 }),
    line('GET READY', { color: COLORS.green, show: blink(s.time, 3, 0.6) }),
  ]);
}

export function drawWaveBanner(ctx, field, s) {
  if (s.phase === 'announce') {
    if (blink(s.phaseTime, 3, 0.7)) stack(ctx, field, [line(`WAVE ${pad(s.wave, 2)}`, { size: big('WAVE 00', field) })]);
  } else if (s.phase === 'complete') {
    // typed out a letter at a time: the pixel transition between waves
    const chars = Math.floor(s.phaseTime * 34);
    stack(ctx, field, [
      line('WAVE COMPLETE', { size: big('WAVE COMPLETE', field), chars, gap: 6 }),
      line(`BONUS +${s.bonus}`, { color: COLORS.green, show: chars > 14 }),
    ]);
  }
}

export function drawPaused(ctx, field, s) {
  // the frozen frame stays visible behind a pixel screen door
  ctx.fillStyle = s.door;
  ctx.fillRect(0, 0, field.W, field.H);
  stack(ctx, field, [
    line('PAUSED', { size: big('PAUSED', field), gap: 8 }),
    line(s.touch ? 'TAP TO RESUME' : 'P TO RESUME', { gap: 4 }),
    line(s.touch ? '' : 'ESC TO EXIT', { color: COLORS.mute }),
  ]);
}

export function drawGameOver(ctx, field, s) {
  const t = s.phaseTime;
  const items = [line('GAME OVER', { size: big('GAME OVER', field), chars: Math.floor(t * 24), gap: 10 })];
  if (s.record) items.push(line('NEW HIGH SCORE', { color: blink(t, 4, 0.5) ? COLORS.green : COLORS.white, show: t > 0.5, gap: 10 }));
  // the table is left-aligned on its own column so the numbers line up
  const rows = [['SCORE', pad(s.score, 6)], ['BEST', pad(s.best, 6)], ['WAVE', pad(s.wave, 2)]];
  const w = textWidth('SCORE 000000');
  rows.forEach(([label, value], i) => items.push({
    h: GLYPH_H, gap: i === rows.length - 1 ? 14 : 4,
    draw: (c, f, y) => {
      if (t < 0.35 + i * 0.12) return;
      const x = Math.round(f.W / 2 - w / 2);
      drawText(c, label, x, y, { color: COLORS.mute });
      drawText(c, value, x + textWidth('SCORE '), y, { color: COLORS.white });
    },
  }));
  items.push(line(s.touch ? 'TAP TO RESTART' : 'SPACE TO RESTART', { show: t > 0.9 && blink(t) }));
  stack(ctx, field, items);
  if (s.record && t > 0.5) sparkle(ctx, field, t);
}

/* A few pixel stars that wink around the screen for a new record. */
function sparkle(ctx, field, t) {
  ctx.fillStyle = COLORS.green;
  for (let i = 0; i < 10; i++) {
    const phase = (t * 1.4 + i * 0.37) % 1;
    if (phase > 0.5) continue;
    const x = Math.round((((i * 97) % 100) / 100) * (field.W - 20) + 10);
    const y = Math.round((((i * 53 + 17) % 100) / 100) * (field.H - 40) + 20);
    ctx.fillRect(x, y, 1, 1);
    if (phase > 0.15 && phase < 0.35) { ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); }
  }
}

/* The secret: the score, a beat, then the words. t is seconds into it. */
export function drawUnlock(ctx, field, { t, label }) {
  const size = big(label, field, 3);
  const items = [line(label, { size, color: t < 0.9 && !blink(t, 6, 0.6) ? COLORS.green : COLORS.white, show: t > 0.25, gap: 12 })];
  items.push(line('YOU FOUND IT.', { chars: Math.max(0, Math.floor((t - 0.85) * 28)), gap: 8 }));
  items.push(line('SECRET UNLOCKED', { size: big('SECRET UNLOCKED', field), color: COLORS.green, show: t > 1.4 && (t > 1.9 || blink(t, 5, 0.6)) }));
  stack(ctx, field, items);
}
