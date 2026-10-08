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

### The queue

Take the next corridor from the top of this list. When one ships, delete its line.
Order is the decision, so do not reorder it to pick an easier corridor: a corridor
sitting at the top because it is hard is exactly the one worth doing.

**The queue is empty.** India, Uzbekistan and Colombia were the last three on it and
all three are live. Nobody deleted the India and Uzbekistan lines when they shipped on
2026-09-25, so for three days this section told sessions to research corridors that
already existed. Delete the line when the corridor ships, not later.

Before adding a corridor here, note what the last three cost, because the estimate
this section used to imply was wrong. Each one took a research pass, a draft, a
humanizer pass, a verifier and a reviewer, and each verifier found real errors in a
draft that felt finished: Brazil thirteen, Colombia five, and the Wise dollar rows
eight, most of which tilted toward the provider that pays us commission. Budget for
that rather than for a page.

Two things to carry into the next one, learned the hard way on these:

- A provider's pricing endpoint is not a provider's price. Wise's `v1/price` grid is
  destination-BLIND for USD to USD: passing `targetCountry` returns an identical fee
  map with no destination field. It shipped an Uzbekistan price that was 55% too low
  and, separately, a Georgia fee that was never a Georgia figure at all. Its pay-in
  leg is usable because an ACH pull does not depend on the destination; its SWIFT
  constant never is.
- A provider whose site blocks you stays out of the priced table. That is the standard
  Global66 set on Colombia and GCash was held to on the Philippines. Being blocked is
  not the same as having the data, and a zero you cannot open ranks first at every
  amount.

Network access was opened on 2026-09-24 and curl now reaches every host tried,
so these are buildable. Two cautions carried forward from the day it was closed.

Bash curl and WebFetch are governed separately and have disagreed. On 2026-09-24
curl returned 200 everywhere while WebFetch returned EGRESS_BLOCKED on every
host including `example.com`, because WebFetch captured the network policy when
the session started and never refreshed. That matters because the subagents hold
only Read, Grep, Glob, WebSearch and WebFetch, with no Bash, so a session in that
state cannot research anything through them. Probe both before spending agents.
When WebFetch is stale, the workaround is to mirror the pages with curl into the
scratchpad, strip them to text, write a manifest recording each file's source URL
and fetch time, and point the agents at those files: they are full primary source
texts, not snippets, and citing them is legitimate as long as the manifest travels
with them.

Never draft a corridor from secondary sources to get it off this list. India and
Colombia were first researched on 2026-09-24 while the policy was closed, and
both briefs came back with zero opened pages across roughly forty hosts, so those
are URL worklists rather than data. Brazil shipped on 2026-09-25 only after a
research pass that opened real sources, and its verifier still found thirteen
incorrect items in the draft, which is the standard to hold the rest to. The other
route that has worked is the site owner capturing pages by hand: Mexico shipped
because `wise.com/mx` and `revolut.com/es-MX` were supplied as PDFs.

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
- A NEW CURRENCY breaks the build in two places that no amount of `tsc` on the data
  files will catch, because both live outside them: the `Record<Currency, number>`
  literals in `hooks/useLiveRates.ts` and in `lib/fetchRates.ts`. Both are exhaustive,
  so adding a member to the `Currency` union without adding the currency to both is a
  hard type error. Brazil shipped to production with this broken on 2026-09-25 and the
  Vercel build caught it, not us.
- `CURRENCY_LABELS` in `components/CalculatorForm.tsx` is the third exhaustive record
  over `Currency`, and it renders to readers, so it must be free of em and en dashes.

RUN `npm run build` BEFORE COMMITTING, not just `tsc` on the data files. Typechecking
`data/corridors.ts` and `data/providers.ts` in isolation passes happily while the app
does not compile, which is exactly how the above reached production. `npm run build`
also proves `generateStaticParams` emits the corridor you just added: check the route
list at the end of the output for it.

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
- Bump `updatedDate` on every corridor whose reader-facing copy you changed, in the
  same commit. This applies to interactive work exactly as much as to the scheduled
  job, and it was previously written down only in the job's prompt, which is why
  seven corridors spent ten days claiming a date that predated their own content.
  `updatedDate` is not internal bookkeeping: it renders twice on the page and feeds
  the schema.org `dateModified`, so a stale one is a false freshness claim made to
  readers and to search engines. If you are unsure which corridors a change touched,
  diff `data/corridors.ts` against the last release and attribute each added prose
  line to the corridor block it falls in, rather than trusting your memory of what
  you edited.

Verification is not a substitute for shipping the corrections. A run that produces
findings and leaves them unapplied has done nothing for the reader.

The scheduled job merges its own work to main. The owner authorised that on
2026-10-01: a reviewer-approved or reviewer-amended change goes to production
without waiting for a human, because the reviewer gate is what authorises
shipping. It refuses to merge when `npm run build` fails, when an item has no
reviewer approval, or when a reviewer returned `safe_to_apply: false`, and in
those cases it pushes the branch and reports the blocker instead. Before
2026-10-01 it committed to a feature branch and was told not to open a pull
request, so its corrections sat unmerged by construction, which is the failure
the paragraph above forbids.

### Interactive work and the scheduled job share one weekly budget

This has already cost three days of verification, and it is invisible unless you
look for it. Heavy interactive sessions consume the same seven-day account quota
the rotation needs. On 2026-09-27 and 2026-09-28 a long session spent most of the
week's budget, and the runs on 28, 29 and 30 September were rejected before doing
any work. The weekly window reset at 2026-09-30 12:00 UTC, after that morning's
run had already failed.

Two traps when checking whether the job is healthy:

- `list_triggers` is not a health check. It reported `last_run.status: SUCCEEDED`
  for the 30 September run while the session itself was `status_bucket: FAILED`
  with `status_detail: "You've hit your weekly limit"`. SUCCEEDED means the wake
  was delivered, not that the turn worked. Read the session with `get_session` on
  the `session_id` in `last_run`, and look at `post_turn_summary` and
  `rate_limit_info`.
- Do NOT judge a run by the Routine's `finished_at`. An earlier version of this
  section said anything finishing under a few minutes did not do the work. That is
  wrong: `finished_at` tracks the wake delivery, not the turn. On 2026-10-08 the
  Routine recorded `finished_at` 103 seconds after firing while the session's own
  `updated_at` showed it still working 7.5 minutes in, having spent $2.69 and 112k
  output tokens. Applying the old rule would have declared a healthy run dead.
  What actually tells you, all from `get_session` on the `session_id` in `last_run`:
  `status_bucket` (`FAILED` versus `REVIEW_READY`), `rate_limit_info.status`
  (`rejected` versus `allowed`), `usage.cost_usd` and `usage.output_tokens` (a real
  run spends dollars, not cents), and `updated_at` minus `created_at` for how long
  it actually ran.

So after a long interactive push, check the Routine's last run rather than
assuming it is fine, and expect nothing useful from it until the weekly window
turns over. If a rotation day is missed the corridor waits another week, unless
someone runs it by hand.
