// Engine tests. Synthetic providers, so every expected number here follows from the assumptions
// written next to it rather than from a real provider's schedule; the real-data scenarios live in
// scenarios.test.ts. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculate,
  computeFees,
  describeResults,
  feeScheduleOf,
  isComparable,
  roundCents,
} from '../lib/calculate.ts';
import type { CorridorFee, Provider } from '../data/providers.ts';

const RATES = { USD: 1, NGN: 1000, GEL: 2.5, PKR: 280 } as never;

function provider(slug: string, row: Partial<CorridorFee>, extra: Partial<Provider> = {}): Provider {
  return {
    slug,
    name: slug.toUpperCase(),
    logoUrl: '',
    website: '',
    signupUrl: `https://example.com/${slug}`,
    affiliateLink: '',
    hasAffiliateProgram: false,
    corridors: [
      {
        source: { country: 'US', currency: 'USD' },
        destination: { country: 'NG', currency: 'NGN' },
        fixedFee: 0,
        percentageFee: 0,
        fxMarkupBps: 0,
        typicalHours: 24,
        ...row,
      },
    ],
    fallbackFee: { fixedFee: 0, percentageFee: 0, fxMarkupBps: 0, typicalHours: 24, fxMarkupEstimated: true },
    supportedSourceCountries: ['US'],
    supportedDestinationCountries: ['NG'],
    lastVerified: '2026-10-29',
    ...extra,
  };
}

const quote = (p: Provider, amount: number) => calculate('US', 'NG', 'NGN', amount, [p], RATES)[0];

// ── Fee components ─────────────────────────────────────────────────────────────

test('percentage-only fee', () => {
  assert.deepEqual(computeFees(1000, [{ label: 'p', percent: 0.01 }]), [{ label: 'p', amount: 10 }]);
});

test('fixed-only fee', () => {
  assert.deepEqual(computeFees(1000, [{ label: 'f', fixed: 3 }]), [{ label: 'f', amount: 3 }]);
});

test('fixed plus percentage in one component', () => {
  // 0.30 + 4.4% of 1000 = 44.30
  assert.equal(computeFees(1000, [{ label: 'x', fixed: 0.3, percent: 0.044 }])[0].amount, 44.3);
});

test('legacy rows read as fixed then percentage of the amount sent', () => {
  const schedule = feeScheduleOf({ fixedFee: 6, percentageFee: 0.008 });
  assert.deepEqual(computeFees(5000, schedule).map((l) => l.amount), [6, 40]);
});

test('minimum applies below the threshold, not at or above it', () => {
  // 0.8% with a $2 minimum: the minimum binds below $250 and stops binding at $250.
  const c = [{ label: 'd', percent: 0.008, min: 2 }];
  assert.equal(computeFees(249.99, c)[0].amount, 2);
  assert.equal(computeFees(250, c)[0].amount, 2);
  assert.equal(computeFees(250.01, c)[0].amount, 2);
  assert.equal(computeFees(300, c)[0].amount, 2.4);
});

test('maximum caps at, and only above, the threshold', () => {
  // 0.8% capped at $10: the cap binds from $1,250.
  const c = [{ label: 'd', percent: 0.008, max: 10 }];
  assert.equal(computeFees(1249, c)[0].amount, 9.99);
  assert.equal(computeFees(1250, c)[0].amount, 10);
  assert.equal(computeFees(1251, c)[0].amount, 10);
  assert.equal(computeFees(5000, c)[0].amount, 10);
});

test('fee order: a remaining-basis fee is charged on what is left after earlier fees', () => {
  // Deposit 0.8% (min 2, max 10) on the amount sent, then conversion 1% capped at 6 on the rest.
  const c = [
    { label: 'Deposit fee', percent: 0.008, min: 2, max: 10 },
    { label: 'Conversion fee', percent: 0.01, max: 6, basis: 'remaining' as const },
  ];
  // $200: deposit max(1.60, 2) = 2.00; conversion 1% of 198 = 1.98
  assert.deepEqual(computeFees(200, c).map((l) => l.amount), [2, 1.98]);
  // $599: deposit 4.79; conversion 1% of 594.21 = 5.94
  assert.deepEqual(computeFees(599, c).map((l) => l.amount), [4.79, 5.94]);
  // $1,000: deposit 8; conversion 1% of 992 = 9.92, capped at 6
  assert.deepEqual(computeFees(1000, c).map((l) => l.amount), [8, 6]);
  // $5,000: both caps: 10 + 6 = 16
  assert.deepEqual(computeFees(5000, c).map((l) => l.amount), [10, 6]);
});

test('tiered (conditional) fee: one band below a threshold, another at or above it', () => {
  const c = [
    { label: 'Deposit fee', fixed: 1, appliesBelow: 300 },
    { label: 'Deposit fee', fixed: 3, appliesFrom: 300 },
  ];
  assert.deepEqual(computeFees(299.99, c).map((l) => l.amount), [1]);
  assert.deepEqual(computeFees(300, c).map((l) => l.amount), [3]);
  assert.deepEqual(computeFees(300.01, c).map((l) => l.amount), [3]);
});

test('a fee never takes more than the amount sent', () => {
  assert.deepEqual(computeFees(10, [{ label: 'wire', fixed: 35 }]).map((l) => l.amount), [10]);
});

test('cent rounding is half away from zero and avoids float artefacts', () => {
  assert.equal(roundCents(0.015), 0.02);
  assert.equal(roundCents(1.005), 1.01);
  assert.equal(roundCents(13.700000000000001), 13.7);
  // 1.37% of 1000 = 13.700000000000001 in floating point
  assert.equal(computeFees(1000, [{ label: 'p', percent: 0.0137 }])[0].amount, 13.7);
});

// ── Conversion and totals ──────────────────────────────────────────────────────

test('conversion: net = (amount - fees) x mid x (1 - markup)', () => {
  const q = quote(provider('a', { fixedFee: 10, fxMarkupBps: 200 }), 1000);
  // (1000 - 10) x 1000 x 0.98 = 970,200
  assert.equal(Math.round(q.netReceivedInDest), 970200);
  assert.equal(q.totalFeeInSource, 10);
  // margin: 990 x 2% = 19.80
  assert.ok(Math.abs(q.fxMarginInSource - 19.8) < 1e-9);
  assert.ok(Math.abs(q.totalCostInSource - 29.8) < 1e-9);
});

test('total cost percent equals 1 - net / (amount x mid), the figure tables print', () => {
  const q = quote(provider('a', { fixedFee: 6, percentageFee: 0.008, fxMarkupBps: 100 }), 5000);
  const viaMid = (1 - q.netReceivedInDest / (5000 * 1000)) * 100;
  assert.ok(Math.abs(q.totalCostPercent - viaMid) < 1e-9);
});

test('same-currency routes carry no FX margin', () => {
  const p = provider('a', { destination: { country: 'NG', currency: 'NGN' }, fixedFee: 35 });
  const q = quote(p, 1000);
  assert.equal(q.fxMarginInSource, 0);
});

test('zero, negative, NaN and infinite amounts return no quotes', () => {
  const p = provider('a', { fixedFee: 1 });
  for (const a of [0, -100, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.deepEqual(calculate('US', 'NG', 'NGN', a, [p], RATES), []);
  }
});

test('decimal amounts are priced exactly', () => {
  const q = quote(provider('a', { percentageFee: 0.01 }), 1234.56);
  assert.equal(q.totalFeeInSource, 12.35); // 12.3456 rounds to 12.35
});

// ── Eligibility, status and ranking ────────────────────────────────────────────

test('statuses: comparable, personal-only, unverified, incomplete', () => {
  assert.equal(quote(provider('a', {}), 1000).status, 'comparable');
  assert.equal(quote(provider('a', { personalRemittancePricing: true }), 1000).status, 'personal-only');
  assert.equal(quote(provider('a', { availability: 'unverified' }), 1000).status, 'unverified');
  assert.equal(quote(provider('a', { missingCosts: ['Paga withdrawal fee'] }), 1000).status, 'incomplete');
  // precedence: unverified beats personal beats incomplete
  assert.equal(
    quote(provider('a', { availability: 'unverified', personalRemittancePricing: true, missingCosts: ['x'] }), 1000).status,
    'unverified',
  );
});

test('route type defaults to recipient account and can be set per provider or per row', () => {
  assert.equal(quote(provider('a', {}), 1000).routeType, 'recipient-account');
  assert.equal(quote(provider('a', {}, { routeType: 'sender-transfer' }), 1000).routeType, 'sender-transfer');
  assert.equal(
    quote(provider('a', { routeType: 'recipient-account' }, { routeType: 'sender-transfer' }), 1000).routeType,
    'recipient-account',
  );
});

test('a cheaper personal-only price never outranks a comparable business route', () => {
  const personal = provider('wu', { fxMarkupBps: 200, personalRemittancePricing: true }, { routeType: 'sender-transfer' });
  const business = provider('pay', { percentageFee: 0.01, fxMarkupBps: 260 });
  const qs = calculate('US', 'NG', 'NGN', 1000, [personal, business], RATES);
  assert.equal(qs[0].provider.slug, 'pay');
  assert.equal(qs[0].rank, 1);
  assert.equal(qs[1].provider.slug, 'wu');
  assert.equal(qs[1].rank, null);
  assert.ok(qs[1].netReceivedInDest > qs[0].netReceivedInDest, 'the personal price really is cheaper');
});

test('an incomplete (lower-bound) quote is not ranked against complete ones', () => {
  const partial = provider('pp', { missingCosts: ['withdrawal fee'] });
  const full = provider('ok', { fixedFee: 20 });
  const qs = calculate('US', 'NG', 'NGN', 1000, [partial, full], RATES);
  assert.deepEqual(qs.map((q) => [q.provider.slug, q.rank]), [['ok', 1], ['pp', null]]);
});

test('an unverified route is listed but never ranked or badged', () => {
  const u = provider('u', { availability: 'unverified' });
  const qs = calculate('US', 'NG', 'NGN', 1000, [u], RATES);
  assert.equal(qs.length, 1);
  assert.equal(qs[0].rank, null);
  assert.equal(qs[0].isBestValue, false);
});

test('best value: top comparable row only, and only when its margin is sourced', () => {
  const sourced = provider('s', { fixedFee: 5 });
  const estimated = provider('e', { fixedFee: 1, fxMarkupEstimated: true });
  // The estimated route is cheaper, ranks first, and therefore nobody gets the badge.
  let qs = calculate('US', 'NG', 'NGN', 1000, [sourced, estimated], RATES);
  assert.equal(qs[0].provider.slug, 'e');
  assert.equal(qs.some((q) => q.isBestValue), false);
  // Make the sourced route cheaper: it ranks first and takes the badge.
  qs = calculate('US', 'NG', 'NGN', 1000, [provider('s', { fixedFee: 0.5 }), estimated], RATES);
  assert.equal(qs[0].provider.slug, 's');
  assert.equal(qs[0].isBestValue, true);
  assert.equal(qs.filter((q) => q.isBestValue).length, 1);
});

test('the badge cannot land on a non-comparable row even when it is the only sourced one', () => {
  const personal = provider('wu', { personalRemittancePricing: true });
  const qs = calculate('US', 'NG', 'NGN', 1000, [personal], RATES);
  assert.equal(qs[0].isBestValue, false);
});

test('fallback quotes are estimates and say they were not matched to a corridor row', () => {
  const p = provider('f', {}, { corridors: [] });
  const q = quote(p, 1000);
  assert.equal(q.matchedCorridorRow, false);
  assert.equal(q.isEstimate, true);
});

// ── Announcement consistency ───────────────────────────────────────────────────

test('the live-region sentence names the badge holder only when the page shows a badge', () => {
  const estimated = provider('e', { fxMarkupEstimated: true });
  const qs = calculate('US', 'NG', 'NGN', 1000, [estimated], RATES);
  const text = describeResults(qs);
  assert.ok(!/Best value: E/.test(text), text);
  assert.match(text, /No best value badge/);
  const sourced = calculate('US', 'NG', 'NGN', 1000, [provider('s', {})], RATES);
  assert.match(describeResults(sourced), /Best value: S\./);
});

test('the live-region sentence counts unranked routes and never calls them the top', () => {
  const qs = calculate('US', 'NG', 'NGN', 1000, [
    provider('wu', { personalRemittancePricing: true }),
    provider('pay', { percentageFee: 0.01 }),
  ], RATES);
  const text = describeResults(qs);
  assert.match(text, /top: PAY\./);
  assert.match(text, /1 more shown separately, not ranked\./);
});

test('no comparable route: the sentence says so', () => {
  const qs = calculate('US', 'NG', 'NGN', 1000, [provider('wu', { personalRemittancePricing: true })], RATES);
  assert.match(describeResults(qs), /No option can be ranked/);
  assert.equal(qs.filter(isComparable).length, 0);
});
