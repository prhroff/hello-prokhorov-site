/* Space, in parallax layers that scroll right to left: distant stars, nearer
   stars, and bodies (planets, moons, rocks, debris) that appear as the run
   intensifies. Everything is flat grey pixels, shaded with a checker dither
   rather than gradients, and kept dim so it never competes with the action. */

import { COLORS } from './config.js';

const rand = (a, b) => a + Math.random() * (b - a);

function disc(r, ring) {
  const size = r * 2 + 1;
  const pad = ring ? Math.ceil(r * 0.6) : 0;
  const c = document.createElement('canvas');
  c.width = size + pad * 2;
  c.height = size;
  const g = c.getContext('2d');
  // a light from the upper left: lit, a dithered terminator, then shadow
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r + r * 0.6) continue;
      const light = (-x - y) / (r * 1.4);
      const dither = (x + y) & 1;
      g.fillStyle = light > 0.25 || (light > -0.15 && dither) ? COLORS.rockLit : COLORS.rock;
      g.fillRect(x + r + pad, y + r, 1, 1);
    }
  }
  if (ring) {
    g.fillStyle = COLORS.dim;
    for (let x = -r - pad; x <= r + pad; x++) {
      const y = Math.round(x * 0.18);
      const front = x > -r * 0.2;
      if (front || x * x + y * y > r * r) g.fillRect(x + r + pad, y + r, 1, 1);
    }
  }
  return c;
}

function rock(r) {
  const size = r * 2 + 2;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const bumps = Array.from({ length: 7 }, () => rand(0.7, 1.05));
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const a = (Math.atan2(y, x) / (Math.PI * 2) + 1) % 1;
      const edge = r * bumps[Math.floor(a * bumps.length)];
      if (x * x + y * y > edge * edge) continue;
      g.fillStyle = x + y < -r * 0.3 ? COLORS.rockLit : COLORS.rock;
      g.fillRect(x + r + 1, y + r + 1, 1, 1);
    }
  }
  return c;
}

export function createBackground() {
  let W = 320;
  let H = 180;
  let far = [];
  let mid = [];
  let near = [];
  let bodies = [];
  let bodyClock = 4;
  let rockClock = 0;

  const scatter = (n, depth) => Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, t: Math.random(), depth }));

  function resize(w, h) {
    const sx = w / W;
    const sy = h / H;
    W = w;
    H = h;
    const area = (W * H) / 1000;
    far = scatter(Math.round(area * 1.1), 0);
    mid = scatter(Math.round(area * 0.6), 1);
    near = scatter(Math.round(area * 0.18), 2);
    bodies.forEach((b) => { b.x *= sx; b.y *= sy; });
  }

  function spawnBody(kind) {
    if (kind === 'planet') {
      const r = Math.round(rand(Math.min(W, H) * 0.06, Math.min(W, H) * 0.12));
      const img = disc(r, Math.random() < 0.45);
      bodies.push({ img, x: W + 4, y: rand(H * 0.15, H * 0.85) - img.height / 2, speed: rand(3, 5), layer: 0 });
      // a moon sometimes keeps it company
      if (Math.random() < 0.5) {
        const m = disc(Math.max(2, Math.round(r * 0.28)), false);
        bodies.push({ img: m, x: W + 4 + img.width + rand(4, 14), y: rand(H * 0.1, H * 0.9), speed: rand(3.5, 5.5), layer: 0 });
      }
    } else if (kind === 'rock') {
      const img = rock(Math.round(rand(2, 5)));
      bodies.push({ img, x: W + 4, y: rand(0, H - img.height), speed: rand(14, 22), layer: 1 });
    } else {
      bodies.push({ img: null, x: W + 2, y: rand(0, H), len: Math.round(rand(2, 4)), speed: rand(50, 70), layer: 2 });
    }
  }

  /* pace: how fast the world flies by. intensity 0…1 thickens the scenery:
     sparse stars, then planets, then rocks, then debris and denser stars. */
  function update(dt, pace, intensity, reduced) {
    const k = reduced ? 0.3 : 1;
    const move = (list, speed) => list.forEach((s) => {
      s.x -= speed * pace * k * dt;
      if (s.x < -4) { s.x += W + 8; s.y = Math.random() * H; }
    });
    if (!reduced) move(far, 3);
    move(mid, 10);
    if (!reduced) move(near, 34);

    bodyClock -= dt;
    if (intensity > 0.1 && bodyClock <= 0 && !bodies.some((b) => b.layer === 0)) {
      spawnBody('planet');
      bodyClock = rand(14, 24);
    }
    rockClock -= dt * pace;
    if (intensity > 0.32 && rockClock <= 0) {
      spawnBody(Math.random() < (intensity - 0.45) * 2 ? 'debris' : 'rock');
      rockClock = rand(2.5, 6) / (0.5 + intensity);
    }
    bodies.forEach((b) => { b.x -= b.speed * pace * k * dt; });
    bodies = bodies.filter((b) => b.x > -(b.img ? b.img.width : b.len) - 2);
  }

  function draw(ctx, pace, intensity, reduced) {
    ctx.fillStyle = COLORS.far;
    far.forEach((s) => ctx.fillRect(s.x | 0, s.y | 0, 1, 1));
    bodies.forEach((b) => { if (b.layer === 0) ctx.drawImage(b.img, b.x | 0, b.y | 0); });
    // nearer stars fill in as the run goes on
    const shown = 0.35 + intensity * 0.65;
    ctx.fillStyle = COLORS.mid;
    mid.forEach((s) => { if (s.t < shown) ctx.fillRect(s.x | 0, s.y | 0, 1, 1); });
    bodies.forEach((b) => { if (b.layer === 1) ctx.drawImage(b.img, b.x | 0, b.y | 0); });
    if (!reduced) {
      // the fastest layer stretches into streaks as speed builds
      const len = 1 + Math.round(Math.max(0, pace - 1) * 4);
      ctx.fillStyle = COLORS.near;
      near.forEach((s) => { if (s.t < 0.4 + intensity * 0.6) ctx.fillRect(s.x | 0, s.y | 0, len, 1); });
      ctx.fillStyle = COLORS.dim;
      bodies.forEach((b) => { if (b.layer === 2) ctx.fillRect(b.x | 0, b.y | 0, b.len, 1); });
    }
  }

  function clear() { bodies = []; bodyClock = 4; rockClock = 0; }

  return { resize, update, draw, clear };
}
