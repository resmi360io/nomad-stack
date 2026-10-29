'use client';

import { useState } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsTable } from './ResultsTable';
import { calculate } from '@/lib/calculate';
import { PROVIDERS } from '@/data/providers';
import type { CountryCode, Currency } from '@/data/providers';
import type { Quote } from '@/lib/calculate';
import { useLiveRates } from '@/hooks/useLiveRates';

interface Props {
  defaultSrc?: CountryCode;
  defaultDest?: CountryCode;
}

export function Calculator({ defaultSrc, defaultDest }: Props = {}) {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [quotedAmount, setQuotedAmount] = useState(0);
  const ratesState = useLiveRates();

  function handleSubmit(src: CountryCode, dest: CountryCode, destCurrency: Currency, amount: number) {
    if (ratesState.status !== 'ready') return;
    setQuotedAmount(amount);
    setQuotes(calculate(src, dest, destCurrency, amount, PROVIDERS, ratesState.rates));
  }

  const rateLabel = ratesState.status === 'ready'
    ? `Live mid-market rates as of ${ratesState.rateDate} · open.er-api.com`
    : ratesState.status === 'loading'
    ? 'Loading live exchange rates…'
    : null;

  return (
    // The form is server-rendered at its full height, so it needs no min-height reserve to hold
    // layout still; results only appear after a click, which does not count as a layout shift.
    <div className="space-y-6">
      {ratesState.status === 'error' && (
        <p
          role="alert"
          className="rounded border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
        >
          Could not load live exchange rates. Please refresh and try again.
        </p>
      )}
      <CalculatorForm
        onSubmit={handleSubmit}
        disabled={ratesState.status !== 'ready'}
        rateLabel={rateLabel}
        defaultSrc={defaultSrc}
        defaultDest={defaultDest}
      />
      {/* Persistent live region: submitting the form swaps the table in silently
          otherwise, so a screen reader user is told nothing (WCAG 4.1.3). The
          region announces a summary; the table itself is left non-live so it is
          not read out in full on every submit. */}
      <div role="status" aria-live="polite" className="sr-only">
        {quotes !== null && ratesState.status === 'ready'
          ? quotes.length === 0
            ? 'No providers support this corridor.'
            : `Results updated: ${quotes.length} provider${quotes.length === 1 ? '' : 's'} compared, ranked by net received. Best value: ${quotes[0].provider.name}.`
          : ''}
      </div>
      {quotes !== null && ratesState.status === 'ready' && (
        <ResultsTable quotes={quotes} rateDate={ratesState.rateDate} amount={quotedAmount} />
      )}
    </div>
  );
}
