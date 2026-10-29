'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Quote } from '@/lib/calculate';
import { BestValueBadge } from './BestValueBadge';
import posthog from 'posthog-js';

function formatHours(h: number): string {
  if (h < 1) return '<1 hr';
  if (h === 1) return '~1 hr';
  if (h < 24) return `~${h} hrs`;
  const days = Math.round(h / 24);
  return days === 1 ? '~1 day' : `~${days} days`;
}

function formatAmount(n: number, currency: string): string {
  if (!isFinite(n)) return `${currency} n/a`;
  const decimals = ['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP'].includes(currency) ? 0 : 2;
  return `${currency} ${n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

// Display arithmetic only, mirroring calculate(): the fee comes off first, then the provider
// converts what is left at the mid rate less fxMarkupBps. So the margin, in the sending currency,
// is that remainder times the markup, and the all-in figure is both parts against the amount sent.
// Nothing here feeds the ranking, which is still the order calculate() returned.
function breakdown(q: Quote, amount: number) {
  const afterFee = Math.max(0, amount - q.totalFeeInSource);
  const margin = afterFee * (q.fxMarkupBps / 10000);
  const allIn = amount > 0 ? ((q.totalFeeInSource + margin) / amount) * 100 : NaN;
  return { margin, allIn };
}

interface Props {
  quotes: Quote[];
  rateDate: string;
  amount: number;
}

export function ResultsTable({ quotes, rateDate, amount }: Props) {
  if (quotes.length === 0) {
    return (
      <p className="pa-note px-4 py-3 text-sm text-muted-foreground">
        No providers support this corridor.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="pa-h3">Results: ranked by net received</h2>
        <span className="pa-meta whitespace-nowrap">Rate: {rateDate}</span>
      </div>
      {/* One sheet, one entry per provider, the way a passbook prints them: the credited amount is
          the figure set large on the right, and the working sits under the name. */}
      <ol className="pa-sheet divide-y divide-border overflow-hidden">
        {quotes.map((q, i) => {
          const href = q.affiliateLink || q.provider.signupUrl;
          const isAffiliate = !!q.affiliateLink;
          const { margin, allIn } = breakdown(q, amount);

          return (
            <li
              key={q.provider.slug}
              className={cn(
                'grid grid-cols-[1.75rem_1fr] gap-x-2 px-4 py-4 sm:grid-cols-[2rem_1fr_auto] sm:gap-x-4 sm:px-5',
                q.isBestValue && 'bg-stamp-tint',
              )}
            >
              <span className="pa-figure pt-0.5 text-sm text-muted-foreground" aria-label={`Rank ${i + 1}`}>
                {i + 1}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[1.0625rem] font-semibold">{q.provider.name}</span>
                  {q.isBestValue && <BestValueBadge />}
                </div>

                <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                  <div className="flex gap-1.5">
                    <dt>Fee</dt>
                    <dd className="pa-figure text-foreground">
                      {formatAmount(q.totalFeeInSource, q.sourceCurrency)}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Rate margin</dt>
                    <dd className="pa-figure text-foreground">
                      {formatAmount(margin, q.sourceCurrency)}
                      {q.isEstimate && <span className="font-sans text-muted-foreground [font-variant-numeric:normal]"> est.</span>}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>All in</dt>
                    <dd className="pa-figure text-foreground">
                      {isFinite(allIn) ? `${allIn.toFixed(2)}%` : 'n/a'}
                    </dd>
                  </div>
                </dl>

                {q.provider.caveat && (
                  <p className="mt-1.5 max-w-[60ch] text-[0.8125rem] leading-snug text-muted-foreground">
                    {q.provider.caveat}
                  </p>
                )}
                {/* Never print a verification date against a figure we did not
                    verify: that is the claim the estimate marker exists to avoid. */}
                <p className="mt-1 text-xs text-muted-foreground">
                  {q.isEstimate
                    ? 'FX spread not published by this provider; estimated'
                    : `Fees verified ${q.provider.lastVerified}`}
                </p>
              </div>

              <div className="col-start-2 mt-3 flex items-end justify-between gap-4 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:flex-col sm:items-end sm:justify-start sm:gap-2">
                <div className="sm:text-right">
                  <div className="pa-figure text-xl font-semibold tracking-tight sm:text-2xl">
                    {formatAmount(q.netReceivedInDest, q.destCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Credited in {formatHours(q.timeHours)}
                  </div>
                </div>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener noreferrer'}
                    // Same button on every row: the order and the badge already say which is
                    // cheapest, and a louder button on one row would be a second, unearned signal.
                    className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'shrink-0 bg-sheet')}
                    onClick={() =>
                      posthog.capture('affiliate_click', {
                        provider: q.provider.slug,
                        provider_name: q.provider.name,
                        corridor: `${q.sourceCurrency}→${q.destCurrency}`,
                        source_currency: q.sourceCurrency,
                        dest_currency: q.destCurrency,
                        rank: i + 1,
                        is_best_value: q.isBestValue,
                        is_affiliate: isAffiliate,
                      })
                    }
                  >
                    Open account
                    {isAffiliate && (
                      <span
                        className="ml-1 rounded-[2px] border border-current px-1 text-[10px] leading-4 opacity-70"
                        aria-label="Affiliate link"
                        title="We may earn a commission or referral bonus if you sign up"
                      >
                        AD
                      </span>
                    )}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
