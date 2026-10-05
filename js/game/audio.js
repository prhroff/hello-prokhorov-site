/* 8-bit sound from plain Web Audio oscillators and a burst of noise: no
   audio files. Nothing is created until the player's first key press or tap
   (browsers require it, and the game never makes a sound uninvited). */

export function createAudio(muted) {
  let ctx = null;
  let master = null;
  let noise = null;
  let on = !muted;

  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.14;
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  /* One square/triangle note sliding from f0 to f1. */
  function tone(f0, f1, dur, { type = 'square', gain = 0.5, at = 0 } = {}) {
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function crash(dur, { gain = 0.6, cutoff = 1800, at = 0 } = {}) {
    const t = ctx.currentTime + at;
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = noise;
    f.type = 'lowpass';
    f.frequency.setValueAtTime(cutoff, t);
    f.frequency.exponentialRampToValueAtTime(120, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f).connect(g).connect(master);
    s.start(t);
    s.stop(t + dur + 0.02);
  }

  const notes = (list, step, opts) => list.forEach((f, i) => tone(f, f, step * 1.1, { ...opts, at: i * step }));

  const SOUNDS = {
    shot: () => tone(1400, 700, 0.04, { gain: 0.07 }),
    hit: () => tone(320, 180, 0.06, { gain: 0.3 }),
    pop: () => { crash(0.18, { gain: 0.45, cutoff: 2600 }); tone(660, 110, 0.12, { gain: 0.18 }); },
    hurt: () => { crash(0.3, { gain: 0.7, cutoff: 1200 }); tone(220, 55, 0.3, { gain: 0.35 }); },
    wave: () => notes([523, 659, 784, 1047], 0.07, { gain: 0.22 }),
    start: () => notes([392, 523, 784], 0.06, { gain: 0.2 }),
    over: () => { crash(0.5, { gain: 0.8, cutoff: 900 }); notes([392, 330, 262, 196], 0.14, { gain: 0.25, type: 'triangle' }); },
    record: () => notes([523, 659, 784, 1047, 784, 1047, 1319], 0.08, { gain: 0.22 }),
    secret: () => { crash(0.25, { gain: 0.35, cutoff: 3000 }); notes([392, 523, 659, 784, 1047, 1319, 1568], 0.09, { gain: 0.22 }); },
  };

  return {
    unlock,
    play(name) { if (on && ctx && ctx.state === 'running') SOUNDS[name](); },
    get on() { return on; },
    toggle() { on = !on; if (on) unlock(); return on; },
    close() { if (ctx) ctx.close(); ctx = null; },
  };
}
