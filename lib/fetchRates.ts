import { PRICED_CURRENCIES, parseFastForex, parseOpenEr } from './rates.ts';
import type { RatesResult } from './rates.ts';

export type { RatesResult, RateSource } from './rates.ts';

const NON_USD = PRICED_CURRENCIES.filter((c) => c !== 'USD');

const FASTFOREX_URL = 'https://api.fastforex.io/fetch-multi';
const OPEN_ER_URL = 'https://open.er-api.com/v6/latest/USD';

async function fromFastForex(): Promise<RatesResult | null> {
  // Server-only. The key is never sent to the browser: the calculator reads /api/rates instead.
  const key = process.env.FASTFOREX_API_KEY;
  if (!key) return null;
  try {
    const url = `${FASTFOREX_URL}?from=USD&to=${NON_USD.join(',')}&api_key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      // 401 once the trial ends or the key is wrong: fall back quietly, but leave a trace in the logs.
      console.warn(`fetchRates: FastForex responded ${res.status}, falling back to open.er-api.com`);
      return null;
    }
    const parsed = parseFastForex(await res.json());
    if (!parsed) console.warn('fetchRates: FastForex response rejected (incomplete or stale), falling back');
    return parsed;
  } catch {
    console.warn('fetchRates: FastForex unreachable, falling back to open.er-api.com');
    return null;
  }
}

async function fromOpenEr(): Promise<RatesResult | null> {
  try {
    const res = await fetch(OPEN_ER_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return parseOpenEr(await res.json());
  } catch {
    return null;
  }
}

// FastForex first when a key is configured, then open.er-api.com. Null only when both fail, which the
// pages already render as "rate unavailable".
export async function fetchRatesServer(): Promise<RatesResult | null> {
  return (await fromFastForex()) ?? (await fromOpenEr());
}
