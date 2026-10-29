# Releases and rollback points

Production deploys from `main` through Vercel. Every merge to `main` is a deploy, so the merge commit
is the release identifier. Record each release here when it ships, with how it was verified.

| Date (UTC) | Commit on `main` | PR | What | Verified |
|---|---|---|---|---|
| 2026-10-29 | `97f5efba06cb6707020294f4708e39ac006a3e31` | #71 | Rate-page links in the footer and on the PK/BD guides; PKR rate FAQ reworded | Live HTML of all 24 URLs matched the tested build (0 differences); `npm run test:e2e` 14/14 against https://paidacross.com. |
| 2026-10-29 | `be45300fe199797778a9782f3566d8116f670535` | #70 | Financial correctness: capped and tiered fees, one ranking rule, reviewed NG/GE/PK corrections | Live HTML of all 24 sitemap URLs matched a local build of this commit (0 differences, numbers excluded); SEO gate vs the 39c6faa baseline: no removed headings, links or anchor IDs, titles/canonicals/robots/breadcrumbs/sitemap identical; `npm run test:e2e` 14/14 passed against https://paidacross.com. |
| 2026-10-29 12:47 | `39c6faa92c5c2140c74867ffe5ea232e219c9250` | #69 | Mobile UX iteration 2 | Live HTML of all 24 sitemap URLs matched a local build of this commit: routes, status codes, titles, descriptions, canonicals, robots, OG, JSON-LD, headings, breadcrumbs, links and all non-numeric text (numbers vary with hourly rates). |
| 2026-10-29 | `bef6577c88298ff753254d3dd4d6162138511c71` | #68 | Passbook redesign, iteration 1 | Smoke test of key routes after deploy. |
| 2026-10-29 | `5d869fc` | #67 | Last release before any redesign | n/a |

**Current production: `97f5efb`. Rollback point: `be45300`** (the release before it; `39c6faa` predates the fee-model change). The next release must not merge until the owner approves it.

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
