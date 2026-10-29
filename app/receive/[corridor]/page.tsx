import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CORRIDORS } from '@/data/corridors';
import { RATE_PAGES } from '@/data/ratePages';
import { fetchRatesServer } from '@/lib/fetchRates';
import { PROVIDERS } from '@/data/providers';
import { calculate, getDestCurrencies } from '@/lib/calculate';
import type { CountryCode, Currency } from '@/data/providers';
import { Calculator } from '@/components/Calculator';
import { BestValueBadge } from '@/components/BestValueBadge';
import { splitParagraphs } from '@/lib/paragraphs';

export const revalidate = 3600;

const getRates = cache(fetchRatesServer);

export async function generateStaticParams() {
  return CORRIDORS.map((c) => ({ corridor: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ corridor: string }>;
}): Promise<Metadata> {
  const { corridor: slug } = await params;
  const corridor = CORRIDORS.find((c) => c.slug === slug);
  if (!corridor) return {};
  return {
    title: corridor.title,
    description: corridor.metaDescription,
    alternates: { canonical: `/receive/${corridor.slug}` },
    openGraph: {
      title: corridor.title,
      description: corridor.metaDescription,
      url: `/receive/${corridor.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: corridor.title,
      description: corridor.metaDescription,
    },
  };
}

function toSchemaDate(iso: string): string {
  return `${iso}T00:00:00+00:00`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function formatHours(h: number): string {
  if (h < 1) return '< 1 hr';
  if (h === 1) return '~ 1 hr';
  if (h < 24) return `~${h} hrs`;
  const days = Math.round(h / 24);
  return days === 1 ? '~1 day' : `~${days} days`;
}

function formatAmount(n: number, currency: string): string {
  // 'n/a' rather than a dash: this string renders into the comparison table cells, and no
  // reader-facing text on this site carries an em or en dash. It used to return one.
  if (!isFinite(n)) return 'n/a';
  const decimals = ['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP', 'INR', 'COP', 'UZS', 'ARS', 'UAH'].includes(currency) ? 0 : 2;
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default async function CorridorPage({
  params,
}: {
  params: Promise<{ corridor: string }>;
}) {
  const { corridor: slug } = await params;
  const corridor = CORRIDORS.find((c) => c.slug === slug);
  if (!corridor) notFound();

  const ratesResult = await getRates();

  // Every table on this page is priced at one invoice size. That single number quietly decides
  // which provider looks cheapest, because some charge a flat fee per transfer and others a
  // percentage, so the order genuinely changes with the amount. Two live examples: on Georgia at
  // 1,000 Payoneer trails a bank wire by a dollar and leads it well before 5,000, and on the
  // Philippines converting to pesos beats taking dollars up to about 1,600 and loses above it.
  // Rather than pick a different arbitrary size, price a second one and tell the reader when the
  // winner actually swaps. RANK_CHECK_AMOUNT is never shown as a price, only used for that test.
  const COMPARISON_AMOUNT = 1000;
  const RANK_CHECK_AMOUNT = 5000;

  const quotes =
    ratesResult
      ? calculate(
          corridor.sourceCountry as CountryCode,
          corridor.destCountry as CountryCode,
          corridor.destination as Currency,
          COMPARISON_AMOUNT,
          PROVIDERS,
          ratesResult.rates,
        )
      : null;

  // The same comparison at a larger invoice, used only to detect an order change.
  const quotesAtLarger =
    ratesResult
      ? calculate(
          corridor.sourceCountry as CountryCode,
          corridor.destCountry as CountryCode,
          corridor.destination as Currency,
          RANK_CHECK_AMOUNT,
          PROVIDERS,
          ratesResult.rates,
        )
      : null;

  // Total cost of a quote against the mid rate: the transfer fee AND the margin inside the
  // conversion, as a share of the invoice. effectiveFeePercent is the transfer fee alone, which is
  // why a row could read "0.00%" in one column and "2.00% all in" on the homepage. Same formula as
  // CorridorTable and the rate pages; presentation only, nothing here feeds the ranking.
  const totalCostPct = (q: { netReceivedInDest: number }, currency: string) => {
    if (!ratesResult) return NaN;
    const atMid =
      COMPARISON_AMOUNT *
      (ratesResult.rates[currency as Currency] / ratesResult.rates[corridor.source as Currency]);
    return atMid > 0 ? (1 - q.netReceivedInDest / atMid) * 100 : NaN;
  };
  const fmtPct = (n: number) => (isFinite(n) ? `${n.toFixed(2)}%` : 'n/a');

  const cheapestSwitchesAt =
    quotes && quotes.length > 1 && quotesAtLarger && quotesAtLarger.length > 1 &&
    quotes[0].provider.slug !== quotesAtLarger[0].provider.slug
      ? { small: quotes[0].provider.name, large: quotesAtLarger[0].provider.name }
      : null;

  // Some destinations let you hold foreign currency instead of converting on arrival.
  // The main table above prices converting into the local currency, which on those
  // corridors is the option the page often argues against, so price the alternatives too.
  const altReceiving =
    ratesResult
      ? getDestCurrencies(corridor.destCountry as CountryCode)
          .filter((c) => c !== corridor.destination)
          .map((currency) => ({
            currency,
            quotes: calculate(
              corridor.sourceCountry as CountryCode,
              corridor.destCountry as CountryCode,
              currency,
              COMPARISON_AMOUNT,
              PROVIDERS,
              ratesResult.rates,
            ),
          }))
          .filter((set) => set.quotes.length > 0)
      : [];

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://paidacross.com/receive/${corridor.slug}#article`,
        headline: corridor.h1,
        datePublished: toSchemaDate(corridor.publishedDate),
        dateModified: toSchemaDate(corridor.updatedDate),
        url: `https://paidacross.com/receive/${corridor.slug}`,
        image: 'https://paidacross.com/opengraph-image',
        author: {
          '@type': 'Person',
          name: 'George I.',
          url: 'https://paidacross.com/about/author',
        },
        publisher: {
          '@id': 'https://paidacross.com/#organization',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://paidacross.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Receiving international payments',
            item: 'https://paidacross.com/receive-international-payments',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: corridor.country,
            item: `https://paidacross.com/receive/${corridor.slug}`,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        name: 'International Payment Cost Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      ...(corridor.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: corridor.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            },
          ]
        : []),
    ],
  };

  // Oldest lastVerified across the providers this corridor actually quotes. Guarded because
  // supportedProviders holds slugs and some (gcash on PHP) have no entry in PROVIDERS at all.
  const corridorProviderDates = corridor.supportedProviders
    .map((slug) => PROVIDERS.find((p) => p.slug === slug)?.lastVerified)
    .filter((d): d is string => typeof d === 'string');
  const oldestFeeVerified =
    corridorProviderDates.length > 0
      ? corridorProviderDates.reduce((a, b) => (a < b ? a : b))
      : null;

  // A provider entry earns a full section when it has a customHeading, whether or not it is
  // `available`. On several corridors the most useful prose on the page is about a provider the
  // reader cannot use for an invoice: Wise on Uzbekistan ("ask your client to use it"), the
  // transfer apps that reach the country but bar business use, the domestic card rails. A
  // customHeading is the author's signal that the entry argues something, rather than being a
  // one-line "nope". Before this split, every unavailable entry was collapsed into the compact
  // list below, which threw the heading away and set the prose at text-xs: on Uzbekistan that
  // buried four sections, including the two longest on the page. Entries with no customHeading
  // are genuine one-liners and stay compact.
  const deepDiveProviders = corridor.providers.filter((p) => p.available || p.customHeading);
  const compactUnavailable = corridor.providers.filter((p) => !p.available && !p.customHeading);

  const keyFacts =
    quotes && quotes.length > 0
      ? {
          top: quotes[0].provider.name,
          cost: `${fmtPct(totalCostPct(quotes[0], corridor.destination))}${quotes[0].isEstimate ? ' (est.)' : ''}`,
          remittance: quotes[0].personalRemittancePricing,
          options: quotes.length,
        }
      : null;

  // "On this page": the h2s below, in order, each with the anchor its heading carries. Built from
  // the same values the headings render, so the list cannot drift from the page.
  const providerHeading = (p: (typeof corridor.providers)[number]) =>
    p.customHeading ?? `How much does ${p.name} charge to receive ${corridor.source} in ${corridor.country}?`;
  const toc: { id: string; label: string }[] = [
    { id: 'calculator', label: 'Calculate your own transfer' },
    ...(quotes && quotes.length > 0 ? [{ id: 'comparison', label: 'Provider comparison' }] : []),
    ...(!quotes ? [{ id: 'comparison', label: 'Provider comparison' }] : []),
    ...(altReceiving.length > 0
      ? [{ id: 'without-converting', label: `Receiving without converting, in ${corridor.country}` }]
      : []),
    ...deepDiveProviders.map((p) => ({ id: `provider-${p.slug}`, label: providerHeading(p) })),
    ...(compactUnavailable.length > 0
      ? [{ id: 'not-available', label: `Providers not available in ${corridor.country}` }]
      : []),
    { id: 'methodology', label: 'How we calculate these figures' },
    ...(corridor.faqs.length > 0 ? [{ id: 'faq', label: 'Frequently asked questions' }] : []),
  ];
  const tocList = (
    <ol className="space-y-2 text-sm leading-snug">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="text-muted-foreground hover:text-stamp">
            {t.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="pa-shell grid gap-x-16 pt-6 pb-4 sm:pt-10 xl:grid-cols-[minmax(0,46rem)_15rem]">
        <div className="min-w-0 space-y-14 xl:col-start-1 xl:row-start-1">
          {/* Header */}
          <header className="space-y-5">
            <nav className="pa-meta" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/receive-international-payments" className="hover:text-foreground">Receiving international payments</Link></li>
                <li aria-hidden="true">›</li>
                <li className="text-foreground">{corridor.country}</li>
              </ol>
            </nav>
            <h1 className="pa-h1">
              {corridor.h1}
            </h1>
            <div className="pa-intro space-y-3">
              {splitParagraphs(corridor.intro).map((t, i) => <p key={i}>{t}</p>)}
            </div>
            <p className="pa-meta">
              By{' '}
              <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
                George I.
              </Link>
              {' · '}
              Last updated:{' '}
              <time dateTime={corridor.updatedDate}>{formatIsoDate(corridor.updatedDate)}</time>
            </p>
            {/* Key facts, computed from the same quotes as the comparison table below, so they move
              when the rotation corrects a fee. They restate the table; they make no claim of their own. */}
          {keyFacts && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border text-sm sm:grid-cols-3">
              <div className="col-span-2 bg-sheet px-4 py-3 sm:col-span-1">
                <dt className="text-xs text-muted-foreground">Top of the table at ${COMPARISON_AMOUNT.toLocaleString('en-US')}</dt>
                <dd className="mt-0.5 font-semibold">
                  {keyFacts.top}
                  {keyFacts.remittance && (
                    <span className="mt-0.5 block text-xs font-medium text-caution">Personal remittance price</span>
                  )}
                </dd>
              </div>
              <div className="bg-sheet px-4 py-3">
                <dt className="text-xs text-muted-foreground">Total cost</dt>
                <dd className="pa-figure mt-0.5 font-semibold">{keyFacts.cost}</dd>
              </div>
              <div className="bg-sheet px-4 py-3">
                <dt className="text-xs text-muted-foreground">Options we price</dt>
                <dd className="pa-figure mt-0.5 font-semibold">{keyFacts.options}</dd>
              </div>
            </dl>
          )}
          <details className="pa-note group px-4 py-3 xl:hidden">
              <summary className="cursor-pointer text-sm font-semibold marker:text-rule">On this page</summary>
              <nav aria-label="On this page" className="mt-3">
                {tocList}
              </nav>
            </details>
          </header>

          {/* Calculator widget */}
          <section aria-label="Payment cost calculator">
            <h2 id="calculator" className="pa-h2 mb-5">Calculate your own transfer</h2>
            <Calculator
              defaultSrc={corridor.sourceCountry as CountryCode}
              defaultDest={corridor.destCountry as CountryCode}
            />
          </section>

          {/* Comparison table */}
          {quotes && quotes.length > 0 && (
            <section>
              <h2 id="comparison" className="pa-h2 mb-2">
                Provider comparison: receiving ${COMPARISON_AMOUNT.toLocaleString()} USD in {corridor.country}
              </h2>
              {ratesResult && (
                <p className="pa-meta mb-5">
                  Using live mid-market rate as of {ratesResult.rateDate} ·{' '}
                  <a
                    href="https://open.er-api.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    open.er-api.com
                  </a>
                </p>
              )}
              {cheapestSwitchesAt && (
                <p className="pa-note mb-5 px-4 py-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  This ranking is for a ${COMPARISON_AMOUNT.toLocaleString()} invoice, and it does not
                  hold at every size. {cheapestSwitchesAt.small} is cheapest here, but at $
                  {RANK_CHECK_AMOUNT.toLocaleString()} it is {cheapestSwitchesAt.large}, because some
                  providers charge a flat fee per transfer and others a percentage of it. Put your own
                  invoice amount into the calculator above rather than reading the order off this table.
                </p>
              )}
              <div className="pa-table-wrap">
                <table className="w-full text-[0.9375rem]">
                  <caption className="sr-only">
                    Provider comparison: receiving ${COMPARISON_AMOUNT.toLocaleString()} USD in {corridor.country},
                    ranked by net received
                  </caption>
                  <thead>
                    <tr className="text-left">
                      <th scope="col" className="px-4 py-3">Provider</th>
                      <th scope="col" className="px-4 py-3 text-right">Net received ({corridor.destination})</th>
                      <th scope="col" className="px-4 py-3 text-right">Total cost</th>
                      <th scope="col" className="px-4 py-3 text-right">Transfer fee</th>
                      <th scope="col" className="px-4 py-3">FX margin</th>
                      <th scope="col" className="px-4 py-3">Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* The best value badge renders here as well as in the interactive
                        calculator. It used to live only in the client-side ResultsTable, which
                        meant the page's own copy referred to a badge the server-rendered table
                        never showed: the Mexico page says it carries our best value badge, above
                        a table containing no badge. A reader without JavaScript, and a crawler,
                        saw the ranking but not the recommendation. */}
                    {quotes.map((q) => (
                      <tr
                        key={q.provider.slug}
                        className={q.isBestValue ? 'bg-stamp-tint' : undefined}
                      >
                        <td className="px-4 py-3 font-semibold">
                          <span className="flex flex-wrap items-center gap-2">
                            {q.provider.name}
                            {q.isBestValue && <BestValueBadge />}
                          </span>
                          {q.personalRemittancePricing && (
                            <span className="mt-1 block text-xs font-medium text-caution">
                              Personal remittance price
                            </span>
                          )}
                        </td>
                        <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
                          {formatAmount(q.netReceivedInDest, corridor.destination)}
                        </td>
                        <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
                          {fmtPct(totalCostPct(q, corridor.destination))}
                        </td>
                        <td className="pa-figure px-4 py-3 text-right text-muted-foreground">
                          {q.effectiveFeePercent.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {q.fxMarkupBps === 0
                            ? 'Mid-market'
                            : `+${(q.fxMarkupBps / 100).toFixed(1)}%`}
                          {q.isEstimate && (
                            <span className="ml-1 not-italic text-muted-foreground/70">
                              (est.)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {formatHours(q.timeHours)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Receiving without converting. Only rendered for destinations that actually
              offer foreign-currency accounts, so most corridors show nothing here. */}
          {altReceiving.length > 0 && (
            <section className="space-y-5">
              <h2 id="without-converting" className="pa-h2">
                Receiving without converting, in {corridor.country}
              </h2>
              {corridor.altReceivingNote && (
                <div className="pa-prose space-y-4">
                  {splitParagraphs(corridor.altReceivingNote).map((t, i) => <p key={i}>{t}</p>)}
                </div>
              )}
              {altReceiving.map((set) => (
                <div key={set.currency} className="space-y-3">
                  <h3 className="pa-h3">
                    Receiving ${COMPARISON_AMOUNT.toLocaleString()} USD as {set.currency}
                  </h3>
                  <div className="pa-table-wrap">
                    <table className="w-full text-[0.9375rem]">
                      <caption className="sr-only">
                        Providers that can pay ${COMPARISON_AMOUNT.toLocaleString()} USD into a {set.currency} account in{' '}
                        {corridor.country}, ranked by net received
                      </caption>
                      <thead>
                        <tr className="text-left">
                          <th scope="col" className="px-4 py-3">Provider</th>
                          <th scope="col" className="px-4 py-3 text-right">Net received ({set.currency})</th>
                          <th scope="col" className="px-4 py-3 text-right">Total cost</th>
                          <th scope="col" className="px-4 py-3 text-right">Transfer fee</th>
                          <th scope="col" className="px-4 py-3">FX margin</th>
                          <th scope="col" className="px-4 py-3">Speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {set.quotes.map((q) => (
                          <tr key={q.provider.slug}>
                            <td className="px-4 py-3 font-semibold">{q.provider.name}</td>
                            <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
                              {formatAmount(q.netReceivedInDest, set.currency)}
                            </td>
                            <td className="pa-figure px-4 py-3 text-right font-semibold whitespace-nowrap">
                              {fmtPct(totalCostPct(q, set.currency))}
                            </td>
                            <td className="pa-figure px-4 py-3 text-right text-muted-foreground">
                              {q.effectiveFeePercent.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {q.fxMarkupBps === 0
                                ? 'No conversion'
                                : `+${(q.fxMarkupBps / 100).toFixed(1)}%`}
                              {/* This column is the FX margin, so "(est.)" next to it reads as doubt
                                  about the margin. Where nothing converts the margin is exactly zero
                                  and there is nothing to estimate: what is estimated on those rows is
                                  the FEE, which the previous column shows. Marking "No conversion
                                  (est.)" told readers we were unsure whether a conversion happens.
                                  Every row in a foreign-currency table has fxMarkupBps 0, so this hid
                                  behind the local-currency tables until the Philippines dollar table
                                  arrived with both of its rows estimated. */}
                              {q.isEstimate && q.fxMarkupBps !== 0 && (
                                <span className="ml-1 text-muted-foreground/70">(est.)</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {formatHours(q.timeHours)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Live rates unavailable: say so rather than silently dropping the table */}
          {!quotes && (
            <section>
              <h2 id="comparison" className="pa-h2 mb-4">
                Provider comparison: receiving ${COMPARISON_AMOUNT.toLocaleString()} USD in {corridor.country}
              </h2>
              <div className="pa-note px-5 py-4 text-[0.9375rem] text-muted-foreground leading-relaxed">
                <p>
                  We could not reach our exchange-rate source when this page was last generated, so
                  the ranked comparison is not shown. The provider fees below are unaffected and
                  still current. Use the calculator above, which fetches rates in your browser, or
                  reload in a little while: this page refreshes hourly.
                </p>
              </div>
            </section>
          )}

          {/* Provider deep-dives, available or not. See the note on deepDiveProviders above. */}
          {deepDiveProviders.map((p) => (
            <section key={p.slug}>
              <h2 id={`provider-${p.slug}`} className="pa-h2 mb-4">
                {providerHeading(p)}
              </h2>
              <div className="pa-prose space-y-4">
                {splitParagraphs(p.notes).map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </section>
          ))}

          {/* Unavailable providers with nothing more to say than that */}
          {compactUnavailable.length > 0 && (
            <section>
              <h2 id="not-available" className="pa-h2 mb-5">
                Providers not available in {corridor.country}
              </h2>
              <div className="pa-sheet divide-y divide-border">
                {compactUnavailable.map((p) => (
                  <div key={p.slug} className="px-5 py-4">
                    <p className="font-semibold mb-1">{p.name}: not available</p>
                    <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">{p.notes}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Methodology */}
          <section className="pa-note px-5 py-6 sm:px-7">
            <h2 id="methodology" className="pa-h3 mb-3">How we calculate these figures</h2>
            <p className="max-w-[65ch] text-[0.9375rem] text-muted-foreground leading-relaxed">
              The net received figure deducts the provider&apos;s published flat fee and percentage
              fee from the send amount, then converts at the live mid-market rate from{' '}
              <a
                href="https://open.er-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                open.er-api.com
              </a>{' '}
              minus the provider&apos;s FX markup in basis points. Rates on this page refresh hourly
              (ISR). Fee data is sourced from each provider&apos;s public pricing page and verified
              periodically. Not every provider publishes an FX spread. Where one does not, we
              estimate it, mark the row &ldquo;est.&rdquo; in the FX margin column, and exclude it
              from the best-value badge, so the option we highlight is always one whose spread we
              can source.
            </p>
            <p className="pa-meta mt-4">
              {oldestFeeVerified
                ? `Fee data for this corridor last verified ${oldestFeeVerified} or later; each provider card shows its own date.`
                : 'Fee data verification dates are shown on each provider card.'}{' '}
              ·{' '}
              <a
                href="https://github.com/resmi360io/nomad-stack"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Open-source fee data on GitHub
              </a>
            </p>
          </section>

          {/* FAQs */}
          {corridor.faqs.length > 0 && (
            <section>
              <h2 id="faq" className="pa-h2 mb-6">Frequently asked questions</h2>
              <div className="divide-y divide-border border-y border-border">
                {corridor.faqs.map((faq, i) => (
                  <div key={i} className="py-5">
                    <h3 className="pa-h3 mb-2">{faq.q}</h3>
                    <div className="pa-prose space-y-3">
                      {splitParagraphs(faq.a).map((t, j) => <p key={j}>{t}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Author byline */}
          <div className="pa-meta space-y-1.5 border-t border-rule pt-5">
            <p>
              Written by{' '}
              <Link
                href="/about/author"
                className="underline underline-offset-2 hover:text-foreground"
              >
                George I.
              </Link>{' '}
              (20+ years in international payments). Last updated:{' '}
              <time dateTime={corridor.updatedDate}>{formatIsoDate(corridor.updatedDate)}</time>.
            </p>
            <p>
              Fees are estimates from publicly available pricing. Verify with your provider before
              transferring. Nothing on this site is financial or tax advice.{' '}
              <Link
                href="/how-we-make-money"
                className="underline underline-offset-2 hover:text-foreground"
              >
                How we make money
              </Link>
              .
            </p>
          </div>

          {/* Internal links */}
          <nav aria-label="Related guides">
            <h2 className="pa-h3 mb-3">Related guides</h2>
            <ul className="grid gap-2 text-[0.9375rem] leading-snug sm:grid-cols-2 [&>li]:rounded-md [&>li]:border [&>li]:border-border [&>li]:bg-sheet [&>li]:px-4 [&>li]:py-3">
              <li>
                <Link
                  href="/receive-international-payments"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  How freelancers receive international payments: real costs by country
                </Link>
              </li>
              {/* The sender page is new and has no inbound links of its own. Corridor pages are the
                  ones already on page one, so this is where its first internal links come from. */}
              <li>
                <Link
                  href="/pay-freelancers-internationally"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Paying a freelancer in {corridor.country}? How to pay freelancers internationally
                </Link>
              </li>
              {/* Provider rate pages for THIS corridor, listed before the sibling corridors because
                  they are the more specific page rather than a lateral one. These target the
                  "[provider] [pair] rate today" query the 2026-06-14 GSC read found this site
                  already ranking for, and the link is what tells Google they belong together. */}
              {RATE_PAGES.filter((rp) => rp.corridorSlug === corridor.slug).map((rp) => (
                <li key={rp.slug}>
                  <Link
                    href={`/rates/${rp.slug}`}
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {rp.h1}
                  </Link>
                </li>
              ))}
              {corridor.siblingCorridors?.map((siblingSlug) => {
                const sibling = CORRIDORS.find((c) => c.slug === siblingSlug);
                if (!sibling) return null;
                return (
                  <li key={siblingSlug}>
                    <Link
                      href={`/receive/${siblingSlug}`}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      Receive {sibling.source} in {sibling.country}: provider comparison
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* After the article in source order, so the H1 and intro stay the first text a crawler or
            screen reader meets; the grid places it in the right-hand column on wide screens. */}
        <aside className="hidden xl:col-start-2 xl:row-start-1 xl:block">
          <nav aria-label="On this page" className="sticky top-24 border-l border-rule pl-5">
            <p className="mb-3 text-sm font-semibold">On this page</p>
            {tocList}
          </nav>
        </aside>
      </main>
    </>
  );
}
