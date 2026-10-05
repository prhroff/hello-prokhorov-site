"""Site-wide facts and navigation, read by build-html.py (named site_config, not site: "site" is a Python standard module).

Everything that appears on more than one page lives here once: the person
(for structured data), the profiles, the navigation. Each page's own title,
description and status sit in its front matter (src/pages/**, src/blog/*).
"""

URL = "https://helloprokhorov.com"
NAME = "Prokhorov®"
EMAIL = "contact@helloprokhorov.com"
OG_IMAGE = "/assets/img/og.jpg"          # 1200×630, used when a page sets none

# The project form on /contact/ posts here (any service that accepts a form
# POST and answers JSON, e.g. https://formspree.io/f/xxxxxxx). Left empty, the
# form opens the visitor's email app with their answers filled in instead.
FORM_ENDPOINT = ""

PERSON = {
    "name": "Artem Prokhorov",
    "alternateName": "Prokhorov®",
    "jobTitle": "Independent Web Designer & Developer",
    "image": "/assets/img/portrait-1000.webp",
    "locality": "Bishkek",
    "country": "KG",
    "knowsAbout": ["Web design", "Website development", "Front-end development", "Web animation", "Interaction design", "UI/UX design", "Art direction", "Design systems", "UX audits", "Framer", "Webflow"],
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
