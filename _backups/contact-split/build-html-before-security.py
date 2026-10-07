"""Build every page of the site from src/.

    python scripts/build-html.py              preview: drafts are built too (noindex, flagged)
    python scripts/build-html.py --release    for deployment: drafts are left out entirely

Sources
    src/index.html            the home page (a full document)
    src/pages/**.html         inner pages; src/pages/info.html -> /info/,
                              src/pages/work/luma.html -> /work/luma/
    src/blog/*.html           posts; src/blog/my-post.html -> /blog/my-post/
    src/layouts/page.html     the frame around inner pages and posts
    src/partials/*.html       pieces shared by every page (bar, menu, footer …)
    scripts/site_config.py    the person, the profiles, the navigation
    Files whose name starts with "_", and everything in a folder whose name does,
    are never built (src/pages/work/_full/ holds the full case studies, inactive).

Front matter, at the top of each source:
    ---
    title: Shown in the browser tab and search results (" — Prokhorov®" is added)
    description: The search snippet, ~140–160 characters
    heading: The page's <h1> (defaults to title)
    label: Short name for breadcrumbs (defaults to heading)
    lead: One line under the <h1>
    status: draft | live            (default draft)
    schema: WebPage | ProfilePage | ContactPage | CollectionPage
    date: 2026-10-02                (posts: first published)
    category: UX                    (posts: one short topic, on the card and beside the post)
    image: pm-macbook               (posts: a picture from assets/img/manifest.json, for the card and the post)
    card: lattice-hero              (cases: the picture on the /work/ card, as on the home page)
    card_alt: What it shows         (cases: that picture's alt text)
    card_pos: 60% 50%               (cases: which part of that picture the crops keep)
    card_tags: Framer / Concept  (cases without a picture: the card shows these tags and card_text instead)
    card_text: A short line         (cases without a picture: see card_tags)
    kind: Client website            (cases: the descriptor in the card's caption, after its dot)
    year: ’26                       (cases: the caption's last slot, as on the home cards — a year, a platform or nothing)
    progress: yes                   (cases: still in progress — the card carries the "In Progress" status)
    image_alt: What it shows        (posts: for the post's opening picture; on the card it is decorative)
    image_pos: 50% 40%              (posts: which part of the picture the crops keep)
    featured: yes                   (posts: the one shown large at the top of /blog/; otherwise the newest)
    updated: 2026-10-02             (last real change; feeds the sitemap)
    og_image: /assets/img/og.jpg    (1200×630; defaults to the site card)
    noindex: yes                    (keep a live page out of search)
    order: 2                        (position in its parent's list, e.g. cases on /work/)
    class: doc--contact             (an extra class on <main>, for page-specific styles)
    layout: archive                 (a frame other than src/layouts/page.html, e.g. the dark Archive)
    styles: /css/archive.css        (instead of /css/main.css)
    script: /js/archive/archive.js  (instead of /js/main.js)
    theme: #0b0b0b                  (the browser UI colour, default #ffffff)
    back: yes                       (a "Back to Site" link instead of the breadcrumbs)
    ---

The logic
  * A page is published only when its status is live. Drafts are built for
    preview with a visible flag and noindex, and they stay out of the sitemap,
    the menu, the blog list and the feed.
  * Menu items (NAV in site_config.py) link to their page once it is live,
    until then to the matching section of the home page, and are left out if
    there is neither.
  * <when live="/info/">…</when> keeps its content only once that page is
    live; <when draft="/info/">…</when> only until then.
  * The blog index stays noindex until at least one post is live; the feed is
    written only then, and a release build leaves /blog/ out entirely until then.
  * sitemap.xml lists exactly the pages that may be indexed.

Also: <pic name="…" alt="…" sizes="…" [class] [eager]> becomes a responsive
<picture> (AVIF + WebP, from assets/img/manifest.json), and ® / © after a word
become small raised marks (<span class="r">).
"""
import hashlib
import json
import math
import re
import sys
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html import escape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import site_config as C  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
RELEASE = "--release" in sys.argv
MANIFEST = json.loads((ROOT / "assets/img/manifest.json").read_text())
LEDGER = ROOT / "scripts/.generated.json"     # what the last build wrote, for cleaning up
YEAR = date.today().year

PIC = re.compile(r"<pic\s+([^>]*?)\s*/?>")
ATTR = re.compile(r'(\w[\w-]*)(?:="([^"]*)")?')
TEXT = re.compile(r">([^<]+)<")
MARK = re.compile(r"(?<=\w)([®©])")
PARTIAL = re.compile(r"\{\{>\s*([\w-]+)\s*\}\}")
VAR = re.compile(r"\{\{\s*(\w+)\s*\}\}")
COMMENT = re.compile(r"[ \t]*<!--.*?-->[ \t]*\n?", re.S)
WHEN = re.compile(r'<when (live|draft)="([^"]+)">(.*?)</when>', re.S)
TAGS = re.compile(r"<[^>]+>")

CHEV = '<svg class="mchev" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4.5 2.5 8 6l-3.5 3.5"/></svg>'
ARROW = ('<span class="social__arrow" aria-hidden="true">'
         '<svg viewBox="0 0 12 12" focusable="false"><path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6"/></svg>'
         '<svg viewBox="0 0 12 12" focusable="false"><path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6"/></svg></span>')
e = lambda s: escape(str(s), quote=True)
t = lambda s: escape(str(s), quote=False)


# ---------- sources ----------

def read(path):
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def front(text):
    meta = {}
    if text.startswith("---\n"):
        end = text.index("\n---\n", 3)
        for line in text[4:end].splitlines():
            if line.strip() and not line.lstrip().startswith("#"):
                k, _, v = line.partition(":")
                meta[k.strip()] = v.strip()
        text = text[end + 5:]
    return meta, text


def collect():
    pages = []

    def add(src, path, kind):
        meta, body = front(read(src))
        meta.setdefault("heading", meta.get("title", ""))
        meta.setdefault("label", meta["heading"])
        pages.append(dict(src=src, path=meta.get("path") or path, kind=kind, meta=meta, body=body,
                          live=meta.get("status", "draft") == "live"))

    add(SRC / "index.html", "/", "home")
    for f in sorted((SRC / "pages").rglob("*.html")):
        if not any(part.startswith("_") for part in f.relative_to(SRC / "pages").parts):
            add(f, "/" + "/".join(f.relative_to(SRC / "pages").with_suffix("").parts) + "/", "page")
    for f in sorted((SRC / "blog").glob("*.html")):
        if not f.name.startswith("_"):
            add(f, f"/blog/{f.stem}/", "post")
    if not RELEASE:
        return pages
    pages = [p for p in pages if p["live"]]
    if not any(p["kind"] == "post" for p in pages):
        pages = [p for p in pages if p["path"] != "/blog/"]
    return pages


PAGES = collect()
BY_PATH = {p["path"]: p for p in PAGES}
LIVE = {p["path"] for p in PAGES if p["live"]}
POSTS = sorted((p for p in PAGES if p["kind"] == "post" and p["live"]), key=lambda p: p["meta"].get("date", ""), reverse=True)
HAS_FEED = bool(POSTS)
# the posts /blog/ lists: the live ones; a preview build shows drafts too (marked), so they can be checked in place
LISTED = sorted((p for p in PAGES if p["kind"] == "post" and (p["live"] or not RELEASE)),
                key=lambda p: p["meta"].get("date", ""), reverse=True)
# pages the site may link to: the live ones, except /blog/ until a post is live (no menu item to an empty list)
LINKABLE = LIVE - ({"/blog/"} if not POSTS else set())


def is_case(p):
    return p["kind"] == "page" and p["path"].startswith("/work/") and p["path"] != "/work/"


def noindex(p):
    return (not p["live"]) or p["meta"].get("noindex") == "yes" or (p["path"] == "/blog/" and not POSTS)


def modified(p):
    m = p["meta"]
    return m.get("updated") or m.get("date") or date.fromtimestamp(p["src"].stat().st_mtime).isoformat()


def absolute(path):
    return C.URL + path


def out_file(path):
    if path == "/":
        return ROOT / "index.html"
    return ROOT / path.strip("/") if path.endswith(".html") else ROOT / path.strip("/") / "index.html"


# ---------- navigation ----------

def nav(cur):
    """(label, href, is_current) for each menu item shown on page `cur`. The current
    item comes from the address alone (a case study, /work/<slug>/, is part of Work);
    nothing on the page lights it up while scrolling."""
    items = []
    for item in C.NAV:
        if item["page"] in LINKABLE:
            href = item["page"]
        elif item["anchor"]:
            href = ("#" if cur == "/" else "/#") + item["anchor"]
        else:
            continue
        current = cur != "/" and cur.startswith(item["page"])
        items.append((item["label"], href, current))
    return items


def nav_bar(cur):
    out = []
    for label, href, current in nav(cur):
        attrs = ' aria-current="page"' if current else ""
        out.append(f'      <a data-roll href="{e(href)}"{attrs}>{t(label)}</a>')
    return "\n".join(out)


def nav_menu(cur):
    out = []
    for k, (label, href, current) in enumerate(nav(cur)):
        attrs = ' aria-current="page"' if current else ""
        out.append(f'          <li style="--k: {k}"><a href="{e(href)}" data-menu-link{attrs}>{t(label)}{CHEV}</a></li>')
    return "\n".join(out)


def socials():
    return "\n".join(
        f'            <li><a class="social" href="{e(url)}" rel="noopener" target="_blank"><span class="social__name" data-roll>{t(name)}</span>'
        f'<span class="visually-hidden"> (opens in a new tab)</span>{ARROW}</a></li>'
        for name, _, url in C.PROFILES)


def price(amount):
    """990 -> "from $990"; None -> the quoted-per-project label (for /llms.txt)."""
    return C.PRICING["quoted"] if amount is None else f"from ${amount:,}"


def profile_rows():
    """The profiles as ruled rows (/contact/): the name, the address without its scheme, the arrow."""
    return "\n".join(
        f'          <li><a class="row" href="{e(url)}" rel="noopener" target="_blank"><span class="row__a">{t(name)}</span>'
        f'<span class="row__b">{t(url.split("://", 1)[-1].removeprefix("www.").rstrip("/"))}</span>'
        f'<span class="row__c">Open<span class="visually-hidden"> (opens in a new tab)</span></span></a></li>'
        for name, _, url in C.PROFILES)


def menu_socials():
    return "".join(f'<li><a href="{e(url)}" rel="noopener" target="_blank" aria-label="{e(name)} (opens in a new tab)">{t(name)}</a></li>'
                   for name, _, url in C.PROFILES)


def chain(p):
    """Home → parents → this page, as (label, path)."""
    steps = [("Home", "/")]
    parts = [s for s in p["path"].strip("/").split("/") if s]
    for i in range(1, len(parts)):
        parent = "/" + "/".join(parts[:i]) + "/"
        if parent in BY_PATH:
            steps.append((BY_PATH[parent]["meta"]["label"], parent))
    steps.append((p["meta"]["label"], p["path"]))
    return steps


def crumbs(p):
    if p["meta"].get("back") == "yes":
        # the browser's back when the visitor came from the site (js/contact.js), so the page returns where it was
        return ('        <p class="back"><a class="back__link" href="/" data-back-to-site>'
                '<span aria-hidden="true">←</span><span data-roll>Back to Site</span></a></p>')
    steps = chain(p)
    li = [f'<li><a href="{e(path)}">{t(label)}</a></li>' for label, path in steps[:-1]]
    li.append(f'<li aria-current="page">{t(steps[-1][0])}</li>')
    return f'        <nav class="crumbs" aria-label="Breadcrumb"><ol>{"".join(li)}</ol></nav>'


# ---------- head, structured data ----------

def full_title(p):
    title = p["meta"].get("title", "")
    return title if "Prokhorov" in title else f"{title} — {C.NAME}"


def schema(p):
    m, url = p["meta"], absolute(p["path"])
    person_id, site_id, page_id = C.URL + "/#person", C.URL + "/#website", url + "#webpage"
    person = {
        "@type": "Person", "@id": person_id, "name": C.PERSON["name"], "alternateName": C.PERSON["alternateName"],
        "jobTitle": C.PERSON["jobTitle"], "url": C.URL + "/", "email": "mailto:" + C.EMAIL,
        "image": C.URL + C.PERSON["image"],
        "address": {"@type": "PostalAddress", "addressLocality": C.PERSON["locality"], "addressCountry": C.PERSON["country"]},
        "knowsAbout": C.PERSON["knowsAbout"], "knowsLanguage": C.PERSON["knowsLanguage"],
        "sameAs": [u for _, _, u in C.PROFILES],
    }
    if "/info/" in LIVE:
        person["mainEntityOfPage"] = C.URL + "/info/"
    website = {"@type": "WebSite", "@id": site_id, "url": C.URL + "/", "name": C.NAME, "inLanguage": "en", "publisher": {"@id": person_id}}
    kind = m.get("schema", "WebPage")
    page = {"@type": kind, "@id": page_id, "url": url, "name": full_title(p), "description": m.get("description", ""),
            "isPartOf": {"@id": site_id}, "inLanguage": "en", "dateModified": modified(p)}
    graph = [website, person, page]
    if kind == "ProfilePage":
        page["mainEntity"] = {"@id": person_id}
    else:
        page["about"] = {"@id": person_id}
    if p["kind"] == "post":
        graph.append({"@type": "BlogPosting", "@id": url + "#article", "headline": m["heading"], "description": m.get("description", ""),
                      "datePublished": m.get("date", modified(p)), "dateModified": modified(p), "author": {"@id": person_id},
                      "publisher": {"@id": person_id}, "image": C.URL + m.get("og_image", C.OG_IMAGE),
                      "mainEntityOfPage": {"@id": page_id}, "inLanguage": "en"})
    if is_case(p):
        work = {"@type": "CreativeWork", "@id": url + "#work", "name": m["heading"], "description": m.get("description", ""),
                "url": url, "creator": {"@id": person_id}, "inLanguage": "en", "isPartOf": {"@id": absolute("/work/") + "#webpage"}}
        if m.get("og_image"):
            work["image"] = C.URL + m["og_image"]
        if m.get("kind"):
            work["genre"] = m["kind"]
        graph.append(work)
        page["mainEntity"] = {"@id": url + "#work"}
    if p["path"] == "/work/":
        page["hasPart"] = [{"@id": absolute(q["path"]) + "#work"} for q in cases_in_order() if q["live"]]
    if p["path"] == "/blog/":
        page["mainEntity"] = {"@type": "Blog", "@id": url + "#blog", "name": f"{C.NAME} Blog",
                              "blogPost": [{"@id": absolute(q["path"]) + "#article"} for q in POSTS]}
    if p["kind"] != "home":
        items = [(label, path) for label, path in chain(p) if path in LIVE or path == p["path"]]
        graph.append({"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": i, "name": label, "item": absolute(path)} for i, (label, path) in enumerate(items, 1)]})
        page["breadcrumb"] = {"@id": url + "#breadcrumb"}
    data = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
    return data.replace("</", "<\\/")


def versioned(path):
    """/css/main.css -> /css/main.css?v=<first 8 of its content's hash>: a changed file gets a new
    address, so no browser or cache keeps serving the old one."""
    f = ROOT / path.lstrip("/")
    return f"{path}?v={hashlib.sha1(f.read_bytes()).hexdigest()[:8]}" if f.is_file() else path


def head(p):
    m = p["meta"]
    url = absolute(p["path"])
    title = full_title(p)
    desc = m.get("description", "")
    og_type = "article" if p["kind"] == "post" else "profile" if m.get("schema") == "ProfilePage" else "website"
    image = m.get("og_image", C.OG_IMAGE)
    lines = [
        '<meta charset="utf-8">',
        # GitHub Pages sets no security headers, so what a <meta> can carry goes here: no <base> or
        # plugin content can be injected; other sites see only the origin. Scripts are not restricted:
        # analytics loads from Google and Yandex hosts this page cannot test before it is live.
        """<meta http-equiv="Content-Security-Policy" content="base-uri 'self'; object-src 'none'">""",
        '<meta name="referrer" content="strict-origin-when-cross-origin">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        f"<title>{t(title)}</title>",
        f'<meta name="description" content="{e(desc)}">',
    ]
    # a page kept out of search gets noindex and no canonical (the two would contradict each other)
    lines.append('<meta name="robots" content="noindex">' if noindex(p) else f'<link rel="canonical" href="{url}">')
    lines += [
        f'<meta name="theme-color" content="{e(m.get("theme", "#ffffff"))}">',
        "",
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{e(C.NAME)}">',
        '<meta property="og:locale" content="en_US">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:title" content="{e(title)}">',
        f'<meta property="og:description" content="{e(m.get("og_description", desc))}">',
        f'<meta property="og:image" content="{C.URL + image}">',
    ]
    if image == C.OG_IMAGE or image.startswith("/assets/img/og/"):     # both made at 1200 × 630
        lines += ['<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">']
    if p["kind"] == "post":
        lines += [f'<meta property="article:published_time" content="{m.get("date", modified(p))}">',
                  f'<meta property="article:modified_time" content="{modified(p)}">']
    lines += [
        '<meta name="twitter:card" content="summary_large_image">',
        "",
        '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">',
        '<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">',
        '<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">',
        '<link rel="preload" href="/assets/fonts/inter-opsz.woff2" as="font" type="font/woff2" crossorigin>',
    ]
    if HAS_FEED:
        lines.append(f'<link rel="alternate" type="application/rss+xml" title="{e(C.NAME)} — Blog" href="/blog/feed.xml">')
    lines += [
        "",
        f'<link rel="stylesheet" href="{e(versioned(m.get("styles", "/css/main.css")))}">',
        # page transitions: before the first frame, so an arriving page starts under the ink
        f'<link rel="stylesheet" href="{versioned("/css/transitions.css")}">',
        f'<script src="{versioned("/js/transitions.js")}"></script>',
        # before the first paint: JS is on; a visitor who has seen the preloader this session skips it
        "<script>(function (h) { h.classList.replace('no-js', 'js'); try { if (sessionStorage.getItem('pk-seen') === '1') h.classList.add('is-seen'); } catch (e) {} })(document.documentElement)</script>",
        f'<script type="module" src="{e(versioned(m.get("script", "/js/main.js")))}"></script>',
    ]
    # analytics: the ids for js/consent.js, which loads them only after the visitor accepts
    if any(C.ANALYTICS.values()):
        lines += [
            f'<meta name="pk-analytics" data-ga4="{e(C.ANALYTICS["ga4"])}" data-ym="{e(C.ANALYTICS["metrica"])}">',
            f'<link rel="stylesheet" href="{versioned("/css/consent.css")}">',
            f'<script type="module" src="{versioned("/js/consent.js")}"></script>',
        ]
    lines += [
        "",
        '<script type="application/ld+json">',
        schema(p),
        "</script>",
    ]
    return "\n".join("  " + line if line else "" for line in lines)


# ---------- page parts ----------

def fmt_date(iso, long=True):
    d = date.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b %Y')}" if long else d.strftime("%b %Y")


def reading_minutes(body):
    return max(1, math.ceil(len(TAGS.sub(" ", body).split()) / 220))


def post_meta(p):
    m = p["meta"]
    author = '<a href="/info/">Artem Prokhorov</a>' if "/info/" in LIVE else "Artem Prokhorov"
    bits = [f"<span>{t(m['category'])}</span>"] if m.get("category") else []
    bits.append(f"<span>By {author}</span>")
    if m.get("date"):
        bits.append(f'<span><time datetime="{m["date"]}">{fmt_date(m["date"])}</time></span>')
    bits.append(f"<span>{reading_minutes(p['body'])} min read</span>")
    if m.get("updated") and m.get("updated") != m.get("date"):
        bits.append(f'<span>Updated <time datetime="{m["updated"]}">{fmt_date(m["updated"])}</time></span>')
    return '        <p class="doc__meta">' + "".join(bits) + "</p>"


def post_card(q, feature=False):
    """One article on /blog/: picture, category and date, title, a line of lead, "Read Article".
    The title's link covers the whole card; the picture is decorative (the title says it all)."""
    m = q["meta"]
    pos = f' style="--pos: {e(m["image_pos"])}"' if m.get("image_pos") else ""
    sizes = ("(min-width: 1200px) 68vw, (min-width: 768px) 60vw, 100vw" if feature
             else "(min-width: 1200px) 32vw, (min-width: 768px) 28vw, 34vw")
    media = f'<div class="post__media"{pos}><pic name="{m["image"]}" alt="" sizes="{sizes}"></div>' if m.get("image") else ""
    bits = [f'<span class="post__cat">{t(m["category"])}</span>'] if m.get("category") else []
    if m.get("date"):
        bits.append(f'<time datetime="{m["date"]}">{fmt_date(m["date"])}</time>')
    if feature:
        bits.append(f"<span>{reading_minutes(q['body'])} min read</span>")
    if not q["live"]:
        bits.append('<span class="post__draft">Draft</span>')
    level = "h3"
    return (f'<article class="post{" post--feature" if feature else ""}">{media}<div class="post__body">'
            f'<p class="post__meta">{"".join(bits)}</p>'
            f'<div class="post__text"><{level} class="post__title"><a class="post__link" href="{q["path"]}">'
            f'<span class="post__line">{t(m["heading"])}</span></a></{level}>'
            f'<p class="post__lead">{t(m.get("lead", ""))}</p></div>'
            f'<p class="post__more" aria-hidden="true"><span>Read Article</span>{ARROW}</p></div></article>')


def blog_parts():
    """/blog/: the featured post, large, and the list of the others."""
    if not LISTED:
        return dict(post_feature='<p class="doc-empty">No posts yet — the first ones are on the way.</p>',
                    post_list="", post_count="00")
    feature = next((q for q in LISTED if q["meta"].get("featured") == "yes"), LISTED[0])
    rest = [q for q in LISTED if q is not feature]
    items = "".join(f'<li style="--k: {k}">{post_card(q)}</li>' for k, q in enumerate(rest))
    return dict(post_feature=post_card(feature, True), post_list=f'<ol class="posts">{items}</ol>' if rest else "",
                post_count=f"{len(rest):02d}")


def cases_in_order():
    """Every case page (src/pages/work/*.html) that this build publishes, in its /work/ order."""
    cases = [q for q in PAGES if q["kind"] == "page" and q["path"].startswith("/work/") and q["path"] != "/work/"
             and (q["live"] or not RELEASE)]
    cases.sort(key=lambda q: (int(q["meta"].get("order", 999)), q["path"]))
    return cases


def case_card(q, sizes, wide=False, eager=False):
    """One case as the home page's work card, linking to the case. All it says comes from the
    case page's own front matter."""
    m = q["meta"]
    pos = f' style="--pos: {e(m["card_pos"])}"' if m.get("card_pos") else ""
    if m.get("card"):
        media = (f'<span class="item__media"{pos}><pic name="{m["card"]}" alt="{e(m.get("card_alt", ""))}" '
                 f'sizes="{sizes}"{" eager" if eager else ""}></span>')
    else:
        tags = "".join(f'<span class="tag">{t(x.strip())}</span>' for x in m.get("card_tags", "").split("/") if x.strip())
        media = f'<span class="item__media item__media--text"><span class="tags">{tags}</span><span>{t(m.get("card_text", ""))}</span></span>'
    # the tags, one per line down the right edge (front matter "tags", split at "/";
    # without it, the kind and the year)
    names = [x.strip() for x in (m.get("tags") or f'{m.get("kind", "")}/{m.get("year", "")}').split("/") if x.strip()]
    tags = [t(x) for x in names]
    if m.get("progress") == "yes":
        tags.append('<span class="case__status"><i class="dot"></i>In Progress</span>')
    tags = "".join(f'<span class="item__tag">{x}</span>' for x in tags)
    return (f'<li class="item{" item--wide" if wide else ""}"><a class="item__link" href="{q["path"]}" data-case-link>{media}'
            f'<span class="item__cap"><span class="item__name">{t(m["heading"])}</span>'
            f'<span class="item__tags">{tags}</span></span></a></li>')


def work_parts():
    """/work/: every case, in order. Every third card, from the first, takes the full width; the others go in pairs."""
    cases = cases_in_order()
    out = []
    for k, q in enumerate(cases):
        wide = k % 3 == 0
        sizes = ("(min-width: 1200px) 70vw, (min-width: 768px) 62vw, 100vw" if wide
                 else "(min-width: 1200px) 35vw, (min-width: 768px) 31vw, 100vw")
        out.append(case_card(q, sizes, wide, eager=k == 0))
    return dict(work_list="\n".join("          " + x for x in out), work_count=f"{len(cases):02d}")


def case_end(p):
    """The close of a case page: the next case (after the last, the first) as a work card,
    as on the home page and /work/, under the numbered heading the home sections use."""
    cases = cases_in_order()
    if not is_case(p) or p not in cases:
        return dict(next_card="", next_count="")
    k = (cases.index(p) + 1) % len(cases)
    card = case_card(cases[k], "(min-width: 1200px) 70vw, (min-width: 768px) 62vw, 100vw", wide=True)
    return dict(next_card="          " + card, next_count=f"{k + 1:02d} / {len(cases):02d}")


def context(p):
    cur = p["path"]
    m = p["meta"]
    form = "/get-in-touch/"
    cta = "#main" if cur == form else form if form in LIVE else "mailto:" + C.EMAIL
    return dict(
        head=head(p), email=C.EMAIL, year=YEAR,
        brand_href="#top" if cur == "/" else "/",
        brand_label=f"{C.NAME} — back to top" if cur == "/" else f"{C.NAME} — home",
        # "Get in Touch" never hands off to a mail app: the form page, or (on it) the form itself
        cta_href=cta,
        # the project form posts to Web3Forms; until the access key is set it cannot send (js/contact.js says so)
        form_action=C.FORM_ENDPOINT,
        form_key=C.FORM_ACCESS_KEY,
        form_mode="post" if C.FORM_ENDPOINT and C.FORM_ACCESS_KEY else "none",
        nav_bar=nav_bar(cur), nav_menu=nav_menu(cur),
        # the one footer: in the home feed it is a plain row, on inner pages it also takes the page grid's foot cell
        foot_class="foot" if p["kind"] == "home" else "doc__foot foot",
        socials=socials(), menu_socials=menu_socials(), profile_rows=profile_rows(),
        profile_count=len(C.PROFILES), profile_count_2=f"{len(C.PROFILES):02d}",
        heading=t(m["heading"]), lead=t(m.get("lead", "")),
        crumbs=crumbs(p) if p["kind"] != "home" else "",
        side_extra=post_meta(p) if p["kind"] == "post" else "",
        draft_flag='  <p class="draft-flag" role="note"><b>Draft</b> · not indexed, not in the menu</p>\n' if not p["live"] else "",
        **blog_parts(), **work_parts(), **case_end(p),
        work_lead=t(BY_PATH["/work/"]["meta"].get("lead", "")) if "/work/" in BY_PATH else "",
        page_class=" " + m["class"] if m.get("class") else "",
    )


def expand(text, ctx):
    text = WHEN.sub(lambda w: w.group(3) if (w.group(2) in LINKABLE) == (w.group(1) == "live") else "", text)
    text = PARTIAL.sub(lambda k: expand(read(SRC / "partials" / f"{k.group(1)}.html").rstrip("\n"), ctx), text)

    def var(k):
        if k.group(1) not in ctx:
            raise KeyError(f"unknown placeholder {{{{{k.group(1)}}}}}")
        return str(ctx[k.group(1)])
    return VAR.sub(var, text)


def picture(match):
    attrs = {k: v for k, v in ATTR.findall(match.group(1))}
    name = attrs["name"]
    info = MANIFEST[name]
    widths = info["widths"]
    base = f"/assets/img/{name}"
    srcset = lambda ext: ", ".join(f"{base}-{w}.{ext} {w}w" for w in widths)
    largest = widths[-1]
    height = round(largest * info["ratio"])
    eager = "eager" in attrs
    cls = f' class="{attrs["class"]}"' if attrs.get("class") else ""
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (
        f'<picture{cls}>'
        f'<source type="image/avif" srcset="{srcset("avif")}" sizes="{attrs["sizes"]}">'
        f'<img src="{base}-{widths[0]}.webp" srcset="{srcset("webp")}" sizes="{attrs["sizes"]}" '
        f'width="{largest}" height="{height}" alt="{escape(attrs.get("alt", ""))}" {loading} decoding="async">'
        f'</picture>'
    )


def small_marks(html):
    """Wrap ® / © in visible body text only (never in attributes or <head>)."""
    head_, sep, body = html.partition("<body>")
    wrap = lambda m: ">" + MARK.sub(lambda k: f'<span class="r">{k.group(1)}</span>', m.group(1)) + "<"
    return head_ + sep + TEXT.sub(wrap, body)


def render(p):
    ctx = context(p)
    if p["kind"] == "home":
        doc = p["body"]
    else:
        body = expand(p["body"], ctx)
        if p["kind"] == "post":
            m = p["meta"]
            pos = f' style="--pos: {e(m["image_pos"])}"' if m.get("image_pos") else ""
            hero = (f'        <figure class="article__hero"{pos}><pic name="{m["image"]}" alt="{e(m.get("image_alt", ""))}" '
                    f'sizes="(min-width: 1200px) 44vw, (min-width: 768px) 64vw, 100vw" eager></figure>\n') if m.get("image") else ""
            ctx["content"] = f'      <div class="article">\n{hero}{body.rstrip()}\n      </div>'
        else:
            ctx["content"] = body.rstrip()
        doc = read(SRC / "layouts" / f"{p['meta'].get('layout', 'page')}.html")
    out = small_marks(PIC.sub(picture, expand(doc, ctx)))
    if RELEASE:
        out = COMMENT.sub("", out)
    rel = p["src"].relative_to(ROOT).as_posix()
    banner = f"<!-- Generated from {rel} by scripts/build-html.py — edit the source, not this file. -->\n"
    return out.replace("<!doctype html>\n", "<!doctype html>\n" + banner, 1)


# ---------- site files ----------

def sitemap():
    urls = "".join(f"  <url><loc>{absolute(p['path'])}</loc><lastmod>{modified(p)}</lastmod></url>\n"
                   for p in sorted(PAGES, key=lambda p: p["path"]) if not noindex(p) and not p["path"].endswith(".html"))
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n'


def feed():
    rfc = lambda iso: format_datetime(datetime.fromisoformat(iso).replace(tzinfo=timezone.utc))
    blog = BY_PATH.get("/blog/", {"meta": {}})
    items = "".join(
        f"    <item><title>{t(q['meta']['heading'])}</title><link>{absolute(q['path'])}</link>"
        f"<guid isPermaLink=\"true\">{absolute(q['path'])}</guid><pubDate>{rfc(q['meta']['date'])}</pubDate>"
        f"<description>{t(q['meta'].get('description', ''))}</description></item>\n" for q in POSTS)
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n'
            f"    <title>{t(C.NAME)} — Blog</title>\n    <link>{C.URL}/blog/</link>\n"
            f"    <description>{t(blog['meta'].get('description', ''))}</description>\n    <language>en</language>\n"
            f'    <atom:link href="{C.URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>\n'
            f"    <lastBuildDate>{rfc(POSTS[0]['meta']['date'])}</lastBuildDate>\n{items}  </channel>\n</rss>\n")


def llms():
    """/llms.txt: who, what, where, and the published pages — only what the site itself says."""
    home = BY_PATH["/"]["meta"]
    lines = [f"# {C.PERSON['name']} ({C.NAME})", "", f"> {home.get('description', '')}", "",
             f"- Role: {C.PERSON['jobTitle']}", f"- Based in: {C.PERSON['locality']}, Kyrgyzstan (UTC+6); works remotely worldwide",
             f"- Languages: English, Russian", f"- Contact: {C.EMAIL}", ""]
    lines += ["## Services", ""] + [f"- {name}: {line}" for name, line in C.SERVICES] + [""]
    P = C.PRICING
    lines += ["## Pricing (USD)", "", P["intro"], "", f"- {P['lead'][0]}: {price(P['lead'][2])}. {P['lead'][1]}"]
    lines += [f"- {n}: {price(a)}. {l}" for n, l, a in P["services"]]
    lines += ["", f"{P['factors']} {P['note']}", ""]
    lines += ["## Pages", ""]
    for path in ("/", "/work/", "/info/", "/contact/", "/get-in-touch/", "/blog/"):
        q = BY_PATH.get(path)
        if q and path in LINKABLE and not noindex(q):
            label = "Home" if path == "/" else q["meta"].get("label", q["meta"]["heading"])
            lines.append(f"- [{label}]({absolute(path)}): {q['meta'].get('description', '')}")
    lines += ["", "## Case studies", ""]
    for q in cases_in_order():
        if q["live"]:
            lines.append(f"- [{q['meta']['heading']}]({absolute(q['path'])}): {q['meta'].get('description', '')}")
    lines += ["", "## Profiles", ""] + [f"- {name}: {url}" for name, _, url in C.PROFILES]
    return "\n".join(lines) + "\n"


def checks(p, html):
    """Warnings worth fixing before a page goes live."""
    m, warn = p["meta"], []
    body = re.split(r"<body[^>]*>", html, maxsplit=1)[-1]
    h1 = len(re.findall(r"<h1[\s>]", body))
    if h1 != 1:
        warn.append(f"{h1} <h1> elements (should be 1)")
    if not m.get("title"):
        warn.append("no title")
    d = len(m.get("description", ""))
    if not d:
        warn.append("no description")
    elif not 70 <= d <= 170:
        warn.append(f"description is {d} characters (aim for ~140–160)")
    if p["kind"] == "post" and not m.get("date"):
        warn.append("post without a date")
    return warn


def main():
    written = []

    def write(path, text):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        written.append(path.relative_to(ROOT).as_posix())

    titles = {}
    rows = []
    for p in PAGES:
        html = render(p)
        write(out_file(p["path"]), html)
        titles.setdefault(full_title(p), []).append(p["path"])
        state = "live" if p["live"] else "draft"
        state += ", noindex" if noindex(p) and p["live"] else ""
        rows.append((p["path"], state, checks(p, html)))
    write(ROOT / "sitemap.xml", sitemap())
    write(ROOT / "llms.txt", llms())
    if HAS_FEED:
        write(ROOT / "blog/feed.xml", feed())

    # remove what an earlier build wrote and this one did not (a page set back to draft, a renamed post …)
    before = json.loads(LEDGER.read_text()) if LEDGER.exists() else []
    for rel in sorted(set(before) - set(written)):
        f = ROOT / rel
        # only pages this script wrote: never a source, and never anything outside the project
        if f.exists() and not rel.startswith("src/") and f.resolve().is_relative_to(ROOT.resolve()):
            f.unlink()
            for d in f.parents:
                if d == ROOT or any(d.iterdir()):
                    break
                d.rmdir()
            print(f"  removed {rel}")
    LEDGER.write_text(json.dumps(sorted(written), indent=1))

    print(f"{'release' if RELEASE else 'preview'} build: {len(PAGES)} pages, {len(POSTS)} live posts")
    if not C.FORM_ACCESS_KEY:
        print("  ! FORM_ACCESS_KEY requires confirmation: the project form on /get-in-touch/ cannot send (scripts/site_config.py)")
    for path, state, warn in rows:
        print(f"  {path:<40} {state}" + ("".join(f"\n      ! {w}" for w in warn) if warn else ""))
    for title, paths in titles.items():
        if len(paths) > 1:
            print(f"  ! same title on {', '.join(paths)}: {title}")


if __name__ == "__main__":
    main()
