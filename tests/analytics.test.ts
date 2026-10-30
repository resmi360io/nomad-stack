import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountBand, calcRunProperties } from '../lib/analytics.ts';
import { calculate } from '../lib/calculate.ts';
import { PROVIDERS } from '../data/providers.ts';
import { readFileSync } from 'node:fs';

const { rates } = JSON.parse(readFileSync(new URL('./fixtures/rates-2026-10-29.json', import.meta.url), 'utf8'));

test('amount bands have closed lower bounds and no dashes', () => {
  assert.equal(amountBand(0), 'under 500');
  assert.equal(amountBand(499.99), 'under 500');
  assert.equal(amountBand(500), '500-2000');
  assert.equal(amountBand(1000), '500-2000');
  assert.equal(amountBand(2000), '2000-5000');
  assert.equal(amountBand(9999), '5000-10000');
  assert.equal(amountBand(10000), '10000 and over');
  for (const a of [1, 700, 3000, 7000, 50000]) assert.doesNotMatch(amountBand(a), /[–—]/);
});

test('calc_run carries the corridor in the affiliate_click format and never the exact amount', () => {
  const quotes = calculate('US', 'PK', 'PKR', 1234, PROVIDERS, rates);
  const p = calcRunProperties(quotes, 'US', 'PK', 'PKR', 1234);
  assert.equal(p.corridor, 'USD→PKR');
  assert.equal(p.amount_band, '500-2000');
  assert.ok(!Object.values(p).includes(1234));
  assert.equal(p.quotes_shown, quotes.length);
  assert.ok(p.quotes_ranked <= p.quotes_shown);
  assert.equal(p.top_provider, quotes[0].provider.slug);
});
