/* Square pixel particles (explosions, impacts, sparks) and the small "+100"
   score pop-ups. Both live in flat arrays; nothing is allocated per frame
   beyond what a burst adds. */

import { drawText } from './font.js';

const rand = (a, b) => a + Math.random() * (b - a);

export function createParticles() {
  let bits = [];
  let pops = [];

  /* A burst of n square pixels flying out of (x, y). */
  function burst(x, y, { n = 8, color, speed = 60, life = 0.4, size = 1, spread = Math.PI * 2, dir = 0 }) {
    for (let i = 0; i < n; i++) {
      const a = dir + (Math.random() - 0.5) * spread;
      const v = speed * rand(0.4, 1);
      bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: life * rand(0.6, 1), age: 0, color, size });
    }
  }

  /* A sprite that comes apart: every lit pixel becomes a particle. */
  function shatter(pixels, ox, oy, cx, cy, { speed = 70, life = 0.6, keep = 1 }) {
    pixels.forEach((p) => {
      if (Math.random() > keep) return;
      const dx = p.x + ox - cx;
      const dy = p.y + oy - cy;
      const d = Math.hypot(dx, dy) || 1;
      const v = speed * rand(0.5, 1.2);
      bits.push({ x: p.x + ox, y: p.y + oy, vx: (dx / d) * v + rand(-12, 12), vy: (dy / d) * v + rand(-12, 12), life: life * rand(0.7, 1), age: 0, color: p.color, size: 1 });
    });
  }

  function pop(x, y, text, color) { pops.push({ x, y, text, color, age: 0 }); }

  function update(dt) {
    for (const b of bits) {
      b.age += dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vx *= 1 - 2.2 * dt;
      b.vy *= 1 - 2.2 * dt;
    }
    bits = bits.filter((b) => b.age < b.life);
    pops.forEach((p) => { p.age += dt; });
    pops = pops.filter((p) => p.age < 0.75);
  }

  function draw(ctx) {
    for (const b of bits) {
      // the last third of a pixel's life it flickers out instead of fading
      if (b.age > b.life * 0.66 && ((b.age * 30) | 0) % 2) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x | 0, b.y | 0, b.size, b.size);
    }
    for (const p of pops) {
      if (p.age > 0.55 && ((p.age * 20) | 0) % 2) continue;
      // rises in whole-pixel steps
      drawText(ctx, p.text, p.x, p.y - Math.min(8, Math.floor(p.age * 24)), { color: p.color, align: 'center' });
    }
  }

  const clear = () => { bits = []; pops = []; };
  return { burst, shatter, pop, update, draw, clear, get count() { return bits.length; } };
}
