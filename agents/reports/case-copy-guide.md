# Case study copy guide

Decided 2026-10-07 (ART-17). **The case page keeps its visual structure as it is**: the cover,
the numbered parts `(01) … (0n)` with the label on the left and the text on the right,
pictures before their text, the Design gallery, and the layout's close. The case template is
`src/pages/work/_template.html`.

**The texts follow the portfolios studied on Foliobin**: how independent web designers and
developers write website case studies. Those portfolios are listed under Sources at the end.

## The rule that comes first

Only real facts from Artem. Never invent a problem, a decision, a metric, a client quote or an
outcome to make a case look complete. When something isn't known, leave it out. For a concept,
say what you would test next instead of claiming a result.

## How the text maps onto the existing blocks

| Part (existing block) | Text | Length |
|---|---|---|
| Cover (`.case__title`, `.case__meta`) | unchanged: title + three short facts | — |
| (01) Project Overview (`.cs-overview`) | `.cs-head`: the project's own line (optional). `.cs-lead`: who the client is, what the site is, what I did ("I designed the site and built it"). For a concept: **Concept**, and the question it answers | 1–2 sentences |
| (Details) (`.cs-facts`) | Client · Industry · Role · Scope · Platform · Year, plus where known: **Type** (Client / Concept), **Live website** (link), **Outcome** (one line, e.g. "Launched in 2025") | one line each |
| (02) Challenge (`.cs-chapter`, text; a "before" picture if there is one) | what wasn't working or what was needed, and for whom | 2 short paragraphs |
| (03) Structure (`.cs-chapter`) | what the home page leads with and why; the paths for different visitors; one decision written as **X vs Y — chose Y, because …** | 1–2 paragraphs |
| (04) Visual Direction (`.cs-chapter`) | where the references came from and how they became a system: type, colour, grid, imagery | 1–2 paragraphs |
| (05) Motion & Build (`.cs-chapter`) | what moves and why (preloader, transitions, hovers); what it's built with; what the client can edit themselves | 1–2 paragraphs |
| (06) Design (`.cs-design`) | gallery: the pictures with short captions, unchanged | captions only |
| (07) Outcome (`.cs-chapter`, text; `.cs-metrics` only for real numbers) | client site: what launched and what changed, facts only (a link, a review, an award). Concept: **What I'd test next** | 1 paragraph |

A part with nothing real to say is left out, and the numbering closes up. The order may change
when a case reads better another way (e.g. Visual Direction before Structure for a
typography-led concept).

## Writing rules taken from the examples

- **One idea per paragraph**, short sentences, first person ("I designed …", "I chose …").
- **Say why, not only what.** "The homepage puts featured projects first, so visitors reach the
  strongest work immediately" rather than "Homepage with projects".
- **Decisions with their trade-off.** "Classic header vs structured menu — I chose the menu,
  because the offering spans six sections."
- **Concrete nouns over adjectives.** Name the typeface, the palette, the reference, the page,
  not "modern", "clean", "premium".
- **Honest framing of concepts and unfinished work.** Mark concepts as concepts. When there are
  no numbers, an outcome can still be stated plainly ("Launched", "Handed off to the client's
  team") or replaced by next steps.
- **Total length:** about 450–900 words per case, in short blocks between pictures.
- Captions stay short labels ("Homepage Hero", "On Mobile").

## What to ask Artem for each case

1. The task or problem (for a concept: why this concept, what question it answers).
2. Who the site is for.
3. One or two decisions he's proud of, and what he decided against.
4. Where the visual references came from.
5. What is animated and built, and how.
6. Client sites: is it live (link), is there a review, an award, anything measurable?

## Sources (Foliobin, read 2026-10-07)

- **Ann Bitner**, Senior UX/UI & Web Designer (Framer): short client cases. Intro, live
  website, Services, then Challenge → Approach (P.1, P.2) → Outcome.
  foliobin.com/portfolio/ann-bitner
- **Ekaterina Pykhova**, Product Designer (Framer Expert): Outcome / Scope / Role / Timeline up
  front; honest framing ("No client, no brief", "Development stopped").
  foliobin.com/portfolio/ekaterina-pykhova
- **Evgenii Chekov**, B2B web redesign: product context, role, decisions as hypothesis →
  decision → trade-off. foliobin.com/portfolio/evgenii-chekov
- Supporting excerpts: Karina Andreadi (concept → chosen direction), Vlad Kanygin (website
  goals), Naufal (stating that the impact couldn't be measured), Finn Taylor (CONCEPT / CLIENT
  labels).
