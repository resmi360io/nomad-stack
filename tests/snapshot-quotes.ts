// Prints every quote calculate() produces for every corridor, receiving currency and a range of
// amounts, against the frozen rate fixture. Run before and after a change to the fee model and
// diff the two outputs: any number that moves must be one the change meant to move.
//   node --experimental-strip-types tests/snapshot-quotes.ts > before.json
import { readFileSync } from 'node:fs';
import { calculate, getAvailableDestCurrencies } from '../lib/calculate.ts';
import { PROVIDERS } from '../data/providers.ts';
import { CORRIDORS } from '../data/corridors.ts';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/rates-2026-10-29.json', import.meta.url), 'utf8'));
const AMOUNTS = [1, 50, 199, 200, 250, 299, 300, 500, 599, 600, 1000, 1249, 1250, 1251, 2000, 5000, 10000];
const SOURCES = ['US', 'GB', 'EU'] as const;
const out: Record<string, unknown> = {};
const dests = [...new Set(CORRIDORS.map((c) => c.destCountry))];
for (const src of SOURCES) for (const dest of dests) {
  for (const cur of getAvailableDestCurrencies(src as never, dest as never, PROVIDERS)) {
    for (const amount of AMOUNTS) {
      const q = calculate(src as never, dest as never, cur as never, amount, PROVIDERS, fixture.rates);
      out[`${src}>${dest}/${cur}@${amount}`] = q.map((x) => [x.provider.slug, +x.netReceivedInDest.toFixed(6), +x.totalFeeInSource.toFixed(6), x.isBestValue, x.isEstimate]);
    }
  }
}
console.log(JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"'));
