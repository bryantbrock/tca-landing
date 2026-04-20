# Navigation & Hero CTA Redesign

**Date:** 2026-04-20
**Status:** Approved

## Problem

Key actions (Request an Interview, Apply to Teach, Careers) are buried in the footer or deep pages. The flat 6-item Roman-numeral nav doesn't scale and leaves secondary pages (FAQ, Resources, Careers, Contact) hard to discover. Visitors can't quickly find what they need from the landing page.

## Solution

Two coordinated changes: (1) replace the flat nav with a category dropdown nav, and (2) replace the hero CTAs with three clearly hierarchical actions.

---

## 1. Category Dropdown Navigation

### Structure

Replace the 6-item Roman-numeral flat nav with 4 category labels, each revealing a dropdown panel.

| Category | Items |
|----------|-------|
| **About** | Our Vision (`/our-vision`), How It Works (`/how-it-works`), People (`/people`) |
| **Admissions** | Admissions Process (`/admissions`), Request an Interview ↗ (`INTERVIEW_URL`) |
| **Families** | Resources (`/resources`), FAQ (`/faq`), Tuition Policy (`/resources/tuition`), Uniform Policy (`/resources/uniform`), Parent Login ↗ (`CLASSREACH_URL`) |
| **Get Involved** | Give ↗ (`GIVE_URL`), Careers (`/careers`), Contact (`/contact`) |

External links (Give, Parent Login, Request an Interview) display a ↗ indicator and open in a new tab.

### Desktop Behavior (lg+, ≥1024px)

- Categories sit in a horizontal row where the Roman-numeral list currently lives, right-aligned in the header.
- **Hover:** Dropdown panel fades in and slides down (~150ms ease-out). A ~100ms delay before closing on mouse-leave prevents accidental dismissal.
- **Click:** Also toggles the dropdown (for accessibility and trackpad users).
- **Scroll-compact:** The header still compacts from 192px to 60px on scroll. Categories remain in a tight horizontal row in compact mode. Dropdowns still work in compact mode.
- **FLIP animation:** The existing FLIP scroll animation is simplified — no Roman numerals to hide/show, just a padding reduction and height change.
- **Dropdown panel styling:** Same frosted glass treatment as the current mobile menu (`bg-white/95 backdrop-blur-md border border-ink/10 rounded-card shadow-lg`). Panel is positioned below the category label, right-aligned to not overflow the viewport.
- Only one dropdown open at a time. Hovering a different category closes the current one and opens the new one.
- Clicking outside or pressing Escape closes any open dropdown.

### Mobile Behavior (<lg, <1024px)

- The "Menu" button opens a disclosure panel (same as current behavior).
- Inside the panel, the 4 categories display as expandable accordion sections.
- Tapping a category label expands/collapses its children with a smooth height transition.
- Tapping a link inside a category closes the entire menu (same as current behavior).
- Close on Escape and click-outside (same as current behavior).

### Header Elements Retained

- "Trinity Classical Academy" wordmark (left side, links to `/`)
- "← Home" link on non-home pages
- Emblem SVG (right of nav, links to `/`)

### Elements Removed

- Roman numeral markers (I. through VI.)
- The vertical-to-horizontal FLIP animation for individual nav items (replaced by simpler compact transition)

### Footer Nav Updates

The footer MENU section updates to match the new 4-category structure. Categories display as section headings with their items listed below, replacing the current flat Roman-numeral list. The FOR FAMILIES section is removed since its contents (FAQ, Careers, Parent Login) are now distributed across the nav categories and the footer MENU.

---

## 2. Hero CTA Redesign

### Current State

- "Learn More" gold pill → `/our-vision`
- "or contact us →" text link → `/contact`

### New State

Three actions in a clear visual hierarchy, displayed in the hero body column (anchored to 75% divider on lg+):

1. **"Request an Interview"** — Gold pill button (`bg-gold rounded-pill`, same style as existing primary CTAs). Links to `INTERVIEW_URL` (Formaloo form). Opens in new tab. Primary action.
2. **"Apply to Teach"** — Forest-outline pill button (`border border-forest text-forest bg-transparent rounded-pill`). Links to `https://trinity-classicalalabama.formaloo.me/8tozru`. Opens in new tab. Secondary action.
3. **"Learn More →"** — Text link in mono/eyebrow style (`font-mono text-[10px] uppercase tracking-eyebrow text-ink-mute hover:text-forest`). Links to `/our-vision`. Tertiary action.

### Layout

- On desktop: The two pill buttons sit side by side in a row with a 12px gap. "Learn More →" sits on a new line below them.
- On mobile: The pill buttons stack vertically (full width) with "Learn More →" below.
- The "or contact us →" link is removed (Contact is now accessible via Get Involved in the nav).

---

## 3. Files Changed

| File | Change |
|------|--------|
| `src/components/Header.astro` | Replace flat navItems with category structure, add dropdown markup, update mobile disclosure to accordion, simplify FLIP animation, remove Roman numerals |
| `src/components/Hero.astro` | Replace 2 CTAs with 3-action hierarchy |
| `src/components/Footer.astro` | Update MENU section to match category structure, remove FOR FAMILIES section, remove Roman numerals |
| `src/lib/links.ts` | Add `TEACHER_APP_URL` constant |

---

## 4. Design Tokens

All new elements use existing design tokens. No new colors, fonts, or spacing values introduced.

- **Dropdown panel:** `bg-white/95 backdrop-blur-md border border-ink/10 rounded-card shadow-lg p-5`
- **Category labels:** `font-sans text-sm text-ink hover:text-forest transition`
- **Dropdown items:** `font-sans text-sm text-ink hover:text-forest transition`
- **Primary CTA (gold pill):** `bg-gold rounded-pill px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink hover:opacity-90`
- **Secondary CTA (outline pill):** `border border-forest text-forest rounded-pill px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-eyebrow hover:bg-forest hover:text-white transition`
- **Tertiary CTA (text link):** `font-mono text-[10px] font-medium uppercase tracking-eyebrow text-ink-mute hover:text-forest transition`

---

## 5. Accessibility

- Dropdown triggers use `aria-expanded`, `aria-controls`, and `aria-haspopup="true"`
- Dropdown panels have `role="menu"` with items as `role="menuitem"`
- Escape closes any open dropdown and returns focus to the trigger
- Arrow keys navigate within an open dropdown
- Tab moves between category labels (skipping dropdown contents when closed)
- External links include `rel="noopener noreferrer"` and visually indicate they open in a new tab (↗)
