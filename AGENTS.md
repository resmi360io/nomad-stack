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

1. **Brazil (BRL).** Blocking question: does a Brazilian resident, personal or PJ,
   get USD account details and a USD balance from Wise, or only a BRL payout with
   the client paying? This is NOT a case of one good source and one bad one. Two
   Wise help pages, both read on 2026-09-24 within the same minute, contradict each
   other outright. "Holding money if you live in Brazil"
   (wise.com/help/articles/7cUlHeJwqj6AHM69S8qRCA/...) says "If you live in Brazil
   and have a personal Wise account, you can add a currency and hold over 40
   currencies with us, including BRL. The same applies if you have a Wise Business
   account registered in Brazil." "Where do I need to live to hold money with Wise?"
   (wise.com/help/articles/2813542/...) lists under Additional restrictions:
   "Brazil - you can only hold BRL if you reside in Brazil." Do not resolve this by
   picking the one you prefer. Establish which is current, and if it cannot be
   settled, the page says Wise documents both and tells the reader to check in the
   app. Note also that holding a currency and being issued receiving details for it
   are different products, and the pages above address holding, not details. Second question: the current IOF rate on inbound export of
   services receipts, which changed more than once in 2025. IOF is a tax, not a
   provider fee, and must never be folded into `fxMarkupBps` or `percentageFee`.
   Do not add `BR` to `DEST_CURRENCIES_MAP`: the realistic USD holding options are
   offshore, not a domestic account.
2. **India (INR).** Blocking question: the same residency question, where the split
   is probably personal versus Wise Business. Note Wise's April 2025 India launch
   announced "international" account details, which may mean SWIFT rather than
   domestic ACH, and that changes both fee and speed. The page's real subject is
   FIRC versus FIRA versus eBRC and which providers supply one free. Be aware this
   is the most commercially contested receiving corridor there is, and that if Wise
   does not serve Indian residents the page is close to unmonetisable. Skydo's flat
   fee reportedly carries 18% GST on the fee itself, which the calculator has no
   field for. EEFC accounts require conversion by the end of the following month,
   so India probably does not get a `DEST_CURRENCIES_MAP` entry either.
3. **Colombia (COP).** Blocking question: whether inbound service export receipts
   must be channelled through the mercado cambiario with a declaracion de cambio,
   or fall in the free market. Read Resolucion Externa 1 de 2018 rather than a
   summary. Second question: whether a fintech USD balance counts as a cuenta de
   compensacion requiring registration and monthly reporting. Also establish per
   provider whether pricing is against the TRM or the interbank mid, because that
   gap is a spread the reader never sees and the model does not capture. `COP`
   belongs in the zero-decimal currency list in `formatAmount`.
4. **Uzbekistan (UZS).** Blocking questions: whether Wise and Revolut serve Uzbek
   residents at all, and what Payoneer's local withdrawal route is. The corridor's
   distinctive feature is the IT Park tax regime for IT service exporters and the
   e-resident programme, which is the reason the page would exist; get its current
   terms from itpark.uz and soliq.uz rather than from press coverage. Establish the
   currency rules from cbu.uz: whether a resident may hold and keep a USD account
   domestically, and whether any repatriation or forced conversion rule applies to
   service export receipts. Uzbekistan is a strong `DEST_CURRENCIES_MAP` candidate
   (`UZ: ['UZS', 'USD']`) if domestic USD accounts are confirmed, which would make
   it the third corridor after Georgia and Thailand where the page can price not
   converting. Local rails to check: Payme, Click, Uzum Bank, and the Humo and
   Uzcard national card schemes, none of which reach Visa or Mastercard rails.
   `UZS` belongs in the zero-decimal currency list.

None of the four can be drafted while the environment's network policy denies
primary sources. Three were researched on 2026-09-24 and every one returned zero
opened pages across roughly forty hosts, so the briefs are worklists, not data.
Do not draft a corridor from secondary sources to get it off this list. The
alternative route that has actually worked is the site owner capturing the pages
by hand: Mexico shipped because `wise.com/mx` and `revolut.com/es-MX` were
supplied as PDFs. One capture of the Wise eligibility page unblocks most of any
corridor here, because it answers the blocking question and covers the affiliate
rail at the same time.

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
