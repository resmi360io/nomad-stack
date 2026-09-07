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
3. **Apply.** The orchestrating session, not an agent, writes approved and amended
   items to `data/corridors.ts` and `data/providers.ts`, bumps dates, typechecks the
   data files, and makes a single commit and push. One commit per run, so concurrent
   agents never race on the branch. All three agents are read-only and have no edit
   tools, so a finding cannot reach a live page without passing through review and a
   human-visible commit.

## New corridor pipeline

One new corridor a week, and it goes through the same gates as a correction, with
an extra stage at the front. All four agents are read-only; the orchestrating
session does every write.

1. **Research.** A `corridor-researcher` agent on the target corridor. It returns
   providers, receiving rails, fees, compliance documents, regulators, limits and
   the questions people actually ask. Point it at any known data problems first: a
   corridor usually reaches this stage because something already blocked it.
2. **Draft.** The orchestrating session writes the page from the brief. Run the
   `humanizer` skill over the copy before it goes anywhere. This is mandatory for
   new corridors and for every copy change to an existing one.
3. **Verify.** A `corridor-verifier` agent on the draft, exactly as it would check
   a live page. A draft has never been read by anyone else and deserves more
   scrutiny than a page that has survived several passes, not less.
4. **Review.** A `corridor-reviewer` agent on the verifier's change list, with the
   same authority it has over live pages. It sets `safe_to_apply`, and a corridor
   that comes back false does not ship.

### What a new corridor has to touch

Adding an entry to `CORRIDORS` propagates automatically to three places: the
corridor table on `/receive-international-payments`, `generateStaticParams` for the
page route, and `app/sitemap.ts`. Nothing else is automatic, and every item below
has been missed at least once:

- `siblingCorridors` on the new corridor, and on the existing corridors that should
  now point back at it. Unknown slugs are silently dropped rather than erroring, so
  a typo costs you the link with no warning.
- `supportedProviders` must match the set that can actually produce a quote. If a
  provider is listed but has no fee row, the guides page advertises a count larger
  than the table renders. Check by running `calculate()`, not by reading the array.
- Provider coverage in `data/providers.ts`: the destination country in
  `supportedDestinationCountries`, and a corridor fee row for the pair. A provider
  with the country but no row falls back to a generic estimate, which now surfaces
  as `fxMarkupEstimated` and is barred from the best value badge.
- `DEST_OPTIONS` in `components/CalculatorForm.tsx`, if the destination country is
  not already offered.
- `DEST_CURRENCIES_MAP` in `lib/calculate.ts`, if the destination lets a recipient
  hold foreign currency instead of converting. Without it the page can only price
  conversion, which on some corridors is the option the page argues against.

Verify a new page by hand on the day it ships. The rotation will not reach it for
up to six days, and that is exactly the window in which it is least trustworthy.

## Verification rotation

Every live corridor is re-checked once a week. The scheduled job runs daily and
verifies only the corridors assigned to that weekday, by this rule:

  the corridor at index i in CORRIDORS is verified on weekday (i mod 7),
  counting Monday as 0.

That self-balances as corridors are added, with no schedule edit needed. With 8
corridors Monday takes 2 and every other day takes 1. With 42 it is 6 a day.
With 100 it is 15, 15, 14, 14, 14, 14, 14. Adding a corridor to the end of the
file slots it into the lightest day automatically.

Two consequences worth knowing. Index is file order, so reordering CORRIDORS
reshuffles the rotation, which is harmless but will make a corridor skip or
repeat a week. And a corridor added today is not checked until its weekday comes
round, so a newly published page can go up to six days before its first pass.
Verify a new page by hand on the day it ships rather than waiting for the job.

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
