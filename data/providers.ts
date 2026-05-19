// Fee data last verified: 2026-05-17
// Sources: provider pricing pages (see inline comments per provider)
// TODO v2: pull live rates from an FX API instead of hardcoded mid-market rates

export type Currency = 'USD' | 'GBP' | 'EUR' | 'GEL' | 'MXN' | 'THB' | 'IDR';
export type CountryCode = 'US' | 'GB' | 'EU' | 'GE' | 'PT' | 'MX' | 'TH' | 'ID';

export interface CorridorFee {
  source: { country: CountryCode; currency: Currency };
  destination: { country: CountryCode; currency: Currency };
  fixedFee: number;       // in source currency
  percentageFee: number;  // 0.01 = 1%
  fxMarkupBps: number;    // basis points above mid-market (50 = 0.5%)
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
  // Source: https://wise.com/us/pricing/send-money (2026-05-17)
  // Fixed + variable fee per corridor; FX markup ~40-60 bps (use 50)
  {
    slug: 'wise',
    name: 'Wise',
    logoUrl: '/logos/wise.svg',
    website: 'https://wise.com',
    signupUrl: 'https://wise.com/us/signup',
    // TODO: replace signupUrl with affiliate URL when Wise program approved
    // Affiliate template: https://wise.com/invite/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      // Source: wise.com/us/send-money/send-money-to-georgia (2026-05-18)
      // GEL is a less-liquid currency — higher variable fee than major corridors
      // Verified: $14.74 fee on $1,000 send; $100.93 fee on $7,000 send (~1.44%)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.04,
        percentageFee: 0.0137,
        fxMarkupBps: 50,
        typicalHours: 48,
        notes: '~1–2 business days for GEL',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0.87,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 2,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.01,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 2,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.70,
        percentageFee: 0.0041,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 1.04,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 1.04,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 24,
        notes: 'Typically 1–2 business days for THB',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.47,
        percentageFee: 0.0035,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 2.10,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 2.10,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
    ],
    fallbackFee: {
      fixedFee: 1.50,
      percentageFee: 0.0069,
      fxMarkupBps: 50,
      typicalHours: 24,
      notes: 'Estimated — verify at wise.com for your corridor',
    },
  },

  // ─── Revolut ───────────────────────────────────────────────────────────────
  // Source: https://www.revolut.com/en-US/legal/standard-fees/ (2026-05-18)
  // Standard plan: 0.3% transfer fee per international payment (min ~$0.30, max $5)
  // FX markup: 0% weekdays within $1,000/month limit; +0.5% over limit; +1% weekends
  // fxMarkupBps set to 50 as conservative blended average for Standard plan
  // (Standard limit is $1,000/month — freelancers exceeding that pay +0.5% on the rest)
  {
    slug: 'revolut',
    name: 'Revolut',
    logoUrl: '/logos/revolut.svg',
    website: 'https://www.revolut.com',
    signupUrl: 'https://www.revolut.com/our-pricing-plans',
    // TODO: replace signupUrl with affiliate URL when Revolut program approved
    // Affiliate template: https://revolut.com/referral/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-18',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
        notes: '0.3% transfer fee (max $5); FX at mid-market weekdays within $1,000/month; +1% weekends',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.003,
      fxMarkupBps: 50,
      typicalHours: 24,
      notes: 'Estimated — verify at revolut.com for your corridor',
    },
    notes: 'Standard plan: 0.3% transfer fee (min ~$0.30, max ~$5 per transfer). FX at mid-market on weekdays within $1,000/month; +0.5% over limit; +1% weekends. Premium/Metal: higher limits, no weekend surcharge.',
    caveat: 'Standard plan, weekday, within $1,000/month FX allowance. Weekend transfers add 1–2%.',
  },

  // ─── Payoneer ──────────────────────────────────────────────────────────────
  // Source: https://www.payoneer.com/legal/fees/ (2026-05-17)
  // Receiving from Payoneer balance: 1%; from credit card: 3%
  // Withdrawal FX markup: ~2.5% (250 bps); delays of 1–3 business days
  {
    slug: 'payoneer',
    name: 'Payoneer',
    logoUrl: '/logos/payoneer.svg',
    website: 'https://www.payoneer.com',
    signupUrl: 'https://www.payoneer.com/sign-up/',
    // TODO: replace signupUrl with affiliate URL when Payoneer program approved
    // Affiliate template: https://www.payoneer.com/partners/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      // Includes 1% receiving fee + up to 2% FX markup + $1.50 withdrawal
      // Sources: payoneer.com/about/pricing; vaultleap.com/blog/payoneer-fees-explained-2026
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.50,
        percentageFee: 0.03,
        fxMarkupBps: 350,
        typicalHours: 72,
        notes: '1% receiving fee + up to 2% FX markup + $1.50 withdrawal fee',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 72,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 48,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 48,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 48,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 48,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 72,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 250,
        typicalHours: 72,
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.01,
      fxMarkupBps: 250,
      typicalHours: 96,
      notes: 'Estimated — verify at payoneer.com for your corridor',
    },
  },

  // ─── PayPal ────────────────────────────────────────────────────────────────
  // Source: https://www.paypal.com/us/webapps/mpp/paypal-fees (2026-05-17)
  // International personal transfers: 5% (min $0.99, max $4.99) + ~3.5% FX markup
  // Georgia (GEL) not reliably supported — falls back
  {
    slug: 'paypal',
    name: 'PayPal',
    logoUrl: '/logos/paypal.svg',
    website: 'https://www.paypal.com',
    signupUrl: 'https://www.paypal.com/us/webapps/mpp/account-selection',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 1,
        notes: '5% fee (min $0.99, max $4.99) for international personal transfers',
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 1,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 1,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 24,
        notes: 'PayPal available in Indonesia; limited local withdrawal options',
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0.99,
        percentageFee: 0.05,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
    ],
    fallbackFee: {
      fixedFee: 0.99,
      percentageFee: 0.05,
      fxMarkupBps: 350,
      typicalHours: 24,
      notes: 'PayPal has limited or no GEL (Georgia) support — use Wise or Revolut',
    },
    notes: 'Georgia (GEL) not reliably supported. Fee cap of $4.99 not modeled — actual cost lower for large amounts.',
  },

  // ─── GrabrFi ───────────────────────────────────────────────────────────────
  // Source: https://grabrfi.com/pricing (2026-05-17)
  // Freelancer-focused; ~1% flat fee, mid-market-adjacent FX (100 bps markup)
  {
    slug: 'grabrfi',
    name: 'GrabrFi',
    logoUrl: '/logos/grabrfi.svg',
    website: 'https://grabrfi.com',
    signupUrl: 'https://www.grabrfi.com/en/signup',
    // TODO: replace signupUrl with affiliate URL when GrabrFi program approved
    // Affiliate template: https://grabrfi.com/refer/[REPLACE_AFFILIATE_ID]
    affiliateLink: '',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-17',
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
  // Source: https://www.westernunion.com/us/en/send-money/app/price-estimator.html (2026-05-17)
  // Fees vary widely by funding method; bank deposit modeled here
  // FX markup: 400–700 bps (use 550)
  {
    slug: 'western-union',
    name: 'Western Union',
    logoUrl: '/logos/western-union.svg',
    website: 'https://www.westernunion.com',
    signupUrl: 'https://www.westernunion.com/us/en/web/send-money/start',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 5,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
        notes: 'Bank deposit; cash pickup fees differ',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 4,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 4,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0.005,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 550,
        typicalHours: 1,
        notes: 'Strong US→MX network; near-instant cash pickup available',
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 5,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 3,
        percentageFee: 0.005,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 4,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 5,
        percentageFee: 0.01,
        fxMarkupBps: 550,
        typicalHours: 24,
      },
    ],
    fallbackFee: {
      fixedFee: 5,
      percentageFee: 0.01,
      fxMarkupBps: 550,
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
    lastVerified: '2026-05-17',
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
