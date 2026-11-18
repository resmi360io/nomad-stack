import type { Currency } from '@/data/providers';

// Where a set of rates came from. The copy on every page says which, because the two feeds do not
// refresh at the same speed: FastForex updates its midpoints every minute on the cheapest plan,
// open.er-api.com publishes once a day. See AGENTS.md, "The fee model".
export type RateSource = 'fastforex' | 'open.er-api.com';

export interface RatesResult {
  rates: Record<Currency, number>;
  rateDate: string;          // YYYY-MM-DD, the day the source says the rates are from
  rateTime: string | null;   // ISO instant when the source stamps a time (FastForex), else null
  source: RateSource;
}

// Every currency the engine prices. One exhaustive record, so adding a member to the Currency union
// without adding it here is a hard type error. (AGENTS.md: "A NEW CURRENCY breaks the build".)
const PRICED: Record<Currency, true> = {
  USD: true, EUR: true, GBP: true, GEL: true, MXN: true, THB: true, IDR: true, PKR: true, BDT: true,
  NGN: true, PHP: true, BRL: true, INR: true, COP: true, UZS: true, ZAR: true, ARS: true, PLN: true,
  UAH: true,
};
export const PRICED_CURRENCIES = Object.keys(PRICED) as Currency[];

// A FastForex rate older than this is not described as an hourly feed. The page falls back instead.
export const FASTFOREX_MAX_AGE_MS = 3 * 60 * 60 * 1000;

const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

// Builds the full rate table from a USD-based map, or null when ANY priced currency is missing or
// not a positive finite number. A partial table would price some corridors on `undefined`.
export function buildRates(r: Record<string, unknown> | null | undefined): Record<Currency, number> | null {
  if (!r) return null;
  const out = {} as Record<Currency, number>;
  for (const c of PRICED_CURRENCIES) {
    const v = c === 'USD' ? 1 : r[c];
    if (typeof v !== 'number' || !Number.isFinite(v) || !(v > 0)) return null;
    out[c] = v;
  }
  return out;
}

// open.er-api.com: { result: 'success', rates: {...}, time_last_update_utc: 'Mon, 02 Jun 2026 00:00:02 +0000' }
// A response without a parseable publication date is rejected rather than stamped with today.
export function parseOpenEr(data: any): RatesResult | null {
  if (!data || data.result !== 'success') return null;
  const rates = buildRates(data.rates);
  if (!rates) return null;
  const parts = String(data.time_last_update_utc ?? '').match(/(\d{2}) (\w{3}) (\d{4})/);
  if (!parts || !MONTHS[parts[2]]) return null;
  return { rates, rateDate: `${parts[3]}-${MONTHS[parts[2]]}-${parts[1]}`, rateTime: null, source: 'open.er-api.com' };
}

// FastForex /fetch-multi: { base: 'USD', results: { EUR: 0.89, ... }, updated: '2026-10-08T15:53:27Z' }
// Rejected when the base is not USD, any priced currency is missing, the timestamp cannot be read,
// or the rate is older than FASTFOREX_MAX_AGE_MS (a stuck feed must not be shown as hourly).
export function parseFastForex(data: any, now: number = Date.now()): RatesResult | null {
  if (!data || data.base !== 'USD') return null;
  const rates = buildRates(data.results);
  if (!rates) return null;
  let raw = String(data.updated ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) raw = raw.replace(' ', 'T') + 'Z';
  const t = Date.parse(raw);
  if (!Number.isFinite(t) || now - t > FASTFOREX_MAX_AGE_MS || t - now > 10 * 60 * 1000) return null;
  const iso = new Date(t).toISOString();
  return { rates, rateDate: iso.slice(0, 10), rateTime: iso, source: 'fastforex' };
}

export const RATE_SOURCE_NAME: Record<RateSource, string> = {
  fastforex: 'FastForex',
  'open.er-api.com': 'open.er-api.com',
};
export const RATE_SOURCE_URL: Record<RateSource, string> = {
  fastforex: 'https://fastforex.io',
  'open.er-api.com': 'https://open.er-api.com',
};

// The stamp printed next to a rate: a time for a feed that stamps one, a date for the daily feed.
export function rateStamp(r: Pick<RatesResult, 'rateDate' | 'rateTime' | 'source'>): string {
  if (r.source === 'fastforex' && r.rateTime) {
    return `updated ${r.rateTime.slice(0, 10)} ${r.rateTime.slice(11, 16)} UTC`;
  }
  return `published ${r.rateDate}`;
}

// One sentence on how often the rate moves, true for the feed actually used.
export function rateCadence(source: RateSource): string {
  return source === 'fastforex'
    ? 'FastForex updates its midpoint rates every minute, and this page checks for a new one up to once an hour.'
    : 'open.er-api.com publishes a new rate once a day, and this page checks for a new one up to once an hour.';
}
