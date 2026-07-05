// Fee data last verified: 2026-06-03
// Sources: provider pricing pages (see inline comments per provider)

export type Currency = 'USD' | 'GBP' | 'EUR' | 'GEL' | 'MXN' | 'THB' | 'IDR' | 'PKR' | 'BDT' | 'NGN' | 'PHP';
export type CountryCode = 'US' | 'GB' | 'EU' | 'GE' | 'PT' | 'MX' | 'TH' | 'ID' | 'PK' | 'BD' | 'NG' | 'PH';

export interface CorridorFee {
  source: { country: CountryCode; currency: Currency };
  destination: { country: CountryCode; currency: Currency };
  fixedFee: number;       // in source currency
  percentageFee: number;  // 0.01 = 1%
  fxMarkupBps: number;    // basis points above mid-market (0 = true mid-market rate)
  typicalHours: number;   // time to arrive
  minAmount?: number;
  maxAmount?: number;
  notes?: string;
}

export interface Provider {
  slug: string;
  name: string;
  logoUrl: string;          // /logos/[slug].svg placeholder
  website: string;
  signupUrl?: string;       // direct signup page — used as CTA until affiliate link is live
  affiliateLink: string;    // real affiliate URL; empty until program approved
  hasAffiliateProgram: boolean;
  corridors: CorridorFee[];
  fallbackFee: Omit<CorridorFee, 'source' | 'destination'>;  // used for unsupported corridors
  supportedSourceCountries: CountryCode[];
  supportedDestinationCountries: CountryCode[];
  lastVerified: string;     // ISO date
  notes?: string;
  caveat?: string;          // short disclaimer shown under result card
}

export const PROVIDERS: Provider[] = [
  // ─── Wise ──────────────────────────────────────────────────────────────────
  // Source: https://wise.com/us/pricing/send-money (2026-05-27)
  // Source: https://wise.com/us/send-money/send-money-to-georgia (2026-05-27)
  // Source: https://wise.com/us/blog/december-fee-review-2025 (Dec 2025 fee changes)
  // Source: https://wise.com/us/blog/fees-changing-usd-jan-18-mxn (Jan 2026 MXN update)
  // FX: true mid-market rate (0 bps markup) — all profit taken as transparent percentage fee
  {
    slug: 'wise',
    name: 'Wise',
    logoUrl: '/logos/wise.svg',
    website: 'https://wise.com',
    signupUrl: 'https://wise.com',
    affiliateLink: 'https://wise.prf.hn/click/camref:1101l5KKgS',
    hasAffiliateProgram: true,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      // Verified: ~$14.74 fee on $1,000 send (wise.com/us/send-money/send-money-to-georgia)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.04,
        percentageFee: 0.0137,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: '~1–2 business days for GEL',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0.87,
        percentageFee: 0.0067,
        fxMarkupBps: 0,
        typicalHours: 2,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.01,
        percentageFee: 0.0067,
        fxMarkupBps: 0,
        typicalHours: 2,
      },
      // Verified 2026-06-02: ~$5 fee on $1,000 USD send ($0.69 fixed + 0.43%)
      // Source: wise.com/us/pricing/send-money — range 0.43–0.57%; ~0.5% typical
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.69,
        percentageFee: 0.0043,
        fxMarkupBps: 0,
        typicalHours: 1,
      },
      // Verified: ~$9.17 fee on $1,000 USD send — updated Jan 2026
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 1.17,
        percentageFee: 0.008,
        fxMarkupBps: 0,
        typicalHours: 1,
      },
      // Verified: ~$4.80 fee on $1,000 USD send ($0.69 fixed + 0.41%)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0.69,
        percentageFee: 0.0041,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: 'Typically 1–2 business days for THB',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.47,
        percentageFee: 0.0035,
        fxMarkupBps: 0,
        typicalHours: 1,
      },
      // Verified: ~$5.31 fee on $1,000 USD send ($0.69 fixed + 0.46%)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.69,
        percentageFee: 0.0046,
        fxMarkupBps: 0,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.69,
        percentageFee: 0.0046,
        fxMarkupBps: 0,
        typicalHours: 24,
      },
      // USD → Georgian USD bank account via SWIFT (no FX conversion)
      // Source: wise.com help/articles/2946451 — USD SWIFT fee is $6.11
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'USD' },
        fixedFee: 6.11,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: 'USD SWIFT to Georgian USD bank account — no FX conversion',
      },
      // EUR → Georgian EUR bank account via SWIFT (non-SEPA, no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 3.00,
        percentageFee: 0.004,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: 'EUR SWIFT to Georgian EUR bank account — no FX conversion',
      },
      // EUR → Portuguese EUR bank account via SEPA (no FX conversion, same-currency)
      // Source: wise.com/help/articles/2932149 — SEPA same-currency, EU regs apply
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.0038,
        fxMarkupBps: 0,
        typicalHours: 2,
        notes: 'EUR SEPA to Portugal — no FX conversion, near-instant',
      },
    ],
    fallbackFee: {
      fixedFee: 1.50,
      percentageFee: 0.0069,
      fxMarkupBps: 0,
      typicalHours: 24,
      notes: 'Estimated — verify at wise.com for your corridor',
    },
  },

  // ─── Revolut ───────────────────────────────────────────────────────────────
  // Source: https://www.revolut.com/en-US/legal/standard-fees/ (2026-05-27)
  // Source: https://cdn.revolut.com/terms_and_conditions/pdf/currency_transfer_fees_section_standard_361b3cb3_1.4.1_1774231091_en.pdf
  // Source: https://assets.revolut.com/legal/terms/International_Payments_Pricing_Sheet.pdf
  //
  // Standard plan fee model:
  //   — Local-currency network (EUR/SEPA, some MXN): 0.3% transfer fee, 0 bps FX weekdays
  //   — SWIFT (GEL, THB, IDR, and others without local network): $3 flat fee (USD/EUR/GBP source)
  //   — FX markup: 0 bps weekdays; +100 bps weekends (major currencies); +200 bps weekends (exotic: GEL, THB, IDR)
  //   — Fair use limit: $1,000/month currency exchange; +0.5% above limit
  {
    slug: 'revolut',
    name: 'Revolut',
    logoUrl: '/logos/revolut.svg',
    website: 'https://www.revolut.com',
    signupUrl: 'https://www.revolut.com',
    // TODO: replace signupUrl with affiliate URL when Revolut program approved
    // Affiliate template: https://revolut.com/referral/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      // GEL not available on Revolut local network — sent via SWIFT ($3 flat fee, 0 bps FX weekday)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
        notes: 'Via SWIFT; 3–5 business days. +2% FX surcharge on weekends.',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      // EUR via SEPA local network — 0.3% fee, near mid-market FX weekdays
      // Verified 2026-06-02: revolut.com/en-US/legal/standard-fees/
      // Shown: weekday within $1,000/month FX allowance. Out-of-allowance +0.5%; weekend +1%.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 24,
      },
      // MXN via SWIFT (Revolut US does not yet have a local MXN network)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      // THB via SWIFT
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 24,
      },
      // IDR via SWIFT
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
      },
      // USD → Georgian USD bank account via SWIFT (no FX conversion)
      // US Standard plan: $10 flat SWIFT fee (revolut.com/en-US/legal/standard-fees/)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'USD' },
        fixedFee: 10,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
        notes: 'USD SWIFT to Georgian USD bank account — no FX conversion',
      },
      // EUR → Georgian EUR bank account via SWIFT (no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 72,
        notes: 'EUR SWIFT to Georgian EUR bank account — no FX conversion',
      },
      // EUR → Portuguese EUR via SEPA (no FX, same-currency SEPA transfer)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: 'EUR SEPA to Portugal — no FX conversion',
      },
    ],
    fallbackFee: {
      fixedFee: 3,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 72,
      notes: 'Estimated — verify at revolut.com for your corridor',
    },
    notes: 'Standard plan. EUR/SEPA corridors: 0.3% fee, ~instant. Other corridors via SWIFT: $3 flat fee, 3–5 days. FX at mid-market weekdays within $1,000/month; +0.5% over limit; weekends +1% (major) or +2% (GEL/THB/IDR).',
    caveat: 'Shown: weekday, within $1,000/month FX allowance. Out-of-allowance: +0.5%. Weekends: +1% extra. Realistic worst-case: ~1.5% all-in. GEL/THB/IDR via SWIFT ($3 fee, 3–5 days).',
  },

  // ─── Payoneer ──────────────────────────────────────────────────────────────
  // Source: https://www.payoneer.com/legal/fees/ (2026-06-02)
  // Source: https://payoneer.custhelp.com/app/answers/detail/a_id/6118 (FX/cross-border fee)
  // Receiving fee: 1% (from Payoneer balance/bank); FX markup: up to 200 bps on local bank withdrawals
  // Cross-currency: 1% receive + up to 2% FX = ~3% all-in. $1.50 flat ONLY for same-currency withdrawals.
  {
    slug: 'payoneer',
    name: 'Payoneer',
    logoUrl: '/logos/payoneer.svg',
    website: 'https://www.payoneer.com',
    signupUrl: 'https://www.payoneer.com',
    // TODO: replace signupUrl with affiliate URL when Payoneer program approved
    // Affiliate template: https://www.payoneer.com/partners/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'PK', 'BD', 'NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + ~2% FX markup; $1.50 flat applies to same-currency withdrawals only',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
      },
      // USD → Georgian USD bank account (no FX — 1% receiving fee + $1.50 withdrawal)
      // Source: payoneer.com/about/pricing/ — $1.50 flat for USD same-currency withdrawals
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'USD' },
        fixedFee: 1.50,
        percentageFee: 0.01,
        fxMarkupBps: 0,
        typicalHours: 72,
        notes: '1% receiving fee + $1.50 withdrawal; no FX conversion',
      },
      // EUR → Georgian EUR bank account (no FX — 1% receiving fee)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 0,
        typicalHours: 72,
        notes: '1% receiving fee; no FX conversion',
      },
      // EUR → Portuguese EUR (SEPA, no FX — 1% receiving fee)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: '1% receiving fee; no FX conversion (SEPA)',
      },
      // USD → Pakistani PKR bank account
      // Source: payoneer.com/legal/fees/ (2026-06-03) — 1% receiving fee + up to 2% FX on withdrawal
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PK', currency: 'PKR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + up to 2% FX markup on PKR withdrawal to local bank',
      },
      // USD → Bangladeshi BDT bank account
      // Source: payoneer.com/legal/fees/ (updated Jan 2026) — 1% receiving fee + 1.2–4% FX on BDT withdrawal
      // Modeled at ~2% FX markup as representative midpoint; Payoneer-to-bKash route costs ~3% + $1 instead
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BD', currency: 'BDT' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + ~2% FX markup on BDT withdrawal (range 1.2–4%); bKash route ~3% + $1 instead',
      },
      // USD → Nigerian NGN bank account
      // Source: payoneer.com/legal/fees/ — 1% receiving fee + up to 2% FX markup on NGN withdrawal
      // Annual fee threshold for NG: $2,000/year (lower than some other countries)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + up to 2% FX markup on NGN withdrawal; $29.95/year if under $2,000/year received',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.01,
      fxMarkupBps: 200,
      typicalHours: 96,
      notes: 'Estimated — verify at payoneer.com for your corridor',
    },
  },

  // ─── PayPal ────────────────────────────────────────────────────────────────
  // Source: https://www.paypal.com/us/webapps/mpp/merchant-fees (2026-05-29)
  // Source: https://www.paypal.com/us/cshelp/article/what-are-the-cross-border-fees-when-selling-internationally-help550
  // Scenario: freelancer (Personal account) receiving international commercial payment
  // Cross-border receiving fee: 4.4% + $0.30 fixed (deducted from received amount)
  // FX markup: ~3.5% above mid-market (embedded in quoted conversion rate, not shown as line item)
  // Georgia (GEL) not reliably supported — falls back
  {
    slug: 'paypal',
    name: 'PayPal',
    logoUrl: '/logos/paypal.svg',
    website: 'https://www.paypal.com',
    signupUrl: 'https://www.paypal.com/us/business',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'PT', 'MX', 'TH', 'ID', 'NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
        notes: '4.4% + $0.30 cross-border receiving fee; instant to PayPal balance, 1–3 days to bank',
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
        notes: 'PayPal available in Indonesia; limited local withdrawal options',
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
      // EUR → Portuguese EUR (cross-border fee applies, but no FX conversion needed)
      // Source: paypal.com cross-border fees — 4.4% + €0.35 for personal international receiving
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.35,
        percentageFee: 0.044,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: '4.4% + €0.35 cross-border receiving fee; no FX conversion (EUR→EUR)',
      },
      // USD → Nigerian NGN bank account via Paga (launched Jan 27 2026)
      // PayPal reenabled NGN payouts via Paga partnership — naira-only, 2.9% + $0.30 + ~3.5% FX
      // Source: PayPal help article (Jan 2026) + Paga payout terms
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 0.30,
        percentageFee: 0.029,
        fxMarkupBps: 350,
        typicalHours: 48,
        notes: 'Via Paga (Jan 2026); 2.9% + $0.30 PayPal receiving fee + ~3.5% FX markup; naira-only payout',
      },
    ],
    fallbackFee: {
      fixedFee: 0.30,
      percentageFee: 0.044,
      fxMarkupBps: 350,
      typicalHours: 24,
      notes: 'PayPal has limited or no GEL (Georgia) support — use Wise or Revolut',
    },
    notes: 'Georgia (GEL) not reliably supported. Fees shown are for Personal-account cross-border receiving. FX markup ~3.5% above mid-market.',
    caveat: 'Fees vary by account type and sender country. Shown: Personal-account international receiving (4.4% + $0.30 + 3.5% FX).',
  },

  // ─── GrabrFi ───────────────────────────────────────────────────────────────
  // Source: https://grabrfi.com/pricing (2026-06-02)
  // Freelancer-focused; USD checking product. Local-currency withdrawal: MX, GE, and select others.
  // Does NOT support EUR delivery to Eurozone banks — no PT corridor.
  {
    slug: 'grabrfi',
    name: 'GrabrFi',
    logoUrl: '/logos/grabrfi.svg',
    website: 'https://grabrfi.com',
    signupUrl: 'https://www.grabrfi.com/en',
    affiliateLink: 'https://app.grabrfi.com/sign-up?invite-code=kqMCKAcsollV&itm_source=app&itm_medium=referral&itm_campaign=invite_friend_promo&itm_content=ios_invite_screen',
    hasAffiliateProgram: true,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 100,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 100,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 100,
        typicalHours: 48,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 100,
        typicalHours: 48,
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.01,
      fxMarkupBps: 100,
      typicalHours: 48,
      notes: 'GrabrFi coverage expanding — verify at grabrfi.com for your corridor',
    },
  },

  // ─── Western Union ─────────────────────────────────────────────────────────
  // Source: https://www.westernunion.com/us/en/transfer-fees.html (2026-05-27)
  // Source: https://www.westernunion.com/us/en/send-money-to-georgia.html (2026-05-27)
  // Source: https://bestexchangerates.com/rates/western-union-usd-to-thb-foreign-transfers (150 bps confirmed)
  // Source: https://bestexchangerates.com/rates/western-union-usd-to-mxn-foreign-transfers (150 bps confirmed)
  // Source: https://bestexchangerates.com/rates/western-union-usd-to-eur (100 bps confirmed)
  // Source: https://fxpal.com/guides/western-union-fee-guide-costs-explained/
  // Bank deposit modeled. FX markup embedded in quoted rate (not disclosed as line item).
  // FX markup by corridor: GEL ~500 bps (minor corridor); MXN/THB ~150 bps; EUR ~100 bps; IDR ~175 bps
  {
    slug: 'western-union',
    name: 'Western Union',
    logoUrl: '/logos/western-union.svg',
    website: 'https://www.westernunion.com',
    signupUrl: 'https://www.westernunion.com',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-07-05',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'PK'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 500,
        typicalHours: 24,
        notes: 'Bank deposit; ~5% FX spread on GEL (minor corridor). Cash pickup fees differ.',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 4,
        percentageFee: 0,
        fxMarkupBps: 500,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 4,
        percentageFee: 0,
        fxMarkupBps: 500,
        typicalHours: 24,
      },
      // Verified 2026-06-02: ~1.5% all-in online bank-deposit (range 0.5–2.5% by method)
      // $3 flat send fee + ~1.5% FX spread (westernunion.com US→EUR online bank)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 150,
        typicalHours: 24,
      },
      // Confirmed ~150 bps FX spread, strong US→MX network (bestexchangerates.com)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 150,
        typicalHours: 1,
        notes: 'Strong US→MX network; near-instant cash pickup available',
      },
      // Confirmed ~150 bps FX spread (bestexchangerates.com); $0 promo fee until Jul 2026
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 150,
        typicalHours: 24,
        notes: 'Transfer fee currently $0 promo (expires ~Jul 2026); $5 standard fee shown',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 100,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 4,
        percentageFee: 0,
        fxMarkupBps: 175,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 175,
        typicalHours: 24,
      },
      // EUR → Portuguese EUR via WU (SEPA-zone, no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 1.50,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: 'EUR SEPA transfer within SEPA zone; no FX conversion',
      },
      // USD → Pakistani PKR bank deposit
      // Source: westernunion.com/us/en/transfer-fees.html — ~$5 flat online, ~4.5% FX spread on PKR
      // PKR is a minor corridor; FX spread verified via bestexchangerates.com cross-rate comparison
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PK', currency: 'PKR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 200,
        typicalHours: 48,
        notes: '$0 online fee for bank deposits over $200 (Pakistan Remittance Initiative) + ~2% FX spread. Bank deposit to HBL, UBL, MCB.',
      },
    ],
    fallbackFee: {
      fixedFee: 5,
      percentageFee: 0,
      fxMarkupBps: 400,
      typicalHours: 24,
      notes: 'Estimated — verify at westernunion.com for your corridor',
    },
  },

  // ─── Bank Wire ─────────────────────────────────────────────────────────────
  // Typical international wire from major US/EU bank (Chase, BoA, HSBC, Barclays)
  // EU→EU routes use SEPA (€2 flat, ~1h). SWIFT routes: $35 flat + ~1% FX = ~3.5–4.5% effective.
  {
    slug: 'bank-wire',
    name: 'Bank Wire',
    logoUrl: '/logos/bank-wire.svg',
    website: 'https://www.swift.com',
    // No signupUrl — bank wire is a method, not a product to sign up for
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'PK', 'BD', 'NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
        notes: '$25–45 sending fee + $10–25 correspondent fee; may arrive as USD then converted locally',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 28,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 30,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      // Verified 2026-06-02: $25–45 sending fee + bank FX markup ~1%; ~3.5% effective all-in
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 100,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 25,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 48,
        notes: 'Post-Brexit GBP→EUR is SWIFT, not SEPA',
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 30,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      // USD → Georgian USD bank account via SWIFT (no FX conversion)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'USD' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 96,
        notes: 'SWIFT wire; recipient receives USD in Georgian bank — no FX conversion',
      },
      // EUR → Georgian EUR bank account via SWIFT (no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 30,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 96,
        notes: 'SWIFT wire; recipient receives EUR in Georgian bank — no FX conversion',
      },
      // EUR → Portuguese EUR via SEPA (no FX conversion, much cheaper than SWIFT)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 2,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: 'SEPA transfer within EU; no FX conversion, near-instant',
      },
      // USD → Pakistani PKR bank account via SWIFT
      // Typical US bank outgoing wire $35 flat + bank FX markup ~3.5% on PKR
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PK', currency: 'PKR' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 120,
        notes: '$25-45 flat sending fee + bank FX markup. SWIFT to HBL, UBL, MCB, Bank Alfalah.',
      },
      // USD → Bangladeshi BDT bank account via SWIFT
      // TT buying rate typically 1–2% below mid-market; $35 flat + possible $15-30 correspondent deduction
      // Formal route: generates FIRC needed for export cash incentive and ERQ account funding
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BD', currency: 'BDT' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 150,
        typicalHours: 72,
        notes: '$35 flat + TT buying rate ~1–2% below mid-market; generates FIRC for export incentive claims.',
      },
      // USD → Nigerian NGN bank account via SWIFT
      // Nigerian banks (GTBank, Access Bank, Zenith) convert at NAFEM window rate + ~2% spread
      // IMTO naira-only rule (CBN Mar 24 2026, effective May 1 2026) applies to licensed IMTO operators,
      // NOT to SWIFT client-to-business wires — SWIFT USD wires are unaffected
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '$35 flat + ~2% bank FX spread above NAFEM rate; SWIFT wires exempt from IMTO naira-only rule.',
      },
    ],
    fallbackFee: {
      fixedFee: 35,
      percentageFee: 0,
      fxMarkupBps: 350,
      typicalHours: 96,
      notes: 'Typical SWIFT estimate — check with your specific bank for exact fees',
    },
    notes: 'Fees vary by bank. Correspondent bank charges may reduce received amount unpredictably.',
    caveat: 'EU→EU routes use SEPA (cheap, ~1h). Other routes use SWIFT ($35 fee, 2–5 days, 3.5% FX).',
  },

  // ─── Paysera ────────────────────────────────────────────────────────────────
  // Source: https://www.paysera.com/v2/en/fees/euro-transfers (2026-05-31)
  // Source: https://www.paysera.com/v2/en/blog/paysera-bank-in-georgia (NBG license #15)
  // Paysera issues Lithuanian IBANs (LT...) that are full SEPA members.
  // Georgian residents can open a Paysera account and receive EUR from Eurozone
  // clients via SEPA Credit Transfer — Paysera charges €0 to receive.
  // Regulatory: Licensed by Bank of Lithuania (EMI) + NBG banking license since Nov 2022.
  {
    slug: 'paysera',
    name: 'Paysera (LT IBAN)',
    logoUrl: '/logos/paysera.svg',
    website: 'https://www.paysera.com',
    signupUrl: 'https://www.paysera.com/v2/en/registration',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-06-02',
    supportedSourceCountries: ['EU'],
    supportedDestinationCountries: ['GE'],
    corridors: [
      // EUR from Eurozone → Paysera LT IBAN held by Georgian resident
      // Sender does a normal SEPA transfer to the LT IBAN — Paysera receives it for free.
      // Source: paysera.com/v2/en/fees/crediting-of-transfers — SEPA receiving: €0
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: 'Paysera issues a Lithuanian (EU) IBAN — Eurozone clients send SEPA; receiving fee €0',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 1,
    },
    notes: 'Paysera issues a Lithuanian IBAN to Georgian residents. EU clients send via SEPA — Paysera charges €0 to receive. NBG-licensed bank in Georgia.',
    caveat: 'You give your EU client a Lithuanian IBAN (LT…). They pay their bank\'s SEPA fee (~€0–5) separately — not deducted from your amount.',
  },

  // ─── Cleva ─────────────────────────────────────────────────────────────────
  // Source: https://www.getcleva.com/pricing (2026-06-14)
  // Nigerian-focused fintech issuing virtual US bank accounts (routing + account number).
  // Fee model: $3 flat per USD withdrawal to NGN bank account; no percentage fee; true mid-market FX.
  // CBN-regulated. Deposits up to $10,000 eligible for NDIC protection via partner bank.
  {
    slug: 'cleva',
    name: 'Cleva',
    logoUrl: '/logos/cleva.svg',
    website: 'https://www.getcleva.com',
    signupUrl: 'https://www.getcleva.com',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-07-05',
    supportedSourceCountries: ['US'],
    supportedDestinationCountries: ['NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: 'Two-tier ACH deposit fee: $1 under $300, $3 at $300 or more; conversion/withdrawal free at mid-market; modeled at $3 for the $1,000 example',
      },
    ],
    fallbackFee: {
      fixedFee: 3,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 24,
    },
    notes: 'Cleva issues a US virtual bank account for Nigerian freelancers. Clients send a domestic ACH or wire; Cleva charges a deposit fee on the incoming ACH ($1 for deposits under $300, $3 for deposits of $300 or more), then converts at mid-market and credits your Nigerian account with no separate withdrawal fee. CBN-regulated.',
  },

  // ─── Grey ──────────────────────────────────────────────────────────────────
  // Source: grey.co/blog/fees-and-charges-on-grey + support.grey.co (2026-07-05)
  // Pan-African fintech (HQ Lagos) issuing virtual USD, GBP, and EUR accounts.
  // Fee model: 0.8% deposit fee (min $2, max $10) on incoming USD + 1% conversion fee
  // (capped at $6 per transaction) + ~1% FX markup above mid-market.
  // Modeled below as $6 fixed (capped conversion, transfers >= $600) + 0.8% + 100 bps;
  // exact only near $1,000 since both caps cannot be expressed in this fee model.
  // CBN-regulated (license 10151).
  {
    slug: 'grey',
    name: 'Grey',
    logoUrl: '/logos/grey.svg',
    website: 'https://grey.co',
    signupUrl: 'https://grey.co',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-07-05',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 6,
        percentageFee: 0.008,
        fxMarkupBps: 100,
        typicalHours: 24,
        notes: '0.8% deposit fee (min $2, max $10) + 1% conversion fee capped at $6 + ~1% FX markup; CBN license 10151',
      },
    ],
    fallbackFee: {
      fixedFee: 6,
      percentageFee: 0.008,
      fxMarkupBps: 100,
      typicalHours: 24,
    },
    notes: 'Grey issues virtual USD (and GBP/EUR) accounts for Nigerian freelancers. Fees: 0.8% deposit fee (min $2, max $10) on incoming USD, plus a 1% conversion fee capped at $6 per transaction, plus ~1% FX markup. Roughly 2.4% all-in on $1,000. Supports USD, GBP, and EUR receiving. CBN-regulated (license 10151).',
    caveat: 'Two capped fees apply: 0.8% deposit fee (max $10) and 1% conversion fee (max $6). On larger transfers both caps kick in and the effective rate drops.',
  },

  // ─── LemFi ─────────────────────────────────────────────────────────────────
  // Source: https://lemfi.com/pricing (2026-06-14)
  // Formerly Lemonade Finance. Issues virtual US accounts for Nigerian freelancers and diaspora.
  // Fee model: zero flat fee, zero percentage fee, true mid-market FX rate.
  // FCA-licensed (UK), FINTRAC MBO (Canada), CBN-approved for Nigeria.
  {
    slug: 'lemfi',
    name: 'LemFi',
    logoUrl: '/logos/lemfi.svg',
    website: 'https://lemfi.com',
    signupUrl: 'https://lemfi.com',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-06-14',
    supportedSourceCountries: ['US'],
    supportedDestinationCountries: ['NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: 'Zero fees, true mid-market FX; FCA-licensed; verify current withdrawal limits',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 48,
    },
    notes: 'LemFi (formerly Lemonade Finance) issues a virtual US account for Nigerian freelancers. Zero fees, mid-market FX. FCA-licensed (UK), FINTRAC MBO (Canada), CBN-approved. Verify current withdrawal limits before relying on it for large amounts.',
  },

  // ─── Raenest ───────────────────────────────────────────────────────────────
  // Source: https://raenest.com/pricing (2026-06-14)
  // African freelancer-focused fintech issuing virtual USD and GBP accounts.
  // Fee model: $1 flat per withdrawal + 0.5% FX markup above mid-market.
  // CBN-licensed.
  {
    slug: 'raenest',
    name: 'Raenest',
    logoUrl: '/logos/raenest.svg',
    website: 'https://raenest.com',
    signupUrl: 'https://raenest.com',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-06-14',
    supportedSourceCountries: ['US', 'GB'],
    supportedDestinationCountries: ['NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 1,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 24,
        notes: '$1 flat per withdrawal + 0.5% FX markup; no percentage fee; CBN-licensed',
      },
    ],
    fallbackFee: {
      fixedFee: 1,
      percentageFee: 0,
      fxMarkupBps: 50,
      typicalHours: 24,
    },
    notes: 'Raenest issues virtual USD and GBP accounts for African freelancers and remote workers. Modeled here as $1 flat per deposit plus a 0.5% FX markup above mid-market. Raenest has revised its deposit fee structure several times recently; verify the current free-deposit allowance at raenest.com/pricing. No annual account fee. CBN-licensed.',
  },
];
