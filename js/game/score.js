/* Score and combo. Kills close together build a multiplier (×2 after three,
   ×3 after five, ×4 after seven); a pause, a hit or a miss resets it. Staying
   alive is worth a trickle of points too. */

import { COMBO_WINDOW } from './config.js';

export function createScore() {
  const s = { value: 0, chain: 0, clock: 0, trickle: 0 };

  s.reset = () => { s.value = 0; s.chain = 0; s.clock = 0; s.trickle = 0; };
  s.multiplier = () => Math.min(4, 1 + Math.floor(Math.max(0, s.chain - 1) / 2));

  s.kill = (base) => {
    s.chain++;
    s.clock = COMBO_WINDOW;
    const points = base * s.multiplier();
    s.value += points;
    return points;
  };

  s.breakCombo = () => { s.chain = 0; s.clock = 0; };

  s.tick = (dt) => {
    s.trickle += dt * 10;                       // 10 points a second
    const whole = Math.floor(s.trickle);
    s.value += whole;
    s.trickle -= whole;
    if (s.clock > 0) { s.clock -= dt; if (s.clock <= 0) s.chain = 0; }
  };

  s.waveBonus = (wave) => { const b = 100 * Math.min(wave, 10); s.value += b; return b; };

  return s;
}
