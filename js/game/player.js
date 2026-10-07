/* The player's plane: vertical movement only, automatic fire, three lives,
   a moment of invulnerability after each hit. */

import { PLAYER, COLORS } from './config.js';
import { EXHAUST } from './sprites.js';

export function createPlayer() {
  const p = {
    x: 0, y: 0, v: 0, w: 16, h: 8,
    lives: PLAYER.lives,
    invulnerable: 0,
    hurt: 0,          // the warm flash right after a hit
    recoil: 0,        // a pixel kick back on each shot
    muzzle: 0,
    fireClock: 0.3,
    frameClock: 0,
    frame: 0,
    visible: true,
  };

  p.reset = (field) => {
    p.lives = PLAYER.lives;
    p.invulnerable = 0;
    p.hurt = 0;
    p.recoil = 0;
    p.muzzle = 0;
    p.v = 0;
    p.fireClock = 0.3;
    p.visible = true;
    p.home(field);
    p.y = field.top + (field.bottom - field.top - p.h) / 2;
  };

  // roughly the left fifth of the arena, never hugging the edge
  p.home = (field) => { p.x = Math.round(Math.max(12, field.W * 0.16)); };

  p.clampTo = (field) => { p.y = Math.min(field.bottom - p.h, Math.max(field.top, p.y)); };

  /* input.dir is −1/0/1 from the keys; input.target a y to fly to (pointer or
     touch), or null. Keys ease in quickly; a target is chased at a capped
     speed, so even a flick of the finger stays readable. */
  p.update = (dt, input, field, fireInterval, fire) => {
    const span = field.bottom - field.top;
    let want;
    if (input.dir) want = input.dir * span * PLAYER.keySpeed;
    else if (input.target != null) {
      const max = span * PLAYER.followSpeed;
      want = Math.max(-max, Math.min(max, (input.target - p.h / 2 - p.y) * 14));
    } else want = 0;
    p.v += (want - p.v) * (1 - Math.exp(-22 * dt));
    p.y += p.v * dt;
    p.clampTo(field);

    p.frameClock += dt;
    if (p.frameClock > 1 / 12) { p.frameClock = 0; p.frame = (p.frame + 1) % 3; }   // 12 fps propeller
    p.invulnerable = Math.max(0, p.invulnerable - dt);
    p.hurt = Math.max(0, p.hurt - dt);
    p.recoil = Math.max(0, p.recoil - dt);
    p.muzzle = Math.max(0, p.muzzle - dt);

    if (fire) {
      p.fireClock -= dt;
      if (p.fireClock <= 0) {
        p.fireClock += fireInterval;
        p.recoil = 0.06;
        p.muzzle = 0.04;
        fire(p.x + p.w, Math.round(p.y) + 4);
      }
    }
  };

  /* A forgiving box: the tail fin, the wing tip and the blade do not count. */
  p.box = () => ({ x: p.x + 3, y: p.y + 3, w: p.w - 5, h: p.h - 4 });

  p.draw = (ctx, sprites, time) => {
    if (!p.visible) return;
    // invulnerable: a hard 15 Hz flicker
    if (p.invulnerable > 0 && p.hurt <= 0 && ((time * 15) | 0) % 2) return;
    const x = p.x - (p.recoil > 0 ? 1 : 0);
    const y = Math.round(p.y);
    const set = p.hurt > 0 ? sprites.planeHurt : sprites.plane;
    ctx.drawImage(set[p.frame], x, y);
    ctx.fillStyle = COLORS.warm;
    for (const [ex, ey] of EXHAUST[((time * 10) | 0) % 2]) ctx.fillRect(x + ex, y + ey, 1, 1);
    if (p.muzzle > 0) {
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(x + p.w, y + 3, 2, 3);
    }
  };

  return p;
}
