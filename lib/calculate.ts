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
  // The FX markup behind this quote is not traceable to a cited source, either
  // because the corridor row says so or because no researched row matched and we
  // fell back to the provider's generic estimate.
  isEstimate: boolean;
}

const COUNTRY_CURRENCY: Record<CountryCode, Currency> = {
  US: 'USD',
  GB: 'GBP',
  EU: 'EUR',
  GE: 'GEL',
  PT: 'EUR',
  MX: 'MXN',
  TH: 'THB',
  ID: 'IDR',
  PK: 'PKR',
  BD: 'BDT',
  NG: 'NGN',
  PH: 'PHP',
  BR: 'BRL',
  IN: 'INR',
  CO: 'COP',
  UZ: 'UZS',
};

// Currencies a recipient can receive in each destination country.
// First entry is the local default. Additional entries are foreign-currency
// bank accounts that Georgian (and other) banks commonly offer.
const DEST_CURRENCIES_MAP: Partial<Record<CountryCode, Currency[]>> = {
  GE: ['GEL', 'USD', 'EUR'],  // Georgian banks (TBC, BoG, etc.) support GEL, USD, and EUR accounts
  TH: ['THB', 'USD'],        // Thai banks offer foreign currency deposit (FCD) accounts in USD
  // Uzbekistan: the currency law (ZRU-573 of 2019) art. 12 lets residents open foreign
  // currency accounts at Uzbek banks, and nothing in it requires mandatory sale of foreign
  // currency earnings. SQB publishes free account opening and shows no tariff line charging
  // for inbound non-cash FX (an absence of a charge, not a stated zero).
  // Third corridor after Georgia and Thailand where the page can price NOT converting.
  UZ: ['UZS', 'USD'],
  // Philippines: BSP Foreign Exchange Regulations FAQs, March 2026 edition, question 28, under the
  // heading "V. NON-TRADE CURRENT ACCOUNT TRANSACTIONS": "Are foreign currency receipts of residents
  // from non-trade sources required to be inwardly remitted and sold for pesos? No. Section 1 of the
  // FX Manual allows FX receipts, acquisitions or earnings of residents from non-trade sources to be
  // used freely for any purpose. Such proceeds may, at the option of said residents, be sold for
  // pesos, retained or deposited in foreign currency accounts (whether in the Philippines or
  // abroad)." Read from the source PDF, not a summary. Freelance service fees sit in the non-trade
  // current account bucket in BSP's own taxonomy, which is where that question is filed; the FAQ
  // does not define non-trade, so that last step is our reading and the copy hedges it.
  // No retention cap, no deadline and no mandatory sale, which makes this the cleanest legal case on
  // the site. Only two rows can quote it: Wise by SWIFT and a generic wire. Payoneer cannot, because
  // its flat same-currency withdrawal requires the account to sit in a country whose official
  // currency it is, and the peso is the Philippines' currency.
  PH: ['PHP', 'USD'],
  // Indonesia: Bank Indonesia Regulation 7 of 2023 on export proceeds is the rule people assume
  // catches a freelancer, and it does not, because it is written about goods. Pasal 1 no. 3, read
  // from the PBI PDF on bi.go.id: "Ekspor adalah kegiatan mengeluarkan barang dari daerah pabean
  // sebagaimana dimaksud dalam Undang-Undang mengenai kepabeanan", that is, taking GOODS out of
  // the customs area. No. 5 makes DHE the proceeds of that activity, nos. 6 and 7 define both the
  // natural-resource and non-natural-resource buckets as "Devisa hasil kegiatan ekspor barang",
  // and no. 8 makes an Eksportir whoever performs it. Someone selling services has no customs
  // declaration and is not an Eksportir, so the retention and repatriation regime, its
  // three-month deadline and its USD 250,000 thresholds do not reach service income.
  // Product side, from bca.co.id: BCA Dollar takes USD 100 to open, holds no minimum balance,
  // requires no minimum monthly average, costs USD 1 a month, and is open to individual
  // customers, Indonesian or foreign, holding an identity card. Cheaper to keep open than the
  // Philippine equivalents.
  ID: ['IDR', 'USD'],
};

export function getCurrency(country: CountryCode): Currency {
  return COUNTRY_CURRENCY[country];
}

export function getDestCurrencies(country: CountryCode): Currency[] {
  return DEST_CURRENCIES_MAP[country] ?? [COUNTRY_CURRENCY[country]];
}

// Returns only the receiving currencies that have real corridors for (source, dest).
// Always includes the local destination currency (which falls back to provider defaults).
// Sorted: local currency first, then alphabetically.
export function getAvailableDestCurrencies(
  sourceCountry: CountryCode,
  destCountry: CountryCode,
  providers: Provider[]
): Currency[] {
  const localCurrency = COUNTRY_CURRENCY[destCountry];
  const currencies = new Set<Currency>([localCurrency]);

  for (const provider of providers) {
    if (!provider.supportedSourceCountries.includes(sourceCountry)) continue;
    if (!provider.supportedDestinationCountries.includes(destCountry)) continue;
    for (const corridor of provider.corridors) {
      if (corridor.source.country === sourceCountry && corridor.destination.country === destCountry) {
        currencies.add(corridor.destination.currency);
      }
    }
  }

  return [...currencies].sort((a, b) =>
    a === localCurrency ? -1 : b === localCurrency ? 1 : a.localeCompare(b)
  );
}

export function calculate(
  sourceCountry: CountryCode,
  destCountry: CountryCode,
  destCurrency: Currency,
  amount: number,
  providers: Provider[],
  midRates: Record<Currency, number>
): Quote[] {
  const sourceCurrency = COUNTRY_CURRENCY[sourceCountry];
  const localDestCurrency = COUNTRY_CURRENCY[destCountry];
  const midRate = midRates[destCurrency] / midRates[sourceCurrency];

  const quotes: Quote[] = [];

  for (const provider of providers) {
    if (!provider.supportedSourceCountries.includes(sourceCountry)) continue;
    if (!provider.supportedDestinationCountries.includes(destCountry)) continue;
    // A provider can serve a country without being able to pay out in its currency. Checked before
    // the fallback below, because the fallback is exactly what would invent the missing quote: the
    // guard further down only protects NON-local currencies, so a local currency the provider
    // cannot actually deliver would otherwise be priced from fallbackFee.
    if (provider.unsupportedDestinationCurrencies?.[destCountry]?.includes(destCurrency)) continue;

    const matched = provider.corridors.find(
      c => c.source.country === sourceCountry &&
           c.destination.country === destCountry &&
           c.destination.currency === destCurrency
    );

    // For non-local destination currencies (e.g. USD to a Georgian USD account),
    // only include providers with an explicit corridor — no fallback guessing.
    if (!matched && destCurrency !== localDestCurrency) continue;

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
      isEstimate: !matched || corridor.fxMarkupEstimated === true,
    });
  }

  quotes.sort((a, b) => b.netReceivedInDest - a.netReceivedInDest);
  // Best value goes to the top-ranked quote, and only if we can source its FX markup.
  // Two rules, and the second one was added on 2026-09-25 after it bit us.
  //
  // A quote built on an estimated markup still appears and still ranks, but it cannot
  // take the badge, because that would put our loudest recommendation on a number we
  // cannot defend. That much was always true.
  //
  // What was wrong was scanning DOWN the list for the first sourced quote. That awards
  // the badge to whatever we happen to be able to source, however badly it ranks. When
  // Payoneer and bank wire were both correctly flagged as estimated, the old rule put
  // BEST VALUE on PayPal for Indonesia: fourth of four on money actually received, and
  // the most expensive option on the page. No amount of footnoting fixes a label like
  // that. So the badge is now the top row's to win or nobody's, and a corridor where we
  // cannot source the cheapest option simply has no badge. Three corridors are in that
  // state today (PKR, BDT, IDR) and their copy says so rather than pretending otherwise.
  const top = quotes[0];
  if (top && !top.isEstimate) top.isBestValue = true;

  return quotes;
}
