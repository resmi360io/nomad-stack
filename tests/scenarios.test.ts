// The required example scenarios, on the real provider data and a frozen rate fixture. Each expected
// fee follows from the schedule recorded in data/providers.ts for that row (the comment beside each
// assertion says which), so a test failing here means either the schedule or the engine changed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculate, describeResults, isComparable } from '../lib/calculate.ts';
import { PROVIDERS } from '../data/providers.ts';

const { rates } = JSON.parse(readFileSync(new URL('./fixtures/rates-2026-10-29.json', import.meta.url), 'utf8'));
const run = (src: string, dest: string, cur: string, amount: number) =>
  calculate(src as never, dest as never, cur as never, amount, PROVIDERS, rates);
const by = (qs: ReturnType<typeof run>, slug: string) => {
  const q = qs.find((x) => x.provider.slug === slug);
  assert.ok(q, `${slug} missing`);
  return q;
};
const fees = (qs: ReturnType<typeof run>, slug: string) => by(qs, slug).fees.map((f) => f.amount);
const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('US to Pakistan, USD 1,000: Western Union personal price shown but unranked; Payoneer tops, no badge', () => {
  const qs = run('US', 'PK', 'PKR', 1000);
  assert.deepEqual(qs.filter(isComparable).map((q) => q.provider.slug), ['payoneer', 'bank-wire']);
  const wu = by(qs, 'western-union');
  assert.equal(wu.status, 'personal-only');
  assert.equal(wu.rank, null);
  assert.equal(wu.routeType, 'sender-transfer');
  assert.ok(wu.netReceivedInDest > by(qs, 'payoneer').netReceivedInDest, 'WU really is the larger number');
  // Payoneer: 1% receiving fee, then the 2.6% midpoint margin on what is left.
  assert.deepEqual(fees(qs, 'payoneer'), [10]);
  near(by(qs, 'payoneer').fxMarginInSource, 990 * 0.026);
  near(by(qs, 'payoneer').totalCostPercent, (10 + 25.74) / 10);
  assert.equal(qs.some((q) => q.isBestValue), false, 'Payoneer margin is an estimate: no badge');
  assert.match(describeResults(qs), /top: Payoneer\. No best value badge/);
});

for (const amount of [500, 1000]) {
  test(`US to Georgia in lari, USD ${amount}: Payoneer lari route unverified and unranked; Wise first, estimated, no badge`, () => {
    const qs = run('US', 'GE', 'GEL', amount);
    const p = by(qs, 'payoneer');
    assert.equal(p.status, 'unverified');
    assert.equal(p.isBestValue, false);
    // Wise US to GEL: Wise publishes one amount only (14.69 USD on 1,000 from a balance), so the row is
    // modelled proportionally at 1.469% and flagged as an estimate (owner approved 2026-11-09).
    near(by(qs, 'wise').totalFeeInSource, Math.round(0.01469 * amount * 100) / 100);
    assert.equal(qs[0].provider.slug, 'wise');
    assert.equal(qs[0].isBestValue, false, 'estimated row cannot take the badge');
  });
}

test('US to Georgia in dollars, USD 500 and 1,000: Payoneer receiving 1% (min 1) + 2.6% withdrawal estimate', () => {
  assert.deepEqual(fees(run('US', 'GE', 'USD', 1000), 'payoneer'), [10, 26]);
  assert.deepEqual(fees(run('US', 'GE', 'USD', 500), 'payoneer'), [5, 13]);
  assert.deepEqual(fees(run('US', 'GE', 'USD', 50), 'payoneer'), [1, 1.3]); // the 1.00 minimum binds
  assert.equal(by(run('US', 'GE', 'USD', 1000), 'payoneer').status, 'comparable');
});

test('UK to Georgia, GBP 10,000 in lari: Wise 0.87 + 0.67%; Payoneer unverified', () => {
  const qs = run('GB', 'GE', 'GEL', 10000);
  assert.equal(qs[0].sourceCurrency, 'GBP');
  near(by(qs, 'wise').totalFeeInSource, 67.87);
  assert.equal(by(qs, 'payoneer').status, 'unverified');
});

test('US to Nigeria, USD 200: minimums and tiers apply', () => {
  const qs = run('US', 'NG', 'NGN', 200);
  assert.deepEqual(fees(qs, 'grey'), [2, 1.98]);  // deposit 0.8% min 2; conversion 1% of 198
  assert.deepEqual(fees(qs, 'cleva'), [2]);       // 0.8% = 1.60, minimum 2
  assert.deepEqual(fees(qs, 'raenest'), [2]);     // ACH deposit under 500: $2
});

test('US to Nigeria, USD 1,000: caps start to bind', () => {
  const qs = run('US', 'NG', 'NGN', 1000);
  assert.deepEqual(fees(qs, 'grey'), [8, 6]);     // conversion 1% of 992 capped at 6
  assert.deepEqual(fees(qs, 'cleva'), [5]);       // 0.8% = 8, capped at 5
  assert.deepEqual(fees(qs, 'raenest'), [4]);     // ACH deposit 500 and over: $4
});

test('US to Nigeria, USD 5,000: Grey both caps, 16 in fees (the reported 46 was the uncapped model)', () => {
  const qs = run('US', 'NG', 'NGN', 5000);
  assert.deepEqual(fees(qs, 'grey'), [10, 6]);
  near(by(qs, 'grey').totalFeeInSource, 16);
  // Grey's margin is our ~1% estimate on what is left after fees: 4,984 x 1%.
  near(by(qs, 'grey').fxMarginInSource, 49.84);
});

test('US to Nigeria, USD 1,000: PayPal 4.90% + 0.30, then Paga 3% + 3 on the remainder (reviewed 2026-10-29)', () => {
  const pp = by(run('US', 'NG', 'NGN', 1000), 'paypal');
  assert.deepEqual(pp.fees.map((f) => f.amount), [49.3, 31.52]); // 49.30; then 3 + 3% of 950.70
  near(pp.totalFeeInSource, 80.82);
  assert.equal(pp.fxMarkupBps, 0);
  assert.deepEqual(pp.missingCosts, ["Paga's exchange rate on the naira payout"]);
});

test('US to Nigeria: PayPal via Paga is a partial price, never ranked or badged, at every amount', () => {
  for (const amount of [200, 1000, 5000]) {
    const pp = by(run('US', 'NG', 'NGN', amount), 'paypal');
    assert.equal(pp.status, 'incomplete');
    assert.equal(pp.rank, null);
    assert.ok(pp.missingCosts.length > 0);
  }
});

test('every scenario: ranked rows come first, ranks are 1..n, at most one badge, on a ranked row', () => {
  const cases: [string, string, string, number][] = [
    ['US', 'PK', 'PKR', 1000], ['US', 'GE', 'GEL', 500], ['US', 'GE', 'GEL', 1000], ['US', 'GE', 'USD', 1000],
    ['GB', 'GE', 'GEL', 10000], ['US', 'NG', 'NGN', 200], ['US', 'NG', 'NGN', 1000], ['US', 'NG', 'NGN', 5000],
  ];
  for (const c of cases) {
    const qs = run(...c);
    const ranked = qs.filter(isComparable);
    assert.deepEqual(qs.slice(0, ranked.length), ranked, `${c} ranked rows not first`);
    assert.deepEqual(ranked.map((q) => q.rank), ranked.map((_, i) => i + 1));
    const badged = qs.filter((q) => q.isBestValue);
    assert.ok(badged.length <= 1);
    if (badged[0]) assert.equal(badged[0], ranked[0]);
    for (const q of qs) near(q.totalCostPercent, (1 - q.netReceivedInDest / (c[3] * (rates[c[2]] / rates[q.sourceCurrency]))) * 100, 1e-9);
  }
});
