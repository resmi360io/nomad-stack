'use client';

import { useState } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsTable } from './ResultsTable';
import { calculate } from '@/lib/calculate';
import { PROVIDERS } from '@/data/providers';
import type { CountryCode, Currency } from '@/data/providers';
import type { Quote } from '@/lib/calculate';
import { useLiveRates } from '@/hooks/useLiveRates';

export function Calculator() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const ratesState = useLiveRates();

  function handleSubmit(src: CountryCode, dest: CountryCode, destCurrency: Currency, amount: number) {
    if (ratesState.status !== 'ready') return;
    setQuotes(calculate(src, dest, destCurrency, amount, PROVIDERS, ratesState.rates));
  }

  const rateLabel = ratesState.status === 'ready'
    ? `Live mid-market rates as of ${ratesState.rateDate} · open.er-api.com`
    : ratesState.status === 'loading'
    ? 'Loading live exchange rates…'
    : null;

  return (
    // min-height prevents CLS while the calculator hydrates (prevents layout shift)
    <div className="space-y-6" style={{ minHeight: '320px' }}>
      {ratesState.status === 'error' && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          Could not load live exchange rates — please refresh and try again.
        </p>
      )}
      <CalculatorForm
        onSubmit={handleSubmit}
        disabled={ratesState.status !== 'ready'}
        rateLabel={rateLabel}
      />
      {quotes !== null && ratesState.status === 'ready' && (
        <ResultsTable quotes={quotes} rateDate={ratesState.rateDate} />
      )}
    </div>
  );
}
