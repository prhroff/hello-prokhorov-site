/* The reward screen and the Pilot License: real buttons and a real link
   (keyboard, touch and screen readers), set in the game's pixel font as SVG
   on the same pixel grid, over the frozen, dimmed game. The game's state
   machine decides what is on screen; this module only shows it. */

import { S } from './game.js';
import { textSvg, textWidth, GLYPH_H } from './font.js';
import { drawLicense, exportLicense, pilotNumber, formatPilot, formatScore, LICENSE_W, LICENSE_H } from './license.js';

export const ARCHIVE_URL = '/archive/';
const ARM_DELAY = 450;   // a tap that was meant for the game cannot press a button

/* Pixel text: the SVG for the eye, plain text for everyone else. */
function pixel(text, { size = 1, label = text } = {}) {
  const { svg, w } = textSvg(text);
  return `<span class="arcade__text" style="--w:${w * size};--h:${GLYPH_H * size}">${svg}</span><span class="arcade__vh">${label}</span>`;
}

const fit = (text, W, max) => Math.max(1, Math.min(max, Math.floor((W - 16) / textWidth(text))));

export function createRewardUI({ root, sprites, store, game, say }) {
  const panel = document.createElement('section');
  panel.className = 'arcade__panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Secret unlocked');
  panel.innerHTML = `
    <div class="arcade__reward" data-view="reward">
      <p class="arcade__score" data-score></p>
      <h2 class="arcade__title" data-title></h2>
      <p class="arcade__found" data-found></p>
      <div class="arcade__actions">
        <a class="arcade__action" href="${ARCHIVE_URL}" data-archive></a>
        <button class="arcade__action" type="button" data-license></button>
        <button class="arcade__action arcade__action--light" type="button" data-leave></button>
      </div>
    </div>
    <div class="arcade__licensebox" data-view="license" hidden>
      <canvas class="arcade__card" role="img"></canvas>
      <div class="arcade__actions arcade__actions--row">
        <button class="arcade__action" type="button" data-save></button>
        <button class="arcade__action arcade__action--light" type="button" data-back></button>
      </div>
    </div>`;
  const $ = (s) => panel.querySelector(s);
  const views = { reward: $('[data-view="reward"]'), license: $('[data-view="license"]') };
  const card = $('.arcade__card');

  // the quiet way back to the reward once it has been found: title and GAME OVER
  const secret = document.createElement('button');
  secret.type = 'button';
  secret.className = 'arcade__secret';
  secret.hidden = true;
  secret.innerHTML = pixel('VIEW SECRET', { label: 'View the secret' });
  root.append(panel, secret);

  let W = 288;
  let H = 180;
  let current = null;
  let armTimer = 0;
  let licenseImage = null;
  let pilot = 0;

  function arm(focus) {
    clearTimeout(armTimer);
    panel.classList.remove('is-armed');
    armTimer = setTimeout(() => {
      panel.classList.add('is-armed');
      focus?.focus({ preventScroll: true });
    }, ARM_DELAY);
  }

  function fillReward() {
    const r = game.reward;
    $('[data-score]').innerHTML = pixel(r.label, { label: r.canContinue ? `Score ${r.score}` : `Best score ${r.score}` });
    $('[data-title]').innerHTML = pixel('MISSION COMPLETE', { size: fit('MISSION COMPLETE', W, 2), label: 'Mission complete' });
    $('[data-found]').innerHTML = pixel('SECRET UNLOCKED', { label: 'Secret unlocked' });
    $('[data-archive]').innerHTML = pixel('ENTER THE ARCHIVE', { label: 'Enter the Archive' });
    $('[data-license]').innerHTML = pixel('GET PILOT LICENSE', { label: 'Get your Pilot License' });
    $('[data-leave]').innerHTML = r.canContinue ? pixel('KEEP PLAYING', { label: 'Keep playing' }) : pixel('BACK', { label: 'Back' });
  }

  function fillLicense() {
    const r = game.reward;
    pilot = pilotNumber(store.pilotSeed, r.score, r.wave);
    licenseImage = drawLicense({ score: r.score, wave: r.wave, pilot, sprites });
    card.width = LICENSE_W;
    card.height = LICENSE_H;
    const g = card.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(licenseImage, 0, 0);
    card.setAttribute('aria-label', `Invader Pilot License. Pilot ${formatPilot(pilot)}, score ${formatScore(r.score)}, wave ${r.wave}. Prokhorov®.`);
    $('[data-save]').innerHTML = pixel('SAVE LICENSE', { label: 'Save license as an image' });
    $('[data-back]').innerHTML = pixel('BACK', { label: 'Back' });
    sizeCard();
  }

  // the card at a whole multiple of the game pixel, as large as fits above its buttons
  function sizeCard() {
    const k = Math.max(1, Math.min(Math.floor((W - 8) / LICENSE_W), Math.floor((H - 50) / LICENSE_H)));
    card.style.setProperty('--k', k);
  }

  function update(state) {
    const prev = current;
    current = state;
    secret.hidden = !(game.secretUnlocked && (state === S.INTRO || state === S.GAME_OVER));
    if (state !== S.REWARD && state !== S.LICENSE) {
      panel.hidden = true;
      clearTimeout(armTimer);
      return;
    }
    panel.hidden = false;
    views.reward.hidden = state !== S.REWARD;
    views.license.hidden = state !== S.LICENSE;
    if (state === S.REWARD) {
      fillReward();
      // back from the license: straight to the button that opened it
      if (prev === S.LICENSE) { panel.classList.add('is-armed'); $('[data-license]').focus({ preventScroll: true }); } else arm($('[data-archive]'));
    } else {
      fillLicense();
      panel.classList.add('is-armed');
      $('[data-save]').focus({ preventScroll: true });
      say(`Pilot License. Pilot ${formatPilot(pilot)}, score ${r(game.reward.score)}, wave ${game.reward.wave}.`);
    }
  }
  const r = (n) => formatScore(n);

  /* Up and down (or W and S) move between the choices, like a cabinet menu. */
  function nav(dir) {
    const view = current === S.LICENSE ? views.license : views.reward;
    const items = [...view.querySelectorAll('.arcade__action')];
    const i = items.indexOf(document.activeElement);
    items[(i + dir + items.length) % items.length]?.focus({ preventScroll: true });
  }

  function layout(field) {
    W = field.W;
    H = field.H;
    if (current === S.REWARD) fillReward();
    if (current === S.LICENSE) sizeCard();
  }

  $('[data-license]').addEventListener('click', () => game.openLicense());
  $('[data-leave]').addEventListener('click', () => game.leaveReward());
  $('[data-back]').addEventListener('click', () => game.closeLicense());
  $('[data-save]').addEventListener('click', async () => {
    const ok = await exportLicense(licenseImage, pilot);
    say(ok ? 'License saved.' : 'The license could not be saved in this browser.');
  });
  secret.addEventListener('click', () => game.viewSecret());

  return { update, nav, layout };
}
