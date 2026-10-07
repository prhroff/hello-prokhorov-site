/* Difficulty as one smooth curve of the time actually played: no steps, no
   sudden jumps. intensity runs from 0 towards 1 —
     15 s ≈ 0.16 · 30 s ≈ 0.30 · 60 s ≈ 0.51 · 90 s ≈ 0.65 · 150 s ≈ 0.83 · 240 s ≈ 0.94
   — and everything else is read from it. Speed is capped, so the game stays
   playable however long a run lasts. */

import { PLAYER, ENEMY_BASE_SPEED } from './config.js';

const lerp = (a, b, t) => a + (b - a) * t;

export function difficulty(seconds, arenaWidth) {
  const i = 1 - Math.exp(-seconds / 85);
  const pace = 1 + 1.2 * i;                                        // world speed, up to ×2.2
  const widthScale = Math.min(1.15, Math.max(0.62, arenaWidth / 320));  // the same crossing time on narrow screens
  return {
    intensity: i,
    pace,
    enemySpeed: ENEMY_BASE_SPEED * pace * widthScale,
    fireInterval: lerp(PLAYER.fireFrom, PLAYER.fireTo, i),
    bulletSpeed: PLAYER.bulletSpeed * (1 + 0.25 * i),
    groupGap: (size) => lerp(2.0, 0.55, i) * (0.7 + 0.22 * size),
    maxAlive: Math.round(lerp(4, 14, i)),
    drift: lerp(6, 16, i),                                         // diagonal formations, pixels per second
    aggression: 1 + i,                                             // how hard fast invaders lean in
  };
}
