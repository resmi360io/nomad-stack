import type { Metadata } from 'next';
import Link from 'next/link';
import { PROVIDERS } from '@/data/providers';
import {
  AFFILIATE_STATUS,
  getLatestAffiliateUpdate,
  type AffiliateStatus,
} from '@/data/affiliate-status';

export const metadata: Metadata = {
  title: 'How we make money',
  description:
    'How Paid Across earns affiliate commissions, how provider rankings are decided by fee math alone, and how fee data is sourced and verified.',
  alternates: { canonical: '/how-we-make-money' },
  openGraph: {
    title: 'How we make money',
    description:
      'How Paid Across earns affiliate commissions, how provider rankings are decided by fee math alone, and how fee data is sourced and verified.',
    url: '/how-we-make-money',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How we make money',
    description:
      'How Paid Across earns affiliate commissions, how rankings are decided by fee math alone, and how fee data is verified.',
  },
};

const PAGE_UPDATED = '2026-08-13';

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://paidacross.com/how-we-make-money#page',
      name: 'How we make money: Paid Across',
      datePublished: '2026-06-03T00:00:00+00:00',
      dateModified: '2026-08-13T00:00:00+00:00',
      url: 'https://paidacross.com/how-we-make-money',
      description:
        'How Paid Across earns affiliate commissions, how provider rankings are decided by fee math alone, and how fee data is sourced and verified.',
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
          name: 'How we make money',
          item: 'https://paidacross.com/how-we-make-money',
        },
      ],
    },
  ],
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

const STATUS_DOT: Record<AffiliateStatus, string | null> = {
  pending: 'bg-gray-400',
  approved: 'bg-green-500',
  'personal-referral': 'bg-blue-500',
  'not-available': null,
};

export default function HowWeMakeMoney() {
  const nonAffiliateProviders = PROVIDERS
    .filter(p => !p.hasAffiliateProgram)
    .map(p => p.name);
  const affiliateTableLastUpdated = getLatestAffiliateUpdate();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto max-w-2xl px-4 py-12 space-y-10">

        {/* Top trust callout */}
        <div className="rounded-xl border bg-muted/40 px-5 py-4 text-sm leading-relaxed">
          <p className="font-semibold mb-1">Rankings are never for sale.</p>
          <p className="text-muted-foreground">
            Every provider is ranked purely by the net amount you receive after all fees and FX
            markup. No provider has paid for placement, a higher rank, or any editorial treatment.
            The fee data behind the ranking is{' '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open-source on GitHub
            </a>{' '}
            and anyone can audit or correct it.
          </p>
        </div>

        {/* Page header */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">How We Make Money</h1>
          <p className="text-xs text-muted-foreground">
            By{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              George I.
            </Link>
            {' · '}
            Last updated: {formatIsoDate(PAGE_UPDATED)}
          </p>
        </header>

        {/* Section 1: How we earn */}
        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">How this site earns money</h2>
          <p>
            This site is free to use. We earn money when readers sign up for certain providers
            through links on this site. Two providers can pay us for a signup, and both are
            disclosed here. <strong>Wise</strong> pays a commission through the Partnerize
            affiliate network when you click a Wise link here and open an account.{' '}
            <strong>GrabrFi</strong> is a personal referral link rather than a formal affiliate
            program, but we benefit either way: GrabrFi&apos;s referral program can pay us a bonus
            when someone signs up through our link and funds an account. Both links carry the
            same &ldquo;AD&rdquo; label on comparison cards. Neither adds any cost to you, and
            neither affects the rate you receive.
          </p>
          <p>
            Not every provider we list has an affiliate program, and we list and rank providers
            regardless.{' '}
            {nonAffiliateProviders.length > 0
              ? <>{nonAffiliateProviders.join(', ')} have no affiliate relationship with this site.</>
              : null
            }{' '}
            These providers appear in results and rankings on exactly the same fee-math basis
            as providers that do pay us. Several of the options we most frequently recommend for
            specific corridors (Cleva, Grey, LemFi, and Raenest for Nigeria; Payoneer for
            Pakistan and Bangladesh) pay us nothing.
          </p>
          <p>
            We have no paid placements and no sponsored rankings. No provider can pay to rank
            higher, appear in results, or be called &ldquo;best.&rdquo; The only way to rank
            first is to deliver the highest net received amount on that corridor at that transfer
            size, calculated from publicly available pricing data.
          </p>
        </section>

        {/* Section 2: How rankings work */}
        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">How rankings are decided</h2>
          <p>
            Every provider is ranked by a single number: the net amount you actually receive in
            your local currency after all costs. That cost has two components, which we show
            separately on every comparison card:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>
              <strong className="text-foreground">The visible fee.</strong> A flat amount or
              percentage stated on the provider&apos;s own pricing page.
            </li>
            <li>
              <strong className="text-foreground">The FX markup.</strong> The spread between
              the mid-market exchange rate (what interbank markets trade at) and the rate the
              provider actually applies to your transaction. This is rarely disclosed as a
              separate fee, but on a minor-currency corridor it is often 2-5% of the total
              transfer amount.
            </li>
          </ul>
          <p>
            The FX markup is frequently the larger of the two costs. A provider advertising
            &ldquo;no fee&rdquo; can cost you significantly more than one with a visible 1%
            fee and no FX spread. Our calculator shows both components separately so you can
            see exactly where the cost comes from and compare on a like-for-like basis.
          </p>
          <p>
            &ldquo;Best value&rdquo; on any corridor is the provider with the highest net
            received amount at the time of calculation, using a live mid-market rate from{' '}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open.er-api.com
            </a>{' '}
            refreshed hourly. Commercial relationships do not enter the calculation. Where a
            provider with no affiliate deal gives you more money than one that pays us a
            commission, the non-affiliate provider ranks first. On most corridors we cover, the
            cheapest option currently has no affiliate relationship with us.
          </p>
        </section>

        {/* Section 3: Data verification */}
        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">How we verify the data</h2>
          <p>
            Every fee figure is sourced from the provider&apos;s own official pricing page or
            help center before publishing. We do not use aggregators, press releases, or
            estimates. Corridor-specific regulations (such as central-bank rules on receiving
            channels or mandatory local-currency conversion requirements) are checked against
            official primary sources where available.
          </p>
          <p>
            Fee data is re-verified periodically, because rates, FX markup policies, and
            corridor rules change frequently. Each provider card on the comparison pages shows a
            &ldquo;fees verified&rdquo; date. When a figure is volatile or likely to have
            changed between verification cycles, we add a &ldquo;verify current&rdquo; note
            in the text rather than stating the number with false precision.
          </p>
          <p>
            When we find an error, or when a reader flags one, we correct it and update the
            verified date. The underlying fee data is{' '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open-source on GitHub
            </a>
            . Corrections submitted with a source link are reviewed and applied promptly. For
            a site covering people&apos;s actual income, a wrong number is worse than a missing
            one.
          </p>
        </section>

        {/* Section 4: Affiliate disclosure — anchor target for corridor-page links */}
        <section
          id="affiliate-disclosure"
          className="rounded-xl border bg-muted/30 px-6 py-5 space-y-3 text-sm leading-relaxed"
        >
          <h2 className="text-base font-semibold">Affiliate disclosure</h2>
          <p>
            Some links on paidacross.com are affiliate or referral links. If you click one and
            sign up for the provider, we may earn a commission or a referral bonus. Either way it
            is paid by the provider, not by you, and it does not increase the cost you pay for
            the service.
          </p>
          <p>
            Affiliate and referral links on this site are identified by a small
            &ldquo;AD&rdquo; label next to the button on comparison cards. Links without the
            label earn us nothing.
          </p>
          <p>
            Affiliate and referral relationships do not affect rankings, recommendations, or
            any editorial content on this site. Providers are ranked by the net received amount after all fees
            and FX markup, calculated identically regardless of whether a commercial relationship
            exists. A full list of every commercial relationship and its current status is in the
            table below.
          </p>
          <p className="text-xs text-muted-foreground">
            This disclosure applies to the entire paidacross.com domain and is intended to
            satisfy the FTC Endorsement Guides (16 C.F.R. Part 255) and equivalent UK and EU
            disclosure requirements.
          </p>
        </section>

        {/* Affiliate status table */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Affiliate program status</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every commercial relationship is disclosed in this table and updated as statuses
            change. Last updated: {formatIsoDate(affiliateTableLastUpdated)}.
          </p>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-2.5">Provider</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Last updated</th>
                </tr>
              </thead>
              <tbody>
                {AFFILIATE_STATUS.map((entry, i) => {
                  const dot = STATUS_DOT[entry.status];
                  return (
                    <tr
                      key={entry.provider}
                      className={i < AFFILIATE_STATUS.length - 1 ? 'border-b' : ''}
                    >
                      <td className="px-4 py-3 font-medium">{entry.provider}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="flex items-center gap-2">
                          {dot && (
                            <span
                              aria-hidden="true"
                              className={`inline-block size-2 shrink-0 rounded-full ${dot}`}
                            />
                          )}
                          <span>
                            {entry.statusLabel}
                            {entry.platform ? ` (${entry.platform})` : ''}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.lastUpdated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {nonAffiliateProviders.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Providers with no affiliate program that appear in results:{' '}
              {nonAffiliateProviders.join(', ')}. These are ranked by fee math alone.
            </p>
          )}
        </section>

        {/* Section 5: Author and contact */}
        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">About the author and contact</h2>
          <p>
            This site is researched and maintained by{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              George I.
            </Link>
            , with 20+ years in international payments and transaction banking. The methodology,
            data sourcing standards, and editorial approach are described in detail on the{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              author page
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            To report a fee error, flag an outdated figure, or suggest a corridor to cover,
            open an issue on{' '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              GitHub
            </a>
            . Fee corrections submitted with a source link will be reviewed and applied quickly.
            Nothing on this site is financial or tax advice.
          </p>
        </section>

        {/* Page footer */}
        <div className="border-t pt-5 text-xs text-muted-foreground space-y-1">
          <p>
            Written by{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              George I.
            </Link>{' '}
            Last updated: {formatIsoDate(PAGE_UPDATED)}.
          </p>
          <p>
            Fees are estimates based on publicly available pricing. Verify with your provider
            before transferring.{' '}
            <Link
              href="/receive-international-payments"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Country-by-country cost guides
            </Link>
            .
          </p>
        </div>

      </main>
    </>
  );
}
