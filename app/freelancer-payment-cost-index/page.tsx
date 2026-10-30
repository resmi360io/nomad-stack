import type { Metadata } from 'next';
import Link from 'next/link';
import edition from '@/data/cost-index/2026-10.json';

// The cost index: one frozen edition of what a 1,000 USD payment from a US client becomes in every
// corridor, priced by calculate() at a fixed rate snapshot (scripts/cost-index.ts). The numbers on this
// page never move on their own: a later fee correction goes into the next edition, not into this one.
const AMOUNT = 1000;
const PUBLISHED = '2026-10-30';
const URL = 'https://paidacross.com/freelancer-payment-cost-index';

const rows = edition.corridors.map((c) => {
  const a = c.amounts.find((x) => x.amount === AMOUNT)!;
  return { slug: c.slug, country: c.country, currency: c.currency, ranked: a.ranked, gap: a.gapUsd };
});
const wide = rows.filter((r) => r.gap !== null && r.gap >= 50);
const widest = rows.reduce((m, r) => ((r.gap ?? 0) > (m.gap ?? 0) ? r : m));
const minWide = Math.min(...wide.map((r) => r.gap!));
const maxWide = Math.max(...wide.map((r) => r.gap!));
const rateDay = new Date(edition.rateDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const pct = (n: number) => `${n.toFixed(2)}%`;
const usd = (n: number) => `${n.toFixed(2)} USD`;

const title = 'What freelancers lose getting paid: the cost index';
const description = `Receiving 1,000 USD in ${rows.length} countries: the cheapest and dearest ranked routes differ by up to ${usd(widest.gap!)}. Priced at ${rateDay} rates; CSV free to cite.`;

export const metadata: Metadata = {
  title: { absolute: 'Freelancer payment cost index: 17 countries (Oct 2026)' },
  description,
  alternates: { canonical: '/freelancer-payment-cost-index' },
  openGraph: { title, description, url: '/freelancer-payment-cost-index', type: 'article' },
  twitter: { card: 'summary_large_image', title, description },
};

const P = 'pa-prose';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dataset',
      '@id': `${URL}#dataset`,
      name: `Freelancer payment cost index, ${edition.edition} edition`,
      description,
      url: URL,
      temporalCoverage: edition.rateDate ? new Date(edition.rateDate).toISOString().slice(0, 10) : undefined,
      datePublished: `${PUBLISHED}T00:00:00+00:00`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      version: edition.edition,
      creator: { '@type': 'Person', name: 'George I.', url: 'https://paidacross.com/about/author' },
      publisher: { '@id': 'https://paidacross.com/#organization' },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: `${URL}/${edition.edition}.csv`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paidacross.com' },
        { '@type': 'ListItem', position: 2, name: 'Freelancer payment cost index', item: URL },
      ],
    },
  ],
};

export default function CostIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <main id="main-content" className="pa-read space-y-14 pt-8 pb-4 sm:pt-12">
        <header className="space-y-5">
          <h1 className="pa-h1">What freelancers lose getting paid: receiving 1,000 USD in {rows.length} countries</h1>
          <p className="pa-intro">
            In {wide.length} of the {rows.length} countries we cover, the cheapest and the dearest ranked way to
            receive a 1,000 USD payment from a US client differ by {Math.floor(minWide)} to {Math.ceil(maxWide)} USD.{' '}
            {widest.country} has the widest gap, {usd(widest.gap!)}. These are the October 2026 figures,
            priced by our calculator at the exchange rates of {rateDay}, and every number below can be
            reproduced from the data file at the end of this page.
          </p>
          <p className="pa-meta">
            By{' '}
            <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
              George I.
            </Link>
            {' · '}Edition {edition.edition}, published 30 October 2026
          </p>
        </header>

        <section className="space-y-5">
          <h2 className="pa-h2">1,000 USD from a US client, country by country</h2>
          <div className="pa-table-wrap">
            <table className="w-full text-[0.875rem] sm:text-[0.9375rem]">
              <caption className="sr-only">
                Cheapest and dearest ranked way to receive 1,000 USD in each country, and the difference in US dollars
              </caption>
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-4 py-2.5">Country</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Routes ranked</th>
                  <th scope="col" className="px-4 py-2.5">Cheapest ranked route</th>
                  <th scope="col" className="px-4 py-2.5">Dearest ranked route</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Difference</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const best = r.ranked[0];
                  const worst = r.ranked[r.ranked.length - 1];
                  return (
                    <tr key={r.slug}>
                      <td className="px-4 py-2.5 sm:whitespace-nowrap">
                        <Link
                          href={`/receive/${r.slug}`}
                          className="font-semibold text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
                        >
                          {r.country.replace(/^the /, '')}
                        </Link>
                      </td>
                      <td className="pa-figure px-4 py-2.5 text-right text-muted-foreground">{r.ranked.length}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {best.provider}, {pct(best.totalCostPercent)}
                        {best.costEstimated ? ' (est.)' : ''}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {worst.provider}, {pct(worst.totalCostPercent)}
                        {worst.costEstimated ? ' (est.)' : ''}
                      </td>
                      <td className="pa-figure px-4 py-2.5 text-right">{r.gap === null ? 'n/a' : usd(r.gap)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="pa-meta">
            Cost is everything you lose on the way: the provider&apos;s fees plus the gap between the rate you
            are given and the mid-market rate. &ldquo;(est.)&rdquo; marks a route where part of the cost is our
            estimate rather than a figure the provider publishes, for example the middle of a published range,
            so that route&apos;s total, and any difference it feeds into, is an estimate too.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">How to read it</h2>
          <p className={P}>
            The difference column is the money a freelancer keeps or loses on one 1,000 USD payment purely by
            choosing a route. In Uzbekistan, Bangladesh and Pakistan we can rank only two routes, so a small
            gap there means less to choose between rather than more competition. Each country name opens its
            full page, which prices these routes at any amount and explains the routes the table leaves out.
          </p>
          <p className={P}>
            A route is ranked only when its price is comparable. Routes that may not exist, that are priced as
            family remittances rather than for client invoices, or that carry a charge we cannot price are left
            out of this table and shown separately, with the reason, on each country page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Method</h2>
          <p className={P}>
            Every figure comes from the same calculator as the rest of this site, run once over each
            provider&apos;s fees, taken from its own pages where it publishes them and estimated where it does
            not, at a single set of mid-market exchange rates from{' '}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open.er-api.com
            </a>{' '}
            ({rateDay}). The fee data is checked against providers&apos; own pages by a weekly fact-checking
            process, and the calculator and the data are{' '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open source
            </a>
            . This edition is frozen: when a fee changes, the country pages update and the next edition of
            the index records it.
          </p>
        </section>

        <section className="pa-note space-y-3 px-5 py-6 sm:px-7">
          <h2 className="pa-h3">Use the data</h2>
          <p className="max-w-[65ch] text-[0.9375rem] text-muted-foreground leading-relaxed">
            Download every country at 500, 1,000 and 5,000 USD, with every ranked route:{' '}
            <a href={`/freelancer-payment-cost-index/${edition.edition}.csv`} className="underline underline-offset-2 hover:text-foreground">
              {edition.edition}.csv
            </a>
            . The data is licensed under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              CC BY 4.0
            </a>
            , so you can quote and reuse it with credit. Please cite it as: Paid Across, Freelancer payment cost index,
            edition {edition.edition}, rates of {rateDay}, paidacross.com/freelancer-payment-cost-index.
          </p>
        </section>

        <div className="pa-meta space-y-1.5 border-t border-rule pt-5">
          <p>
            Fees are estimates based on publicly available pricing. Verify with your provider before
            transferring. Nothing on this site is financial or tax advice. Some providers pay us when you sign up
            through our links, and none of them can change the order:{' '}
            <Link href="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
              how we make money
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
