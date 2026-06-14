'use client';
import { useState, useEffect } from 'react';
import type { Currency } from '@/data/providers';

export type RatesState =
  | { status: 'loading' }
  | { status: 'ready'; rates: Record<Currency, number>; rateDate: string }
  | { status: 'error' };

const CACHE_KEY = 'paidacross_fx_rates_v1';
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

export function useLiveRates(): RatesState {
  const [state, setState] = useState<RatesState>({ status: 'loading' });

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates, rateDate, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setState({ status: 'ready', rates, rateDate });
          return;
        }
      }
    } catch {}

    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.result !== 'success') throw new Error('API error');
        const r = data.rates as Record<string, number>;
        const rates: Record<Currency, number> = {
          USD: 1,
          EUR: r.EUR,
          GBP: r.GBP,
          GEL: r.GEL,
          MXN: r.MXN,
          THB: r.THB,
          IDR: r.IDR,
          PKR: r.PKR,
          BDT: r.BDT,
          NGN: r.NGN,
        };
        // "Mon, 02 Jun 2026 00:00:02 +0000" → "2026-06-02"
        const raw: string = data.time_last_update_utc ?? '';
        const parts = raw.match(/(\d{2}) (\w{3}) (\d{4})/);
        const MONTHS: Record<string, string> = {
          Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
          Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12',
        };
        const rateDate = parts
          ? `${parts[3]}-${MONTHS[parts[2]]}-${parts[1]}`
          : new Date().toISOString().slice(0, 10);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rates, rateDate, timestamp: Date.now() }));
        } catch {}
        setState({ status: 'ready', rates, rateDate });
      })
      .catch(() => setState({ status: 'error' }));
  }, []);

  return state;
}
