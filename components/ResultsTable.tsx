'use client';

import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Quote } from '@/lib/calculate';
import { BestValueBadge } from './BestValueBadge';
import posthog from 'posthog-js';

function fxQualityLabel(bps: number): { label: string; color: string } {
  if (bps <= 50) return { label: 'Excellent FX', color: 'text-green-600 dark:text-green-400' };
  if (bps <= 150) return { label: 'Good FX', color: 'text-emerald-600 dark:text-emerald-400' };
  if (bps <= 300) return { label: 'Fair FX', color: 'text-amber-600 dark:text-amber-400' };
  return { label: 'Poor FX', color: 'text-red-600 dark:text-red-400' };
}

function formatHours(h: number): string {
  if (h < 1) return '<1 hr';
  if (h === 1) return '~1 hr';
  if (h < 24) return `~${h} hrs`;
  const days = Math.round(h / 24);
  return days === 1 ? '~1 day' : `~${days} days`;
}

function formatAmount(n: number, currency: string): string {
  if (!isFinite(n)) return `${currency} —`;
  const decimals = ['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP'].includes(currency) ? 0 : 2;
  return `${currency} ${n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

interface Props {
  quotes: Quote[];
  rateDate: string;
}

export function ResultsTable({ quotes, rateDate }: Props) {
  if (quotes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No providers support this corridor.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Results — ranked by net received</h2>
        <span className="text-xs text-muted-foreground whitespace-nowrap">Rate: {rateDate}</span>
      </div>
      {quotes.map((q, i) => {
        const fxQ = fxQualityLabel(q.fxMarkupBps);
        const href = q.affiliateLink || q.provider.signupUrl;
        const isAffiliate = !!q.affiliateLink;

        return (
          <Card
            key={q.provider.slug}
            className={q.isBestValue ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
          >
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 font-mono text-sm text-muted-foreground">
                  #{i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{q.provider.name}</span>
                    {q.isBestValue && <BestValueBadge />}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Fee: {formatAmount(q.totalFeeInSource, q.sourceCurrency)}{' '}
                    ({q.effectiveFeePercent.toFixed(2)}%) ·{' '}
                    <span className={fxQ.color}>{fxQ.label}</span>
                  </div>
                  {q.provider.caveat && (
                    <div className="mt-0.5 text-xs text-muted-foreground/60 italic">
                      {q.provider.caveat}
                    </div>
                  )}
                  <div className="mt-0.5 text-xs text-muted-foreground/40">
                    Fees verified {q.provider.lastVerified}
                  </div>
                </div>
              </div>

              <div className="ml-8 flex items-center gap-4 sm:ml-0">
                <div className="text-right">
                  <div className="text-base font-semibold">
                    {formatAmount(q.netReceivedInDest, q.destCurrency)}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatHours(q.timeHours)}</div>
                </div>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener noreferrer'}
                    className={cn(buttonVariants({ size: 'sm' }), 'shrink-0')}
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
                    Open account →
                    {isAffiliate && (
                      <span
                        className="ml-1 text-[10px] opacity-60"
                        aria-label="Affiliate link"
                        title="We may earn a commission if you sign up"
                      >
                        AD
                      </span>
                    )}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
