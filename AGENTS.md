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

**The queue is empty.** India, Uzbekistan and Colombia were the last three on it and all
three are live, as are South Africa, Argentina and Poland since 2026-10-23 and Ukraine since
2026-10-26. Nobody deleted
the India and Uzbekistan lines when they shipped on 2026-09-25, so for three days this
section told sessions to research corridors that already existed. Delete the line when the
corridor ships, not later.

Before adding a corridor here, note what the last three cost, because the estimate
this section used to imply was wrong. Each one takes a research pass, a draft, a
humanizer pass, a verifier, a reviewer, AND an owner decision. South Africa,
Argentina and Poland shipped together on 2026-10-23 and the numbers were: 145
atomic claims checked, 102 verified, 24 incorrect, 6 outdated, 12 needing a hedge.
Per corridor that is 38 to 60 claims and 7 to 9 real errors in a draft that felt
finished. Earlier rounds ran the same way: Brazil thirteen, Colombia five, the Wise
dollar rows eight. Budget for that rather than for a page.

Four things that round taught, beyond the provider-specific traps below:

- EXPECT TO NEED THE OWNER, once per corridor, and plan the run around it rather
  than discovering it at the end. All three reviewers returned `safe_to_apply:
  false`, and all three did so for the same structural reason: the cheapest row on
  a page decides the best value badge, so any correction to it is ranking-moving by
  definition, and ranking-moving changes are reserved for a human. A new corridor's
  cheapest row is also the one most likely to be wrong, because it is the one worth
  getting wrong. So a new corridor cannot ship agent-only, and a run that assumes it
  can will stall holding finished work. Ask the question as soon as the reviewer
  names it, with the ranking consequence computed, not described.
- RUN THE HUMANIZER AGAIN AFTER APPLYING REVIEWER TEXT, not only over the draft.
  The Poland reviewer rebuilt the intro from the scratchpad script that had written
  the original entry, which was the PRE-humanizer version, and so reintroduced a
  signposting line removed two days earlier. Reviewer prose is new copy and gets the
  same pass as any other.
- PASS THE VERIFIER'S JSON TO THE REVIEWER, verbatim. The Poland reviewer opened its
  report saying the change list never reached it: it was given a prose summary of the
  thirteen items and had to reconstruct the draft from `scratchpad/pl.py` to work at
  all. It still did good work, but its locators were descriptive rather than copied,
  which pushed the mapping back onto the orchestrator and is exactly where a wrong
  string gets written. The two agents are the gate; do not narrate between them.
- WHEN A DRAFT SAYS A PROVIDER CANNOT DO SOMETHING, that needs a primary source as
  much as a fee does. Argentina asserted in four places that Wise cannot pay out
  pesos. It can. Nobody had asked for the source because a negative does not look
  like a claim.

Two things to carry into the next one, learned the hard way on these:

- A provider's pricing endpoint is not a provider's price, and the cross-currency exemption this
  bullet used to grant is withdrawn. Wise's `v1/price` grid has failed three ways. First, it is
  destination-BLIND for USD to USD: passing `targetCountry` returns an identical fee map with no
  destination field, which shipped an Uzbekistan price 55% too low. Second, it returned a Georgia
  fee that was never a Georgia send figure at all, but Wise's own INBOUND receive fee. Third, on
  2026-10-20 it produced a ZA/ZAR pair, 7.79 at a thousand and 25.31 at five thousand, that
  matches NOTHING on Wise's public send page for South Africa: that page shows 7.46 from a Wise
  balance, 9.47 by direct debit and 13.87 by bank transfer at a thousand, and publishes no second
  amount at all, so the percentage half of the pair had no public corroboration anywhere. It won
  the best value badge on the strength of that.
  The rule, then: a number from this endpoint does not ship until Wise's own public send page for
  that corridor shows it. One amount agreeing is worth something; a fixed-plus-percentage split
  derived from two endpoint reads and no public second amount is worth nothing, because the whole
  percentage component is unfalsifiable. Poland is the nearest thing to a pass in this batch, and
  note how narrow it is: the endpoint's fees matched the send page exactly at the one amount that
  page shows, across the four funding methods it displays, and nothing cross-checks its
  percentage component either.
  Separately, do NOT conclude from a missing product that a provider cannot do the thing. On
  2026-10-20 this endpoint returned 61 priced USD to ARS options and Wise's US send page offers a
  waiting list for sending pesos to Argentina, and an earlier version of this bullet recorded that
  as the endpoint pricing a product that does not exist. That was wrong, and the error was mine
  rather than the endpoint's. Wise's own help article for ARS transfers says "You can send ARS to
  any bank account in Argentina", capped at the equivalent of 18,000 USD per transfer per calendar
  month, funded only "by converting another currency you hold with Wise" and explicitly not from
  an external bank account. So the peso payout exists; what is missing is the one-step US send.
  The endpoint's real sin here is that it prices a capability without saying which pay-in legs can
  reach it, which is the same blindness as failure one wearing a different hat. Read the help
  centre for the destination currency before declaring a route impossible, and when a corridor
  page asserts a provider CANNOT do something, that assertion needs a source exactly as much as a
  fee does.
- Do NOT cross-check a provider's mid against a central bank fixing. An earlier version of the
  bullet above claimed the Poland row was trustworthy because Wise's returned mid "matched NBP
  to four decimals", and offered that as the standard for a passing check. It is false twice
  over. Wise returned 3.8829 on 2026-10-20 against NBP table A 204/A/NBP/2026 of 3.8959, a 0.33%
  gap, and the match could never have happened anyway: NBP table A is a once-daily 11:00 fixing
  and a provider's live mid is a different kind of number. The verifier caught this on a draft,
  which is the gate working, but the claim had already been committed here.
  The real reason a Wise row records zero markup is structural and is the same on every corridor
  on this site: Wise converts at its live mid and takes its revenue as an explicit separate fee,
  so there is no spread to find. That is what to write, and it needs no rate comparison at all.
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

## Provider rate pages (`/rates/[pair]`) are NOT in the rotation yet

Added 2026-10-26. `data/ratePages.ts` holds provider-specific pages targeting the one query
pattern this project has measured demand for: the 2026-06-14 GSC read found USD to PKR already
ranking around position 33 for "payoneer exchange rate usd to pkr" and "usd to pkr payoneer rate
today", and nothing on the site targeted it for four months. First page is
`/rates/payoneer-usd-to-pkr`.

Second page, same day: `/rates/payoneer-usd-to-bdt`, on GSC evidence that the BDT corridor page
already ranked for "payoneer dollar rate in bangladesh today" (about 25) and "payoneer exchange
rate usd to bdt" (about 32). Its prose is copied from the `usd-to-bdt` corridor entry, so a
rotation correction to that entry's Payoneer or bKash figures must be carried to the rate page by
hand. The same applies to `/pay-freelancers-internationally` (the sender-side page, built for
queries that were landing on the receive pillar) and to the homepage and pillar prose: all of
them restate corridor facts, and only their `CorridorTable` column updates itself.

Two things to know before touching them.

- THE FEE NUMBERS LOOK AFTER THEMSELVES, the prose does not. The table on a rate page calls
  `calculate()` against the same `data/providers.ts` row the corridor page uses, so when the
  rotation corrects a provider's fee row the rate page moves with it in the same commit, with no
  second edit. That is deliberate. But the rotation selects work from `CORRIDORS` only, so the
  INTRO, the rate note and the FAQs on a rate page are currently verified by nobody, and they
  carry claims (what a provider does and does not publish, which banks a withdrawal reaches).
  Until the rotation covers them, treat a rate page's prose as going stale silently.
- DO NOT MULTIPLY THEM YET. One hand-written page against a measured query is not programmatic
  SEO; twenty generated ones are, and the pSEO gate in this file still fails on three of its four
  conditions (no editorial backlinks, no top-30 rankings, no 8-week impression trend). Add the
  next rate page only when there is GSC evidence for the specific provider and pair, the same way
  this one had it.

One per-page trap, found by rendering the first one rather than reading it: `effectiveFeePercent`
on a `Quote` is the EXPLICIT fee only and ignores `fxMarkupBps`. Printed under a "total cost"
heading it reported 1.00% for a Payoneer row that really costs about 3.57%, because 260bps of
markup is most of the cost. The rate page now derives all-in cost as the net measured against
what the mid rate alone would have paid. Any new surface that shows a "total" must do the same.

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

### FIXED on 2026-10-23: the rotation now runs in a persistent host that starts with the repo

Read this before touching the rotation, because the four failures below are history
and the fix is not obvious from them.

The real cause under failures 3 and 4 was one thing: project agents in `.claude/agents/`
load only when a session STARTS, and every scheduled run from 2026-10-16 onward started
with no repository. So `corridor-verifier`, `corridor-reviewer` and `corridor-researcher`
could not exist for it, cloning mid-run could not create them, and the session has no
`register_repo_root` to reload project config afterwards. Every prompt-side workaround was
treating a symptom.

What is in place now:

- A standing host session created WITH `source_url` pointing at this repo, so the checkout,
  the three agents, the `humanizer` skill and AGENTS.md all load normally. This was verified
  by a throwaway diagnostic session before anything was rewired, not assumed, and then
  verified again END TO END: a one-shot trigger bound to the host woke it through the
  scheduler on 2026-10-23, and it reported the checkout at HEAD 51f457f, all three named
  agents and the humanizer present, and computed the day's rotation set itself as
  `usd-to-gel` and `usd-to-inr`. That is the first scheduled wake in this project's history
  that arrived with working agents.
- DO NOT USE `fire_trigger` TO TEST OR RUN THIS, and do not read a fire_trigger result as
  evidence about the rotation. Fired manually on 2026-10-23, this trigger did NOT wake the
  host: it minted a brand new session with `origin: force_run_trigger` carrying the old
  `config:no-git-repo` tag, which reproduced the original failure in 43 seconds for $0.12 and
  proved nothing. Only the scheduled path honours `persistent_session_id`. To test it out of
  hours, create a one-shot trigger with `run_once_at` bound to the host, which does go
  through the scheduler.
- A daily trigger bound to that host by `persistent_session_id`, firing at the same 09:07.
- The old trigger DISABLED and renamed, not deleted, so this is reversible.
- The host runs on Sonnet on purpose. The orchestrator is the cheap part; the named agents
  specify opus in their own definitions, so they come up on opus regardless. The old
  general-purpose fallback is gone and must not come back: it handed write tools to agents
  whose whole guarantee was being read-only.

Four things about this shape that will bite if you forget them:

- NO COMPLETION NOTIFICATIONS. The service rejects the `notifications` field for a trigger
  bound to a persistent session. The owner's only signals are the run's report and the pull
  request, which is why the prompt ends by saying so. If notifications matter more than the
  fix, the alternative is the product-side change below.
- THE WORKING TREE PERSISTS between runs, unlike a fresh session. The prompt therefore starts
  every run with `git fetch origin main` and `git checkout -B <branch> origin/main`. Without
  that a run eventually builds on the last one's leftovers.
- CONTEXT ACCUMULATES in the host across runs and will compact. If its work degrades, create
  a NEW host session with `source_url` and a new trigger bound to it: `update_trigger` cannot
  move `persistent_session_id`, so repointing means a new trigger and disabling the old one.
- THE HOST SHARES THE BRANCH with interactive sessions, so pushes can collide. The prompt
  tells it to do its git work in one go and to rebase its single commit rather than force-push
  over anyone.

The tidier fix is still product-side and still needs the owner: attach `resmi360io/nomad-stack`
to a Routine or to its environment, which would let the rotation go back to a fresh session per
run AND keep notifications. It cannot be done from here. `create_trigger` has no sources field,
`update_trigger` cannot set one, there is no create-environment tool, and all four environments
on this account are named "Default" with `sources: []`.

### The scheduled job had failed five different ways. Check it, do not assume it.

Before the fix above it had never once shipped a corridor correction. Five distinct causes, and
each looked like success from the outside:

1. **Nowhere to ship to** (until 2026-10-01). Its prompt committed to a feature
   branch and forbade opening a pull request, so corrections sat unmerged by
   construction. Fixed: it now merges to main itself.
2. **No budget** (28 to 30 September). Rejected on the seven-day account quota
   after an interactive session spent it. See the section below.
3. **No repository** (observed 2026-10-16 and 2026-10-19, and the cause is still
   on the Routine). The Routine's `session_request.config.sources` is `[]`, so it
   declares no source repo and a fresh session can start with none. Both sampled
   runs carried the session tag `config:no-git-repo`, spent about $2.40 and eight
   or nine minutes each, and could not read `AGENTS.md` or `CORRIDORS`, let alone
   commit. A session with no code is also at risk of "verifying" corridors from
   memory and search, which this project forbids.

4. **No agents, and cloning cannot fix it** (2026-10-20). The run did clone the
   repo, then could not find `corridor-verifier`, `corridor-reviewer` or
   `corridor-researcher`. Those three live in `.claude/agents/` INSIDE this repo,
   and project agent definitions load when a session STARTS. A session that begins
   without the repo can never acquire them by cloning, and the scheduled session's
   tool list has `add_repo`, `check_repo_access` and `list_repos` but NOT
   `register_repo_root`, which is the only tool that reloads project config after a
   mid-run clone. So the whole pipeline was unreachable.

   The fallback now in the prompt: read each definition file, drop the YAML
   frontmatter, and pass the body verbatim to a `general-purpose` agent with
   `model: opus`, since the files specify opus while the scheduled session runs on
   Sonnet. This loses one real guarantee. The named agents are read-only by
   construction, holding only Read, Grep, Glob, WebSearch and WebFetch; a
   general-purpose agent can write files, so the prompt adds an explicit read-only
   instruction and the orchestrator stays the only writer. Treat that as weaker
   than the real thing, and keep the verifier and the reviewer as separate agents
   whatever path is used, because their independence is the entire gate.

The prompt now checks for the checkout first and calls `add_repo` if it is
missing, then stops rather than spending anything, and expects the agents to be
missing rather than discovering it mid-run. Both are workarounds from the prompt
side. The durable fix for all of it is attaching `resmi360io/nomad-stack` to the
Routine or its environment so a run STARTS with the repo, which makes the agents
load normally; the trigger tools here cannot set that field.

Worth knowing for anything else built this way: an agent, skill or plugin that
lives in the repo is unavailable to any session that starts without the repo. If
the rotation needs to be robust, those definitions belong at the account level
rather than in `.claude/`.

5. **Full price, still nothing** (2026-10-22). The clearest evidence that the guard in
   the prompt was never a fix. That run still carried `config:no-git-repo`, but it did
   NOT stop early: it spent $5.41 over 12.7 minutes, 153k output tokens, and `main` did
   not move. The day before, on 2026-10-21, an identical setup stopped after 35 seconds
   for $0.12. Same cause, same outcome, cost varying by a factor of forty. So do not read
   a cheap run as the guard working or an expensive one as real progress: only `main`
   moving tells you anything.

So: never read a green `last_run` as proof the job worked. Check the session, and
check whether `main` actually moved. Eleven days passed between 2026-10-08 and
2026-10-19 with daily runs, real money spent, and not one commit, and another four
days followed that.

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
