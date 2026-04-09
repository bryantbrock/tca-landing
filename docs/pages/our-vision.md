# Our Vision page — `/our-vision`

**Status: placeholder — content blocked on owner**

## Context

The home page already has a `CoreBeliefs` section with six numbered values
(No Neutrality, Classically Rooted, Unapologetically Christian, Mastery Not
Promotion, Four Days Here, Covenantal Community). That's a condensed pitch.

The dedicated Our Vision page is where the fuller philosophical grounding
lives — the _why_ behind the school. Owner has signaled they want to go in a
specific theological and pedagogical direction ("a St. Alfred direction") but
hasn't shared the long-form content yet.

**Owner quote:**
> I also want to get the Our Vision page up. I like that phrasing, "Our
> Vision," because we do have a vision for it. [...] We're going in a St.
> Alfred direction with why we're doing this, what we're trying to
> accomplish with this school, that kind of stuff. I don't want to get
> into those details just yet. I'd rather build up more of the scaffolding
> of all these other pages before I get to Our Vision.

## Current plan: defer

Don't build this page yet. The owner explicitly asked to scaffold other
pages first. When the time comes, the content direction is:

- Classical Christian education rooted in a particular tradition (likely
  the one associated with St. Alfred / Alfred the Great — the English
  king who rebuilt English Christian learning after the Viking invasions
  and is a historically important figure in classical education
  circles).
- The school's philosophical foundations — what "classical" means in this
  specific context, what texts and traditions are emphasized, the role
  of liturgy and worship in the school day, etc.
- The relationship between the school and Trinity Presbyterian Church.

## Source material when we get there

- The existing site's **Our Philosophy** page at
  `trinityclassical.academy/our-philosophy` (or similar) — pull the existing
  long-form text as a starting point.
- The owner's own writing on why they're founding the school.
- Possibly direct quotes from the pastor / head of school.

## Placeholder structure (when we scaffold)

```
────────────────────────────────────────────
HERO
  Eyebrow:  OUR VISION
  Headline: Big italic Cormorant — something like
            "Truth. Goodness. Beauty."  (same as home page hero?)
            or a specific statement.

LONG-FORM SECTIONS
  Multiple subsections, each with:
    - Mono eyebrow label
    - Section heading (Cormorant, not italic)
    - Long prose (Geist Sans, comfortable reading width)
    - Pull-quotes in italic Cormorant at intervals

  Subsection ideas (to be confirmed by owner):
    - Why classical, why now
    - The tradition we're rooted in
    - What a student formed at Trinity looks like
    - Our relationship to Trinity Presbyterian Church
    - What we ask of families

CTA
  "Request an Interview" → Formaloo
  "Meet our team" → /people
────────────────────────────────────────────
```

## Implementation checklist

- [ ] **Blocked: owner provides long-form vision content**
- [ ] Decide on subsection breakdown
- [ ] Build `src/pages/our-vision.astro` using the existing component
      patterns (reuse Hero typography conventions)
- [ ] Update nav if we're promoting Our Vision to a real route (currently
      an in-page anchor on home)
- [ ] Open Graph image for the Our Vision page

## Notes for future sessions

- Don't paraphrase or invent vision content. Wait for the owner's own
  words. Paraphrasing a school's theological positioning is high-risk
  because small word choices signal tradition and denomination.
- The home page's `CoreBeliefs` section shouldn't be deleted once this
  page exists — it serves a different purpose (quick pitch vs long-form).
