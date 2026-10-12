# Пины Pinterest для блога

Дата: 12 октября 2026. Автор: Copywriter. Новые тексты для Pinterest, файлы сайта не менялись.

Что прочитано: четыре опубликованные статьи (`status: live`) целиком, `agents/06-copywriter.md`, `agents/reports/blog-review-2026-10-11.md`, сроки на `src/pages/services.html`, генерация `og:*` и `article:published_time` в `scripts/build-html.py:462–505`, обложка `assets/img/og/blog-one-page-or-a-full-site.jpg`.

Черновики (`the-homepage-brief…`, `what-a-ux-audit…`, `where-ai-helps…`, `fewer-screens…`) не используются, ссылок на них нет.

## 0. Коротко

- 4 статьи, по 3 пина на каждую, всего 12 пинов. У каждого пина свой угол и свой поисковый запрос, тексты не повторяют друг друга.
- Каждый факт в пинах взят из статьи. Под каждым пином указана строка-источник (`файл:строка`).
- Чего в пинах сознательно нет:
  - «most projects end with a live website» и «nothing gets lost between the design and the build» (вторая фраза ждёт решения Артёма, см. ревью блога, раздел 7);
  - концепты Lattice и Luma по именам: в пине без контекста их легко принять за клиентов;
  - любые обещания результата (конверсия, «быстрее», «дешевле»).
- Хэштегов нет: на ранжирование они почти не влияют.
- Длина описаний 210–393 знака (в пределах лимита 500). Длиннее 300 у пинов 2.2, 2.3, 3.2, 4.2 и 4.3: это пины-списки и пины с условиями, их ужимать не стоит.
- Числа знаков посчитаны вручную, с пробелами. Заголовки и описания перепроверены скриптом.

Общая заметка про картинки. Нынешние обложки сделаны в формате 3:2: светлая пудровая карточка с тёмно-коричневым заголовком, пунктирной линией и знаком в нижнем левом углу. Под ней лежит вторая карточка цвета статьи, всё это поверх ботанической гравюры. Для пинов нужен формат 2:3, 1000×1500. Требования:

- Гравюра на весь фон. Нужен исходник без карточки (см. вопросы в конце), потому что в `assets/img/blog-*-2400.webp` карточка уже «впечатана».
- Карточка шириной около 80%, текст overlay крупный: от 64 px при ширине 1000.
- Внизу на карточке мелко `helloprokhorov.com` вместо пустого места под пунктиром.
- Нижние ~10% и правый нижний угол оставить без текста: там Pinterest рисует свои кнопки.
- Чтобы три пина одной статьи выглядели как три свежие картинки, у каждого свой кадр гравюры (верх, середина, низ листа) и своё место карточки (верх, центр, низ). Цвет нижней карточки сохраняется по статье: терракота у one-page и structure, охра у pricing, олива у design-and-build.

---

## 1. One Page or a Full Site (featured)

`src/blog/one-page-or-a-full-site.html` → https://helloprokhorov.com/blog/one-page-or-a-full-site/
Гравюра: лавр (bay laurel), карточка терракотовая.

Основной запрос: **landing page vs website**
Смежные: landing page or website, one page website, which pages a website needs (what pages does a business website need), multi-page website.

### Пин 1.1 — вопрос-поиск (самый сильный, публикуется первым)

- **Title** (61): `Landing page vs website? Three questions I ask before I quote`
- **Description** (293): `Landing page or full website? A landing page is enough when you sell one thing, most visitors arrive from one place and they don't need much proof before they get in touch. If any of those isn't true, you probably need a few pages. I go through each question and what the answer usually means.`
- **Overlay text**: `Landing page or full website?`
- **Alt text** (≈183): `Vertical pin with a terracotta card reading “Landing page or full website?” over a vintage botanical engraving of bay laurel. Article on choosing between a landing page and a website.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/one-page-or-a-full-site/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=one-page-or-a-full-site-pin1`
- **Image note**: ближе всего к нынешней обложке. Кадр по центру ветки лавра, карточка в верхней половине. Заголовок в две строки: «Landing page or / full website?».
- Источник: `:5` (lead «Three questions I ask before I quote»), `:15`.
- Три условия в описании идут подряд, это похоже на триаду. Но это дословная мысль статьи, и в ней настоящие условия выбора, а не украшение, поэтому оставлено.

### Пин 1.2 — практический совет: начать с одной страницы

- **Title** (55): `One-page website first? When starting small makes sense`
- **Description** (271): `A one-page website is where I'd often start if you're still testing the offer. It's quicker to launch, and it shows which questions visitors actually ask. Those questions become the next pages. When the site grows, the landing page can stay as the page your ads point to.`
- **Overlay text**: `Start with one page`
- **Alt text** (≈167): `Vertical pin: terracotta card with the words “Start with one page” on a botanical engraving of bay laurel, for an article on one-page websites versus multi-page sites.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/one-page-or-a-full-site/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=one-page-or-a-full-site-pin2`
- **Image note**: кадр с верхушкой ветки и белыми цветками (правый верх обложки). Карточка внизу, текст коротким столбиком: «Start with / one page».
- Источник: `:30`. Из «quicker to launch, easier to change, and it shows…» убрано «easier to change», чтобы не было триады.

### Пин 1.3 — когда одной страницы мало

- **Title** (58): `When one landing page isn't enough, and which pages to add`
- **Description** (297): `A landing page stops being enough when you sell several services or your clients sign up for months of work. They want to see past projects and understand how you work. That's what work, about and services pages are for. A site with a page for each service also gives search more ways to find you.`
- **Overlay text**: `When one page isn't enough`
- **Alt text** (≈170): `Vertical pin with a terracotta card saying “When one page isn't enough” over an engraving of bay laurel leaves. Article on which pages a business website needs.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/one-page-or-a-full-site/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=one-page-or-a-full-site-pin3`
- **Image note**: кадр с крупными листьями слева (низ обложки), карточка по центру. Если хочется показать «много страниц», за карточкой можно положить две-три терракотовые карточки веером вместо одной. Придумывать новые элементы не нужно.
- Источник: `:19`, `:23`, `:26`.

---

## 2. Structure Before Style

`src/blog/structure-before-style.html` → https://helloprokhorov.com/blog/structure-before-style/
Гравюра: папоротник, карточка терракотовая.

Основной запрос: **website sitemap**
Смежные: how to plan a website, homepage outline / homepage sections, website structure before design.

### Пин 2.1 — вопрос-поиск

- **Title** (40): `Why I start every website with a sitemap`
- **Description** (221): `When I plan a website, I start with a sitemap and a plain-text outline of each page. You read it, we change what needs changing, and only then do I start on the look. It's the cheapest point in a project to change things.`
- **Overlay text**: `The sitemap comes first`
- **Alt text** (≈165): `Vertical pin: terracotta card reading “The sitemap comes first” over a vintage botanical engraving of a fern. Article on planning a website with a sitemap.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/structure-before-style/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=structure-before-style-pin1`
- **Image note**: вертикальный лист папоротника хорошо ложится в 2:3, это самая «пинтерестная» гравюра из четырёх. Лист во всю высоту, карточка в верхней трети.
- Источник: `:14`.
- Сознательно не взято: пара «In a document… In a finished design…» (`:29`). В пине она читалась бы как параллельный контраст.

### Пин 2.2 — практический список

- **Title** (60): `Homepage outline in five sections, written before any design`
- **Description** (393): `A homepage outline, written in plain text before any design, might read like this. First screen: what the company does and who it's for, in one sentence. Proof: two or three projects, each with the task and the result. Services: what you can order and where each one starts. Questions: the doubts a visitor has before getting in touch. Next step: a short form and what happens after it's sent.`
- **Overlay text**: `Homepage outline in 5 sections`
- **Alt text** (≈190): `Vertical pin with a terracotta card listing five homepage sections: first screen, proof, services, questions, next step. Fern engraving behind. Article on outlining a website before design.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/structure-before-style/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=structure-before-style-pin2`
- **Image note**: единственный пин, где на карточке больше текста. Сверху заголовок «Homepage outline», под ним нумерованный список из пяти слов: First screen, Proof, Services, Questions, Next step. Карточка высокая, почти во весь пин, по краям видна гравюра. Такие пины-списки на Pinterest сохраняют чаще всего.
- Источник: `:18–25` (дословно).
- Описание длиннее 300 знаков: это список, и резать его жалко. Если нужно короче, убрать первое предложение (−83).

### Пин 2.3 — что отпадает до дизайна

- **Title** (48): `What gets cut when a website starts as a sitemap`
- **Description** (344): `Pages and features often drop out at the sitemap stage. A page that seemed necessary turns out to repeat another one, or a feature serves a rare case and can wait for a later version. Clients usually make these calls themselves once they see the whole site in one document. The approved list of pages goes straight into the fixed scope I quote.`
- **Overlay text**: `What gets cut before design`
- **Alt text** (≈160): `Vertical pin: terracotta card with the words “What gets cut before design” on a fern engraving. Article on planning website pages with a sitemap.`
- **Board**: Landing Pages & Website Planning
- **Link**: `https://helloprokhorov.com/blog/structure-before-style/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=structure-before-style-pin3`
- **Image note**: кадр с кончиком листа папоротника, карточка внизу. Чтобы пин отличался от 2.1, можно чуть сдвинуть гравюру или отразить её по горизонтали.
- Источник: `:32`, `:35`.

---

## 3. How I Price Fixed-Scope Projects

`src/blog/how-i-price-fixed-scope-projects.html` → https://helloprokhorov.com/blog/how-i-price-fixed-scope-projects/
Гравюра: айва (quince), карточка охристая.

Основной запрос: **how much does a website cost**
Смежные: website design pricing, fixed price website, website scope of work, how long does it take to design a website.

### Пин 3.1 — цена (самый сильный в статье)

- **Title** (59): `How much does a website cost? Where my prices start and why`
- **Description** (295): `Website design with me starts at $490 for a website or a landing page, and a complete site, designed and built, starts at $990. The price depends mostly on the number of pages and how much each one has to do. “From” is where a price starts; you get the actual figure once we've agreed the scope.`
- **Overlay text**: `What a website costs with me`
- **Alt text** (≈170): `Vertical pin with an ochre card reading “What a website costs with me” over a vintage botanical engraving of quince. Article on website design pricing and fixed scope.`
- **Board**: Website Cost, Scope & Timelines
- **Link**: `https://helloprokhorov.com/blog/how-i-price-fixed-scope-projects/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=how-i-price-fixed-scope-projects-pin1`
- **Image note**: кадр с плодом айвы, карточка в верхней половине. Под пунктиром можно дать вторую строку мельче: `Design from $490 · Site from $990`. Цифры дословно из статьи, на телефоне это самый сильный крючок.
- Источник: `:17`, `:18`.
- «and why» в заголовке закрывает второй абзац статьи (от чего зависит цена).

### Пин 3.2 — что пишется в scope

- **Title** (56): `What my website scope of work lists before a fixed price`
- **Description** (357): `A fixed-price website project starts with a written scope. Mine lists the pages by name, three rounds of revisions, who writes the copy and who supplies the images, what I hand over at the end and the timeline. The handover is either design files ready to build or a live site. Three rounds is usually enough when the structure was agreed before the design.`
- **Overlay text**: `What my project scope lists`
- **Alt text** (≈165): `Vertical pin: ochre card titled “What my project scope lists” over a quince engraving. Article on the written scope behind a fixed website price.`
- **Board**: Website Cost, Scope & Timelines
- **Link**: `https://helloprokhorov.com/blog/how-i-price-fixed-scope-projects/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=how-i-price-fixed-scope-projects-pin2`
- **Image note**: можно сделать пин-список, как 2.2: заголовок и пять коротких пунктов (Pages, 3 rounds of revisions, Copy & images, Handover, Timeline). Карточка по центру, айва видна сверху и снизу. Если 2.2 уже сделан списком, этот лучше оставить с одним заголовком, чтобы лента не выглядела однообразно.
- Источник: `:20–28`.
- «scope of work» — поисковое слово. В статье просто «scope», смысл тот же.

### Пин 3.3 — сроки

- **Title** (63): `How long does it take to design a website? My typical timelines`
- **Description** (280): `A website design takes about two to three weeks, and a complete site, designed and built, four to six. A more complex project takes longer, and the real timeline goes into the quote. If the scope changes halfway, I say so as soon as I see it and give the cost in the same message.`
- **Overlay text**: `How long a website takes`
- **Alt text** (≈160): `Vertical pin with an ochre card saying “How long a website takes” over a botanical engraving of quince. Article on website design timelines and pricing.`
- **Board**: Website Cost, Scope & Timelines
- **Link**: `https://helloprokhorov.com/blog/how-i-price-fixed-scope-projects/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=how-i-price-fixed-scope-projects-pin3`
- **Image note**: кадр с листьями и цветком айвы без плода, карточка внизу. Вторая строка мелко, если нужна: `Design 2–3 weeks · Site 4–6 weeks`.
- Источник: `:31`, `:34`. Сроки совпадают с `src/pages/services.html:69` и `:86`.
- Сознательно не взято: предоплата и наценка за срочность. Описание вышло бы за 400 знаков, а в выдаче это не главное.

---

## 4. Design and Development in One Pair of Hands

`src/blog/design-and-build-in-one-pair-of-hands.html` → https://helloprokhorov.com/blog/design-and-build-in-one-pair-of-hands/
Гравюра: липа (lime leaves and flowers), карточка оливковая.

Основной запрос: **web designer and developer**
Смежные: designer who builds the website, hire a web designer or a developer, Framer website.

### Пин 4.1 — вопрос-поиск

- **Title** (48): `Should one person design and build your website?`
- **Description** (210): `As a web designer, I now build the websites I design as well. Powermatic, built in Framer, is one of them. For a company site or a launch page, that means you talk to one person from the first sketch to launch.`
- **Overlay text**: `One person from sketch to launch`
- **Alt text** (≈175): `Vertical pin: olive card reading “One person from sketch to launch” over a vintage engraving of lime leaves and flowers. Article by a web designer who also builds websites.`
- **Board**: Web Design & Development
- **Link**: `https://helloprokhorov.com/blog/design-and-build-in-one-pair-of-hands/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=design-and-build-in-one-pair-of-hands-pin1`
- **Image note**: кадр с соцветием липы, карточка в верхней трети.
- Источник: `:14`, `:30`.
- Вместо «Most of my projects end with a live website» стоит то, что сказано в статье: «Now I build the websites I design as well». Выход из «Design & Development» и цена $990 (`:30`) в пин не вошли, чтобы он не повторял пин 3.1.

### Пин 4.2 — детали, которые видны только в браузере

- **Title** (46): `Why I decide web design details in the browser`
- **Description** (331): `Much of a website's quality is in details that only show up in the browser, such as how a heading wraps on a phone or how motion feels at real speed. A design file can describe them, but someone still decides them during the build. When I build the site myself, I decide them while I still remember why the design is the way it is.`
- **Overlay text**: `Details only the browser shows`
- **Alt text** (≈170): `Vertical pin with an olive card saying “Details only the browser shows” over an engraving of lime leaves. Article on designing and building a website as one person.`
- **Board**: Web Design & Development
- **Link**: `https://helloprokhorov.com/blog/design-and-build-in-one-pair-of-hands/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=design-and-build-in-one-pair-of-hands-pin2`
- **Image note**: кадр с крупными листьями, карточка по центру. Можно чуть повернуть её (2–3°), как бумажку на столе. Ничего нового не добавлять.
- Источник: `:20`. Из четырёх деталей статьи взяты две, чтобы не делать перечень.

### Пин 4.3 — когда нужна отдельная команда разработки

- **Title** (58): `Web designer and developer in one, or a separate dev team?`
- **Description** (320): `A separate development team is the better choice for a product with a large application, a backend and a release schedule. There I design the interface and the design system, as I did for Playgram.ai at Zeroqode, working closely with the team's developers. A website is a smaller thing, so I now build the ones I design.`
- **Overlay text**: `When to hire a separate developer`
- **Alt text** (≈165): `Vertical pin: olive card titled “When to hire a separate developer” over a botanical engraving of lime. Article on when design and development should be split.`
- **Board**: Web Design & Development
- **Link**: `https://helloprokhorov.com/blog/design-and-build-in-one-pair-of-hands/?utm_source=pinterest&utm_medium=social&utm_campaign=blog&utm_content=design-and-build-in-one-pair-of-hands-pin3`
- **Image note**: кадр с нижними листьями, карточка внизу.
- Источник: `:17`, `:20`, `:29`.
- Честный пин о том, где схема «один человек» не подходит. Такие тексты хорошо совпадают с трендом 2026 года на искренность.

---

## 5. Доски

Три доски. Больше не нужно: на 12 пинов четвёртая была бы почти пустой.

**1. Landing Pages & Website Planning** (32 знака)
`How I plan a website before I design it, from choosing between a landing page and a full site to sitemaps, page outlines and homepage sections. Notes from my own projects as an independent web designer and developer.` (≈216)
Пины: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3.

**2. Website Cost, Scope & Timelines** (31)
`How much a website costs with me and how a fixed price works: where prices start, what the written scope lists, how long design and build take, and what happens when the scope changes. Prices are in USD.` (≈213)
Пины: 3.1, 3.2, 3.3.

**3. Web Design & Development** (24)
`Notes on designing and building websites as one person, what gets decided in the browser, and when a product needs a separate development team. I'm an independent web designer and I build the sites I design.` (≈207)
Пины: 4.1, 4.2, 4.3.

Сначала каждый пин сохраняется только на свою доску. Позже, когда появятся новые статьи, пин 1.3 можно добавить на доску 2: он тоже про то, из чего складывается объём сайта.

## 6. Bio профиля

Основной вариант (137):
`Independent web designer and developer. I design and build websites, from structure to launch, and write about how I plan and price them.`

Запасной вариант с городом (≈150), если Артём хочет указать место:
`Independent web designer and developer in Bishkek, working worldwide. I design and build websites, from structure to launch.`

«From structure to launch» — формулировка с главной (`src/index.html:3`). Город взят из `og_description` главной.

## 7. График публикации

12 пинов за три недели, по четыре в неделю. Каждый URL появляется раз в 7 дней. Первым у каждой статьи идёт самый сильный угол (поисковый вопрос или цена), неделю открывает featured-статья.

| Неделя | Пн | Ср | Чт | Сб |
|---|---|---|---|---|
| 1 | 1.1 landing vs website | 3.1 цена | 2.1 sitemap | 4.1 один человек |
| 2 | 1.3 когда мало одной страницы | 2.2 outline-список | 3.2 scope | 4.3 отдельная команда |
| 3 | 1.2 начать с одной страницы | 2.3 что отпадает | 3.3 сроки | 4.2 детали в браузере |

Сначала нужно сделать пункты 1–3 чек-листа, иначе первые пины уйдут без rich pin и без подтверждённого домена. Время публикации внутри дня не важно. Важно, чтобы не было «залпа» из нескольких пинов подряд. После трёх недель каждая статья может получать новый пин (новая картинка и новый угол) примерно раз в месяц. Репинить старые пины не нужно.

## 8. Чек-лист перед первым пином

1. **Бизнес-аккаунт.** Перевести профиль в Business (бесплатно): без этого нет аналитики и подтверждения домена. Имя профиля: Artem Prokhorov. Аватар тот же, что на сайте.
2. **Подтвердить домен** helloprokhorov.com (Settings → Claimed accounts → Websites). Сейчас на сайте нет `<meta name="p:domain_verify" …>`. Есть два пути: (а) добавить тег в общий `<head>`, его генерирует `scripts/build-html.py` около `:470–514`; (б) положить в корень HTML-файл, который выдаст Pinterest. Это правка сайта, её делает Артём (или dev-агент по задаче), не копирайтер.
3. **Article rich pins.** Всё нужное уже есть: `og:type=article`, `og:title`, `og:description`, `og:site_name`, `og:image` и `article:published_time` (`scripts/build-html.py:462`, `:485–505`). После подтверждения домена Pinterest обычно подтягивает их сам. Проверить на первом пине: под ним должны быть заголовок статьи и название сайта. Учтите, что в rich pin Pinterest может показывать `og:title` статьи вместо заголовка пина. Это не страшно: `title` статей уже написаны под поиск.
4. **Только вертикальная картинка** 1000×1500 (2:3). Горизонтальную обложку 3:2 не загружать: в ленте она мелкая.
5. **Alt text** у каждого пина: поле «Alt text» в редакторе пина (Advanced settings), текст из этого отчёта.
6. **Ссылка с UTM** из отчёта, у каждого пина своя. Проверить, что Гугл Аналитика на сайте считает `utm_*`: если она включается только после согласия на куки, часть переходов не попадёт в отчёт, это нормально.
7. **Без хэштегов** и без эмодзи.
8. **Первым на каждую статью идёт самый сильный пин** (1.1, 2.1, 3.1, 4.1). Первой выходит featured-статья, сразу за ней статья с ценой.
9. **Один пин — одна доска** при публикации. Сохранять тот же пин на несколько досок подряд не нужно.

## 9. Что уточнить у Артёма

1. **Исходники гравюр без карточки** (лавр, папоротник, айва, липа) в хорошем разрешении. Без них вертикальные пины придётся резать из `blog-*-2400.webp`, где карточка уже впечатана. Где лежит макет обложек: в Figma или в скрипте?
2. **Сроки 2–3 и 4–6 недель окончательные?** В ревью блога они были отмечены как placeholders. Сейчас пометки в `services.html` нет, но пин 3.3 целиком на них держится.
3. **Аккаунт Pinterest уже есть?** Если есть личный, перевести его в Business, а не заводить новый.
4. **Bio: с городом или без?**
5. **Можно ли называть Playgram.ai и Zeroqode в пине 4.3?** В статье и на Info они есть, так что, скорее всего, да. Но пин живёт отдельно от сайта, поэтому лучше подтвердить.
6. **Строки с ценами и сроками на картинках 3.1 и 3.3.** Ставить их или оставить только в описании? Если цены поменяются, текст пина можно отредактировать, а картинку — нет.
7. Когда решится судьба фразы «nothing gets lost between the design and the build» (`design-and-build…:30`), можно добавить четвёртый пин к этой статье с ценой Design & Development ($990).

## 10. Что повторяется

- Цены $490/$990 есть в двух статьях. В пинах они стоят только в 3.1, иначе два пина спорили бы за один запрос.
- Lattice с «seven pages» есть в двух статьях. В пины не взято: без слова «concept» и ссылки на кейс это читалось бы как клиентский проект.
- Триады в статьях («quicker, easier, shows…», «past projects, who's behind, how you work», четыре детали в браузере) в пинах урезаны до двух пунктов. В коротком тексте перечень из трёх звучит как реклама.
- Контрасты «X, not Y» в пинах не используются. Единственный «или»-заголовок (4.3) — настоящий поисковый вопрос.
