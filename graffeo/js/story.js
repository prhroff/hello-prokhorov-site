/* ==========================================================================
   Story — vertical scroll drives one horizontal track of the three Figma
   slides inside a sticky stage. No controls, no snapping. Markup: [data-story].
   ========================================================================== */

/* Scroll gives a position q from 0 to 2; slide i is at rest when q = i.
   The track pans q slide-widths; inside each slide every layer is a smooth
   function of d = q − i, so any stopping point is a clean in-between. */
const DWELL = {
  ends: 0.22,     // extra hold on the first and last slide (slide units)
  between: 0.1,   // hold at both ends of each transition (fraction of it)
};

const DEPTH = {
  drift: 3.5,     // % the photograph slides inside its frame, against the travel
  scale: 0.08,    // photograph is 1.08 one slide away, 1 at rest
  kicker: 0.05,   // type runs a little ahead of the frame (× slide width):
  heading: 0.09,  // kicker, heading, then body — a soft stagger
  text: 0.14,
};

// Opacity by |d|: fully present at rest, gone well before the slide leaves.
const FADE = { kicker: [0.2, 0.7], heading: [0.15, 0.6], text: [0.1, 0.55] };

const SMOOTHING_MS = { fine: 150, coarse: 50 };  // inertia on the scroll position

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const easeInOutSine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);

const root = document.querySelector("[data-story]");
if (root) init(root);

function init(root) {
  const stage = root.querySelector(".story__stage");
  const track = root.querySelector(".story__track");
  const slides = [...root.querySelectorAll(".slide")].map((el) => ({
    el,
    img: el.querySelector(".slide__img"),
    layers: [
      [el.querySelector(".slide__kicker"), DEPTH.kicker, FADE.kicker],
      [el.querySelector(".slide__heading"), DEPTH.heading, FADE.heading],
      [el.querySelector(".slide__text"), DEPTH.text, FADE.text],
      [el.querySelector(".slide__count"), DEPTH.kicker, FADE.kicker],
    ],
  }));
  const LAST = slides.length - 1;

  // Must match the static block at the end of css/story.css.
  const staticLayout = matchMedia("(prefers-reduced-motion: reduce), (max-height: 480px) and (orientation: landscape)");
  const coarse = matchMedia("(pointer: coarse)");

  let W = 0; // slide width, measured on reset only

  function target() {
    const vh = stage.clientHeight;
    const rect = root.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, root.offsetHeight - vh));
    const raw = clamp(p * (LAST + 2 * DWELL.ends) - DWELL.ends, 0, LAST);
    const gap = Math.min(Math.floor(raw), LAST - 1);
    const q = gap + easeInOutSine(clamp((raw - gap - DWELL.between) / (1 - 2 * DWELL.between)));
    return { q, arrival: clamp(1 - rect.top / vh) }; // arrival: 0 below the fold → 1 filling the stage
  }

  const fade = ([a, b], d) => 1 - smoothstep(a, b, Math.abs(d));

  function draw({ q, arrival }) {
    track.style.transform = `translate3d(${(-q * W).toFixed(2)}px, 0, 0)`;
    slides.forEach((s, i) => {
      if (Math.abs(q - i) > 1.05) return;
      let d = q - i;
      if (i === 0) d -= (1 - arrival) * 0.5; // slide 01 settles in as the section arrives
      const dd = clamp(d, -1, 1);
      s.img.style.transform = `translate3d(${(dd * DEPTH.drift).toFixed(3)}%, 0, 0) scale(${(1 + DEPTH.scale * Math.abs(dd)).toFixed(4)})`;
      for (const [el, k, f] of s.layers) {
        el.style.opacity = fade(f, d).toFixed(4);
        el.style.transform = `translate3d(${(-dd * k * W).toFixed(2)}px, 0, 0)`;
      }
    });
  }

  function clear() {
    track.removeAttribute("style");
    for (const s of slides) {
      s.img.style.transform = "";
      // Only what this script sets: the elements' own --x / --y stay in place.
      for (const [el] of s.layers) {
        el.style.opacity = "";
        el.style.transform = "";
      }
    }
  }

  let current = null;
  let last = 0;
  let running = false;

  function tick(now) {
    if (staticLayout.matches) {
      clear();
      current = null;
      running = false;
      return;
    }
    if (current === null) W = slides[0].el.offsetWidth;
    const goal = target();
    if (current === null) current = goal;
    else {
      const k = 1 - Math.exp(-Math.min(64, now - last) / (coarse.matches ? SMOOTHING_MS.coarse : SMOOTHING_MS.fine));
      current = { q: current.q + (goal.q - current.q) * k, arrival: current.arrival + (goal.arrival - current.arrival) * k };
    }
    last = now;
    const settled = Math.abs(goal.q - current.q) < 1e-4 && Math.abs(goal.arrival - current.arrival) < 1e-4;
    if (settled) current = goal;
    draw(current);
    if (settled) running = false;
    else requestAnimationFrame(tick);
  }

  function wake() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }
  function reset() { current = null; wake(); }

  addEventListener("scroll", wake, { passive: true });
  addEventListener("resize", reset);
  staticLayout.addEventListener("change", reset);
  wake();
}
