/* ==========================================================================
   Reveals for the sections outside the story (styles: css/motion.css).
   ========================================================================== */

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const reveal = (el) => {
  el.classList.add("is-in");
  el.querySelectorAll("[data-reveal]").forEach((child) => child.classList.add("is-in"));
};

// Each direct child of a stagger group gets its index; nested reveals inherit it.
document.querySelectorAll("[data-stagger]").forEach((group) => {
  [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
});

// Observe only outermost units: groups, and reveals not inside another unit.
const units = [...document.querySelectorAll("[data-stagger], [data-reveal]")].filter(
  (el) => !el.closest("[data-onload]") && !el.parentElement.closest("[data-stagger], [data-reveal]"),
);

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  units.forEach(reveal);
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Also release anything already scrolled past (a reload mid-page).
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  units.forEach((el) => io.observe(el));
}

// Hero: once fonts are in, so lines don't reflow mid-animation.
document.fonts.ready.then(() =>
  requestAnimationFrame(() => document.querySelectorAll("[data-onload]").forEach(reveal)),
);
