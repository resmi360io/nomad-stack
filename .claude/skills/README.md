# Project skills

These skills load in any Claude Code session that starts with this repository checked out, including
cloud sessions and the scheduled rotation host. Third-party skills are vendored copies of the upstream
files at the commit below, reviewed before they were added. To update one, re-copy it from the same
source and record the new commit here.

| Skill | Source | Commit | License |
|---|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills), `skills/frontend-design` | `ca45fc496a3436251f191354091d557da31c15b5` | Apache 2.0 (`LICENSE.txt`) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), `.claude/skills/impeccable` | `5e745ace7e151feb2a93d360d0281fe39448b857` (skill 4.8.0, engine 0.1.18) | Apache 2.0 (`LICENSE`, `NOTICE.md`) |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), `skills/react-best-practices` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | MIT (declared in `SKILL.md` frontmatter) |
| `humanizer` | in-repo | n/a | n/a |
| `browser-screenshots` | in-repo, written for this environment | n/a | n/a |

## Notes on what each one runs

- **frontend-design** and **vercel-react-best-practices** are instructions only. They run nothing.
- **impeccable** runs `scripts/impeccable`, a POSIX shell launcher for a native engine binary. The
  binary is not vendored here. On first use the launcher downloads it from the project's GitHub
  releases (`engine-v0.1.18`) into a user-level cache and checks it against
  `scripts/engine-checksums.txt` before running it. The linux-x64 asset was downloaded and its SHA-256
  confirmed to match on 2026-10-29. It was not executed during setup.
- Impeccable's upstream installer (`npx impeccable install`) also offers a design-detector **hook** that
  runs the engine after every UI file edit. That hook is deliberately **not** configured here. Turn it on
  later with `/impeccable hooks on` if wanted, after reading `impeccable/reference/hooks.md`.
- Impeccable's **live mode** (`/impeccable live`) injects an overlay into a local dev server and needs an
  interactive browser. It does not suit headless cloud sessions; use `browser-screenshots` there instead.

## AGENTS.md still governs content

Design skills change markup and styling. Any reader-facing copy they touch still follows AGENTS.md:
no em or en dashes, the humanizer on new copy, fees and copy in agreement, `updatedDate` bumped on
corridors whose copy changed, and `npm run build` before committing.
