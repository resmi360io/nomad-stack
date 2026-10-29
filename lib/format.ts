// Display formatting for money, shared by the calculator and the server-rendered tables so the
// same amount never prints two ways. Calculation stays at full precision; this is the only place
// a received amount is rounded, and only for display.

// Currencies printed without minor units: their unit is small enough that the decimals are noise,
// and several (IDR, UZS, COP) are never quoted to the cent by the providers we price.
const WHOLE_UNITS = new Set(['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP', 'INR', 'COP', 'UZS', 'ARS', 'UAH']);

// 'n/a' rather than a dash: these strings render into reader-facing cells, and no reader-facing
// text on this site carries an em or en dash.
export function formatAmountNumber(n: number, currency: string): string {
  if (!Number.isFinite(n)) return 'n/a';
  const decimals = WHOLE_UNITS.has(currency) ? 0 : 2;
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatMoney(n: number, currency: string): string {
  const v = formatAmountNumber(n, currency);
  return v === 'n/a' ? `${currency} n/a` : `${currency} ${v}`;
}

export function formatPercent(n: number, digits = 2): string {
  return Number.isFinite(n) ? `${n.toFixed(digits)}%` : 'n/a';
}

export function formatHours(h: number): string {
  if (h < 1) return '<1 hr';
  if (h === 1) return '~1 hr';
  if (h < 24) return `~${h} hrs`;
  const days = Math.round(h / 24);
  return days === 1 ? '~1 day' : `~${days} days`;
}
