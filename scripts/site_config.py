"""Site-wide facts and navigation, read by build-html.py (named site_config, not site: "site" is a Python standard module).

Everything that appears on more than one page lives here once: the person
(for structured data), the profiles, the navigation. Each page's own title,
description and status sit in its front matter (src/pages/**, src/blog/*).
"""

URL = "https://helloprokhorov.com"
NAME = "Prokhorov®"
EMAIL = "contact@helloprokhorov.com"
OG_IMAGE = "/assets/img/og.jpg"          # 1200×630, used when a page sets none
OG_IMAGE_ALT = "Powermatic® website on a tablet lying on a rust-red velvet armchair"

# The project form on /get-in-touch/ posts to Web3Forms (https://web3forms.com), which
# emails the answers to the address the access key was created for. The key is
# public by design (it only lets the form send to that inbox), so it sits in the page.
# FORM_ACCESS_KEY requires confirmation: left empty, the form sends nothing: it shows
# the answers ready to copy into an email, and every build warns. The Privacy Policy
# (src/pages/privacy.html 4.3, 6, 7, then scripts/build-pdf.py) already describes Web3Forms.
# Once the key is set: rebuild and send a real test.
FORM_ENDPOINT = "https://api.web3forms.com/submit"
FORM_ACCESS_KEY = "98180929-16fd-4c8f-bcbd-5881c294cd3b"

# Analytics, loaded only after the visitor accepts (js/consent.js, on the live domain only).
#   ga4      Google Analytics 4 measurement ID ("G-XXXXXXXXXX"); empty = off
#   metrica  Yandex Metrica counter number; empty = off. Runs without Session Replay.
# Search Console and Ahrefs Webmaster Tools are verified by DNS and add nothing to the pages.
# Both empty: no bar, no "Cookie Settings". Any change here means the Privacy Policy
# (src/pages/privacy.html 3, 4.5, 6, 7, 8, then scripts/build-pdf.py) is updated with it.
ANALYTICS = dict(ga4="G-544DF591BD", metrica="111169023")

PERSON = {
    "name": "Artem Prokhorov",
    "alternateName": ["Prokhorov®", "Артём Прохоров", "Artyom Prokhorov"],
    "jobTitle": "Independent Web Designer & Developer",
    "image": "/assets/img/portrait-1000.webp",
    "locality": "Bishkek",
    "country": "KG",
    "knowsAbout": ["Web design", "Website development", "Front-end development", "Web animation", "Interaction design", "UI/UX design", "Art direction", "Design systems", "UX audits", "Framer"],
    "knowsLanguage": ["en", "ru"],
}

# The services, as the home page and /info/ list them, with the line /llms.txt gives each.
SERVICES = [
    ("Web Design", "Structure, UX and visual design for websites that are clear, visually strong and easy to understand."),
    ("Website Development", "The approved design built as a responsive, fast website that matches the layouts and is ready to launch."),
    ("Website Motion", "Motion for websites and interfaces: transitions, scroll motion and hover states that show what’s clickable and keep your place between pages."),
    ("UI/UX Design", "User flows, wireframes and interfaces for digital products, with a design system where the product needs one."),
    ("Design Direction", "Visual direction for websites and products: typography, colour, layout and interaction principles that keep them consistent."),
]

# Pricing: used by /llms.txt and /services/ (src/pages/services.html), written to be lifted as it is into
# Contra, proposals, PDFs and email (nothing in it refers to the site). A price is the lowest a
# project starts at, in USD; None means it is quoted per project. The prices are the live Contra
# services: Design & Development ("Custom Website Design & Framer Development", $990) and
# Web Design (website and landing page design, $490). The services are SERVICES, in its order.
PRICING = dict(
    title="Pricing",
    intro="Starting prices, so you know roughly where a project sits before we talk.",
    lead=("Design & Development", "A complete website, from structure and visual direction through development and launch — one person throughout.", 990),
    services=[
        ("Web Design", "Structure, UX and visual design for a website or landing page, ready to build.", 490),
        ("Website Development", "Your approved design built as a responsive, tested website, ready to launch.", None),
        ("Website Motion", "Transitions, scroll motion and hover states for a website or interface.", None),
        ("UI/UX Design", "User flows, wireframes and interface design for a digital product.", None),
        ("Design Direction", "A visual direction: typography, colour, layout and interaction principles.", None),
    ],
    quoted="Quoted per project",
    factors="The price depends on scope and number of pages, how complex the site is, how much UX work it needs and the visual direction. Motion, development requirements, the materials you already have and the timeline matter too.",
    note="“From” is where pricing starts, not a quote — once we agree the scope, you get a fixed price.",
    next="Tell me what you need, and I’ll come back with a quote.",
)

# The same, on the Russian pages (/ru/services/): the texts only, the amounts stay those of PRICING
# (USD). Draft translation, for Artem to edit.
PRICING_RU = dict(
    title="Цены",
    intro="Стартовые цены, чтобы ещё до разговора понимать, о каких суммах речь.",
    lead=("Дизайн и разработка", "Сайт целиком: структура, арт-дирекшн, дизайн, разработка и запуск.", 990),
    services=[
        ("Веб-дизайн", "Структура, UX и дизайн сайта или лендинга — сразу готовые к разработке.", 490),
        ("Разработка сайтов", "Собираю ваш утверждённый дизайн в адаптивный сайт, проверяю и запускаю.", None),
        ("Моушн для сайтов", "Переходы, анимация на скролле и ховеры для сайта или интерфейса.", None),
        ("UI/UX-дизайн", "Сценарии, прототипы и интерфейс цифрового продукта.", None),
        ("Арт-дирекшн", "Типографика, цвет, сетка и правила, по которым всё двигается.", None),
    ],
    quoted="Считаю под проект",
    factors="Цена зависит от числа страниц и сложности сайта, от того, сколько нужно UX-работы и насколько сложный визуал. А ещё от анимации, требований к разработке, готовых материалов и сроков.",
    note="«От» — это нижняя планка, а не смета. Когда договоримся об объёме, цена станет фиксированной.",
    next="Расскажите, что нужно, и я вернусь с оценкой.",
    **{"from": "от ${amount}", "thousands": " "},
)

# Blog topics, in filter order. A post names one with `topic: <slug>`; the topic gives the label
# on its card and beside the post, the filter on /blog/ and the colours of its cover
# (scripts/build-blog-covers.py). Soft colours on purpose: the card under the title (card), the
# card tilted behind it (back), the title on it (ink); `card` is also the tag's fill on the site,
# `back` its dot. Keep the list short: a topic earns its place with two or more posts.
TOPICS = [
    dict(slug="web-design", label="Web Design", card="#bccdf0", back="#5f78a8", ink="#141f38"),
    dict(slug="development", label="Development", card="#c3dcc3", back="#5d8462", ink="#152a19"),
    dict(slug="ux-product", label="UX & Product", card="#d6ccef", back="#7a6ca8", ink="#221b3a"),
    dict(slug="process", label="Process", card="#f1d5b9", back="#a87d55", ink="#33210f"),
    dict(slug="ai", label="AI Tools", card="#ece2ac", back="#978945", ink="#2d2810"),
]

# The project Index (/work/, under the cases): one row per project, newest first. DRAFT (10 Oct):
# for Artem to confirm. Sources: the case pages, the CV, the home page's Clients line and the Kwork
# reviews (kwork.ru/user/hello_prokhorov, years counted back from "N years ago" on 10 Oct 2026, so
# ±1). Small fixes (Canva templates, card adaptives, finishing touches) are left out; one client's
# orders are one row. Clients without a public name are named by what the project was.
#   year    the year it was done ("2023–24" for a span)
#   name    {lang: name}; a brand stays as it is
#   sector  {lang: what the client does}
#   work    {lang: what Artem did}
#   type    for the filter: site | product | concept
#   case    the case page, where there is one
#   via     where the work came from: client | contra | kwork | staff | concept | own
# The 2026 rows follow the Contra feed (contra.com/helloprokhorov/work, read 10 Oct 2026): each
# project once; posts that are not a project (open for work, announcements, fragments of a
# case already listed) are left out.
PROJECTS = [
    # Contra, 15 Sep 2026 (a work post, no description: sector and source to confirm)
    dict(year="2026", name=dict(en="Supaminds"), sector=dict(en="", ru=""),
         work=dict(en="Website design", ru="Дизайн сайта"), type="site", via="contra"),
    # Contra, 10 Aug 2026: a website for a full-cycle interior design studio, case in progress
    dict(year="2026", name=dict(en="Nix Studio"), sector=dict(en="Interior design", ru="Дизайн интерьеров"),
         work=dict(en="Website", ru="Сайт"), type="site", via="client"),
    dict(year="2026", name=dict(en="Renovate"), sector=dict(en="Business consulting", ru="Консалтинг"),
         work=dict(en="Web design", ru="Веб-дизайн"), type="site", case="/work/renovate/", via="client"),
    dict(year="2026", name=dict(en="Powermatic Technologies®"), sector=dict(en="Technology partner", ru="Технологический партнёр"),
         work=dict(en="Design & Development", ru="Дизайн и разработка"), type="site", case="/work/powermatic/", via="client"),
    # Contra case (verified), Jul 2026: the corporate gifting page for graffeo.com
    dict(year="2026", name=dict(en="Graffeo"), sector=dict(en="Coffee, e-commerce", ru="Кофе, e-commerce"),
         work=dict(en="Gifting landing page", ru="Лендинг для подарков"), type="site", via="client"),
    # Contra, 25 Jul 2026, from the accounting firms study (concept? to confirm)
    dict(year="2026", name=dict(en="Harrison & Cole"), sector=dict(en="Accounting firm", ru="Бухгалтерская фирма"),
         work=dict(en="Website", ru="Сайт"), type="concept", via="concept"),
    # Contra, 11 Jul 2026: "Web Design, Animation, Concept"
    dict(year="2026", name=dict(en="Hidden Studio"), sector=dict(en="Design studio", ru="Дизайн-студия"),
         work=dict(en="Web design & animation", ru="Веб-дизайн и анимация"), type="concept", via="concept"),
    # Contra, 9 Jul 2026 (no description: sector and source to confirm)
    dict(year="2026", name=dict(en="FlowPilot"), sector=dict(en="", ru=""),
         work=dict(en="Web design", ru="Веб-дизайн"), type="site", via="contra"),
    dict(year="2026", name=dict(en="Luma"), sector=dict(en="Sales product", ru="Продукт для продаж"),
         work=dict(en="Landing page", ru="Лендинг"), type="concept", case="/work/luma/", via="concept"),
    # Contra, 26 Jun 2026: the previous version of this site (with its Selected Works page)
    dict(year="2026", name=dict(en="Prokhorov®"), sector=dict(en="Personal portfolio", ru="Личное портфолио"),
         work=dict(en="Website", ru="Сайт"), type="site", via="own"),
    dict(year="2026", name=dict(en="Visual Hunters®"), sector=dict(en="Design studio", ru="Дизайн-студия"),
         work=dict(en="Typography & 3D", ru="Типографика и 3D"), type="concept", case="/work/visual-hunters/", via="concept"),
    dict(year="2026", name=dict(en="Contour Office©"), sector=dict(en="Accounting firms", ru="Бухгалтерские фирмы"),
         work=dict(en="Web design", ru="Веб-дизайн"), type="concept", case="/work/contour-office/", via="concept"),
    dict(year="2026", name=dict(en="Lattice"), sector=dict(en="Infrastructure software", ru="Инфраструктурный софт"),
         work=dict(en="Multi-page website", ru="Многостраничный сайт"), type="concept", case="/work/lattice/", via="concept"),
    dict(year="2026", name=dict(en="Playgram.ai"), sector=dict(en="AI workspace, Zeroqode", ru="ИИ-платформа, Zeroqode"),
         work=dict(en="Product UI, landing pages", ru="Интерфейс и лендинги"), type="product", via="staff"),
    # Contra, 22 May 2026: "Case Fragment" (sector to confirm)
    dict(year="2026", name=dict(en="Monolith"), sector=dict(en="", ru=""),
         work=dict(en="Website", ru="Сайт"), type="concept", via="concept"),
    # Contra, 22 May 2026: "UI Design Concept"
    dict(year="2026", name=dict(en="Specter Studio®"), sector=dict(en="Design practice", ru="Дизайн-практика"),
         work=dict(en="UI design", ru="UI-дизайн"), type="concept", via="concept"),
    # Contra, 22 and 28 May 2026: "UI Design Concept" and its Archive page
    dict(year="2026", name=dict(en=".dotslash/"), sector=dict(en="Design studio", ru="Дизайн-студия"),
         work=dict(en="UI design, archive", ru="UI-дизайн, архив"), type="concept", via="concept"),
    dict(year="2025", name=dict(en="Staffjet"), sector=dict(en="Automation platform", ru="Платформа автоматизации"),
         work=dict(en="Design system", ru="Дизайн-система"), type="product", via="contra"),
    dict(year="2025", name=dict(en="Loglark®"), sector=dict(en="Log monitoring", ru="Мониторинг логов"),
         work=dict(en="Product UI", ru="Интерфейс сервиса"), type="product", via="client"),
    dict(year="2025", name=dict(en="Company website", ru="Сайт компании"), sector=dict(en="Services", ru="Услуги"),
         work=dict(en="Visual design", ru="Визуальные элементы"), type="site", via="kwork"),
    dict(year="2024", name=dict(en="Web service", ru="Веб-сервис"), sector=dict(en="Marketing", ru="Маркетинг"),
         work=dict(en="Brand identity, UI", ru="Стиль и интерфейс"), type="product", via="kwork"),
    dict(year="2024", name=dict(en="Online store", ru="Интернет-магазин"), sector=dict(en="E-commerce", ru="E-commerce"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
    dict(year="2024", name=dict(en="Clinic website", ru="Сайт клиники"), sector=dict(en="Healthcare", ru="Медицина"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
    dict(year="2024", name=dict(en="Platform audit", ru="Аудит платформы"), sector=dict(en="Web platform", ru="Веб-платформа"),
         work=dict(en="UX/UI audit", ru="UX/UI-аудит"), type="product", via="kwork"),
    dict(year="2024", name=dict(en="Platform prototypes", ru="Прототипы платформы"), sector=dict(en="Web platform", ru="Веб-платформа"),
         work=dict(en="Prototypes", ru="Прототипы"), type="product", via="kwork"),
    dict(year="2023–24", name=dict(en="Mobile app", ru="Мобильное приложение"), sector=dict(en="Mobile", ru="Мобильное"),
         work=dict(en="App screens", ru="Экраны приложения"), type="product", via="kwork"),
    dict(year="2023", name=dict(en="Website prototype", ru="Прототип сайта"), sector=dict(en="Website", ru="Сайт"),
         work=dict(en="Prototype & design", ru="Прототип и дизайн"), type="site", via="kwork"),
    dict(year="2023", name=dict(en="Corporate website", ru="Корпоративный сайт"), sector=dict(en="Company", ru="Компания"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
    dict(year="2023", name=dict(en="Website, mobile version", ru="Сайт, мобильная версия"), sector=dict(en="Website", ru="Сайт"),
         work=dict(en="Mobile version", ru="Мобильная версия"), type="site", via="kwork"),
    dict(year="2023", name=dict(en="Website from a concept", ru="Сайт с концепта"), sector=dict(en="Website", ru="Сайт"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
    dict(year="2022", name=dict(en="Admin panel & UI kit", ru="Админка и UI-кит"), sector=dict(en="Web service", ru="Веб-сервис"),
         work=dict(en="UX/UI, UI kit", ru="UX/UI, UI-кит"), type="product", via="kwork"),
    dict(year="2022", name=dict(en="S2 Project"), sector=dict(en="Website", ru="Сайт"),
         work=dict(en="Website design", ru="Дизайн сайта"), type="site", via="kwork"),
    dict(year="2022", name=dict(en="Euro Kovrolin", ru="Евро Ковролин"), sector=dict(en="Flooring retail", ru="Продажа покрытий"),
         work=dict(en="Prototype, redesign", ru="Прототип, редизайн"), type="site", via="kwork"),
    dict(year="2022", name=dict(en="Beauty salon website", ru="Сайт салона красоты"), sector=dict(en="Beauty", ru="Красота"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
    dict(year="2022", name=dict(en="Online store", ru="Интернет-магазин"), sector=dict(en="E-commerce, Minsk", ru="E-commerce, Минск"),
         work=dict(en="UX/UI design", ru="UX/UI-дизайн"), type="site", via="kwork"),
]

# While True, the Index is built in previews only: a release build leaves it out.
PROJECTS_DRAFT = True

# Confirmed profiles: they also feed the Person's sameAs.
PROFILES = [
    ("LinkedIn", "LI", "https://www.linkedin.com/in/helloprokhorov"),
    ("Contra", "CO", "https://contra.com/helloprokhorov"),
    ("X", "X", "https://x.com/helloprokhorov"),
    ("Instagram", "IG", "https://www.instagram.com/hello.prokhorov/"),
    ("Telegram", "TG", "https://t.me/hello_prokhorov"),
]
# Shown first on the pages in that language (the rest keep their order): Telegram is the main
# channel for Russian-speaking clients.
PROFILES_FIRST = dict(ru=["Telegram"])

# Top bar and phone menu, in order.
#   page    the page this item stands for
#   anchor  the matching section on the home page (or None)
# The link goes to the page once that page is live; until then to the home
# section; with neither, the item stays out of the menu. The item is marked
# current only by the address: its page, or a page under it (/work/<slug>/).
#   ru      the label on the Russian pages (/ru/…); the page is its /ru/ version once that is live
NAV = [
    dict(label="Work", page="/work/", anchor="work", ru="Работы"),
    dict(label="Info", page="/info/", anchor="about", ru="Обо мне"),
    dict(label="Services", page="/services/", anchor=None, ru="Услуги"),
    dict(label="Contact", page="/contact/", anchor="contact", ru="Контакты"),
    dict(label="Blog", page="/blog/", anchor=None, ru="Блог"),
]
