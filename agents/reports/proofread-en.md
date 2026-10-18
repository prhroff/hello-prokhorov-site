# Proofread of the English site before release

Date: 18 Oct 2026. Author: Copywriter. Review only, no site files changed. Line numbers count from the top of the file, front matter included.

## Коротко (по-русски)

- Опечаток и русских остатков в английской версии нет. Написание британское (colour, prioritised, enquiry, aluminium), длинные и короткие тире стоят правильно, счётчики совпадают с числом пунктов. Оффер «Поддержка сайта» за $200 в месяц на EN не попал никуда (страницы, llms.txt, JS).
- Главная проблема прежняя, её отмечали ещё 11 октября, и она не исправлена: Renovate подписан как клиентский сайт («Client Website», «Client: Renovate», aria-label «client website»), а по рабочим заметкам это собственный проект. До релиза нужно подтвердить или переподписать.
- Ещё три вещи важны для доверия. Чекбокс формы говорит «I agree to the Privacy Policy», а сама политика пишет, что это подтверждение прочтения, а не согласие. Пять отзывов с Kwork показаны по-английски без пометки о переводе (на RU-сайте такая пометка у английских отзывов есть). На /services/ услуги иллюстрируют кейсы, которые им не соответствуют (Website Development показан на Renovate, где Артём только рисовал; UI/UX показан на Lattice, а это маркетинговый сайт).
- Остальное мелочи: hand‑offs и handoff на одной странице, «Check confirmation» на курсоре, одни и те же фразы по два раза на главной, у Luma нет пометки «concept» в aria-label, Supaminds не упомянут в блоке Clients.

---

## src/index.html (Home)

1. **Statement, l.93** · style
   - Before: «I’m the designer and the developer — I plan the structure and UX, design the pages and build the site. One person, no hand‑offs, start to finish.»
   - After: «I’m the designer and the developer — I plan the structure and UX, design the pages and build the site myself.»
   - Why: the closing line is a rhythm triad and a punchline fragment. It also overclaims: on the same page, product interfaces are handed to the client’s developers (l.144, l.279).

2. **«hand‑offs» vs «handoff», l.93 vs l.279** · error
   - Before: «no hand‑offs» (l.93), «work alongside them through handoff» (l.279)
   - After: «handoff / handoffs» everywhere (also `src/pages/info.html:51` and `OG_IMAGE_ALT` in `scripts/site_config.py:19`)
   - Why: the same word is spelled two ways on one page. «Handoff» is the majority form on the site (index, info, services, web-design).

3. **Info, l.144** · style
   - Before: «…then design the site and build it myself — so the design you approve is the site that goes live.»
   - After: «I start with structure and content, then design the site and build it myself.»
   - Why: the FAQ on the same page (l.279) repeats «so the design you approve is the site that goes live» word for word. Keep it in the FAQ.

4. **Info, l.145** · style
   - Before: «I’ve worked remotely with clients worldwide since 2022. Once we agree the scope, the price is fixed. I work in English and Russian.»
   - After: «I’ve worked remotely with clients worldwide since 2022, in English and Russian.»
   - Why: «Once we agree the scope, the price is fixed» comes again in the FAQ (l.295), which is the version that links to the pricing post.

5. **Clients, l.202** · inconsistency
   - Before: «I’ve designed and built a website for Powermatic Technologies®, a product interface for Playgram.ai with Zeroqode [2026], …»
   - After: add Supaminds, e.g. «I’ve designed and built a website for Powermatic Technologies®, designed a multi‑page site for Supaminds, a product interface for Playgram.ai with Zeroqode [2026], …» (numbering 01–06 to follow).
   - Why: Supaminds is the first card in Selected Work and labelled a client website, but it is missing from the list of clients.

6. **Work card Luma, l.131** · inconsistency
   - Before: `aria-label="Luma Product Landing Page ’26 — product landing page, view case study"`
   - After: `aria-label="Luma Product Landing Page ’26 — concept, view case study"`
   - Why: the case page says «Client: Concept», and the Visual Hunters and Contour cards say «concept». Luma is the only concept without the label.

7. **Work card Renovate, l.125**: see `src/pages/work/renovate.html` (item 1 there).

8. **Reviews 4–8 (Kirill S., Alex W., Mark A., Konstantin M., Dmitry Y.), l.239–262** · inconsistency
   - Before: the Kwork reviews are shown in English with no note.
   - After: add a small line under each, e.g. «Translated from Russian», next to «Verified on Kwork».
   - Why: these clients wrote in Russian. The RU site marks the three English reviews «Перевод с английского», so EN should do the same for the reverse case. Without the note, a reader can take the English text for the client’s own words. (Review texts themselves: no typos.)

---

## src/pages/info.html (Info)

1. **About Me, l.29** · error (grammar)
   - Before: «One recent project: the product interface and landing pages for Playgram.ai, a collaborative AI workspace, made with the Zeroqode team and working closely with their developers.»
   - After: «A recent one: I designed the product interface and landing pages for Playgram.ai, a collaborative AI workspace, together with the Zeroqode team and their developers.»
   - Why: «working» has no subject (dangling participle), and «One recent project: …» is a colon reveal with no verb.

2. **About Me, l.30** · style
   - Before: «I studied advertising and PR, so for me a website starts not with the visuals but with what it has to say, and to whom.»
   - After: «I studied advertising and PR, so I start a website with what it has to say, and to whom. The visuals come after that.»
   - Why: removes the «not X but Y» contrast.

3. **What I Do, l.39** (same line in `scripts/site_config.py:52` → /llms.txt, and `src/pages/services/web-design.html:17`) · style
   - Before: «Structure, UX and visual design for websites that are clear, visually strong and easy to understand.»
   - After: «Structure, UX and visual design for websites and landing pages, ready to build.»
   - Why: «clear» and «easy to understand» say the same thing, and the three adjectives make a triad. The «After» is the approved PRICING line (`site_config.py:69`).

4. **How I Work, l.51** · error: «hand‑offs» → «handoffs» (see Home item 2).

5. **What I Do (05), l.37**: see `/services/` item 1 (five here, six there).

---

## src/pages/services.html (Services)

1. **Intro, l.47** · inconsistency
   - Before: «Six ways to work together.»
   - After: «Design & Development, or one part of it on its own.»
   - Why: Home (Services (05)) and Info (What I Do (05)) list five services, and /services/ says six. Both are right, because Design & Development is the other five together, but the copy should say so rather than show two counts.

2. **Intro, l.47 + «About the Prices» (`PRICING.note`, `scripts/site_config.py:77`)** · style
   - Before (intro): «Every project gets a fixed price once we agree the scope. Where a figure is shown, it’s where that service starts; the rest I quote per project.»
   - Before (note, same page): «“From” is where pricing starts, not a quote — once we agree the scope, you get a fixed price.»
   - After (intro): «Every project gets a fixed price once we agree the scope. Where there’s no figure, I quote per project.»
   - After (note): «“From” is the lowest a project starts at. The fixed price comes once we agree the scope.»
   - Why: the page makes the same two points twice, and «not a quote» is an «X, not Y» contrast. The note is also used on both draft service pages and in /llms.txt.

3. **Website Development, l.102** · inconsistency
   - Before: the example picture and caption is «Renovate».
   - After: Powermatic® (the one client site Artem designed and built), or this site.
   - Why: the Renovate case says «Role: Web Design» and «I designed the site», so it doesn’t show development. (If Renovate was in fact built by Artem, as the renovate/ prototype was, the case should say so: see renovate.html.)

4. **UI/UX Design, l.135** · inconsistency
   - Before: the example is «Lattice».
   - After: drop the picture link until there is a product-interface case, or use one from Playgram/Staffjet/Loglark if it can be shown.
   - Why: Lattice is a marketing website concept (Role: Web Design), not a product interface.

5. **Website Motion, l.119** · inconsistency (minor)
   - Before: the example is «Luma».
   - After: Visual Hunters® or Powermatic® (the full Powermatic case has the loader and menu), or keep Luma only if it really has motion worth showing.
   - Why: the Luma case says «Role: Landing Page Design» and mentions no motion.

6. **Design & Development list, l.66** (same in `src/pages/services/design-development.html:37`) · inconsistency
   - Before: «A CMS for the content you’ll change»
   - After: «In Framer, a CMS for the content you’ll change»
   - Why: the home FAQ (l.287) and l.105 here say that client editing means a Framer build. The line, as written, promises a CMS on code builds too.

7. **«Visual design for desktop and mobile», l.64 and l.86** (and both draft pages) · inconsistency (minor)
   - After: «Visual design for desktop, tablet and mobile»
   - Why: the descriptions under it on the service pages and in the home Process say «desktop, tablet and mobile».

---

## src/pages/work.html (Work)

1. **Front matter description, l.3** · inconsistency
   - Before: «Selected work by Artem Prokhorov: a client website I designed and built, landing pages and website concepts.»
   - After: «Selected work by Artem Prokhorov: client websites, a landing page and self-initiated website concepts.»
   - Why: it was written when Powermatic was the only client case. Supaminds is now listed as a client website too.

---

## src/pages/work/renovate.html (live)

1. **kind / Client / home aria-label, l.12, l.36, `src/index.html:125`** · inconsistency, serious (flagged on 11 Oct, still unfixed)
   - Before: «kind: Client Website», «Client — Renovate», «client website, view case study»
   - After (if Renovate is Artem’s own project): «kind: Self-Initiated Website», Client «Self-Initiated» (or drop the Client row, as the case-live-format plan suggests), aria-label «— own project, view case study».
   - Why: the project notes describe renovate/ as Artem’s own Figma-built site with invented clients inside it. The rule is never to claim a client that didn’t exist. Artem needs to confirm one way or the other before deploy.

2. **cs-head, l.33** · error (consistency)
   - Before: «Evolving the Standard.»
   - After: «Evolving The Standard.»
   - Why: the cover alt (l.23) and Artem’s own line in the design read «Evolving The Standard.». That line is his and shouldn’t be changed, so the case text should match it.

3. **description l.3 / cs-lead l.34** · style
   - Before: «…a business transformation firm with a stripped‑back approach: no excess, just precise, structured solutions that drive measurable value. I designed the site.»
   - After: «A website for Renovate, a business transformation firm. I designed the site.»
   - Why: «no excess, just…» is a «not X, just Y» move, and «solutions that drive measurable value» is agency copy. If it quotes Renovate’s own positioning from Artem’s Figma, put it in quotes or leave it to the cs-head.

---

## src/pages/work/supaminds.html (live)

1. **description l.3 / cs-lead l.35** · style
   - Before: «…a consultancy that helps businesses make smarter decisions, solve complex challenges and move forward with confidence.»
   - After: «A multi‑page website for Supaminds, a business consultancy. I designed the site.» (description: «A multi‑page website for Supaminds, a business consultancy, designed by Artem Prokhorov.»)
   - Why: a triad of stock phrases that could describe any consultancy. Add the firm’s real focus here if there is one.

## src/pages/work/visual-hunters.html (live)

1. **cs-head, l.34** · error (capitalisation)
   - Before: «Design Studio focused on Digital Products, Interfaces and Branding Systems»
   - After: «Design Studio Focused on Digital Products, Interfaces and Branding Systems»
   - Why: «focused» is the only lowercase word in a Title Case line. Leave it if the line is copied as-is from the design.

2. **description l.3 / cs-lead l.35** · style
   - Before: «A web concept exploring bold typography and 3D in web design. Built as a personal experiment in visual direction and layout systems.»
   - After: «A self-initiated website concept for a design studio, built around bold typography and 3D to try out a visual direction and a layout system.»
   - Why: «web concept … in web design» repeats itself, and «Built as…» is a sentence fragment.

3. **cover meta, l.27** · style: «Website Concept · Design Studio (Concept)» says «concept» twice in three tags. Use «Design Studio» there, since the Client row already says «Self-Initiated Concept».

## src/pages/work/contour-office.html (live)

1. **cover meta / Scope, l.26, l.36** · style (minor)
   - Before: «Website Redesign Concept»
   - After: «Website Concept»
   - Why: «redesign» implies an existing client site, but the case is self-initiated. «Explored as a website redesign for accounting and CPA firms» (l.34) can be «Explored for accounting and CPA firms.»

## src/pages/work/luma.html (live)

1. **cs-head, l.34** · error (spelling)
   - Before: «Prioritized opportunities from your incoming flow»
   - After: «Prioritised opportunities from your incoming flow»
   - Why: the next line says «prioritised», and the site uses UK spelling. Leave it if it is quoted from the design (then the alt in `_full/luma.html:45` matches it).

2. **description, l.3** · inconsistency
   - Before: «A landing page concept for Luma, a product that scans incoming interactions…»
   - After: «A self-initiated landing page concept for a product that scans incoming interactions from different sources and ranks them by their likely conversion potential.»
   - Why: Luma is a real brand name, and the agreed rule is no «for <company>» on self-initiated work.

3. **Client row, l.37** · inconsistency
   - Before: «Client — Concept»
   - After: «Client — Self-Initiated Concept»
   - Why: Lattice, Visual Hunters and Contour all say «Self-Initiated Concept».

4. **cover meta, l.27** · style: «Product Landing Page · Concept · Landing Page Design» says «Landing Page» twice. Use «Product Landing Page · Self-Initiated Concept · 2026».

## src/pages/work/lattice.html, powermatic.html (live): clean.

The «Work in Progress» block is the same on all seven cases. That’s fine.

---

## src/pages/work/_full/*.html (not linked: none are built, all are parked)

- None of the six is linked or published. `monolith-one.html` has no live version at all (the old /monolith URL is left to 404 by design).
- `lattice`, `luma`, `visual-hunters`, `contour-office`: the same issues as their live versions above (VH «focused», Luma «Prioritized», «Concept» vs «Self-Initiated Concept», «Website Redesign Concept»).
- `powermatic.html:55`, figcaptions «Campaign Key Visual», «Brand on Merchandise» · inconsistency: these suggest brand and campaign work beyond the stated «Role: Web Design and Development». Confirm before restoring, or caption them as the client’s brand assets.
- `monolith-one.html:50` · style: «“Absolute visual purity” is a rule, not a slogan» → «“Absolute visual purity” is a rule here: the right side carries no text, no connectors, nothing.» («X, not Y».)
- `monolith-one.html:43` · overclaim risk: «The visuals were generated from that specification rather than the other way round.» If they were AI-generated, say so plainly («I generated the visuals from that specification with [tool]»). «Generated» on its own is vague, and the «rather than» contrast can go.

---

## src/pages/services/design-development.html and web-design.html (DRAFT, not live)

These are still drafts (noindex, out of the menu). Proofread anyway:

- `design-development.html:20`, `web-design.html:78` · style: «so the design you approve is the site that goes live», the fourth use of this phrase on the site (Home ×2, both drafts). Keep it in one or two places.
- `design-development.html:37` · inconsistency: unconditional CMS (see /services/ item 6).
- `design-development.html:34`, `web-design.html:32` · inconsistency: «Visual design for desktop and mobile» above a description that says «desktop, tablet and mobile».
- `web-design.html:17` · style: «clear, visually strong and easy to understand» (see Info item 3) → «I design websites and landing pages — structure first, then how it looks, ready for your developer or for me to build.»
- `web-design.html:86`, the FAQ «What does my developer get?»: the Figma file, prototype and call are listed as a firm offer. The comment marks it «for Artem to confirm». Keep it out of the release until he does.
- Otherwise clean: the counters (06/05/05 and 04/04/05) match the items.

---

## src/pages/get-in-touch.html (form) + js/contact.js

1. **Consent checkbox, l.107 + `js/contact.js:104`** · inconsistency (legal wording)
   - Before: «I agree to the Privacy Policy.» / error «Please agree to continue.»
   - After: «I’ve read the Privacy Policy.» / «Please tick this box to continue.»
   - Why: Privacy Policy §4.3 and §5 say this checkbox «confirms that you have read this policy; it is not a request for consent to anything else». The label should say the same thing. (Update the RU key in `js/i18n.js` along with it.)

2. **Lead l.7, placeholder l.88, side column `reach_lead`, Q6 label l.87** · style
   - Before: «Tell me what you’re building…» (lead), «Tell me what you’re building, what you need, and anything else that might be useful.» (placeholder), «Tell me about the site or product…» (aside), «Tell me about the project» (Q6)
   - After (placeholder): «What you’re building, what you need, anything else that helps.»
   - Why: four «Tell me…» lines on one screen, two of them identical.

3. **Send button, l.111** · style (optional)
   - Before: «Send Project» → After: «Send»
   - Why: you send a form, not a project. RU already says «Отправить».

The other form messages are fine.

## src/pages/contact.html: clean.

## src/pages/privacy.html: clean.

The wording matches the code (Web3Forms, GA4 and Metrica after consent, the storage keys). The only problem is the checkbox label on the form (above).

## src/pages/404.html + src/layouts/lost.html, src/layouts/archive.html, src/pages/archive.html

- `404.html:33` «Back to Home» and `lost.html:18` «Back to Site» are on the same page · style → use «Back to Site» for both.
- `archive.html:20` noscript «Back to the site» → «Back to Site» · style (matches `archive.html` layout l.17).

## src/pages/blog.html

1. **description, l.7** · style
   - Before: «…how websites are planned, designed and built, and what each project teaches along the way.»
   - After: «Notes by Artem Prokhorov on how websites are planned, designed, priced and built.»
   - Why: no post is about lessons from projects, and «along the way» is filler. There is a pricing post, so «priced» is accurate.

---

## src/blog/ (live: one-page, design-and-build, structure-before-style, how-i-price)

Items from the 11 Oct review that were fixed are not repeated here. The four drafts (homepage brief, UX audit, fewer screens, AI) are not in the release. The first three are unchanged since that review.

**one-page-or-a-full-site.html**
- l.26 · style. Before: «…a contract for months of work usually can’t. Before someone signs up for months of work, they want to see…» After: «…a contract for months of work usually can’t. Before someone signs up for that, they want to see…» Why: «months of work» twice in a row.

**design-and-build-in-one-pair-of-hands.html**
- l.17 · inconsistency. Before: «At Zeroqode I designed the interface and landing pages for Playgram.ai…» After: «With the Zeroqode team, I designed the interface and landing pages for Playgram.ai…» Why: «At Zeroqode» reads as a job there. Info and Home say «with Zeroqode», and Info deliberately avoids job history.
- l.17 · style. «They were a strong team.»: filler, cut it.
- l.16 · error (heading case). Before: «Working With a Development Team» After: «Working with a Development Team» Why: the other headings lowercase short prepositions («Starts with a Sitemap», «Get from It»).

**structure-before-style.html**
- l.26 · style. Before: «…how I decide that is in <a>one page or a full site</a>.» After: «…how I decide that is in <a>One Page or a Full Site</a>.» Why: the Luma and Lattice cases give the post title in Title Case. (Same in the AI draft, l.31, «structure before style».)
- l.34 · error (heading case). «How It Turns Into Design and Price» → «How It Turns into Design and Price».

**how-i-price-fixed-scope-projects.html**
- l.23 and l.31 · inconsistency. «Three rounds of revisions.» and «Work starts after an upfront payment». These are firm terms that appear nowhere else, and the source notes still list revision rounds and payment terms as «not answered until confirmed» (`src/index.html:271`, `design-development.html:76`, `web-design.html:70`). Artem should confirm them. If confirmed, they belong in the FAQ on Home and the service pages too.
- l.17 · style. Before: «I quote development on its own, motion, product interfaces and design direction per project.» After: «Development on its own, motion, product interfaces and design direction are quoted per project.» Why: the object list splits «quote … per project» so far apart that it’s hard to follow.

**where-ai-helps-in-my-workflow.html (draft, rewritten since 11 Oct)**
- l.38 · style. «The design and the final checks are done by me.» → «I do the design and the final checks myself.»
- l.33 · still check with Artem (as on 11 Oct): «The first version of the copy» is listed as something done without AI. It must be true before this goes live.

---

## Strings outside pages

- **js/main.js:995**, the cursor pill over a review’s source link · error. Before: «Check confirmation» After: «View Source» Why: unidiomatic English, and the only sentence-case label among «View», «Drag» and the Title Case buttons. (Update the RU key in `js/i18n.js` along with it.)
- **scripts/site_config.py:19 `OG_IMAGE_ALT`** · error + style. Before: «The designer and the developer, one person, no hand-offs: Powermatic®, Visual Hunters and Supaminds work, and the Powermatic® site on a tablet in a rust-red velvet armchair» After: «Work by Artem Prokhorov: Powermatic®, Visual Hunters® and Supaminds, with the Powermatic® site on a tablet in a rust-red velvet armchair» Why: «Visual Hunters» is missing its ®, «hand-offs» is the off spelling, and the alt opens with a slogan instead of describing the image.
- **scripts/site_config.py:16 `AREA_SERVED`, :13 `PHONE`; build-html.py:399/408/446, :907** · inconsistency (low, Artem’s call). The EN pages’ Schema gives «Kyrgyzstan» first in areaServed and the +996 phone on Person, Organization and every Service, and /llms.txt lists «WhatsApp +996…» as a contact. The EN site is the international version and shows no phone. Consider «Worldwide» only plus no telephone on EN pages, or accept it as one person, one number.
- **src/i18n/en.json, partials, layouts, js/consent.js, js/contact.js** (other messages): clean. «$200 / monthly support» does not appear anywhere on EN.

---

## Patterns that repeat across pages

1. **Stock phrases reused word for word.** «so the design you approve is the site that goes live» (4×), «nothing lost between a designer and a developer / a design and its build / the design and the build» (4×), «no account managers» (3×), «once we agree the scope» (6×). Each is fine once per page. Twice on Home is too many.
2. **Concept labelling is uneven.** «Self-Initiated Concept» vs «Concept», aria-labels with and without «concept», cards on /work/ with no marker, Renovate with a client claim. One rule for all seven cases would fix it.
3. **Service examples don’t match case roles.** The cases illustrate services they don’t demonstrate (Development → Renovate, UI/UX → Lattice, Motion → Luma).
4. **Client positioning copy pasted as case leads.** «make smarter decisions, solve complex challenges…», «solutions that drive measurable value». These are the clients’ agency triads. Say plainly what the firm is and what Artem did.
5. **«handoff» has three spellings** (handoff, hand‑offs, hand-offs).
6. **Heading case.** Title Case is the house style, but short prepositions are inconsistent («With», «Into» vs «with», «from»), and a few lines are lowercase («focused»).

## Counts

- error: 8 (hand‑offs/handoff; Info dangling participle; VH «focused»; Luma «Prioritized»; Renovate «the/The Standard»; «Check confirmation»; blog heading case ×2 counted once; OG alt ®)
- inconsistency: 16
- style: 21

## Top 5 to fix before deploy

1. **Renovate client claim** (`src/pages/work/renovate.html:12,36`, `src/index.html:125`): confirm it with Artem or relabel it as his own project.
2. **Consent checkbox wording** (`src/pages/get-in-touch.html:107`, `js/contact.js:104`): «I’ve read the Privacy Policy», to match Privacy §5.
3. **Kwork reviews without «Translated from Russian»** (`src/index.html:239–262`).
4. **Service examples** on `/services/` (l.102 Renovate for Development, l.135 Lattice for UI/UX): swap them or drop the links. Also add Supaminds to the Clients line (`src/index.html:202`) and update the /work/ description (`src/pages/work.html:3`).
5. **Luma labelling** (`src/index.html:131` aria «concept», `src/pages/work/luma.html:3` no «for Luma», l.37 «Self-Initiated Concept»). Quick wins in the same pass: «handoff» spelling, «Check confirmation» → «View Source», OG alt.
