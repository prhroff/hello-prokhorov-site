/* Invader — shared constants. All sizes are game pixels (one logical pixel of
   the low-resolution screen), all times are seconds. */

export const COLORS = {
  void: '#0a0a0a',      // around the screen when it is letterboxed
  space: '#121212',     // the portfolio's ink becomes the night sky
  far: '#2e2e2e',
  mid: '#5a5a5a',
  near: '#9c9c9c',
  rock: '#2a2a2a',
  rockLit: '#3d3d3d',
  white: '#f2f2f2',
  mute: '#757575',
  dim: '#3a3a3a',
  green: '#08f32e',     // the invader's own colour (assets/img/invader.svg)
  greenDark: '#05a51f',
  warm: '#ff5a36',      // the only other accent: lives, exhaust, damage
};

export const SCREEN = {
  minAspect: 0.68,      // portrait phones: the arena stops getting taller
  maxAspect: 2,         // ultrawide: the arena stops getting wider
  shortMin: 150,        // game pixels across the short side, small screens…
  shortMax: 210,        // …and large ones (close to a classic arcade screen)
  density: 0.22,        // game pixels per CSS pixel of the short side, in between
};

export const PLAYER = {
  lives: 3,
  invulnerable: 1.1,
  keySpeed: 0.78,       // of the arena height per second
  followSpeed: 1.7,     // pointer and touch, of the arena height per second
  touchGain: 1.25,      // a finger travels a little less than the plane
  fireFrom: 0.24,       // seconds between shots, at the start…
  fireTo: 0.18,         // …and at full intensity
  bulletSpeed: 240,
};

export const ENEMY_BASE_SPEED = 38;   // at the start, on a 320 pixel wide arena

export const COMBO_WINDOW = 1.5;

export const STORE_KEY = 'pk-invader';
