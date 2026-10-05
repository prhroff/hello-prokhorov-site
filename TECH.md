Prokhorov® — Technical Specification
====================================

This document defines the technical constraints, implementation principles and quality requirements for the Prokhorov® portfolio website.

It is a technical source of truth for implementation.

The website should be visually ambitious and interaction-rich, while remaining fast, maintainable, accessible and reliable.

Do not sacrifice technical quality for visual effects.

* * *

1. Project Context
   ===================

**Project:** Prokhorov® Portfolio

**Owner:** Artem Prokhorov

**Type:** Personal portfolio website

**Primary purpose:**

Present Prokhorov® as an independent designer specializing in UI/UX, Web Design and Product Design.

The website itself is also a demonstration of web design, interaction design, typography, motion and frontend execution.

The implementation should therefore be treated as a portfolio piece, not a generic marketing website.

* * *

2. Core Technical Principle
   ============================

The target is:

> Experimental on the surface. Disciplined underneath.

The website may use sophisticated:

* animations

* scroll interactions

* transitions

* typography effects

* image transformations

* pinned sections

* cursor interactions

* responsive compositions

But the underlying implementation should remain:

* understandable

* maintainable

* performant

* responsive

* accessible

* resilient

Do not introduce technical complexity simply to achieve visual novelty.

* * *

3. Existing Project First
   ==========================

Before making architectural decisions, inspect the existing project.

Determine:

* framework

* build tool

* package manager

* entry points

* routing

* component structure

* styling approach

* asset structure

* font loading

* animation libraries

* utility libraries

* data/content architecture

* deployment configuration

Do not replace the existing stack without a clear technical reason.

Do not rebuild the application from scratch simply because another stack may be preferable.

The existing implementation is the starting point.

* * *

4. Architecture
   ================

Prefer a clear component-based architecture.

Components should be divided by meaningful responsibility rather than arbitrary visual fragments.

Example:
    src/
    ├── components/
    │   ├── navigation/
    │   ├── hero/
    │   ├── projects/
    │   ├── about/
    │   ├── services/
    │   ├── process/
    │   ├── clients/
    │   ├── faq/
    │   └── contact/
    │
    ├── components/ui/
    ├── data/
    ├── hooks/
    ├── lib/
    ├── styles/
    └── assets/

This is an example, not a mandatory structure.

Follow the existing project's conventions when they are already reasonable.

Avoid creating unnecessary abstractions.

* * *

5. Component Principles
   ========================

Components should:

* have a clear responsibility

* be reusable when reuse is meaningful

* avoid excessive prop complexity

* avoid deeply nested conditional logic

* avoid duplicated implementation

* remain readable

Do not create a component for every `<div>`.

Do not create abstractions solely to make the code appear more sophisticated.

Prefer simple, explicit code over unnecessary architectural patterns.

* * *

6. Styling
   ===========

The styling system should remain consistent across the entire website.

Use the project's existing styling approach unless there is a strong reason to change it.

Maintain clear control over:

* typography

* spacing

* layout

* responsive behavior

* colors

* borders

* radius

* transitions

* states

Avoid scattered one-off values when a value represents a repeated design decision.

Where appropriate, use CSS variables or existing design tokens.

* * *

7. Typography
   ==============

Primary typefaces:

**Instrument Serif**

**Inter**

Typography is a major part of the visual identity.

The implementation must preserve:

* font hierarchy

* intended weights

* line heights

* letter spacing

* responsive scaling

* text wrapping

* editorial composition

Do not replace the selected fonts with system fonts unless required as a fallback.

Fonts should be loaded efficiently.

Avoid invisible text caused by incorrect font loading strategies.

Avoid excessive use of ultra-light weights.

Do not introduce monospace typography unless specifically justified by the design direction.

* * *

8. Responsive Design
   =====================

The website must be intentionally designed across the full range of viewport sizes.

Primary testing widths:
    375px
    390px
    430px
    768px
    1024px
    1280px
    1440px
    1920px

These are testing targets, not necessarily mandatory breakpoints.

Do not design only for:

* desktop

* one laptop resolution

* one iPhone size

Responsive behavior should be fluid wherever appropriate.

* * *

9. Mobile
   ==========

Mobile is not a collapsed desktop layout.

Evaluate independently:

* composition

* typography

* navigation

* project presentation

* spacing

* image crops

* motion

* interaction

* section heights

* sticky elements

* touch targets

Desktop interactions that do not translate naturally to touch should be adapted or removed.

Do not preserve a desktop effect on mobile simply for consistency.

* * *

10. Layout
    ==========

Prefer modern CSS layout systems:

* Grid

* Flexbox

* sticky positioning

* container queries where useful

* fluid sizing

* `clamp()`

* responsive aspect ratios

Avoid unnecessary absolute positioning.

Absolute positioning is acceptable for deliberate art-directed compositions when it does not compromise responsiveness.

Do not build the entire page as one large absolutely positioned canvas.

* * *

11. Animation Architecture
    ==========================

Animation should be implemented according to the motion direction report.

Preferred implementation hierarchy:
    1. CSS transitions / animations
    2. IntersectionObserver
    3. Web Animations API
    4. Existing project animation utilities
    5. Dedicated animation library when justified

Use GSAP or another large animation dependency only when the required interaction genuinely benefits from it.

Do not introduce an animation library for simple fades, transforms or reveals that CSS can handle.

* * *

12. Animation Performance
    =========================

Prefer GPU-friendly transforms:
    transform
    opacity

Avoid repeatedly animating expensive layout properties such as:
    width
    height
    top
    left
    margin
    padding

unless there is a specific reason.

Avoid unnecessary layout thrashing.

Avoid excessive `requestAnimationFrame` loops.

Scroll-linked interactions must remain smooth.

Animations should not block interaction or cause noticeable frame drops.

* * *

13. Scroll Experience
    =====================

The website may use:

* sticky sections

* pinned content

* scroll-linked transformations

* progressive reveals

* image scaling

* horizontal movement

* layered compositions

* overlapping sections

But scrolling must remain natural.

Avoid:

* hijacking native scroll unnecessarily

* excessive scroll snapping

* forced delays

* scroll-jacking

* interactions that make users feel trapped inside an animation

The user should always remain in control of navigation.

* * *

14. Cursor & Pointer Interactions
    =================================

Custom cursor interactions are allowed where they improve the experience.

Examples:

* project previews

* contextual labels

* magnetic links

* image previews

* directional indicators

They must never replace essential information.

Do not hide the native cursor globally without a clear reason.

Disable or adapt pointer-specific interactions for touch devices.

* * *

15. Images
    ==========

Use modern image formats where supported:
    AVIF
    WebP

Provide appropriate fallbacks when required.

Images should have:

* correct dimensions

* predictable aspect ratios

* appropriate compression

* meaningful loading strategy

Use:

* `srcset`

* `sizes`

* responsive image rendering

where appropriate.

Avoid loading unnecessarily large images for small viewport sizes.

* * *

16. Image Loading
    =================

Use loading strategies based on importance.

Hero / above-the-fold imagery:
    prioritize loading

Below-the-fold imagery:
    lazy load

Avoid lazy-loading critical visual content.

Avoid eagerly loading the entire project archive.

Prevent layout shifts by reserving image dimensions/aspect ratios before the image loads.

* * *

17. Video
    =========

Video may be used for:

* Hero

* project previews

* case study material

* visual transitions

Video should be optimized for the actual experience.

For background video:
    muted
    autoplay
    playsinline
    loop

where appropriate.

Provide:

* poster image

* mobile fallback where necessary

* reduced-motion fallback

* appropriate compression

* responsive sources when useful

Do not make the website dependent on video for basic comprehension.

If video loading becomes expensive, prioritize the experience over video fidelity.

* * *

18. Fonts
    =========

Fonts should be:

* locally hosted when possible

* properly subset when possible

* loaded with appropriate `font-display`

* limited to required weights/styles

Do not load unnecessary font weights.

Typography should not cause large layout shifts.

* * *

19. Accessibility
    =================

The website must support:

* keyboard navigation

* visible focus states

* semantic HTML

* logical heading hierarchy

* accessible links

* accessible buttons

* meaningful image alt text

* sufficient contrast

* reduced-motion preferences

Interactive elements must remain understandable without relying exclusively on:

* hover

* cursor position

* animation

* color

* * *

20. Reduced Motion
    ==================

Respect:
    prefers-reduced-motion

When reduced motion is enabled:

* remove or simplify major transitions

* reduce parallax

* disable unnecessary scroll-linked movement

* simplify cursor effects

* avoid large-scale transformations

The visual hierarchy should remain intact without animation.

Motion should enhance the design, not be required to understand it.

* * *

21. Performance Targets
    =======================

Performance is part of the design quality.

Target:

* fast initial render

* low layout shift

* responsive interaction

* smooth scrolling

* optimized assets

* minimal JavaScript where possible

Primary Core Web Vitals:
    LCP — good
    INP — good
    CLS — good

Do not optimize only for Lighthouse scores.

Real-world responsiveness is more important than achieving an artificial score through superficial optimizations.

* * *

22. JavaScript
    ==============

Keep client-side JavaScript intentional.

Avoid shipping JavaScript for interactions that can be handled with CSS.

Do not create global state unless required.

Avoid unnecessary event listeners.

Clean up:

* observers

* event listeners

* animation loops

* timers

* media listeners

when components unmount.

* * *

23. Dependencies
    ================

Before adding a dependency, ask:

1. Is it actually necessary?

2. Can the existing stack solve the problem?

3. Can CSS or native browser APIs solve it?

4. What is the bundle impact?

5. Will it increase maintenance complexity?

6. Is the dependency actively maintained?

Do not install libraries simply because they are popular in creative development.

* * *

24. Browser Support
    ===================

Primary browsers:

* Chrome

* Safari

* Firefox

* Edge

Pay particular attention to Safari.

Test:

* sticky positioning

* viewport units

* mobile viewport behavior

* video autoplay

* backdrop effects

* masks

* filters

* font rendering

* scroll-linked animation

* touch interactions

Do not rely on Chrome-only behavior.

* * *

25. Touch Devices
    =================

Touch devices must not depend on:

* hover

* cursor movement

* magnetic effects

* precise pointer positioning

Touch interactions should remain:

* obvious

* responsive

* comfortable

* predictable

Avoid tiny interactive areas.

* * *

26. SEO
    =======

The site should maintain a technically sound SEO foundation.

Implement:

* meaningful page title

* meta description

* semantic HTML

* correct heading structure

* canonical URL where appropriate

* Open Graph metadata

* descriptive image metadata where useful

* sitemap

* robots configuration

Do not add SEO content that compromises the visual or editorial quality of the site.

* * *

27. Deployment
    ==============

The production site is:
    https://helloprokhorov.com

The implementation must remain compatible with the existing deployment environment.

Before changing deployment configuration:

* inspect the current setup

* understand the hosting flow

* preserve working DNS/deployment configuration

* avoid unnecessary infrastructure changes

* * *

28. Security
    ============

Do not expose:

* API keys

* private tokens

* credentials

* private endpoints

* sensitive environment variables

Use environment variables for secrets.

Never commit secrets to the repository.

Review external scripts and dependencies before introducing them.

* * *

29. Code Quality
    ================

Production code should be:

* readable

* predictable

* maintainable

* consistently formatted

* free of obvious dead code

* free of unnecessary duplication

Do not leave temporary debugging code in production.

Do not leave unused dependencies after experimentation.

Do not leave multiple competing implementations of the same feature.

* * *

30. Technical Decision Making
    =============================

When several implementation approaches are possible, prefer the simplest solution that can support the intended experience.

Decision priority:
    User experience
    ↓
    Visual quality
    ↓
    Performance
    ↓
    Accessibility
    ↓
    Maintainability
    ↓
    Implementation simplicity

Do not sacrifice a meaningful visual interaction solely because it is technically more difficult.

Do not introduce significant technical complexity for a minor visual improvement.

* * *

31. Implementation Order
    ========================

When implementation begins, follow approximately this order:
    01. Existing architecture review
    02. Content structure
    03. Global typography
    04. Global layout system
    05. Navigation
    06. Hero
    07. Projects
    08. Main sections
    09. Responsive layouts
    10. Motion system
    11. Microinteractions
    12. Media optimization
    13. Accessibility
    14. Performance optimization
    15. Browser testing
    16. Final QA

The exact order may change depending on the existing codebase.

* * *

32. Testing
    ===========

Test at minimum:

### Desktop

    1280
    1440
    1920

### Mobile

    375
    390
    430

### Browsers

    Chrome
    Safari
    Firefox

### Conditions

    Fast connection
    Slow connection
    Reduced motion
    Touch input
    Keyboard navigation
    No hover
    Large viewport
    Small viewport

* * *

33. Technical Risk Levels
    =========================

Use the following classification when reviewing implementation decisions.

### Low

Minimal impact.

Easy to implement or revert.

### Medium

Requires meaningful code changes or introduces additional complexity.

### High

Potentially affects:

* architecture

* performance

* browser compatibility

* accessibility

* deployment

* maintainability

High-risk changes require a clear reason.

* * *

34. What Not To Do
    ==================

Do not:

* rewrite the stack without evidence

* install unnecessary libraries

* add GSAP automatically

* build everything with WebGL

* create an SPA architecture unnecessarily

* overuse absolute positioning

* hijack scrolling

* make every element animated

* load huge images

* autoplay heavy video without optimization

* ignore Safari

* ignore mobile

* ignore reduced motion

* optimize only for Lighthouse

* introduce technical complexity for visual novelty

* remove existing functionality without checking its purpose

* * *

35. Definition of Done
    ======================

The website is technically ready when:

* the intended visual direction is implemented

* desktop and mobile layouts are stable

* animations are smooth

* interactions are reliable

* images and video are optimized

* fonts load correctly

* there are no major layout shifts

* keyboard navigation works

* reduced motion is supported

* major browsers are tested

* there are no obvious console errors

* unnecessary dependencies are removed

* no secrets are exposed

* production build completes successfully

* deployment works correctly

The final implementation should feel technically invisible.

Users should experience the design, not the engineering underneath it.

* * *

Final Technical Principle
=========================

The Prokhorov® website should push the boundaries of visual and interaction design **without pushing the technical system into unnecessary complexity**.

The goal is not:

> The most technically complex portfolio possible.

The goal is:

> The most convincing combination of art direction, interaction, performance and technical discipline that the project can support.
