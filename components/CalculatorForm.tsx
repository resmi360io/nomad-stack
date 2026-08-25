'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import type { CountryCode, Currency } from '@/data/providers';
import { PROVIDERS } from '@/data/providers';
import { getCurrency, getAvailableDestCurrencies } from '@/lib/calculate';

const SOURCE_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: 'US', label: 'United States (USD)' },
  { code: 'GB', label: 'United Kingdom (GBP)' },
  { code: 'EU', label: 'Eurozone (EUR)' },
];

const DEST_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: 'BD', label: 'Bangladesh (BDT)' },
  { code: 'GE', label: 'Georgia' },
  { code: 'NG', label: 'Nigeria (NGN)' },
  { code: 'PK', label: 'Pakistan (PKR)' },
  { code: 'PH', label: 'Philippines (PHP)' },
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
  PKR: 'PKR – Pakistani Rupee',
  BDT: 'BDT – Bangladeshi Taka',
  NGN: 'NGN – Nigerian Naira',
  PHP: 'PHP – Philippine Peso',
};

interface Props {
  onSubmit: (sourceCountry: CountryCode, destCountry: CountryCode, destCurrency: Currency, amount: number) => void;
  disabled?: boolean;
  rateLabel?: string | null;
  defaultSrc?: CountryCode;
  defaultDest?: CountryCode;
}

export function CalculatorForm({ onSubmit, disabled, rateLabel, defaultSrc = 'US', defaultDest = 'PK' }: Props) {
  const [sourceCountry, setSourceCountry] = useState<CountryCode>(defaultSrc);
  const [destCountry, setDestCountry] = useState<CountryCode>(defaultDest);
  const [destCurrency, setDestCurrency] = useState<Currency>(getCurrency(defaultDest));
  const [amount, setAmount] = useState('1000');

  const sourceCurrency = getCurrency(sourceCountry);
  const availableDestCurrencies = useMemo(
    () => getAvailableDestCurrencies(sourceCountry, destCountry, PROVIDERS),
    [sourceCountry, destCountry]
  );

  function handleSourceChange(code: CountryCode) {
    setSourceCountry(code);
    // Reset receiving currency to local default when source changes
    // (same-currency options differ per source — e.g., US→GE has USD but EU→GE has EUR)
    setDestCurrency(getCurrency(destCountry));
  }

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
          <Select
            value={sourceCountry}
            onValueChange={(v) => { if (v) handleSourceChange(v as CountryCode); }}
          >
            <SelectFieldLabel>From</SelectFieldLabel>
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
          <Select
            value={destCountry}
            onValueChange={(v) => { if (v) handleDestCountryChange(v as CountryCode); }}
          >
            <SelectFieldLabel>To</SelectFieldLabel>
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
            <Select
              value={destCurrency}
              onValueChange={(v) => { if (v) setDestCurrency(v as Currency); }}
            >
              <SelectFieldLabel>Recipient receives in</SelectFieldLabel>
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
            <Button type="submit" disabled={disabled}>Compare options</Button>
          </div>
          {rateLabel && (
            <p className="mt-2 text-xs text-muted-foreground">{rateLabel}</p>
          )}
        </div>
      </div>
    </form>
  );
}
