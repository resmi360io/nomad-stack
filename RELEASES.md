# Releases and rollback points

Production deploys from `main` through Vercel. Every merge to `main` is a deploy, so the merge commit
is the release identifier. Record each release here when it ships, with how it was verified.

| Date (UTC) | Commit on `main` | PR | What | Verified |
|---|---|---|---|---|
| 2026-10-30 | `df96bf48168d57c4e37e98011113ab502e0a39ae` | #78 | Rate pages: Payoneer fee wording aligned (item 19); Bing AI baseline | Live HTML of all 24 URLs matched the tested build (0 differences); `npm run test:e2e` 14/14 against https://paidacross.com. |
| 2026-10-30 | `3b205c746298f8b747642f46a32928ef8b0759c8` | #77 | Titles and descriptions; five review-based FAQs and Payoneer corrections (PK, BD, NG, PH); Payoneer 1 USD minimum (owner-approved); outreach agent; launch drafts | Live HTML of all 24 URLs matched the tested build (0 differences); `npm run test:e2e` 14/14 against https://paidacross.com. |
| 2026-10-30 | `77674a18c4272f35588718daf94f0b9a90c73528` | #76 | Calculator usage event `calc_run` (client analytics only); plan decisions | SEO diff of live vs the 2026-10-29 baseline: routes, statuses, robots, titles, canonicals, headings and links identical (only live-rate numbers differ); `npm run test:e2e` 14/14 against https://paidacross.com; `calc_run` present in the served bundle. |
| 2026-10-30 | `f68a11a613be580b814c753858fb9d4326515046` | #75 | Docs only: fourth video batch in KNOWLEDGE.md, promotion and backlink plan, audit steps 7a to 7c, disavow file committed | Key routes 200 after deploy; no site code changed. |
| 2026-10-30 | `4356e3a068c7e7e277cb838717ff6de0cca189fb` | #74 | Docs only: scheduled SEO host and trigger recorded, no-connector fallback in the seo-audit skill | Key routes 200 after deploy; no site code changed. |
| 2026-10-30 | `f1ac6441064980e939ada656e0c83579a0de66d1` | #73 | SEO agent: seo-analyst, seo-audit skill, `scripts/seo/`, KNOWLEDGE.md, first audit. No site code changed | SEO diff of live vs the 2026-10-29 baseline: routes, statuses, robots, titles, canonicals, headings and links identical (only live-rate numbers differ); `npm run test:e2e` 14/14 against https://paidacross.com. |
| 2026-10-29 | `9f06dcd9bfc1a9e2f9c59510448e94936ea571b2` | #72 | Title, meta and first-sentence pass on 7 page-1 corridors; SEO_PLAN refresh | Live HTML of all 24 URLs matched the tested build (0 differences); `npm run test:e2e` 14/14 against https://paidacross.com. Measure CTR at the 2026-11-23 checkpoint. |
| 2026-10-29 | `97f5efba06cb6707020294f4708e39ac006a3e31` | #71 | Rate-page links in the footer and on the PK/BD guides; PKR rate FAQ reworded | Live HTML of all 24 URLs matched the tested build (0 differences); `npm run test:e2e` 14/14 against https://paidacross.com. |
| 2026-10-29 | `be45300fe199797778a9782f3566d8116f670535` | #70 | Financial correctness: capped and tiered fees, one ranking rule, reviewed NG/GE/PK corrections | Live HTML of all 24 sitemap URLs matched a local build of this commit (0 differences, numbers excluded); SEO gate vs the 39c6faa baseline: no removed headings, links or anchor IDs, titles/canonicals/robots/breadcrumbs/sitemap identical; `npm run test:e2e` 14/14 passed against https://paidacross.com. |
| 2026-10-29 12:47 | `39c6faa92c5c2140c74867ffe5ea232e219c9250` | #69 | Mobile UX iteration 2 | Live HTML of all 24 sitemap URLs matched a local build of this commit: routes, status codes, titles, descriptions, canonicals, robots, OG, JSON-LD, headings, breadcrumbs, links and all non-numeric text (numbers vary with hourly rates). |
| 2026-10-29 | `bef6577c88298ff753254d3dd4d6162138511c71` | #68 | Passbook redesign, iteration 1 | Smoke test of key routes after deploy. |
| 2026-10-29 | `5d869fc` | #67 | Last release before any redesign | n/a |

**Current production: `df96bf4`. Rollback point: `3b205c7`** (prose-only release before it). The last release before today's data and copy changes is `77674a1`.

## How to roll back

1. **Fastest, no code change:** in Vercel, open the project's Deployments, find the production
   deployment built from the commit above, and use Instant Rollback (Promote to Production).
   This changes what is served immediately; `main` is untouched, so fix forward afterwards.
2. **Through git:** revert the bad merge commit on a branch, open a PR, merge. Vercel then deploys
   the reverted state. Do not force-push `main`.

Git tags for these commits could not be pushed from the cloud session (the git proxy only allows
pushes to the working branch). Commits on `main` are immutable history, so the SHAs above are the
durable reference; the owner can add tags from a local clone if wanted.

The scheduled verification rotation also merges to `main`. If it ships after a release, its commit
becomes the newest production state: check `git log origin/main` before rolling back, so a rollback
does not silently undo a fact correction.
