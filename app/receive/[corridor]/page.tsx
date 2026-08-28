import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CORRIDORS } from '@/data/corridors';
import { fetchRatesServer } from '@/lib/fetchRates';
import { PROVIDERS } from '@/data/providers';
import { calculate } from '@/lib/calculate';
import type { CountryCode, Currency } from '@/data/providers';
import { Calculator } from '@/components/Calculator';

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
  if (!isFinite(n)) return '—';
  const decimals = ['IDR', 'PKR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP'].includes(currency) ? 0 : 2;
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

  const quotes =
    ratesResult
      ? calculate(
          corridor.sourceCountry as CountryCode,
          corridor.destCountry as CountryCode,
          corridor.destination as Currency,
          1000,
          PROVIDERS,
          ratesResult.rates,
        )
      : null;

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

  const availableProviders = corridor.providers.filter((p) => p.available);
  const unavailableProviders = corridor.providers.filter((p) => !p.available);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12 space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/receive-international-payments" className="hover:text-foreground">Receiving international payments</Link></li>
              <li aria-hidden="true">›</li>
              <li className="text-foreground">{corridor.country}</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            {corridor.h1}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {corridor.intro}
          </p>
          <p className="text-xs text-muted-foreground">
            By{' '}
            <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
              George I.
            </Link>
            {' · '}
            Last updated:{' '}
            <time dateTime={corridor.updatedDate}>{formatIsoDate(corridor.updatedDate)}</time>
          </p>
        </header>

        {/* Calculator widget */}
        <section aria-label="Payment cost calculator">
          <h2 className="text-xl font-semibold mb-4">Calculate your own transfer</h2>
          <div style={{ minHeight: '320px' }}>
            <Calculator
              defaultSrc={corridor.sourceCountry as CountryCode}
              defaultDest={corridor.destCountry as CountryCode}
            />
          </div>
        </section>

        {/* Comparison table */}
        {quotes && quotes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-1">
              Provider comparison: receiving $1,000 USD in {corridor.country}
            </h2>
            {ratesResult && (
              <p className="text-xs text-muted-foreground mb-4">
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
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Provider comparison: receiving $1,000 USD in {corridor.country},
                  ranked by net received
                </caption>
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                    <th scope="col" className="px-4 py-2.5">Provider</th>
                    <th scope="col" className="px-4 py-2.5">Net received ({corridor.destination})</th>
                    <th scope="col" className="px-4 py-2.5">Effective fee</th>
                    <th scope="col" className="px-4 py-2.5">FX margin</th>
                    <th scope="col" className="px-4 py-2.5">Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q, i) => (
                    <tr
                      key={q.provider.slug}
                      className={i < quotes!.length - 1 ? 'border-b' : ''}
                    >
                      <td className="px-4 py-3 font-medium">{q.provider.name}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">
                        {formatAmount(q.netReceivedInDest, corridor.destination)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {q.effectiveFeePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {q.fxMarkupBps === 0
                          ? 'Mid-market'
                          : `+${(q.fxMarkupBps / 100).toFixed(1)}%`}
                        {q.isEstimate && (
                          <span className="ml-1 not-italic text-muted-foreground/70">
                            (est.)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatHours(q.timeHours)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Live rates unavailable: say so rather than silently dropping the table */}
        {!quotes && (
          <section>
            <h2 className="text-xl font-semibold mb-1">
              Provider comparison: receiving $1,000 USD in {corridor.country}
            </h2>
            <div className="rounded-xl border bg-muted/30 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                We could not reach our exchange-rate source when this page was last generated, so
                the ranked comparison is not shown. The provider fees below are unaffected and
                still current. Use the calculator above, which fetches rates in your browser, or
                reload in a little while: this page refreshes hourly.
              </p>
            </div>
          </section>
        )}

        {/* Available provider deep-dives */}
        {availableProviders.map((p) => (
          <section key={p.slug}>
            <h2 className="text-xl font-semibold mb-2">
              {p.customHeading ?? `How much does ${p.name} charge to receive ${corridor.source} in ${corridor.country}?`}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{p.notes}</p>
          </section>
        ))}

        {/* Unavailable providers */}
        {unavailableProviders.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Providers not available in {corridor.country}
            </h2>
            <div className="space-y-4">
              {unavailableProviders.map((p) => (
                <div key={p.slug} className="rounded-lg border border-muted bg-muted/20 px-4 py-3">
                  <p className="font-medium text-sm mb-1">{p.name}: not available</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Methodology */}
        <section className="rounded-xl border bg-muted/30 px-6 py-5">
          <h2 className="text-base font-semibold mb-2">How we calculate these figures</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
          <p className="text-xs text-muted-foreground mt-3">
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
            <h2 className="text-xl font-semibold mb-5">Frequently asked questions</h2>
            <div className="space-y-6">
              {corridor.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-1.5">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Author byline */}
        <div className="border-t pt-5 text-xs text-muted-foreground space-y-1">
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
          <h2 className="text-base font-semibold mb-3">Related guides</h2>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                href="/receive-international-payments"
                className="underline underline-offset-2 hover:text-foreground"
              >
                How freelancers receive international payments: country-by-country guide 2026
              </Link>
            </li>
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
      </main>
    </>
  );
}
