# People page — `/people`

The "who's doing this?" page. Owner explicitly called this out as one of
the first things parents want to see on a school site. Faces beat prose.

**Owner quote:**
> One of the first things most people want to know is who is doing this,
> who are the people involved. They want to see photos of the people
> involved. [...] Pictures go a long way in showing the people who are
> involved, and people really want to know about that.

## Scope

Four groups of people live on this page:

1. **Board of Directors** — governance layer, founders, parents serving on
   the board.
2. **Faculty** — teachers who are already hired (we're actively hiring now,
   so some slots may be placeholders).
3. **Staff** — administrators, operations, admissions staff.
4. **Church Staff** — leaders from Trinity Presbyterian Church involved
   with the school (since TCA operates under the care of the church).

## Blockers

- **Owner needs to provide photos.** These are all real people, not stock.
  Headshots (ideally consistent style — similar background, similar crop,
  similar lighting). Owner has said they can get them.
- **Owner needs to provide names, titles, and short bios** for each person.
  Bios can start as 1–2 sentences and grow later.

## Proposed page structure

```
────────────────────────────────────────────
HERO
  Eyebrow:  OUR PEOPLE (or "MEET THE TEAM")
  Headline: "Built by families, for families."
            (or similar — italic Cormorant display)
  Lead:     Short paragraph about how the school is organized
            (board → head of school → faculty → support staff)
            and the church's role in governance.

SECTION 1 — BOARD OF DIRECTORS
  Eyebrow:  BOARD OF DIRECTORS
  Grid of cards:
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  photo  │ │  photo  │ │  photo  │
    │  name   │ │  name   │ │  name   │
    │  title  │ │  title  │ │  title  │
    │  bio    │ │  bio    │ │  bio    │
    └─────────┘ └─────────┘ └─────────┘

SECTION 2 — FACULTY
  Eyebrow:  FACULTY
  Lead:     "Our teachers are the heart of Trinity Classical Academy…"
  Same card grid.
  Open slots shown as placeholder cards with
  "We're hiring" styling + "Apply →" button.

SECTION 3 — STAFF
  Eyebrow:  STAFF & ADMINISTRATION
  Same card grid.

SECTION 4 — CHURCH STAFF
  Eyebrow:  UNDER THE CARE OF TRINITY PRESBYTERIAN CHURCH
  Lead:     Short paragraph explaining the church's relationship.
  Smaller card grid or a simpler list format for church staff.

CTA BLOCK
  "Want to join our faculty?" → /join-our-faculty (Phase 5)
────────────────────────────────────────────
```

## Card design direction

Keep the card visual light — no boxes, no borders. Each person is:

1. Square or portrait photo (consistent aspect ratio across all people,
   probably 4:5), treated with `rounded-card` (8px) on the corners.
2. Name in Cormorant Garamond, ~24-28px, upright.
3. Title in IBM Plex Mono eyebrow style (small, uppercase, tracking-eyebrow,
   `text-brand-accent`).
4. Optional: 1-2 sentence bio in Geist Sans regular, `text-ink-soft`.

Grid:
- 1 column on mobile
- 2 columns on sm/md
- 3 columns on lg+
- Use the same 4-column page divider grid as everywhere else — cards
  occupy columns 1+2, 3, 4 at lg (the first spans two) or all three are
  equal at lg+

## Open questions

> **QUESTION**: Do we want one long People page with all 4 sections, or 2–4
> separate pages (`/people/board`, `/people/faculty`, etc.)? One long page
> is simpler but gets long fast if there are ~20 people. Recommendation:
> start with one page, split later if it exceeds ~30 cards.

> **QUESTION**: Photo aspect ratio — 1:1 (square) or 4:5 (slight portrait)?
> Portrait looks more editorial and matches the design language better,
> but square is easier for the owner to source. Recommendation: 4:5 with
> 1:1 fallback if the source image is square.

> **QUESTION**: Bios — optional or required? Some board members may not
> want a public bio. Recommendation: photo + name + title are required;
> bio is optional and the card layout should still feel complete without it.

> **TODO**: Should we add contact info per person (email, phone)? Most
> school sites don't — the default inquiry path is the main contact form.
> Recommendation: no individual contact info on the page.

## Content notes

- **Church staff section** is important for trust — TCA's identity is
  closely tied to being under the care of Trinity Presbyterian Church. The
  existing site surfaces this via the tagline "under the care of Trinity
  Presbyterian Church" but doesn't show the church's leaders. Owner wants
  to surface them here.

- **Headshot style guide for owner**:
  - Shot from the chest up
  - Warm, natural lighting (no flash photography)
  - Neutral background (wall, outdoor natural backdrop, or blurred
    classroom — whatever is consistent across all photos)
  - No sunglasses, no hats
  - Minimum resolution: 1024×1280 (4:5)

## Implementation checklist

- [ ] Owner provides photos + names + titles + bios
- [ ] Create `src/data/people.ts` with the structured data
- [ ] Add photos to `src/assets/images/people/`
- [ ] Build `src/pages/people.astro` using the existing component patterns
- [ ] Build reusable `PersonCard.astro` component
- [ ] Verify responsive layout at all breakpoints
- [ ] Update nav: swap the `#our-vision` anchor for `/people` or add a new
      nav slot (see `navigation.md`)
- [ ] Open Graph image for the People page
