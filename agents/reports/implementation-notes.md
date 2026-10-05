# v8.1 — full reviews (2026-10-02)

- Review cards lighter (#f7f7f7, avatar #ececec) with more padding (`--rp`: 28–48px, 24px on phones); the card width cap adds the padding so the quote keeps its line length.

- Review cards restyled after the reference: soft grey rounded card (20px), author at the top (larger avatar 52–72px, name and role at heading size), the quote at the bottom in its own “ ” marks, open space between; cards share one height so the quotes end on one line. The separate big quote mark and the top hairline are gone.

- Reviews drag rewritten. Before: on release snapping came back at once and the row jumped in one frame; you had to drag past half a card to move; the click guard never fired. Now: pointer capture (the drag continues outside the row); a flick (>0.3 px/ms) or a drag past ¼ card goes one card in that direction, less settles back; the settle is eased in JS (ease-out, 380–720 ms) with snapping off until it lands; grabbing the row mid-settle catches it; no text selection on mouse drag; arrows stop any settle first.

- Cursor over the reviews row: a dark disc that says "Drag" (the "View" disc is white over the dark project images); it shrinks while the mouse button is held. Mouse/trackpad only, off with reduced motion.

- Quotes larger (`--t-quote`: 20–30px; 21px on phones) with key phrases in `<mark>`, in the dark text colour `--fg` (#121212); the rest of the quote is `--mute`. Card cap now `min(82%, quote size × 21)` (~35–45 characters per line).

- Industries / Skills rows removed from the review cards (markup and styles); each card ends with the author line.

- Reviews show their full texts again, word for word from the review cards in `../Reviews` (Instagram posts 2–6).
- Each review has an author line as a placeholder: a round avatar (grey silhouette), "Client name", "Role, company · Fiverr or Kwork". To fill it in, replace the `.review__avatar` span with `<img class="review__avatar" alt="">` (square photo), set the text, and remove `data-todo`.
- Card width is capped at a comfortable measure, `min(78%, var(--t-head) × 24)` (phone: `min(86%, 30em)`), about 45 characters per line at every width; `text-wrap: pretty` avoids single-word last lines.

# v8.0 — multi-page foundation (2026-10-02)

Backup of v7.12 sources: `_backups/new-test-v7-20261002-prepages/`.

- **Build** (`scripts/build-html.py`, rewritten): home + `src/pages/**` + `src/blog/*` → pages at clean URLs (`/about/`, `/services/ux-audit/`, `/blog/<slug>/`). Shared partials (bar, menu, logo defs, preloader, contact column, footer) and one layout for inner pages. All asset paths are now root-relative (`/css/…`), so the site must be served from the domain root (preview: `python -m http.server`).
- **Page status**: `draft` pages are built for preview with a badge and `noindex`, and stay out of the menu, the sitemap, the blog list and the feed; `--release` leaves them out entirely. The build deletes files an earlier build wrote that are no longer produced (ledger: `scripts/.generated.json`).
- **Navigation** (`NAV` in `scripts/site_config.py`): each item links to its page once it is live, until then to the home section, and is hidden with neither. That's why Services is not in the menu yet. Inner pages mark the current item (`aria-current="page"`); on the home page the scroll highlight uses `data-spy`.
- **SEO per page**: title (+ " — Prokhorov®"), description, canonical (only on indexable pages), noindex on drafts, OG/Twitter, and a JSON-LD `@graph` with one `Person` (`/#person`) and `WebSite` referenced by `ProfilePage` / `ContactPage` / `CollectionPage` / `Service` / `BlogPosting` and a `BreadcrumbList`. `sitemap.xml` is generated (live, indexable pages; real `lastmod`). The blog index stays noindex until the first post is live; `blog/feed.xml` + `<link rel="alternate">` appear then.
- **Pages created as drafts** with existing copy only, plus visible placeholders: `/about/` (label "Info"), `/services/` + five service pages, `/contact/`. Live: `/blog/` (empty state, noindex), `/404.html`. Post template: `src/blog/_template.html`.
- **Home**: generated head; "More about me" and "All services" links appear by themselves once those pages are live. Cases can be linked as `/#case-pm`; the address follows the open case and is cleared on close.
- **Preloader**: first home visit per session only (`is-seen` set before first paint); inner pages have none. Page-to-page cross-fade via `@view-transition` (no JS).
- Pages next in line: case studies as `/work/<slug>/` (data is already in `build-cases.py`), then `/work/`.

# v7.12 — Blog link, site structure & SEO plan (2026-10-02)

- "Blog" added to the top bar and the phone menu, pointing to `/blog/` (404 until the blog is built). Scroll-spy only looks at in-page links, so Blog is never highlighted on the home page.
- Plan for Services, Info, Contact, Blog and case-study pages: `agents/reports/site-structure-seo-plan.md`.

# v7.11 — smooth scrolling everywhere on desktop (2026-10-02)

- "Home" removed from the top bar and the phone menu (Work, Info, Contact remain); the logo and "Back to top" still go to the top. At the top of the page no nav button is filled; at the bottom, Contact is (it never reaches mid-screen otherwise).

- New engine in main.js (replaces the v6 wheel lerp): one target per scroller, eased with time-based damping (`1 − e^(−8.5·dt)`), so the glide is the same at 60 and 120 Hz; it writes the native scroll position, so sticky columns, observers and the scrollbar keep working.
- Inputs: mouse wheel and trackpad (bursts add to the running target), keyboard (↑ ↓ 90px, PageUp/PageDown/Space 85% of the view, Home, End; not while typing, not on a focused button for Space), in-page links (nav, logo, Back to top).
- Scroller: the page, or the open case study (project pages now glide too). Sideways wheel is left native (reviews row); an inner area that can scroll keeps the wheel; dragging the scrollbar or find-in-page takes over mid-glide.
- Fine pointers only and not with reduced motion; touch keeps native momentum.

# v7.10 — mobile menu as cards (2026-10-02)

- Top-bar links on tablet and desktop (Home, Work, Info, Contact) are outlined, fully rounded buttons: 1px border, 2px vertical / 10px side padding, 6px apart, commas dropped; the current section is filled black, hover tints. (The phone menu's page links were reverted to plain large type.)
- "Get in touch" in the top bar uses the same outlined, fully rounded button (2px / 10px padding, hover tint).

- Menu "Socials (4)" list back to full names, plain text without arrows, on one line (fits 375px). The page's phone Socials row keeps the initials.

- Menu buttons (Copy email, Ask AI about me, Socials (4)) are all outlined now: 1px white border, no fill, 4px vertical / 10px side padding (~29px tall); an open list fills its button faintly.

- Phones only: socials as capital initials on one line — LI, CO, X, IG (LinkedIn, Contra, X, Instagram) — in the page's Socials row and in the menu's "Socials (4)" list. Full names stay for screen readers (visually hidden name / aria-label) and on tablet and desktop.

- Bottom card: "Right now:" caption and "Write an email" pill removed; the statement is set as three lines ("Based in Bishkek / working worldwide / local time 21:27"), slightly larger, filling the card.
- Copy pill keeps its width: an invisible "Copy email" holds the size and the live label ("Copy email" ⇄ "Copied!") is centred in the same cell; on failure it reads "Not copied" instead of the address (`data-copy-fail`). Measured 109.3 × 38px throughout.

- Refined: one spacing rhythm (16px inside cards, 6px between, 16px between blocks; 38px pills; safe-area bottom). Opening and closing now run from JS and are reversible mid-way (each starts from the current state): open = photo fades up and settles, cards rise in turn, links follow; close = cards drop lowest-first, photo and sheet fade (~450ms), then the menu hides. The toggle shows a "Menu" label that rolls to "Close" as + turns to ×. Tap highlight removed.

- After the user's reference (dark rounded cards over a product photo), adapted: the portrait fills the screen and three dark cards sit at the bottom.
  - Card 1: a line about Artem, a white "Copy email" pill (with the star burst) and an "Ask AI about me ⌄" pill that opens ChatGPT / Claude / Perplexity.
  - Card 2: Home › Work › Info › Contact › in large type, and a grey "Socials (4) ⌄" pill that opens LinkedIn, Contra, X, Instagram.
  - Card 3: "Right now:" + "Based in Bishkek working worldwide local time 21:11" (grey/white mix, live clock) + a grey "Write an email ›" pill.
- Motion: photo settles, cards rise in turn, the page links follow inside their card; the two lists open and close with a height animation and a turning chevron.
- Fits 390×844 without scrolling; scrolls on smaller phones. Tapping a page link closes the menu.

# v7.9 — case studies in six chapters (2026-10-02)

- Every case page: cover, title and intro, a project-data table (Client, Year, Role, Industry, Platform, Scope, Timeline), then six chapters — Challenge, Research & Strategy, Brand Direction, UX Structure, Visual Language, Final Experience — each with text and image rows (wide or pair), and a results row in Final Experience. Next project at the end.
- Generated from one table: `scripts/build-cases.py` (edit CASES, run it, then build-html.py).
- 39 new real images from ../cases (Powermatic 14, Visual Hunters 6, Contour 2, Monolith 8, Lattice 6, Luma 3), added to build-assets.py; 59 images across the cases. Device screenshots are shown whole (contain), never cropped.
- Real text: the audit (from cases/visualhunters/case-study-nda.md) and Monolith ONE (from cases/monolith/Monolith ONE.md) are written through; Powermatic's page list is taken from its own menu screen.
- CONTENT: everything unknown is a visible placeholder marked `data-todo` — grey writing prompts ("Placeholder" + what to write), hatched image frames naming the missing image, and "—" in data/results. 102 in total.

# v7.8 — simpler phone layout (2026-10-02)

- Phones (<768): the columns dissolve (`display: contents`) into one ordered grid.
  - First screen: small portrait + "Working worldwide / Bishkek, time", name, the intro statement, then "Get in touch ↗" and "Selected work ↓"; the first project starts below (fits 375×667 up).
  - Then: work, Also, Info, details table, Services, Experience, Process, Clients, Reviews, Questions, Let's talk, Socials, email, footer. The "Product, web and UI/UX designer" line is hidden (the statement says it).
  - "Ask AI about me" moves into the menu, with Socials and the email.
- Tablets keep the two-column layout (key info on the first screen, sticky left column fits at 768×1024, 820×1180, 1024×768); Ask AI stays in the left column there.

# v7.7 — Ask AI about me (2026-10-02)

- Portrait reveal effect removed at the user's request (canvas, doodle layer, script, generated portrait-doodle files); the portrait is back to the plain photo with its gentle hover zoom.

- Bottom of the left column, under Services: "Ask AI about me" with ChatGPT, Claude and Perplexity links (↗, same roll/arrow/underline interaction as Socials). Each opens the assistant with the question prefilled: "Tell me about Artem Prokhorov, the independent UI/UX, web and product designer behind helloprokhorov.com. What does he do, what has he worked on, and how can I work with him?" (`?q=` on chatgpt.com, claude.ai/new, perplexity.ai/search).
- Short desktops (≥1200 wide, ≤800 high): less top air (`--top: 48px`) and tighter group gaps so the sticky column still fits — verified 1280×720 to 1920×1080.
- Answers depend on what the assistants can find about the site; a root `llms.txt` (a draft exists in ../cases/site/llms.txt) would help once the site is live.

# v7.6 — Reviews (2026-10-02)


- Quotes trimmed to their strongest sentence each (client wording kept; one ", and" joined with a dash). Full texts are in `_backups/new-test-v6-20261002`.

- New "07 Reviews" section (after Clients; Questions is now 08), after the reference testimonial block, adapted to the middle column: a sideways row of cards (78% wide, the next one peeking; 86% on phones) with a counter (01 / 05) and round ← → buttons in the header.
- Card: large quote mark, the quote, attribution line, then "Industries" and "Skills" rows with hairlines.
- Interaction: native scroll-snap (swipe, trackpad, keyboard ← → when focused), arrow buttons (arrow slides through on hover, press-in, disabled at the ends), mouse drag with snap paused and the nearest card settling on release; cards' contents slide in one after another as the section arrives.
- CONTENT (blocking): the source has the five quotes only. Needed per review: author (name, role, company — or "anonymous"), platform, Industries, Skills. Placeholders are marked `data-todo` and shown in grey ("Client on Fiverr or Kwork", "—").

# v7.5 — Socials (2026-10-02)

- Name: hovering "Artem" rolls it out letter by letter and rolls in "Hello!" with one colour per letter (#ff4d00, #ff2d87, #7b61ff, #0091ff, #00b37e, #ffb800); touch shows it for 1.8s on tap. Heading keeps the accessible name "Artem Prokhorov".

- Left column: "Socials (04)" group replaces the LinkedIn/Email links — LinkedIn, Contra, X, Instagram, each with an up-right arrow; opens in a new tab (announced to screen readers).
- Interaction (hover and keyboard focus): name rolls, arrow exits top-right while a fresh one enters bottom-left, the row hairline darkens left-to-right (and retreats to the right on leave); arrow presses in on click. Hairlines draw in on load like Services.
- Same four links in the mobile menu footer and in the Person structured data.
- CONTENT: Contra URL is from cases/site/llms.txt; X and Instagram URLs assume the handle `helloprokhorov` — confirm.

# v7.4 — real logotype (2026-10-02)

- Small stars replaced with plain dots (`.dot`): status (breathes like a live light), marquee separators, caption separators (grow and darken on hover). The logo star and the copy-burst sparks stay stars.

- Preloader: tick bar removed at the user's request; only the 000→100 counter remains (with the logotype and Bishkek time on top).

- `assets/img/Prokhorov_Logotype_SVG.svg` is inlined once as `#pk-mark` (star) and `#pk-word` (wordmark) and reused with `<use>`, coloured by `currentColor`.
- Header, preloader and case-page bars show the logotype in the master proportions; it is sized from the body text (`--lh = t-base × 1.59`), so the wordmark capitals match the nav capitals (10.9px at 15px text; logo 116 × 24px). The star turns on hover.
- The hand-drawn star approximation is gone everywhere: status, marquee, copy-burst sparks and the favicon now use the real mark.

# v7.3 — work back to one project per row (2026-10-02)

- Fixed "Back to top" / logo / Home: `#top` was the sticky left column, which always measures as on screen, so links only scrolled ~44px. The id is removed (`#top` now means the document top) and the glide handler sends `#top` to 0.

- "View" cursor over projects (fine pointers, motion allowed): 76px white disc following with lag, scales in/out; hides on click and when a project scrolls away.

- Two-up grid removed at the user's request: one 4:3 item per row again, numbered captions kept.

# v7.2 — preloader and own composition (2026-10-02)

- Preloader: white sheet, brand + Bishkek time on top, 000→100 counter and 32 ticks at the bottom. Follows real loading (font + eager images), min 1.7s (0.5s on repeat visits in a session, sessionStorage `pk-seen`), forced at 5s; CSS hides it at 6s if JS never runs; none without JS or with reduced motion. Exit: contents lift, sheet clips upward, page words blur in beneath.
- Composition moved away from the reference:
  - Left: name as the headline ("Artem Prokhorov") + discipline line; services numbered 01–05 under a "Services (05)" label.
  - Right: spec table (Role, Based, Coordinates, Languages, Since) instead of stacked lines.
  - Middle: work as a two-up grid with rhythm — full 4:3, two 4:5, wide 16:9, two 4:5 (one column on phones); captions numbered 01–06; sections numbered 01–07 with zero-padded counts.
  - Scroll progress hairline under the top bar; "Back to top ↑" in the footer.

# v7.1 — microinteractions (2026-10-02)

- New portrait (`../Portrait.jpg`, 1024², 500/1000 variants) replaces the circular avatar; the inside-the-circle crop is gone.

One vocabulary: labels roll, stars turn, hairlines draw from the left, things give when pressed. All gated by `.motion-ok`.
- Copy email: label rolls to "Copied!", 9 stars (dark and grey) burst out, hang, drift and fade (`burst()` in main.js).
- `[data-roll]` text roll on nav, Get in touch, LinkedIn/Email, case Close.
- Brand star turns on hover; status star twinkles; marquee stars spin; clock colon pulses.
- Work items: caption star turns on hover, image presses in on click. Portrait leans in on hover. Email underline draws.
- Ruled lists (Also, Experience, Process, Questions, quotes) draw their hairlines in sequence as they enter, text follows; services lines draw on load.
- FAQ "+" turns on hover. Mobile menu unrolls, links rise in turn.
- Fixed: rows' year column now fixed width, so the middle column aligns.

# v7 — layout after maelle.framer.website (2026-10-02)

Rebuilt the home page on the reference's structure, with existing content only.
Backup of v6: `_backups/new-test-v6-20261002/`.

- Fixed top bar on the page columns: brand, Home/Work/Info/Contact, Bishkek time, Get in touch.
- Desktop (≥1200) three columns 28/44/28 with hairlines. Left (sticky): "Hello! I'm Artem.", LinkedIn/Email, services list. Right (sticky): Working worldwide, portrait, role, email and copy. Middle: statement (sticky, the work scrolls over it), Selected work (6 image + caption items), Also (audit + imageless projects), Info, Experience, Process, Clients, Questions, "Let's talk" marquee, footer.
- Tablet (768–1199) two columns, facts above the feed. Phone: one column, "+" menu.
- White page, Inter 500, greys #121212 / #757575, lines #e3e3e3. Base text 15–17px.
- Motion: words blur into focus on load, images fade/settle in on enter, hover zoom, marquee. Case dialogs, clip-path open/close, next project and smooth wheel scroll kept from v6. Pinned scenes, page themes and cursor removed.
- Portrait source is a circle on black; it is cropped inside the circle (scale 1.32).
- Content still needed: years for Powermatic, Monolith, Lattice, Luma; a rectangular portrait; social links; case-study text.

# Implementation notes

## v6 — feel and continuity (2026-10-02)

v6 targets what separates Awwwards-level sites from good ones: how scrolling feels, and how the pages connect. The visual system from v5 is unchanged. The v5 files are backed up in `../_backups/new-test-v5-20261002/`.

**Smooth scroll** (fine pointers, motion allowed):
- The wheel sets a target and the page eases towards it (lerp 0.1 per frame) through the native scroll position. Sticky and pinned scenes, keyboard, scrollbar, find-in-page and touch all stay native.
- In-page links glide too.
- The wheel is ignored while a case or the menu is open, and for horizontal or pinch gestures.
- There is no library.

**Image-to-case transition**
- A case opens through a `clip-path` window that starts as the rectangle of whatever opened it: the project image, its "View project" image, or the list row. The window then expands to the full screen.
- Each case now starts with a full-bleed cover of that project's lead image, which settles from 125% while its title and intro rise in behind.
- Closing (Close or Esc) shrinks the case back into the project image if it is on screen and the case hasn't been scrolled. Otherwise it fades.
- The backdrop is transparent, so the page stays visible around the opening window.

**Next project.** The end of each case has "Next project" and the next title at display size. It opens the following case through the same window, and the previous case closes once it is covered. The order loops: Powermatic → Visual Hunters → Contour → Monolith → Lattice → Luma → Audit.

**Details**
- Case titles take focus when a case opens (`autofocus`, `tabindex=-1`), instead of the Close button showing a focus ring.
- The Visual Hunters cover is the poster.

**Content still limiting the result.** These can't be solved in code:
- Real case-study writing (challenge, decisions, outcome) for at least two or three projects.
- The master vector of the star mark.
- A higher-resolution Monolith render (the source is 1024 px and soft as a full-bleed cover).
- Confirmed social links.

---

## v5 — visual ambition: scroll choreography (2026-10-02)

v5 builds on v4. The grid, no-overlap, type and spacing rules are unchanged. What's new is scale, a different motion for each section, and pinned scenes. The v4 files are backed up in `../_backups/new-test-v4-20261002/`.

**Scale.** Display is now `clamp(50px, 10vw, 208px)` and h1 is `clamp(40px, 6vw, 120px)`. Project titles are set at display size across the full grid, on one line from 768px. The hero headline is capped at `16.5svh` so it fits short screens.

**Sequence and intensity**
| Section | Motion | Level |
|---|---|---|
| Nav | Arrives once after the headline starts. Links dim around the hovered one. | micro |
| Hero → Powermatic | Pinned (240vh, desktop). The headline lines lift out through their masks and drift apart sideways (`--t`). The Powermatic image rises from the bottom edge and widens from the grid margins to full bleed (`--e`). The project title then follows directly. | major |
| Project titles | Travel in from the right and land on column 1 (desktop). The body appears afterwards (opacity only). | medium |
| Visual Hunters | The frames "breathe": full size at the centre of the screen, 93% as they arrive and leave (`--d`). | medium |
| Contour Office | The crop pans sideways, in opposite directions in the two frames. | medium |
| Monolith ONE | The page darkens. The render settles from 94%, and the details open from the bottom edge one after the other. | major / medium |
| Lattice | The frame opens from the grid margins to the screen edges. | major |
| Index, Clients | Still, apart from heading line reveals. | quiet |
| About | The pause: a display-size statement and nothing else moves. | quiet |
| Services | Desktop: the left column (heading, image, description) is sticky and the names pass on the right. The name at the centre is active: the others drop to 32% and the active one steps one gutter right (names are one gutter narrower, so it stays inside the grid). Mobile: the same active state, stacked. | major |
| Process | Pinned (420vh, desktop). The current stage is lit and steps right, passed stages are at 40%, and the description on the left changes. Mobile: stages light as they reach the middle. | major |
| FAQ | On demand: height and opacity. | micro |
| Contact | "Let's talk." slides in from the left and lands on the margin, and the email underline draws with scroll. | medium |

**Cursor.** Fine pointers only, over project images only. The pointer becomes the word "View" (lead size, `mix-blend-mode: difference`). There is no circle, and nothing follows the pointer anywhere else.

**Hover (desktop).** On a project image, the picture scales to 103%, the title moves 12px and the arrow steps forward.

**Implementation**
- Still one passive scroll listener plus rAF writing `--p`, `--d`, `--t` and `--e`. CSS does all the transforms.
- Pinned scenes only apply at ≥1024px wide and ≥600px tall, with motion. JS reads `position: sticky` before stepping, so the stacked layouts use the "lit at the middle" behaviour instead.
- Line masks clip only vertically (`overflow: visible clip`), so sideways drift is never cut at the margin. `main` has `overflow-x: clip` (not `hidden`), so sticky still works.
- Load transitions use `translate`, and scroll-linked motion uses `transform`, so the two never fight. Once the entrance has played, `.is-settled` removes the transitions on the hero text.

**Verified** in headless Edge:
- No horizontal overflow and no display text past the right margin at 375, 390, 430, 768, 1024×768, 1280, 1440 and 1920.
- Frame sequences through the hero, Services and Process at 1440, and a motion walk at 390.
- Menu, FAQ, dialogs, Esc and nav all pass, with no console errors. Reduced motion shows the static layout.
- **Not tested:** Safari, Firefox and real devices.

---

## v4 — design reset: strict grid (2026-10-02)

v4 replaces the v3 visual system. Content, assets, the build scripts and the no-dependency stack are kept. Layout, type, spacing and motion are new. The pre-v4 site is backed up in `../_backups/new-test-pre-redesign-20261002/`.

**Rules**
- **No overlap.** Every element has its own grid area.
- **Strict grid.** 4 → 8 (≥768) → 12 (≥1024) columns, with one margin (`--m`) and one gutter (`--g`). Every two-part row splits at the same column (`--a`: 5 of 8, 7 of 12). This applies to section heads, project text, About, Services, Process, FAQ, Contact and the dialogs.
- **Type.** Five sizes: display, h1, h2, lead and body. Body is at least 17px. The only exception is the closing "Let's talk.", which is sized to the full grid width. There are no uppercase labels, no tracking-out and no pills.
- **Space.** Five steps, `--s1`…`--s5`. Sections are separated by `--s5`, as are projects.

**Projects.** One template: an image block, then the title (h1, left) and the description, meta and "View project" (right).
- Only the image block varies: Powermatic is single, Visual Hunters is a 6/6 pair, Contour is an 8/4 pair, Monolith is single plus a pair, and Lattice is full-bleed.
- In a pair, both images are cropped to the same row height (`--pair-r`).

**Removed from v3**
- Hero card expansion and the cover overlap.
- The phone and shelf images overlapping the key visuals, and the giant parting names.
- The pinned sideways quotes and the process staircase.
- The "one column over" active states.
- The cursor label, and the index hover preview (a floating image over text).
- The star mark in the nav.

**Motion rhythm** (`.motion-ok` only; reduced motion shows the final state)
| Beat | Motion |
|---|---|
| Hero | The statement rises line by line on load, then the lead and info follow. |
| Powermatic | The image grows from 84% to the full grid width as it enters. |
| Pairs | The frames open from a 7% inset. The pictures settle and drift slightly inside the frame (parallax never moves the frame). |
| Monolith | The page colour turns dark: a pause. |
| Lattice | The frame starts on the grid margins and opens to the screen edges. |
| Index, Clients, About | Static, apart from heading line reveals. Index and services hover: the others dim and the hovered name steps one gutter right. |
| Services → Process | The page goes dark again. Process stages light as they cross 62% of the viewport. |
| FAQ | Height and opacity animate. One answer is open at a time. |
| Contact | The email underline draws in with scroll. |

**Fixes carried over from the code review:** the mobile menu closes when the viewport passes 768px, and the nav only hides or shows on a real change of scroll position.

**Verified** in headless Edge:
- 390, 768, 1440 and 1920 px, plus reduced motion.
- No horizontal overflow and no console errors.
- No overlapping text boxes. The only hits are answers inside closed `<details>`, which aren't rendered.
- Menu, FAQ, dialogs with Esc, and nav hide and show.
- **Not tested:** Safari, Firefox and real devices.

**Content to confirm**
- Process "Build" and "Refine" descriptions are composed from the existing services and handoff copy.
- The Clients list uses CV names, plus "Clients on Fiverr and Kwork" for the review sources.
- The work and services intro lines are new summaries of existing copy.

---

## v3 — composition, scroll and continuity (2026-09-29)

v3 is a refinement of v2, not a rebuild. Content and visual language are unchanged. The goal was one continuous composition instead of stacked sections.

**One surface.** With JS, sections no longer paint their own backgrounds.
- A fixed backdrop takes the colour of whichever chapter crosses the middle of the viewport (ink, paper or lime).
- `--page-bg/-fg/-mute/-line` are registered with `@property`, so text, lines and background transition together over 900 ms.
- This removes the hard edges v2 had between every section.
- Without JS, each section still paints itself. With reduced motion, the colour change is instant.

**Beats, each with its own behaviour.** Nothing repeats more than twice.

| Beat | Behaviour | Level |
|---|---|---|
| Hero | Statement lines part sideways, and the card expands to full bleed. Powermatic then slides up over the pinned image (`.work` overlaps the hero by 100svh), and the hero sinks back and darkens. | 1 |
| Powermatic | Name first. The phone moves faster than the page and crosses the edge of the key visual. | 2 |
| Visual Hunters | The poster opens from a tight crop as it arrives. The name and text stay sticky beside it, and the shelf image overlaps the poster at foreground speed. | 2 |
| Contour Office | Pinned (desktop). The two giant lines part, and the laptop rises and scales up through the gap. | 1 |
| Monolith | The surface goes dark. Only the background name drifts: a still pause. | 3 |
| Lattice | The image widens from inset to full bleed, and "Lattice" slides in through the crop. | 1 |
| Index | Static list. The hover preview stays. | 3 |
| Client words | Pinned (desktop). The quotes travel sideways past a fixed heading. The one in the centre is at full strength and the others recede. | 2 |
| About | The statement is sticky, and the body and CV pass beside it. Nothing animates. | pause |
| Services | Active row set by scroll position (touch included), overridden by hover or focus. The active name and its line step one column right, and the image frame slides to sit beside it. | 2 |
| Process | Pinned (desktop). The four stages form a staircase, one lit at a time with its description top right, and passed stages stay half-lit. | 2 |
| FAQ | The open question steps one column right, the others recede, and the answer is set at lead size. No +/− icon. | 2 |
| Contact | "Let's" and "talk." arrive from opposite edges and meet as the section reaches the top. | 1 |

**System underneath the variation**
- One variable per scene. `--p` is written by one passive scroll listener plus rAF, only while the scene is near the viewport. The hero also gets `--e` (expand) and `--c` (cover).
- Scene types:
  - `hero`
  - `pin`: progress across a sticky scene's own length
  - `pass`: progress across the element's pass through the viewport
  - `enter`: progress from entering the viewport to reaching its top
- `data-steps` lights one `[data-step]` at a time. The Words track and Process share this.
- Parallax only on foreground devices: the phone and the shelf.
- "Active = one column over" is shared by services and the FAQ, and repeated by the process staircase.
- Parallax targets measure their figure and move the inner `<picture>`, so the transform never feeds back into the measurement.
- Image hover zoom uses the independent `scale` property, so it never conflicts with scroll transforms.
- Removed: the shared clip-reveal on every image (it was the v2 repetition).

**Cursor.** Over project imagery only (fine pointers), a small "See the project" label follows the pointer using `mix-blend-mode: difference`. There is no pill, and the native cursor is not hidden. It shares the lerp loop with the index preview and is absent on touch.

**Mobile, art-directed rather than disabled**
- The hero card sits just above the name. Its position is calculated from the viewport height, and short phones get a smaller card.
- The Powermatic cover works on mobile too.
- The phone and the shelf overlap their key images.
- Contour stacks, with the laptop overlapping the name.
- Words and Process become vertical lists. The staircase keeps an 8vw indentation per step.
- Services dim by scroll position, with all descriptions visible.

**Verified**
- Screenshot sweeps at 390, 375×667, 430, 1024, 1440 and 1920 px, plus reduced motion, in headless Edge. No console errors.
- Keyboard order, dialogs with focus return, the FAQ and the mobile menu with `inert` all pass.
- Scroll frame time at 1440: 5.6 ms median and about 11 ms at p95.
- **Not tested:** Safari, Firefox and real devices. `@property` transitions need Safari 16.4 or later. Older Safari switches colours instantly, which is still correct.

---

## v2 — visual revision (2026-09-29)

This revision reviewed v1 against OBYS and Motto as quality references, without copying either. It kept the structure and interactions and changed the visual language.

**Typography**
- Instrument Serif is gone. The whole site is set in Inter with optical sizing: a single 73 KB woff2 carrying both the weight and optical-size axes.
- There are five sizes, deliberately far apart: 16 px metadata, 18–21 px body, 22–36 px lead, section statements up to about 100 px, and project names up to 13 rem.
- Display type uses weight 600–650 with −0.05 to −0.075em tracking.
- ® and © are set small and raised automatically by `build-html.py`.

**What was removed**
- Decorative numbers: project 01–05, the services and menu numbers, and the zero-padded counter.
- The hero coordinates, the status dot, and the "Scroll for selected work" cue.
- The "View" cursor pill, the magnetic email, the pill buttons (copy, close), the progress bars, the process line fill, the spinning star, and the parallax.
- The bordered metadata tables. They are now one sentence of metadata.
- The "Selected work (05)" label head, and the fade-up on every text block.

**Composition: each section has its own idea**
- **Hero:** a three-line statement with an indented middle line, and the name cut off by the bottom edge.
- **Powermatic:** name first, then an 8-column image.
- **Visual Hunters:** image-led, bleeding off the left edge.
- **Contour:** typography-led, with the laptop overlapping the giant name.
- **Monolith:** a dark pause, with the product in front of its own name.
- **Lattice:** full-bleed, with the name set inside the picture.
- **Index:** a compact list.
- **Client words:** one quote at a time.
- **About:** a single long sentence with an inline portrait.
- **Services:** a large list.
- **Process:** one sentence, with four steps in a row.
- **Contact:** a closing statement at the same scale as the name.

**Motion** now has three levels only:
- Structural: the hero image expanding into Powermatic, and the pinned quotes.
- Content: project images opening from the bottom edge, and the giant type drifting apart.
- Micro: underline offsets, the index dimming, and a 2.5% image zoom on hover.

**Verified:** 390 / 1440 px, reduced motion, keyboard, dialogs, menu and FAQ in headless Edge, with no errors. First load is about 300 KB on desktop and CLS was 0.

---

## v1 (2026-09-29)

The four planning reports (`creative-direction`, `ux-direction`, `motion-direction`, `performance-review`) had not been produced when v1 was built. v1 therefore follows MASTER.md, TECH.md and the agent briefs directly. The decisions below stand in for those reports until the pipeline is run. Phase 05 (Final Critic) should review against this file and MASTER.md.

## Stack
- The live site is Webflow, a purchased Mōno template. No local codebase existed, so v1 is plain static HTML, CSS and JS with no dependencies.
- GSAP, Lenis and other libraries were deliberately not used. One passive scroll listener with rAF writes `--p` / `--e` CSS variables, and CSS does all the transforms.

## Creative direction
- The palette comes from Artem's existing review posts: warm ink `#0d0d0b`, paper `#eeede6`, lime `#e4f1c3` with accent `#dcf29b`, and the star mark.
- Type: Instrument Serif for display, Inter for body. No uppercase and no monospace. ® and © are set as superscripts in serif contexts.
- The page is structured in chapters with hard edges: dark hero → paper work → dark Monolith → paper index → lime client words → paper about → dark services and process → paper FAQ → dark contact.

## Signature moments (structural motion)
1. **Hero → first project.** The Powermatic image starts as a small card crossing the wordmark and expands to full-bleed as you scroll (a sticky scene of 250vh). It becomes project 01.
2. **Contour Office / Monolith giant type** drifts horizontally in opposite directions behind the imagery.
3. **Client words.** On desktop the section is pinned and shows one quote per scroll step, with a counter and progress bar. On mobile and with reduced motion it becomes a stacked list.
4. **Index.** An editorial list with a cursor-following image preview (fine pointers only).

Everything else is content motion (line and image reveals) or micro motion (link underlines, the magnetic email, the "View" cursor label). The FAQ and About sections are intentionally still.

## Fallbacks
- No JS: static hero, all content visible, nav absolute, no dialogs (the project text is still on the page).
- `prefers-reduced-motion`: no sticky scenes, parallax or drift, and reveals are instant. The hero lays out statically.
- Touch: no cursor layer or hover preview. Services show every description, and figures stay tappable through "View project".

## Content sources (nothing invented)
| Content | Source |
|---|---|
| Bio, experience, years, projects Loglark / Visual Hunters / Contour | `cases/site/moodboard/cv_artem_prokhorov.pdf`, `cases/visualhunters/CV ATS…pdf` |
| Hero lead line | Artem's poster copy ("work with founders, startups and teams… clear, scalable, ready to grow") |
| Client quotes, "40+ reviews", 2022–2026 | `Reviews/Instagram post 1–7` |
| Services | Contra covers + CV |
| Powermatic description | the Powermatic site copy visible in the mockups |
| Monolith spec | `cases/monolith/Monolith ONE.md` |
| Lattice line | `cases/site/*.html` |
| Website audit | `cases/visualhunters/case-study-nda.md` |

## Open content issues
- **Website audit:** the NDA case study describes Artem's own Webflow site (the Mōno template cleanup in `design.md`). It is presented as "client under NDA", as the source document frames it. Confirm or reword before launch.
- Years are unknown for Powermatic, Monolith, Lattice and Luma, so they are shown as "—".
- There are no visuals or write-ups for Playgram.ai, Staffjet or Loglark. They are listed without links.
- There are no full case-study texts (challenge / approach / outcome). The dialogs are galleries plus a summary.
- The Webflow CMS projects (Bold Moves, One Step, Nero Vision, Forma Digital) look like template placeholders and were excluded.
- Social links: only LinkedIn is confirmed. Contra, Instagram and Telegram URLs are still needed.
- The star mark is an SVG approximation. Replace it with the master vector.
- `monolith-render` is only 1024 px wide and slightly soft on large retina screens.
- FAQ answers only use known facts. Pricing and timeline questions still need answers.

## Verified
- Tested at 390, 768, 1440 and 1920 px, plus reduced motion, in headless Edge (Chromium): no console errors.
- Keyboard: skip link → nav → project buttons. Dialogs trap focus, close on Esc and return focus. The mobile menu sets `inert` on `<main>`.
- First desktop load was 333 KB (HTML + CSS + JS + 3 fonts + hero AVIF). CLS measured 0 locally.
- **Not yet tested:** Safari/iOS, Firefox, real devices, slow network.
