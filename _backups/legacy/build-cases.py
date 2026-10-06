# LEGACY — kept only as a reference: its CASES table is where the case-study copy came from.
# It must never run: it rewrites src/index.html with the old case dialogs and TODO placeholders,
# overwriting the current home page. The case pages now live in src/pages/work/*.html.
raise SystemExit("build-cases.py is legacy and disabled: it would overwrite src/index.html. Edit src/pages/work/*.html instead.")

# Generates the seven case dialogs in src/index.html from one data table.
# Edit the CASES table, then: python scripts/build-cases.py && python scripts/build-html.py
# Real facts come from the existing site copy and cases/monolith/Monolith ONE.md.
# Everything unknown is a visible
# placeholder (TODO) that says what belongs there — nothing is invented.
import re, html

from pathlib import Path
SRC = Path(__file__).resolve().parent.parent / 'src' / 'index.html'

SECTIONS = ['Challenge', 'Research & Strategy', 'Brand Direction', 'UX Structure', 'Visual Language', 'Final Experience']
META_KEYS = ['Client', 'Year', 'Role', 'Industry', 'Platform', 'Scope', 'Timeline']

def TODO(text):            # a writing prompt, shown as a placeholder
    return ('todo', text)

def IMG(name, alt, cap=''):
    return ('img', name, alt, cap)

def PH(label):              # an image placeholder
    return ('ph', label)

def METRICS(*items):        # (value, label) — value None = placeholder
    return ('metrics', items)

STAR = '<svg class="star" viewBox="1 0 47 48" aria-hidden="true" focusable="false"><use href="#pk-mark"/></svg>'

CASES = [
 dict(id='pm', title='Powermatic®', cover=('powermatic-tablet', 'Powermatic® website on a tablet'), dark=False,
  intro='A website for Powermatic Technologies® — a technology partner helping teams turn ideas into scalable digital products through strategy, design and engineering.',
  meta={'Client': 'Powermatic Technologies®', 'Role': 'Website design and Framer development', 'Industry': 'Technology partner — strategy, design, engineering', 'Platform': 'Framer', 'Scope': 'Marketing website'},
  sections=[
   [TODO('The brief in two or three sentences: what Powermatic needed from the site, who it is for, and what was not working before.'),
    ('row', 'wide', '16 / 10', [IMG('pm-hero', 'Powermatic® homepage hero with a portrait and the line “Trusted Technology Partner for Growing Businesses”', 'Homepage hero')])],
   [TODO('What you looked at before designing: competitors, the audience, interviews or analytics, and the positioning you agreed on.'),
    ('row', 'pair', '4 / 3', [PH('Research board — competitors and references'), PH('Positioning or audience map')])],
   [TODO('The tone you set for the brand online and why: the red-and-black palette, the key-ring motif, the typography.'),
    ('row', 'pair', '1 / 1', [IMG('powermatic-keys', 'Powermatic® campaign visual: keys on a red and black diagonal pattern', 'Campaign key visual'), IMG('pm-tshirt', 'Powermatic® logo on a black T-shirt', 'Brand on merchandise')]),
    ('row', 'wide', '3 / 2', [IMG('pm-hardware', 'Powermatic® wordmark over dark perforated hardware', 'Brand imagery')])],
   [('p', 'The main menu covers Home, Services, About Us, Leadership, Careers and Partners. Alongside it sit case studies, a blog, engagement models with pricing, and a contact page.'),
    TODO('How the structure was decided, and the path you designed from first visit to contact.'),
    ('row', 'wide', '3 / 2', [IMG('pm-macbook', 'Powermatic® site on a laptop with the full-screen menu open', 'Full-screen menu')]),
    ('row', 'pair', '4 / 3', [IMG('pm-engagement', 'Powermatic® engagement models page with three pricing options', 'Engagement models'), IMG('pm-blog', 'Powermatic® blog listing, “Perspectives on technology”', 'Blog')])],
   [TODO('The system behind the pages: type scale, grid, colour, imagery and motion — what makes them feel like one product.'),
    ('row', 'pair', '4 / 5', [IMG('pm-about', 'Powermatic® about section with key figures', 'About, with key figures'), IMG('pm-cases', 'Powermatic® case studies grid on a dark background', 'Case studies')]),
    ('row', 'wide', '3 / 2', [IMG('pm-loader', 'Powermatic® page loader counting on a dark screen', 'Loader')])],
   [TODO('What launched, how it was received, and any results you can share.'),
    METRICS((None, 'Result — e.g. leads per month'), (None, 'Result — e.g. time on site'), (None, 'Result — e.g. pages launched')),
    ('row', 'wide', '4 / 3', [IMG('pm-ipad-stand', 'Powermatic® site on a tablet on a stand in a dark room', 'On tablet')]),
    ('row', 'pair', '4 / 5', [IMG('pm-laptop-chair', 'Powermatic® site on a laptop on a person’s lap', 'In use'), IMG('pm-phone-pricing', 'Powermatic® engagement models on a phone', 'On mobile')]),
    ('row', 'wide', '3 / 2', [IMG('pm-contact', 'Powermatic® contact page with the email address set large', 'Contact page')])],
  ]),

 dict(id='vh', title='Visual Hunters®', cover=('vh-poster', 'Visual Hunters® poster'), dark=False,
  intro='A web concept exploring bold typography and 3D in web design. Built as a personal experiment in visual direction and layout systems.',
  meta={'Client': 'Self-initiated concept', 'Year': '2026', 'Role': 'Concept, art direction, web design', 'Industry': 'Design studio (concept)', 'Scope': 'Website concept'},
  sections=[
   [('p', 'A personal experiment in visual direction and layout systems, exploring bold typography and 3D on the web.'),
    TODO('What you wanted to prove or practise with this concept, and the constraint you set yourself.'),
    ('row', 'wide', '16 / 10', [IMG('vh-site', 'Visual Hunters® homepage with 3D cards between large type', 'Homepage')])],
   [TODO('References and studios you looked at, and the direction you chose from them.'),
    ('row', 'pair', '4 / 3', [PH('Reference board — type and 3D on the web'), PH('Direction sketches')])],
   [TODO('The name, the logotype and the attitude of the brand.'),
    ('row', 'pair', '1 / 1', [IMG('vh-logo', 'Visual Hunters® logotype on white', 'Logotype'), IMG('vh-teaser', 'Visual Hunters® “Coming soon” teaser poster', 'Teaser')])],
   [TODO('Which pages exist and how a visitor moves through them.'),
    ('row', 'wide', '3 / 2', [IMG('vh-alt', 'Alternative Visual Hunters® hero: “Design Studio focused on Digital Products, Interfaces and Branding Systems”', 'Alternative hero')]),
    ('row', 'pair', '4 / 3', [PH('Sitemap'), PH('Wireframes')])],
   [TODO('Type, layout grid, the 3D objects, colour and motion — and how they work together.'),
    ('row', 'pair', '4 / 5', [IMG('vh-display', 'Visual Hunters® landing page on a studio display', 'On a studio display'), IMG('vh-shelf', 'Visual Hunters® on a laptop', 'On a laptop')])],
   [TODO('What you took away from the experiment, and where it is going next.'),
    ('row', 'wide', '4 / 5', [IMG('vh-monitor', 'Visual Hunters® website design on a monitor, presentation poster', 'Presentation')]),
    ('row', 'wide', '1 / 1', [IMG('vh-office', 'Visual Hunters® on a laptop in an office', 'In context')])],
  ]),

 dict(id='co', title='Contour Office©', cover=('contour-laptop', 'Contour Office© on a laptop'), dark=False,
  intro='A typographic web concept built around restraint and structure — grid, proportion and a design manifesto as the core visual language. Explored as a website redesign for accounting and CPA firms.',
  meta={'Client': 'Self-initiated concept', 'Year': '2026', 'Role': 'Concept and web design', 'Industry': 'Accounting and CPA firms', 'Scope': 'Website redesign concept'},
  sections=[
   [TODO('What is wrong with how accounting and CPA firms usually present themselves online, and what this concept sets out to fix.'),
    ('row', 'wide', '3 / 2', [IMG('co-hero', 'Contour Office© homepage: “Accounting for Companies that Think Ahead”', 'Homepage')])],
   [TODO('Who the firm’s clients are, what they need to see first, and which sites you compared.'),
    ('row', 'pair', '4 / 3', [PH('Audience and competitor notes'), PH('Content priorities')])],
   [('p', 'Restraint and structure: grid, proportion and a written design manifesto as the core of the visual language.'),
    TODO('Why restraint suits this industry, and how the manifesto guided decisions.'),
    ('row', 'wide', '2 / 1', [IMG('co-manifesto', 'Close-up of the Contour Office© design manifesto text', 'The manifesto')])],
   [TODO('The pages, the order of information, and the path to a consultation.'),
    ('row', 'pair', '4 / 3', [PH('Sitemap'), PH('Key page wireframes')])],
   [TODO('The grid, the type scale and the proportions you set.'),
    ('row', 'pair', '4 / 5', [IMG('contour-cover', 'Contour Office© homepage close-up', 'Homepage detail'), PH('Type scale and grid')])],
   [TODO('The finished concept and what you would test with a real firm.'),
    ('row', 'wide', '1 / 1', [IMG('contour-laptop', 'Contour Office© website on a laptop in a dark room', 'On a laptop')])],
  ]),

 dict(id='mo', title='Monolith ONE', cover=('monolith-render', 'Monolith unit render'), dark=True,
  intro='A high‑end industrial audio system defined from the product specification up, and the website that presents it. German structuralism, Bauhaus and Dieter Rams as the reference points.',
  meta={'Client': 'Self-initiated concept', 'Role': 'Product concept and art direction', 'Industry': 'Consumer audio', 'Scope': 'Product specification, visuals, landing page'},
  sections=[
   [('p', 'A product defined from the specification up: geometry, materials, seams and engravings first, the visuals second.'),
    TODO('The question behind the concept, and why a speaker.'),
    ('row', 'wide', '3 / 2', [IMG('mo-hero', 'Monolith ONE landing page hero: “Absolute Visual Purity. Uncompromising Sound.”', 'Landing page hero')])],
   [('p', 'The work started as a written product specification, version 1.0: geometry, materials, every seam and engraving, down to tolerances. The visuals were generated from that specification rather than the other way round.'),
    TODO('The references you collected and why these three — German structuralism, Bauhaus, Dieter Rams.'),
    ('row', 'pair', '4 / 3', [PH('Reference board'), PH('Specification page')])],
   [('p', 'An elongated vertical cuboid, strictly 90° and 1:3 in proportion — 600 × 200 × 150 mm — in matte anodised aluminium with a deep graphite acoustic textile. “Absolute visual purity” is a rule, not a slogan: the right side carries no text, no connectors, nothing.'),
    ('row', 'pair', '4 / 5', [IMG('mo-tower-dark', 'Monolith ONE tower in a dark room', 'The object'), IMG('mo-poster', 'Monolith ONE poster with the knurled knob in close-up', 'Poster')])],
   [('p', 'The front is split 25% metal and 75% fabric by a single 1 mm shadow gap. A 60 mm flush knob on top is the only control, its ring light fading in on touch. Indication shines through the fabric and fades out after two seconds. Everything technical sits on the back.'),
    ('row', 'pair', '1 / 1', [IMG('mo-knob', 'Monolith ONE knurled volume knob with the ring light on', 'The only control'), IMG('mo-front', 'Monolith ONE back panel with the recessed connector bay', 'Back panel')])],
   [('p', 'Micro-engravings — “MONOLITH // 01” at 2 mm, unfilled, readable only by their shadow. Deep vertical knurling at a 1 mm pitch. Hidden 1.5 mm feet so the unit appears to float on its own contact shadow.'),
    ('row', 'wide', '16 / 9', [IMG('mo-close', 'Close-up of the Monolith engraving and the shadow gap', 'Engraving and shadow gap')]),
    ('row', 'pair', '1 / 1', [IMG('monolith-detail', 'Close-up of the engraved Monolith aluminium band and fabric grille', 'Metal and fabric'), IMG('mo-stone', 'Monolith ONE on a stone floor', 'Material study')])],
   [TODO('The landing page that presents the product, and what you would do next with the concept.'),
    METRICS((None, 'Outcome — e.g. pages designed'), (None, 'Outcome — e.g. renders produced'), (None, 'Outcome — e.g. reception or reach')),
    ('row', 'wide', '4 / 3', [IMG('monolith-tower', 'Monolith ONE landing page: the vertical speaker under a single beam of light', 'Landing page')]),
    ('row', 'wide', '16 / 9', [IMG('mo-tower-light', 'Monolith ONE tower lit from the side', 'Product shot')])],
  ]),

 dict(id='la', title='Lattice', cover=('lattice-hero', 'Lattice homepage in a server rack'), dark=True,
  intro='A multi‑page website concept for an infrastructure control plane — “on‑prem that operates like the public cloud”, for teams that run their own hardware.',
  meta={'Client': 'Self-initiated concept', 'Role': 'Website design', 'Industry': 'Infrastructure software', 'Scope': 'Multi-page website: 7 pages'},
  sections=[
   [TODO('Why infrastructure software is hard to explain on a website, and what this concept had to make clear.'),
    ('row', 'wide', '4 / 3', [IMG('la-image', 'Lattice homepage on a laptop: “On-prem that operates like the public cloud”', 'Homepage')])],
   [TODO('Who buys a control plane, what they check first, and which products you studied.'),
    ('row', 'pair', '4 / 3', [PH('Audience and buying journey'), PH('Competitor review')])],
   [TODO('The tone for a technical audience: the dark palette, the green accent, the voice of the copy.'),
    ('row', 'pair', '1 / 1', [IMG('lattice-plinth', 'Lattice homepage on a laptop resting on a stone plinth', 'Brand mood'), PH('Palette and type')])],
   [('p', 'Seven pages: home, product, customers, security, pricing, docs and changelog.'),
    TODO('How the seven pages connect, and the path from the homepage to a demo or the docs.'),
    ('row', 'pair', '4 / 3', [PH('Sitemap — 7 pages'), PH('Page wireframes')])],
   [TODO('The interface language: code, diagrams, type and the single accent colour.'),
    ('row', 'pair', '4 / 5', [IMG('la-safari', 'Lattice homepage in a dark browser window', 'Homepage, desktop'), IMG('la-ipad', 'Lattice on a tablet', 'Tablet')])],
   [TODO('The finished concept across devices, and what you would validate next.'),
    ('row', 'wide', '4 / 3', [IMG('la-rack', 'Lattice website on a laptop in a server rack', 'In context')]),
    ('row', 'pair', '4 / 5', [IMG('la-pedestal', 'Lattice homepage on a laptop on a stone pedestal', 'Desktop'), IMG('la-phone', 'Lattice homepage on a phone', 'Mobile')])],
  ]),

 dict(id='lu', title='Luma', cover=('luma-screen', 'Luma landing page'), dark=False,
  intro='A landing page concept for a product that turns an incoming flow into prioritised opportunities.',
  meta={'Client': 'Concept', 'Role': 'Landing page design', 'Scope': 'Product landing page'},
  sections=[
   [TODO('The product in one paragraph, and what the landing page had to achieve.'),
    ('row', 'wide', '1 / 1', [IMG('lu-page', 'Luma landing page: “Prioritized opportunities from your incoming flow”', 'Landing page')])],
   [TODO('Who the page is for, and the one action it asks them to take.'),
    ('row', 'pair', '4 / 3', [PH('Audience and message hierarchy'), PH('Competitor pages')])],
   [TODO('Name, tone and visual mood.'),
    ('row', 'pair', '4 / 3', [PH('Logo and palette'), PH('Mood references')])],
   [TODO('The sections of the page, in order, and what each one answers.'),
    ('row', 'pair', '4 / 3', [PH('Page outline'), PH('Wireframe')])],
   [TODO('Type, colour and the product screens.'),
    ('row', 'wide', '7 / 6', [IMG('lu-display', 'Luma landing page on a studio display', 'On a studio display')])],
   [TODO('The finished page and what it showed you.'),
    ('row', 'pair', '9 / 16', [IMG('lu-stories', 'Luma AI website design, vertical presentation', 'Presentation'), PH('Mobile screens')])],
  ]),

]

ORDER = [c['id'] for c in CASES]
# device screenshots are shown whole, never cropped
CONTAIN = {'pm-phone-pricing', 'la-phone', 'la-ipad', 'lu-stories'}

def esc(t): return html.escape(t, quote=False)

def figure(item, sizes):
    if item[0] == 'img':
        _, name, alt, cap = item
        capt = f'<figcaption>{esc(cap)}</figcaption>' if cap else ''
        fit = ' cs-fig--contain' if name in CONTAIN else ''
        return f'<figure class="cs-fig{fit}"><div class="cs-fig__frame"><pic name="{name}" alt="{html.escape(alt)}" sizes="{sizes}"></div>{capt}</figure>'
    _, label = item
    return f'<figure class="cs-fig cs-fig--ph" data-todo><div class="cs-fig__frame"><span class="cs-ph">Image placeholder<br>{esc(label)}</span></div></figure>'

def block(part):
    kind = part[0]
    if kind == 'p':
        return f'<p>{esc(part[1])}</p>'
    if kind == 'todo':
        return f'<p class="cs-todo" data-todo><span class="cs-todo__tag">Placeholder</span>{esc(part[1])}</p>'
    if kind == 'metrics':
        cells = []
        for value, label in part[1]:
            if value is None:
                cells.append(f'<div data-todo><dt>{esc(label)}</dt><dd>—</dd></div>')
            else:
                cells.append(f'<div><dt>{esc(label)}</dt><dd>{esc(value)}</dd></div>')
        return '<dl class="cs-metrics">' + ''.join(cells) + '</dl>'
    raise ValueError(kind)

def media(part):
    _, layout, ratio, items = part
    sizes = '100vw' if layout == 'wide' else '(min-width: 768px) 50vw, 100vw'
    return f'<div class="cs-row cs-row--{layout}" style="--r: {ratio}">' + ''.join(figure(i, sizes) for i in items) + '</div>'

def dialog(c, k):
    cid = f"case-{c['id']}"
    nxt = CASES[(k + 1) % len(CASES)]
    out = [f'  <dialog class="case" id="{cid}" aria-labelledby="{cid}-title">']
    out.append('    <div class="case__bar grid"><p class="case__brand" role="img" aria-label="Prokhorov®"><span class="logo"><svg class="logo__mark" viewBox="1 0 47 48" aria-hidden="true" focusable="false"><use href="#pk-mark"/></svg><svg class="logo__word" viewBox="54 13 181 22" aria-hidden="true" focusable="false"><use href="#pk-word"/></svg></span></p><button class="case__close" type="button" data-close data-roll>Close</button></div>')
    if c['cover']:
        name, alt = c['cover']
        out.append(f'    <figure class="case__cover" data-case-cover>\n      <pic name="{name}" alt="{html.escape(alt)}" sizes="100vw">\n    </figure>')
    out.append(f'    <header class="grid case__head">\n      <h2 class="case__title" id="{cid}-title" tabindex="-1" autofocus>{c["title"]}</h2>\n      <div class="case__intro">\n        <p class="t-lead">{esc(c["intro"])}</p>\n      </div>\n    </header>')
    # project data
    cells = []
    for key in META_KEYS:
        v = c['meta'].get(key)
        cells.append(f'<div><dt>{key}</dt><dd>{esc(v)}</dd></div>' if v else f'<div data-todo><dt>{key}</dt><dd>—</dd></div>')
    out.append('    <dl class="cs-data">' + ''.join(cells) + '</dl>')
    # the six chapters
    for n, (name, parts) in enumerate(zip(SECTIONS, c['sections']), 1):
        sid = f'{cid}-s{n}'
        text = [p for p in parts if p[0] in ('p', 'todo', 'metrics')]
        rows = [p for p in parts if p[0] == 'row']
        out.append(f'    <section class="cs-sec" aria-labelledby="{sid}">')
        out.append(f'      <div class="cs-sec__text"><h3 class="cs-sec__title" id="{sid}"><span class="cs-sec__no">0{n}</span>{esc(name)}</h3><div class="cs-sec__body">' + ''.join(block(p) for p in text) + '</div></div>')
        for r in rows:
            out.append('      ' + media(r))
        out.append('    </section>')
    out.append(f'    <div class="grid case__next">\n      <p class="case__next-label t-lead">Next project</p>\n      <button class="case__next-link t-display" type="button" data-open-next="case-{nxt["id"]}">{nxt["title"]}</button>\n    </div>')
    out.append('  </dialog>')
    return '\n'.join(out)

s = open(SRC, encoding='utf8').read()
if '<!-- Case studies: six chapters each' in s:
    i = s.index('<!-- Case studies: six chapters each')
    s = s[:i] + s[s.index('  <dialog class="case"', i) + 2:]
start = s.index('  <dialog class="case"')
end = s.rindex('</dialog>') + len('</dialog>')
gen = '<!-- Case studies: six chapters each — Challenge, Research & Strategy, Brand Direction,\n       UX Structure, Visual Language, Final Experience. CONTENT: [data-todo] marks every\n       placeholder (text, image or figure) still to be supplied. -->\n' + '\n\n'.join(dialog(c, k) for k, c in enumerate(CASES))
s = s[:start] + '  ' + gen + s[end:]
open(SRC, 'w', encoding='utf8').write(s)
print('cases', len(CASES), 'todo', s.count('data-todo'), 'pics', s.count('<pic '))
