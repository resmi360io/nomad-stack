// Builds one frozen edition of the cost index: what a payment from a US client becomes in each corridor,
// priced by calculate() against a fixed rate snapshot, so every number in the edition is reproducible.
//   node --experimental-strip-types scripts/cost-index.ts <rates.json> <edition YYYY-MM> > data/cost-index/<edition>.json
// An edition is never regenerated after it is published: a later fee correction belongs in the next one.
import { readFileSync } from 'node:fs';
import { calculate, isComparable } from '../lib/calculate.ts';
import { PROVIDERS } from '../data/providers.ts';
import { CORRIDORS } from '../data/corridors.ts';

const [ratesPath, edition] = process.argv.slice(2);
if (!ratesPath || !edition) {
  console.error('usage: node --experimental-strip-types scripts/cost-index.ts <rates.json> <edition YYYY-MM>');
  process.exit(2);
}
const fixture = JSON.parse(readFileSync(ratesPath, 'utf8'));
const AMOUNTS = [500, 1000, 5000];
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

const corridors = CORRIDORS.map((c) => ({
  slug: c.slug,
  country: c.country,
  currency: c.destination,
  amounts: AMOUNTS.map((amount) => {
    const quotes = calculate(c.sourceCountry as never, c.destCountry as never, c.destination as never, amount, PROVIDERS, fixture.rates);
    const ranked = quotes.filter(isComparable).map((q) => ({
      provider: q.provider.name,
      totalCostPercent: round(q.totalCostPercent),
      totalCostUsd: round(q.totalCostInSource),
      received: round(q.netReceivedInDest),
      marginEstimated: q.isEstimate,
    }));
    const unranked = quotes.filter((q) => !isComparable(q)).map((q) => ({ provider: q.provider.name, status: q.status }));
    const best = ranked[0];
    const worst = ranked[ranked.length - 1];
    return {
      amount,
      ranked,
      unranked,
      gapUsd: best && worst && ranked.length > 1 ? round(worst.totalCostUsd - best.totalCostUsd) : null,
    };
  }),
}));

console.log(JSON.stringify({
  edition,
  rateSource: fixture.source,
  rateDate: fixture.rateDate,
  sourceCountry: 'US',
  sourceCurrency: 'USD',
  method: 'calculate() in lib/calculate.ts over data/providers.ts; ranked routes are those isComparable() accepts',
  corridors,
}, null, 2));
