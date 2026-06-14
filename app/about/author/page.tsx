import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About the author — George I.',
  description:
    '20+ years in international payments and transaction banking. Founder of Paid Across, a free calculator for the real cost of receiving international payments.',
  alternates: { canonical: '/about/author' },
};

const authorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://paidacross.com/about/author#author',
  name: 'George I.',
  url: 'https://paidacross.com/about/author',
  description:
    '20+ years in international payments and transaction banking. Founder of Paid Across.',
  knowsAbout: [
    'International payments',
    'Foreign exchange',
    'Transaction banking',
    'Fintech',
    'Cross-border money transfer',
    'FX markup',
    'SWIFT',
    'SEPA',
    'Payoneer',
    'Wise',
    'Freelance income',
  ],
  sameAs: [],
};

export default function AuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(authorJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto max-w-2xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">About the author</h1>
          <p className="text-muted-foreground">George I. — payments industry, 20+ years</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            I spent two decades in transaction banking and payments infrastructure: clearing
            operations at a major European bank, FX product management at a multinational
            broker, and the last several years advising fintechs on cross-border payment
            architecture. I have seen the pricing side of this industry from the inside. I
            know what exchange rate markup actually costs a provider to deliver, and how far
            it diverges from what they quote to customers.
          </p>
          <p>
            Paid Across started as a personal spreadsheet. I was watching colleagues and
            friends — developers, designers, consultants — quietly lose 3–8% of every
            international invoice to fees and FX spread. Not because the providers were
            dishonest, but because the cost structure was opaque. Most people do not know the
            difference between a percentage fee and an FX markup, and they certainly do not
            know that the two compound. A provider advertising &ldquo;no fee&rdquo; can cost
            you twice as much as one with a visible 1% fee if the hidden FX spread is 3%.
          </p>
          <p>
            I built this as a public tool because the math is simple once you see it laid out.
            The aim is to give freelancers, remote workers, and small business owners the same
            information that a sophisticated treasury team would look for when evaluating a
            payment provider.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">Areas of expertise</h2>
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-5">
            <li>SWIFT and SEPA network mechanics, correspondent banking, and nostro/vostro accounts</li>
            <li>FX pricing and bid-ask spread construction in interbank and retail contexts</li>
            <li>EMI (Electronic Money Institution) regulation in the EU and UK</li>
            <li>Freelancer payment workflows: Upwork, Fiverr, Toptal, direct invoicing</li>
            <li>Receiving corridors for restricted markets: Pakistan, Bangladesh, Nigeria, Egypt</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">Methodology and standards</h2>
          <p className="text-muted-foreground">
            Every fee figure on this site is sourced from the provider&apos;s own public pricing
            page, with the verification date recorded. If a fee cannot be confirmed from a
            public source, it is labeled as an estimate or marked TODO. For a site covering
            people&apos;s actual income, a wrong number is worse than a missing one.
          </p>
          <p className="text-muted-foreground">
            The exchange rates used in calculations are live mid-market rates from{' '}
            <a
              href="https://open.er-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              open.er-api.com
            </a>
            , refreshed hourly on each page. There are no hardcoded rates. Provider ranking is
            determined entirely by net received amount after all fees and FX markup.
          </p>
          <p className="text-muted-foreground">
            The{' '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              underlying fee data is open-source on GitHub
            </a>
            . Anyone can check the numbers or submit a correction with a source link.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">Why pseudonymous</h2>
          <p className="text-muted-foreground">
            I have worked with and for several of the payment providers reviewed on this site.
            Using a pseudonym avoids any suggestion that reviews are shaped by former employer
            relationships. The fee data and methodology are public and auditable; the
            conclusions stand or fall on the math, not on who wrote them.
          </p>
        </section>

        <div className="border-t pt-5 text-xs text-muted-foreground space-y-1">
          <p>
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-foreground"
            >
              ← Back to the calculator
            </Link>
            {' · '}
            <Link
              href="/how-we-make-money"
              className="underline underline-offset-2 hover:text-foreground"
            >
              How we make money
            </Link>
            {' · '}
            <Link
              href="/receive-international-payments"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Country-by-country guide
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
