# Graffeo — Corporate Gifting page

Static page, no build step. Separate from the portfolio site at the repo root.

**Source of truth:** Figma `ySnBYXH2NBmxrVP1HAwKnq`
- Desktop: "Gifting Page / Desktop / 1440 / Final" (node `1996:327`, page 📌 Desktop)
- Mobile: "Gifting Page / Mobile / 393" (node `286:1975`, page 📌 Mobile) — not yet applied, see Notes

Preview: `python -m http.server 8080` in this folder → http://localhost:8080

## Structure

```
index.html              Header → Hero → Story (3 slides) → Gifting Solutions →
                        Gifting Options → Testimonials → FAQ → Footer
css/tokens.css          fonts, colours, type sizes, page scale, reset, shared text styles
css/layout.css          section frame, button, slider lines + arrows
css/header.css          Figma 1996:328
css/hero.css            Figma 1996:345
css/story.css           Figma 1997:805 — the three slides on a horizontal track
css/solutions.css       Figma 1996:351
css/options.css         Figma 1996:402
css/testimonial.css     Figma 1996:433
css/faq.css             Figma 1996:435
css/footer.css          Figma 1996:452
css/motion.css          reveal styles for everything outside the story
js/story.js             vertical scroll → horizontal track, per-layer motion
js/reveal.js            viewport reveals, hero entrance
js/options-slider.js    gifting options scroller: arrows + progress line
assets/img/             Figma exports; assets/_unused holds files from the previous build
```

## Scale

`1rem` = 10 Figma px. On desktop (≥ 1024px) the root font size is `100vw / 144`,
so the page is the 1440 Figma frame at any width (capped at 1920). Every value in
the CSS is the Figma value ÷ 10: `padding: 4.8rem 4rem` is Figma's 48 / 40.
Text at 16px and below has a small legibility floor (`--fs-*` in tokens.css).

## Story

Each slide is its Figma frame: a 1440 × 960 canvas (`.slide__canvas`) with every
element at its Figma x / y, set inline as `--x` / `--y` (Figma px ÷ 10). The canvas
scale `--s` fits the stage by width, or by height on short screens (keeping ≥ 56px
above and below the 690px content row). Slide 03's photograph runs to the stage's
right and top/bottom edges, as in Figma.

Motion (js/story.js): the track pans by scroll position; photographs drift and settle
from 1.08 → 1; kicker, heading and body run slightly ahead and fade near the edges.
Tuning: `DWELL`, `DEPTH`, `FADE` at the top of the file.

Phones / portrait tablets: each slide stacks (kicker, image, copy, counter) and the
track still pans. Reduced motion and landscape phones: the slides follow each other
vertically at their full compositions.

## Notes

- **Mobile layout is provisional.** The Figma mobile frame exists (header 90, hero 600,
  solutions 1491, options 645, testimonials 500, FAQ 992, footer 764) but its details
  couldn't be read (Figma MCP Starter-plan limit). Rebuild the `max-width: 1023px`
  rules from it once it's readable.
- Slide 02's body copy in Figma repeats slide 01's; reproduced as-is.
- One testimonial and no FAQ answers in Figma: those controls are styled, not wired.
- Use web-licensed `.woff2` fonts before publishing.
