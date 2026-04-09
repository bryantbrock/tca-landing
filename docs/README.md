# Trinity Classical Academy — Product Docs

This folder is the product-management layer of the repo. It lives alongside
the code but isn't part of the build — it's for planning, tracking, and
remembering why we're building what we're building.

## Why these docs exist

Short form: so we don't lose context between sessions.

Longer form: this project is a fresh rebuild of the Trinity Classical Academy
website. The old site (trinityclassical.academy) has a lot of content that's
going to get pulled forward, and a lot of services embedded in it (Formaloo,
Issuu, ClassReach, GivingFuel). We'll need to decide case by case what to
recreate natively in this codebase, what to keep as an external embed, and
what to retire. These docs keep a running record of those decisions.

## What's in here

| File                      | Purpose |
|---                        |--- |
| `roadmap.md`              | The master prioritized task list. Start here when deciding what to work on next. |
| `existing-site.md`        | Findings from auditing trinityclassical.academy — nav structure, content, embedded services, what's worth keeping. |
| `navigation.md`           | Current nav on the new site + proposed structure for when more pages ship. |
| `pages/`                  | One markdown file per page we plan to build. Each file contains sections, content notes, open questions, references to the existing site, and a checklist. |

## Conventions

- **Keep it practical.** These docs are for guiding work, not exhaustive
  specifications. Bullet points and checklists beat prose.
- **Mark open questions clearly** with `> TODO: ...` or `> QUESTION: ...`.
- **Link back to the existing site** when content is being carried forward, so
  we always know where the original lives.
- **Don't duplicate the design system** — it lives in `tailwind.config.mjs`
  and the component files. If a page plan needs a new token, note it in the
  plan but let the code be the source of truth.

## How to use these docs while working

1. Open `roadmap.md` to see what's next.
2. Pick a task; if it has a corresponding `pages/*.md`, read that.
3. Implement.
4. Update the task's checkbox in `roadmap.md` and any resolved items in the
   page plan.
5. If you discover something new that needs to happen, add it to `roadmap.md`
   right away so it doesn't get lost.
