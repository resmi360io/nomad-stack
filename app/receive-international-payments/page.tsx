import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { CORRIDORS } from '@/data/corridors';

export const metadata: Metadata = {
  title: 'How freelancers receive international payments: country guide 2026',
  description:
    'Country-by-country cost guide: fees, FX spread, and the cheapest way to receive USD, GBP, or EUR from international clients. Wise, Payoneer, Western Union, bank wire compared.',
  alternates: {
    canonical: '/receive-international-payments',
  },
  openGraph: {
    title: 'How freelancers receive international payments: country-by-country cost guide 2026',
    description:
      'Country-by-country breakdown of what it really costs to receive international payments. Wise, Payoneer, Revolut, Western Union, bank wire — ranked by net received.',
    url: '/receive-international-payments',
    type: 'article',
  },
};

const pillarJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paidacross.com/receive-international-payments#article',
      headline:
        'How freelancers receive international payments: country-by-country cost guide 2026',
      datePublished: '2026-06-03',
      dateModified: '2026-06-03',
      url: 'https://paidacross.com/receive-international-payments',
      image: 'https://paidacross.com/opengraph-image',
      author: {
        '@type': 'Person',
        name: 'M. Reeves',
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
      ],
    },
  ],
};

export default function ReceiveInternationalPaymentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pillarJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12 space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            How freelancers receive international payments: country-by-country cost guide 2026
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The platform you use to receive international payments can cost you anywhere from
            0.5% to 8% of each invoice. On a single $5,000 invoice, that gap is about $375 —
            and on $5,000 of monthly freelance income, choosing the wrong option can cost you
            over $4,000 a year. This guide covers every major receiving corridor, what each
            provider actually charges, and which one comes out cheapest for your specific
            source and destination currency.
          </p>
          <p className="text-xs text-muted-foreground">
            By{' '}
            <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
              M. Reeves
            </Link>
            {' · '}
            Last updated: June 3, 2026
          </p>
        </header>

        {/* Calculator widget */}
        <section aria-label="Payment cost calculator">
          <h2 className="text-xl font-semibold mb-4">Calculate your transfer cost now</h2>
          <div style={{ minHeight: '320px' }}>
            <Calculator />
          </div>
        </section>

        {/* What drives the real cost */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What drives the real cost</h2>
          <p className="text-muted-foreground leading-relaxed">
            Most providers charge in two layers: a percentage fee on the payment (usually 0.5–4%)
            and an FX markup on the exchange rate (usually 0–5% above mid-market, but rarely
            disclosed as a line item). The total cost is the sum of both. A provider quoting
            &ldquo;no fee&rdquo; often makes it back in FX — and a provider with a visible 1% fee
            and a 0% FX markup can be cheaper than one with &ldquo;no fee&rdquo; and a 3% spread.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This calculator uses live mid-market rates and shows both the fee percentage and the
            FX markup separately, so you can see exactly where the cost comes from. The net
            received column is what actually lands in your account.
          </p>
        </section>

        {/* Corridor index */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Corridor-by-corridor cost guides</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Each guide covers which providers work for that corridor, the all-in cost as a
            percentage, a worked example, and provider-specific notes on restrictions and
            quirks.
          </p>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-2.5">Corridor</th>
                  <th className="px-4 py-2.5">Providers that work</th>
                  <th className="px-4 py-2.5">Cheapest option</th>
                </tr>
              </thead>
              <tbody>
                {CORRIDORS.map((corridor, i) => (
                  <tr
                    key={corridor.slug}
                    className={i < CORRIDORS.length - 1 ? 'border-b' : ''}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/receive/${corridor.slug}`}
                        className="font-medium underline underline-offset-2 hover:text-muted-foreground"
                      >
                        Receive {corridor.source} in {corridor.country}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {corridor.supportedProviders.length} providers
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link
                        href={`/receive/${corridor.slug}`}
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        See comparison →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Provider overviews */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">Provider overview</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Wise</h3>
              <p>
                Uses the real mid-market exchange rate with zero FX markup, charging only a
                transparent percentage fee (typically 0.4–1.4% depending on the corridor).
                Best overall for most corridors where it operates. Does not support Pakistan
                for account holders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Revolut</h3>
              <p>
                Standard plan charges 0.3% on SEPA corridors and $3 flat for SWIFT corridors.
                FX is at mid-market on weekdays within a $1,000/month allowance; weekends and
                over-allowance add 0.5–2% depending on the currency. Not available in Pakistan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Payoneer</h3>
              <p>
                1% receiving fee on most commercial payments, plus up to 2% FX markup on local
                currency withdrawals. The dominant solution for freelancers in Pakistan, India,
                Bangladesh, and other markets where Wise and Revolut are restricted. Works on
                most major freelance platforms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">PayPal</h3>
              <p>
                4.4% + $0.30 cross-border receiving fee, plus ~3.5% FX markup — making it the
                most expensive option in most corridors. Not supported for receiving in Pakistan.
                Convenience does not justify the cost for most freelancers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Western Union</h3>
              <p>
                Available in almost every country, including restricted markets. However, the
                FX spread on minor corridors (GEL, PKR) is typically 4–5% above mid-market,
                which makes it expensive compared to Payoneer for recurring payments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bank Wire (SWIFT)</h3>
              <p>
                Always available but expensive for small amounts due to flat fees ($25–45 from
                most US banks). Practical for large, infrequent payments over $5,000; not
                suitable for regular monthly invoices.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="rounded-xl border bg-muted/30 px-6 py-5">
          <h2 className="text-base font-semibold mb-2">Methodology</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every number in this guide and on the calculator is sourced from the provider&apos;s
            own public pricing page. Fee data is verified by date and source is linked.
            Exchange rates are live mid-market from{' '}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open.er-api.com
            </a>{' '}
            — no bank rates, no guesses. Provider ranking is determined entirely by net received
            amount after all fees and FX markup. There is no paid placement.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            <Link
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Fee data is open-source on GitHub
            </Link>{' '}
            — corrections with a source link are welcome.
          </p>
        </section>

        {/* Author + disclaimer */}
        <div className="border-t pt-5 text-xs text-muted-foreground space-y-1">
          <p>
            Written by{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              M. Reeves
            </Link>{' '}
            (20+ years in international payments). Last updated: June 3, 2026.
          </p>
          <p>
            Fees are estimates based on publicly available pricing. Verify with your provider
            before transferring. Nothing on this site is financial or tax advice.{' '}
            <Link
              href="/how-we-make-money"
              className="underline underline-offset-2 hover:text-foreground"
            >
              How we make money
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
