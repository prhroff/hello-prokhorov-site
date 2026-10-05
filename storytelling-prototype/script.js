/* ==========================================================================
   Graffeo — storytelling prototype
   Scroll position drives every transition. No autoplay, no controls.
   ========================================================================== */

/* --- Images: the one place to swap placeholders for final photography ---- */
const STORY_IMAGES = {
  northBeach: {
    src: "assets/image-01.jpg",
    srcSmall: "assets/image-01-sm.jpg",
    widths: [1100, 2200],
    alt: "Columbus Avenue in North Beach, San Francisco, with the Gino and Carlo sign and pastel storefronts",
    credit: { name: "Leo_Visions", url: "https://unsplash.com/photos/DAaUESxk2kM" },
  },
  graffeo: {
    src: "assets/image-02.jpg",
    srcSmall: "assets/image-02-sm.jpg",
    widths: [1000, 2000],
    alt: "Interior of an old café with a wooden counter, stools and hanging lamps",
    credit: { name: "Stephan Widua", url: "https://unsplash.com/photos/r5KuHb6z8iQ" },
  },
  coffee: {
    src: "assets/image-03.jpg",
    srcSmall: "assets/image-03-sm.jpg",
    widths: [900, 1600],
    alt: "A hand pouring coffee from a glass carafe into a white mug",
    credit: { name: "Nathan Dumlao", url: "https://unsplash.com/photos/N3btvQ51dL0" },
  },
};

/* --- Track ---------------------------------------------------------------
   The three slides sit on one horizontal track. Vertical scroll gives a
   continuous position q in [0, 2]; slide i is at rest when q = i. Every
   property of every layer is a smooth function of d = q - i, so stopping
   anywhere mid-transition shows a deliberate in-between spread. */
const TRACK = {
  spacing: 0.8,         // distance between slides, x stage width (desktop)
  spacingCompact: 0.3,  // phones / portrait tablets: shorter travel, more crossfade
  restEnds: 0.22,       // extra dwell on the first and last slide, in slide units
  restBetween: 0.1,     // dwell at each end of a transition (fraction of the gap)
};

const DEPTH = {
  heading: 1.12,   // type travels a little faster than the photograph,
  text: 1.2,       // and the supporting copy slightly faster again
  imageDrift: 2.5, // % the photo slides inside its frame, against the travel
  scaleOut: 0.02,  // leaving: 1 -> 0.98
  scaleIn: 0.04,   // entering: 1.04 -> 1
};

// Opacity windows over d (negative: still to come, positive: leaving).
const FADE = {
  image:   { in: [-1.0, -0.3], out: [0.3, 1.0] },
  heading: { in: [-0.75, -0.15], out: [0.15, 0.7] },
  text:    { in: [-0.6, -0.05], out: [0.1, 0.6] },
};
// With the shorter compact travel, headings would overlap mid-way: hand over instead.
const FADE_COMPACT = {
  image:   FADE.image,
  heading: { in: [-0.5, -0.08], out: [0.08, 0.5] },
  text:    { in: [-0.42, -0.02], out: [0.04, 0.42] },
};

// Inertia on the scroll position: turns wheel notches into a glide.
const SMOOTHING_MS = { fine: 150, coarse: 50 };

/* ------------------------------------------------------------------------ */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeInOutSine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);

const section = document.querySelector(".story");
const stage = section.querySelector(".story__stage");
const counter = stage.querySelector(".story__current");
const slides = [...section.querySelectorAll(".slide")].map((el) => ({
  el,
  frame: el.querySelector(".slide__frame"),
  img: el.querySelector(".slide__img"),
  ground: el.querySelector(".slide__ground"),
  heading: el.querySelector(".slide__heading:not(.slide__heading--inset)"),
  inset: el.querySelector(".slide__heading--inset"),
  kicker: el.querySelector(".slide__kicker"),
  text: el.querySelector(".slide__text"),
}));
const LAST = slides.length - 1;

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const staticLayout = matchMedia("(max-height: 480px) and (orientation: landscape)");
const compactLayout = matchMedia("(max-width: 760px), (max-aspect-ratio: 5/6)");
const coarsePointer = matchMedia("(pointer: coarse)");

/* --- Images & credits ---------------------------------------------------- */
section.querySelectorAll("img[data-image]").forEach((img) => {
  const data = STORY_IMAGES[img.dataset.image];
  if (!data) return;
  img.srcset = `${data.srcSmall} ${data.widths[0]}w, ${data.src} ${data.widths[1]}w`;
  img.sizes = "(max-width: 760px) 100vw, 64vw";
  img.src = data.src;
  img.alt = data.alt;
});

const credits = document.querySelector("[data-credits]");
if (credits) {
  credits.innerHTML = Object.values(STORY_IMAGES)
    .map(({ credit }) => `<a href="${credit.url}">${credit.name}</a>`)
    .join(", ");
}

/* --- Scroll -> track position --------------------------------------------- */
function measure() {
  const vh = stage.clientHeight;
  const rect = section.getBoundingClientRect();
  const range = Math.max(1, section.offsetHeight - vh);
  const p = clamp(-rect.top / range);

  // Raw position with a dwell before the first and after the last transition.
  const raw = clamp(p * (LAST + 2 * TRACK.restEnds) - TRACK.restEnds, 0, LAST);

  // Short rest at both ends of each gap, then a gentle sine ease between.
  const gap = Math.min(Math.floor(raw), LAST - 1);
  const r = TRACK.restBetween;
  const q = gap + easeInOutSine(clamp((raw - gap - r) / (1 - 2 * r)));

  return { q, arrival: clamp(1 - rect.top / vh) };
}

/* --- Rendering -------------------------------------------------------------- */
const px = (n) => `${n.toFixed(2)}px`;
const groundFade = (d) => smooth(-0.6, -0.15, d);
const fade = ({ in: a, out: b }, d) => (d < 0 ? smooth(a[0], a[1], d) : 1 - smooth(b[0], b[1], d));

function render(s, d, W, stageW, motion, fades, compact) {
  const m = motion ? 1 : 0;
  const travel = -d * W * m; // px; negative = moved left

  const imageOpacity = fade(fades.image, d);
  const headingOpacity = fade(fades.heading, d);
  const textOpacity = fade(fades.text, d);

  if (s.ground) {
    // Desktop: the dark page sweeps in across the full stage, like the next spread.
    // Compact / reduced motion: it fades in, riding the same short travel as the photo.
    const sweep = motion && !compact;
    const edge = sweep ? clamp(-d, 0, 1) * stageW : Math.max(0, travel);
    s.ground.style.transform = `translate3d(${px(edge)}, 0, 0)`;
    s.ground.style.opacity = sweep ? "1" : groundFade(d).toFixed(4);
  }

  // Frame rides the track and scales very slightly.
  const dd = clamp(d, -1, 1);
  const scale = 1 + m * (dd > 0 ? -DEPTH.scaleOut * dd : DEPTH.scaleIn * -dd);
  s.frame.style.opacity = imageOpacity.toFixed(4);
  s.frame.style.transform = `translate3d(${px(travel)}, 0, 0) scale(${scale.toFixed(4)})`;

  // The photo drifts a touch against the travel, inside its frame.
  s.img.style.transform = `translate3d(${(m * dd * DEPTH.imageDrift).toFixed(3)}%, 0, 0)`;

  // Type rides the same track, a little faster.
  const headingX = travel * DEPTH.heading;
  s.heading.style.opacity = headingOpacity.toFixed(4);
  s.heading.style.transform = `translate3d(${px(headingX)}, 0, 0)`;

  if (s.inset) {
    // Lives inside the scaled frame: undo the scale (origin is the frame centre, set in CSS)
    // and add only the offset between heading and frame, so both copies stay registered.
    const u = (headingX - travel) / scale;
    s.inset.style.opacity = headingOpacity.toFixed(4);
    s.inset.style.transform = `translate3d(${px(u)}, 0, 0) scale(${(1 / scale).toFixed(5)})`;
  }

  const textTransform = `translate3d(${px(travel * DEPTH.text)}, 0, 0)`;
  for (const el of [s.text, s.kicker]) {
    el.style.opacity = textOpacity.toFixed(4);
    el.style.transform = textTransform;
  }

  const groundVisible = s.ground && d > -1;
  s.el.style.visibility = groundVisible || Math.max(imageOpacity, headingOpacity, textOpacity) >= 0.001 ? "visible" : "hidden";
}

let shown = -1;
function setCounter(index) {
  if (index === shown) return;
  shown = index;
  counter.classList.add("is-changing");
  setTimeout(() => {
    counter.textContent = String(index + 1).padStart(2, "0");
    counter.classList.remove("is-changing");
  }, 200);
}

// Measured on reset only, so drawing never forces a layout.
let layout = null;
function measureLayout() {
  const stageW = stage.clientWidth;
  layout = {
    stageW,
    counterLeft: counter.parentElement.offsetLeft,
    counterWidth: counter.parentElement.offsetWidth,
  };
}

function draw(q, arrival) {
  const motion = !reducedMotion.matches;
  const compact = compactLayout.matches;
  const { stageW, counterLeft, counterWidth } = layout;
  const W = stageW * (compact ? TRACK.spacingCompact : TRACK.spacing);
  const fades = compact ? FADE_COMPACT : FADE;

  slides.forEach((s, i) => {
    let d = q - i;
    // The first slide also eases in from the right as the section arrives.
    if (i === 0) d -= (1 - arrival) * 0.45;
    render(s, d, W, stageW, motion, fades, compact);
  });

  // The counter turns cream as the dark ground passes behind it.
  const d3 = q - LAST;
  const covered = motion && !compact
    ? clamp((counterLeft + counterWidth - clamp(-d3, 0, 1) * stageW) / counterWidth)
    : groundFade(d3);
  stage.style.setProperty("--warm", covered.toFixed(4));
  setCounter(Math.round(q));
}

function clearStyles() {
  for (const s of slides) {
    for (const el of [s.el, s.frame, s.img, s.heading, s.inset, s.kicker, s.text]) el?.removeAttribute("style");
  }
  stage.style.removeProperty("--warm");
}

/* --- Loop: follow the scroll with a little inertia, then go idle ---------- */
let current = null;
let last = 0;
let running = false;

function tick(now) {
  if (staticLayout.matches) {
    clearStyles();
    running = false;
    return;
  }

  if (current === null) measureLayout();
  const target = measure();
  const instant = current === null || reducedMotion.matches;
  const tau = coarsePointer.matches ? SMOOTHING_MS.coarse : SMOOTHING_MS.fine;
  const k = instant ? 1 : 1 - Math.exp(-Math.min(64, now - last) / tau);
  last = now;

  current = instant
    ? target
    : {
        q: current.q + (target.q - current.q) * k,
        arrival: current.arrival + (target.arrival - current.arrival) * k,
      };

  const settled = Math.abs(target.q - current.q) < 1e-4 && Math.abs(target.arrival - current.arrival) < 1e-4;
  if (settled) current = target;

  draw(current.q, current.arrival);

  if (settled) running = false;
  else requestAnimationFrame(tick);
}

function wake() {
  if (running) return;
  running = true;
  last = performance.now();
  requestAnimationFrame(tick);
}

function reset() {
  current = null;
  wake();
}

addEventListener("scroll", wake, { passive: true });
addEventListener("resize", reset);
for (const mq of [reducedMotion, staticLayout, compactLayout]) mq.addEventListener("change", reset);
wake();
