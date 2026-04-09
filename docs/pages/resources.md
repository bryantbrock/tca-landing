# Resources — `/resources` and sub-pages

Documentation, policies, and reference material for current and
prospective families. This is the Phase 4 work per `roadmap.md` — lower
priority than the core content pages but important once families are in
the pipeline.

## What goes here

Pulled from the existing site's `About Us` and `Admissions` dropdowns:

- **Tuition & Fee Policy** — Issuu flipbook of a PDF
- **Uniform Policy** — Issuu flipbook of a PDF
- **FAQ** — expandable Q&A from the existing site
- **Calendar** — school calendar (Google Calendar embed or static)

## Route structure

Two options:

### Option A — one page per resource

```
/resources                (index page, links to each sub-page)
/resources/tuition        (Issuu embed)
/resources/uniform        (Issuu embed)
/resources/faq            (native expandable Q&A)
/resources/calendar       (calendar embed)
```

### Option B — one combined page

```
/resources                (all content on one scrollable page with anchor links)
```

**Recommendation: Option A.** Individual pages are easier to share (link
directly to tuition when a family asks), easier to index for search,
and let each page have its own OG image. The index page is a simple
directory.

## The Issuu embed pattern

The existing site uses Issuu's embeddable flipbook viewer for long-form
PDF documents. It's a reasonable choice — Issuu handles the paginated,
zoomable reading experience that PDFs need, and the embed is a simple
iframe.

### How Issuu embeds work

Issuu provides an embed URL like:
```
https://e.issuu.com/embed.html?d=<DOCUMENT_ID>&u=<USER_ID>
```

Placed inside an `<iframe>` it renders a full flipbook reader.

### Tradeoffs

**Pros**
- Zero maintenance — Issuu handles rendering, mobile support, zoom, search
- Matches what families expect from a policy document viewer
- Owner already has these documents uploaded to Issuu

**Cons**
- Third-party dependency with privacy implications
- Can look visually disconnected from the surrounding page design
- Page load hit — Issuu's player is not lightweight
- Doesn't work offline / is harder to archive

### Alternative: native PDF embed

We could host the PDFs ourselves in `public/docs/` and embed them
using the browser's native PDF viewer (`<iframe src="/docs/tuition.pdf">`
or a link). Downsides: no "flipbook" feel, PDF viewer UI varies by
browser. Upside: fully self-hosted, no third party.

**Recommendation**: Keep Issuu for the flipbook experience on
`/resources/tuition` and `/resources/uniform`. The design around the
embed (hero, header, intro paragraph, "download PDF" button) is ours.
Also host a direct download PDF link so families can save a copy.

## Resources index page structure

```
────────────────────────────────────────────
HERO
  Eyebrow:  RESOURCES
  Headline: "Policies, fees, and answers." (italic Cormorant)
  Lead:     Short paragraph — "Everything you need as a prospective or
            current Trinity family, in one place."

GRID OF RESOURCE CARDS
  (Similar to the HowItWorks program-card grid pattern)
  ┌─────────────────┐ ┌─────────────────┐
  │ TUITION & FEES  │ │ UNIFORM POLICY  │
  │ Short pitch…    │ │ Short pitch…    │
  │ Read →          │ │ Read →          │
  └─────────────────┘ └─────────────────┘
  ┌─────────────────┐ ┌─────────────────┐
  │ FREQUENTLY      │ │ CALENDAR        │
  │ ASKED QUESTIONS │ │                 │
  │ Short pitch…    │ │ Short pitch…    │
  │ View all →      │ │ See the year →  │
  └─────────────────┘ └─────────────────┘
────────────────────────────────────────────
```

## Sub-page structures

### `/resources/tuition` and `/resources/uniform`

```
HERO
  Eyebrow:  RESOURCES · TUITION & FEE POLICY
  Headline: "Tuition & Fee Policy" or editorial treatment
  Lead:     Short paragraph about what the document covers + last
            updated date.
  Actions:  [Download PDF] [Back to Resources]

ISSUU EMBED
  Full-width iframe with the flipbook viewer
  Aspect ratio: 4:3 or 16:10 depending on document

BELOW THE EMBED
  Optional: short summary or "key points" list in our design system
  so visitors who don't want to read the PDF still get the gist.
```

### `/resources/faq`

Native rendering — no external dependency. Simple expandable Q&A using
`<details>` / `<summary>` or a JS-toggled accordion.

```
HERO
  Eyebrow:  RESOURCES · FAQ
  Headline: "Questions we hear a lot."

Q&A LIST
  Grouped by category:
    - About the School
    - Admissions & Enrollment
    - Daily Life
    - Finances
    - Faith & Philosophy
  Each question is a <details> element; open one at a time or
  free-toggle (TBD).

STILL HAVE A QUESTION?
  CTA: "Contact us" → /contact
```

### `/resources/calendar`

Two options:
1. **Google Calendar embed** — iframe with the school's public calendar.
   Quickest to set up, auto-updates.
2. **Static calendar** — hand-maintained in `src/data/events.ts` and
   rendered by Astro. More design control but manual updates.

**Recommendation**: Google Calendar embed. Low maintenance and families
already know how to read a Google Calendar.

## Blockers

- Issuu document URLs (or the raw PDFs if we want to self-host)
- Existing site FAQ content — need to pull it to
  `src/data/faq.ts`
- Calendar decision (Google Calendar ID if we embed)
- Owner confirms Option A vs B for route structure

## Implementation checklist

- [ ] Decide: sub-pages (A) vs combined (B) — recommend A
- [ ] Owner provides Issuu document URLs for Tuition, Uniform
- [ ] Owner provides FAQ content (or confirm to pull from existing site)
- [ ] Build `src/pages/resources/index.astro`
- [ ] Build `src/pages/resources/tuition.astro` with Issuu embed
- [ ] Build `src/pages/resources/uniform.astro` with Issuu embed
- [ ] Build `src/pages/resources/faq.astro` with native accordion
- [ ] (Later) Build `src/pages/resources/calendar.astro`
- [ ] Nav: add `Resources` to navigation (see `navigation.md` Option B)
- [ ] Open Graph images for each sub-page
