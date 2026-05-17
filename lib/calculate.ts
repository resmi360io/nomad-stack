import type { Provider, CountryCode, Currency } from '@/data/providers';

export interface Quote {
  provider: Provider;
  totalFeeInSource: number;
  effectiveFeePercent: number;
  fxMarkupBps: number;
  fxRateUsed: number;
  netReceivedInDest: number;
  sourceCurrency: Currency;
  destCurrency: Currency;
  timeHours: number;
  affiliateLink: string;
  isBestValue: boolean;
}

// Units of each currency per 1 USD — mid-market snapshot 2026-05-17
// TODO v2: replace with live FX API (e.g. exchangerate-api.com)
const MID_RATES: Record<Currency, number> = {
  USD: 1.00,
  GBP: 0.79,
  EUR: 0.92,
  GEL: 2.73,
  MXN: 17.15,
  THB: 35.20,
  IDR: 16250,
};

const COUNTRY_CURRENCY: Record<CountryCode, Currency> = {
  US: 'USD',
  GB: 'GBP',
  EU: 'EUR',
  GE: 'GEL',
  PT: 'EUR',
  MX: 'MXN',
  TH: 'THB',
  ID: 'IDR',
};

export function getCurrency(country: CountryCode): Currency {
  return COUNTRY_CURRENCY[country];
}

export function calculate(
  sourceCountry: CountryCode,
  destCountry: CountryCode,
  amount: number,
  providers: Provider[]
): Quote[] {
  const sourceCurrency = COUNTRY_CURRENCY[sourceCountry];
  const destCurrency = COUNTRY_CURRENCY[destCountry];
  const midRate = MID_RATES[destCurrency] / MID_RATES[sourceCurrency];

  const quotes: Quote[] = [];

  for (const provider of providers) {
    if (!provider.supportedSourceCountries.includes(sourceCountry)) continue;
    if (!provider.supportedDestinationCountries.includes(destCountry)) continue;

    const matched = provider.corridors.find(
      c => c.source.country === sourceCountry && c.destination.country === destCountry
    );
    const corridor = matched ?? provider.fallbackFee;

    const totalFee = corridor.fixedFee + amount * corridor.percentageFee;
    const amountAfterFee = amount - totalFee;
    const fxRateUsed = midRate * (1 - corridor.fxMarkupBps / 10000);
    const netReceivedInDest = Math.max(0, amountAfterFee * fxRateUsed);

    quotes.push({
      provider,
      totalFeeInSource: totalFee,
      effectiveFeePercent: amount > 0 ? (totalFee / amount) * 100 : 0,
      fxMarkupBps: corridor.fxMarkupBps,
      fxRateUsed,
      netReceivedInDest,
      sourceCurrency,
      destCurrency,
      timeHours: corridor.typicalHours,
      affiliateLink: provider.affiliateLink,
      isBestValue: false,
    });
  }

  quotes.sort((a, b) => b.netReceivedInDest - a.netReceivedInDest);
  if (quotes.length > 0) quotes[0].isBestValue = true;

  return quotes;
}
