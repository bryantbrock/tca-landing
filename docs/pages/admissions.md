# Admissions page — `/admissions`

The conversion funnel for new families. Currently we redirect `Admissions`
in the nav to `/contact`, but that conflates admissions with general
contact. A dedicated `/admissions` page matches the intent better and
lets us explain the three-step process.

## Existing site structure

The old trinityclassical.academy site has:

- **Enrollment Process page** — describes a three-step process:
  1. Request an Interview (via embedded Formaloo form)
  2. Admissions Interview (in-person, school-led)
  3. Invitation to Apply (sent if the interview confirms fit)

This page should port forward mostly as-is, rebuilt in our design system.

## Proposed page structure

```
────────────────────────────────────────────
HERO
  Eyebrow:  ADMISSIONS
  Headline: "How to join Trinity." or similar editorial italic Cormorant
  Lead:     Short paragraph about the school's approach — that we take
            admissions seriously as discernment, not transaction.
  CTA:      "Request an Interview" → Formaloo (primary, lime)

THE THREE-STEP PROCESS
  Visual: Three numbered cards or three numbered section blocks
  (matches the "ONE / TWO / THREE" numbering pattern already used
   in CoreBeliefs and HowItWorks).

  ONE — REQUEST AN INTERVIEW
    ~2 paragraphs: what to expect when you submit the form,
    how quickly the school responds, what info we need from you.
    CTA: "Request an Interview" → Formaloo

  TWO — ADMISSIONS INTERVIEW
    ~2 paragraphs: what the interview looks like, who's in the room,
    what the school is looking for, what families should ask.

  THREE — INVITATION TO APPLY
    ~2 paragraphs: what happens after the interview if it's a fit,
    the formal application process, enrollment paperwork, timelines.

IMPORTANT DETAILS
  Eyebrow:  WHAT TO KNOW
  Sub-sections with mono eyebrow labels and short answers:
    - Grades served this year (e.g., "K-5 in 2026, expanding to 6-8 by 2028")
    - Rolling admissions vs fixed deadlines
    - Class size caps
    - Tuition at a glance + link to /resources/tuition
    - Uniform requirement + link to /resources/uniform
    - Family expectations (church affiliation? faith commitment? etc.)

FAQ TEASER
  Eyebrow:  COMMON QUESTIONS
  3-5 most-asked questions with expand/collapse
  "See all questions" → /faq (Phase 4)

FINAL CTA
  Big "Request an Interview" + secondary "Contact us with questions" → /contact
────────────────────────────────────────────
```

## Content to pull from existing site

The three-step description on the existing Enrollment Process page is
already good. Pull it verbatim as a starting point:

> **Request an Interview** — Families begin by submitting an interview
> request through the [Formaloo] form.
>
> **Admissions Interview** — The school conducts interviews to "ensure
> that a healthy partnership will exist between families and the school."
>
> **Invitation to Apply** — Upon successful interview, families receive
> an enrollment invitation if Trinity Classical Academy is deemed the
> right fit.

Expand each point into ~2 paragraphs with specifics.

## Contact form — permanent status

The `/contact` page already has a backup native form that submits via
`mailto:`. See `roadmap.md` Phase 5 for the plan to wire it to Formspree
(or similar) for a proper production experience.

### Why mailto is the current placeholder

- Zero infrastructure — works on static hosting
- Keeps the contact page functional even if the Formaloo interview form
  is down (which it currently is)
- User's email client auto-populates with the form data

### Known limitations (to be fixed in Phase 5)

- Requires the user to have a default mail client configured
- No record of the inquiry on the school side until the user hits Send
  in their client
- No spam protection
- No "thanks, we got it" confirmation UI — the page just navigates away

### Upgrade paths

1. **Formspree** (recommended) — 5 minutes, free tier 50/mo, swap `action`
   attribute, add thanks page, done
2. **Netlify Forms** — free if deployed on Netlify, auto-captures to the
   Netlify dashboard
3. **Astro API route** — most flexible, requires SSR mode + an email
   service API key (Resend, SendGrid, etc.)

## Blockers

- Owner needs to confirm content for the three expanded process
  paragraphs (can carry existing site's content forward as a starting
  point, but will probably want to expand)
- Owner needs to decide what grades are served this year (content for
  the "What to know" section)
- Owner needs to decide on Formspree / Netlify / custom for the contact
  form upgrade

## Implementation checklist

- [ ] Carry forward existing site content as starting draft
- [ ] Owner confirms / edits copy
- [ ] Build `src/pages/admissions.astro`
- [ ] Reuse the numbered-card pattern from CoreBeliefs for the 3 steps
- [ ] Update nav: `III. Admissions` → `/admissions` (was `/contact`)
- [ ] Wire all `Request an Interview` CTAs on this page to Formaloo
- [ ] Wire up a real form backend (Phase 5)
- [ ] FAQ teaser with 3-5 common questions (block on FAQ content)
- [ ] Open Graph image
