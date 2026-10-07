Prokhorov® — Design Agent System
================================

This directory contains the design, UX, motion and technical review system used to evolve the Prokhorov® portfolio website.

The system is built around several specialized agents.

Each agent has a specific responsibility and should approach the project from a different perspective.

The purpose is not to generate more work or more complexity.

The purpose is to make better design decisions before implementation and to provide a structured review process throughout the redesign.

* * *

Project
-------

**Prokhorov®**

Personal portfolio of an independent designer specializing in:

* UI/UX

* Web Design

* Product Design

The website itself is part of the portfolio.

It should demonstrate:

* strong visual design

* web design expertise

* product thinking

* interaction design

* typography

* art direction

* motion

* attention to detail

The final website should feel personal, highly considered and technically polished.

* * *

Agent System
============

The system consists of five specialized agents:
    01 Creative Director
            ↓
    02 UX & Interaction Director
            ↓
    03 Motion & Interaction Designer
            ↓
    04 Frontend & Performance Engineer
            ↓
    05 Final Design Critic & Creative QA

Each agent builds on the work of the previous agents.

The agents should not all make independent design decisions.

They operate as a sequence.

* * *

Directory Structure
===================

    /agents/
    │
    ├── README.md
    │
    ├── 01-creative-director.md
    ├── 02-ux-interaction-director.md
    ├── 03-motion-interaction-designer.md
    ├── 04-frontend-performance-engineer.md
    ├── 05-final-design-critic.md
    │
    └── /reports/
        ├── creative-direction.md
        ├── ux-direction.md
        ├── motion-direction.md
        ├── performance-review.md
        └── final-critique.md

Agent instruction files define **how each agent should think and work**.

Report files contain the actual project-specific conclusions produced by each agent.

* * *

Workflow
========

Phase 01 — Creative Direction
-----------------------------

Run:
    01-creative-director.md

The agent studies the existing website and establishes:

* visual direction

* art direction

* typography

* composition

* project presentation

* visual hierarchy

* overall creative concept

Output:
    /reports/creative-direction.md

The Creative Director does not modify the code.

* * *

Phase 02 — UX & Interaction
---------------------------

Run:
    02-ux-interaction-director.md

The agent reads:
    /reports/creative-direction.md

and evaluates the website from a user experience perspective.

It defines:

* information hierarchy

* navigation

* project discovery

* interaction patterns

* scroll experience

* section relationships

* mobile UX

* accessibility considerations

Output:
    /reports/ux-direction.md

The UX Director does not modify the code.

* * *

Phase 03 — Motion & Interaction
-------------------------------

Run:
    03-motion-interaction-designer.md

The agent reads:
    /reports/creative-direction.md
    /reports/ux-direction.md

It defines the motion system.

This includes:

* scroll choreography

* section transitions

* project interactions

* typography motion

* image movement

* cursor interactions

* microinteractions

* page transitions

* easing

* timing

* mobile motion

* reduced-motion behavior

Output:
    /reports/motion-direction.md

The Motion Designer does not modify the code.

* * *

Phase 04 — Frontend & Performance
---------------------------------

Run:
    04-frontend-performance-engineer.md

The agent reads:
    /reports/creative-direction.md
    /reports/ux-direction.md
    /reports/motion-direction.md

It then evaluates the technical feasibility of the planned experience.

It reviews:

* architecture

* components

* CSS

* JavaScript

* animation implementation

* dependencies

* media

* fonts

* responsive behavior

* accessibility

* performance

* browser compatibility

Output:
    /reports/performance-review.md

The engineer does not modify the code during the analysis phase.

* * *

Implementation Phase
====================

After all four planning reports exist, implementation can begin.

The implementation should use the reports as the design and technical source of truth.

The reports are not strict code specifications.

They define intent.

The developer should use judgment when translating them into the existing architecture.

Do not implement every suggestion automatically.

If two recommendations conflict, resolve the conflict based on:

1. user experience

2. visual quality

3. performance

4. maintainability

* * *

Phase 05 — Final Design Critic
==============================

After implementation is complete, run:
    05-final-design-critic.md

The agent reads all previous reports:
    /reports/creative-direction.md
    /reports/ux-direction.md
    /reports/motion-direction.md
    /reports/performance-review.md

It then reviews the actual finished website.

The Final Critic evaluates:

* first impression

* art direction

* typography

* composition

* projects

* UX

* motion

* responsive behavior

* performance

* accessibility

* visual polish

Output:
    /reports/final-critique.md

The final report should produce a **finite list of meaningful improvements**.

It should not restart the entire design process.

* * *

Core Principles
===============

01 — The website is the portfolio
---------------------------------

The website itself should demonstrate the designer's ability.

Do not treat the portfolio as a neutral container for projects.

* * *

02 — Art direction over decoration
----------------------------------

Visual quality should come from:

* composition

* typography

* scale

* imagery

* spacing

* hierarchy

* motion

* interaction

Not from adding random effects.

* * *

03 — Awwwards as a quality benchmark
------------------------------------

Awwwards-level ambition is allowed.

This means:

* sophisticated interactions

* strong art direction

* memorable transitions

* unconventional layouts

* high production quality

It does **not** mean:

* maximum animation

* unnecessary WebGL

* visual distortion everywhere

* excessive effects

* * *

04 — Editorial restraint
------------------------

Use qualities associated with high-end editorial and studio websites:

* confident typography

* strong whitespace

* visual rhythm

* asymmetric composition

* precise details

* strong imagery

* controlled motion

The website should remain coherent.

* * *

05 — Personal identity
----------------------

This is the website of one independent designer.

Do not make it feel like:

* a creative agency

* a design studio

* a SaaS company

* a corporate consultancy

Use singular language.

Keep the personality of Prokhorov® visible.

* * *

06 — Motion has a purpose
-------------------------

Every meaningful animation should have a reason.

Motion can:

* establish hierarchy

* guide attention

* communicate relationships

* create continuity

* reveal information

* create atmosphere

Do not animate elements simply because they can be animated.

* * *

07 — Stillness matters
----------------------

Not everything should move.

A strong motion system needs:
    movement
    ↓
    stillness
    ↓
    movement
    ↓
    visual pause
    ↓
    interaction
    ↓
    major transition

Stillness makes important motion feel more powerful.

* * *

08 — Mobile is a first-class experience
---------------------------------------

Mobile should not be treated as a collapsed desktop version.

Complex desktop compositions may need to be redesigned for mobile.

Motion may need to be reduced or transformed.

* * *

09 — Performance is part of design
----------------------------------

Visual ambition should not come at the cost of:

* slow loading

* janky scrolling

* poor mobile performance

* layout shifts

* broken interactions

A premium website should also feel premium to use.

* * *

10 — Accessibility remains important
------------------------------------

Visual experimentation should coexist with:

* keyboard navigation

* readable typography

* sufficient contrast

* focus states

* semantic HTML

* reduced motion

* appropriate touch targets

* * *

Agent Rules
===========

All agents should follow these rules.

### Inspect before recommending

Never assume the current implementation.

Read the code and understand the existing system first.

### Preserve what works

Do not redesign something simply because it already exists.

### Avoid unnecessary rewrites

Improve the current architecture when possible.

### Do not invent content

Do not invent:

* clients

* projects

* achievements

* testimonials

* statistics

* experience

If content is missing, identify the issue instead.

### Do not optimize away the personality

A portfolio is allowed to be experimental.

Do not turn it into a generic UX-perfect corporate website.

### Do not add complexity without value

Every significant design or technical decision should have a reason.

* * *

Priority System
===============

When evaluating issues, use impact rather than personal preference.

For final QA:

### P0 — Blocking

Broken functionality or severe issue.

### P1 — High Impact

Major issue affecting visual quality, UX or professionalism.

### P2 — Polish

Meaningful refinement.

### P3 — Optional

Nice-to-have improvement.

Do not create large numbers of P0/P1 issues.

* * *

Design Decision Hierarchy
=========================

When different considerations conflict, use this hierarchy:
    1. User experience
    2. Content clarity
    3. Visual hierarchy
    4. Art direction
    5. Interaction quality
    6. Performance
    7. Accessibility
    8. Technical elegance
    9. Decorative effects

This does not mean visual design is secondary.

It means visual experimentation should support the experience rather than undermine it.

* * *

Source of Truth
===============

During the redesign:
    Creative Direction
            ↓
    UX Direction
            ↓
    Motion Direction
            ↓
    Technical Direction
            ↓
    Implementation
            ↓
    Final QA

The reports describe the intended direction.

The actual website remains the final source of truth for implementation details.

If an old report conflicts with the actual project after a deliberate design decision, do not blindly restore the old recommendation.

Update the relevant report if necessary.

* * *

When to Stop
============

Do not continue redesigning indefinitely.

The redesign is considered complete when:

* the visual identity is distinctive

* typography is intentional

* projects are presented strongly

* navigation is intuitive

* motion feels purposeful

* desktop and mobile feel designed

* performance is acceptable

* accessibility issues are addressed

* remaining issues are primarily optional polish

Do not add another animation simply because there is space for one.

Do not add another section simply because another portfolio has one.

Do not continue changing the design after the system has reached coherence.

* * *

Final Objective
===============

The final Prokhorov® website should feel like:

**an independent designer's portfolio with the visual ambition of a high-end digital studio and the personality of a real individual.**

It should be:

**distinctive  
editorial  
precise  
interactive  
confident  
memorable  
highly polished  
technically disciplined**

The website should make the quality of the designer's work evident before the visitor even opens a case study.
