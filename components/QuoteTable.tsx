import { isComparable } from '@/lib/calculate';
import type { Quote } from '@/lib/calculate';
import { formatAmountNumber, formatPercent } from '@/lib/format';
import { BestValueBadge } from './BestValueBadge';

// The server-rendered comparison on a corridor page. One component for the local-currency table and
// the hold-dollars tables, so both apply the same comparability rule as the calculator: ranked
// routes in the first row group, routes we can price but must not rank in a second, labelled one.

function formatHours(h: number): string {
  if (h < 1) return '< 1 hr';
  if (h === 1) return '~ 1 hr';
  if (h < 24) return `~${h} hrs`;
  const days = Math.round(h / 24);
  return days === 1 ? '~1 day' : `~${days} days`;
}

export function notRankedReason(q: Quote): string | null {
  switch (q.status) {
    case 'personal-only':
      return 'Personal remittance price, not for client payments';
    case 'unverified':
      return 'Route not confirmed';
    case 'incomplete':
      return `Partial price, excludes ${q.missingCosts.join(' and ')}`;
    default:
      return null;
  }
}

export function QuoteTable({
  quotes,
  currency,
  caption,
  holding = false,
}: {
  quotes: Quote[];
  currency: string;
  caption: string;
  // True for the "receive without converting" tables: no FX happens, so the margin column says so.
  holding?: boolean;
}) {
  const ranked = quotes.filter(isComparable);
  const others = quotes.filter((q) => !isComparable(q));

  const row = (q: Quote) => {
    const reason = notRankedReason(q);
    return (
      <tr key={q.provider.slug} className={q.isBestValue ? 'bg-stamp-tint' : undefined}>
        <td className="px-4 py-3 font-semibold">
          <span className="flex flex-wrap items-center gap-2">
            {q.provider.name}
            {q.isBestValue && <BestValueBadge />}
          </span>
          {reason && <span className="mt-1 block text-xs font-medium text-caution">{reason}</span>}
        </td>
        <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
          {q.status === 'incomplete' ? 'up to ' : ''}
          {formatAmountNumber(q.netReceivedInDest, currency)}
        </td>
        <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
          {q.status === 'incomplete' ? 'from ' : ''}
          {formatPercent(q.totalCostPercent)}
        </td>
        <td className="pa-figure px-4 py-3 text-right text-muted-foreground">
          {q.effectiveFeePercent.toFixed(2)}%
        </td>
        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
          {q.fxMarkupBps === 0
            ? holding
              ? 'No conversion'
              : 'Mid-market'
            : `+${(q.fxMarkupBps / 100).toFixed(1)}%`}
          {/* In a hold-dollars table nothing converts, so "(est.)" next to "No conversion" would
              read as doubt about whether a conversion happens; what is estimated there is the fee. */}
          {q.isEstimate && !(holding && q.fxMarkupBps === 0) && (
            <span className="ml-1 not-italic text-muted-foreground/70">(est.)</span>
          )}
        </td>
        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatHours(q.timeHours)}</td>
      </tr>
    );
  };

  return (
    <div className="pa-table-wrap">
      <table className="w-full text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-left">
            <th scope="col" className="px-4 py-3">Provider</th>
            <th scope="col" className="px-4 py-3 text-right">Net received ({currency})</th>
            <th scope="col" className="px-4 py-3 text-right">Total cost</th>
            <th scope="col" className="px-4 py-3 text-right">Transfer fee</th>
            <th scope="col" className="px-4 py-3">FX margin</th>
            <th scope="col" className="px-4 py-3">Speed</th>
          </tr>
        </thead>
        {/* The best value badge renders here as well as in the interactive calculator, so a reader
            without JavaScript, and a crawler, sees the recommendation and not only the ranking. */}
        {ranked.length > 0 && <tbody>{ranked.map(row)}</tbody>}
        {others.length > 0 && (
          <tbody className="border-t-2 border-rule">
            <tr>
              <th
                scope="rowgroup"
                colSpan={6}
                className="bg-muted/50 px-4 py-2 text-left text-[0.8125rem] font-semibold text-muted-foreground"
              >
                Shown separately, not ranked
              </th>
            </tr>
            {others.map(row)}
          </tbody>
        )}
      </table>
    </div>
  );
}
