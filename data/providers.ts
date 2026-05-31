// Fee data last verified: 2026-05-27
// Sources: provider pricing pages (see inline comments per provider)
// TODO v2: pull live rates from an FX API instead of hardcoded mid-market rates

export type Currency = 'USD' | 'GBP' | 'EUR' | 'GEL' | 'MXN' | 'THB' | 'IDR';
export type CountryCode = 'US' | 'GB' | 'EU' | 'GE' | 'PT' | 'MX' | 'TH' | 'ID';

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
    // TODO: replace signupUrl with affiliate URL when Wise program approved
    // Affiliate template: https://wise.com/invite/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-27',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      // Verified: $14.74 fee on $1,000 send (wise.com/us/send-money/send-money-to-georgia)
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
      // Verified: ~$7.44 fee on $1,000 USD send ($4.14 fixed + 0.33%)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 4.14,
        percentageFee: 0.0033,
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
    lastVerified: '2026-05-27',
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
    ],
    fallbackFee: {
      fixedFee: 3,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 72,
      notes: 'Estimated — verify at revolut.com for your corridor',
    },
    notes: 'Standard plan. EUR/SEPA corridors: 0.3% fee, ~instant. Other corridors via SWIFT: $3 flat fee, 3–5 days. FX at mid-market weekdays within $1,000/month; +0.5% over limit; weekends +1% (major) or +2% (GEL/THB/IDR).',
    caveat: 'Standard plan, weekday. GEL/THB/IDR sent via SWIFT (3–5 days, $3 fee). Weekend adds +1–2% FX surcharge.',
  },

  // ─── Payoneer ──────────────────────────────────────────────────────────────
  // Source: https://www.payoneer.com/legal/fees/ (2026-05-27)
  // Source: https://payoneer.custhelp.com/app/answers/detail/a_id/6118 (FX/cross-border fee)
  // Source: https://vaultleap.com/blog/payoneer-fees-explained-2026 (cross-check)
  // Receiving fee: 1% (from Payoneer balance/bank); FX markup: up to 200 bps on local bank withdrawals
  // USD→GEL: 1% receiving fee + ~2% FX markup embedded in withdrawal rate + $1.50 withdrawal fee
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
    lastVerified: '2026-05-27',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.50,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + ~2% FX markup + $1.50 withdrawal fee',
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
    lastVerified: '2026-05-29',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'PT', 'MX', 'TH', 'ID'],
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
  // Source: https://grabrfi.com/pricing (2026-05-27)
  // Freelancer-focused; ~1% flat fee, mid-market-adjacent FX (100 bps markup)
  {
    slug: 'grabrfi',
    name: 'GrabrFi',
    logoUrl: '/logos/grabrfi.svg',
    website: 'https://grabrfi.com',
    signupUrl: 'https://www.grabrfi.com/en',
    // TODO: replace signupUrl with affiliate URL when GrabrFi program approved
    // Affiliate template: https://grabrfi.com/refer/[REPLACE_AFFILIATE_ID]
    // TODO: use personal referral link (up to $100 USD per qualified signup) once founder opens GrabrFi account
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-27',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
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
        destination: { country: 'PT', currency: 'EUR' },
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
    lastVerified: '2026-05-27',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
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
      // Confirmed ~100 bps FX spread (bestexchangerates.com)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0,
        fxMarkupBps: 100,
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
    ],
    fallbackFee: {
      fixedFee: 5,
      percentageFee: 0,
      fxMarkupBps: 400,
      typicalHours: 24,
      notes: 'Estimated — verify at westernunion.com for your corridor',
    },
  },

  // ─── Bank Wire (generic SWIFT) ─────────────────────────────────────────────
  // Typical international wire from major US/EU bank (Chase, BoA, HSBC, Barclays)
  // Sending fee: $25–45; correspondent bank: $10–25 → modeled as $35 flat
  // FX markup: 300–400 bps (use 350); transfers take 2–5 business days
  {
    slug: 'bank-wire',
    name: 'Bank Wire (SWIFT)',
    logoUrl: '/logos/bank-wire.svg',
    website: 'https://www.swift.com',
    // No signupUrl — bank wire is a method, not a product to sign up for
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-05-27',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
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
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
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
    ],
    fallbackFee: {
      fixedFee: 35,
      percentageFee: 0,
      fxMarkupBps: 350,
      typicalHours: 96,
      notes: 'Typical SWIFT estimate — check with your specific bank for exact fees',
    },
    notes: 'Fees vary by bank. Correspondent bank charges may reduce received amount unpredictably.',
  },
];
