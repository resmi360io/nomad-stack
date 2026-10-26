import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RATE_PAGES } from '@/data/ratePages';
import { CORRIDORS } from '@/data/corridors';
import { PROVIDERS } from '@/data/providers';
import { fetchRatesServer } from '@/lib/fetchRates';
import { calculate } from '@/lib/calculate';
import type { CountryCode, Currency } from '@/data/providers';

export const revalidate = 3600;

const getRates = cache(fetchRatesServer);

export async function generateStaticParams() {
  return RATE_PAGES.map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const page = RATE_PAGES.find((p) => p.slug === pair);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/rates/${page.slug}` },
  };
}

// Three sizes rather than one. A percentage fee and a flat fee rank differently at different
// amounts, and this query is typed by people moving anything from a small marketplace payout to a
// month of invoices, so a single modelled amount would mislead most of them.
const AMOUNTS = [500, 1000, 5000];

function fmt(n: number, currency: string): string {
  if (!isFinite(n)) return 'n/a';
  const decimals = ['PKR', 'IDR', 'THB', 'MXN', 'BDT', 'NGN', 'PHP', 'INR', 'COP', 'UZS', 'ARS', 'UAH'].includes(currency)
    ? 0
    : 2;
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default async function RatePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const page = RATE_PAGES.find((p) => p.slug === pair);
  if (!page) notFound();

  const corridor = CORRIDORS.find((c) => c.slug === page.corridorSlug);
  const provider = PROVIDERS.find((p) => p.slug === page.providerSlug);
  if (!corridor || !provider) notFound();

  const ratesResult = await getRates();
  const mid =
    ratesResult && ratesResult.rates[page.destination] / ratesResult.rates[page.source];

  // Reuse calculate() rather than re-deriving the fee math here. If the corridor's fee row moves,
  // this page moves with it, which is the whole reason the rotation can be trusted to keep it
  // honest. Filtering to one provider is the only difference from the corridor table.
  const rows = ratesResult
    ? AMOUNTS.map((amount) => {
        const quotes = calculate(
          corridor.sourceCountry as CountryCode,
          corridor.destCountry as CountryCode,
          page.destination,
          amount,
          PROVIDERS,
          ratesResult.rates,
        );
        const q = quotes.find((x) => x.provider.slug === page.providerSlug);
        if (!q) return null;
        // All-in cost measured against the mid rate, not read off effectiveFeePercent, which
        // counts only the explicit fee and would have reported 1% on a row that really costs
        // about 3.6% once the FX markup is included.
        const atMid = amount * (ratesResult.rates[page.destination] / ratesResult.rates[page.source]);
        const allInPct = atMid > 0 ? (1 - q.netReceivedInDest / atMid) * 100 : NaN;
        return { amount, q, allInPct };
      }).filter((r): r is { amount: number; q: NonNullable<ReturnType<typeof calculate>[number]>; allInPct: number } => r !== null)
    : [];

  const ctaHref = provider.affiliateLink || provider.signupUrl || provider.website;
  const isAffiliate = !!provider.affiliateLink;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.metaDescription,
        datePublished: `${page.publishedDate}T00:00:00+00:00`,
        dateModified: `${page.updatedDate}T00:00:00+00:00`,
        author: { '@type': 'Person', name: 'George I.', url: 'https://paidacross.com/about/author' },
        publisher: { '@type': 'Organization', name: 'Paid Across', url: 'https://paidacross.com' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://paidacross.com/rates/${page.slug}` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Paid Across', item: 'https://paidacross.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Receive ${page.source} in ${page.country}`,
            item: `https://paidacross.com/receive/${corridor.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.h1,
            item: `https://paidacross.com/rates/${page.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">
            Paid Across
          </Link>
          {' / '}
          <Link
            href={`/receive/${corridor.slug}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Receive {page.source} in {page.country}
          </Link>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight">{page.h1}</h1>

        <p className="mt-6 text-base leading-relaxed">{page.intro}</p>

        <section className="mt-10 rounded-lg border p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Mid-market rate today
          </h2>
          {mid && ratesResult ? (
            <>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                1 {page.source} = {mid.toFixed(2)} {page.destination}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Published {ratesResult.rateDate} by open.er-api.com. This page refreshes hourly.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Live rate unavailable right now. The fee structure below does not depend on it.
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed">{page.rateNote}</p>
        </section>

        {rows.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">
              What {provider.name} actually pays into a {page.country} bank account
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  {provider.name} {page.source} to {page.destination} net amounts at three invoice
                  sizes
                </caption>
                <thead>
                  <tr className="border-b text-left">
                    <th scope="col" className="py-2 pr-4 font-medium">You invoice</th>
                    <th scope="col" className="py-2 pr-4 font-medium">You receive ({page.destination})</th>
                    <th scope="col" className="py-2 pr-4 font-medium">All-in cost vs mid</th>
                    <th scope="col" className="py-2 font-medium">Your rate per {page.source}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ amount, q, allInPct }) => (
                    <tr key={amount} className="border-b last:border-0">
                      <td className="py-2 pr-4 tabular-nums">
                        ${amount.toLocaleString('en-US')}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {fmt(q.netReceivedInDest, page.destination)}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">
                        {isFinite(allInPct) ? `${allInPct.toFixed(2)}%` : 'n/a'}
                        {q.isEstimate ? <span className="text-muted-foreground"> (est.)</span> : null}
                      </td>
                      <td className="py-2 tabular-nums">
                        {(q.netReceivedInDest / amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              All-in cost is measured against the mid rate above, so it includes both the explicit
              fee and the margin taken inside the conversion. Your rate per {page.source} is the
              same figure expressed the way your bank statement will show it. Rows marked est. use
              the midpoint of a cost {provider.name} publishes only as a range, so treat them as
              the middle of a band rather than a quote.
            </p>
          </section>
        )}

        <section className="mt-10 rounded-lg border border-dashed p-5">
          <p className="text-sm leading-relaxed">
            This page covers one provider. For the full comparison of everything that can get{' '}
            {page.source} into {page.country}, ranked by what actually lands,{' '}
            <Link
              href={`/receive/${corridor.slug}`}
              className="font-medium underline underline-offset-2"
            >
              read the {page.country} corridor page
            </Link>
            . It shows where {provider.name} places against every alternative we could price.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel={isAffiliate ? 'sponsored nofollow noopener' : 'nofollow noopener'}
            className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Open {provider.name}
            {isAffiliate && (
              <span
                className="rounded bg-muted px-1 text-xs"
                aria-label="Affiliate link"
                title="We may earn a commission if you sign up"
              >
                AD
              </span>
            )}
          </a>
          {!isAffiliate && (
            <p className="mt-2 text-xs text-muted-foreground">
              We earn nothing if you open {provider.name}. We have no affiliate relationship with
              them, which is worth knowing when you read a recommendation anywhere.
            </p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">Questions people ask about this rate</h2>
          <dl className="mt-4 space-y-6">
            {page.faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
          <p>
            Fee figures last checked {provider.lastVerified}. Page updated {page.updatedDate}. Our{' '}
            <Link href="/how-we-make-money" className="underline underline-offset-2">
              methodology and how we make money
            </Link>{' '}
            explains how these numbers are sourced and ranked.
          </p>
        </footer>
      </article>
    </>
  );
}
