"""Site-wide facts and navigation, read by build-html.py (named site_config, not site: "site" is a Python standard module).

Everything that appears on more than one page lives here once: the person
(for structured data), the profiles, the navigation. Each page's own title,
description and status sit in its front matter (src/pages/**, src/blog/*).
"""

URL = "https://helloprokhorov.com"
NAME = "Prokhorov®"
EMAIL = "contact@helloprokhorov.com"
OG_IMAGE = "/assets/img/og.jpg"          # 1200×630, used when a page sets none

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
    "alternateName": "Prokhorov®",
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

# Pricing: used by /llms.txt only (the contact page no longer shows it), written to be lifted as it is into
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

# Confirmed profiles: they also feed the Person's sameAs.
PROFILES = [
    ("LinkedIn", "LI", "https://www.linkedin.com/in/helloprokhorov"),
    ("Contra", "CO", "https://contra.com/helloprokhorov"),
    ("X", "X", "https://x.com/helloprokhorov"),
    ("Instagram", "IG", "https://www.instagram.com/hello.prokhorov/"),
]

# Top bar and phone menu, in order.
#   page    the page this item stands for
#   anchor  the matching section on the home page (or None)
# The link goes to the page once that page is live; until then to the home
# section; with neither, the item stays out of the menu. The item is marked
# current only by the address: its page, or a page under it (/work/<slug>/).
NAV = [
    dict(label="Work", page="/work/", anchor="work"),
    dict(label="Info", page="/info/", anchor="about"),
    dict(label="Contact", page="/contact/", anchor="contact"),
    dict(label="Blog", page="/blog/", anchor=None),
]
