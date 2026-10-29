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
  { code: 'BR', label: 'Brazil (BRL)' },
  // Every destination here has a corridor guide page behind it, and that is the rule: do not
  // add one to this dropdown before its page exists in CORRIDORS. Offering a destination with
  // no guide behind it is the exact mismatch this site was pulled up on before.
  { code: 'CO', label: 'Colombia (COP)' },
  { code: 'IN', label: 'India (INR)' },
  { code: 'UZ', label: 'Uzbekistan (UZS)' },
  { code: 'MX', label: 'Mexico (MXN)' },
  { code: 'TH', label: 'Thailand (THB)' },
  { code: 'ID', label: 'Indonesia (IDR)' },
  { code: 'ZA', label: 'South Africa (ZAR)' },
  { code: 'AR', label: 'Argentina (ARS)' },
  { code: 'PL', label: 'Poland (PLN)' },
  { code: 'UA', label: 'Ukraine (UAH)' },
];

// Rendered to readers in the "Recipient receives in" dropdown, so no en dashes here.
const CURRENCY_LABELS: Record<Currency, string> = {
  USD: 'USD, US Dollar',
  GBP: 'GBP, British Pound',
  EUR: 'EUR, Euro',
  GEL: 'GEL, Georgian Lari',
  MXN: 'MXN, Mexican Peso',
  THB: 'THB, Thai Baht',
  IDR: 'IDR, Indonesian Rupiah',
  PKR: 'PKR, Pakistani Rupee',
  BDT: 'BDT, Bangladeshi Taka',
  NGN: 'NGN, Nigerian Naira',
  PHP: 'PHP, Philippine Peso',
  BRL: 'BRL, Brazilian Real',
  INR: 'INR, Indian Rupee',
  COP: 'COP, Colombian Peso',
  UZS: 'UZS, Uzbekistani Som',
  ZAR: 'ZAR, South African Rand',
  ARS: 'ARS, Argentine Peso',
  PLN: 'PLN, Polish Zloty',
  UAH: 'UAH, Ukrainian Hryvnia',
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
  // Shown only after a submit that the amount check rejects; editing the field clears it.
  const [amountError, setAmountError] = useState(false);

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
    if (!parsed || parsed <= 0) {
      setAmountError(true);
      return;
    }
    onSubmit(sourceCountry, destCountry, destCurrency, parsed);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="pa-card p-4 sm:p-6">
      <div className="grid gap-x-3 gap-y-3.5 sm:grid-cols-2 sm:gap-y-4">
        <div className="space-y-1.5">
          <Select
            value={sourceCountry}
            onValueChange={(v) => { if (v) handleSourceChange(v as CountryCode); }}
          >
            <SelectFieldLabel className="text-[0.8125rem] font-semibold text-foreground">From</SelectFieldLabel>
            <SelectTrigger className="w-full">
              <span data-slot="select-value" className="flex flex-1 truncate text-left">
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
            <SelectFieldLabel className="text-[0.8125rem] font-semibold text-foreground">To</SelectFieldLabel>
            <SelectTrigger className="w-full">
              <span data-slot="select-value" className="flex flex-1 truncate text-left">
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
              <SelectFieldLabel className="text-[0.8125rem] font-semibold text-foreground">Recipient receives in</SelectFieldLabel>
              <SelectTrigger className="w-full">
                <span data-slot="select-value" className="flex flex-1 truncate text-left">
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
          <Label htmlFor="amount" className="text-[0.8125rem] font-semibold text-foreground">Amount to send ({sourceCurrency})</Label>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground select-none">
                {sourceCurrency}
              </span>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                value={amount}
                onChange={e => { setAmount(e.target.value); if (amountError) setAmountError(false); }}
                aria-invalid={amountError || undefined}
                aria-describedby={amountError ? 'amount-error' : undefined}
                className="pa-figure h-12 pl-14 text-lg font-semibold md:text-lg"
                placeholder="1000"
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={disabled} className="h-12 w-full sm:w-auto sm:px-7">
              Compare options
            </Button>
          </div>
          {amountError && (
            <p id="amount-error" className="text-[0.8125rem] font-medium text-destructive">
              Enter an amount greater than zero.
            </p>
          )}
        </div>
      </div>
      {/* Where the rates come from and how fresh they are. Always rendered, so the line is there
          before the rates load and nothing shifts when it fills in. */}
      <p className="mt-3.5 flex min-h-[1.25rem] items-start gap-2 text-xs leading-5 text-muted-foreground">
        {rateLabel?.startsWith('Live') && <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-positive" />}
        <span>{rateLabel ?? ''}</span>
      </p>
    </form>
  );
}
