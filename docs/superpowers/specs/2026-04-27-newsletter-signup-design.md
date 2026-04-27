# Newsletter signup — design

**Date:** 2026-04-27
**Status:** Approved (pending user spec review)
**Author:** Brainstormed with Claude

## Problem

The homepage hero leads with "Request an Interview" as its primary CTA. For most first-time visitors that's too high-friction — they're not yet ready to commit to a meeting. We need a low-friction first step that captures intent and connects visitors directly with the school: a newsletter signup. Newsletter subscribers can then be nurtured into the higher-commitment actions (interview, teacher application).

The school already produces newsletter content (curriculum guide, daily schedule, financial-aid info, etc.) but does not yet have any signup mechanism on the site.

## Goals

- Make newsletter signup the primary call-to-action on the homepage.
- Capture engaged visitors who haven't clicked the hero CTA via a scroll-triggered popup.
- Use the post-signup moment to surface the higher-commitment CTAs (interview, teacher application) to visitors who've already shown interest.
- Persist signups somewhere we can later export to whatever third-party email tool the school adopts.

## Non-goals

- Visual design of the modal — handled in a separate `/ui` session after this spec is implemented.
- Welcome email automation — happens in the school's third-party email tool, not on the site.
- Subscriber export tooling or sync — manual export from Netlify dashboard for now.
- Audience segmentation (parent vs. teacher vs. other) — out of scope; the success state shows both follow-up CTAs and lets visitors self-select.

## Approach

A single reusable signup component drives a modal with three states (form / submitting / success). The modal is mounted once at the page level and surfaced through three triggers:

1. **Hero primary CTA** on the homepage — replaces "Request an Interview" as the gold pill.
2. **Scroll-triggered popup** on the homepage — auto-opens when scroll depth crosses ~40%, once per visitor.
3. **Footer link** — site-wide persistent access for returning visitors.

The same modal is reused everywhere; only the trigger differs.

Form submissions land in Netlify Forms (already configured for the contact form), using the same `data-netlify="true"` + honeypot pattern. No additional infrastructure required.

## Components

### `NewsletterSignup.astro` (new)

Self-contained component holding the modal markup, the hidden Netlify-detectable form, and the client script that handles trigger logic, open/close state, submission, and state transitions.

The component has no public props in v1. It is mounted once in the homepage layout (and once on any other page that should expose the footer link or the manual trigger). Trigger logic checks whether the current page is the homepage before activating the scroll listener.

**Modal states:**

1. **Default (form)** — heading, value-prop copy, first-name input, email input, submit button, privacy reassurance line ("Unsubscribe anytime. We never share your email.").
2. **Submitting** — submit button disabled and shows a spinner; form fields locked.
3. **Success** — replaces the form with a thank-you message and two follow-up CTAs:
   - **Request an Interview** (primary, links to `INTERVIEW_URL` in a new tab)
   - **Apply to Teach** (secondary, links to `TEACHER_APP_URL` in a new tab)
   The modal stays open after success until the user dismisses it or clicks one of the CTAs.

**Error state** — on submission failure, the form re-enables with an inline error message ("Something went wrong. Please try again, or [contact us](/contact) if the problem persists."). LocalStorage is **not** written on error, so the user can retry and the popup logic still treats them as un-prompted.

### Hero changes (`src/components/Hero.astro`)

The CTA stack at lines 38–55 changes:

| Before | After |
|---|---|
| Request an Interview (gold pill, primary) | **Join the Newsletter** (gold pill, primary, opens modal) |
| Apply to Teach → (text link, tertiary) | Request an Interview → (text link, tertiary) |

- "Apply to Teach" is **removed from the hero**. It still lives on the Careers page and in the footer.
- The new primary becomes a `<button type="button">` rather than an `<a>`, since it triggers the modal rather than navigating. Same gold-pill class composition.
- "Request an Interview" gets the demoted text-link styling that "Apply to Teach" currently uses.

### Footer changes (`src/components/Footer.astro`)

Add a "Join the newsletter" trigger that opens the modal. Implemented as a `<button>` styled to match the surrounding footer text-link treatment (semantically a button since it triggers a modal rather than navigates). Placement within the footer's existing four-category structure is a content/styling decision deferred to the `/ui` session.

### Layout / page mount

The `<NewsletterSignup />` component is mounted **once** inside `Layout.astro` so every page gets the modal automatically and the footer link works site-wide. The component's client script gates the scroll-popup auto-trigger to the homepage internally (by checking `location.pathname === '/'`), so the modal exists everywhere but only auto-opens on the homepage.

## Trigger logic

A small client script in `NewsletterSignup.astro` (or extracted to `src/scripts/newsletter.ts` if it grows beyond ~50 lines):

```js
// Pseudocode
const STATE_KEY = 'tca_newsletter_state'; // null | 'dismissed' | 'subscribed'
const SCROLL_THRESHOLD = 0.4;

function open(reason: 'auto' | 'manual') { /* show modal */ }
function close(viaSubmit = false) {
  if (!viaSubmit && localStorage.getItem(STATE_KEY) !== 'subscribed') {
    localStorage.setItem(STATE_KEY, 'dismissed');
  }
  /* hide modal */
}

// Manual triggers (Hero CTA, Footer link) — always open, ignore stored state
heroButton.addEventListener('click', () => open('manual'));
footerLink.addEventListener('click', () => open('manual'));

// Auto trigger — homepage only, only if state is null
if (location.pathname === '/' && localStorage.getItem(STATE_KEY) === null) {
  window.addEventListener('scroll', () => {
    const ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (ratio >= SCROLL_THRESHOLD) {
      open('auto');
      // detach listener once fired
    }
  }, { passive: true });
}
```

**Dismissal paths** (clicking the X, pressing Escape, clicking the backdrop) all call `close()`.

## Form submission

The hidden Netlify-detectable form lives inside the modal markup, mirroring the contact-form pattern at `src/pages/contact.astro:123-138`:

```html
<form
  name="newsletter"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  data-newsletter-form
>
  <input type="hidden" name="form-name" value="newsletter" />
  <p class="hidden">
    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
  </p>
  <input name="name" type="text" required />
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>
```

**Submission handler:**

1. Intercept submit, prevent default.
2. Transition modal to `submitting` state.
3. POST to `/` with `Content-Type: application/x-www-form-urlencoded` and the form-encoded body. (Same pattern the contact page uses.)
4. On 200: write `subscribed` to localStorage, transition modal to `success` state.
5. On non-2xx or network error: surface inline error, re-enable the form, leave localStorage untouched so the user can retry.

**Native validation only** — `type="email"` + `required` is sufficient. No JS-level validation library.

**Spam protection** — Netlify's `netlify-honeypot="bot-field"` is enough; no CAPTCHA.

## Data flow

1. User submits → POST to `/` (Netlify intercepts).
2. Submission appears in the **Netlify dashboard** under `newsletter` form submissions.
3. When the school adopts a third-party email tool, submissions are exported manually from Netlify and imported into that tool. (Out of scope for this spec.)

## State persistence (localStorage)

| Key | Values | Set by |
|---|---|---|
| `tca_newsletter_state` | `null` (default) / `'dismissed'` / `'subscribed'` | dismiss → `'dismissed'`; successful submit → `'subscribed'` |

- Auto-open (scroll trigger) only fires when state is `null`.
- Manual triggers (Hero CTA, footer link) always open the modal regardless of state. A subscribed user clicking a manual trigger sees the success state immediately (with the follow-up CTAs).

## Files touched

**New:**
- `src/components/NewsletterSignup.astro` — modal markup + client script
- *(Optional)* `src/scripts/newsletter.ts` — extracted trigger logic if it grows

**Edited:**
- `src/components/Hero.astro` — swap CTA hierarchy (lines ~38-55)
- `src/components/Footer.astro` — add "Join the newsletter" link
- `src/layouts/Layout.astro` — mount `<NewsletterSignup />` once globally

**No change:**
- `src/lib/links.ts` — `INTERVIEW_URL` and `TEACHER_APP_URL` are reused as-is for the success-state CTAs.

## Out of scope

- Visual design / styling of the modal (centered modal vs. bottom sheet on mobile, typography, motion) — handled in a follow-up `/ui` session.
- Welcome email or drip-sequence automation — lives in the school's third-party email tool.
- Subscriber export sync or webhook to the third-party tool — manual export from Netlify dashboard for v1.
- Audience segmentation fields — both follow-up CTAs are shown post-success and the visitor self-selects.
- A/B testing of trigger thresholds or copy.

## Open questions for the user

None at spec time. The visual treatment is intentionally deferred and will be designed via `/ui` once this spec's behavior layer is implemented.

## Testing plan

- **Form submission** — submit the form on a deploy preview, verify the entry appears in the Netlify dashboard under the `newsletter` form.
- **Trigger logic** — verify scroll trigger fires once per visitor, dismissal sets localStorage, manual triggers always open.
- **Success state** — verify the two follow-up CTAs link to the correct Formaloo URLs in new tabs.
- **Error state** — temporarily simulate a network error (e.g., offline) and verify inline error appears and form re-enables.
- **Cross-page** — verify footer link works on every page; verify scroll trigger only fires on the homepage.
- **No regressions** — verify the contact form still works (different `name`, no collision with Netlify's form detection).
