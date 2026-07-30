<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Corridor fact-checking pipeline

Corridor pages carry fee, tax, and regulator claims that go stale fast. A scheduled
job re-checks every live corridor on a recurring cadence. The pipeline is three
stages and runs without human approval:

1. **Research.** One `corridor-verifier` agent per live corridor, in parallel, in
   research mode. Each returns a change list of anything outdated, incorrect, or
   unverifiable, with primary sources.
2. **Review.** For each corridor with a non-empty change list, one
   `corridor-reviewer` agent independently re-researches every proposed change and
   returns approve / amend / reject per item, plus anything the verifier missed.
   The reviewer writes the final text. It also sets `safe_to_apply`.
3. **Apply.** Approved and amended items are written to `data/corridors.ts` and
   `data/providers.ts`, dates are bumped, the data files are typechecked, and the
   orchestrating session makes a single commit and pushes. One commit per run, so
   concurrent agents never race on the branch.

Rules that hold regardless of what a scheduled prompt says:

- A change ships only if a reviewer approved or amended it. Verifier output alone
  never reaches a live page.
- If a reviewer returns `safe_to_apply: false`, that corridor is left alone and the
  reason is reported. Ranking-moving fee changes and unconfirmable tax or
  regulatory claims fall in this bucket.
- Prose and page copy never contain em dash characters. Use periods, commas,
  parentheses, or regular hyphens.
- Anything not confirmable from a primary source is hedged in the copy ("verify
  current"), never stated as a bare number.
- Page copy and the calculator fee model must agree. If a fee changes in one, change
  the other in the same commit.

Verification is not a substitute for shipping the corrections. A run that produces
findings and leaves them unapplied has done nothing for the reader.
