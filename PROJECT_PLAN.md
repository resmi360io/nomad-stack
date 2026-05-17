# PROJECT_PLAN.md — Nomad Payments Calculator (Test 1A)

## 1. Project Context

**What:** Single-page web app that compares the cost of receiving international payments across 7 providers, for digital nomads / remote freelancers.

**Why:** Top-of-funnel for a broader "Nomad Payments Stack" affiliate business. Test 1A of a 14-day kill-criteria validation experiment. Optimizing for **speed-to-ship**, not feature completeness or production engineering.

**Audience:** Digital nomads, remote freelancers; people who get paid in one currency and live in another. Pain: opaque PSP fees + FX markups eat 3–7% of every payment.

**Monetization:** Affiliate revenue (Wise, Revolut, Payoneer, etc.). No paid product in Test 1A.

**User flow:**
1. Land on page
2. Enter: source country, destination country, amount, source currency
3. Click "Compare options"
4. See ranked table of 7 providers with fees, FX rate, net received, time, affiliate CTA
5. Click "Open account →" (affiliate link)

## 2. Stack & Decisions Locked

| Decision | Value | Notes |
|---|---|---|
| Framework | Next.js (latest stable) | User said "16" — `create-next-app@latest` already installed; verify version with `node -p "require('./package.json').dependencies.next"` from project root |
| Router | App Router | |
| Language | TypeScript | |
| Styling | Tailwind CSS v4 (came with `create-next-app@latest`) | `@tailwindcss/postcss` in devDeps |
| Components | shadcn/ui | **NOT YET INSTALLED** — install in Phase 1 continuation |
| Hosting | Vercel | Deploy via `vercel` CLI in Phase 5 |
| Analytics | Plausible | User adds script tag manually post-deploy |
| State | `useState` only — no Zustand, no Redux | |
| Data | Hardcoded TS object at `/data/providers.ts` | No DB, no API routes, no CMS |
| Project root | `D:\dev\nomad-stack` | Already scaffolded |
| Folder layout | Flat (no `src/`) | `/app`, `/components`, `/lib`, `/data` at repo root |
| Import alias | `@/*` | |
| Domain | Suggested **nomadfees.com** (paidabroad.com / feecompare.io as alts) — user to confirm and register |

## 3. Current State (where Phase 1 left off)

### Done
- ✅ `D:\dev\nomad-stack` created via `create-next-app@latest`
- ✅ TypeScript, Tailwind, App Router, ESLint configured
- ✅ Git initialized + initial commit (auto by create-next-app)
- ✅ Dependencies installed (359 packages)

### Outstanding for Phase 1
- ⏳ Verify Next.js version matches user's "16" intent
- ⏳ Install shadcn/ui: `npx shadcn@latest init -d`
- ⏳ Add components: `npx shadcn@latest add button card input select label`
- ⏳ Create folders: `/lib`, `/data`, `/app/how-we-make-money`
- ⏳ Create `.env.example` (empty placeholder)
- ⏳ Create stub `/app/how-we-make-money/page.tsx`
- ⏳ Commit Phase 1 additions
- ⏳ Stop and report to user

## 4. Open Questions (resolve before/during execution)

1. **Next.js version** — Confirm installed version with user. If `@latest` pulled 17 and user wanted strict 16, may need to downgrade.
2. **Plausible domain** — User will provide post-deploy. Defer to Phase 5.
3. **Affiliate IDs** — User to apply post-launch. Use `[REPLACE_AFFILIATE_ID]` placeholders throughout.
4. **Final domain registration** — User to register before Phase 5 deploy. nomadfees.com is the recommendation.

## 5. Phase-by-Phase Execution Plan

### Phase 1 (continuation, ~10 min remaining)

```bash
cd /d/dev/nomad-stack
node -p "require('./package.json').dependencies.next"   # verify version, report to user
npx shadcn@latest init -d                                # defaults: New York, Neutral, CSS vars
npx shadcn@latest add button card input select label
mkdir -p lib data app/how-we-make-money
```

Then create:
- `.env.example` — empty file with comment header for future affiliate IDs
- `/app/how-we-make-money/page.tsx` — stub page (real content in Phase 4)

Commit: `git add -A && git commit -m "Phase 1: scaffold + shadcn + folder structure"`

**Stop and report** — list what's done, confirm Next.js version with user.

### Phase 2: Fee data model (~30 min)

Create `/data/providers.ts` with this TS schema:

```ts
export type Currency = 'USD' | 'GBP' | 'EUR' | 'GEL' | 'MXN' | 'THB' | 'IDR';
export type CountryCode = 'US' | 'GB' | 'EU' | 'GE' | 'PT' | 'MX' | 'TH' | 'ID';

export interface CorridorFee {
  source: { country: CountryCode; currency: Currency };
  destination: { country: CountryCode; currency: Currency };
  fixedFee: number;          // in source currency
  percentageFee: number;     // 0.01 = 1%
  fxMarkupBps: number;       // basis points above mid-market (50 = 0.5%)
  typicalHours: number;      // time to arrive
  minAmount?: number;
  maxAmount?: number;
  notes?: string;
}

export interface Provider {
  slug: string;
  name: string;
  logoUrl: string;           // /logos/[slug].svg placeholder
  website: string;
  affiliateLink: string;     // contains [REPLACE_AFFILIATE_ID]
  hasAffiliateProgram: boolean;
  corridors: CorridorFee[];
  fallbackFee: Omit<CorridorFee, 'source' | 'destination'>;  // for unsupported corridors
  supportedSourceCountries: CountryCode[];
  supportedDestinationCountries: CountryCode[];
  lastVerified: string;      // ISO date
  notes?: string;
}

export const PROVIDERS: Provider[] = [ /* ... */ ];
```

**Providers to seed (in this order):** Wise, Revolut, Payoneer, PayPal, GrabrFi, Western Union, Bank Wire (generic).

**Corridors to seed** (each provider needs entries for all 10 where supported, fallback otherwise):
1. US/USD → GE/GEL
2. GB/GBP → GE/GEL
3. EU/EUR → GE/GEL
4. US/USD → PT/EUR
5. US/USD → MX/MXN
6. US/USD → TH/THB
7. GB/GBP → PT/EUR
8. EU/EUR → ID/IDR
9. US/USD → ID/IDR
10. Fallback any → any (in `fallbackFee`)

**Approximate FX markups to apply:**
- Wise: 40–60 bps (use 50)
- Revolut: 0–100 bps weekday, +100 weekend (use 50 with note)
- Payoneer: 200–300 bps (use 250)
- PayPal: 300–400 bps (use 350)
- GrabrFi: 50–150 bps (use 100)
- Western Union: 400–700 bps (use 550)
- Bank Wire: 200–500 bps (use 350) — also $25–50 fixed correspondent fee

Add inline comments citing the source page where data came from + verification date. Each provider gets a `lastVerified: '2026-05-17'` field.

**Stop and report** — show data structure for sanity check.

### Phase 3: Calculator UI (~45 min)

`/app/page.tsx` structure:

```
<main>
  <header>
    <h1>Real Cost of Receiving International Payments</h1>
    <p>Compare fees across 7 ways to get paid abroad.</p>
  </header>

  <CalculatorForm onSubmit={setResults} />  // 4 inputs + button

  {results && <ResultsTable results={results} />}  // ranked, best-value highlighted

  <p className="disclaimer">Fees are estimates based on publicly available pricing as of [date]. Verify with provider before transferring.</p>

  <Footer />  // Phase 4
</main>
```

**Components to build under `/components/`:**
- `CalculatorForm.tsx` — Select (source country), Select (dest country), Input (amount, numeric), Select (source currency, auto-fills from source country but editable), Button. Use shadcn primitives.
- `ResultsTable.tsx` — Card-per-provider OR table. Each row: logo placeholder, name, total fee (currency + %), FX rate quality label ("Excellent" if ≤50bps, "Good" ≤150bps, "Fair" ≤300bps, "Poor" >300bps), net received, time, "Open account →" button with "AD" badge (a11y described).
- `BestValueBadge.tsx` — small badge for top-ranked option.

**Calculation logic** (`/lib/calculate.ts`):

```ts
import type { Provider } from '@/data/providers';

export interface Quote {
  provider: Provider;
  totalFeeInSource: number;
  effectiveFeePercent: number;
  fxRateUsed: number;              // mid + markup
  netReceivedInDest: number;
  timeHours: number;
  affiliateLink: string;
  isBestValue: boolean;
}

// Mid-market FX rates table — hardcode or use a free static source
const MID_RATES: Record<string, number> = { /* base USD pairs */ };

export function calculate(
  source: { country: CountryCode; currency: Currency },
  destination: { country: CountryCode; currency: Currency },
  amount: number,
  providers: Provider[]
): Quote[] {
  // For each provider:
  //   - find matching corridor or use fallback
  //   - skip if country unsupported
  //   - compute: totalFee = fixedFee + (amount * percentageFee)
  //   - compute: amountAfterFee = amount - totalFee
  //   - compute: fxRate = midRate * (1 - fxMarkupBps/10000)
  //   - compute: netReceived = amountAfterFee * fxRate
  //   - return Quote
  // Sort by netReceived desc, mark top as isBestValue
}
```

**Hard-code mid-market rates** for v1 (e.g., USD→GEL = 2.65, USD→EUR = 0.92, etc.). Add a comment with the date and a TODO for live rates in v2.

**Stop and report.**

### Phase 4: Affiliate disclosure (~20 min)

`/app/how-we-make-money/page.tsx` — FTC-compliant disclosure:
- Plain language: we earn commissions from some signups
- Ranking is pure fee math, not commission-weighted
- Table of providers we have affiliate relationships with (use `hasAffiliateProgram` field)
- "Last updated: [date]"

`/components/Footer.tsx`:
- "Some links are affiliate links — [how we make money](/how-we-make-money)"
- Year + project name

Update `ResultsTable.tsx`:
- Each "Open account" button gets a small `<span className="text-xs ml-1" aria-label="Affiliate link">AD</span>` badge
- Tooltip explains: "We may earn a commission if you sign up"

**Stop and report.**

### Phase 5: Polish & deploy (~30 min)

- `/app/layout.tsx` — metadata (title, description, OG, Twitter card)
- `/app/robots.ts` (or static `robots.txt`) — allow all
- `/app/sitemap.ts` — list `/` and `/how-we-make-money`
- Add favicon (use shadcn-bundled or generic placeholder)
- Add Plausible script in `<head>` of root layout — **ask user for Plausible domain name**
- `npm run build` — fix any type or lint errors
- `vercel` CLI deploy (user logged in already with guardrail.money) — confirm production URL
- Connect domain (user does this in Vercel dashboard after registering nomadfees.com or alternative)

**Stop and report production URL.**

### Phase 6: Pre-launch checklist (print only)

```
[ ] Register chosen domain (nomadfees.com recommended)
[ ] Connect domain in Vercel dashboard
[ ] Apply: Wise Platform affiliate (https://wise.com/partners)
[ ] Apply: Revolut affiliate (via Impact/Awin)
[ ] Apply: Payoneer affiliate (https://www.payoneer.com/affiliates/)
[ ] Apply: Deel affiliate (https://www.deel.com/partners)
[ ] Apply: Mercury affiliate (referral link in dashboard)
[ ] Apply: bunq affiliate (via Awin)
[ ] Replace [REPLACE_AFFILIATE_ID] strings in /data/providers.ts
[ ] Verify fee data: spot-check 3 providers against current pricing pages
[ ] Plausible: set up "affiliate_click" goal event
[ ] Draft r/digitalnomad launch post
[ ] Draft launch Twitter/X thread
[ ] Update lastVerified dates in /data/providers.ts
```

## 6. Hard Constraints (do not violate)

- **No features beyond brief.** No auth, DB, API routes, save/share, email, comparison URLs.
- **No lorem ipsum.** Real copy only — if unknown, ASK.
- **Stop at each phase boundary.** Don't power through.
- **TypeScript strict.** No `any` unless commented.
- **No animation libraries.** Tailwind transitions only if used at all.
- **No premature abstraction.** Three similar lines > one clever helper.
- **Speed > robustness.** Ship today wins ties.

## 7. Hand-off Notes for Sonnet

- The user is a 24-year payments engineer — terse, technical, wants speed. Skip hand-holding explanations. Show code, not theory.
- Run commands one at a time; report what each did.
- Stop at every phase boundary even if "you could just keep going."
- If blocked, ask one specific question — don't speculate.
- Project root: `D:\dev\nomad-stack`. PowerShell environment with Bash tool available.
- First action: verify Next.js version installed, then continue Phase 1 from "shadcn install" onward.
