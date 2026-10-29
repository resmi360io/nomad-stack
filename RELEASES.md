# Releases and rollback points

Production deploys from `main` through Vercel. Every merge to `main` is a deploy, so the merge commit
is the release identifier. Record each release here when it ships, with how it was verified.

| Date (UTC) | Commit on `main` | PR | What | Verified |
|---|---|---|---|---|
| 2026-10-29 12:47 | `39c6faa92c5c2140c74867ffe5ea232e219c9250` | #69 | Mobile UX iteration 2 | Live HTML of all 24 sitemap URLs matched a local build of this commit: routes, status codes, titles, descriptions, canonicals, robots, OG, JSON-LD, headings, breadcrumbs, links and all non-numeric text (numbers vary with hourly rates). |
| 2026-10-29 | `bef6577c88298ff753254d3dd4d6162138511c71` | #68 | Passbook redesign, iteration 1 | Smoke test of key routes after deploy. |
| 2026-10-29 | `5d869fc` | #67 | Last release before any redesign | n/a |

**Current rollback point: `39c6faa`.** The next release must not merge until the owner approves it.

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
