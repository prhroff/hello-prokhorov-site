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
scripts/build-release.py  the production package: a release build of only the website, in dist/
_backups/legacy/build-cases.py   legacy, disabled: its CASES table is where the case copy came from
scripts/build-assets.py   source artwork -> AVIF + WebP variants (+ manifest.json)
css/main.css              tokens, layout, components, motion
js/main.js                interactions (works on every page)
js/contact.js             Get in touch (/contact/): the project form; set FORM_ACCESS_KEY in site_config.py
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

## Release

```sh
python scripts/build-release.py          # builds the release in a temporary copy, writes dist/ and checks it
```

`dist/` is the whole production site and nothing else: the pages, `sitemap.xml`, `robots.txt`,
`llms.txt`, `assets/`, `css/`, `js/`, `CNAME` and `.nojekyll`. The release build inside it leaves
out draft pages, `/blog/` while no post is live, and every HTML comment. It runs in a copy because
`build-html.py --release` deletes the draft pages it finds; this working copy keeps them.

Production is the `main` branch (GitHub Pages, custom domain helloprokhorov.com). Going live means
replacing `main`'s contents with `dist/`, nothing more; `dist/` itself is never committed here.
Before that: `FORM_ACCESS_KEY` (Web3Forms) in `scripts/site_config.py`, and
**Enforce HTTPS** in the repository's Pages settings.

## Publishing a page or a post

Each source starts with front matter (`title`, `description`, `status` …; the full list is at the top of `build-html.py`).

- `status: draft` — built for preview with a "Draft" badge, `noindex`, and kept out of the menu, the sitemap, the blog list and the feed.
- `status: live` — published. Menu items switch from the home-page section to the page, the page enters the sitemap, and `<when live="/info/">…</when>` blocks on other pages appear.

The build prints every page with its status and warns about a missing description, a wrong number of `<h1>`s, a post without a date, or two pages with the same title.

To add an image: add a row to `SOURCES` in `build-assets.py`, run it, then use
`<pic name="my-image" alt="…" sizes="(min-width: 900px) 40vw, 92vw">` (add `eager` for above-the-fold images).

The project form on /contact/ posts to Web3Forms (`FORM_ENDPOINT` + `FORM_ACCESS_KEY` in `scripts/site_config.py`), which emails the answers to the inbox the key was created for. While the key is empty, nothing is sent: the page shows the answers ready to copy into an email.

Missing content is marked visibly: `<p class="todo" data-todo>` in pages, `<!-- CONTENT: … -->` in the source.
