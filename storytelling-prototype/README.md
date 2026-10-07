# Graffeo — storytelling prototype

Standalone. Nothing here imports from, or is imported by, the main site.

## Preview

```sh
cd storytelling-prototype
python -m http.server 8765   # then open http://localhost:8765
```

(Opening `index.html` directly also works in most browsers; a local server is more reliable for fonts.)

## Swapping photography

All image paths, alt text and credits live in `STORY_IMAGES` at the top of `script.js`.
Each image has a large and a small file; focal points are set per slide with `--focus` in `styles.css`.

## How the motion works

The three slides sit on one horizontal track. Vertical scroll produces a continuous
track position `q` (0 → 2); every layer's position, scale and opacity is a smooth function
of its distance from `q`, so any stopping point is a composed in-between state.
A light inertia filter follows the scroll so wheel notches become a glide.

- Desktop: slides travel 80% of the stage width; type moves slightly faster than the photos,
  photos drift inside their frames, and slide 3's dark page sweeps in from the right.
- Phones / portrait tablets: 30% travel, earlier type hand-off, the dark page fades in.
- Phones in landscape: plain stacked sequence, no sticky stage.
- `prefers-reduced-motion`: no transforms or inertia; crossfades only.

## Tuning

- Scroll length: `--story-height` in `styles.css` (440vh desktop, 330vh compact).
- Motion: `TRACK`, `DEPTH`, `FADE`, `FADE_COMPACT`, `SMOOTHING_MS` at the top of `script.js`.
- Compositions: each `.slide--n` block in `styles.css` places the frame (`--fx/--fy/--fw/--fh`),
  heading (`--hx/--hy/--hs`), kicker and text in viewport units. Slide 2's heading is drawn twice
  (ink outside the photo, cream inside it); script.js keeps the two copies registered while the
  frame moves and scales.

## Fonts

`assets/fonts/` holds local copies of the desktop PP Editorial New and Futura PT files, for
prototyping only. Use web-licensed `.woff2` builds before anything is published.

## Placeholder photography (Unsplash)

- 01 — Leo_Visions, https://unsplash.com/photos/DAaUESxk2kM
- 02 — Stephan Widua, https://unsplash.com/photos/r5KuHb6z8iQ
- 03 — Nathan Dumlao, https://unsplash.com/photos/N3btvQ51dL0
