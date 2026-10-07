/* What the game remembers, in this browser only: best score and wave, the
   sound setting, whether the secret has been found (permanently, once it
   has), and a random seed that gives this browser's pilot its number. No
   personal data. Storage can be unavailable (private mode, blocked site
   data): then the game simply forgets between visits. */

import { STORE_KEY } from './config.js';

const seed = () => Math.floor(Math.random() * 0x7fffffff);

export function load() {
  let d = {};
  try { d = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { /* storage blocked or corrupt */ }
  return {
    best: d.best | 0,
    bestWave: d.bestWave | 0,
    muted: !!d.muted,
    secretUnlocked: d.secretUnlocked === true,
    pilotSeed: Number.isInteger(d.pilotSeed) ? d.pilotSeed : seed(),
  };
}

export function save(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* storage blocked */ }
}
