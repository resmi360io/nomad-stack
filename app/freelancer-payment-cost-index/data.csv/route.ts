import edition from '@/data/cost-index/2026-10.json';

// The cost index edition as CSV: one row per ranked route, country and amount.
export const dynamic = 'force-static';

const cell = (v: string | number | boolean) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function GET() {
  const lines = [
    ['edition', 'rate_date', 'country', 'currency', 'amount_usd', 'rank', 'provider', 'total_cost_percent', 'total_cost_usd', 'received', 'cost_estimated'].join(','),
  ];
  for (const c of edition.corridors) {
    for (const a of c.amounts) {
      a.ranked.forEach((r, i) => {
        lines.push(
          [edition.edition, edition.rateDate, c.country, c.currency, a.amount, i + 1, r.provider, r.totalCostPercent, r.totalCostUsd, r.received, r.costEstimated]
            .map(cell)
            .join(','),
        );
      });
    }
  }
  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="paidacross-cost-index-2026-10.csv"',
    },
  });
}
