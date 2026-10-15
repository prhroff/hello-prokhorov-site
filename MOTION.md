# Motion tokens

What the site's animation actually uses today (audit of 15 Oct 2026, Linear ART-25).
`css/main.css`, `css/transitions.css`, `js/main.js`, `js/transitions.js`, plus the
standalone pages `css/lost.css` (404) and `css/archive.css` (the Archive).

Use this list when adding motion: pick a token, don't invent a value. Anything not
listed here is an outlier and needs a reason.

## Easing

| Token | Curve | Where | Character |
|---|---|---|---|
| `--ease` / `EASE_OUT` | `cubic-bezier(0.16, 1, 0.3, 1)` | almost everything: hovers, reveals, FAQ, accordions, case cover, consent banner, 404, Archive | fast start, long soft landing (expo-out) |
| `EASE_OUT_Q` | `cubic-bezier(0.22, 1, 0.36, 1)` | mobile menu opening | a slightly firmer `--ease` |
| `EASE_IN_Q` | `cubic-bezier(0.64, 0, 0.78, 0)` | menu closing, blog topic switch (leaving) | exits: accelerates away |
| `EASE_IN` | `cubic-bezier(0.7, 0, 0.84, 0)` | loader text leaving, copy-email label leaving | exits, a touch sharper |
| `EASE_IO` | `cubic-bezier(0.76, 0, 0.24, 1)` | loader curtain, case grow (picture → cover) | big moves that start and stop on screen |
| `EASE` (sheet) | `cubic-bezier(0.65, 0, 0.35, 1)` | page transition sheet (`js/transitions.js`) | smooth in and out, no overshoot |
| `linear` | — | opacity cross-fades in the menu, marquee, scroll-driven drift, services word scrub | |
| `ease-in-out` | — | idle loops only: status dots, clock colon | |
| `steps(1, end)` | — | pixel art: footer invader, process blink | |

JS-driven physics (not tokens): ring intro `1 - (1 - x)^3`, reviews drag settle
`1 - (1 - t)^4`, smooth scroll and 404 drag use damping factors.

**Rule:** enter with `--ease`, leave with `EASE_IN_Q`, cross the whole screen with
`EASE_IO`. `EASE_OUT_Q` and `EASE_IN` are near-duplicates of those and can be folded
in when the code is next touched.

## Durations

Grouped by role. Values in the code cluster on these steps.

| Step | Role | Examples |
|---|---|---|
| 0.2–0.26s | instant feedback, exits of small things | label leaving 200ms, menu fade 220–260ms, topic leaving 260ms, cursor text 0.25s |
| **0.3s** | **colour and press** (the default; ~45 uses) | link/button colour, background, `:active` scale |
| 0.4–0.55s | small moves on hover | arrows nudge 0.4–0.45s, roll arrows 0.55s, accordion close 350–450ms, loader text 450ms |
| 0.6–0.7s | text roll and swap | `.roll` 0.6s, `.swap` 0.7s, accordion/FAQ open 500–650ms, page sheet 650ms |
| **0.9–1.2s** | **entrances** | words 0.9s, list text 0.9s, rows/hairlines 1.2s, menu cards 720ms, cover title 1.1s, case grow 1.1s, image opacity 1s |
| 1.4–1.9s | slow settle of images | image scale-in 1.6s, case cover 1.6s, service frame 1.9s |
| 2s+ | loops only | status dot 2.4s / 3.6s, colon 2s, invader 2.4s, marquee 22s |

## Stagger

| Step | Where |
|---|---|
| 12–16ms | spark burst, return-visit words |
| 28–45ms | per character / word (`--i`): headline words 45ms, service title letters 28ms, menu links 45ms, form options 45ms |
| 70–90ms | per item (`--k`): process steps, rows, reviews, menu cards, blog posts, case facts |
| 110ms | case cover title lines |

Wait before the second wave of an entrance: 0.1–0.16s within a block; 0.3–0.7s
after the page has loaded (statement, socials, services hairlines).

## Page sequence

1. Loader (home, first visit only): count, text leaves 450ms, curtain 1000ms `EASE_IO`.
2. Page transition: sheet rises 650ms, holds 250ms, leaves 650ms, `EASE` (sheet).
3. Case grow: 1100ms `EASE_IO`, then the cover settles 1600ms and the title rises.
4. Entrances wait for `window.pkRevealed` (no double reveal behind the sheet).
5. Return to the home page (`.is-return`): same entrance, shorter (0.6–0.7s), stagger capped at 0.32s.

## Reduced motion

Everything that moves is behind `.motion-ok` (set only without
`prefers-reduced-motion: reduce`) or checks `reduceMotion` in JS: loader, sheet,
case grow, menu, burst and label roll are skipped; the marquee stops; smooth
scrolling is off; the view transition is not declared.

## Outliers to tidy later

- `EASE_OUT_Q` vs `--ease`, `EASE_IN` vs `EASE_IN_Q`: two pairs of near-identical curves.
- `--ease` is declared three times (`main.css`, `lost.css`, `archive.css`) and copied as a string in `js/main.js` (twice) and `js/contact.js`. One source would be cleaner: the JS could read `getComputedStyle(html).getPropertyValue('--ease')`.
- One-off durations: 0.08s/0.16s delays, 1.3s and 1.8s on case figures, 1.9s on service frames. Could snap to 1.2s / 1.6s.
- CSS durations are written by hand; there are no `--dur-*` custom properties yet. If added: `--dur-fast: 0.3s`, `--dur-move: 0.6s`, `--dur-enter: 1s`, `--dur-settle: 1.6s`.

## Badges

A "New" badge is wanted (decided 15 Oct) but not used on projects yet. When it
arrives, it appears without its own animation or with the regular entrance of
its card; no pulsing.
