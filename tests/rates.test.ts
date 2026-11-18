// Rate feed parsing and the freshness copy. A rate is only shown when every priced currency is
// present, its date can be read and, for the hourly feed, it is recent. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FASTFOREX_MAX_AGE_MS,
  PRICED_CURRENCIES,
  buildRates,
  parseFastForex,
  parseOpenEr,
  rateCadence,
  rateStamp,
} from '../lib/rates.ts';

const frozen = JSON.parse(readFileSync(new URL('./fixtures/rates-2026-10-29.json', import.meta.url), 'utf8'));
const all: Record<string, number> = { ...frozen.rates };
const NOW = Date.parse('2026-11-18T15:00:00Z');
const fx = (over: Record<string, unknown> = {}) => {
  const results = { ...all };
  delete results.USD; // FastForex /fetch-multi has no USD-to-USD entry
  return { base: 'USD', results, updated: '2026-11-18T14:05:12Z', ms: 7, ...over };
};
const er = (over: Record<string, unknown> = {}) => ({
  result: 'success',
  rates: { ...all },
  time_last_update_utc: 'Tue, 17 Nov 2026 00:02:31 +0000',
  ...over,
});

test('every currency the engine prices is in the fixture, so the fixture can test completeness', () => {
  for (const c of PRICED_CURRENCIES) assert.equal(typeof all[c], 'number', c);
});

test('buildRates needs every priced currency to be a positive finite number', () => {
  assert.ok(buildRates(all));
  assert.equal(buildRates(null), null);
  for (const bad of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, '5', null, undefined]) {
    assert.equal(buildRates({ ...all, PKR: bad as never }), null, String(bad));
  }
  const { UAH: _drop, ...missing } = all;
  assert.equal(buildRates(missing), null);
});

test('open.er-api.com: parsed with a date and no time, source recorded', () => {
  const r = parseOpenEr(er())!;
  assert.equal(r.source, 'open.er-api.com');
  assert.equal(r.rateDate, '2026-11-17');
  assert.equal(r.rateTime, null);
  assert.equal(rateStamp(r), 'published 2026-11-17');
});

test('open.er-api.com: failure, incomplete or undated responses are rejected, never stamped with today', () => {
  assert.equal(parseOpenEr(er({ result: 'error' })), null);
  assert.equal(parseOpenEr(er({ time_last_update_utc: '' })), null);
  assert.equal(parseOpenEr(er({ time_last_update_utc: 'not a date' })), null);
  assert.equal(parseOpenEr(er({ rates: { ...all, ZAR: undefined } })), null);
  assert.equal(parseOpenEr(null), null);
});

test('FastForex: parsed with the time it stamps, source recorded', () => {
  const r = parseFastForex(fx(), NOW)!;
  assert.equal(r.source, 'fastforex');
  assert.equal(r.rateDate, '2026-11-18');
  assert.equal(r.rateTime, '2026-11-18T14:05:12.000Z');
  assert.equal(r.rates.USD, 1);
  assert.equal(rateStamp(r), 'updated 2026-11-18 14:05 UTC');
});

test('FastForex: a space-separated timestamp is read as UTC', () => {
  const r = parseFastForex(fx({ updated: '2026-11-18 14:05:12' }), NOW)!;
  assert.equal(r.rateTime, '2026-11-18T14:05:12.000Z');
});

test('FastForex: a rate older than the limit is rejected, so a stuck feed is never shown as hourly', () => {
  const justInside = new Date(NOW - FASTFOREX_MAX_AGE_MS + 60_000).toISOString();
  const justOutside = new Date(NOW - FASTFOREX_MAX_AGE_MS - 60_000).toISOString();
  assert.ok(parseFastForex(fx({ updated: justInside }), NOW));
  assert.equal(parseFastForex(fx({ updated: justOutside }), NOW), null);
  // a timestamp from the future is no more believable
  assert.equal(parseFastForex(fx({ updated: '2026-11-19T15:00:00Z' }), NOW), null);
});

test('FastForex: wrong base, missing currency or unreadable timestamp is rejected', () => {
  assert.equal(parseFastForex(fx({ base: 'EUR' }), NOW), null);
  assert.equal(parseFastForex(fx({ updated: 'yesterday' }), NOW), null);
  assert.equal(parseFastForex(fx({ updated: undefined }), NOW), null);
  const results = fx().results as Record<string, number>;
  delete results.COP;
  assert.equal(parseFastForex({ ...fx(), results }, NOW), null);
  assert.equal(parseFastForex({ error: 'No API key provided' }, NOW), null);
});

test('freshness copy says what is true of the feed actually used', () => {
  const daily = rateCadence('open.er-api.com');
  const hourly = rateCadence('fastforex');
  assert.match(daily, /once a day/);
  assert.match(hourly, /every minute/);
  for (const s of [daily, hourly]) {
    assert.match(s, /up to once an hour/);
    assert.doesNotMatch(s, /\blive\b/i);
    assert.doesNotMatch(s, /[–—]/);
  }
  assert.doesNotMatch(daily, /every minute/);
});

// ── The fetch order: FastForex first when a key is set, open.er-api.com otherwise ──────────────
import { fetchRatesServer } from '../lib/fetchRates.ts';

type Reply = { ok: boolean; status: number; body: unknown } | 'throw';

async function withFetch(replies: Record<string, Reply>, key: string | undefined, run: () => Promise<void>) {
  const realFetch = globalThis.fetch;
  const realKey = process.env.FASTFOREX_API_KEY;
  const realWarn = console.warn;
  const calls: string[] = [];
  console.warn = () => {};
  if (key === undefined) delete process.env.FASTFOREX_API_KEY;
  else process.env.FASTFOREX_API_KEY = key;
  globalThis.fetch = (async (url: string) => {
    calls.push(String(url));
    const host = new URL(String(url)).host;
    const r = replies[host];
    if (!r || r === 'throw') throw new Error('network');
    return { ok: r.ok, status: r.status, json: async () => r.body } as Response;
  }) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = realFetch;
    console.warn = realWarn;
    if (realKey === undefined) delete process.env.FASTFOREX_API_KEY;
    else process.env.FASTFOREX_API_KEY = realKey;
  }
  return calls;
}

const freshFx = () => fx({ updated: new Date(Date.now() - 5 * 60_000).toISOString() });
const OK = (body: unknown): Reply => ({ ok: true, status: 200, body });

test('fetch order: with a key and a good reply, FastForex is used and open.er-api.com is not called', async () => {
  const calls = await withFetch({ 'api.fastforex.io': OK(freshFx()), 'open.er-api.com': OK(er()) }, 'k_test', async () => {
    const r = await fetchRatesServer();
    assert.equal(r?.source, 'fastforex');
  });
  assert.equal(calls.length, 1);
  assert.match(calls[0], /api\.fastforex\.io\/fetch-multi\?from=USD&to=EUR,/);
  assert.match(calls[0], /api_key=k_test/);
});

test('fetch order: a rejected key (401, as when the trial ends) falls back to open.er-api.com', async () => {
  await withFetch(
    { 'api.fastforex.io': { ok: false, status: 401, body: { error: 'API key not valid' } }, 'open.er-api.com': OK(er()) },
    'expired',
    async () => {
      const r = await fetchRatesServer();
      assert.equal(r?.source, 'open.er-api.com');
    },
  );
});

test('fetch order: a stale or incomplete FastForex reply falls back, and so does a network error', async () => {
  await withFetch({ 'api.fastforex.io': OK(fx({ updated: '2026-01-01T00:00:00Z' })), 'open.er-api.com': OK(er()) }, 'k', async () => {
    assert.equal((await fetchRatesServer())?.source, 'open.er-api.com');
  });
  await withFetch({ 'api.fastforex.io': 'throw', 'open.er-api.com': OK(er()) }, 'k', async () => {
    assert.equal((await fetchRatesServer())?.source, 'open.er-api.com');
  });
});

test('fetch order: with no key FastForex is never called', async () => {
  const calls = await withFetch({ 'api.fastforex.io': OK(freshFx()), 'open.er-api.com': OK(er()) }, undefined, async () => {
    assert.equal((await fetchRatesServer())?.source, 'open.er-api.com');
  });
  assert.equal(calls.length, 1);
  assert.match(calls[0], /open\.er-api\.com/);
});

test('fetch order: when both feeds fail the result is null, which pages show as rate unavailable', async () => {
  await withFetch({ 'api.fastforex.io': 'throw', 'open.er-api.com': { ok: false, status: 500, body: {} } }, 'k', async () => {
    assert.equal(await fetchRatesServer(), null);
  });
});
