import Link from 'next/link';
import { CORRIDORS } from '@/data/corridors';
import { PROVIDERS } from '@/data/providers';
import type { CountryCode, Currency } from '@/data/providers';
import { calculate } from '@/lib/calculate';
import type { RatesResult } from '@/lib/fetchRates';

// One table of every corridor, shared by the homepage and the pillar so the two can never
// disagree. The "top of the table" column is the first row of each corridor page's own
// comparison at the same amount, computed by the same calculate() call, so it moves whenever the
// rotation corrects a fee row. It reports a ranking the corridor page already shows and makes no
// claim of its own, which is why it carries the est. marker and never a badge.
const AMOUNT = 1000;

export function CorridorTable({
  rates,
  caption,
}: {
  rates: RatesResult | null;
  caption: string;
}) {
  const rows = CORRIDORS.map((corridor) => {
    if (!rates) return { corridor, top: null, allIn: NaN };
    const quotes = calculate(
      corridor.sourceCountry as CountryCode,
      corridor.destCountry as CountryCode,
      corridor.destination as Currency,
      AMOUNT,
      PROVIDERS,
      rates.rates,
    );
    const top = quotes[0] ?? null;
    // Measured against the mid rate, not effectiveFeePercent, which ignores the FX markup.
    const atMid =
      AMOUNT * (rates.rates[corridor.destination as Currency] / rates.rates[corridor.source as Currency]);
    const allIn = top && atMid > 0 ? (1 - top.netReceivedInDest / atMid) * 100 : NaN;
    return { corridor, top, allIn };
  });

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
            <th scope="col" className="px-4 py-2.5">Where you get paid</th>
            <th scope="col" className="px-4 py-2.5">Options we price</th>
            <th scope="col" className="px-4 py-2.5">Top of the table at ${AMOUNT.toLocaleString('en-US')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ corridor, top, allIn }, i) => (
            <tr key={corridor.slug} className={i < rows.length - 1 ? 'border-b' : ''}>
              <td className="px-4 py-3">
                <Link
                  href={`/receive/${corridor.slug}`}
                  className="font-medium underline underline-offset-2 hover:text-muted-foreground"
                >
                  {corridor.source} to {corridor.destination}, {corridor.country.replace(/^the /, '')}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground tabular-nums">
                {corridor.supportedProviders.length}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {top && isFinite(allIn) ? (
                  <>
                    {top.provider.name}, {allIn.toFixed(2)}% all in
                    {top.isEstimate ? ' (est.)' : ''}
                  </>
                ) : (
                  'See the page'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
