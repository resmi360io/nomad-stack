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
  ZA: 'ZAR',
  AR: 'ARS',
  PL: 'PLN',
  UA: 'UAH',
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
  // South Africa: the rule everyone cites is the 30 day one, and it is about currency held
  // OUTSIDE the country. SARB's Currency and Exchanges Manual for Authorised Dealers, version
  // 2026-10-08, section B.17(E)(i): holders of foreign currency outside South Africa "must,
  // unless exempted elsewhere in the Authorised Dealer Manual, offer to sell their holdings to
  // an Authorised Dealer within 30 days from the date of becoming entitled thereto". Once the
  // money is onshore a different rule takes over, section E.(B)(ii)(a)(aa): "Clients are
  // permitted to retain funds in their CFC accounts without the obligation to convert the funds
  // into Rand. The current repatriation requirement remains extant." Repatriate, do not convert.
  // A sole trader cannot open a CFC: E.(B)(i) opens them to "South African entities (legal
  // persons)" only. What a resident individual gets instead is a plain foreign currency account,
  // E.(C)(i) and B.2(B)(i)(m), which is what makes this entry correct for our reader.
  ZA: ['ZAR', 'USD'],
  // Argentina: the obligation to CONVERT is gone, the obligation to bring the money in is not.
  // BCRA texto ordenado "Exterior y Cambios" Version 8a, in force 2026-09-15 via Comunicacion A
  // 8481, point 2.2.1 requires service export receipts to be "ingresados y liquidados en el
  // mercado de cambios en un plazo no mayor a los 20 (veinte) dias habiles". Point 2.2.2.1 then
  // exempts personas humanas from the LIQUIDATION leg where the funds are credited to a
  // foreign-currency account the client holds at a LOCAL financial entity and the use is "neutra
  // en materia fiscal". Same point: "Las entidades no podran cobrar comisiones por estas
  // operaciones." The USD 36,000 annual cap that most of the internet still quotes was deleted by
  // A 8330 on 2025-09-18, and A 8417 of 2026-04-09 extended the exemption to all service concepts.
  AR: ['ARS', 'USD'],
  // Poland: no currency law to parse at all, which makes this the easiest entry in this map to
  // justify. mBank's eKonto walutowe is a free retail account in ten currencies including USD
  // ("0 zl za otwarcie i korzystanie z konta"), so a resident can simply hold dollars and choose
  // when to sell. The spread is deferred, not escaped: mBank converts an inbound payment at its
  // own buy rate, and into a non-matching foreign-currency account it crosses twice, buy then sell.
  PL: ['PLN', 'USD'],
  // Ukraine: the absence of a rule IS the rule, which is why this entry exists. NBU Board
  // Resolution No. 18 of 24.02.2022 governs banking under martial law; read across ~98% of its
  // 305,360 characters (consolidated revision 17.09.2026, basis v0105500-26) there is NO
  // mandatory sale and NO conversion obligation on a resident individual or a FOP. The only
  // forced sales are bank-side housekeeping. Ukraine abolished mandatory sale of export proceeds
  // in 2019, pre-war, and the wartime rules did not reinstate it. monobank gives a FOP free USD
  // and EUR accounts alongside the hryvnia one; PrivatBank runs FX current accounts for
  // individuals. So holding dollars is free and the spread only lands when you choose to sell,
  // which makes the dollar option the CHEAPER one here rather than the dearer one. Caps are on
  // cash, not on holding: ~200,000 UAH/day equivalent out of an FX account (point 5).
  UA: ['UAH', 'USD'],
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
