# Newsletter Signup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's "Request an Interview" primary CTA with a newsletter signup that drives a modal, also auto-opens on 40% scroll, and is accessible from the footer site-wide. Submissions land in Netlify Forms.

**Architecture:** A single `<NewsletterSignup />` component holds the modal markup, a hidden Netlify-detectable form, and a small inline script that handles trigger logic (scroll + manual click via `data-newsletter-trigger` attribute), localStorage dismissal state, submission, and state transitions. Mounted once in `Layout.astro` so it's available on every page; auto-popup is gated to the homepage internally.

**Tech Stack:** Astro 6, Tailwind v4, Netlify Forms (existing pattern from `src/pages/contact.astro:331-409`).

**Spec:** `docs/superpowers/specs/2026-04-27-newsletter-signup-design.md`

---

## Notes for the implementer

- **No unit-test framework exists in this project.** Verification gates are `npm run build` (must succeed) and manual browser verification using `npm run dev` (default port 4321). Tasks below specify the exact behavior to verify.
- **Visual styling is intentionally minimal in this plan.** A separate `/ui` session will polish the visual treatment after this plan is merged. Use clean, brand-coherent placeholder styling so reviewers can verify behavior — don't aim for final-quality visuals.
- **Existing Netlify pattern:** `src/pages/contact.astro:331-409` is the canonical example. Mirror its `data-netlify="true"` form + `is:inline` script approach. Form name must be unique (`newsletter`, not `contact`).
- **Component trigger contract:** any element on the page with `data-newsletter-trigger` opens the modal when clicked. The Hero CTA and Footer button both use this attribute. The modal listens for clicks on `document` (event delegation) so triggers don't have to exist when the modal initializes.
- **Brand tokens** (already in `tailwind.config.mjs`): `bg-gold` / `bg-gold-hover` / `bg-cream` / `bg-racing` / `bg-racing-mid` / `text-ink` / `text-ink-soft` / `text-ink-mute` / `text-forest` / `border-rule` / `font-display` / `font-mono` / `font-sans` / `tracking-eyebrow` / `rounded-pill` / `rounded-card`. Don't invent new tokens.

---

## File structure

| File | Status | Responsibility |
|---|---|---|
| `src/components/NewsletterSignup.astro` | **new** | Modal markup (form / submitting / success states), hidden Netlify form, inline trigger + submission script |
| `src/layouts/Layout.astro` | modify | Mount `<NewsletterSignup />` once globally |
| `src/components/Hero.astro` | modify | Swap CTA hierarchy: newsletter primary, interview tertiary, remove teach |
| `src/components/Footer.astro` | modify | Add "Join the newsletter" trigger button in the existing footer grid |

---

## Task 1: Create the NewsletterSignup component

**Files:**
- Create: `src/components/NewsletterSignup.astro`

This single task creates the entire component: markup, Netlify form, and inline script. Subsequent tasks just mount it and wire up triggers.

- [ ] **Step 1: Create the file with full content**

Write `src/components/NewsletterSignup.astro` with the following exact content:

```astro
---
import { INTERVIEW_URL, TEACHER_APP_URL } from '../lib/links';
---

<!--
	Newsletter signup modal.

	Triggered by:
	  1. Any element with `data-newsletter-trigger` (Hero CTA, Footer button)
	  2. Auto-open on the homepage when scroll depth crosses 40% (once per visitor;
	     remembered in localStorage as 'tca_newsletter_state')

	Submissions go to Netlify Forms (form name: "newsletter"). Mirrors the
	progressive-enhancement pattern from src/pages/contact.astro.

	Visual styling is intentional placeholder — final treatment lands in a
	follow-up /ui session.
-->

<!-- Hidden form duplicate so Netlify's static-build form detection picks it up.
     The visible form below has the same name + fields; both POST to "/" and
     Netlify dedupes on form-name. -->
<form name="newsletter" data-netlify="true" netlify-honeypot="bot-field" hidden>
	<input type="text" name="name" />
	<input type="email" name="email" />
	<input type="text" name="bot-field" />
</form>

<div
	data-newsletter-modal
	class="fixed inset-0 z-50 hidden items-center justify-center bg-ink/60 px-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="newsletter-heading"
	aria-hidden="true"
>
	<div
		data-newsletter-card
		class="relative w-full max-w-md rounded-card bg-cream p-8 shadow-2xl sm:p-10"
	>
		<button
			type="button"
			data-newsletter-close
			aria-label="Close newsletter signup"
			class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition hover:bg-ink/5 hover:text-ink"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<line x1="3" y1="3" x2="13" y2="13" />
				<line x1="13" y1="3" x2="3" y2="13" />
			</svg>
		</button>

		<!-- State: form (default) -->
		<div data-newsletter-state="form">
			<p class="font-mono text-xs font-medium uppercase tracking-eyebrow text-forest">
				Stay connected
			</p>
			<h2 id="newsletter-heading" class="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-4xl">
				Join the newsletter
			</h2>
			<p class="mt-3 font-sans text-sm text-ink-soft">
				Updates from Trinity Classical Academy — curriculum, school news, and the rhythms of the academic year. Sent thoughtfully, never spammed.
			</p>

			<form
				method="POST"
				data-netlify="true"
				netlify-honeypot="bot-field"
				data-newsletter-form
				class="mt-6 flex flex-col gap-4"
			>
				<input type="hidden" name="form-name" value="newsletter" />
				<p class="hidden">
					<label>
						Don't fill this out if you're human: <input name="bot-field" />
					</label>
				</p>

				<label class="flex flex-col gap-1.5">
					<span class="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink-mute">First name</span>
					<input
						type="text"
						name="name"
						required
						autocomplete="given-name"
						class="rounded-md border border-ink/15 bg-white px-3 py-2 font-sans text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
					/>
				</label>

				<label class="flex flex-col gap-1.5">
					<span class="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink-mute">Email</span>
					<input
						type="email"
						name="email"
						required
						autocomplete="email"
						class="rounded-md border border-ink/15 bg-white px-3 py-2 font-sans text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
					/>
				</label>

				<button
					type="submit"
					data-newsletter-submit
					class="mt-2 rounded-pill bg-gold px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
				>
					Subscribe
				</button>

				<p data-newsletter-error class="hidden font-mono text-xs text-[#b91c1c]"></p>

				<p class="font-mono text-[10px] text-ink-mute">
					Unsubscribe anytime. We never share your email.
				</p>
			</form>
		</div>

		<!-- State: success -->
		<div data-newsletter-state="success" hidden>
			<p class="font-mono text-xs font-medium uppercase tracking-eyebrow text-forest">
				Thank you
			</p>
			<h2 class="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-4xl">
				You're on the list.
			</h2>
			<p class="mt-3 font-sans text-sm text-ink-soft">
				While you're here — would you like to take a next step?
			</p>
			<div class="mt-6 flex flex-col gap-3">
				<a
					href={INTERVIEW_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-pill bg-gold px-6 py-2.5 text-center font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink transition hover:bg-gold-hover"
				>
					Request an Interview
				</a>
				<a
					href={TEACHER_APP_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="text-center font-mono text-xs font-medium uppercase tracking-eyebrow text-ink-mute transition hover:text-forest"
				>
					Apply to Teach →
				</a>
			</div>
		</div>
	</div>
</div>

<script is:inline>
	(() => {
		const STATE_KEY = 'tca_newsletter_state'; // null | 'dismissed' | 'subscribed'
		const SCROLL_THRESHOLD = 0.4;

		const modal = document.querySelector('[data-newsletter-modal]');
		if (!modal) return;
		const card = modal.querySelector('[data-newsletter-card]');
		const form = modal.querySelector('[data-newsletter-form]');
		const submitBtn = modal.querySelector('[data-newsletter-submit]');
		const errorEl = modal.querySelector('[data-newsletter-error]');
		const formState = modal.querySelector('[data-newsletter-state="form"]');
		const successState = modal.querySelector('[data-newsletter-state="success"]');
		const closeBtn = modal.querySelector('[data-newsletter-close]');

		const isSubscribed = () => localStorage.getItem(STATE_KEY) === 'subscribed';

		const showState = (which) => {
			if (which === 'success') {
				formState.setAttribute('hidden', '');
				successState.removeAttribute('hidden');
			} else {
				successState.setAttribute('hidden', '');
				formState.removeAttribute('hidden');
			}
		};

		const open = () => {
			showState(isSubscribed() ? 'success' : 'form');
			modal.classList.remove('hidden');
			modal.classList.add('flex');
			modal.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
			// focus first input or close button
			const focusTarget = isSubscribed()
				? closeBtn
				: modal.querySelector('input[name="name"]');
			focusTarget?.focus();
		};

		const close = () => {
			modal.classList.add('hidden');
			modal.classList.remove('flex');
			modal.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
			if (localStorage.getItem(STATE_KEY) === null) {
				localStorage.setItem(STATE_KEY, 'dismissed');
			}
		};

		// Manual triggers — event delegation on document
		document.addEventListener('click', (e) => {
			const trigger = e.target.closest?.('[data-newsletter-trigger]');
			if (trigger) {
				e.preventDefault();
				open();
			}
		});

		// Close interactions
		closeBtn?.addEventListener('click', close);
		modal.addEventListener('click', (e) => {
			if (e.target === modal) close();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
		});

		// Auto-trigger: homepage only, only if state is null
		if (location.pathname === '/' && localStorage.getItem(STATE_KEY) === null) {
			const onScroll = () => {
				const docH = document.documentElement.scrollHeight - window.innerHeight;
				if (docH <= 0) return;
				const ratio = window.scrollY / docH;
				if (ratio >= SCROLL_THRESHOLD) {
					open();
					window.removeEventListener('scroll', onScroll);
				}
			};
			window.addEventListener('scroll', onScroll, { passive: true });
		}

		// Form submission — mirrors src/pages/contact.astro pattern
		const encode = (data) =>
			Object.keys(data)
				.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
				.join('&');

		const setError = (msg) => {
			if (!errorEl) return;
			if (!msg) {
				errorEl.classList.add('hidden');
				errorEl.textContent = '';
			} else {
				errorEl.classList.remove('hidden');
				errorEl.textContent = msg;
			}
		};

		form?.addEventListener('submit', async (event) => {
			event.preventDefault();
			setError('');
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = 'Subscribing…';
			}

			const formData = new FormData(form);
			const payload = {};
			for (const [k, v] of formData.entries()) payload[k] = v.toString();

			try {
				const response = await fetch('/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: encode(payload),
				});
				if (!response.ok) throw new Error('Netlify returned ' + response.status);
				localStorage.setItem(STATE_KEY, 'subscribed');
				form.reset();
				showState('success');
			} catch (err) {
				setError('Something went wrong. Please try again, or contact us at info@trinityclassical.academy if it persists.');
			} finally {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = 'Subscribe';
				}
			}
		});
	})();
</script>
```

- [ ] **Step 2: Verify Astro type-check passes**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npx astro check`
Expected: `0 errors, 0 warnings`. (Hints are OK.)

- [ ] **Step 3: Verify the build succeeds**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npm run build`
Expected: `[build] Complete!` with no errors. The component file alone won't appear in any built page yet (that happens in Task 2), but it must not break the build.

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsletterSignup.astro
git commit -m "feat: add newsletter signup modal component"
```

---

## Task 2: Mount the component globally in Layout.astro

**Files:**
- Modify: `src/layouts/Layout.astro` (add import at the top of the frontmatter, render the component just before `</body>`)

- [ ] **Step 1: Add the import to the frontmatter**

In `src/layouts/Layout.astro`, locate the top of the frontmatter block. After the existing `import` statements (around line 18, after the `martinaLightItalic` import), add:

```astro
import NewsletterSignup from '../components/NewsletterSignup.astro';
```

- [ ] **Step 2: Render the component before `</body>`**

In the same file, find `<slot />` near the bottom (currently around line 118 inside `<body>`). After the `<slot />` line, before the closing `</body>`, add:

```astro
		<NewsletterSignup />
```

The body should now look like:

```astro
	<body class="min-h-screen bg-white font-sans text-ink antialiased">
		<slot />
		<NewsletterSignup />
	</body>
```

- [ ] **Step 3: Verify Astro type-check passes**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 4: Verify the build succeeds**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npm run build`
Expected: `[build] Complete!`. The modal markup is now present on every built page (hidden by default).

- [ ] **Step 5: Manual browser verification**

In a separate terminal: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npm run dev`

Open http://localhost:4321/ and verify:

1. Open DevTools → Application → Local Storage → http://localhost:4321 → delete any `tca_newsletter_state` key.
2. Hard refresh the page.
3. Scroll down past ~40% of the page. The modal should auto-open with the form state.
4. Press Escape — modal closes. localStorage now has `tca_newsletter_state: dismissed`.
5. Hard refresh — scroll past 40% — modal should NOT re-open (dismissal is sticky).
6. Clear localStorage again. Refresh. Modal does not appear at scroll = 0.

If any of these fail, fix and re-verify before moving on.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: mount newsletter signup modal globally"
```

---

## Task 3: Update Hero.astro CTA hierarchy

**Files:**
- Modify: `src/components/Hero.astro` (lines 38-55: the CTA stack inside the right column)

The current CTA stack is:
- Primary gold pill `<a>`: "Request an Interview" → `INTERVIEW_URL`
- Tertiary text link `<a>`: "Apply to Teach →" → `TEACHER_APP_URL`

The new CTA stack is:
- Primary gold pill `<button>` with `data-newsletter-trigger`: "Join the Newsletter"
- Tertiary text link `<a>`: "Request an Interview →" → `INTERVIEW_URL`
- *(Apply to Teach is removed entirely — it lives on the Careers page and footer.)*

- [ ] **Step 1: Replace the CTA stack**

In `src/components/Hero.astro`, find the block at lines 38-55:

```astro
			<div class="mt-6 flex flex-col items-start gap-3 lg:mt-4 xl:mt-6">
				<a
					href={INTERVIEW_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="whitespace-nowrap rounded-pill bg-gold px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink transition hover:bg-gold-hover"
				>
					Request an Interview
				</a>
				<a
					href={TEACHER_APP_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="whitespace-nowrap font-mono text-xs font-medium uppercase tracking-eyebrow text-ink-mute transition hover:text-forest"
				>
					Apply to Teach →
				</a>
			</div>
```

Replace the entire block with:

```astro
			<div class="mt-6 flex flex-col items-start gap-3 lg:mt-4 xl:mt-6">
				<button
					type="button"
					data-newsletter-trigger
					class="whitespace-nowrap rounded-pill bg-gold px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-ink transition hover:bg-gold-hover"
				>
					Join the Newsletter
				</button>
				<a
					href={INTERVIEW_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="whitespace-nowrap font-mono text-xs font-medium uppercase tracking-eyebrow text-ink-mute transition hover:text-forest"
				>
					Request an Interview →
				</a>
			</div>
```

- [ ] **Step 2: Remove the now-unused `TEACHER_APP_URL` import**

In `src/components/Hero.astro`, line 2 currently imports both `INTERVIEW_URL` and `TEACHER_APP_URL`:

```astro
import { INTERVIEW_URL, TEACHER_APP_URL } from '../lib/links';
```

Since `TEACHER_APP_URL` is no longer used in this file, change it to:

```astro
import { INTERVIEW_URL } from '../lib/links';
```

- [ ] **Step 3: Verify Astro type-check passes**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npx astro check`
Expected: `0 errors, 0 warnings`. (If you see an unused-import warning for `TEACHER_APP_URL`, you missed step 2.)

- [ ] **Step 4: Verify the build succeeds**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 5: Manual browser verification**

With `npm run dev` running, open http://localhost:4321/ and verify:

1. Clear `tca_newsletter_state` from localStorage and hard refresh.
2. The hero now shows "Join the Newsletter" (gold pill) and "Request an Interview →" (text link beneath). "Apply to Teach" is gone from the hero.
3. Click "Join the Newsletter" — modal opens with the form state.
4. Close the modal (X button). localStorage shows `dismissed`.
5. Click "Join the Newsletter" again — modal opens again (manual triggers ignore stored state).
6. Click "Request an Interview →" — opens Formaloo URL in a new tab.
7. Submit the form (use a test email) — modal transitions to success state with two CTAs ("Request an Interview" gold, "Apply to Teach →" text). localStorage shows `subscribed`.
8. Close success state and click "Join the Newsletter" again — modal opens directly to success state (because `subscribed` state shows the success view).

If any step fails, fix in `Hero.astro` or `NewsletterSignup.astro` and re-verify.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: replace hero primary CTA with newsletter signup"
```

---

## Task 4: Add a footer trigger for the newsletter modal

**Files:**
- Modify: `src/components/Footer.astro` (add a "Join the newsletter" entry under an appropriate footer column)

The footer has four columns: Mission, Our School/About, Admissions/Families, Get in Touch/Get Involved. The newsletter trigger fits most naturally under **"Get in Touch"** alongside Email / Contact Us / Follow Us — it's another way visitors stay connected with the school.

- [ ] **Step 1: Add the trigger button to the "Get in Touch" list**

In `src/components/Footer.astro`, locate the "Get in Touch" `<ul>` (currently lines 171-198). Inside that `<ul>`, after the `<li>` for "Email" (line 172-179) and before "Contact Us", add a new `<li>`:

```astro
							<li>
								<button
									type="button"
									data-newsletter-trigger
									class="font-sans text-sm text-white transition hover:opacity-70"
								>
									Join the Newsletter
								</button>
							</li>
```

The "Get in Touch" list, after the change, should read in order: Email, Join the Newsletter, Contact Us, Follow Us.

- [ ] **Step 2: Verify Astro type-check passes**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npx astro check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Verify the build succeeds**

Run: `cd /Users/bryantbrock/brocksoftware/tca/tca-landing && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 4: Manual browser verification**

With `npm run dev` running:

1. Open http://localhost:4321/ — scroll to the footer. Confirm "Join the Newsletter" appears in the "Get in Touch" column between Email and Contact Us. Click it — modal opens.
2. Open http://localhost:4321/people (or any non-homepage). Scroll to the footer. The same trigger should appear and open the modal. Importantly: **on a non-homepage, scrolling past 40% should NOT auto-open the modal** — only the homepage auto-triggers.
3. Submit the form on a non-homepage. Confirm the success state appears in the modal and localStorage gets `subscribed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add newsletter signup trigger in footer"
```

---

## After all tasks: pre-merge verification checklist

Once all four tasks are complete and committed, run this end-to-end checklist before requesting review or merging:

- [ ] `npx astro check` — 0 errors, 0 warnings.
- [ ] `npm run build` — clean build.
- [ ] **Homepage auto-trigger:** clear localStorage, scroll past 40% on `/`, modal opens.
- [ ] **Dismissal sticky:** close modal, refresh, scroll past 40% — modal does NOT re-open.
- [ ] **Manual triggers always work:** Hero CTA + Footer button open modal regardless of stored state.
- [ ] **Form submission:** submit a test signup. Modal transitions to success. After deploy, verify the entry appears in Netlify dashboard under the `newsletter` form.
- [ ] **Success-state CTAs:** both Interview and Teach links open in new tabs to the correct Formaloo URLs.
- [ ] **Success state persists:** after submit, manual trigger opens the modal directly to success state.
- [ ] **Error path:** simulate offline (DevTools → Network → Offline) and submit. Inline error appears, form re-enables, localStorage NOT updated, retry works after going back online.
- [ ] **Non-homepage:** auto-trigger does NOT fire on non-homepage routes.
- [ ] **Existing contact form still works:** submit `/contact` form → still lands in Netlify dashboard's `contact` form (different name, no collision).
- [ ] **Visual styling note:** placeholder styling is intentional. A follow-up `/ui` session will refine the visual treatment.

After this checklist passes, hand off for the spec/code-quality reviews defined by `subagent-driven-development`.
