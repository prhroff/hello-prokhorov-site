/* The Archive's contents. One entry per image; the page reads nothing else.

   To add work, add a line:
     { img: 'name', alt: '…', title: 'Project', category: 'Web Concept', year: 2026 }

   img        a name from assets/img/manifest.json (run scripts/build-assets.py
              on the source artwork first: it makes the AVIF/WebP sizes and the
              manifest entry with the image's proportions)
     — or —
   src, w, h  any other file (a GIF, an SVG, an external CDN image) with its
              pixel size, so its space is reserved before it loads
   alt        what the image shows (required: it is also the link's name)
   title, category, year
              optional; shown as the card's caption, "Title - Category".
              Leave all three out and the card has no caption, which suits
              some pieces better.

   group      only for a piece without a category: which group it belongs to
              (otherwise its category decides, see GROUPS below)

   The canvas pins them up in this order from its top-left corner, column by
   column, so put the strongest pieces first. */

/* Four groups of categories. The canvas does not use them at the moment;
   they are kept so the collection can be sorted again (filters, columns). */
export const GROUPS = [
  { id: 'websites', label: 'Websites', categories: ['Web Concept', 'Landing Page', 'Unused Direction'] },
  { id: 'interfaces', label: 'Interfaces', categories: ['Interface', 'Mobile UI', 'Motion Still'] },
  { id: 'brand', label: 'Brand + Print', categories: ['Branding', 'Poster', 'Campaign', 'Type Study'] },
  { id: 'imagery', label: 'Imagery', categories: ['Product Render', 'Image Study', 'Detail Study'] },
];

export const ARCHIVE_ITEMS = [
  { img: 'mo-hero', alt: 'Monolith ONE landing page hero: “Absolute Visual Purity. Uncompromising Sound.”', title: 'Monolith', category: 'Web Concept' },
  { img: 'vh-poster', alt: 'Visual Hunters® poster: website on a monitor over a portrait with a red background', title: 'Visual Hunters®', category: 'Poster' },
  { img: 'lattice-hero', alt: 'Lattice homepage on a laptop inside a server rack', title: 'Lattice', category: 'Web Concept' },
  { img: 'pm-hardware', alt: 'Powermatic® wordmark over dark perforated hardware', title: 'Powermatic®', category: 'Branding' },
  { img: 'mo-knob', alt: 'Monolith ONE knurled volume knob with the ring light on', title: 'Monolith', category: 'Product Render' },
  { img: 'lu-stories', alt: 'Luma AI website design, vertical presentation', title: 'Luma', category: 'Interface' },
  { img: 'co-hero', alt: 'Contour Office© homepage: “Accounting for Companies that Think Ahead”', title: 'Contour Office©', category: 'Landing Page' },
  { img: 'pm-laptop-chair', alt: 'Powermatic® site on a laptop on a person’s lap', title: 'Powermatic®', category: 'Web Concept' },
  { img: 'mo-tower-dark', alt: 'Monolith ONE tower in a dark room', group: 'imagery' },
  { img: 'vh-site', alt: 'Visual Hunters® homepage with 3D cards between large type', title: 'Visual Hunters®', category: 'Web Concept' },
  { img: 'la-safari', alt: 'Lattice homepage in a dark browser window', title: 'Lattice', category: 'Interface' },
  { img: 'pm-loader', alt: 'Powermatic® page loader counting on a dark screen', title: 'Powermatic®', category: 'Motion Still' },
  { img: 'monolith-render', alt: 'Monolith audio unit rendered in dark anodised aluminium with a knurled volume knob', title: 'Monolith', category: 'Product Render' },
  { img: 'vh-monitor', alt: 'Visual Hunters® website design on a monitor, presentation poster', title: 'Visual Hunters®', category: 'Poster' },
  { img: 'lu-display', alt: 'Luma landing page on a studio display', title: 'Luma', category: 'Web Concept' },
  { img: 'pm-tshirt', alt: 'Powermatic® logo on a black T-shirt', group: 'brand' },
  { img: 'la-pedestal', alt: 'Lattice homepage on a laptop on a stone pedestal', title: 'Lattice', category: 'Web Concept' },
  { img: 'co-manifesto', alt: 'Close-up of the Contour Office© design manifesto text', title: 'Contour Office©', category: 'Type Study' },
  { img: 'mo-poster', alt: 'Monolith ONE poster with the knurled knob in close-up', title: 'Monolith', category: 'Poster' },
  { img: 'pm-phone-pricing', alt: 'Powermatic® engagement models on a phone', title: 'Powermatic®', category: 'Mobile UI' },
  { img: 'vh-alt', alt: 'Alternative Visual Hunters® hero: “Design Studio focused on Digital Products, Interfaces and Branding Systems”', title: 'Visual Hunters®', category: 'Unused Direction' },
  { img: 'mo-stone', alt: 'Monolith ONE on a stone floor', title: 'Monolith', category: 'Image Study' },
  { img: 'pm-hero', alt: 'Powermatic® homepage hero with a portrait and the line “Trusted Technology Partner for Growing Businesses”', title: 'Powermatic®', category: 'Landing Page' },
  { img: 'la-phone', alt: 'Lattice homepage on a phone', title: 'Lattice', category: 'Mobile UI' },
  { img: 'contour-laptop', alt: 'Contour Office© website on a laptop in a dark room', title: 'Contour Office©', category: 'Web Concept' },
  { img: 'vh-teaser', alt: 'Visual Hunters® “Coming soon” teaser poster', group: 'brand' },
  { img: 'mo-close', alt: 'Close-up of the Monolith engraving and the shadow gap', title: 'Monolith', category: 'Detail Study' },
  { img: 'pm-cases', alt: 'Powermatic® case studies grid on a dark background', title: 'Powermatic®', category: 'Interface' },
  { img: 'la-rack', alt: 'Lattice website on a laptop in a server rack', title: 'Lattice', category: 'Web Concept' },
  { img: 'vh-logo', alt: 'Visual Hunters® logotype on white', title: 'Visual Hunters®', category: 'Branding' },
  { img: 'lu-page', alt: 'Luma landing page: “Prioritized opportunities from your incoming flow”', title: 'Luma', category: 'Landing Page' },
  { img: 'pm-macbook', alt: 'Powermatic® site on a laptop with the full-screen menu open', title: 'Powermatic®', category: 'Interface' },
  { img: 'monolith-tower', alt: 'Monolith ONE landing page: the vertical speaker under a single beam of light', title: 'Monolith', category: 'Landing Page' },
  { img: 'contour-cover', alt: 'Contour Office© homepage close-up', title: 'Contour Office©', category: 'Interface' },
  { img: 'powermatic-keys', alt: 'Powermatic® campaign visual: keys on a red and black diagonal pattern', title: 'Powermatic®', category: 'Campaign' },
  { img: 'la-image', alt: 'Lattice homepage on a laptop: “On-prem that operates like the public cloud”', title: 'Lattice', category: 'Web Concept' },
  { img: 'vh-office', alt: 'Visual Hunters® on a laptop in an office', group: 'websites' },
  { img: 'mo-tower-light', alt: 'Monolith ONE tower lit from the side', title: 'Monolith', category: 'Image Study' },
  { img: 'pm-about', alt: 'Powermatic® about section with key figures', title: 'Powermatic®', category: 'Interface' },
  { img: 'luma-screen', alt: 'Luma product landing page', title: 'Luma', category: 'Landing Page' },
  { img: 'vh-display', alt: 'Visual Hunters® landing page on a studio display', title: 'Visual Hunters®', category: 'Web Concept' },
  { img: 'pm-ipad-stand', alt: 'Powermatic® site on a tablet on a stand in a dark room', title: 'Powermatic®', category: 'Web Concept' },
  { img: 'mo-front', alt: 'Monolith ONE back panel with the recessed connector bay', title: 'Monolith', category: 'Product Render' },
  { img: 'lattice-plinth', alt: 'Lattice homepage on a laptop resting on a stone plinth', title: 'Lattice', category: 'Web Concept' },
  { img: 'pm-engagement', alt: 'Powermatic® engagement models page with three pricing options', title: 'Powermatic®', category: 'Interface' },
  { img: 'vh-shelf', alt: 'Visual Hunters® on a laptop', title: 'Visual Hunters®', category: 'Web Concept' },
  { img: 'monolith-detail', alt: 'Close-up of the engraved Monolith aluminium band and fabric grille', title: 'Monolith', category: 'Detail Study' },
  { img: 'la-ipad', alt: 'Lattice on a tablet', title: 'Lattice', category: 'Web Concept' },
  { img: 'pm-hero-red', alt: 'Powermatic® homepage hero, red variant', title: 'Powermatic®', category: 'Unused Direction' },
  { img: 'powermatic-tablet', alt: 'Powermatic® website shown on a tablet resting on a rust velvet chair', title: 'Powermatic®', category: 'Web Concept' },
  { img: 'prokhorov-site', alt: 'Prokhorov® portfolio website, full page', title: 'Prokhorov®', category: 'Web Concept' },
  { img: 'pm-blog', alt: 'Powermatic® blog listing, “Perspectives on technology”', title: 'Powermatic®', category: 'Interface' },
  { img: 'service-landing', alt: 'Landing page design, full page', category: 'Landing Page' },
  { img: 'pm-contact', alt: 'Powermatic® contact page with the email address set large', title: 'Powermatic®', category: 'Interface' },
  { img: 'service-framer', alt: 'Framer website design, full page', category: 'Web Concept' },
  { img: 'powermatic-phone', alt: 'Powermatic® on a phone', title: 'Powermatic®', category: 'Mobile UI' },
];
