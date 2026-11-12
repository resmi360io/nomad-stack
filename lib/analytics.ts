// Properties for the calculator's `calc_run` PostHog event, kept pure so the tests can check them.
// The event exists to answer one question the site could not: do visitors use the calculator, on which
// corridors, and how often does a run lead to an `affiliate_click`. It never carries the exact amount,
// only a band, because the analysis needs the size of a payment, not the payment.
import { isComparable } from './calculate.ts';
import type { Quote } from './calculate';
import type { CountryCode, Currency } from '../data/providers';

// Upper bounds in the source currency. Labels use plain hyphens (no en dashes anywhere on this site).
const BANDS: [number, string][] = [
  [500, 'under 500'],
  [2000, '500-2000'],
  [5000, '2000-5000'],
  [10000, '5000-10000'],
];

export function amountBand(amount: number): string {
  for (const [upper, label] of BANDS) if (amount < upper) return label;
  return '10000 and over';
}

export function calcRunProperties(
  quotes: Quote[],
  src: CountryCode,
  dest: CountryCode,
  destCurrency: Currency,
  amount: number,
) {
  const top = quotes.find(isComparable);
  // Every quote shares the source currency; with no quotes there is nothing to compare, so the
  // corridor falls back to the countries.
  const sourceCurrency = quotes[0]?.sourceCurrency ?? src;
  return {
    // Same format as `affiliate_click`'s corridor, so the two events join on it.
    corridor: `${sourceCurrency}→${destCurrency}`,
    source_country: src,
    dest_country: dest,
    source_currency: sourceCurrency,
    dest_currency: destCurrency,
    amount_band: amountBand(amount),
    quotes_shown: quotes.length,
    quotes_ranked: quotes.filter(isComparable).length,
    top_provider: top?.provider.slug ?? null,
    has_best_value: quotes.some((q) => q.isBestValue),
  };
}

// Properties for an `affiliate_click` fired from a provider link outside the results table: the
// rate-page button and the Wise links on the pillar and the sender page. `placement` says which,
// so the clicks can be told apart from the table's, which carry `rank` and `is_best_value` instead.
export type OutboundPlacement = 'rate_page' | 'pillar' | 'sender_page';

export function outboundClickProperties(
  placement: OutboundPlacement,
  provider: { slug: string; name: string },
  isAffiliate: boolean,
  corridor?: string,
) {
  return {
    provider: provider.slug,
    provider_name: provider.name,
    // Same format as the table's `corridor`, so the events join on it. Null where a link is not
    // tied to one corridor (the Wise links on the pillar and the sender page).
    corridor: corridor ?? null,
    is_affiliate: isAffiliate,
    placement,
  };
}
