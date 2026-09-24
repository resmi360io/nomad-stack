// Fee data last verified: 2026-07-30
// Sources: provider pricing pages (see inline comments per provider)

export type Currency = 'USD' | 'GBP' | 'EUR' | 'GEL' | 'MXN' | 'THB' | 'IDR' | 'PKR' | 'BDT' | 'NGN' | 'PHP' | 'BRL';
export type CountryCode = 'US' | 'GB' | 'EU' | 'GE' | 'PT' | 'MX' | 'TH' | 'ID' | 'PK' | 'BD' | 'NG' | 'PH' | 'BR';

// NOTE ON `notes` FIELDS IN THIS FILE: neither CorridorFee.notes nor Provider.notes is
// rendered anywhere. The only provider prose a reader sees comes from CorridorProviderEntry.notes
// in data/corridors.ts, via app/receive/[corridor]/page.tsx, and from Provider.caveat, via
// components/ResultsTable.tsx. Verified by grepping every `.notes` read in app/, components/ and
// lib/ on 2026-09-24. Two review passes have flagged dashes in these strings as reader-facing;
// they are not. Provider.caveat IS reader-facing and must stay free of em and en dashes.
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
  // True when fxMarkupBps is not traceable to a cited source: an assumption, a
  // floor, or a third-party cross-rate estimate. Such quotes still rank, but they
  // are marked in the UI and cannot take the best-value badge, because the badge
  // is the number that actually steers readers.
  fxMarkupEstimated?: boolean;
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
    lastVerified: '2026-08-27',
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID'],
    // Wise balance availability excludes Indonesia (receiving/holding ended 23 May 2024)
    // and Mexico. Both removed as destinations. On Mexico the evidence is absence of product,
    // NOT a published eligibility rule: wise.com/mx on 2026-09-24 offered only outbound
    // transfers (personal and large amount) plus Wise Platform, with no multi-currency
    // account, no account details and no card in the product menu. Do not restate that as
    // a rule saying Mexican residents cannot hold a balance.
    // MX stays in supportedSourceCountries: the same capture showed a live outbound quote
    // (MXN 10,000 to USD 561.38, 125.78 MXN in fees), so Mexican residents can still send.
    // MX stays in supportedSourceCountries: Mexican residents can still send, not hold.
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'TH', 'PH', 'BR'],
    corridors: [
      // Verified: ~$14.74 fee on $1,000 send (wise.com/us/send-money/send-money-to-georgia)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 1.04,
        percentageFee: 0.0137,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: '~1 to 2 business days for GEL',
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
      // BRL: read from Wise's own quote endpoint on 2026-09-24, payIn BALANCE, which is the case
      // this corridor describes: the freelancer already holds USD from a client and converts it.
      // USD 1,000 -> conversion fee 5.26 (0.526%); USD 5,000 -> 24.70 (0.494%). Rate used 5.19225,
      // which the same response reports as the mid rate, so the markup really is 0 bps.
      // Modelled at 0.5%. Receiving USD by ACH into Wise USD details is free; a domestic USD WIRE
      // costs 6.11 USD, not modelled here because ACH is the route the page recommends.
      // NOT in this row, deliberately: the same quote carries a BRL_TAX line labelled "IOF tax" at
      // 0.377%. IOF is a federal tax, not a Wise fee. Folding it into percentageFee would double
      // count against providers whose marketing quotes IOF inclusive, and would misstate who
      // charges it. See the corridor copy: export-of-services receipts are zero rated under
      // Decreto 6.306/2007 art. 15-B inciso I, while a generic inbound transfer takes 0.38%.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BR', currency: 'BRL' },
        fixedFee: 0,
        percentageFee: 0.005,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: 'USD received by ACH is free. 0.5% to convert USD to BRL at the mid-market rate. Payout to a Brazilian account by Pix or TED.',
      },
      // THB fee REDERIVED 2026-09-24 from Wise's own quote endpoint, payIn BALANCE and payOut
      // BANK_TRANSFER, which is the case this corridor prices: a freelancer already holding client
      // dollars converts them to baht. Three points, mid rate 33.45 on all three:
      //   USD   350 -> 3.88  (1.109%)
      //   USD 1,000 -> 7.70  (0.770%)
      //   USD 5,000 -> 31.16 (0.623%)
      // Those fit 1.83 fixed + 0.5865%, which predicts 3.888 / 7.70 / 31.18. The previous row,
      // 0.69 + 0.41%, gave 4.79 on 1,000 and understated the real cost by about 60%. It had been
      // recorded as "verified ~$4.80 on $1,000" and no longer reconciled with anything Wise
      // publishes. Raised at review on 2026-09-24, which declined to write a number from a single
      // data point; this row comes from three. Ranking-neutral: Wise keeps the badge on this
      // corridor either way, ahead of Western Union.
      //
      // Wise is migrating Thai-address personal customers onto its Bank of Thailand licensed local
      // entity. After migration, third-party payments arriving into foreign-currency receiving
      // details are automatically converted to THB on arrival, so a Thai-resident freelancer can
      // still be paid but can no longer hold the USD. Wise's current text: customers who signed up
      // before 21 January 2026 see the changes from October 2026; those who signed up after are
      // rolled out progressively and on them by August 2026. The same article also says nothing
      // changes until October 2026, which does not sit easily with the August date. Both reported.
      //
      // REVIEWED 2026-09-24, ranking unchanged. Wise's eligibility page
      // (wise.com/help/articles/2813542) says under Additional restrictions: "Thailand - we've
      // temporarily stopped issuing currencies and account details for customers in Thailand."
      // Re-read independently at review. It carries NO date, NO new-versus-existing split and no
      // Thailand-specific article explaining it, wise.com/help/articles/2810318 does not list
      // Thailand among the countries where USD details are unavailable, and wise.com/th still
      // markets the multi-currency account, account details from over ten countries and the card.
      // Judged not strong enough to delist or move the badge. The corridor copy scopes the claim
      // for the reader instead: if you do not already hold USD details, check you can get them.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 1.83,
        percentageFee: 0.00587,
        fxMarkupBps: 0,
        typicalHours: 36,
        notes: 'Typically 1 to 2 business days for THB. Wise\'s eligibility page says it has temporarily stopped issuing currencies and account details for customers in Thailand, with no date given. Once your account moves to Wise Thailand, non-THB client payments are auto-converted to THB on arrival, and payments or transfers out are capped at 10,000 THB per transaction and 30,000 THB per day. Verify current.',
      },
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.47,
        percentageFee: 0.0035,
        fxMarkupBps: 0,
        typicalHours: 1,
      },
      // USD → Philippine PHP: PH residents hold a full Wise account with US ACH
      // receiving details (free to receive), then convert USD→PHP at mid-market.
      // Conversion fee ~0.65% typical (help-center range; verify current at wise.com/ph)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PH', currency: 'PHP' },
        fixedFee: 0,
        percentageFee: 0.0065,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: 'Free USD ACH receiving into Wise USD balance; ~0.65% conversion fee at mid-market on USD to PHP (verify current)',
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
        notes: 'USD SWIFT to Georgian USD bank account; no FX conversion',
      },
      // EUR → Georgian EUR bank account via SWIFT (non-SEPA, no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 3.00,
        percentageFee: 0.004,
        fxMarkupBps: 0,
        typicalHours: 48,
        notes: 'EUR SWIFT to Georgian EUR bank account; no FX conversion',
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
        notes: 'EUR SEPA to Portugal; no FX conversion, near-instant',
      },
    ],
    fallbackFee: {
      fixedFee: 1.50,
      percentageFee: 0.0069,
      fxMarkupBps: 0,
      typicalHours: 24,
      fxMarkupEstimated: true,
      notes: 'Estimated; verify at wise.com for your corridor',
    },
  },

  // ─── Revolut ───────────────────────────────────────────────────────────────
  // Source: https://www.revolut.com/en-US/legal/standard-fees/ (2026-05-27)
  // Source: https://cdn.revolut.com/terms_and_conditions/pdf/currency_transfer_fees_section_standard_361b3cb3_1.4.1_1774231091_en.pdf
  // Source: https://assets.revolut.com/legal/terms/International_Payments_Pricing_Sheet.pdf
  //
  // Standard plan fee model:
  //   - Local-currency network (EUR/SEPA): 0.3% transfer fee, 0 bps FX weekdays
  //   — SWIFT (GEL, THB, IDR, and others without local network): $3 flat fee (USD/EUR/GBP source)
  //   — FX markup: 0 bps weekdays; +100 bps weekends (major currencies); +200 bps weekends (exotic: GEL, THB, IDR)
  //   - Fair use limit: $1,000/month currency exchange; +0.5% above limit.
  //     NOTE: those are Revolut US figures. Portugal residents are customers of the
  //     EU-passported entity, whose Standard plan is reported at a EUR 1,000/month
  //     allowance with 1% above it. Verify before relying on 0.5% for EU corridors.
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
    lastVerified: '2026-08-27',
    // Revolut personal sign-up excludes Georgia, Thailand and Indonesia, so residents
    // there cannot hold an account. Mexico retained: Revolut Bank Mexico is live.
    supportedSourceCountries: ['US', 'GB', 'EU', 'PT', 'MX'],
    // MX removed from DESTINATIONS 2026-09-24: Revolut Bank Mexico is real, but no inbound
    // receiving fee or FX spread for the Mexican entity could be sourced, so it cannot be
    // priced. Source country retained; a Mexican resident can hold the account and send.
    supportedDestinationCountries: ['US', 'GB', 'EU', 'PT'],
    corridors: [
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
      // MXN: no priced row, deliberately. Revolut Bank S.A., Institucion de Banca Multiple
      // launched full banking operations in Mexico on 27 January 2026 under a CNBV licence,
      // with IPAB deposit protection and a local CLABE on SPEI. Confirmed from revolut.com/es-MX
      // on 2026-09-24. Two facts stop us pricing it. Revolut Mexico receives foreign currency
      // by SWIFT, not by US ACH: a Mexican customer gets no US routing number, so a US client
      // cannot pay domestically. And the Mexican site links to a costs and commissions schedule
      // rather than printing one, so there is no inbound receiving fee for the Mexican entity.
      // The row that used to sit here carried a $3 Revolut US OUTBOUND SWIFT sending fee, the
      // wrong side of the transaction and the wrong entity, plus 0 bps from Revolut Europe. At
      // 0 bps it ranked Revolut top of the Mexico table on a number nobody published, so the
      // row was removed at review rather than re-guessed. The corridor page keeps the prose.
      {
        source: { country: 'GB', currency: 'GBP' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 24,
      },
      // EUR → Portuguese EUR via SEPA (no FX, same-currency SEPA transfer)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0,
        percentageFee: 0.003,
        fxMarkupBps: 0,
        typicalHours: 1,
        notes: 'EUR SEPA to Portugal; no FX conversion',
      },
    ],
    fallbackFee: {
      fixedFee: 3,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 72,
      fxMarkupEstimated: true,
      notes: 'Estimated; verify at revolut.com for your corridor',
    },
    notes: 'Standard plan. EUR/SEPA corridors: 0.3% transfer fee, near instant. Other corridors via SWIFT: $3 flat fee, 3 to 5 days. FX at mid-market on weekdays within the $1,000/month exchange allowance; +0.5% above the allowance; +1% on weekends.',
    caveat: 'Shown: weekday, within the $1,000/month FX allowance. Above the allowance: +0.5%. Weekends: +1% extra. Those allowance figures are from Revolut US; the European entity publishes different ones, so a EEA-resident account may differ. The allowance is not modelled in the rates above, which show the transfer fee only. Revolut accounts are not available to residents of Georgia, Thailand or Indonesia.',
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
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'PK', 'BD', 'NG', 'PH', 'BR'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        fxMarkupEstimated: true,  // Payoneer's published conversion currency list does not include GEL, so this lari withdrawal may not exist at all
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
      // BR: Payoneer publishes 1% to receive into a receiving account in a currency that is NOT
      // your local currency (min 1.00 USD). A Brazilian's local currency is BRL, so on a literal
      // reading a USD receipt is exactly that case, but NO Payoneer page we opened states the
      // Brazil case explicitly. Withdrawal to a local bank in a different currency is published
      // only as "up to 2%", which is not a determinate spread. Both halves are assumptions, so
      // this row is flagged estimated and barred from the best value badge.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BR', currency: 'BRL' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
        fxMarkupEstimated: true,  // "up to 2%" is a ceiling, not a rate; and the 1% leg is inferred
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
      // Source: payoneer.com/legal/fees/ (updated Jan 2026). The attribution of the 1.2-4%
      // BDT range to that schedule was WITHDRAWN 2026-09-22: payoneer.com could not be
      // opened, and Payoneer's withdraw-funds material is quoted as a single "up to 2%"
      // for a local withdrawal in a different currency. Modeled at 2% on that basis, NOT
      // as a midpoint of 1.2-4%, which would be 2.6%. Payoneer-to-bKash costs ~3% + $1.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BD', currency: 'BDT' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + ~2% FX markup on BDT withdrawal (range 1.2 to 4%); bKash route ~3% + $1 instead',
      },
      // USD → Nigerian NGN bank account
      // Source: payoneer.com/legal/fees/ — 1% receiving fee + up to 2% FX markup on NGN withdrawal
      // Annual fee threshold: help center currently states $6,000/year received
      // (it has published $2,000 elsewhere); verify per-account in the portal
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '1% receiving fee + up to 2% FX markup on NGN withdrawal; $29.95/year if under the activity threshold (help center currently $6,000/year)',
      },
      // USD → Philippine PHP bank account, GCash, or GoTyme
      // Source: payoneer.com country guide for PH — 1% receiving + up to 2% FX on withdrawal
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PH', currency: 'PHP' },
        fixedFee: 0,
        percentageFee: 0.01,
        fxMarkupBps: 200,
        typicalHours: 48,
        notes: '1% receiving fee + up to 2% FX markup on PHP withdrawal to bank or GoTyme; GCash payouts may add a GCash-side cash-in fee, priced by funding source and not confirmed from a GCash primary source; whether the PHP 8,000/month free-then-2% figure applies to Payoneer or only to over-the-counter cash-ins is unresolved, and some sources report a flat 1% instead; verify in app',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.01,
      fxMarkupBps: 200,
      typicalHours: 96,
      fxMarkupEstimated: true,
      notes: 'Estimated; verify at payoneer.com for your corridor',
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
    lastVerified: '2026-08-27',
    supportedSourceCountries: ['US', 'GB', 'EU'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'PT', 'MX', 'TH', 'ID', 'NG', 'PH', 'BR'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PT', currency: 'EUR' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
        notes: '4.4% + $0.30 cross-border receiving fee; instant to PayPal balance, 1 to 3 days to bank',
      },
      // BR: paypal.com/br/webapps/mpp/merchant-fees. Commercial payment 4.79%, plus a further
      // 1.61% because the payer is international, plus a fixed 0.60 BRL, plus 3.50% above the base
      // exchange rate when the payment arrives in another currency. Withdrawal to a linked
      // Brazilian bank by standard transfer is free. Modelled as 6.40% (4.79 + 1.61) and 350 bps.
      // The 0.60 BRL fixed fee is about 0.12 USD and is modelled as such.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BR', currency: 'BRL' },
        fixedFee: 0.12,
        percentageFee: 0.064,
        fxMarkupBps: 350,
        typicalHours: 24,
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 24,
        fxMarkupEstimated: true,  // 3.5% is PayPal's general cross-border spread, not a Mexico figure; the corridor copy calls it an estimate
      },
      // Thailand: the 2022 relaunch removed commercial receiving from personal accounts.
      // Personal-account identity verification runs through NDID, which requires a 13-digit
      // Thai national ID, so foreign residents of Thailand cannot hold a personal Thai
      // PayPal account at all. A Thai-registered business account is the reported route for
      // freelance income. The fee row below is the generic personal-account model and does
      // not describe that route. Verify current before relying on it.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 300,
        typicalHours: 24,
        // 350 bps corrected to 300 at review 2026-09-24: PayPal Thailand publishes 3.00% above its
        // base rate, not 3.50%. The old note was also FACTUALLY WRONG and is replaced. Personal
        // accounts CAN receive goods and services payments; the 2022 relaunch removed friends and
        // family and Payouts (Mass Pay), not commercial receiving. Confirmed from the relaunch FAQ
        // and, post-relaunch, from the PayPal (Thailand) Limited user agreement effective
        // 20 February 2024. The 11.00 THB fixed fee applies to amounts received IN BAHT, so the
        // 0.30 USD stays on this row, which prices a USD receipt.
        notes: 'PayPal Thailand publishes 4.40% plus a fixed fee for cross-border commercial payments, 3.90% domestic, an 11.00 THB fixed fee on amounts received in baht, and 3.00% currency conversion above its base rate, rising to 4.00% on refunds and on payments sent more than a day after. Personal accounts CAN receive goods and services payments. Verification needs a 13-digit Thai national ID, so foreign residents of Thailand are unlikely to be approved for a personal account. Withdrawal to a Thai bank is free at 5,000 THB or more. PayPal Thai fee pages still carry 2021 effective dates. Verify current.',
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
      // USD → Philippine PHP: widely used in PH; ~4.4% + $0.30 cross-border receiving
      // + ~3.5% FX on USD→PHP conversion. GCash charges a cash-in fee on the PayPal-to-GCash
      // step and prices it by funding source (PayPal vs Payoneer vs linked bank vs OTC).
      // help.gcash.com is egress-blocked for our agents and the blog figures conflict, so we
      // publish no number for it; not modeled below.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PH', currency: 'PHP' },
        fixedFee: 0.30,
        percentageFee: 0.044,
        fxMarkupBps: 350,
        typicalHours: 48,
        notes: '4.4% + $0.30 cross-border receiving + ~3.5% FX markup; GCash adds a cash-in fee on the PayPal-to-GCash step, priced by funding source and reported at about 1% for PayPal-funded cash-ins on ordinary amounts (not confirmed from a GCash primary source; large-amount behaviour unclear; verify in app; not modeled here)',
      },
    ],
    fallbackFee: {
      fixedFee: 0.30,
      percentageFee: 0.044,
      fxMarkupBps: 350,
      typicalHours: 24,
      fxMarkupEstimated: true,
      notes: 'PayPal has limited or no GEL (Georgia) support; use Wise or Revolut',
    },
    notes: 'Georgia (GEL) not reliably supported. Fees shown are for Personal-account cross-border receiving. FX markup ~3.5% above mid-market.',
    caveat: 'Fees vary by account type and sender country. Shown: Personal-account international receiving (4.4% + $0.30 + 3.5% FX).',
  },

  // ─── GrabrFi ───────────────────────────────────────────────────────────────
  // Source: https://grabrfi.com/pricing (2026-06-02)
  // Freelancer-focused; USD checking product. Account eligibility is a fixed list of
  // countries keyed to your government-issued ID, and it excludes Georgia, Thailand and
  // Indonesia. Portugal is on the eligibility list but GrabrFi EUR payout to a Portuguese
  // bank is unconfirmed, so PT is not listed as a destination. Local-currency withdrawal: MX.
  {
    slug: 'grabrfi',
    name: 'GrabrFi',
    logoUrl: '/logos/grabrfi.svg',
    website: 'https://grabrfi.com',
    signupUrl: 'https://www.grabrfi.com/en',
    affiliateLink: 'https://app.grabrfi.com/sign-up?invite-code=kqMCKAcsollV&itm_source=app&itm_medium=referral&itm_campaign=invite_friend_promo&itm_content=ios_invite_screen',
    hasAffiliateProgram: true,
    lastVerified: '2026-08-27',
    supportedSourceCountries: ['US'],
    // MX removed from DESTINATIONS 2026-09-24. The Mexico withdrawal fee is UNRESOLVED and the
    // three readings are mutually exclusive, not merely unsourced: a flat US$2, a per-country
    // table that does not list Mexico at all, and 0.3% with a US$1 minimum and US$5 maximum.
    // help.grabrfi.com is unreachable from our tooling, so none was confirmed. The spread is
    // confirmed ABSENT: GrabrFi publishes none, the rate is shown in-app and locked at
    // confirmation with the margin embedded. Two unknowns on the one provider this site earns
    // a referral commission from is not something to print a price for, so GrabrFi is unranked
    // and appears as prose only on the corridor page. Separately confirmed across three runs:
    // the US$10 charge is the bank REJECTION fee, deducted from the refund when the receiving
    // bank bounces a payout, not a withdrawal charge.
    supportedDestinationCountries: ['US', 'GB', 'EU'],
    corridors: [],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0.01,
      fxMarkupBps: 100,
      typicalHours: 48,
      fxMarkupEstimated: true,
      notes: 'GrabrFi coverage expanding; verify at grabrfi.com for your corridor',
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
        fxMarkupEstimated: true,  // ~500 bps is an inline minor-corridor assumption, no cited source
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
      // 100 bps per the cited bestexchangerates USD to EUR check above; the row
      // previously carried 150 bps, which matched no source in this file and
      // disagreed with both the header comment and the GBP → PT row.
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
        notes: '$5 standard transfer fee shown. A $0 promotional fee was previously advertised with an expiry around July 2026; that date has passed and the promotion has not been rechecked. Verify current.',
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
        fxMarkupEstimated: true,  // no Indonesia-specific rate or spread found from any source
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'ID', currency: 'IDR' },
        fixedFee: 5,
        percentageFee: 0,
        fxMarkupBps: 175,
        typicalHours: 24,
        fxMarkupEstimated: true,  // no Indonesia-specific rate or spread found from any source
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
      // Source: PRI corridor pricing on westernunion.com country pages (rechecked 2026-08-10) -- $0 online fee for bank deposits over $200
      // Scope caveat: PRI is a home remittance scheme; WU publishes no commercial rate for this corridor, so 0 fee + 200bps are personal remittance terms
      // SBP EPD Circular Letter No. 12 of 2026 ended the TT Charges Incentive Scheme from 2026-07-01 but directs ADs to keep qualifying home remittances free of cost
      // PKR is a minor corridor; the ~2% FX spread is an estimate from third-party cross-rate comparison, not a WU-published figure
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PK', currency: 'PKR' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 200,
        typicalHours: 48,
        fxMarkupEstimated: true,  // ~2% spread is a third-party cross-rate estimate, not WU-published
        notes: '$0 online fee for bank deposits over $200 (Pakistan Remittance Initiative) + ~2% FX spread, both personal remittance terms. PRI is a home remittance scheme and does not cover business transfers; WU commercial pricing for this corridor is unpublished. Bank deposit to HBL, UBL, MCB.',
      },
    ],
    fallbackFee: {
      fixedFee: 5,
      percentageFee: 0,
      fxMarkupBps: 400,
      typicalHours: 24,
      fxMarkupEstimated: true,
      notes: 'Estimated; verify at westernunion.com for your corridor',
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
    supportedSourceCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'BR'],
    supportedDestinationCountries: ['US', 'GB', 'EU', 'GE', 'PT', 'MX', 'TH', 'ID', 'PK', 'BD', 'NG', 'PH', 'BR'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'GE', currency: 'GEL' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
        notes: '$25 to 45 sending fee + $10 to 25 correspondent fee; may arrive as USD then converted locally',
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
      // BR: no Brazilian bank tariff could be opened (itau.com.br and bb.com.br both 403). The
      // structure is a US sending fee plus the receiving bank's own spread, which Brazilian banks
      // do not publish as a line item. What IS published, and is the honest thing to point a
      // reader at, is the Banco Central's VET (Valor Efetivo Total): every authorised institution
      // must disclose an all-in effective rate before you contract, and BCB publishes a public
      // comparison ranking. Figures below are carried from other wire corridors, so estimated.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BR', currency: 'BRL' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 72,
        fxMarkupEstimated: true,  // no Brazilian bank tariff opened; spread carried from other corridors
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'MX', currency: 'MXN' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 72,
        fxMarkupEstimated: true,  // Mexican banks do not publish the spread on an inbound wire; the corridor copy calls fee and spread indicative
      },
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'THB' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 350,
        typicalHours: 96,
      },
      // USD → Thai foreign currency deposit (FCD) account via SWIFT (no FX conversion).
      // Mirrors the USD → GE/USD row: the Bank of Thailand does not require inbound
      // foreign currency to be converted, so a dollar wire into an FCD account converts
      // nothing and the spread applies only when the holder chooses to sell.
      // Does not model the Thai inward remittance commission (reported 0.25%, floor and
      // ceiling by bank), which is charged on top. Verify current.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'TH', currency: 'USD' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 96,
        notes: 'SWIFT wire; recipient receives USD in a Thai FCD account; no FX conversion. Bank inward remittance commission applies on top and is not modelled.',
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
        notes: 'SWIFT wire; recipient receives USD in Georgian bank; no FX conversion',
      },
      // EUR → Georgian EUR bank account via SWIFT (no FX conversion)
      {
        source: { country: 'EU', currency: 'EUR' },
        destination: { country: 'GE', currency: 'EUR' },
        fixedFee: 30,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 96,
        notes: 'SWIFT wire; recipient receives EUR in Georgian bank; no FX conversion',
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
        notes: '$35 flat + TT buying rate ~1 to 2% below mid-market; generates FIRC for export incentive claims.',
      },
      // USD → Nigerian NGN bank account via SWIFT
      // Nigerian banks (GTBank, Access Bank, Zenith) convert at NFEM window rate + ~2% spread
      // IMTO naira-only rule (CBN Mar 24 2026, effective May 1 2026) applies to licensed IMTO operators,
      // NOT to SWIFT client-to-business wires — SWIFT USD wires are unaffected
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 200,
        typicalHours: 72,
        notes: '$35 flat + ~2% bank FX spread above NFEM rate; SWIFT wires exempt from IMTO naira-only rule.',
      },
      // USD → Philippine PHP or USD (FCDU) bank account via SWIFT
      // No forced conversion: FCDU USD accounts at BDO, BPI, Metrobank, RCBC hold dollars.
      // Inward remittance fees vary by bank (~$6-35 + possible correspondent deduction);
      // bank FX spread applies only when converting to PHP (estimate, not published)
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'PH', currency: 'PHP' },
        fixedFee: 35,
        percentageFee: 0,
        fxMarkupBps: 150,
        typicalHours: 96,
        notes: '$25-45 sending fee + bank inward remittance fees; no forced conversion (FCDU USD accounts); spread applies only on conversion to PHP',
      },
    ],
    fallbackFee: {
      fixedFee: 35,
      percentageFee: 0,
      fxMarkupBps: 350,
      typicalHours: 96,
      fxMarkupEstimated: true,
      notes: 'Typical SWIFT estimate; check with your specific bank for exact fees',
    },
    notes: 'Fees vary by bank. Correspondent bank charges may reduce received amount unpredictably.',
    caveat: 'EU to EU routes use SEPA (cheap, ~1h). Other routes use SWIFT ($35 fee, 2 to 5 days, 3.5% FX).',
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
        notes: 'Paysera issues a Lithuanian (EU) IBAN; Eurozone clients send SEPA; receiving fee €0',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 1,
      fxMarkupEstimated: true,
    },
    notes: 'Paysera issues a Lithuanian IBAN to Georgian residents. EU clients send via SEPA; Paysera charges €0 to receive. NBG-licensed bank in Georgia.',
    caveat: 'You give your EU client a Lithuanian IBAN (LT…). They pay their bank\'s SEPA fee (~€0 to €5) separately, not deducted from your amount.',
  },

  // ─── Cleva ─────────────────────────────────────────────────────────────────
  // Source: https://www.getcleva.com/pricing (2026-06-14)
  // Nigerian-focused fintech issuing virtual US bank accounts (routing + account number).
  // Fee model: two-tier ACH deposit fee ($1 under $300, $3 at $300 or more); no percentage fee;
  // conversion and NGN withdrawal free at Cleva's quoted rate.
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
      fxMarkupEstimated: true,
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
  // Nigeria regulatory status not established. A previous 'CBN-regulated (license 10151)'
  // claim was removed on 2026-08-04 after it could not be traced to any source.
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
        fxMarkupEstimated: true,  // ~1% FX markup not traceable to a Grey pricing page
        notes: '0.8% deposit fee (min $2, max $10) + 1% conversion fee capped at $6 + ~1% FX markup',
      },
    ],
    fallbackFee: {
      fixedFee: 6,
      percentageFee: 0.008,
      fxMarkupBps: 100,
      typicalHours: 24,
      fxMarkupEstimated: true,
    },
    notes: 'Grey issues virtual USD (and GBP/EUR) accounts for Nigerian freelancers. Fees: 0.8% deposit fee (min $2, max $10) on incoming USD, plus a 1% conversion fee capped at $6 per transaction, plus ~1% FX markup. Roughly 2.4% all-in on $1,000. Supports USD, GBP, and EUR receiving.',
    caveat: 'Two capped fees apply: 0.8% deposit fee (max $10) and 1% conversion fee (max $6). On larger transfers both caps kick in and the effective rate drops.',
  },

  // ─── LemFi ─────────────────────────────────────────────────────────────────
  // Source: https://lemfi.com/pricing (2026-06-14)
  // Formerly Lemonade Finance. Issues virtual US accounts for Nigerian freelancers and diaspora.
  // Fee model: zero flat fee, zero percentage fee. Modeled at 0 bps FX markup, but the
  // LemFi terms of service describe the quoted rate as a mark-up on the wholesale rate
  // and do not publish its size, so 0 bps is a floor rather than a verified figure
  // (flagged 2026-08-04, needs a human decision on unranking or modeling a spread).
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
    // LemFi is deliberately NOT priced. Three verification passes failed to source its
    // FX markup, and its own terms say the rate carries a mark-up on the wholesale rate,
    // so modelling it at 0 bps put an impossible free option at the top of the Nigeria
    // table. Emptying this list is what actually removes it: calculate() filters on
    // supportedDestinationCountries, and LemFi's fallbackFee is an identical 0/0/0, so
    // deleting the corridor row alone would have been a no-op.
    supportedDestinationCountries: [],
    corridors: [
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 48,
      fxMarkupEstimated: true,
    },
    notes: 'LemFi (formerly Lemonade Finance) issues a virtual US account for Nigerian freelancers. No flat fee and no percentage fee on this corridor, but the LemFi terms of service say the exchange rate is a mark-up on the wholesale rate and the size of that mark-up is not published, so the zero-cost fee model here understates the real cost by an unknown amount. FCA-licensed (UK), FINTRAC-registered Money Service Business (Canada), CBN-approved. Compare the in-app rate against a mid-market reference, and verify current withdrawal limits before relying on it for large amounts.',
  },

  // ─── Raenest ───────────────────────────────────────────────────────────────
  // Source: help.raenest.com fees collection (verified 2026-07-30)
  // African freelancer-focused fintech issuing virtual USD and GBP accounts.
  // Fee model: 4 free deposits/month shared across USD/GBP/EUR/USDT/USDC (since
  // 2026-01-06), then $1 flat per ACH or stablecoin deposit. Conversion is a
  // 0.5% fee CAPPED between $0.25 and $2.70 per conversion, not an uncapped spread.
  // Modeled below as a $2.70 fixed fee (the cap, which binds at and above ~$540)
  // with 0 bps markup, assuming a deposit within the free monthly allowance.
  // Overstates cost below ~$540, where the real fee is 0.5% of the amount
  // (floor $0.25), which is less than the modeled $2.70.
  // CBN-licensed IMTO.
  {
    slug: 'raenest',
    name: 'Raenest',
    logoUrl: '/logos/raenest.svg',
    website: 'https://raenest.com',
    signupUrl: 'https://raenest.com',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-07-30',
    supportedSourceCountries: ['US', 'GB'],
    supportedDestinationCountries: ['NG'],
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 2.70,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 24,
        notes: '0.5% conversion fee capped at $2.70 (min $0.25); 4 free deposits/month, then $1 flat each; CBN-licensed IMTO',
      },
    ],
    fallbackFee: {
      fixedFee: 2.70,
      percentageFee: 0,
      fxMarkupBps: 0,
      typicalHours: 24,
      fxMarkupEstimated: true,
    },
    notes: 'Raenest issues virtual USD and GBP accounts for African freelancers and remote workers. Since January 2026: 4 free deposits per month shared across USD, GBP, EUR, USDT and USDC, then $1 flat per ACH or stablecoin deposit. The USD-to-NGN conversion fee is 0.5% capped between $0.25 and $2.70 per conversion, so cost does not scale with transfer size above about $540. Verify the current allowance at raenest.com/pricing. No annual account fee. CBN-licensed IMTO.',
    caveat: 'Conversion fee is capped at $2.70, so the effective rate falls as the transfer size rises.',
  },
  // ─── Higlobe ───────────────────────────────────────────────────────────────
  // Source: https://higlobe.com/pt-br/pricing (2026-09-24)
  // Source: https://higlobe.com/pt-br/how-it-works (2026-09-24)
  // Scoped to BR only on purpose. Higlobe also serves Mexico, and its Mexican spread is
  // reported at zero, but adding MX here would change the ranking on a live page that was
  // reviewed on 2026-09-24 with Higlobe deliberately out of the priced table. That is a
  // separate, ranking-moving decision and needs its own verifier and reviewer pass.
  {
    slug: 'higlobe',
    name: 'Higlobe',
    logoUrl: '/logos/higlobe.svg',
    website: 'https://higlobe.com',
    signupUrl: 'https://higlobe.com/pt-br',
    affiliateLink: '',
    hasAffiliateProgram: false,
    lastVerified: '2026-09-24',
    supportedSourceCountries: ['US'],
    supportedDestinationCountries: ['BR'],
    corridors: [
      // Higlobe publishes a flat 0.2% spread for BRL, no transfer fee and no maintenance fee,
      // with volume described as unlimited and the quoted amount guaranteed before you confirm:
      // "O valor que você vê antes de confirmar sua transação é exatamente o que você receberá."
      // This is a published spread, so the row is NOT flagged estimated and can take the badge.
      // Unconfirmed and hedged in the corridor copy instead: CPF versus CNPJ eligibility,
      // onboarding requirements, and how IOF and the contrato de câmbio are handled.
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'BR', currency: 'BRL' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 20,
        typicalHours: 24,
        notes: '0.2% spread, no transfer fee, no monthly fee. US account number and routing number for ACH; payout to Brazil by Pix.',
      },
    ],
    fallbackFee: {
      fixedFee: 0,
      percentageFee: 0,
      fxMarkupBps: 20,
      typicalHours: 24,
      fxMarkupEstimated: true,
    },
    notes: 'Higlobe gives a Brazilian resident their own US receiving account, an account number and a routing number to hand a US client, so the client pays by ordinary domestic ACH. Payout to Brazil goes out over Pix. It publishes a flat 0.2% spread for BRL with no transfer fee and no monthly fee, and states that the amount shown before you confirm is the amount you receive. That makes it the cheapest published number on this corridor by a clear margin. What we could not confirm: whether it onboards individuals on a CPF or requires a CNPJ, what onboarding asks for, and how it handles IOF and the contrato de câmbio. Check those before you move real volume.',
    caveat: 'Spread published at 0.2% for BRL. Eligibility and onboarding requirements not verified.',
  },
];
