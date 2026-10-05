/* Invader — a small hidden arcade game behind the invader in the footer.
   This module is loaded on the first click of [data-game] (see js/main.js), so
   the portfolio carries none of it until then. It opens a full-viewport game
   screen over the page, and on exit removes every trace: the loop, the
   listeners, the markup, and the scroll lock, returning focus and scroll to
   exactly where they were. */

import { SCREEN, PLAYER } from './config.js';
import { createGame, S } from './game.js';
import { makeSprites, ICONS, iconSvg } from './sprites.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createRewardUI } from './reward.js';
import { load, save } from './storage.js';

const STYLES = new URL('../../css/game.css', import.meta.url).href;
let current = null;   // only ever one game open

function loadStyles() {
  if (document.querySelector('link[data-arcade-css]')) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLES;
    link.dataset.arcadeCss = '';
    link.onload = link.onerror = () => resolve();
    document.head.append(link);
  });
}

const button = (name, label, icon) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `arcade__btn arcade__btn--${name}`;
  b.setAttribute('aria-label', label);
  b.innerHTML = iconSvg(ICONS[icon]);
  return b;
};

export async function openGame(trigger) {
  if (current) return;
  current = true;
  await loadStyles();

  const html = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scroll = { x: scrollX, y: scrollY };
  const store = load();

  /* ---------- markup ---------- */
  const root = document.createElement('div');
  root.className = 'arcade';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Invader, an 8-bit arcade game');
  root.tabIndex = -1;
  const canvas = document.createElement('canvas');
  canvas.className = 'arcade__screen';
  canvas.setAttribute('aria-hidden', 'true');
  const controls = document.createElement('div');
  controls.className = 'arcade__controls';
  const sound = button('sound', '', 'soundOn');
  const pause = button('pause', 'Pause', 'pause');
  const close = button('close', 'Close the game', 'close');
  controls.append(sound, pause, close);
  const live = document.createElement('p');
  live.className = 'arcade__live';
  live.setAttribute('aria-live', 'polite');
  root.append(canvas, controls, live);

  const say = (text) => { live.textContent = text; };
  const audio = createAudio(store.muted);
  const showSound = () => {
    sound.innerHTML = iconSvg(audio.on ? ICONS.soundOn : ICONS.soundOff);
    sound.setAttribute('aria-label', audio.on ? 'Sound on' : 'Sound off');
    sound.setAttribute('aria-pressed', String(audio.on));
  };
  showSound();

  /* ---------- the page underneath goes quiet ---------- */
  html.classList.add('arcade-open');
  const quieted = [...document.body.children].filter((el) => !el.inert && el.tagName !== 'SCRIPT');
  quieted.forEach((el) => { el.inert = true; });
  document.body.append(root);

  /* ---------- the game ---------- */
  let game;
  let ui;
  const layout = { scale: 1, dpr: 1, ox: 0, oy: 0, W: 320, H: 180 };
  const input = createInput({
    root,
    toY: (clientY) => ((clientY * layout.dpr) / layout.scale) - layout.oy,
    planeY: () => game.planeCenter,
    on: {
      action: () => game.action(),
      pause: () => game.pause(),
      escape: () => (game.escapeLeaves() ? exit() : game.pause()),
      menu: menuKey,
      mute: () => toggleSound(),
      touchGain: PLAYER.touchGain,
    },
  });

  const onState = (state) => {
    const pausable = state === S.READY || state === S.PLAYING || state === S.PAUSED;
    pause.hidden = !pausable;
    const paused = state === S.PAUSED;
    pause.innerHTML = iconSvg(paused ? ICONS.play : ICONS.pause);
    pause.setAttribute('aria-label', paused ? 'Resume' : 'Pause');
    root.classList.toggle('is-playing', state === S.PLAYING || state === S.READY);
    ui?.update(state);
  };

  /* Keys on the secret screens. Escape steps back one screen and never
     closes the game from here: reward → the run (or where it was opened
     from), license → reward. Up and down move between the choices. */
  function menuKey(e) {
    const state = game.state;
    if (state === S.SECRET) {
      if (e.key !== 'Escape') return false;
      e.preventDefault();
      game.action();            // skips the rest of the sequence
      return true;
    }
    if (state !== S.REWARD && state !== S.LICENSE) return false;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (state === S.REWARD) game.leaveReward(); else game.closeLicense();
      return true;
    }
    const dir = e.key === 'ArrowUp' || e.code === 'KeyW' ? -1 : e.key === 'ArrowDown' || e.code === 'KeyS' ? 1 : 0;
    if (dir) { e.preventDefault(); if (!e.repeat) ui.nav(dir); return true; }
    // Space and Enter press the focused button; elsewhere they do nothing here
    if ((e.key === ' ' || e.key === 'Enter') && !(e.target instanceof Element && e.target.closest('button, a'))) { e.preventDefault(); return true; }
    return e.key === 'p' || e.key === 'P';
  }

  const sprites = makeSprites();
  game = createGame({ canvas, sprites, audio, store, input, reduced, say, onState });
  ui = createRewardUI({ root, sprites, store, game, say });

  /* Pixel-exact scaling: a whole number of device pixels per game pixel,
     chosen so the short side of the arena is about 150–216 game pixels. The arena
     keeps a sensible shape (no wider than 2:1, no taller than about 2:3); the rest
     of the viewport is a dark surround. */
  function measure() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    // the overlay's own box (innerWidth can be wider when the page overflows)
    const vw = root.clientWidth || window.innerWidth;
    const vh = root.clientHeight || window.innerHeight;
    let aw = vw;
    let ah = vh;
    if (aw / ah > SCREEN.maxAspect) aw = ah * SCREEN.maxAspect;
    if (aw / ah < SCREEN.minAspect) ah = aw / SCREEN.minAspect;
    const short = Math.min(aw, ah);
    const target = Math.min(SCREEN.shortMax, Math.max(SCREEN.shortMin, short * SCREEN.density));
    const scale = Math.max(1, Math.round((short * dpr) / target));
    const VW = Math.ceil((vw * dpr) / scale);
    const VH = Math.ceil((vh * dpr) / scale);
    const W = Math.floor((aw * dpr) / scale);
    const H = Math.floor((ah * dpr) / scale);
    const ox = Math.floor((VW - W) / 2);
    const oy = Math.floor((VH - H) / 2);
    const px = scale / dpr;              // CSS pixels per game pixel

    canvas.width = VW;
    canvas.height = VH;
    canvas.style.width = `${VW * px}px`;
    canvas.style.height = `${VH * px}px`;
    root.style.setProperty('--px', `${px}px`);
    root.style.setProperty('--icon', `${Math.min(5, Math.max(2, Math.round(px * 0.7)))}px`);   // icon pixels, a little finer than the game's
    root.style.setProperty('--arena-top', `${oy * px}px`);
    root.style.setProperty('--arena-left', `${ox * px}px`);
    root.style.setProperty('--arena-w', `${W * px}px`);
    root.style.setProperty('--arena-h', `${H * px}px`);
    root.style.setProperty('--arena-right', `${Math.max(0, vw - (ox + W) * px)}px`);
    Object.assign(layout, { scale, dpr, ox, oy, W, H });

    // the HUD band at the top clears the buttons
    const top = Math.max(14, Math.ceil(controls.offsetHeight / px) + 2);
    game.resize({ VW, VH, ox, oy, W, H, top });
    ui.layout({ W, H });
  }

  /* ---------- listeners (all removed on exit) ---------- */
  let resizeRaf = 0;
  const onResize = () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(measure); };
  const onHidden = () => { if (document.hidden) game.pause(); };
  const onBlur = () => { if (game.state === S.PLAYING || game.state === S.READY) game.pause(); };
  // the focus stays inside the game (the page behind is inert)
  const onFocusOut = (e) => { if (!root.contains(e.relatedTarget)) requestAnimationFrame(() => { if (current && !root.contains(document.activeElement)) root.focus({ preventScroll: true }); }); };

  function toggleSound() {
    audio.unlock();
    audio.toggle();
    store.muted = !audio.on;
    save(store);
    showSound();
  }

  // a mouse or touch press hands focus back to the game, so the next Space
  // starts or restarts it instead of pressing the same button again
  const handBack = (e) => { if (e.detail > 0) root.focus({ preventScroll: true }); };
  sound.addEventListener('click', (e) => { toggleSound(); handBack(e); });
  pause.addEventListener('click', (e) => { game.pause(); handBack(e); });
  close.addEventListener('click', () => exit());
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onHidden);
  addEventListener('blur', onBlur);
  root.addEventListener('focusout', onFocusOut);
  input.attach();

  let leaving = false;
  function exit() {
    if (leaving) return;
    leaving = true;
    root.classList.remove('is-on');
    game.close(teardown);
  }

  /* Leaving the page (ENTER THE ARCHIVE, or any navigation): close at once,
     so a page restored by the browser's back button is the portfolio itself,
     where the visitor left it, not a frozen game. */
  function onPageHide() {
    if (leaving) return;
    leaving = true;
    game.stop();
    teardown();
  }
  addEventListener('pagehide', onPageHide);

  function teardown() {
    removeEventListener('pagehide', onPageHide);
    input.detach();
    cancelAnimationFrame(resizeRaf);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onHidden);
    removeEventListener('blur', onBlur);
    root.removeEventListener('focusout', onFocusOut);
    audio.close();
    root.remove();
    quieted.forEach((el) => { el.inert = false; });
    html.classList.remove('arcade-open');
    // back exactly where the visitor was, without the page's smooth scroll
    const behavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    scrollTo(scroll.x, scroll.y);
    html.style.scrollBehavior = behavior;
    trigger?.focus({ preventScroll: true });
    current = null;
  }

  measure();
  root.focus({ preventScroll: true });
  game.open(() => root.classList.add('is-on'));
}
