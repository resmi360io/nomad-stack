import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { Calculator } from '@/components/Calculator';
import { CorridorTable } from '@/components/CorridorTable';
import { CORRIDORS } from '@/data/corridors';
import { fetchRatesServer } from '@/lib/fetchRates';

export const revalidate = 3600;

const getRates = cache(fetchRatesServer);

// Absolute, so the layout template does not append the site name a second time. The homepage
// used to inherit the layout default, which made its title and description identical to the
// site-wide fallback and gave Google nothing page-specific to show.
export const metadata: Metadata = {
  title: { absolute: 'Paid Across: what receiving USD really costs, by country' },
  description:
    'What Wise, Payoneer, Western Union, PayPal and bank wire leave you after fees and the exchange rate margin, in 17 countries. Live mid-market rates, no paid ranking.',
  alternates: { canonical: '/' },
};

export default async function Home() {
  const rates = await getRates();

  return (
    <main id="main-content" className="pb-4">
      {/* First viewport: the question, one line on what the tool does, and the calculator. The
          full explanation follows directly under the calculator, visible and server-rendered,
          so a phone shows the form without scrolling and nothing is hidden from anyone. */}
      <div className="pa-shell grid items-start gap-5 pt-5 pb-10 sm:gap-8 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pt-16 lg:pb-14">
        <header className="space-y-3 sm:space-y-4 lg:pt-4">
          <h1 className="pa-h1 max-w-[16ch] sm:max-w-[20ch] lg:max-w-[14ch]">
            What it really costs to receive international payments
          </h1>
          <p className="max-w-[40ch] text-[1.0625rem] leading-snug text-muted-foreground sm:text-lg">
            See what lands in your account after every fee and the exchange rate margin, in{' '}
            {CORRIDORS.length} countries.
          </p>
          <p className="text-[0.9375rem]">
            <a href="#countries" className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
              Or jump to your country&apos;s guide
            </a>
          </p>
        </header>

        <Calculator />
      </div>

      <div className="pa-shell space-y-16">
        <section id="countries" className="max-w-4xl scroll-mt-20 space-y-5">
          <h2 className="pa-h2">Every country we cover</h2>
          <p className="pa-prose">
            Each row links to a full page for that country: which services you can actually open
            there, what each one charges, how long the money takes and the local paperwork that
            changes the answer. The last column is the top row of that page&apos;s own comparison
            on a $1,000 payment, priced at today&apos;s mid-market rate.
          </p>
          <CorridorTable
            rates={rates}
            caption="Countries covered, how many receiving options we price in each, and which one tops the comparison at $1,000"
          />
          <p className="pa-meta max-w-[75ch]">
            A row marked est. means part of that provider&apos;s cost is published only as a range,
            so we use the middle of it. These rows also skip any price we cannot rank: one published
            only for family transfers, a payout we could not confirm, or a price with a known charge
            missing. That is why Pakistan&apos;s top row is Payoneer, even though Western
            Union&apos;s family-transfer price is lower. Read the country page before acting on any
            row.
          </p>
        </section>

        <p className="pa-intro">
          Type in what your client is paying and where you live. We price every route we can
          find for getting dollars into your account in {CORRIDORS.length} countries, Wise,
          Payoneer, Western Union, PayPal, bank wire and the local services that only work in
          one place, and rank them by the amount that actually lands after every fee and the
          margin hidden in the exchange rate.
        </p>

        <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">
          <section className="pa-section">
            <h2 className="pa-h2">Where the money goes</h2>
            <p className="pa-prose">
              Almost every service takes its cut in two places. One is the fee you can see: a
              percentage, a flat charge, or both. The other is the exchange rate. The rate you get is
              a little worse than the mid-market rate you see on Google, and that gap is a charge too,
              just one that never appears as a line on your statement.
            </p>
            <p className="pa-prose">
              The second part is often the bigger one. Payoneer charges 1% on an incoming client
              payment, which sounds cheap. Then it converts your dollars to local currency at a rate
              it describes only as 1.2% to 4% away from the mid. Take the middle of that and a $1,000
              payment loses about $36 in total, most of it in the conversion. Wise works the other
              way round: it converts at the mid-market rate and charges a separate fee you can read
              before you send. Neither model is automatically cheaper. You only find out by adding
              both parts together, which is the whole job of this site.
            </p>
            <p className="pa-prose">
              Bank wires have a third problem. A US bank usually charges your client $25 to $45 to
              send one, intermediary banks can take something along the way, and your own bank then
              converts at its own rate. On a large one-off invoice the flat part barely matters. On
              a $500 monthly retainer it can be the most expensive option on the page.
            </p>
          </section>

          <section className="pa-section">
            <h2 className="pa-h2">How we rank, and when we refuse to</h2>
            <p className="pa-prose">
              The order is set by one number: what you receive. Nobody pays to move up. Fees come
              from each provider&apos;s own published pricing. Each country page is re-checked on a
              weekly rotation that has run reliably since late October 2026, and each fee in the
              calculator shows the date it was last checked against its source. That date can be
              older than the page&apos;s own last update.
            </p>
            <p className="pa-prose">
              Only routes that are open to a client payment and fully priced get ranked. Anything
              else we can price, such as a family-transfer price, a payout we could not confirm or a
              quote missing a known charge, is shown separately with the reason.
            </p>
            <p className="pa-prose">
              Some providers do not publish their exchange rate margin. Where we could not find one,
              we estimate it, label the row, and keep it away from the best value badge. That badge
              only goes to the top row, and only when we can point at a source for its margin. Plenty
              of countries end up with no badge at all, and we think that is more useful than a label
              we cannot back up.
            </p>
          </section>

        </div>

        <section className="pa-note space-y-4 px-5 py-6 sm:px-8">
          <h2 className="pa-h2">More on this</h2>
          <ul className="pa-prose list-disc space-y-3 pl-5 marker:text-rule">
            <li>
              <Link href="/receive-international-payments" className="underline underline-offset-2 hover:text-foreground">
                How freelancers receive international payments
              </Link>
              , the long version: account details, marketplace payouts, holding dollars and the
              tax paperwork that decides which route you should use.
            </li>
            <li>
              <Link href="/pay-freelancers-internationally" className="underline underline-offset-2 hover:text-foreground">
                Paying a freelancer abroad?
              </Link>{' '}
              The same numbers from the client&apos;s side, and the payment choices that leave your
              freelancer with the most.
            </li>
            <li>
              <Link href="/rates/payoneer-usd-to-pkr" className="underline underline-offset-2 hover:text-foreground">
                Payoneer USD to PKR rate today
              </Link>{' '}
              and{' '}
              <Link href="/rates/payoneer-usd-to-bdt" className="underline underline-offset-2 hover:text-foreground">
                Payoneer USD to BDT rate today
              </Link>
              , for anyone who wants one provider&apos;s numbers rather than a comparison.
            </li>
          </ul>
        </section>

        <p className="pa-meta max-w-[75ch] border-t border-rule pt-5">
          Fees are estimates based on each provider&apos;s public pricing, and every country page
          shows the date its figures were last checked. Check with the provider before you send
          money. Nothing here is financial or tax advice. Some links are affiliate links, marked
          AD, and they never change the order.{' '}
          <Link href="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
            How we make money
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
