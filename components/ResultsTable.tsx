'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isComparable } from '@/lib/calculate';
import type { Quote } from '@/lib/calculate';
import type { CountryCode } from '@/data/providers';
import { LISTED_STATUS_LABEL, listedRoutesFor } from '@/data/routes';
import { formatHours, formatMoney, formatPercent } from '@/lib/format';
import { BestValueBadge } from './BestValueBadge';
import posthog from 'posthog-js';

// Why a priced route is kept out of the ranking, in the reader's terms.
const NOT_RANKED_REASON: Record<Exclude<Quote['status'], 'comparable'>, { title: string; body: (q: Quote) => string }> = {
  'personal-only': {
    title: 'Personal remittance price',
    body: () =>
      'This price is published for family transfers, not business payments, so a client invoice may not get it.',
  },
  unverified: {
    title: 'Route not confirmed',
    body: (q) =>
      `We could not confirm that ${q.provider.name} offers this payout. The figures show our model, not a price you can plan with.`,
  },
  incomplete: {
    title: 'Partial price',
    body: (q) =>
      `Does not include: ${q.missingCosts.join('; ')}. You would receive less than shown.`,
  },
};

interface Props {
  quotes: Quote[];
  rateDate: string;
  amount: number;
  stale: boolean;
  destCountry: CountryCode;
  context: { from: string; to: string; currency: string };
}

function ctaLabel(q: Quote): string {
  // A sender-transfer route asks nothing of the freelancer, so "open an account" would be wrong.
  return q.routeType === 'sender-transfer' ? `Go to ${q.provider.name}` : `Open ${q.provider.name} account`;
}

function routeLine(q: Quote): string {
  return q.routeType === 'sender-transfer'
    ? 'Your client sends this payment, and you do not need to open anything.'
    : 'You open an account and give your client its details.';
}

function QuoteCard({ q, index }: { q: Quote; index: number }) {
  const href = q.affiliateLink || q.provider.signupUrl;
  const isAffiliate = !!q.affiliateLink;
  const est = q.isEstimate ? <span className="font-normal text-caution"> est.</span> : null;
  const showCaveat = q.provider.caveat && (q.provider.caveatScope !== 'fallback' || !q.matchedCorridorRow);
  const partial = q.status === 'incomplete';
  const reason = q.status !== 'comparable' ? NOT_RANKED_REASON[q.status] : null;

  return (
    <li className={cn('pa-sheet overflow-hidden', q.isBestValue && 'border-primary/50 ring-1 ring-primary/25')}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {q.rank !== null && (
              <span
                className="pa-figure grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                aria-label={`Rank ${q.rank}`}
              >
                {q.rank}
              </span>
            )}
            <h4 className="truncate text-[1.0625rem] font-semibold">{q.provider.name}</h4>
          </div>
          {q.isBestValue && <BestValueBadge />}
        </div>
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{routeLine(q)}</p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div>
            <div className="text-xs font-medium text-muted-foreground">{partial ? 'You receive at most' : 'You receive'}</div>
            <div className="pa-figure text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">
              {formatMoney(q.netReceivedInDest, q.destCurrency)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Credited in {formatHours(q.timeHours)}</div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border text-sm">
          <div className="bg-sheet px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">Fees</dt>
            <dd className="pa-figure mt-0.5 font-semibold">{formatMoney(q.totalFeeInSource, q.sourceCurrency)}</dd>
            <dd className="pa-figure text-xs text-muted-foreground">{formatPercent(q.effectiveFeePercent)}</dd>
          </div>
          <div className="bg-sheet px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">FX margin</dt>
            <dd className="pa-figure mt-0.5 font-semibold">{formatMoney(q.fxMarginInSource, q.sourceCurrency)}</dd>
            <dd className="pa-figure text-xs text-muted-foreground">
              {formatPercent(q.fxMarkupBps / 100)}
              {est}
            </dd>
          </div>
          <div className="bg-sheet px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">{partial ? 'Known cost' : 'Total cost'}</dt>
            <dd className="pa-figure mt-0.5 font-semibold">{formatMoney(q.totalCostInSource, q.sourceCurrency)}</dd>
            <dd className="pa-figure text-xs font-semibold text-foreground">
              {partial ? 'at least ' : ''}
              {formatPercent(q.totalCostPercent)}
              {est}
            </dd>
          </div>
        </dl>
        {/* The individual charges, when there is more than one, so a capped or tiered schedule is
            visible as the provider writes it rather than only as a total. */}
        {q.fees.length > 1 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            {q.fees.map((f, i) => (
              <li key={i}>
                {f.label} <span className="pa-figure text-foreground">{formatMoney(f.amount, q.sourceCurrency)}</span>
              </li>
            ))}
          </ul>
        )}

        {reason && (
          <p className="pa-caution mt-3 px-3 py-2 text-[0.8125rem] leading-snug">
            <span className="font-semibold">{reason.title}.</span> {reason.body(q)}
          </p>
        )}
        {showCaveat && (
          <p className="mt-3 text-[0.8125rem] leading-snug text-muted-foreground">{q.provider.caveat}</p>
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
                rank: index + 1,
                is_best_value: q.isBestValue,
                is_affiliate: isAffiliate,
              })
            }
          >
            {ctaLabel(q)}
            {isAffiliate && (
              <span
                className="ml-1 rounded-[2px] border border-current px-1 text-[10px] leading-4 opacity-70"
                aria-label="Affiliate link"
                title="We may earn a commission or referral bonus if you sign up"
              >
                AD
              </span>
            )}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}

export function ResultsTable({ quotes, rateDate, amount, stale, destCountry, context }: Props) {
  const ranked = quotes.filter(isComparable);
  const others = quotes.filter((q) => !isComparable(q));
  const listed = listedRoutesFor(destCountry).filter((r) => !quotes.some((q) => q.provider.slug === r.provider));

  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="results-heading" className="pa-h3">Results: ranked by net received</h2>
          <span className="pa-meta whitespace-nowrap">Rate: {rateDate}</span>
        </div>
        {/* What these numbers are FOR, frozen at the moment they were computed. */}
        <p className="text-[0.8125rem] leading-snug text-muted-foreground">
          <span className="font-semibold text-foreground">{formatMoney(amount, quotes[0]?.sourceCurrency ?? '')}</span>{' '}
          from {context.from} to {context.to}, received in {context.currency}, priced at the mid-market rate of{' '}
          {rateDate}. Fees and margins are modelled from published schedules, and estimates are marked.
        </p>
      </div>

      {stale && (
        <p className="pa-caution px-3 py-2 text-[0.8125rem] font-medium leading-snug">
          You changed the inputs. These results still show the amount and route above until you press
          Compare options again.
        </p>
      )}

      <div className={cn('space-y-4 transition-opacity', stale && 'opacity-55')}>
        {quotes.length === 0 ? (
          <p className="pa-note px-4 py-3 text-sm text-muted-foreground">No providers support this route.</p>
        ) : ranked.length === 0 ? (
          <p className="pa-note px-4 py-3 text-sm text-muted-foreground">
            Nothing here can be ranked for a client payment. The prices below are for reference, each with
            the reason it is not ranked.
          </p>
        ) : (
          <>
            <p className="text-[0.8125rem] leading-snug text-muted-foreground">
              A low price is not an offer to you. Check that a provider accepts freelance or business income
              before you sign up.
            </p>
            <h3 className="sr-only">Ranked options</h3>
            <ol className="space-y-3">
              {ranked.map((q) => (
                <QuoteCard key={q.provider.slug} q={q} index={quotes.indexOf(q)} />
              ))}
            </ol>
          </>
        )}

        {others.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-[0.9375rem] font-semibold">Shown separately, not ranked</h3>
            <ul className="space-y-3">
              {others.map((q) => (
                <QuoteCard key={q.provider.slug} q={q} index={quotes.indexOf(q)} />
              ))}
            </ul>
          </div>
        )}

        {listed.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-[0.9375rem] font-semibold">Also on this route, not priced</h3>
            <ul className="pa-sheet divide-y divide-border text-[0.8125rem] leading-snug">
              {listed.map((r) => (
                <li key={r.provider} className="px-4 py-3">
                  <span className="font-semibold text-foreground">{r.name}</span>
                  <span className="text-muted-foreground">: {LISTED_STATUS_LABEL[r.status]}. </span>
                  <span className="text-muted-foreground">{r.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
