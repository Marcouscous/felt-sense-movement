# Felt Sense Movement — Project Guide

A plain HTML/CSS business landing page for a somatic movement practice. No build tools, no frameworks, no preprocessors — just files the browser loads directly.

**Figma source:** https://www.figma.com/design/pjUfmO715m9Wh52QWCdjlS/Felt-Sense-Movement-Website?node-id=1-2
- Desktop frame: node `1:154` — 1440×3000px
- Mobile frame: node `1:163` — 390×2000px (iPhone 13 & 14)

**Source of truth — mobile layout:** `index.html` (with its mobile CSS in `style.css`) is the visual reference for mobile patterns, spacing, and component style. Any page without a Figma node (see Page Inventory) should match the look and feel of `index.html` at `≤ 767px`.

**No Figma source for `events.html`:** The all-events page is designed from prompts. Use `index.html` mobile layout as the visual reference for typography, spacing, card style, button style, and background SVGs.

---

## Folder Structure

```
felt-sense-movement/
├── index.html                          # Home / landing page
├── about.html                          # About the practitioner
├── blog.html                           # Blog listing page
├── past-events.html                    # Archive of past events
├── style.css                           # Single global stylesheet
├── calendar.js                         # Event calendar logic (deferred — see JS policy)
├── events.json                         # Event data consumed by calendar.js
├── offerings/
│   ├── kinetic-waves.html              # Offering detail page
│   ├── the-overscore.html              # Offering detail page
│   ├── resonance-response.html         # Offering detail page
│   └── felt-sense-fall-intensive.html  # Offering detail page
└── assets/
    ├── logo.png                        # Custom hand-drawn logo (navbar, top-left)
    ├── background.svg                  # Multi-color fluid wave vector (purple, blue, cyan, yellow/cream)
    └── dancers.png                     # Transparent-background PNG of dancing figures
```

---

## Font

- **JetBrains Mono** — the sole typeface for all text, headings, and UI elements.
- Load via Google Fonts `<link>` in the `<head>` of every HTML page:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
  ```
- Apply globally in CSS: `font-family: var(--font-mono);` on `body`.
- Do not use any other typeface.

---

## Custom Assets

| File | Description |
|------|-------------|
| `assets/images/FSM-logo.png` | Custom hand-drawn logo. Used as `<img>` top-left in navbar. `alt="Felt Sense Movement logo"`. |
| `assets/background.svg` | Multi-color fluid wave vector (purple, blue, cyan, yellow/cream). Referenced as `<img>` or inline SVG — confirm which preserves colors once the file exists. `width: 100%` for responsive scaling. Positioned behind all content via `z-index`. Spans vertically from inside the navbar through the carousel, calendar, and dancer sections. |
| `assets/vectors/backgrounds/dancers-img.png` | Transparent-background PNG of dancing figures. Positioned on the right side of the layout, overlapping the background SVG. Scale responsively — no fixed pixel dimensions. |

---

## Coding Conventions

### HTML
- **Semantic HTML only.** Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, etc. No `<div>` or `<span>` where a semantic element fits.
- **No inline styles.** All visual styling belongs in `style.css` via classes.
- **No inline event handlers.** No `onclick`, `onload`, etc. in markup.
- Each page links to `style.css` (root-relative from sub-pages: `../style.css`).
- Offering pages in `offerings/` must reference assets and styles with `../` prefixes.

### CSS
- **Single stylesheet:** `style.css` at the project root.
- **CSS custom properties for everything.** Colors, spacing, typography, border-radius, transitions — all defined as variables on `:root`. No magic numbers scattered through rules.
- **True mobile-first.** Base styles are written for mobile (< 768px). Desktop overrides go inside `@media (min-width: 1280px)`. A tablet breakpoint at `768px` may be used if needed.
- Breakpoints:
  - Mobile base: `< 768px`
  - Tablet (if needed): `min-width: 768px`
  - Desktop: `min-width: 1280px`
- **No `!important`.** Fix specificity instead.
- Property order within a rule: box model → positioning → typography → visual → transitions.

Starter token scaffold (fill in values as the design is established):

```css
:root {
  /* ── Colors ─────────────────────────────────────── */
  --color-bg:                   #ffffff;   /* page background */
  --color-surface:              #ffffff;   /* dropdown item bg, card bg */
  --color-text:                 #000000;   /* all text */
  --color-border:               #000000;   /* all borders */
  --color-accent-light:         #f0e5ff;   /* Learn More hover (desktop), submit/join buttons */
  --color-save-event-bg:        #fff9dc;   /* Save Event button — all screen sizes */
  --color-learn-more-hover:     #f0e5ff;   /* Learn More button hover fill (desktop only) */
  --color-carousel-placeholder: #e3e3e3;   /* carousel slide placeholder bg */

  /* ── Typography ──────────────────────────────────── */
  --font-mono:           'JetBrains Mono', monospace;  /* sole typeface */
  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-size-xs:        0.75rem;    /* 12px — location text, save event label */
  --font-size-sm:        0.875rem;   /* 14px — event day number, learn more text */
  --font-size-base:      1rem;       /* 16px — event title, button labels, mobile nav links */
  --font-size-contact:   0.9375rem;  /* 15px — contact section labels (email, telegram, instagram) */
  --font-size-lg:        1.25rem;    /* 20px — section headings, desktop nav brand + links, dropdown items */

  /* ── Spacing ─────────────────────────────────────── */
  --space-1:   0.25rem;    /*  4px */
  --space-2:   0.5rem;     /*  8px */
  --space-2-5: 0.625rem;   /* 10px — navbar padding, logo group padding */
  --space-3:   0.75rem;    /* 12px */
  --space-4:   1rem;       /* 16px */
  --space-5:   1.25rem;    /* 20px — event card gap desktop, calendar scroll padding */
  --space-6:   1.5rem;     /* 24px */
  --space-8:   2rem;       /* 32px */
  --space-9:   2.1875rem;  /* 35px — contact section row gap */
  --space-10:  2.5rem;     /* 40px */
  --space-12:  3rem;       /* 48px */
  --space-16:  4rem;       /* 64px */
  --space-20:  5rem;       /* 80px — desktop links group right padding */

  /* ── Navbar ───────────────────────────────────────── */
  --nav-padding:    0.9375rem;                    /* 15px — all sides mobile; top/left/bottom desktop */
  --nav-pad-right:  3.125rem;                    /* 50px — desktop outer right padding */
  --nav-logo:       2.6875rem;                   /* 43px — mobile logo size */
  --nav-logo-lg:    4.375rem;                    /* 70px — desktop logo size */
  --nav-height:     5.625rem;                    /* 90px — desktop brand + links group height */
  --nav-links-gap:  clamp(7.5rem, 11vw, 10.3125rem); /* fluid 120px→165px gap between About/Offerings/Blog */

  /* ── Border widths ───────────────────────────────── */
  --border-width:       1px;   /* buttons, inputs, scrollbar container */
  --border-width-thick: 2px;   /* calendar container border, event day-container box */

  /* ── Border radii ────────────────────────────────── */
  --radius-xs: 2px;    /* learn more button */
  --radius-sm: 3px;    /* save event button */
  --radius-md: 4px;    /* dropdown menu items */
  --radius-lg: 5px;    /* day-container box, input field, submit/join buttons */
  --radius-xl: 10px;   /* calendar container border, scrollbar track */

  /* ── Z-index layers ──────────────────────────────── */
  --z-background: -1;   /* background SVG */
  --z-content:     1;   /* page content */
  --z-nav:        10;   /* navbar */
  --z-dropdown:   20;   /* offerings dropdown */

  /* ── Transitions ─────────────────────────────────── */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

### JavaScript
- **No JS until the static HTML/CSS layout for that section is confirmed working.**
- `calendar.js` exists but is **not linked from any page yet.** Add the `<script>` tag only after the events calendar section layout is stable.
- `calendar.js` has two known bugs (missing opening `<a` tags in its innerHTML template, lines ~37 and ~54) — fix before enabling.
- The carousel requires JS for slide transitions — defer until the static slide structure is confirmed.
- When JS is added, load it as a module (`<script type="module" src="calendar.js"></script>`) at the bottom of `<body>`, or with `defer`.
- All DOM manipulation goes in `.js` files, never inline.

---

## Page Sections — Build Order

Build each section **desktop + mobile simultaneously** before moving to the next. True mobile-first: base styles are mobile, desktop overrides at `min-width: 1280px`.

| Order | Section | JS required? |
|-------|---------|--------------|
| 1 | **Navbar** | No (dropdown is CSS-only) |
| 2 | **Background SVG** | No |
| 3 | **Carousel** | Deferred — static layout first |
| 4 | **Events Calendar** | Deferred — static layout first |
| 5 | **Dancer Image** | No |
| 6 | **Contact Section** | No |

---

## Section Specs

### Navbar

**Desktop** (node `I92:224;1:99`)
- `<header>` wrapping `<nav>`; padding: 15px all sides
- **Left group** (`logo-group`): logo + brand name; 355px wide, 90px tall; inner padding 10px/40px/10px
  - Logo `<img>`: 70×70px
  - Brand name: `var(--font-size-lg)` / 20px, `var(--font-weight-regular)`
- **Right group** (`navbar-pages-group`): About, Offerings, Blog; 565px wide, 90px tall; font 20px regular
- Nav link hover: `text-decoration: underline`
- **Offerings dropdown** (`dropdown-menu`): revealed on hover via CSS (`:hover` + `visibility`/`opacity`); `z-index: var(--z-dropdown)`
  - All items: white background (`var(--color-surface)`), `border-radius: var(--radius-md)` (4px), font 20px regular
  - Kinetic Waves → `offerings/kinetic-waves.html`
  - The Overscore → `offerings/the-overscore.html`
  - Resonance & Response → `offerings/resonance-response.html`
  - Felt Sense Fall Intensive → `offerings/felt-sense-fall-intensive.html`
  - Past Events → `past-events.html`
- Dropdown items: underline on hover (the underline visible beneath "Resonance & Response" in Figma is the hover state being shown, not a decorative separator)

**Mobile** (node `I108:301;1:122`)
- Stacked layout; outer padding 15px
- Logo: 43×43px; brand name: 16px regular; nav links: 16px regular (About, Offerings, Blog inline)
- Dropdown items: 16px regular, same white background + 4px radius; underline on hover (same interaction as desktop)

### Background SVG (`assets/background.svg`)
- Multi-color fluid wave vector: purple, blue, cyan, yellow/cream
- Desktop: 1440×1100px natural size, overlapping the top of the page
- Mobile: two instances — first at top (~390×629px viewbox), second mid-page for the dancer/calendar area
- `position: absolute` within a positioned ancestor; `z-index: var(--z-background)`
- `width: 100%` — scales with viewport; height from natural aspect ratio
- Reference as `<img src="assets/background.svg" alt="">` — confirm once asset exists whether `<img>` or inline SVG better preserves the colors

### Carousel

**Desktop** (node `31:740`)
- Slides: 350×350px each; gap between slides: 40px; 9 total instances in Figma (only 3 are active/real)
- Navigation dots: 3 dots, each 15px diameter; container 98×27px; positioned below slides
- Left/right arrow controls visible in Figma (nodes `134:177`, `134:183` — 47×47px and 41×41px icon frames)
- **Static first:** all slide structures present in HTML, only first slide visible via CSS; no JS yet
- Wire up JS transitions only after static structure is confirmed

**Mobile** (node `103:399`)
- Slides: 320×320px each; gap: 10px; 5 instances in Figma
- Navigation dots: 5 dots (15px each); container 173×31px

### Events Calendar

**Desktop** (node `31:691`)
- Container: 543px wide, positioned left-of-center on the page
- Heading "Upcoming Events": `var(--font-size-lg)` / 20px medium
- Outer border box: `border: var(--border-width-thick) solid var(--color-border)` (2px), `border-radius: var(--radius-xl)` (10px); height 455px visible / 958px scroll area
- Scrollbar: 7px wide container with 1px border + 10px radius; thumb 5px wide × 261px, `background: var(--color-border)` (black), 10px radius
- Event card padding: 10px top/bottom, 20px left, 30px right; gap between columns: 15px; cards separated by 20px gap in scroll area

**Mobile** (node `106:899`)
- Full width (8px padding each side); border box height 400px visible / 622px scroll area
- Event card padding: 8px top/bottom, 8px left, 15px right; gap between columns: 4px; cards separated by 10px gap

**Event card anatomy (both):**
- `date-thumbnail`: month text (16px medium) + day-container box (54×54px, 2px border, 5px radius, day number 14px medium)
- `text-container`: title (16px medium) + location (12px medium) + save-event button
- `save-event button`: 80×19px, `background: var(--color-save-event-bg)`, 1px border, `border-radius: var(--radius-sm)` (3px), text 12px regular
- `learn-more-button`: 1px border, `border-radius: var(--radius-xs)` (2px), text 14px medium — **"Learn More" on desktop, "Learn\nMore" (stacked) on mobile**

```css
/* Mobile base — always filled */
.learn-more-btn {
  background-color: var(--color-accent-light);
}

/* Desktop — transparent default, fill on hover */
@media (min-width: 1280px) {
  .learn-more-btn {
    background-color: transparent;
  }
  .learn-more-btn:hover {
    background-color: var(--color-learn-more-hover);
  }
}
```

### Dancer Image (`assets/dancers.png`)
- Transparent-background PNG of dancing figures
- Desktop: ~650px wide, positioned right side of layout, overlapping the background SVG
- Mobile: ~249px wide, positioned right side above the calendar section
- `position: absolute` within a positioned container; scale responsively — no fixed widths

### Contact Section

**Desktop** (node `56:929`): 643px wide, centered; row gap 35px; left/right padding 18px

**Mobile** (node `108:78`): full 390px width; padding 18px; column layout with items stacked

| Element | Style |
|---------|-------|
| "Join the Newsletter" label | 16px medium, text-align center |
| Email `<input>` | 1px border, `border-radius: var(--radius-lg)` (5px), height 35px |
| Submit `<button>` | `background: var(--color-accent-light)`, 1px border, 5px radius, 16px medium, padding 7px 11px |
| Telegram label | 15px medium |
| "join here" `<a>` | Same style as Submit button, 16px medium |
| "email Marcus" | 15px medium; email icon ~33×27px beside it; no hover style |
| "instagram" | 15px medium; Instagram icon 30×30px beside it; no hover style |

---

## Do Not

- Hardcode hex values in CSS rules — always use `var(--token-name)`
- Use fixed pixel widths on layout containers
- Add JS before that section's static HTML/CSS layout is confirmed
- Use any font other than JetBrains Mono
- Use inline styles

---

## Confirmed Components — Do Not Modify

### Navbar ✓ COMPLETE
**HTML:** `index.html` — `<header class="site-header">` wrapping `<nav class="nav">`

| Element | Classes |
|---------|---------|
| Outer header | `.site-header` |
| Nav wrapper | `.nav` |
| Brand group (logo + name) | `.nav__brand`, `.nav__logo`, `.nav__brand-name` |
| Links list | `.nav__links` |
| Each nav item | `.nav__item` |
| Nav `<a>` links | `.nav__link` |
| Offerings trigger `<button>` | `.nav__link.nav__link--trigger` |
| Item with dropdown | `.nav__item.nav__item--has-dropdown` |
| Dropdown list | `.nav__dropdown` |
| Dropdown `<a>` items | `.nav__dropdown-link` |

**Hover states:**
- `.nav__link:hover` / `.nav__link--trigger:hover` → `text-decoration: underline` (3px, offset 5px)
- `.nav__dropdown-link:hover` → same underline
- Dropdown open: CSS-only via `:hover` + `:focus-within` on `.nav__item--has-dropdown`

**JS:** None — dropdown is pure CSS.

**Rules:** Navbar styles live in the `NAVBAR` block of `style.css`. Do not alter any `.nav__*` rule when building subsequent sections.

---

## Page Inventory

| File | Status | Purpose |
|------|--------|---------|
| `index.html` | In progress | Landing page — all six sections; **mobile source of truth** |
| `events.html` | In progress | All-events page (upcoming + past); **no Figma node — built from prompts, modelled on `index.html` mobile** |
| `about.html` | Skeleton (empty body) | Practitioner bio, philosophy, credentials |
| `blog.html` | Skeleton (empty body) | Blog post listing |
| `past-events.html` | Skeleton (empty body) | Archive of past events, driven by `calendar.js` |
| `offerings/kinetic-waves.html` | Empty | Offering detail — Kinetic Waves |
| `offerings/the-overscore.html` | Empty | Offering detail — The Overscore |
| `offerings/resonance-response.html` | Fully built | Offering detail — Resonance & Response. Standalone page with own navbar, carousel, bios, schedule accordion, about accordion, video gallery, and Google Form embed |
| `offerings/felt-sense-fall-intensive.html` | Empty | Offering detail — Felt Sense Fall Intensive |

---

## Data

**`events.json`** — array of event objects:
```json
{
  "date":        "YYYY-MM-DD",
  "title":       "Event name",
  "location":    "Display location string",
  "locationMap": "Address for Google Maps",
  "link":        "https://registration-or-detail-url",
  "description": "Short plain-text description"
}
```
`calendar.js` splits events into upcoming (≥ today) and past (< today), sorted accordingly. It targets `#calendar-list` for upcoming and `#past-events-list` for the archive.

---

## Development Workflow

1. Open files directly in the browser (`file://`) — no server required for static pages.
2. Use a local server (e.g. `python3 -m http.server 8080`) if `calendar.js` is active, since `fetch('events.json')` is blocked by CORS on `file://`.
3. Build sections in order (see **Page Sections — Build Order**). For each section: write HTML → add CSS (mobile base first, then `@media (min-width: 1280px)` overrides) → confirm both breakpoints → move to next section.
4. Wire up JS only after that section's static layout is confirmed.
5. Test at **375px** (mobile) and **1280px** (desktop) for every section.

---

## Accessibility Checklist

- All images need descriptive `alt` text (or `alt=""` for decorative images).
- Navigation must be a `<nav>` with an `aria-label` when multiple `<nav>` elements exist.
- Interactive elements must be reachable and operable by keyboard.
- Color contrast must meet WCAG AA (4.5:1 for body text, 3:1 for large text).
- Page `<title>` should be unique and descriptive per page.

---

## Resonance & Response Page Copy

### Page Title
Resonance & Response: An Axis Syllabus and Contact Improvisation Workshop with Marcus van Duren and Emily Jones

### Event Details
- **Dates:** Aug 7–9
- **Location:** Portland, OR at FLOCK

### Description (3 paragraphs)
Resonance & Response is an Axis Syllabus and Contact Improvisation workshop centered on physical conversation, both with ourselves and with the people we are dancing alongside. We practice listening through the body, noticing potential, and making movement choices that are supported by the physical conditions at hand.

Drawing on theory and practice from the Axis Syllabus, we deepen our understanding of anatomy, movement, and our relationship to physics through connections to the natural world, honoring complexity, nuance, adaptability, and interdependence within the body in motion.

In this workshop, we surf between solo improvisational explorations, set movement motifs, and Contact Improvisation practices, allowing these different modes to inform one another and create a richer palette for dancing.

### Schedule

**Friday**
- Morning: 9:30–11:30am
- Afternoon: 12:30–3:30pm

**Saturday**
- 10:30am–4:30pm

**Sunday**
- 9:30am–2:30pm

### Daily Themes

**Friday**
- Morning: Surfacing Routes — sequential descents and departures
- Afternoon: Maps of Motion — (anatomy picnic) presentation and group discussion of fascia, interstitium, spinal mechanics, and more!

**Saturday**
- Morning: The Conversational Nature of Contact — Contact Improvisation as physical dialog: exchanges informed by noticing potentials, following impulse, making invitations, releasing expectations in support of genuine exchange.
- Afternoon: Guided by the Curve — Exploring rolling, crawling, walking, jumping, and all the movement in between while following the nuances of our hips and shoulders.

**Sunday**
- Morning: Earth to Flight Continuum — revisiting, further developing and expanding themes, movement patterns and scores from previous classes. Part solo dancing, part CI.
- Closing Group Score: Overscore — group score ritual, improvise through a structure, accompanied by a live musician.

### Page Implementation Notes

- **Navbar:** Has its own standalone navbar (`.rr-nav`) separate from the main Felt Sense Movement navbar. Left side shows "Resonance & Response" as title text; right side is a hamburger menu opening a dropdown with four anchor links: About, Schedule, Videos, Registration.
- **Bespoke JS files:**
  - `rr-carousel.js` — handles the hero photo carousel (5 slides, prev/next arrows, dot navigation)
  - `rr-nav.js` — handles hamburger open/close and outside-click dismissal
  - `rr-accordion.js` — handles all accordion toggles (About, Schedule, Read Bio)
  - `rr-videos.js` — handles custom play/pause overlay on the video gallery
- **Carousel images:** `assets/images/carousel-RR-1.jpg` through `carousel-RR-5.jpg`
- **Videos:** `assets/videos/RR-1.mp4` through `RR-4.mp4` — vertical format (9:16), muted, loop, custom play button overlay
- **Google Form embed:** `https://docs.google.com/forms/d/e/1FAIpQLSd_Clobp-3vVvusTCs7aBqlxovuBturL7MEx0HMfwK1XXKGAA/viewform?embedded=true` — height 2808px, wrapped in `overflow-x: hidden` container

### Marcus Bio
Marcus van Duren is a dancer, teacher and musician based in the San Francisco Bay Area. Marcus has intensively studied movement and dance since his discovery of contact improvisation in 2012. He has been teaching CI locally and internationally for more than 10 years. Marcus is an active member of the axis syllabus community and is currently an Axis Syllabus Teacher Candidate. For Marcus, teaching is not just about transmitting information. It's also about creating a safe space for participants to explore, take risks and collaborate. When it comes to teaching contact improvisation, Marcus specializes in merging the technical information of bio-mechanics with play, humor and ritual to create engaging learning experiences that aim to serve the whole person, not just the dancer.

### Emily Bio
Emily Jones is a dancer, choreographer, movement educator, and bodyworker based in Portland, Oregon. Her interdisciplinary practice centers intuition, embodied learning, and movement-based research, with particular attention to community care, relational ethics, and communication within spaces of learning and collaboration. She has performed with numerous artists in Portland and the Bay Area and is engaged in a long-term artistic collaboration with Hannah Krafcik. Their interdisciplinary work has been presented nationally. Emily facilitates contact improvisation jams, organizes events, teaches and performs with the Queer Contact Improvisation Cohort based in Portland. She is a certified Axis Syllabus teacher and offers classes and workshops informed by this lens both locally and beyond. Website: emilyannejones.com

---

## How to Add Events

Events are stored in `events.json` as a JSON array. `calendar.js` reads this file, splits events into upcoming and past based on today's date, and renders them as cards on any page that includes the calendar section.

### Field reference

```json
{
  "date":        "YYYY-MM-DD",
  "title":       "Event name",
  "location":    "Short display string shown on the card",
  "locationMap": "Full address for Google Maps pin",
  "link":        "https://specific-registration-or-detail-page-url",
  "category":    "class",
  "description": "Short plain-text description (not currently shown in the UI)"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `date` | **Required** | ISO 8601 date: `YYYY-MM-DD`. Determines whether the event is upcoming or past, and sets the month/day displayed on the card. For multi-day events, use the first day. |
| `title` | **Required** | The event name displayed on the card. |
| `location` | **Required** | Short human-readable string shown as the clickable location label (e.g. `"Portland, OR"` or `"FLOCK — Portland, OR"`). |
| `locationMap` | Optional | Full address passed to Google Maps when the user clicks the location. Falls back to `location` if omitted. Use this when `location` is a venue name that Maps won't find on its own (e.g. set `location` to `"FLOCK"` for display but `locationMap` to `"3520 SE Powell Blvd, Portland, OR"` for the pin). |
| `link` | **Required** | The URL for the "Learn More" button. Must point to the specific event registration or detail page — not the homepage. |
| `category` | **Required for filtering** | Controls which filter tab shows the event. Must exactly match a `data-category` value on the toggle buttons. Current valid values: `"class"`, `"workshop"`. If omitted, the event only shows under "All" — it will be invisible when either filter tab is active. |
| `description` | Optional | Plain-text description. Not currently rendered in the calendar UI but kept for future use. Safe to include. |

### Date formatting

- Always use `YYYY-MM-DD`: year first, then two-digit month, then two-digit day.
- Pad single-digit months and days with a leading zero: `"2026-08-07"`, not `"2026-8-7"`.
- Do not use slashes, commas, or spelled-out month names — `calendar.js` parses dates as `new Date(e.date + 'T00:00:00')` and non-standard formats will produce wrong results or `NaN`.

| Wrong | Right |
|-------|-------|
| `"Aug 7, 2026"` | `"2026-08-07"` |
| `"8/7/2026"` | `"2026-08-07"` |
| `"2026-8-7"` | `"2026-08-07"` |

### Example — a real event

```json
{
  "date":        "2026-10-03",
  "title":       "Sensing Ground: Contact Improvisation Lab",
  "location":    "Shawl-Anderson Dance Center — Berkeley",
  "locationMap": "2704 Alcatraz Ave, Berkeley, CA 94705",
  "link":        "https://www.feltsensemovement.com/offerings/sensing-ground",
  "category":    "class",
  "description": "A drop-in lab exploring weight-sharing, momentum, and floor work through Contact Improvisation."
}
```

### Adding an event step by step

1. Open `events.json`.
2. Add a new object inside the `[...]` array. Separate objects with commas — a comma after every object except the last one.
3. Fill in all required fields. Double-check the date format.
4. Save the file.
5. If testing locally with `calendar.js` active, use a local server (`python3 -m http.server 8080`) — `fetch('events.json')` is blocked by the browser on `file://` URLs.

### Common mistakes to avoid

- **Linking to the homepage.** `"link": "https://feltsensemovement.com"` is a placeholder — always replace it with the actual event URL.
- **Wrong category casing.** `"Workshop"` will not match the `"workshop"` filter. Category values are case-sensitive and must be lowercase.
- **Multi-day events.** The calendar displays a single day number. For a three-day workshop, set `date` to the opening day and include the full date range in the title (e.g. `"Resonance & Response — Aug 7–9"`).
- **Trailing comma on the last item.** Standard JSON does not allow a trailing comma after the final object in the array. It will silently break the calendar in some browsers.
- **Past events don't disappear — they move.** An event whose date has passed is not hidden; it moves to the Past Events section. Only delete an entry if you want it gone from the site entirely.
