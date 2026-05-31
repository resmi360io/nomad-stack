'use client';

import { useState } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsTable } from './ResultsTable';
import { calculate } from '@/lib/calculate';
import { PROVIDERS } from '@/data/providers';
import type { CountryCode, Currency } from '@/data/providers';
import type { Quote } from '@/lib/calculate';

export function Calculator() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  function handleSubmit(src: CountryCode, dest: CountryCode, destCurrency: Currency, amount: number) {
    setQuotes(calculate(src, dest, destCurrency, amount, PROVIDERS));
  }

  return (
    <div className="space-y-6">
      <CalculatorForm onSubmit={handleSubmit} />
      {quotes !== null && <ResultsTable quotes={quotes} />}
    </div>
  );
}
