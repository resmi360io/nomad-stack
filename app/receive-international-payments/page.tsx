import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { Calculator } from '@/components/Calculator';
import { CorridorTable } from '@/components/CorridorTable';
import { fetchRatesServer } from '@/lib/fetchRates';
import { CORRIDORS } from '@/data/corridors';
import { PROVIDERS } from '@/data/providers';

export const revalidate = 3600;

const getRates = cache(fetchRatesServer);

// Receive intent only. Until 2026-10-26 this page ranked around position 63 for sender queries
// ("pay freelancers internationally") because nothing else on the site answered them, and it
// answered them badly. Those queries now have their own page, so this one can say plainly that it
// is for the person being paid. Title is absolute so the layout does not append the site name.
export const metadata: Metadata = {
  title: { absolute: 'Receive international payments: real costs by country' },
  description:
    'How freelancers receive international payments: what Wise, Payoneer, PayPal, Western Union and bank wire really cost in 17 countries, and which one leaves you the most.',
  alternates: {
    canonical: '/receive-international-payments',
  },
  openGraph: {
    title: 'How freelancers receive international payments: real costs by country',
    description:
      'What each way of getting paid from abroad really costs in 17 countries, ranked by the amount that lands in your account.',
    url: '/receive-international-payments',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Receive international payments: real costs by country',
    description:
      'What each way of getting paid from abroad really costs in 17 countries, ranked by the amount that lands in your account.',
  },
};

const P = 'pa-prose';

const pillarJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paidacross.com/receive-international-payments#article',
      headline: 'How freelancers receive international payments: real costs by country',
      datePublished: '2026-06-03T00:00:00+00:00',
      dateModified: '2026-10-29T00:00:00+00:00',
      url: 'https://paidacross.com/receive-international-payments',
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
      ],
    },
  ],
};

export default async function ReceiveInternationalPaymentsPage() {
  const rates = await getRates();
  const wiseProvider = PROVIDERS.find(p => p.slug === 'wise');
  const wiseLink = wiseProvider?.affiliateLink || wiseProvider?.signupUrl || 'https://wise.com';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pillarJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main id="main-content" className="pa-read space-y-14 pt-8 pb-4 sm:pt-12">
        <header className="space-y-5">
          <h1 className="pa-h1">
            How freelancers receive international payments: real costs by country
          </h1>
          <p className="pa-intro">
            For most freelancers the cheapest way to receive international payments is a Wise
            account with US account details, where your country allows one: your client pays
            you like a local supplier and Wise converts at the mid-market rate. Where Wise is
            closed to residents, as in Pakistan and Bangladesh, Payoneer is the usual route at
            roughly 3.6% all in. In Nigeria and Brazil, local services such as Raenest and
            Higlobe come out cheaper than either. The choice matters more than it looks. The
            cost runs from a fraction of a percent to almost 9% of every invoice, and on $3,000 a
            month that is the difference between losing about $15 and losing over $250. Below is
            what each route costs in the {CORRIDORS.length} countries we cover.
          </p>
          <p className="pa-meta">
            By{' '}
            <Link href="/about/author" className="underline underline-offset-2 hover:text-foreground">
              George I.
            </Link>
            {' · '}
            Last updated: October 29, 2026
          </p>
        </header>

        <section aria-label="Payment cost calculator">
          <h2 className="pa-h2 mb-5">Check your own numbers first</h2>
          <div style={{ minHeight: '320px' }}>
            <Calculator />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">The short answer</h2>
          <p className={P}>
            If Wise will give you an account in your country, it tops our table more often than
            anything else. It converts at the mid-market rate and charges a fee it shows you up
            front, and in several countries it can give you US account details, so a client pays
            you the way they would pay a supplier down the road.
          </p>
          <p className={P}>
            Where Wise is closed to residents, as in Pakistan and Bangladesh, Payoneer is usually
            what is left, and it costs more. Our model puts it at about 3.6% on a typical payment,
            and that figure rests on the middle of a range Payoneer publishes rather than a rate.
          </p>
          <p className={P}>
            The surprise is how often a local service beats both. In Nigeria, Raenest and Cleva
            issue US account numbers and come out cheapest in our comparison. In Brazil it is
            Higlobe. These names rarely show up in global comparison articles, which is one reason
            the country pages exist.
          </p>
        </section>

        <section>
          <h2 className="pa-h2 mb-5">Every country, compared</h2>
          <p className="pa-prose mb-5">
            Each row is the top of that country&apos;s own comparison on a $1,000 payment, at
            today&apos;s mid-market rate, with the fee and the exchange rate margin both counted.
            The country page has the rest of the table, a worked example and the local rules.
          </p>
          <CorridorTable
            rates={rates}
            caption="Countries covered, how many receiving options we price in each, and which one tops the comparison at $1,000"
          />
          <p className="pa-meta mt-4 max-w-[75ch]">
            Est. means part of that cost is published only as a range and we used the middle.
            Read the country page before you act on a top row. Ukraine&apos;s is a bank wire whose
            cost depends heavily on your client&apos;s bank, and Pakistan&apos;s page also shows a
            cheaper Western Union price that we list but do not rank, because it is meant for family
            remittances. Both pages explain the catch.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">The two charges in every payment</h2>
          <p className={P}>
            Most services charge you twice. The first charge is the visible fee, a percentage, a
            flat amount, or both. The second is inside the exchange rate. Every provider converts
            at a rate a little worse than the mid-market rate you see on Google or Reuters, and the
            gap is money you pay without ever seeing a line for it.
          </p>
          <p className={P}>
            Here is how that works on a $1,000 payment through Payoneer to a local bank account.
            Payoneer takes 1% when the payment arrives, leaving $990. It then converts at a rate
            it describes as 1.2% to 4% away from the mid. At the middle of that range, 2.6%, you
            lose about another $26. The total is roughly $36, or 3.6%, and only the first $10 of it
            appears as a fee.
          </p>
          <p className={P}>
            That is why we never rank on the advertised fee. A service that says &ldquo;no
            fee&rdquo; and converts 3% below the mid costs you more than one that charges a
            visible 1% and converts at the mid. Our tables measure everything against the
            mid-market rate, so both charges show up in one number: what lands in your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Account details matter more than fees</h2>
          <p className={P}>
            The single biggest saving most freelancers can make has little to do with which app
            looks cheapest. It is whether you can give your client a routing number and an account
            number that look like a US bank account. With those, a US client pays you by domestic
            ACH, which usually costs them nothing and arrives in a couple of business days.
            Without them, they send an international wire, their bank charges $25 to $45 to send
            it, and someone absorbs that, usually you.
          </p>
          <p className={P}>
            Wise gives US account details to residents of many countries, including Portugal, the
            Philippines and Georgia. Payoneer gives them almost everywhere it operates, which is a
            large part of why it dominates in South Asia despite the cost. Nigeria&apos;s local
            services do the same. Before you give a client anything, open the app and check what
            it actually shows under your dollar balance. In some countries the only option is
            SWIFT, and that changes the arithmetic completely.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Upwork, Fiverr and other marketplaces</h2>
          <p className={P}>
            When a marketplace pays you, your choices narrow. You pick from the withdrawal methods
            the platform offers, which usually means Payoneer, a direct bank transfer, or PayPal
            where it works. The cheap trick some direct clients will do for you, paying through
            their own Wise account straight into your local bank, is not available on a platform
            that runs payments through its own system.
          </p>
          <p className={P}>
            Two things are worth checking. First, the platform takes its own commission before
            anything else, so Payoneer&apos;s 1% applies to what reaches Payoneer, not to what
            the client was billed. Second, a platform&apos;s own direct-to-bank option converts at
            the platform&apos;s rate, so compare the local currency figure it quotes against the
            mid-market rate on the day before you assume it is cheaper. Our Pakistan page walks
            through that comparison for Upwork.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">You do not always have to convert</h2>
          <p className={P}>
            In some countries you can hold the dollars and convert later, or never. Georgian banks
            offer USD sub-accounts, Thai banks offer foreign currency deposit accounts, and banks
            in the Philippines offer FCDU dollar savings accounts that take an incoming wire
            without forcing a conversion. Bangladesh lets freelancers exporting software and other
            ICT services keep up to 50% of their export earnings in an ERQ foreign currency
            account, and up to 30% for other services. Ask your bank which share applies to you.
          </p>
          <p className={P}>
            Holding dollars is worth it if you have dollar expenses or want to choose when you
            convert. Where a country lets you do this, our calculator offers the dollar option
            alongside the local currency, so you can compare the two directly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Paperwork can outweigh the fee</h2>
          <p className={P}>
            In some countries the cheapest route on paper is the wrong one, because of what it
            does or does not prove to the tax office. In Pakistan, IT exporters registered with
            the Pakistan Software Export Board pay a 0.25% final tax on export proceeds instead of
            roughly 1%, but only on money that comes in through banking channels and is recorded
            as an export of services. A payment that arrives as a family remittance does not
            count.
          </p>
          <p className={P}>
            Bangladesh is similar. The 2.5% export cash incentive for individual freelancers needs
            a Foreign Inward Remittance Certificate from your bank. Payoneer to bKash is fast and
            popular, but it produces no certificate, so the money it moves cannot earn the
            incentive. In both countries a route that costs half a percent more can leave you
            better off. The country pages give the details, and they are no substitute for a local
            tax adviser.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="pa-h2">The main providers, briefly</h2>
          <div className="space-y-7 pa-prose">
            <div>
              <h3 className="pa-h3 mb-2">Wise</h3>
              <p>
                Converts at the mid-market rate and charges a separate fee you can see before you
                accept. It tops most of the tables where residents can open an account. Where they cannot, a client can sometimes still use Wise to send local currency
                straight to your bank account. Pakistan and Bangladesh are the exceptions to check:
                Wise says it is currently unable to send business payments to Pakistani rupees and
                cannot send business transfers to Bangladeshi taka.
              </p>
              <a
                href={wiseLink}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="mt-1.5 inline-block text-xs underline underline-offset-2 hover:text-foreground"
              >
                Open Wise account (AD) →
              </a>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Payoneer</h3>
              <p>
                1% on an incoming client payment, then a conversion cost on withdrawal that
                Payoneer gives only as a range of 1.2% to 4%. It works in places Wise and Revolut
                do not, and Upwork and Fiverr pay into it without any effort from you, which is
                why so many freelancers in Pakistan, Bangladesh and elsewhere use it. For
                today&apos;s numbers, see our{' '}
                <Link href="/rates/payoneer-usd-to-pkr" className="underline underline-offset-2 hover:text-foreground">
                  Payoneer USD to PKR
                </Link>{' '}
                and{' '}
                <Link href="/rates/payoneer-usd-to-bdt" className="underline underline-offset-2 hover:text-foreground">
                  Payoneer USD to BDT
                </Link>{' '}
                pages.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Revolut</h3>
              <p>
                Cheap where it is licensed. In Portugal, the one country on our list where we can
                price it, it comes out at the top. Residents of most of the other countries we
                cover cannot use it, including Pakistan, Georgia, Thailand and Indonesia, and we
                could not confirm it for Bangladesh.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">PayPal</h3>
              <p>
                Convenient and almost always the most expensive. On a cross-border commercial
                payment PayPal charges a receiving fee of roughly 2.9% to 5.4% plus a fixed amount,
                then about 3% to 3.5% on conversion, depending on the country. It cannot receive
                business payments at all in Pakistan or Bangladesh.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Western Union</h3>
              <p>
                Reaches almost everywhere. In some countries, Mexico among them, it comes out near
                the top of our tables. In Pakistan its price looks cheaper still, but that price is
                set up for family remittances, so we list it without ranking it, and Western Union
                publishes no rate for business payments on that route. Read the country page first.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Bank wire (SWIFT)</h3>
              <p>
                Works everywhere and costs a lot on small amounts. Your client&apos;s US bank
                usually charges $25 to $45 to send, an intermediary bank may take a cut, and your
                bank converts at its own rate. On a payment over $5,000 the flat part fades, and
                in Bangladesh and Pakistan a wire is also the route that gives you the export
                paperwork.
              </p>
            </div>
            <div>
              <h3 className="pa-h3 mb-2">Local specialists</h3>
              <p>
                Raenest, Cleva, Grey and LemFi in Nigeria, Higlobe in Brazil, GCash and Maya in the
                Philippines, bKash in Bangladesh. These often beat the global names in their own
                country. We list them on the country pages and only price them where we can source
                both the fee and the exchange rate.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="pa-h2">Four mistakes that cost the most</h2>
          <ul className="pa-prose list-disc space-y-3 pl-5 marker:text-rule">
            <li>
              Comparing fees and ignoring the exchange rate. The rate is often the larger charge.
            </li>
            <li>
              Asking a US client for an international wire when you could have given them
              domestic account details.
            </li>
            <li>
              Leaving PayPal as the default because clients already have it. On $3,000 a month the
              gap to a cheaper route can be around $200.
            </li>
            <li>
              Choosing the fastest route in a country where the slower one is the only one that
              qualifies for a tax rate or an incentive.
            </li>
          </ul>
        </section>

        <section className="pa-sheet px-5 py-6 sm:px-7">
          <h2 className="pa-h3 mb-3">Paying someone, not getting paid?</h2>
          <p className="max-w-[65ch] text-[0.9375rem] text-muted-foreground leading-relaxed">
            If you are the client, the question flips: which way of paying leaves your freelancer
            with the most?{' '}
            <Link href="/pay-freelancers-internationally" className="underline underline-offset-2 hover:text-foreground">
              Our guide to paying freelancers internationally
            </Link>{' '}
            covers it from your side.
          </p>
        </section>

        {/* Methodology */}
        <section className="pa-note px-5 py-6 sm:px-7">
          <h2 className="pa-h3 mb-3">Methodology</h2>
          <p className="max-w-[65ch] text-[0.9375rem] text-muted-foreground leading-relaxed">
            Fees come from each provider&apos;s own public pricing page, verified by date with
            the source linked. FX spreads are different: several providers do not publish one
            at all, so where we could not source a figure we estimate it, mark that row
            &ldquo;FX estimated&rdquo;, and bar it from the best-value badge, which only ever
            sits on a provider whose spread we can point at. Exchange rates are live mid-market
            from{' '}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open.er-api.com
            </a>{' '}
            with no bank rates. Provider ranking is determined entirely by net received
            amount after all fees and FX markup. There is no paid placement.
          </p>
          <p className="pa-meta mt-4">
            <Link
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Fee data is open-source on GitHub
            </Link>{' '}
            and corrections with a source link are welcome.
          </p>
        </section>

        {/* Author + disclaimer */}
        <div className="pa-meta space-y-1.5 border-t border-rule pt-5">
          <p>
            Written by{' '}
            <Link
              href="/about/author"
              className="underline underline-offset-2 hover:text-foreground"
            >
              George I.
            </Link>{' '}
            (20+ years in international payments). Last updated: October 29, 2026.
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
