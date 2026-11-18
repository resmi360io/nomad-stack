'use client';
import { useState, useEffect } from 'react';
import { buildRates } from '@/lib/rates';
import type { RatesResult } from '@/lib/rates';

export type RatesState =
  | { status: 'loading' }
  | ({ status: 'ready' } & RatesResult)
  | { status: 'error' };

const CACHE_KEY = 'paidacross_fx_rates_v3';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour, the same cadence the server pages use

function isRatesResult(d: any): d is RatesResult {
  return (
    !!d &&
    typeof d.rateDate === 'string' &&
    (d.source === 'fastforex' || d.source === 'open.er-api.com') &&
    (d.rateTime === null || typeof d.rateTime === 'string') &&
    buildRates(d.rates) !== null
  );
}

// Reads rates from our own /api/rates route (FastForex when configured, open.er-api.com otherwise).
// A response that is incomplete or has no readable date counts as an error, never as today's rate.
export function useLiveRates(): RatesState {
  const [state, setState] = useState<RatesState>({ status: 'loading' });

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (isRatesResult(data) && Date.now() - timestamp < CACHE_TTL_MS) {
          setState({ status: 'ready', ...data });
          return;
        }
      }
    } catch {}

    fetch('/api/rates')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (!isRatesResult(data)) throw new Error('Incomplete rates');
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch {}
        setState({ status: 'ready', ...data });
      })
      .catch(() => setState({ status: 'error' }));
  }, []);

  return state;
}
