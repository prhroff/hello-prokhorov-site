# Prokhorov® — portfolio site

Static site: HTML, CSS and a single dependency-free ES module. No framework; a small Python build turns `src/` into the pages.

```
src/index.html            home page source
src/pages/**.html         inner pages: info.html -> /info/, work/luma.html -> /work/luma/
src/blog/*.html           blog posts: my-post.html -> /blog/my-post/  (start from _template.html)
src/pages/work/*.html     case studies: powermatic.html -> /work/powermatic/  (start from _template.html)
src/layouts/page.html     the frame around inner pages and posts
src/layouts/full.html     full-width pages (/work/, the case studies): bar, the page, the footer
src/partials/*.html       shared pieces: top bar, phone menu, logo, footer, contact column
scripts/site_config.py    person, profiles and navigation (used by every page)
scripts/build-html.py     builds all pages, sitemap.xml and the blog feed
scripts/build-cases.py    legacy: holds the CASES table (the source of all case copy). Do not run it:
                          it writes the old case dialogs into src/index.html
scripts/build-assets.py   source artwork -> AVIF + WebP variants (+ manifest.json)
css/main.css              tokens, layout, components, motion
js/main.js                interactions (works on every page)
js/contact.js             Get in touch (/contact/): the project form; set FORM_ENDPOINT in site_config.py
js/transitions.js, css/transitions.css   page-to-page transitions, loaded in every page's <head>
js/game/, css/game.css    Invader, the 8-bit game behind the footer invader; loaded on first click
js/archive/, css/archive.css   The Archive (/archive/), the dark endless image stream the game unlocks;
                          add images in js/archive/items.js
index.html, info/, contact/, blog/, work/, 404.html, sitemap.xml   generated — do not edit
```

## Build & preview

```sh
python scripts/build-assets.py           # only after adding/changing images (Pillow ≥ 11.3)
python scripts/build-html.py             # after any edit in src/ — preview build, drafts included
python -m http.server 8080               # then open http://localhost:8080 (paths are root-relative)
```

Deploy with `python scripts/build-html.py --release`: draft pages are left out entirely.

## Publishing a page or a post

Each source starts with front matter (`title`, `description`, `status` …; the full list is at the top of `build-html.py`).

- `status: draft` — built for preview with a "Draft" badge, `noindex`, and kept out of the menu, the sitemap, the blog list and the feed.
- `status: live` — published. Menu items switch from the home-page section to the page, the page enters the sitemap, and `<when live="/info/">…</when>` blocks on other pages appear.

The build prints every page with its status and warns about a missing description, a wrong number of `<h1>`s, a post without a date, or two pages with the same title.

To add an image: add a row to `SOURCES` in `build-assets.py`, run it, then use
`<pic name="my-image" alt="…" sizes="(min-width: 900px) 40vw, 92vw">` (add `eager` for above-the-fold images).

The project form on /contact/ posts to `FORM_ENDPOINT` in `scripts/site_config.py` (any form service that accepts a POST and answers JSON, e.g. Formspree). While it is empty, sending opens the visitor's email app with their answers filled in.

Missing content is marked visibly: `<p class="todo" data-todo>` in pages, `<!-- CONTENT: … -->` in the source.
