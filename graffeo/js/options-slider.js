/* ==========================================================================
   Gifting Options — a native horizontal scroller (drag, trackpad, keyboard)
   with the Figma progress line and arrows wired to it. Markup: [data-slider].
   ========================================================================== */

for (const root of document.querySelectorAll("[data-slider]")) init(root);

function init(root) {
  const viewport = root.querySelector("[data-slider-viewport]");
  const thumb = root.querySelector("[data-slider-thumb]");
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // Arrows use the Figma states: green when active, light grey when there's nowhere to go.
  const setEnabled = (btn, on) => {
    btn.disabled = !on;
    const img = btn.querySelector("img");
    const src = on ? img.dataset.on : img.dataset.off;
    if (img.getAttribute("src") !== src) img.src = src;
  };

  const step = () => {
    const card = viewport.querySelector("li");
    return card.offsetWidth + parseFloat(getComputedStyle(card.parentElement).columnGap || 0);
  };
  const go = (dir) => viewport.scrollBy({ left: dir * step(), behavior: reducedMotion.matches ? "auto" : "smooth" });
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  let queued = false;
  function update() {
    queued = false;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const p = max > 0 ? clamp(viewport.scrollLeft / max) : 0;
    thumb.style.setProperty("--p", p.toFixed(4));
    setEnabled(prev, p > 0.001);
    setEnabled(next, max > 1 && p < 0.999);
  }
  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  viewport.addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  update();
}

function clamp(v) {
  return Math.min(1, Math.max(0, v));
}
