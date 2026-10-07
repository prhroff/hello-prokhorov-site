/* Invaders: one species, four kinds. They fly right to left on simple,
   readable paths, never at random. */

export const TYPES = {
  basic: { w: 11, h: 8, hp: 1, speed: 1, score: 100, amp: 3, freq: 1.2 },          // slight drift
  fast: { w: 9, h: 7, hp: 1, speed: 1.65, score: 150, amp: 4, freq: 5, steer: 12 }, // quick wobble, leans towards the plane
  sine: { w: 11, h: 8, hp: 1, speed: 0.9, score: 150, amp: 22, freq: 1.5 },         // a long, even wave
  heavy: { w: 22, h: 16, hp: 3, speed: 0.6, score: 250, amp: 2, freq: 0.8 },        // slow, takes three hits
};

/* Vertical room an enemy needs around its path, for placing formations. */
export const reach = (type) => TYPES[type].h + TYPES[type].amp * 2;

export function createEnemies() {
  let list = [];

  function spawn(type, x, y, { speed, phase = 0, slope = 0, aggression = 1 }) {
    const t = TYPES[type];
    list.push({
      type, x, y0: y, y, w: t.w, h: t.h, hp: t.hp, hits: 0,
      vx: -speed * t.speed, slope, phase, aggression, age: 0,
      flash: 0, dead: false, passed: false,
    });
  }

  function update(dt, field, playerY) {
    for (const e of list) {
      const t = TYPES[e.type];
      e.age += dt;
      e.x += e.vx * dt;
      // a diagonal formation keeps its line; the drift and waves ride on top
      e.y0 += e.slope * dt;
      if (t.steer && e.x > field.W * 0.45) {
        const towards = Math.sign(playerY - (e.y0 + e.h / 2));
        e.y0 += towards * t.steer * e.aggression * dt;
      }
      e.y0 = Math.min(field.bottom - e.h - t.amp, Math.max(field.top + t.amp, e.y0));
      e.y = e.y0 + Math.sin(e.age * t.freq * Math.PI * 2 * 0.5 + e.phase) * t.amp;
      e.flash = Math.max(0, e.flash - dt);
      // shot down: a frame of white, then gone (the particles take over)
      if (e.dying != null) { e.dying -= dt; if (e.dying <= 0) e.dead = true; }
      if (e.x < -e.w - 2) { e.dead = true; e.passed = true; }
    }
  }

  /* Remove the finished ones, returning how many flew past the plane. */
  function sweep() {
    let passed = 0;
    list = list.filter((e) => { if (e.dead && e.passed) passed++; return !e.dead; });
    return passed;
  }

  /* A slightly smaller box than the sprite, so near misses stay misses. */
  const box = (e) => {
    const inset = e.type === 'heavy' ? 3 : 1;
    return { x: e.x + inset, y: e.y + inset, w: e.w - inset * 2, h: e.h - inset * 2 };
  };

  function draw(ctx, sprites, time) {
    for (const e of list) {
      const art = sprites.enemies[e.type];
      // two-frame march, faster for the fast ones
      const f = ((time * (e.type === 'fast' ? 6 : 3) + e.phase) | 0) % 2;
      let img;
      if (e.flash > 0) img = art.flash[f];
      else if (e.type === 'heavy') img = art.damaged[Math.min(2, e.hits)][f];
      else img = art.frames[f];
      ctx.drawImage(img, Math.round(e.x), Math.round(e.y));
    }
  }

  return {
    get list() { return list; },
    spawn, update, sweep, box, draw,
    clear() { list = []; },
  };
}
