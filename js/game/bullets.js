/* The plane's shots: 3×1 pixel dashes flying right. */

import { COLORS } from './config.js';

export function createBullets() {
  let list = [];
  return {
    get list() { return list; },
    fire(x, y, speed) { list.push({ x, y, vx: speed, w: 3, h: 1, dead: false }); },
    update(dt, W) {
      for (const b of list) { b.x += b.vx * dt; if (b.x > W + 4) b.dead = true; }
      list = list.filter((b) => !b.dead);
    },
    draw(ctx) {
      ctx.fillStyle = COLORS.white;
      for (const b of list) ctx.fillRect(b.x | 0, b.y | 0, b.w, b.h);
    },
    clear() { list = []; },
  };
}
