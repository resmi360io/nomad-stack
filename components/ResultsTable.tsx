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
      <p className="text-[0.8125rem] leading-snug text-muted-foreground">
        Ranked by the modelled amount you receive. A low price is not an offer to you: check that a
        provider accepts freelance or business income before you sign up.
      </p>
      <ol className="space-y-3">
        {quotes.map((q, i) => {
          const href = q.affiliateLink || q.provider.signupUrl;
          const isAffiliate = !!q.affiliateLink;
          const { margin, allIn } = breakdown(q, amount);
          const est = q.isEstimate ? <span className="font-normal text-caution"> est.</span> : null;

          return (
            <li
              key={q.provider.slug}
              className={cn(
                'pa-sheet overflow-hidden',
                q.isBestValue && 'border-primary/50 ring-1 ring-primary/25',
              )}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="pa-figure grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                      aria-label={`Rank ${i + 1}`}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate text-[1.0625rem] font-semibold">{q.provider.name}</span>
                  </div>
                  {q.isBestValue && <BestValueBadge />}
                </div>

                <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">You receive</div>
                    <div className="pa-figure text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">
                      {formatAmount(q.netReceivedInDest, q.destCurrency)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Credited in {formatHours(q.timeHours)}
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border text-sm">
                  <div className="bg-sheet px-3 py-2.5">
                    <dt className="text-xs text-muted-foreground">Transfer fee</dt>
                    <dd className="pa-figure mt-0.5 font-semibold">
                      {formatAmount(q.totalFeeInSource, q.sourceCurrency)}
                    </dd>
                    <dd className="pa-figure text-xs text-muted-foreground">
                      {q.effectiveFeePercent.toFixed(2)}%
                    </dd>
                  </div>
                  <div className="bg-sheet px-3 py-2.5">
                    <dt className="text-xs text-muted-foreground">FX margin</dt>
                    <dd className="pa-figure mt-0.5 font-semibold">
                      {formatAmount(margin, q.sourceCurrency)}
                    </dd>
                    <dd className="pa-figure text-xs text-muted-foreground">
                      {(q.fxMarkupBps / 100).toFixed(2)}%{est}
                    </dd>
                  </div>
                  <div className="bg-sheet px-3 py-2.5">
                    <dt className="text-xs text-muted-foreground">Total cost</dt>
                    <dd className="pa-figure mt-0.5 font-semibold">
                      {formatAmount(q.totalFeeInSource + margin, q.sourceCurrency)}
                    </dd>
                    <dd className="pa-figure text-xs font-semibold text-foreground">
                      {isFinite(allIn) ? `${allIn.toFixed(2)}%` : 'n/a'}{est}
                    </dd>
                  </div>
                </dl>

                {q.personalRemittancePricing && (
                  <p className="pa-caution mt-3 px-3 py-2 text-[0.8125rem] leading-snug">
                    <span className="font-semibold">Personal remittance price.</span> This is
                    published for family transfers, not business payments, so a client invoice may
                    not get it.
                  </p>
                )}
                {q.provider.caveat && (
                  <p className="mt-3 text-[0.8125rem] leading-snug text-muted-foreground">
                    {q.provider.caveat}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-border bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                {/* Never print a verification date against a figure we did not
                    verify: that is the claim the estimate marker exists to avoid. */}
                <p className="flex items-center gap-2 text-xs">
                  <span
                    aria-hidden="true"
                    className={cn('size-1.5 shrink-0 rounded-full', q.isEstimate ? 'bg-caution' : 'bg-positive')}
                  />
                  <span className={q.isEstimate ? 'text-caution' : 'text-positive'}>
                    {q.isEstimate
                      ? 'FX spread not published by this provider; estimated'
                      : `Fees verified ${q.provider.lastVerified}`}
                  </span>
                </p>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener noreferrer'}
                    // Same button on every row: the order and the badge already say which is
                    // cheapest, and a louder button on one row would be a second, unearned signal.
                    className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-full shrink-0 bg-sheet sm:w-auto')}
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
