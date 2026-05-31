'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import type { CountryCode, Currency } from '@/data/providers';
import { getCurrency, getDestCurrencies } from '@/lib/calculate';

const SOURCE_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: 'US', label: 'United States (USD)' },
  { code: 'GB', label: 'United Kingdom (GBP)' },
  { code: 'EU', label: 'Eurozone (EUR)' },
];

const DEST_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: 'GE', label: 'Georgia' },
  { code: 'PT', label: 'Portugal (EUR)' },
  { code: 'MX', label: 'Mexico (MXN)' },
  { code: 'TH', label: 'Thailand (THB)' },
  { code: 'ID', label: 'Indonesia (IDR)' },
];

const CURRENCY_LABELS: Record<Currency, string> = {
  USD: 'USD – US Dollar',
  GBP: 'GBP – British Pound',
  EUR: 'EUR – Euro',
  GEL: 'GEL – Georgian Lari',
  MXN: 'MXN – Mexican Peso',
  THB: 'THB – Thai Baht',
  IDR: 'IDR – Indonesian Rupiah',
};

interface Props {
  onSubmit: (sourceCountry: CountryCode, destCountry: CountryCode, destCurrency: Currency, amount: number) => void;
}

export function CalculatorForm({ onSubmit }: Props) {
  const [sourceCountry, setSourceCountry] = useState<CountryCode>('US');
  const [destCountry, setDestCountry] = useState<CountryCode>('GE');
  const [destCurrency, setDestCurrency] = useState<Currency>(getCurrency('GE'));
  const [amount, setAmount] = useState('1000');

  const sourceCurrency = getCurrency(sourceCountry);
  const availableDestCurrencies = getDestCurrencies(destCountry);

  function handleDestCountryChange(code: CountryCode) {
    setDestCountry(code);
    setDestCurrency(getCurrency(code));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    onSubmit(sourceCountry, destCountry, destCurrency, parsed);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>From</Label>
          <Select
            value={sourceCountry}
            onValueChange={(v) => { if (v) setSourceCountry(v as CountryCode); }}
          >
            <SelectTrigger className="w-full">
              <span data-slot="select-value" className="flex flex-1 text-left text-sm">
                {SOURCE_OPTIONS.find(o => o.code === sourceCountry)?.label ?? sourceCountry}
              </span>
            </SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map(o => (
                <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>To</Label>
          <Select
            value={destCountry}
            onValueChange={(v) => { if (v) handleDestCountryChange(v as CountryCode); }}
          >
            <SelectTrigger className="w-full">
              <span data-slot="select-value" className="flex flex-1 text-left text-sm">
                {DEST_OPTIONS.find(o => o.code === destCountry)?.label ?? destCountry}
              </span>
            </SelectTrigger>
            <SelectContent>
              {DEST_OPTIONS.map(o => (
                <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {availableDestCurrencies.length > 1 && (
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Recipient receives in</Label>
            <Select
              value={destCurrency}
              onValueChange={(v) => { if (v) setDestCurrency(v as Currency); }}
            >
              <SelectTrigger className="w-full">
                <span data-slot="select-value" className="flex flex-1 text-left text-sm">
                  {CURRENCY_LABELS[destCurrency] ?? destCurrency}
                </span>
              </SelectTrigger>
              <SelectContent>
                {availableDestCurrencies.map(c => (
                  <SelectItem key={c} value={c}>{CURRENCY_LABELS[c] ?? c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="amount">Amount to send ({sourceCurrency})</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                {sourceCurrency}
              </span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-12"
                placeholder="1000"
                required
              />
            </div>
            <Button type="submit">Compare options</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
