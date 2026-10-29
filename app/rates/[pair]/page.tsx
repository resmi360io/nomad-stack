import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { splitParagraphs } from '@/lib/paragraphs';
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

      <main id="main-content" className="pa-read pt-8 pb-4 sm:pt-12">
        <article>
          <nav className="pa-meta mb-6">
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

          <h1 className="pa-h1">{page.h1}</h1>

          <div className="pa-intro mt-5 space-y-3">
            {splitParagraphs(page.intro).map((t, i) => <p key={i}>{t}</p>)}
          </div>

          {/* The one figure this page exists to show, on the raised surface. */}
          <section className="pa-card mt-8">
            <div className="px-5 py-5 sm:px-6">
              <h2 className="text-[0.9375rem] font-semibold text-muted-foreground">
                Mid-market rate today
              </h2>
              {mid && ratesResult ? (
                <>
                  <p className="pa-figure-display mt-2 text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] leading-tight">
                    1 {page.source} = {mid.toFixed(2)} {page.destination}
                  </p>
                  <p className="pa-meta mt-2">
                    Published {ratesResult.rateDate} by open.er-api.com. This page refreshes hourly.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Live rate unavailable right now. The fee structure below does not depend on it.
                </p>
              )}
              <div className="mt-4 max-w-[65ch] space-y-3 text-[0.9375rem] leading-relaxed">
                {splitParagraphs(page.rateNote).map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </div>
          </section>

          {rows.length > 0 && (
            <section className="mt-14">
              <h2 className="pa-h2">
                What {provider.name} actually pays into a {page.country} bank account
              </h2>
              <div className="pa-table-wrap mt-5">
                <table className="w-full border-collapse text-[0.9375rem]">
                  <caption className="sr-only">
                    {provider.name} {page.source} to {page.destination} net amounts at three invoice
                    sizes
                  </caption>
                  <thead>
                    <tr className="text-right">
                      <th scope="col" className="px-4 py-3 text-left">You invoice</th>
                      <th scope="col" className="px-4 py-3">You receive ({page.destination})</th>
                      <th scope="col" className="px-4 py-3">All-in cost vs mid</th>
                      <th scope="col" className="px-4 py-3">Your rate per {page.source}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ amount, q, allInPct }) => (
                      <tr key={amount} className="text-right">
                        <td className="pa-figure px-4 py-3 text-left">
                          ${amount.toLocaleString('en-US')}
                        </td>
                        <td className="pa-figure px-4 py-3 font-semibold whitespace-nowrap">
                          {fmt(q.netReceivedInDest, page.destination)}
                        </td>
                        <td className="pa-figure px-4 py-3 whitespace-nowrap">
                          {isFinite(allInPct) ? `${allInPct.toFixed(2)}%` : 'n/a'}
                          {q.isEstimate ? <span className="font-sans text-muted-foreground [font-variant-numeric:normal]"> (est.)</span> : null}
                        </td>
                        <td className="pa-figure px-4 py-3">
                          {(q.netReceivedInDest / amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="pa-meta mt-4 max-w-[75ch]">
                All-in cost is measured against the mid rate above, so it includes both the explicit
                fee and the margin taken inside the conversion. Your rate per {page.source} is the
                same figure expressed the way your bank statement will show it. Rows marked est. use
                the midpoint of a cost {provider.name} publishes only as a range, so treat them as
                the middle of a band rather than a quote.
              </p>
            </section>
          )}

          <section className="pa-note mt-14 px-5 py-6 sm:px-7">
            <p className="max-w-[65ch] text-[0.9375rem] leading-relaxed">
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
              className="mt-5 inline-flex h-11 items-center gap-2 rounded border border-primary bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open {provider.name}
              {isAffiliate && (
                <span
                  className="rounded-[2px] border border-current px-1 text-[10px] leading-4 opacity-80"
                  aria-label="Affiliate link"
                  title="We may earn a commission if you sign up"
                >
                  AD
                </span>
              )}
            </a>
            {!isAffiliate && (
              <p className="pa-meta mt-3">
                We earn nothing if you open {provider.name}. We have no affiliate relationship with
                them, which is worth knowing when you read a recommendation anywhere.
              </p>
            )}
          </section>

          <section className="mt-14">
            <h2 className="pa-h2">Questions people ask about this rate</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {page.faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="pa-h3">{f.q}</dt>
                  <dd className="pa-prose mt-2 space-y-3">
                  {splitParagraphs(f.a).map((t, i) => <p key={i}>{t}</p>)}
                </dd>
                </div>
              ))}
            </dl>
          </section>

          <footer className="pa-meta mt-12 border-t border-rule pt-5">
            <p>
              Fee figures last checked {provider.lastVerified}. Page updated {page.updatedDate}. Our{' '}
              <Link href="/how-we-make-money" className="underline underline-offset-2">
                methodology and how we make money
              </Link>{' '}
              explains how these numbers are sourced and ranked.
            </p>
          </footer>
        </article>
      </main>
    </>
  );
}
