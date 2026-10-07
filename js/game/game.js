/* The game itself: one state machine, one requestAnimationFrame loop.
   The loop only runs while the game is on screen and not paused; every
   movement is scaled by delta time, capped after a stall or a hidden tab. */

import { COLORS } from './config.js';
import { createBackground } from './background.js';
import { createPlayer } from './player.js';
import { createBullets } from './bullets.js';
import { createEnemies, TYPES } from './enemies.js';
import { planWave, placeGroup } from './waves.js';
import { difficulty } from './difficulty.js';
import { createScore } from './score.js';
import { createParticles } from './particles.js';
import { overlap } from './collision.js';
import { save } from './storage.js';
import { createNotes, SECRET_SCORE } from './notify.js';
import { formatScore } from './license.js';
import { drawHud, drawTitle, drawReady, drawWaveBanner, drawPaused, drawGameOver, drawUnlock } from './hud.js';

export const S = Object.freeze({
  CLOSED: 'closed',
  INTRO: 'intro',
  READY: 'ready',
  PLAYING: 'playing',
  DYING: 'dying',          // the short death sequence between the last hit and GAME OVER
  PAUSED: 'paused',
  GAME_OVER: 'game-over',
  RESTARTING: 'restarting',
  SECRET: 'secret-unlock',  // the short sequence when the score first reaches 25,000
  REWARD: 'reward',         // the reward screen (DOM, see reward.js); the loop is stopped
  LICENSE: 'license',       // the Pilot License, opened from the reward screen
});

const NEXT = {
  [S.CLOSED]: [S.INTRO],
  [S.INTRO]: [S.READY, S.REWARD, S.CLOSED],
  [S.READY]: [S.PLAYING, S.PAUSED, S.CLOSED],
  [S.PLAYING]: [S.PAUSED, S.DYING, S.SECRET, S.CLOSED],
  [S.DYING]: [S.GAME_OVER, S.CLOSED],
  [S.PAUSED]: [S.READY, S.PLAYING, S.CLOSED],
  [S.GAME_OVER]: [S.RESTARTING, S.REWARD, S.CLOSED],
  [S.RESTARTING]: [S.READY, S.CLOSED],
  [S.SECRET]: [S.REWARD, S.CLOSED],
  // back to the run (KEEP PLAYING), or to the screen it was opened from
  [S.REWARD]: [S.PLAYING, S.LICENSE, S.INTRO, S.GAME_OVER, S.CLOSED],
  [S.LICENSE]: [S.REWARD, S.CLOSED],
};

const READY_TIME = 1.4;
const ANNOUNCE_TIME = 1.0;
const COMPLETE_TIME = 1.5;
const RESTART_TIME = 0.5;
const CURTAIN_CELL = 6;
const UNLOCK_TIME = 2.3;   // the unlock sequence, then the reward screen

export function createGame({ canvas, sprites, audio, store, input, reduced, say, onState }) {
  const ctx = canvas.getContext('2d', { alpha: true });
  const bg = createBackground();
  const player = createPlayer();
  const bullets = createBullets();
  const enemies = createEnemies();
  const score = createScore();
  const fx = createParticles();
  const notes = createNotes();

  let state = S.CLOSED;
  let resumeTo = null;
  let stateTime = 0;
  let time = 0;            // free-running clock for blinking and sprite frames
  let raf = 0;
  let last = 0;

  // the screen: the whole canvas (view) and the arena inside it (field)
  const view = { W: 320, H: 180, ox: 0, oy: 0 };
  const field = { W: 320, H: 180, top: 14, bottom: 166 };

  // the run
  let playTime = 0;
  let wave = 1;
  let phase = 'active';    // within PLAYING: announce · active · complete
  let phaseTime = 0;
  let groups = [];
  let waveClock = 0;
  let holdUntil = 0;
  let lastGroupY = null;
  let bonus = 0;
  let record = false;
  let shake = 0;
  let flash = 0;
  let d = difficulty(0, field.W);

  // the secret: where the reward screen was opened from, and the result it shows
  let rewardFrom = null;   // S.SECRET (a run that can go on), S.INTRO or S.GAME_OVER
  let rewardData = null;   // { score, wave, label }

  // the dissolve between the portfolio and the game, and between runs
  let curtain = null;      // { from, to, t, dur, mode: 'clear' | 'fill', done }
  let cells = [];

  /* ---------- states ---------- */
  function setState(next) {
    if (!NEXT[state].includes(next)) return false;
    const prev = state;
    state = next;
    stateTime = 0;
    enter(next, prev);
    onState?.(next);
    return true;
  }

  function enter(next, prev) {
    switch (next) {
      case S.INTRO:
        if (prev === S.REWARD) { start(); break; }
        say('Invader, an 8-bit air raid. Press Space or tap to start. Arrow keys or W and S move the plane, it fires on its own. P pauses, Escape exits.');
        break;
      case S.READY:
        if (prev === S.PAUSED) break;
        newRun();
        say('Wave 1. Get ready.');
        break;
      case S.PLAYING:
        if (prev === S.READY) { phase = 'active'; phaseTime = 0; }
        if (prev === S.REWARD) {
          // KEEP PLAYING: the same run, exactly as it was (score, wave, lives,
          // difficulty, the invaders in flight), with a moment of cover to
          // find the plane again
          player.invulnerable = 1.5;
          input.release();
          say('Back in the air.');
          start();
        }
        break;
      case S.SECRET:
        store.secretUnlocked = true;   // for good, even if the game is closed now
        save(store);
        rewardFrom = S.SECRET;
        rewardData = { score: score.value, wave, label: formatScore(score.value) };
        notes.clear();
        flash = 0.08;
        audio.play('secret');
        say('You found it. Secret unlocked.');
        break;
      case S.REWARD:
        stop();
        render();
        if (prev === S.SECRET) say(`Mission complete. Secret unlocked with ${rewardData.score} points.`);
        break;
      case S.DYING:
        player.v = 0;
        break;
      case S.GAME_OVER: {
        if (prev === S.REWARD) { start(); break; }
        // whatever is left of the wave bursts, so the screen is clear to read
        enemies.list.forEach((e) => { if (!e.dying) destroy(e, false); });
        const s = score.value;
        record = s > store.best && s > 0;
        store.best = Math.max(store.best, s);
        store.bestWave = Math.max(store.bestWave, wave);
        save(store);
        audio.play(record ? 'record' : 'over');
        say(`Game over. Score ${s}. Best ${store.best}. Wave ${wave}.${record ? ' New high score.' : ''} Press Space or tap to restart.`);
        break;
      }
      case S.LICENSE:
        render();
        break;
      case S.PAUSED:
        say('Paused. Press P or tap to resume, Escape to exit.');
        break;
      case S.RESTARTING:
        curtain = { t: 0, dur: RESTART_TIME, mode: 'wipe' };
        break;
      default:
    }
  }

  function newRun() {
    score.reset();
    player.reset(field);
    player.x = -player.w - 4;
    bullets.clear();
    enemies.clear();
    fx.clear();
    input.release();
    playTime = 0;
    wave = 1;
    record = false;
    d = difficulty(0, field.W);
    // the milestones lead to the secret, so they stop once it has been found
    notes.reset(!store.secretUnlocked);
    startWave(false);
  }

  function startWave(announce) {
    groups = planWave(wave, (size) => d.groupGap(size));
    waveClock = 0;
    holdUntil = 0;
    lastGroupY = null;
    phase = announce ? 'announce' : 'active';
    phaseTime = 0;
  }

  /* ---------- actions (keys, taps, buttons) ---------- */
  const actions = {
    action() {
      audio.unlock();
      if (state === S.INTRO && !curtain) { audio.play('start'); setState(S.READY); }
      else if (state === S.PAUSED) actions.resume();
      else if (state === S.GAME_OVER && stateTime > 0.7) { audio.play('start'); setState(S.RESTARTING); }
      else if (state === S.SECRET && stateTime > 0.9) setState(S.REWARD);   // skip the rest of the sequence
    },
    /* The reward screen again, from the title or GAME OVER, once found. */
    viewSecret() {
      if (!store.secretUnlocked || (state !== S.INTRO && state !== S.GAME_OVER)) return;
      rewardFrom = state;
      rewardData = { score: store.best, wave: store.bestWave, label: `BEST ${formatScore(store.best)}` };
      setState(S.REWARD);
    },
    /* KEEP PLAYING (a run in progress) or BACK (to the title or GAME OVER). */
    leaveReward() {
      if (state !== S.REWARD) return;
      setState(rewardFrom === S.SECRET ? S.PLAYING : rewardFrom);
    },
    openLicense() { if (state === S.REWARD) setState(S.LICENSE); },
    closeLicense() { if (state === S.LICENSE) setState(S.REWARD); },
    pause() {
      if (state === S.PAUSED) { actions.resume(); return; }
      if (state !== S.READY && state !== S.PLAYING) return;
      resumeTo = state;
      setState(S.PAUSED);
      stop();
      render();
    },
    resume() {
      if (state !== S.PAUSED) return;
      setState(resumeTo || S.PLAYING);
      say('Resumed.');
      start();
    },
    get canPause() { return state === S.READY || state === S.PLAYING || state === S.PAUSED; },
  };

  /* ---------- update ---------- */
  function fire(x, y) {
    bullets.fire(x, y, d.bulletSpeed);
    audio.play('shot');
  }

  function spawnDue() {
    while (groups.length && groups[0].at <= waveClock && waveClock >= holdUntil) {
      const g = groups[0];
      if (enemies.list.length + g.members.length > d.maxAlive) return;   // wait for room
      groups.shift();
      const cy = placeGroup(g.members, field, lastGroupY, g.slope);
      lastGroupY = cy;
      g.members.forEach((m) => enemies.spawn(m.type, field.W + 2 + m.dx, cy + m.dy - TYPES[m.type].h / 2, {
        speed: d.enemySpeed, phase: m.phase, slope: g.slope * d.drift, aggression: d.aggression,
      }));
      holdUntil = waveClock + d.groupGap(g.members.length) * 0.5;
    }
  }

  function destroy(e, byPlayer) {
    e.dying = 0.06;
    e.flash = 0.06;
    const cx = e.x + e.w / 2;
    const cy = e.y + e.h / 2;
    if (byPlayer) {
      const points = score.kill(TYPES[e.type].score);
      fx.pop(cx, e.y - 9, `+${points}`, score.multiplier() > 1 ? COLORS.green : COLORS.white);
      audio.play('pop');
    }
    const n = reduced ? 4 : e.type === 'heavy' ? 14 : 8;
    fx.burst(cx, cy, { n, color: COLORS.green, speed: 70, life: 0.45, size: e.type === 'heavy' ? 2 : 1 });
    if (!reduced) fx.burst(cx, cy, { n: 3, color: COLORS.white, speed: 40, life: 0.25 });
  }

  function collide() {
    for (const b of bullets.list) {
      if (b.dead) continue;
      for (const e of enemies.list) {
        if (e.dead || e.dying) continue;
        if (!overlap(b, enemies.box(e))) continue;
        b.dead = true;
        e.hp--;
        e.hits++;
        e.flash = 0.07;
        if (e.hp <= 0) destroy(e, true);
        else {
          audio.play('hit');
          fx.burst(b.x + 2, b.y, { n: reduced ? 2 : 4, color: COLORS.white, speed: 50, life: 0.2, dir: Math.PI, spread: 1.6 });
        }
        break;
      }
    }
    if (player.invulnerable > 0 || state !== S.PLAYING) return;
    const pb = player.box();
    for (const e of enemies.list) {
      if (e.dead || e.dying || !overlap(pb, enemies.box(e))) continue;
      destroy(e, false);
      hurt();
      break;
    }
  }

  function hurt() {
    player.lives--;
    score.breakCombo();
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    fx.burst(cx + 4, cy, { n: reduced ? 4 : 10, color: COLORS.warm, speed: 80, life: 0.4 });
    if (!reduced) fx.burst(cx + 4, cy, { n: 5, color: COLORS.white, speed: 60, life: 0.3 });
    shake = reduced ? 0 : 0.18;
    audio.play('hurt');
    if (player.lives > 0) {
      player.invulnerable = 1.1;
      player.hurt = 0.12;
      say(`Hit. ${player.lives} ${player.lives === 1 ? 'life' : 'lives'} left.`);
    } else setState(S.DYING);
  }

  function updateWave(dt) {
    phaseTime += dt;
    if (phase === 'announce' && phaseTime > ANNOUNCE_TIME) { phase = 'active'; phaseTime = 0; }
    if (phase !== 'complete') {
      waveClock += dt;
      spawnDue();
      if (!groups.length && !enemies.list.length) {
        phase = 'complete';
        phaseTime = 0;
        bonus = score.waveBonus(wave);
        audio.play('wave');
        say(`Wave ${wave} complete. Bonus ${bonus}.`);
      }
    } else if (phaseTime > COMPLETE_TIME) {
      wave++;
      startWave(true);
      say(`Wave ${wave}.`);
    }
  }

  // the stars rush by for a moment between waves
  const warp = () => (phase === 'complete' && !reduced ? 1 + 1.6 * Math.sin(Math.min(1, phaseTime / COMPLETE_TIME) * Math.PI) : 1);

  function update(dt) {
    time += dt;
    stateTime += dt;
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);

    if (curtain && curtain.mode !== 'wipe') {
      curtain.t += dt;
      if (curtain.t >= curtain.dur) { const done = curtain.done; curtain = null; done?.(); }
    }

    switch (state) {
      case S.INTRO:
        bg.update(dt, 0.7, 0, reduced);
        break;

      case S.READY: {
        // the plane flies in from the left, a pixel step at a time
        const k = Math.min(1, stateTime / 0.7);
        player.home(field);
        const home = player.x;
        player.x = Math.round(-player.w - 4 + (home + player.w + 4) * (1 - (1 - k) ** 3));
        player.update(dt, input, field, 0, null);
        player.x = k < 1 ? player.x : home;
        bg.update(dt, d.pace, 0, reduced);
        fx.update(dt);
        if (stateTime > READY_TIME) setState(S.PLAYING);
        break;
      }

      case S.PLAYING: {
        playTime += dt;
        d = difficulty(playTime, field.W);
        player.update(dt, input, field, d.fireInterval, phase === 'complete' ? null : fire);
        bullets.update(dt, field.W);
        enemies.update(dt, field, player.y + player.h / 2);
        collide();
        if (state !== S.PLAYING) break;
        if (enemies.sweep() > 0) score.breakCombo();
        updateWave(dt);
        if (phase !== 'complete') score.tick(dt);
        fx.update(dt);
        notes.update(dt);
        bg.update(dt, d.pace * warp(), d.intensity, reduced);
        notes.check(score.value);
        if (!store.secretUnlocked && score.value >= SECRET_SCORE) setState(S.SECRET);
        break;
      }

      case S.SECRET: {
        // the world brakes to a stop in under half a second; sparks settle
        const k = reduced ? 0 : Math.max(0, 1 - stateTime / 0.45);
        enemies.update(dt * k, field, player.y);
        bullets.update(dt * k, field.W);
        bg.update(dt * k, d.pace, d.intensity, reduced);
        fx.update(dt);
        if (stateTime > (reduced ? 1.6 : UNLOCK_TIME)) setState(S.REWARD);
        break;
      }

      case S.DYING: {
        // freeze · flash · break apart with a small shake · then GAME OVER
        const t = stateTime;
        if (t > 0.12 && player.visible && t < 0.2) flash = 0.05;
        if (t >= 0.2 && player.visible) {
          player.visible = false;
          fx.shatter(sprites.planePixels, player.x, Math.round(player.y), player.x + player.w / 2, player.y + player.h / 2, { speed: 85, life: 0.6, keep: reduced ? 0.4 : 1 });
          shake = reduced ? 0 : 0.3;
        }
        if (t > 0.12) {
          const slow = dt * 0.35;
          enemies.update(slow, field, player.y);
          bullets.update(slow, field.W);
          bg.update(slow, d.pace, d.intensity, reduced);
          fx.update(dt);
        }
        if (t > 0.75) setState(S.GAME_OVER);
        break;
      }

      case S.GAME_OVER:
        enemies.update(dt, field, field.H / 2);
        enemies.sweep();
        bullets.update(dt, field.W);
        fx.update(dt);
        bg.update(dt, 0.6, d.intensity, reduced);
        break;

      case S.RESTARTING:
        // the screen wipes shut, the run resets behind it, and it wipes open
        curtain.t += dt;
        bg.update(dt, 0.6, 0, reduced);
        if (curtain.t >= curtain.dur / 2 && !curtain.reset) { curtain.reset = true; enemies.clear(); bullets.clear(); fx.clear(); }
        if (curtain.t >= curtain.dur) { curtain = null; setState(S.READY); }
        break;
      default:
    }
  }

  /* ---------- render ---------- */
  let door = null;     // a 1-pixel checker: the pause screen's dimming
  let door25 = null;   // one pixel in four: a lighter step
  let door75 = null;   // three in four: behind the reward screen
  function pattern(cells) {
    const c = document.createElement('canvas');
    c.width = c.height = cells.length;
    const g = c.getContext('2d');
    g.fillStyle = COLORS.space;
    cells.forEach((row, y) => row.forEach((on, x) => { if (on) g.fillRect(x, y, 1, 1); }));
    return ctx.createPattern(c, 'repeat');
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;   // scaled glyphs and sprites stay hard-edged
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = COLORS.void;
    ctx.fillRect(0, 0, view.W, view.H);

    let sx = 0;
    let sy = 0;
    if (shake > 0) { sx = Math.round((Math.random() - 0.5) * 3); sy = Math.round((Math.random() - 0.5) * 3); }
    ctx.save();
    ctx.translate(view.ox + sx, view.oy + sy);
    ctx.beginPath();
    ctx.rect(0, 0, field.W, field.H);
    ctx.clip();
    ctx.fillStyle = COLORS.space;
    ctx.fillRect(-2, -2, field.W + 4, field.H + 4);

    const frozen = state === S.SECRET || state === S.REWARD || state === S.LICENSE;
    const behind = frozen ? rewardFrom : state;   // what the reward screen sits on
    const playing = state === S.READY || state === S.PLAYING || state === S.DYING || state === S.PAUSED || behind === S.SECRET;
    bg.draw(ctx, state === S.PLAYING ? d.pace * warp() : 1, behind === S.INTRO ? 0 : d.intensity, reduced);
    if (behind !== S.INTRO) {
      enemies.draw(ctx, sprites, time);
      bullets.draw(ctx);
      if (playing && (state !== S.DYING || stateTime < 0.2)) {
        if (state === S.DYING && stateTime > 0.12) ctx.drawImage(sprites.planeFlash[player.frame], player.x, Math.round(player.y));
        else player.draw(ctx, sprites, time);
      }
      fx.draw(ctx);
    }

    const info = {
      sprites, time, touch: input.touch, best: store.best, wave, score: score.value,
      multiplier: score.multiplier(), lives: player.lives, phase, phaseTime, bonus, record,
    };
    if (playing) drawHud(ctx, field, info);
    if (state === S.INTRO) drawTitle(ctx, field, info);
    if (state === S.READY) drawReady(ctx, field, { ...info, time: stateTime });
    if (state === S.PLAYING) { drawWaveBanner(ctx, field, info); notes.draw(ctx, field, reduced); }
    if (state === S.GAME_OVER) drawGameOver(ctx, field, { ...info, phaseTime: stateTime });
    if (!door) {
      door = pattern([[1, 0], [0, 1]]);
      door25 = pattern([[1, 0], [0, 0]]);
      door75 = pattern([[1, 1], [0, 1]]);
    }
    if (state === S.PAUSED) drawPaused(ctx, field, { ...info, door });
    if (state === S.SECRET) {
      // darken in two screen-door steps, then the words
      const t = stateTime;
      if (t > 0.2) { ctx.fillStyle = t > 0.45 ? door : door25; ctx.fillRect(0, 0, field.W, field.H); }
      drawUnlock(ctx, field, { t, label: rewardData.label });
    }
    // the reward screen and the license: the frozen frame, dimmed, behind the buttons
    if (state === S.REWARD || state === S.LICENSE) {
      ctx.fillStyle = door75;
      ctx.fillRect(0, 0, field.W, field.H);
    }
    if (flash > 0) {
      ctx.fillStyle = COLORS.white;
      ctx.globalAlpha = 0.18;
      ctx.fillRect(0, 0, field.W, field.H);
      ctx.globalAlpha = 1;
    }
    if (state === S.RESTARTING && curtain) wipe(curtain.t / curtain.dur);
    ctx.restore();

    if (curtain && curtain.mode === 'clear') dissolve(curtain.from + (curtain.to - curtain.from) * Math.min(1, curtain.t / curtain.dur));
  }

  /* Restart wipe: columns of blocks close from the right, then open. */
  function wipe(p) {
    const cols = Math.ceil(field.W / CURTAIN_CELL);
    const shut = p < 0.5 ? p * 2 : (1 - p) * 2;   // 0 → 1 → 0
    ctx.fillStyle = COLORS.space;
    for (let c = 0; c < cols; c++) {
      const order = (cols - 1 - c) / cols;
      for (let r = 0; r * CURTAIN_CELL < field.H; r++) {
        if (order + ((r * 7 + c * 3) % 5) * 0.03 < shut * 1.15) ctx.fillRect(c * CURTAIN_CELL, r * CURTAIN_CELL, CURTAIN_CELL, CURTAIN_CELL);
      }
    }
  }

  /* Open and close: the game appears over the page block by block in a
     scattered order (cleared blocks show the portfolio underneath). */
  function dissolve(shown) {
    if (shown >= 1) return;
    for (const c of cells) if (c.t >= shown) ctx.clearRect(c.x, c.y, CURTAIN_CELL, CURTAIN_CELL);
  }

  function makeCells() {
    cells = [];
    for (let y = 0; y < view.H; y += CURTAIN_CELL) for (let x = 0; x < view.W; x += CURTAIN_CELL) cells.push({ x, y, t: Math.random() * 0.85 + (Math.abs(x / view.W - 0.5) + Math.abs(y / view.H - 0.5)) * 0.15 });
  }

  /* ---------- loop ---------- */
  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    update(dt);
    if (raf) { render(); raf = requestAnimationFrame(frame); }
  }
  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  /* ---------- outside ---------- */
  function resize(layout) {
    const sx = layout.W / field.W;
    const sy = layout.H / field.H;
    Object.assign(view, { W: layout.VW, H: layout.VH, ox: layout.ox, oy: layout.oy });
    Object.assign(field, { W: layout.W, H: layout.H, top: layout.top, bottom: layout.H - 13 });
    bg.resize(field.W, field.H);
    if (state !== S.CLOSED) {
      enemies.list.forEach((e) => { e.x *= sx; e.y0 *= sy; e.y *= sy; });
      bullets.list.forEach((b) => { b.x *= sx; b.y *= sy; });
      player.y *= sy;
      if (state !== S.READY) player.home(field);
      player.clampTo(field);
    } else player.reset(field);
    makeCells();
    if (!raf && state !== S.CLOSED) render();
  }

  function open(done) {
    setState(S.INTRO);
    const dur = reduced ? 0.001 : 0.42;
    curtain = { mode: 'clear', from: 0, to: 1, t: 0, dur, done };
    start();
  }

  function close(done) {
    if (state === S.CLOSED) return;
    const finish = () => { stop(); state = S.CLOSED; onState?.(S.CLOSED); done?.(); };
    if (reduced) { finish(); return; }
    // play the dissolve backwards, even from a paused frame
    curtain = { mode: 'clear', from: 1, to: 0, t: 0, dur: 0.3, done: finish };
    if (!raf) {
      // the loop is stopped (paused, reward screen): run just the dissolve
      const step = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        curtain.t += dt;
        render();
        if (curtain.t >= curtain.dur) finish(); else raf = requestAnimationFrame(step);
      };
      last = performance.now();
      raf = requestAnimationFrame(step);
    } else start();
  }

  return {
    get state() { return state; },
    open, close, resize, stop,
    ...actions,
    get canPause() { return actions.canPause; },
    get planeCenter() { return player.y + player.h / 2; },
    get reward() { return rewardData && { ...rewardData, canContinue: rewardFrom === S.SECRET }; },
    get secretUnlocked() { return store.secretUnlocked; },
    render,
    // Escape pauses a run; anywhere else it leaves the game
    escapeLeaves: () => state !== S.READY && state !== S.PLAYING,
  };
}
