import type { Currency } from '@/data/providers';

export interface RatesResult {
  rates: Record<Currency, number>;
  rateDate: string;
}

const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

export async function fetchRatesServer(): Promise<RatesResult | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== 'success') return null;
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
    };
    // "Mon, 02 Jun 2026 00:00:02 +0000" → "2026-06-02"
    const raw: string = data.time_last_update_utc ?? '';
    const parts = raw.match(/(\d{2}) (\w{3}) (\d{4})/);
    const rateDate = parts
      ? `${parts[3]}-${MONTHS[parts[2]]}-${parts[1]}`
      : new Date().toISOString().slice(0, 10);
    return { rates, rateDate };
  } catch {
    return null;
  }
}
