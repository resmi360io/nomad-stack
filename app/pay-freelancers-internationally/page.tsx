import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { CorridorTable } from '@/components/CorridorTable';
import { PROVIDERS } from '@/data/providers';
import { fetchRatesServer } from '@/lib/fetchRates';

export const revalidate = 3600;

const getRates = cache(fetchRatesServer);

// The sender side. GSC showed "pay freelancers internationally", "paying overseas freelancers"
// and "pay freelancers overseas" arriving at the receive pillar at positions 62 to 68, about 520
// impressions a quarter, with nothing on the site written for them. Every claim here is drawn
// from the corridor data, so when a corridor page changes, check this page says the same thing.
export const metadata: Metadata = {
  title: { absolute: 'How to pay freelancers internationally: real costs' },
  description:
    'Paying overseas freelancers? What a wire, Wise, Payoneer and PayPal cost you, what they cost your freelancer, and how to pay so more of the invoice arrives.',
  alternates: { canonical: '/pay-freelancers-internationally' },
  openGraph: {
    title: 'How to pay freelancers internationally: real costs',
    description:
      'What each way of paying an overseas freelancer costs you, and what it costs them.',
    url: '/pay-freelancers-internationally',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paidacross.com/pay-freelancers-internationally#article',
      headline: 'How to pay freelancers internationally without shrinking their invoice',
      datePublished: '2026-10-26T00:00:00+00:00',
      dateModified: '2026-10-29T00:00:00+00:00',
      url: 'https://paidacross.com/pay-freelancers-internationally',
      image: 'https://paidacross.com/opengraph-image',
      author: { '@type': 'Person', name: 'George I.', url: 'https://paidacross.com/about/author' },
      publisher: { '@id': 'https://paidacross.com/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paidacross.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Paying freelancers internationally',
          item: 'https://paidacross.com/pay-freelancers-internationally',
        },
      ],
    },
  ],
};

const P = 'pa-prose';

export default async function PayFreelancersPage() {
  const rates = await getRates();
  const wise = PROVIDERS.find((p) => p.slug === 'wise');
  const wiseLink = wise?.affiliateLink || wise?.signupUrl || 'https://wise.com';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <main id="main-content" className="pa-read space-y-14 pt-8 pb-4 sm:pt-12">
        <header className="space-y-5">
          <h1 className="pa-h1">
            How to pay freelancers internationally without shrinking their invoice
          </h1>
          <p className="pa-intro">
            When you pay a freelancer overseas, two bills get paid: the fee your side is charged,
            and whatever disappears between your account and theirs. The second is usually
            bigger, and you never see it. A $1,000 invoice can arrive as $995 or as about $920
            depending on how you send it. This page is about choosing the way that leaves your
            freelancer with the most, without making it expensive or awkward for you.
          </p>
          <p className="pa-meta">
            By{' '}
            <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
              George I.
            </Link>
            {' · '}
            Published October 26, 2026, updated October 29, 2026
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="pa-h2">Start by asking what details they have</h2>
          <p className={P}>
            The cheapest way to pay depends almost entirely on what your freelancer can give you,
            so ask before you set anything up.
          </p>
          <p className={P}>
            Many freelancers have a US routing number and account number through Wise, Payoneer
            or a local service such as Raenest or Cleva in Nigeria. If yours does, pay them by ordinary
            ACH from your US business account, the same way you would pay a domestic supplier. It
            usually costs you nothing and arrives in a couple of business days. Whatever it costs
            them to convert afterwards is between them and their provider.
          </p>
          <p className={P}>
            If all they have is a local bank account, send money in their currency, not in
            dollars. A service like Wise lets you pay in dollars and deliver naira or Philippine pesos
            straight into their local bank account at the mid-market rate. You pay
            a fee you can see before you confirm, and nothing comes off on their side. Check the details for each country, though. Wise says it is currently unable to send
            business payments to Pakistani rupees and cannot send business transfers to Bangladeshi
            taka, so a company paying a freelancer in Pakistan or Bangladesh cannot use it there,
            and our Pakistan and Bangladesh pages cover what to do instead.
          </p>
          <p className={P}>
            If you hired through Upwork or Fiverr, pay through the platform. Its fees are set and you
            have no cheaper option inside it. Your freelancer then withdraws using whatever the
            platform offers, and that is where most of their cost sits.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">What each way of paying costs, and who pays it</h2>
          <div className="space-y-7 pa-prose">
            <div>
              <h3 className="pa-h3 mb-2">ACH to US account details</h3>
              <p>
                Usually free for you. Your freelancer pays their provider&apos;s conversion cost
                when they move the money home. With Wise that is a small visible fee at the
                mid-market rate. With Payoneer it is 1% on arrival and then a conversion cost
                Payoneer gives as a range of 1.2% to 4%, about 3.6% in total in our model.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Wise, sent in their currency</h3>
              <p>
                You pay Wise&apos;s fee, shown before you send. Wise converts at the mid-market rate
                and your freelancer receives the full local amount. For a direct client this is
                often the best deal for both sides, and it is the route we point clients to on
                several of our country pages.
              </p>
              <a
                href={wiseLink}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="mt-3 inline-flex h-10 items-center gap-2 rounded border border-input bg-sheet px-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
              >
                Pay with Wise
                <span className="rounded-[2px] border border-current px-1 text-[10px] leading-4 opacity-70" aria-label="Affiliate link">AD</span>
              </a>
              <p className="pa-meta mt-2">
                We earn a commission if you sign up through this link. It never changes the order
                of any table on this site.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">International wire (SWIFT)</h3>
              <p>
                The expensive default. A US bank usually charges $25 to $45 to send one, an
                intermediary bank can take a cut along the way, and your freelancer&apos;s bank
                converts at its own rate. If you have to wire, ask your bank to send it with all
                charges paid by you (many banks call this option OUR), so the invoice arrives
                whole. For a large one-off payment a wire is fine. For a monthly retainer it adds
                up.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">PayPal</h3>
              <p>
                Easy for you, expensive for them. On a cross-border business payment PayPal takes
                roughly 2.9% to 5.4% plus a fixed amount from your freelancer, then around 3% more
                to convert, depending on their country. A freelancer in Pakistan or Bangladesh
                cannot receive business payments through PayPal at all.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Remittance apps</h3>
              <p>
                Western Union, Remitly and similar apps can look cheap, but they are priced and
                set up for people sending money to family. In some countries that matters for tax.
                A Pakistani IT exporter registered with the Pakistan Software Export Board pays a
                0.25% final tax on export income, but only on money recorded as an export of
                services through banking channels, and a family remittance does not count. Paying
                that way can cost your freelancer more than any fee you saved.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Small things that help your freelancer</h2>
          <ul className="pa-prose list-disc space-y-3 pl-5 marker:text-rule">
            <li>
              Pay in their currency or to their US details, never as a dollar wire to a local
              bank account unless they ask for it.
            </li>
            <li>
              Write a clear reference that says the payment is for services, with the invoice
              number. Banks in Pakistan and Bangladesh use this to classify the money, and the
              classification decides which tax rate or incentive your freelancer gets.
            </li>
            <li>
              Agree in the contract who covers transfer costs. &ldquo;Invoice amount, paid in
              full&rdquo; avoids an awkward conversation later.
            </li>
            <li>
              Keep to one method. Switching routes every month makes it harder for them to keep
              the paperwork their bank and tax office want.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="pa-h2 mb-5">What your freelancer&apos;s best route costs, by country</h2>
          <p className="pa-prose mb-5">
            This is the same table we show freelancers: the cheapest way we can price for them to
            receive $1,000 in each country, with the fee and the exchange rate margin both
            counted. Each country page has notes written for the person being paid, which is
            useful if you want to know what they will run into after you hit send.
          </p>
          <CorridorTable
            rates={rates}
            caption="For each country, the cheapest receiving route we can price on a $1,000 payment"
          />
          <p className="pa-meta mt-4 max-w-[75ch]">
            Est. means part of the cost is published only as a range and we used the middle. If
            you are the freelancer, our guide to{' '}
            <Link href="/receive-international-payments" className="underline underline-offset-2 hover:text-foreground">
              receiving international payments
            </Link>{' '}
            is written for you.
          </p>
        </section>

        <div className="pa-meta space-y-1.5 border-t border-rule pt-5">
          <p>
            Fees are estimates based on each provider&apos;s published pricing. Check with the
            provider before sending. Nothing on this site is financial or tax advice.{' '}
            <Link href="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
              How we make money
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
