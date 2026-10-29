import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatAmountNumber, formatHours, formatMoney, formatPercent } from '../lib/format.ts';

test('whole-unit currencies print without decimals, others with two', () => {
  assert.equal(formatAmountNumber(271376.4, 'PKR'), '271,376');
  assert.equal(formatAmountNumber(271376.5, 'PKR'), '271,377');
  for (const c of ['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP', 'INR', 'COP', 'UZS', 'ARS', 'UAH']) {
    assert.doesNotMatch(formatAmountNumber(1234.56, c), /\./, c);
  }
  assert.equal(formatAmountNumber(2555.649, 'GEL'), '2,555.65');
  assert.equal(formatAmountNumber(16, 'USD'), '16.00');
});

test('calculator and tables print the same digits for the same amount', () => {
  // The calculator used to show INR to the cent while the corridor table rounded it.
  assert.equal(formatMoney(94803.47, 'INR'), `INR ${formatAmountNumber(94803.47, 'INR')}`);
  assert.equal(formatMoney(94803.47, 'INR'), 'INR 94,803');
});

test('non-finite values never print as a dash', () => {
  assert.equal(formatAmountNumber(Number.NaN, 'USD'), 'n/a');
  assert.equal(formatMoney(Number.POSITIVE_INFINITY, 'USD'), 'USD n/a');
  assert.equal(formatPercent(Number.NaN), 'n/a');
});

test('percent and duration formatting', () => {
  assert.equal(formatPercent(3.5741), '3.57%');
  assert.equal(formatPercent(0.06, 2), '0.06%');
  assert.equal(formatHours(0.5), '<1 hr');
  assert.equal(formatHours(1), '~1 hr');
  assert.equal(formatHours(5), '~5 hrs');
  assert.equal(formatHours(24), '~1 day');
  assert.equal(formatHours(72), '~3 days');
});
