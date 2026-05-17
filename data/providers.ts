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
  affiliateLink: string;    // contains [REPLACE_AFFILIATE_ID]
  hasAffiliateProgram: boolean;
  corridors: CorridorFee[];
  fallbackFee: Omit<CorridorFee, 'source' | 'destination'>;  // used for unsupported corridors
  supportedSourceCountries: CountryCode[];
  supportedDestinationCountries: CountryCode[];
  lastVerified: string;     // ISO date
  notes?: string;
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
    affiliateLink: 'https://wise.com/invite/[REPLACE_AFFILIATE_ID]',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.04,
        percentageFee: 0.0067,
        fxMarkupBps: 50,
        typicalHours: 2,
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
  // Source: https://www.revolut.com/legal/fees (2026-05-17)
  // Standard plan: 0% FX markup weekdays within monthly limit; 1% weekends
  // Modeled as 50 bps average across weekday/weekend usage
  {
    slug: 'revolut',
    name: 'Revolut',
    logoUrl: '/logos/revolut.svg',
    website: 'https://www.revolut.com',
    affiliateLink: 'https://revolut.com/referral/[REPLACE_AFFILIATE_ID]',
    hasAffiliateProgram: true,
    lastVerified: '2026-05-17',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
        notes: '0% weekdays (Standard, within limit); 1% weekends',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 1,
      },
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 50,
        typicalHours: 24,
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 50,
      typicalHours: 24,
      notes: 'Estimated — verify at revolut.com for your corridor',
    },
    notes: 'Premium/Metal plans have higher monthly FX limits. Over-limit adds 0.5% on weekdays.',
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
    affiliateLink: 'https://www.payoneer.com/partners/[REPLACE_AFFILIATE_ID]',
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
        fxMarkupBps: 250,
        typicalHours: 72,
        notes: '1% fee from Payoneer balance; 3% from card',
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
    affiliateLink: 'https://www.paypal.com/[REPLACE_AFFILIATE_ID]',
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
    affiliateLink: 'https://grabrfi.com/refer/[REPLACE_AFFILIATE_ID]',
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
    affiliateLink: 'https://www.westernunion.com/[REPLACE_AFFILIATE_ID]',
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
