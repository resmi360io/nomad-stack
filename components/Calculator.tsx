'use client';

import { useState } from 'react';
import { CalculatorForm, DEST_OPTIONS, SOURCE_OPTIONS } from './CalculatorForm';
import { ResultsTable } from './ResultsTable';
import { calculate, describeResults } from '@/lib/calculate';
import { PROVIDERS } from '@/data/providers';
import type { CountryCode, Currency } from '@/data/providers';
import type { Quote } from '@/lib/calculate';
import { useLiveRates } from '@/hooks/useLiveRates';
import { calcRunProperties } from '@/lib/analytics';
import posthog from 'posthog-js';

interface Props {
  defaultSrc?: CountryCode;
  defaultDest?: CountryCode;
}

// What a set of results was computed FOR. Kept with the quotes, so the summary always describes
// the numbers on screen even after the reader has started editing the form.
interface Result {
  quotes: Quote[];
  src: CountryCode;
  dest: CountryCode;
  destCurrency: Currency;
  amount: number;
  rateDate: string;
}

export function Calculator({ defaultSrc, defaultDest }: Props = {}) {
  const [result, setResult] = useState<Result | null>(null);
  const [stale, setStale] = useState(false);
  // The live region's text. Set on the three events worth announcing (new results, results going
  // out of date, results withdrawn) and nowhere else, so typing an amount is not narrated per key.
  const [announcement, setAnnouncement] = useState('');
  const ratesState = useLiveRates();

  function handleSubmit(src: CountryCode, dest: CountryCode, destCurrency: Currency, amount: number) {
    if (ratesState.status !== 'ready') return;
    const quotes = calculate(src, dest, destCurrency, amount, PROVIDERS, ratesState.rates);
    setResult({ quotes, src, dest, destCurrency, amount, rateDate: ratesState.rateDate });
    setStale(false);
    setAnnouncement(`Results updated. ${describeResults(quotes)}`);
    // One event per Compare press (the form submits nothing on its own), with the amount as a band.
    posthog.capture('calc_run', calcRunProperties(quotes, src, dest, destCurrency, amount));
  }

  function handleInputsChange() {
    if (result && !stale) {
      setStale(true);
      setAnnouncement('Inputs changed. The results below are out of date until you compare again.');
    }
  }

  function handleInvalid() {
    if (result) {
      setResult(null);
      setStale(false);
      setAnnouncement('Previous results cleared.');
    }
  }

  const rateLabel = ratesState.status === 'ready'
    ? `Live mid-market rates as of ${ratesState.rateDate} · open.er-api.com`
    : ratesState.status === 'loading'
    ? 'Loading live exchange rates…'
    : null;

  const sourceLabel = (c: CountryCode) => SOURCE_OPTIONS.find((o) => o.code === c)?.label ?? c;
  const destLabel = (c: CountryCode) => DEST_OPTIONS.find((o) => o.code === c)?.label ?? c;

  return (
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
        onInputsChange={handleInputsChange}
        onInvalid={handleInvalid}
        disabled={ratesState.status !== 'ready'}
        rateLabel={rateLabel}
        defaultSrc={defaultSrc}
        defaultDest={defaultDest}
      />
      {/* Persistent live region (WCAG 4.1.3). It announces a one-sentence summary built by the same
          describeResults() the tests check against the visible ranking; the results themselves are
          not live, so they are not read out in full on every submit. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {result && (
        <ResultsTable
          quotes={result.quotes}
          rateDate={result.rateDate}
          amount={result.amount}
          stale={stale}
          destCountry={result.dest}
          context={{
            from: sourceLabel(result.src),
            to: destLabel(result.dest),
            currency: result.destCurrency,
          }}
        />
      )}
    </div>
  );
}
