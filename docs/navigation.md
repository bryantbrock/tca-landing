# Navigation plan

How the nav should grow as more pages ship. Current nav is fine for the
MVP (1 real page + contact), but it starts to feel thin as we add People,
Our Vision, How It Works, Admissions, etc.

## Current state

Header + footer render a 5-item flat list with Roman-numeral markers:

```
I.    Our Vision     → #our-vision (in-page anchor)
II.   How It Works   → #how-it-works (in-page anchor)
III.  Admissions     → /contact
IV.   Give           → https://trinityclassical.givingfuel.com/…
V.    Contact        → /contact
```

Both `Our Vision` and `How It Works` are anchors into sections of the home
page. Admissions and Contact both point to `/contact` because we don't have
anywhere else to send them yet. `Give` is the only real external link.

## Problem

- Anchoring `Our Vision` and `How It Works` to home-page sections breaks
  once those become real pages (the anchors become stale).
- Admissions and Contact going to the same place is confusing.
- We need somewhere to surface People / Leadership.

## Three proposals, in increasing complexity

### Option A — keep flat, swap anchors for real pages (SIMPLE)

Stay with 5 top-level items. Rename as needed. Each item points to its own
page once the page ships.

```
I.    Our Vision     → /our-vision
II.   People         → /people
III.  How It Works   → /how-it-works
IV.   Admissions     → /admissions
V.    Give           → external (GivingFuel)
```

`Contact` disappears from the top nav — it lives in the footer and on every
CTA button. The form on `/contact` is still the backup for the Formaloo link;
it just doesn't get a dedicated nav slot.

**Pros**
- No markup changes to the Header component
- Easy to reason about
- Still fits the Roman-numeral visual rhythm (exactly 5)
- Matches how landing pages on similar school sites usually work

**Cons**
- Resources (tuition, uniform policy, FAQ) can't be reached from the top nav
- Harder to surface multiple admissions sub-pages

### Option B — flat with 6 items, add Resources

Extends Option A with one more top-level slot for a combined resources page.

```
I.    Our Vision     → /our-vision
II.   People         → /people
III.  How It Works   → /how-it-works
IV.   Admissions     → /admissions
V.    Resources      → /resources (tuition, uniforms, FAQ, calendar)
VI.   Give           → external
```

Resources is an index page that links out to tuition/uniform/faq/calendar.

**Pros**
- Every current page on the old site has a home somewhere
- Still flat — no dropdowns, no mobile disclosure complexity
- Visually still works with Roman numerals up to VI.

**Cons**
- 6 items starts to crowd the sticky compact-on-scroll horizontal rail
- Mobile disclosure panel grows taller — may push past viewport on small
  phones
- "Resources" is vague; some visitors won't realize it contains tuition

### Option C — dropdown menu, mirrors existing site

Match the existing trinityclassical.academy structure:

```
About Us  ▾        → /about
  ├─ Our Vision    → /our-vision
  ├─ People        → /people
  ├─ How It Works  → /how-it-works
  └─ FAQ           → /faq
Admissions  ▾      → /admissions
  ├─ Enrollment Process    → /admissions
  ├─ Tuition & Fee Policy  → /resources/tuition
  └─ Uniform Policy        → /resources/uniform
Current Families  ▾        → (external links)
  ├─ ClassReach            → https://classreach…
  └─ Calendar              → /calendar
Give                       → external
Contact                    → /contact
```

5 top-level items, each (except Give and Contact) has a submenu.

**Pros**
- Scales — can add pages without re-architecting nav
- Visitors coming from the old site will find familiar structure
- "Current Families" keeps the parent-portal separate from marketing nav

**Cons**
- Significantly more markup and JS (desktop hover + mobile nested
  disclosure)
- Roman-numeral rhythm doesn't map to dropdown parents
- The compact-on-scroll FLIP transition gets trickier (what happens to
  sub-items when the nav collapses into a horizontal row?)

## Recommendation

**Start with Option A.** Swap the anchors for real page routes as each page
ships. Revisit when we have all Phase 3 pages and know whether Resources
deserves a top-level slot (Option B) or whether dropdowns (Option C) are
warranted.

Rationale:
- Flat + 5 items is the cleanest design
- The Roman-numeral rhythm is a deliberate brand decision and dropdowns
  break it
- The footer can carry sub-items (Resources, Calendar, FAQ) without
  cluttering the top nav

## Implementation notes (when the time comes)

- `navItems` lives in **both** `Header.astro` and `Footer.astro` as a
  duplicated array. When nav changes, update both.
- Consider extracting `navItems` into `src/data/nav.ts` and importing from
  both components — would also let us add a `external: boolean` flag for
  cleaner handling of external links.
- The sticky-header FLIP animation is driven by index position. If items
  change order, the stagger direction still works; adding items changes the
  total animation duration slightly.
- The mobile disclosure panel has `min-w-[180px]`. Longer labels might need
  that bumped to `min-w-[200px]`.
- Footer renders the same nav under the `MENU` column using the same
  `.map()` pattern.
