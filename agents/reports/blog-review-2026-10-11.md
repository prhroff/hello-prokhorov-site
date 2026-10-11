# Ревью блога перед первой публикацией (ART-24)

Дата: 11 октября 2026. Автор: Copywriter. Только ревью: файлы сайта не менялись.

Что прочитано: все 8 постов в `src/blog/` (`_template.html` — образец, не пост), чтобы понять голос Артёма — `src/pages/info.html`, `src/index.html`, `src/pages/services.html`, `src/pages/work/*.html`, `llms.txt`, `agents/reports/case-copy-guide.md`, `scripts/site_config.py` (TOPICS, NAV, PRICING), `scripts/build-html.py` (`<when>`, featured, topic filter), черновики `src/pages/services/web-design.html` и `design-development.html`.

Номера строк в ссылках вида `файл:строка` считаются от начала файла, вместе с front matter.

---

## 0. Коротко

- По-настоящему готов один пост — `one-page-or-a-full-site`. Остальные шесть — заготовки по 190–380 слов: структура правильная, но процесса и примеров самого Артёма в них почти нет, а местами есть утверждения, которых на сайте нет.
- `fewer-screens-clearer-product` целиком держится на неназванном SaaS-проекте с аналитикой и результатом («support questions dropped»). Публиковать его нельзя, пока Артём не скажет, что это за проект и правда ли всё так.
- `design-and-build-in-one-pair-of-hands` (сейчас `featured: yes`) открывается фразой «Most of my projects end with a live website», а сайт ей противоречит: единственный клиентский сайт, который Артём и нарисовал, и собрал, — Powermatic. Playgram, Staffjet и Loglark — интерфейсы и дизайн-система, их собирали разработчики клиентов.
- `how-i-price-fixed-scope-projects` пишет «I quote **most** projects at a fixed price», а `/services/` и FAQ на главной обещают фиксированную цену **каждому** проекту. Это надо свести к одному.
- Даты: черновикам проставлены прошлые даты (`2026-03-12` … `2026-09-18`), а блог ещё ни разу не выходил. Из `date` строится `datePublished`, так что перед публикацией в каждом посте должна стоять настоящая дата выхода.

---

## 1. Вердикт по каждому посту

| Пост | Слов (≈) | Оценка | Вердикт | Своего материала достаточно? | Пересечения |
|---|---|---|---|---|---|
| `one-page-or-a-full-site` | 560 | 8/10 | **публиковать после правок** | Да: Luma, Lattice (7 страниц — факт из кейса), реальные цены, источники | с `the-homepage-brief…` (сомнения превращаются в страницы), с `what-a-ux-audit…` (скорость первого экрана) |
| `design-and-build-in-one-pair-of-hands` | 370 | 6/10 | **публиковать после правок** (после ответа Артёма по первой фразе) | Наполовину: мысль его (совпадает с Info/FAQ), но примеры выдуманы («German headline», «Tuesday»), а настоящих (Powermatic, Playgram + Zeroqode, этот сайт) нет | с Info «How I Work» и FAQ «Do you build what you design?» (это развёрнутая версия) |
| `structure-before-style` | 190 | 5/10 | **переписать (дописать)** | Нет: пример outline безличный, хотя под рукой есть настоящий (7 страниц Lattice) | с `how-i-price…` («scope rather than style»), с `one-page…` |
| `the-homepage-brief-i-send-startups` | 220 | 5/10 | **переписать (дописать)**, но только если такой бриф правда существует | Каркас есть (5 вопросов), нет того, как ответы ложатся на страницу | с `one-page…`, с `what-a-ux-audit…` (непрояснённые сомнения) |
| `how-i-price-fixed-scope-projects` | 200 | 5/10 | **переписать (дописать)** | Мало: в посте нет ни цен, ни того, от чего зависит цена, хотя это всё уже написано на сайте (PRICING) | с `structure-before-style`; слово «moodboard» повторяет пост про бриф |
| `what-a-ux-audit-actually-finds` | 220 | 4/10 | **пока не публиковать**: дописать на реальных примерах; кроме того, «UX Audit» нет среди услуг на `/services/` | Нет: находки общие, ни одного случая из работы | с `one-page…` (скорость), с `the-homepage-brief…` (сомнения) |
| `where-ai-helps-in-my-workflow` | 190 | 4/10 | **пока не публиковать**: нужны факты (какие инструменты и где) | Нет: ни одного названия инструмента, ни одного примера | слабо с `design-and-build…` |
| `fewer-screens-clearer-product` | 210 | 2/10 | **не публиковать**: весь пост о конкретном проекте, которого нет на сайте, с результатом, который нигде не подтверждён | Неизвестно: если это Loglark, Staffjet или Playgram, нужен рассказ Артёма | — |

Про топики: `site_config.py` прямо говорит «a topic earns its place with two or more posts». Сейчас `development`, `process` и `ai` держатся на одном посте каждый. Если в первую партию попадут `design-and-build…` и `how-i-price…`, фильтр на `/blog/` покажет три топика, и в двух будет по одному посту. Жить с этим можно, но лучше знать заранее.

---

## 2. Первая партия

`one-page-or-a-full-site` уже ссылается на `structure-before-style`, `the-homepage-brief-i-send-startups` и `how-i-price-fixed-scope-projects`. В релизной сборке черновики не собираются, поэтому если выпустить его одного, три ссылки поведут на 404.

**Рекомендую выпустить вместе пять постов (в план сайта заложено 3–5 на старте):**

1. `one-page-or-a-full-site` — после мелких правок из раздела 4. Сделать его `featured: yes`: это самый полный текст и лучший образец голоса.
2. `structure-before-style` — после того как пост дописан. Почти всё для него уже есть на сайте: фаза Structure с главной и семь страниц Lattice.
3. `how-i-price-fixed-scope-projects` — после того как пост дописан. Цены, от чего зависит цена и смысл «from» уже утверждены в `PRICING`, у Артёма нужно уточнить только процесс.
4. `the-homepage-brief-i-send-startups` — только если Артём подтвердит, что отправляет клиентам такой бриф.
5. `design-and-build-in-one-pair-of-hands` — после того как убраны выдуманные детали и первая фраза приведена к правде. По позиционированию это главный пост блога (Design & Development).

Порядок на `/blog/`: новые идут первыми, плюс один featured. Если всё выходит в один день, порядок внутри дня решает сборка. Если хочется ритма, можно выпускать по 1–2 в неделю в этом же порядке, у каждого с настоящей датой.

**Запасной вариант**, если бриф или цены не подтвердятся к релизу: обернуть ссылки в `one-page…` так, чтобы без живой цели оставался обычный текст:

```html
<when live="/blog/the-homepage-brief-i-send-startups/"><a href="/blog/the-homepage-brief-i-send-startups/">homepage brief</a></when><when draft="/blog/the-homepage-brief-i-send-startups/">homepage brief</when>
```

(`<when live|draft>` работает в любой странице, `scripts/build-html.py:750`.) Внимание: в варианте с `draft` фраза «The homepage brief I send founders» всё равно утверждает, что такой бриф есть. Если Артём этого не подтвердит, фразу надо переписать, а не только снимать ссылку.

**Придержать:** `what-a-ux-audit-actually-finds`, `where-ai-helps-in-my-workflow` (обоим нужны факты; это вторая партия), `fewer-screens-clearer-product` (не публиковать в нынешнем виде).

**Перед публикацией в каждом посте:** `status: live`, `date` и `updated` = настоящий день выхода. У `design-and-build…` снять `featured: yes`, если featured становится `one-page…`.

---

## 3. Карта ссылок

Принципы: анкор — это часть обычной фразы, без «click here» и без ключевых слов ради ключевых слов. На черновые страницы услуг (`/services/web-design/`, `/services/design-development/`) ссылаемся только через `<when live="…">…</when><when draft="…">…</when>`, пока они не на сайте; до этого все ссылки ведут на `/services/`. Концепты (Lattice, Luma) называем концептами, Renovate — собственным проектом, не клиентом.

### 3.1 Из постов

**`one-page-or-a-full-site`**
- Уже есть и работают: Luma (`:14`, «The Luma concept»), Lattice (`:15`), `the-homepage-brief…` (`:23`, «homepage brief»), `structure-before-style` (`:23`, «starts as a list of pages»), `how-i-price…` (`:32`, «I fix the scope»), `/services/` (`:32`, «services page»), `/get-in-touch/` (`:33`). Анкоры хорошие, менять не надо.
- Когда страницы услуг выйдут, в `:32` добавить:
  - «Design for a website or a landing page starts at $490» → анкор **«Design for a website or a landing page»** → `/services/web-design/`
  - «a complete site, designed and built, from $990» → анкор **«a complete site, designed and built»** → `/services/design-development/`
- На `design-and-build-in-one-pair-of-hands` отсюда не ссылаться: ссылок в посте уже восемь, и пост про дизайн с разработкой связан с ним через страницу услуги.

**`structure-before-style`**
- → Lattice. Предлагаемая фраза в новом примере outline: «For the <a href="/work/lattice/">Lattice</a> concept the list was seven pages long: home, product, customers, security, pricing, docs and changelog.» (факт из `src/pages/work/_full/lattice.html:45`).
- → `one-page-or-a-full-site`. Предлагаемая фраза: «Sometimes the list is one page long. How I decide that is in <a href="/blog/one-page-or-a-full-site/">one page or a full site</a>.»
- → `the-homepage-brief…`. Предлагаемая фраза: «The answers to the <a href="/blog/the-homepage-brief-i-send-startups/">brief I send before I start</a> become the first outline of the home page.»
- → `how-i-price…`. Предлагаемая фраза: «The agreed list of pages goes straight into the <a href="/blog/how-i-price-fixed-scope-projects/">fixed scope</a>.»
- → `/services/` (позже `/services/web-design/`). В конце: «Structure is the first part of every <a href="/services/">web design project</a> I take on.»

**`the-homepage-brief-i-send-startups`**
- → `one-page-or-a-full-site`. В «What Usually Changes» (`:29`) после «The doubts a visitor has are the sections the page needs…» добавить: «On a bigger project they <a href="/blog/one-page-or-a-full-site/">turn into pages of their own</a>.»
- → `structure-before-style`. Предлагаемая фраза: «The answers go into the <a href="/blog/structure-before-style/">page outline</a> before anything is drawn.»
- → Luma (к вопросу 3, «the one thing they should do next»): «On the <a href="/work/luma/">Luma</a> concept that was a single button…» — только если Артём подтвердит, что это так.
- → `/get-in-touch/` — уже есть (`:30`); анкор «project I start» лучше заменить, см. раздел 4.

**`how-i-price-fixed-scope-projects`**
- → `/services/`. Новая фраза с ценами: «Design for a website or landing page starts at $490, and a complete site, designed and built, at $990; the starting price for each service is on the <a href="/services/">services page</a>.» Когда выйдут страницы услуг, переставить анкоры как в `one-page…`.
- → `structure-before-style`. Пункт списка `:18` «The pages or screens, by name.» → «The pages or screens, by name, from the <a href="/blog/structure-before-style/">sitemap we agree first</a>.»
- → `one-page-or-a-full-site`. Предлагаемая фраза: «The biggest factor is the number of pages, which is why I first help decide <a href="/blog/one-page-or-a-full-site/">whether you need one page or a full site</a>.»
- → `/get-in-touch/`. Закрывающая фраза: «<a href="/get-in-touch/">Tell me what you need</a>, and I'll come back with a fixed quote.» (повторяет `PRICING.next`).

**`design-and-build-in-one-pair-of-hands`**
- → Powermatic. Новая фраза: «<a href="/work/powermatic/">Powermatic</a> is one of those: I designed the site and built it in Framer.» (факты из кейса).
- → `/info/`. Предлагаемая фраза: «I build the websites I design, <a href="/info/">this one included</a>.» (дословно из Info).
- → `/services/` (позже `/services/design-development/`). В последнем абзаце `:31`: «…one pair of hands is usually faster and closer to what was intended. That's what <a href="/services/">Design &amp; Development</a> covers.»
- → `structure-before-style`. По желанию, если в посте будет абзац о том, что структура идёт первой.

**`what-a-ux-audit-actually-finds`** (вторая партия)
- → `the-homepage-brief…`. К пункту `:19` («A key doubt is never addressed») добавить в текст раздела: «It's the same question I ask in my <a href="/blog/the-homepage-brief-i-send-startups/">homepage brief</a>: what would make a visitor doubt you?»
- → `one-page-or-a-full-site`. К пункту `:20` про медленный первый экран: «Speed matters on <a href="/blog/one-page-or-a-full-site/">any size of site</a>.»
- → `/services/` или `/get-in-touch/`. Пока аудит не стал отдельной услугой: «If the site mostly works, I start with this kind of review and then make the changes myself.» (из FAQ на главной).

**`where-ai-helps-in-my-workflow`** (вторая партия)
- → `structure-before-style`. В «Where I Switch It Off» `:25`: «Structure is where I switch it off: <a href="/blog/structure-before-style/">every site starts as a list of pages</a> I write myself.»
- → `design-and-build-in-one-pair-of-hands`. В «What Clients Get» `:28`: «…testing on real devices, which matters most <a href="/blog/design-and-build-in-one-pair-of-hands/">when I build what I designed</a>.»

**`fewer-screens-clearer-product`** — не публикуется, ссылки не планирую.

### 3.2 Со страниц сайта на посты

Все такие ссылки оборачивать в `<when live="/blog/<slug>/">`, чтобы до публикации поста на сайте не появилось битой ссылки.

| Где | Место | Анкор → пост |
|---|---|---|
| `src/pages/services.html:47` | `sw-intro`: «Every project gets a fixed price once we agree the scope.» | «a fixed price» → `/blog/how-i-price-fixed-scope-projects/` |
| `src/pages/services.html:71` (блок Design & Development) | новая строка `sw-svc__more` под списком | «Why I design and build in one pair of hands» → `/blog/design-and-build-in-one-pair-of-hands/` |
| `src/pages/services.html:88` (блок Web Design) | новая строка `sw-svc__more` под списком | «How I decide between a landing page and a full site» → `/blog/one-page-or-a-full-site/` |
| `src/pages/services/web-design.html:74` (черновик) | FAQ «Do you design single landing pages?», новая фраза в конце ответа: «Here's how I decide which one a project needs.» | «how I decide which one a project needs» → `/blog/one-page-or-a-full-site/` |
| `src/pages/services/web-design.html:42` (черновик) | «How It Goes», Structure: «Deciding what goes on which page…» | «what goes on which page» → `/blog/structure-before-style/` |
| `src/pages/services/design-development.html:26` (черновик) | «nothing lost between a design and its build» | этот же фрагмент → `/blog/design-and-build-in-one-pair-of-hands/` |
| `src/pages/info.html:52` | «turn that into a clear structure, flow and content hierarchy, and only then design how it looks» | «a clear structure» → `/blog/structure-before-style/` |
| `src/pages/info.html:53` | «I build the websites I design — this one included.» | «I build the websites I design» → `/blog/design-and-build-in-one-pair-of-hands/` |
| `src/index.html:283` (FAQ «We already have a website…») | «I can start by reviewing its usability, structure, technical SEO and performance» | «reviewing its usability» → `/blog/what-a-ux-audit-actually-finds/` (когда выйдет) |
| `src/index.html:295` (FAQ «How does a project start?») | «Once we agree the scope, the price is fixed» | «the price is fixed» → `/blog/how-i-price-fixed-scope-projects/` |
| `src/pages/work/lattice.html:35` | новая фраза после `cs-lead`: «Why it has seven pages is in One Page or a Full Site.» | «One Page or a Full Site» → `/blog/one-page-or-a-full-site/` |
| `src/pages/work/luma.html:35` | новая фраза после `cs-lead`: «I explain why it's a single page in One Page or a Full Site.» | «One Page or a Full Site» → `/blog/one-page-or-a-full-site/` |
| `src/pages/work/powermatic.html:34` | новая фраза после «I designed the site and built it.»: «More on what changes when one person designs and builds a site.» | «what changes when one person designs and builds a site» → `/blog/design-and-build-in-one-pair-of-hands/` |
| Renovate, Contour Office, Visual Hunters | — | подходящего поста нет, ссылки не ставить. С Renovate на `structure-before-style` — только если Артём подтвердит, что проект начинался с карты сайта |

На RU-страницах (`src/ru/…`) ссылок на английские посты не ставить, пока у блога нет русской версии.

---

## 4. Правки по постам

### 4.1 `src/blog/one-page-or-a-full-site.html` — публиковать после правок

1. **`:29`** — «If you're wondering what a good result looks like, Unbounce's 2024 benchmark puts the median landing page conversion rate at 6.6%. Treat that as a rough reference, not a target: it varies a lot by industry.»
   → удалить оба предложения.
   Почему: цифра конверсии не относится к скорости, о которой раздел; к тому же «a rough reference, not a target» — конструкция «X, а не Y». Медиана Unbounce 6.6% в отчёте 2024 года действительно есть, источник настоящий, так что если цифру жалко, её место — в «Where Do Visitors Come From?», без хвоста «not a target».
2. **`:29`** — «In a Deloitte study for Google of 37 European brands, a mobile site 0.1 seconds faster went with 8.4% more conversions in retail.»
   → «In a 2020 Deloitte study for Google of 37 European brands, a mobile site 0.1 seconds faster went with 8.4% more conversions in retail.»
   Почему: исследованию шесть лет, год должен быть виден. Цифры совпадают с «Milliseconds Make Millions». Перед публикацией открыть все три внешние ссылки и проверить, что они не ведут на 404.
3. **`:19`** — «That doesn't mean writing thirty pages, just one clear page for each thing you'd like to be found for.»
   → «In practice that's one clear page for each service you'd like to be found for.»
   Почему: убираем контраст «не X, а просто Y».
4. **`:22`** — «A small, quick purchase can be decided on one page. A bigger contract can't.»
   → «A small, quick purchase can be decided on one page; a contract for months of work usually can't.»
   Почему: короткое «A bigger contract can't.» читается как панчлайн, а через точку с запятой это обычная мысль.
5. **`:11`** — «I settle it with three questions on the first call, before we talk about design.»
   → нужно подтвердить у Артёма. Сайт говорит, что проект начинается с короткого сообщения через форму и работа идёт async (FAQ на главной). Если созвона обычно нет: «I settle it with three questions before we talk about design.»
6. **`:14`** — «it explains one product, and every section leads to the same button.»
   → нужно подтвердить у Артёма. В кейсе Luma этого нет. Если не так: «it explains one product to one kind of visitor.»
7. **`:15`** — «because the people who choose a product like that read far more than one page can hold.»
   Семь страниц — факт из кейса, а причина — толкование. Оставить можно, но лучше назвать сами страницы, они доказывают мысль лучше: «…has seven pages (home, product, customers, security, pricing, docs and changelog), because the people who choose a product like that read far more than one page can hold.»
8. **`:23`** — «The homepage brief I send founders…»
   Нужно подтвердить у Артёма, что такой бриф правда существует (см. 4.4). Иначе фразу переписать: «Before I design a home page, I ask what would make a visitor doubt you.»
9. **Title** — «One Page or a Full Site — How I Decide for a New Project»
   → «Landing Page or Full Website? How I Decide Which to Build»
   Почему: так люди ищут («landing page or website»), а вопрос без двоеточия и тире-трюка читается честнее. `heading` «One Page or a Full Site» можно оставить.
10. **Description** — «…three questions about what you sell, where visitors come from and trust.»
    → «How I decide whether a project needs a landing page or a multi-page website: what you sell, where visitors come from and how much they need to trust you.» (≈155 знаков)
    Почему: «and trust» обрывается, смысл не дочитывается.

Остальное работает, не трогать: вступление с ответом в первом абзаце, Luma/Lattice как примеры, «Starting Small Is Fine», цены и CTA.

### 4.2 `src/blog/design-and-build-in-one-pair-of-hands.html` — публиковать после правок

1. **`:15`** — «Most of my projects end with a live website, not a Figma file.»
   → нужно подтвердить у Артёма. По сайту: собранный им клиентский сайт — Powermatic (Framer) и сам helloprokhorov.com; Playgram, Staffjet, Loglark — интерфейсы с передачей разработчикам. Вариант по фактам сайта: «When I take on a website, I usually build it too: <a href="/work/powermatic/">Powermatic</a> went live in Framer, and this site is built in code.»
   Почему: противоречит списку клиентов на главной; к тому же «X, not Y».
2. **`:15`** — «…and over time that has changed how I design more than anything I've read about design.»
   → «…and it has changed how I design.»
   Почему: гипербола, которую никак не проверить.
3. **`:19`** — «If a layout doesn't survive a long German headline, I find out on Tuesday, not three weeks after launch.»
   → вопрос Артёму, был ли настоящий случай. Под рукой есть реальный пример: русская версия этого сайта (запущена 10 октября), где слова длиннее английских. Если что-то ломалось и он это поймал: «When I added the Russian version of this site, longer words broke [что именно]; I saw it the same day, because I was the one building it.» Если такого случая не было: «If a layout breaks on a long headline, I find out while building it, before anyone else sees it.»
   Почему: немецкого на сайте нет, Артём работает на EN/RU, а «Tuesday» и «three weeks» — выдуманные детали.
4. **`:22`** — «A scroll-linked animation might take a day; a clearer pricing table might take an hour… with real numbers.»
   → оставить пример, но убрать «with real numbers»: «I can weigh those against each other with the client in the same conversation.»
   Почему: цифры условные, а «real numbers» обещает, что они настоящие.
5. **`:30`** — «There, my job is the design system and the interface, and I make the handoff as clean as I can.»
   → «There, my job is the interface and the design system. On Playgram.ai I worked that way with the Zeroqode team, alongside their developers.»
   Почему: настоящий пример с сайта (Info, главная) вместо общих слов.
6. **`:31`** — «one pair of hands is usually faster, cheaper and closer to what was intended.»
   → «one pair of hands is usually faster and closer to what was intended.»
   Почему: триада; «cheaper» ничем не подкреплено и спорит с ценой $990 против $490 за один дизайн.
7. **`:23–27`** — три параллельных буллета. Оставить, но их было бы полезно подкрепить одним реальным примером (вопрос 4).
8. Title и description оставить. Description ≈150 знаков, нормально.

### 4.3 `src/blog/structure-before-style.html` — переписать (дописать до 500–700 слов)

Текущие проблемы:
- **`:14`** «The first thing I deliver on a website project isn't a visual. It's a sitemap…» — «не X. Это Y.» → «The first thing I deliver on a website project is a sitemap and a plain-text outline of each page…»
- **`:17`** «A visual invites opinions on colour and type. An outline invites the conversation that matters…» — параллельный контраст → «With an outline, the conversation is about order and content: is this the right order, is anything missing, does this page need to exist at all?»
- **`:21–23`** — пример outline («Work — three projects, each with the problem and the outcome») безличный. Заменить настоящим: семь страниц Lattice или страницы этого сайта (Home, Work, Info, Services, Contact, Blog).
- **`:27`** «so the design can concentrate on saying it well» — оставить.
- **Title** «Structure Before Style — The Sitemap Is the First Design» → «Why Every Website I Design Starts with a Sitemap». `heading` можно оставить «Structure Before Style»: на него ссылается `one-page…` анкором «starts as a list of pages».
- **Description** → «Why every website I design starts as a sitemap and a plain-text outline of each page, and what that changes for the visual design that follows.» (≈145)

План (только из того, что Артём подтвердит):
1. Первым абзацем ответ: что сдаётся первым и в каком виде (документ, FigJam, Figma?).
2. Как выглядит outline: реальный пример (Lattice: 7 страниц и что на главной).
3. Что клиент утверждает на этом этапе и сколько это занимает.
4. Случай, когда outline что-то изменил: убрали страницу, переставили секции.
5. Как outline переходит в дизайн и в фиксированный scope (ссылки на `how-i-price…`, `one-page…`).

### 4.4 `src/blog/the-homepage-brief-i-send-startups.html` — переписать (дописать до 500–700 слов), если бриф существует

Главный вопрос: отправляет ли Артём клиентам эти пять вопросов? На сайте сказано, что проект начинается с формы `/get-in-touch/`, где спрашивают, что нужно, сроки и бюджет. Это другой набор вопросов. Если брифа нет, пост переписать как «What I ask before I design a home page» без слов «I send every startup».

Правки:
1. **`:14`** «They take about an hour to answer, and they save more design rounds than any moodboard.» — нужно подтвердить у Артёма «about an hour». «More … than any moodboard» — штамп; к тому же «moodboard» есть и в посте про цены. → «They take about an hour to answer, and the answers become the first draft of the page.»
2. **`:26`** «That version is almost always closer to the headline we end up with.» — нужно подтвердить у Артёма. Если так и есть, лучше показать на примере «было → стало» (можно без имени клиента).
3. **`:29`** «A homepage that answers those quietly converts better than one that only repeats the promise.» — утверждение о конверсии без источника. → «A homepage that answers those doubts gives a visitor fewer reasons to leave.» Или убрать.
4. **`:30`** «If you're preparing a launch, the brief is part of every <a href="/get-in-touch/">project I start</a>.» → «If you're preparing a launch, <a href="/get-in-touch/">tell me about it</a>, and the brief will be the first thing I send.» Почему: анкор «project I start» ничего не говорит о том, куда ведёт.
5. **Title** «The Homepage Brief I Send Every Startup» — «every» нужно подтвердить; иначе «The Five Questions I Ask Before Designing a Homepage».
6. **Description** «…saves weeks of design rounds later» — «weeks» ничем не подкреплено → «The five questions I ask founders before I design a homepage, why I want the answers in plain sentences, and how each one shows up on the page.» (≈150)

Чего не хватает: что делает каждый ответ на странице (1 → первый экран, 3 → кнопка, 4 → секции, 5 → заголовок), лучше на одном примере. И, возможно, сам бриф, который можно скопировать.

### 4.5 `src/blog/how-i-price-fixed-scope-projects.html` — переписать (дописать до 500–700 слов)

1. **`:14`** «I quote most projects at a fixed price.» → «Every project I take on gets a fixed price once we agree the scope.» Почему: так сказано на `/services/` (`:47`) и в FAQ на главной; «most» им противоречит. Если исключения есть, их надо назвать, а сайт тогда поправить.
2. **`:14`** «it keeps me focused on the result rather than the hours» → «I'm paid for the result, so I don't count hours.» Почему: «X rather than Y».
3. **`:19`** «How many rounds of changes each stage includes.» — нужно подтвердить у Артёма. Число раундов на сайте сознательно не названо (`src/index.html:271`: «Not answered until confirmed: … revision rounds»). Пункт можно оставить, только если раунды правда прописываются в scope.
4. **`:21`** «What "done" means: a file, a live site, or a site plus a handover call.» — нужно подтвердить «handover call» (в черновике `web-design.html:86` он есть для разработчика, а на живом сайте нет).
5. **`:25`** «I say so as soon as I see it, give the cost in the same message, and let the client choose. Sometimes we swap something out…» — процесс правдоподобный, но нужно подтвердить у Артёма.
6. **`:28`** «The projects that went best were the ones where the first call was spent on scope rather than style. A clear list is less exciting than a moodboard, and far more useful.» — «rather than», второй «moodboard» в блоге и вывод-панчлайн. Лучше конкретный случай от Артёма; если его нет, раздел убрать.
7. **Добавить из утверждённых текстов сайта** (`PRICING` в `scripts/site_config.py:57–72`): стартовые цены ($490 Web Design, $990 Design & Development, остальное «Quoted per project»), от чего зависит цена (`factors`), что «from» — нижняя планка, а не смета (`note`). Сроки — только как на `/services/` (2–3 недели Web Design, 4–6 недель Design & Development; в самом `services.html:18` они помечены как placeholders, это тоже подтвердить).
8. **Title** — можно оставить; вариант проще: «How I Set a Fixed Price for a Website Project».
9. **Description** → «Why every website project I take on gets a fixed price, what goes into the written scope, and what happens when the scope changes halfway through.» (≈150)

Вопросы к Артёму: условия оплаты (предоплата, этапы), что считается изменением scope, как он считает доплату.

### 4.6 `src/blog/what-a-ux-audit-actually-finds.html` — пока не публиковать

1. **Позиционирование:** UX Audit нет среди услуг на `/services/`, он есть только в `knowsAbout` и как вариант в FAQ («I can start by reviewing…»). Сначала решить, продаёт ли Артём аудит отдельно. Если нет, пост пишется как «что я нахожу, когда смотрю ваш существующий сайт перед редизайном».
2. **`:14`** «Clients often expect a UX audit to come back with notes on button colours…» — нужно подтвердить у Артёма.
3. **`:25`** «I watch recordings where they exist…» — нужно подтвердить (какие: Hotjar, Метрика Webvisor, Clarity?).
4. **`:26`** «The result is a short list, not a hundred-page report. Most teams can fix the top five in a sprint.» — «X, not Y», а «top five in a sprint» ничем не подкреплено; «sprint» — стартап-жаргон. → «The result is a short list, ranked by how many people each problem affects and how cheap it is to fix, and I can make the changes myself.»
5. **`:16–21`** — четыре находки общие. Нужны 2–3 настоящих случая (без имён), иначе пост ничем не отличается от сотни таких же.
6. **Title** «What a UX Audit Actually Finds (It's Rarely the Buttons)» → «What a UX Audit Usually Finds on a Website». Почему: скобка — кликбейтный приём, а «Actually» — штамп.
7. **Lead** «It's rarely the buttons. Usually it's a missing answer, somewhere in the middle of the page.» повторяет шутку из заголовка → «The problems I find most often, and how I decide which to fix first.»

### 4.7 `src/blog/where-ai-helps-in-my-workflow.html` — пока не публиковать

1. **`:14`** «I use AI tools every week, mostly in development.» — нужно подтвердить у Артёма. И назвать инструменты: без названий пост ничего не сообщает.
2. **`:14`** «They've made me faster at the parts of a project that were never the interesting parts. I keep them away from the decisions that make a project good.» — две параллельные фразы-контраста → «They save me time on routine code and checks. Structure, hierarchy and copy I do myself.»
3. **`:25`** «Structure, hierarchy and the first version of the copy.» — **осторожно**. Пост обещает, что первую версию текстов ИИ не пишет. Если черновики блога или сайта набрасывались с ИИ, это утверждение неправда, и читатель, нашедший в блоге ИИ-штампы, это заметит. Артёму нужно решить, что здесь правда, и написать именно это.
4. **`:25`** «Generated layouts look plausible and say nothing in particular.» — панчлайн; лучше пример, что именно он отверг.
5. **`:28`** «the details people notice without knowing why» — штамп → назвать детали: «testing on real phones, reduced-motion settings, alt text».
6. **Lead** «Useful for the tedious middle of a project. Not for the decisions at either end.» — два фрагмента-панчлайна → «What I hand to AI tools in a website project, and what I keep for myself.»

### 4.8 `src/blog/fewer-screens-clearer-product.html` — не публиковать

Весь пост — рассказ о конкретном SaaS-редизайне, и в нём утверждения, которых нет на сайте:
- **`:14`** «We ended the redesign with fewer screens than we started with, and support questions dropped.» — результат; нужно подтвердить у Артёма (и числа, если есть).
- **`:17`** «Analytics told a simple story: most people opened the same three views, every day, in the same order.» — данные проекта; нужно подтвердить у Артёма. Кроме того, это двоеточие-разоблачение.
- **`:20`** «Two of the three daily views showed the same data… removed a step from the most common task. No new visual style would have done as much.» — нужно подтвердить; последняя фраза — панчлайн.
- **`:14`** «The brief asked for a new dashboard. What the product needed was fewer places to look.» — шаблон «просили X, нужно было Y».
- **Title** «Fewer Screens, Clearer Product — Notes From a SaaS Redesign» — параллельный лозунг.

Если это Loglark или Staffjet (оба есть на главной) и про проект можно рассказывать, пост стоит переписать как разбор проекта с названием клиента и ссылкой с главной, по правилам `case-copy-guide.md`. Если про проект рассказывать нельзя или подробностей нет, пост удалить. Заодно: SaaS-дашборды сдвигают позиционирование в сторону product design, а это вспомогательная, не главная линия.

---

## 5. Вопросы к Артёму

**`one-page-or-a-full-site`**
1. Решаете ли вы это на первом созвоне, или переписка идёт async через форму?
2. Luma: все секции правда ведут к одной кнопке?

**`design-and-build-in-one-pair-of-hands`**
3. Какая доля ваших проектов заканчивается сайтом, который вы собрали сами? Какие ещё проекты, кроме Powermatic и этого сайта, можно назвать?
4. Был ли настоящий случай, когда вы во время сборки поймали проблему, которую при передаче разработчику упустили бы (например, длинные слова в русской версии этого сайта)?
5. Можно ли упомянуть Playgram.ai и Zeroqode как пример работы бок о бок с разработчиками? (На Info это уже есть.)

**`structure-before-style`**
6. В каком виде вы сдаёте карту сайта и outline (документ, FigJam, Figma)? Утверждает ли их клиент отдельно?
7. Есть ли пример, когда outline убрал или переставил страницы до дизайна?

**`the-homepage-brief-i-send-startups`**
8. Отправляете ли вы клиентам эти пять вопросов? Правда ли на них уходит около часа?
9. Есть ли пример «заголовок клиента → заголовок, который получился» (можно без имени)?

**`how-i-price-fixed-scope-projects`**
10. Все проекты по фиксированной цене или «most»? Если есть исключения, какие?
11. Пишете ли вы число раундов правок в scope? Входит ли handover call?
12. Условия оплаты (предоплата, этапы) — можно ли о них писать?
13. Сроки на `/services/` — окончательные или ещё placeholders?

**`what-a-ux-audit-actually-finds`**
14. Продаёте ли вы UX-аудит отдельно? Если да, по какой цене и в каком формате?
15. 2–3 настоящие находки из аудитов (без имён), и какими инструментами вы смотрите записи сессий.

**`where-ai-helps-in-my-workflow`**
16. Какие ИИ-инструменты и для чего именно вы используете?
17. Правда ли, что первые версии текстов вы пишете без ИИ? Если нет, как честно сформулировать это место?

**`fewer-screens-clearer-product`**
18. Это какой проект? Можно ли его назвать? Были ли аналитика и снижение обращений в поддержку, и есть ли цифры?

**Общее**
19. Блог только на английском или будет и `/ru/blog/`?

---

## 6. Повторяющиеся проблемы

1. **Конструкция «X, а не Y / rather than / not X»** встречается в каждом посте: «not a Figma file», «rather than the hours», «scope rather than style», «not a hundred-page report», «not a target», «not three weeks after launch», «isn't a visual. It's…».
2. **Выдуманная конкретика вместо настоящей**: «German headline», «Tuesday», «about an hour», «support questions dropped», «top five in a sprint». При этом настоящие факты сайта (Powermatic в Framer, 7 страниц Lattice, Playgram с Zeroqode, русская версия этого сайта, PRICING) почти не используются.
3. **Утверждения о результате без источника**: «converts better», «saves weeks», «faster, cheaper», «support questions dropped».
4. **Панчлайн в конце раздела**: «No new visual style would have done as much.», «A product people use for hours a day should feel quiet.», «Generated layouts look plausible and say nothing in particular.», «A clear list is less exciting than a moodboard, and far more useful.»
5. **Сквозные штампы**: «moodboard» как антипример в двух постах; «first call» в трёх, хотя сайт описывает async-старт через форму.
6. **Тонкие тексты**: шесть постов по 190–380 слов без единого случая из работы. Образец того, как надо, — `one-page-or-a-full-site`: ответ в первом абзаце, свои проекты как примеры, источники для цифр, цена и следующий шаг в конце.
7. **Даты и ссылки**: прошлые даты у неопубликованных постов, ссылки на черновики. Перед каждым релизом проверять, что всё, на что ссылается пост, уже на сайте, или оборачивать ссылку в `<when>`.

Вне блога, но по ходу: `src/pages/work/renovate.html` (`kind: Client Website`, «Client: Renovate») и `aria-label` карточки Renovate на главной (`src/index.html:119`, «client website») называют Renovate клиентским сайтом, а по брифу это собственный проект. В блоге Renovate клиентом не называть; сам кейс стоит проверить отдельно.

---

## 7. Финальная вычитка (после переписывания)

Внесено 11 окт: one-page — повтор про Luma, лишнее предложение про страницы под услуги, вся фраза про бриф условная (`<when live|draft>`), «went with» → «was linked to»; structure — «more than any other» → «the cheapest point…», «on one page» → «in one document», удалён повторный абзац про документ и готовый дизайн; pricing — порядок слов в «I quote … per project», «have already been settled»; design-and-build — «working closely with», «so a later change is made in one place».

Ждёт Артёма: сроки на `/services/` (в `services.html:18` помечены как placeholders; от них зависят one-page и pricing); отзыв Kwork «Before I even paid…» рядом с «upfront payment»; «in close work with» в `src/pages/info.html:29` (живая страница); по желанию «nothing gets lost» → «much less gets lost».
