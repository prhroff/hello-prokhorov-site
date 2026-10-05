# Site structure & SEO plan: Services, Info, Contact, Blog

Status: proposal, 2026-10-02. Nothing here is built yet, except the "Blog" link in the top bar and the phone menu (it points to `/blog/`, which returns 404 until the blog exists).

Rules carried over from MASTER.md and TECH.md: no invented clients, results, prices, statistics or testimonials; no unnecessary libraries; SEO must not compromise the editorial quality of the site.

---

## 1. The main problem today

The site is a single URL. Everything (work, services, about, contact, all seven case studies) lives on `/`. Search engines rank **pages**, not sections, so the site can rank for one query at most: the name. Case studies are the strongest content, but they are hidden in `<dialog>`s on the home page, so they can never rank or be shared as their own links.

The fix is to give every topic someone might search for its own URL, and keep the home page as a curated overview that links to them.

## 2. Proposed URL map

```
/                              Home: overview (as now), every section links to its page
/work/                         All projects (index)
/work/<project-slug>/          One page per case study (replaces the dialogs)
/services/                     Services overview
/services/<service-slug>/      One page per service (only services Artem really offers)
/about/                        "Info" page: bio, experience, approach, CV
/contact/                      Contact
/blog/                         Blog index
/blog/<post-slug>/             Posts
/blog/feed.xml                 RSS
/404.html                      Not-found page (noindex)
/llms.txt                      Plain-text summary for AI assistants
```

URL rules:
- Lowercase, hyphens, trailing slash (`/folder/index.html`).
- Short and permanent. Slugs are descriptive (`/services/web-design/`), with no dates or IDs.
- One canonical version of each URL (https, no `www` or `www` only, with a trailing slash), with 301 redirects from the others.

**Label vs URL.** The menu can keep saying "Info", but the URL should be `/about/`. That is the convention people and crawlers expect, and it is what people type in. *(Decision needed.)*

**Navigation once the pages exist.** Header links switch from `#work`, `#about` and `#contact` to `/work/`, `/about/` and `/contact/`. The same feel is kept with cross-document View Transitions (`@view-transition { navigation: auto; }`): pages are real, but the move between them stays smooth, with no JS framework. The case "clip-path from the card" opening can be rebuilt the same way.

## 3. Page plans

Each page gets:
- a unique `<title>` (≈50–60 chars) and meta description (≈140–160 chars);
- one `<h1>`;
- a self-referencing canonical;
- its own OG image;
- `BreadcrumbList` structured data (except the home page).

### 3.1 Services: `/services/` and `/services/<slug>/`

**Search intent:** commercial ("hire a freelance product designer", "UI/UX designer for startups", "SaaS website design").

**Candidate pages** (to confirm which are real offers):
- UI/UX design: apps and SaaS products
- Web design: marketing sites, landing pages
- Product design: MVP to launch, design systems
- UX audit: if offered

**Structure of one service page:**
1. H1, phrased as the service plus who it is for: *"Web design for startups and product teams"*.
2. Short answer paragraph: what it is, who it is for, the outcome. This is the part search snippets and AI answers quote.
3. What is included (deliverables list).
4. Process (reuse the Process steps), with realistic timelines only if real.
5. Related case studies, 2–3 links to `/work/...` (the proof).
6. FAQ specific to this service (real questions from clients).
7. CTA to `/contact/`.

**Schema:** `Service` (`serviceType`, `provider` → the Person, `areaServed: "Worldwide"`). No prices unless Artem publishes real ones.

**Overview page** `/services/`: a short intro, one card per service linking to its page, and a shared FAQ.

**Title pattern:** `Web Design for Startups | Prokhorov® (Artem Prokhorov)`.

### 3.2 Info / About: `/about/`

**Search intent:** the name ("Artem Prokhorov designer"), plus trust checks before hiring. This is the main **E-E-A-T** page, and the page Google and AI assistants use to understand who the person is.

**Content:**
- H1 with the full name and role.
- Portrait with real alt text.
- Longer bio in the first person: background, years of experience, the kind of work, the industries.
- Approach and principles.
- Experience / CV (the existing CV block, expanded).
- Tools.
- Clients worked with (real only).
- Press, talks, awards (if any).
- Links to profiles.
- CTA.

**Schema:** `ProfilePage` with `mainEntity: Person`. The Person node gets `@id: https://helloprokhorov.com/#person`, and every other page refers to that same id, so the entity is defined once. Fields: `name`, `alternateName`, `jobTitle`, `image`, `sameAs`, `knowsAbout` (UI/UX, web design…), `address` (Bishkek, KG), `worksFor`/`brand` Prokhorov®.

**Consistency matters:** the same name, role line and photo on LinkedIn, Contra, X, Instagram and the site. This is how search engines and LLMs connect the profiles to one person.

### 3.3 Contact: `/contact/`

**Search intent:** low volume, but it is the conversion page and it is linked from everywhere.

**Content:**
- H1 *"Contact"* / *"Start a project"*.
- Email with copy.
- Optional short form.
- What to include in a brief.
- Response time (only if Artem commits to one).
- Time zone (Bishkek, live clock), availability.
- Profiles.
- Short FAQ (budget, timeline, process start).

**Schema:** `ContactPage`, referencing `#person`, with an `email` contact point.

**Form decision:** a static site needs an external endpoint (Formspree, Netlify/Cloudflare form handling) or stays email-only. Email-only is simplest and adds no dependency. *(Decision needed.)*

If there is a form: a `/contact/thanks/` page with `noindex`, which is also the place to count conversions.

### 3.4 Blog: `/blog/` and `/blog/<slug>/`

**Purpose:** the only part of the site that can bring in non-name, top-of-funnel traffic, and it shows expertise (E-E-A-T).

**Strategy: topic clusters around the services.** Each service page is a "pillar". Posts answer the specific questions around it and link back to it, and the service page links to its best posts.

**Example topics (titles to adapt; content only from real experience):**
- Web design: "What to prepare before a website redesign", "Landing page structure that works for SaaS".
- UI/UX: "How I run a UX audit, step by step", "Design system vs UI kit: what a startup really needs".
- Product: "From idea to MVP: the design stages and what each one delivers".
- Case breakdowns: deeper write-ups of the work, linking to `/work/<slug>/`.
- Process & collaboration: "How to brief a freelance designer", "Working across time zones".

**Post template:**
- H1, then a lead paragraph that answers the question straight away.
- Byline: Artem Prokhorov → `/about/`, plus published and updated dates and reading time.
- Content with H2/H3, real images with alt text, `figure` captions.
- "Related work" and "Related posts" links.
- CTA.

**Schema:** `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author` → `#person`, `image`, `mainEntityOfPage`).

**Index page:**
- Newest first, with plain `<a>` pagination (`/blog/page/2/`) and no infinite scroll, because crawlers do not scroll.
- Topic filters only as real links (`/blog/topic/ux/`) once there are 5 or more posts per topic. Before that they are thin pages, so either don't create them or set them to `noindex`.

**Extras:** an RSS feed (`/blog/feed.xml`, with `<link rel="alternate">` in `<head>`), and an OG image per post (could be generated at build time from the title, in the site's style).

**Cadence:** 3–5 posts at launch so the index isn't empty, then a steady rhythm (e.g. 2 a month). Quality over volume.

## 4. Case studies as real pages: `/work/<slug>/`

Search intent: portfolio browsing, plus the client name or industry. These are the strongest proof pages for the service pages and posts.

- Move each dialog into its own page; `build-cases.py` already holds the data, so it can write pages instead of dialogs.
- Title: `<Project> — <type of work> case study | Prokhorov®`.
- Schema: `CreativeWork` (`creator` → `#person`, `about`, `image`), plus a breadcrumb.
- At the end: "Next project" (already there), "Services used" → the service page, and the CTA.
- The home page keeps the list, but each item becomes a link to the page. The cursor "View" stays.

## 5. Technical foundation (applies to every page)

| Area | What to do |
|---|---|
| Build | Turn `build-html.py` into a small multi-page build: shared header, footer, `<head>` partials; one source per page; posts in Markdown with front-matter (title, description, dates, image). See section 7. |
| Sitemap | Generated at build from the pages, with real `<lastmod>`. Drop `changefreq`/`priority` (Google ignores them). Leave out `noindex` pages. |
| robots.txt | Keep as now; add the sitemap. Don't block CSS/JS. |
| Canonicals | Self-referencing on every page; one host and one slash style; 301 redirects for the others. |
| Headings | One H1 per page, logical H2/H3. The home page H1 should say who and what, not only "Artem" or "Hello!" (e.g. a visually-matched H1 with the role, or the role in the H1 text). |
| Structured data | One `@graph`: `WebSite` + `Person` (`#person`) defined once, referenced by `ProfilePage`, `Service`, `CreativeWork`, `BlogPosting`, `BreadcrumbList`. Validate with the Rich Results Test. |
| Social cards | Per-page OG/Twitter title, description and 1200×630 image. |
| Images | Already AVIF/WebP with sizes: keep. Descriptive filenames and real `alt`; width/height on every image. |
| Performance | Core Web Vitals are ranking signals. **The preloader should show only on the first home-page visit in a session, never on inner pages or blog posts**, because it delays what visitors (and LCP) see. Keep the JS small; no framework. |
| JS content | All text stays in the HTML (as now), so crawlers and AI bots see it without running JS. |
| Internal links | Every page is reachable in ≤ 2 clicks: header (Work, Services, Info, Contact, Blog), footer with all main pages, contextual links between services ↔ cases ↔ posts. Descriptive anchor text ("web design case for X", not "click here"). |
| 404 | A designed `/404.html` with links back, served with a real 404 status. |
| Language | `lang="en"` everywhere. If a Russian version is added later: `/ru/...` with `hreflang` pairs, not automatic switching. |
| AI search | `llms.txt` with the factual summary, services and links; the same facts as the Person schema. Bing Webmaster Tools matters here, because several AI assistants use Bing's index. |
| Measurement | Google Search Console + Bing Webmaster Tools (submit the sitemap). Analytics optional; a cookieless one (Plausible or Cloudflare Web Analytics) avoids a consent banner. *(Decision needed.)* |

## 6. Header navigation (once pages exist)

```
Logo   Work  Services  Info  Contact  Blog          Bishkek, 22:35     Get in touch
```

- Links go to the pages. `aria-current="page"` marks the current page (a filled pill, as now). On the home page, scroll-spy can stay for the sections.
- **Fit:** five pills need about 330px. That fits from 1024px wide; at 768–1023 it needs checking (the time could hide on tablets).
- The phone menu gets the same five items. **Fit check needed:** at 375×667 the big links may push the menu into scrolling, so the type size may have to come down slightly.

## 7. Build options (decision needed)

1. **Extend the existing Python build (recommended).** Partials, page sources, Markdown posts via the `markdown` package (one dependency, build-time only, nothing shipped to visitors). The build also writes the sitemap, RSS, OG cards and JSON-LD. Fully under control, and it fits "no unnecessary libraries".
2. **A static site generator (Eleventy or Astro).** More ready-made (feeds, pagination, image handling), but it means a Node toolchain and a migration of the current setup.

Option 1 keeps the site exactly as it is and adds only what is needed.

## 8. Suggested order of work

1. **Build system:** partials, multi-page output, sitemap, per-page `<head>`.
2. **Case studies** as `/work/<slug>/` pages, plus the `/work/` index; home page links updated.
3. **`/about/`** with the ProfilePage/Person graph.
4. **`/services/`** and the service pages (needs the confirmed list of services).
5. **`/contact/`** (+ form decision).
6. **Blog:** templates, RSS, 3–5 launch posts.
7. **Launch tasks:** redirects, 404, Search Console + Bing, `llms.txt`, validate structured data, check Core Web Vitals.

## 9. What is needed from Artem

- The list of services actually offered (and whether prices or "starting from" ranges are published).
- A longer bio, experience and years, tools, real clients that can be named, any press, talks or awards.
- Contact: email only or a form; any booking link (Calendly/Cal.com); a response-time promise, if any.
- The blog: topics he wants to write about, the first 3–5 posts (or notes to shape them), and the language(s).
- Confirmation: the `/about/` URL with the "Info" label; and which analytics, if any.
