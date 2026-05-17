import { PROVIDERS } from '@/data/providers';

const AFFILIATE_PROVIDERS = PROVIDERS.filter(p => p.hasAffiliateProgram);

export default function HowWeMakeMoney() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">How We Make Money</h1>
        <p className="text-muted-foreground">
          Last updated: May 2026
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          This site is free to use. We earn a commission when you sign up for certain providers
          through links on this page. This is called an affiliate relationship.
        </p>
        <p>
          <strong>Commissions do not affect our rankings.</strong> Every provider is ranked purely
          by the net amount you receive after all fees and FX markup — the math is the same whether
          or not we have an affiliate deal. Providers without affiliate programs (PayPal, Western
          Union, Bank Wire) appear in results alongside those we do earn from.
        </p>
        <p>
          We only list providers we believe are legitimate and useful for digital nomads and remote
          freelancers. Fee data is sourced from each provider&apos;s public pricing pages and
          verified periodically — check the <code>lastVerified</code> dates in our data for
          freshness.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Providers we have affiliate relationships with</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5">Provider</th>
                <th className="px-4 py-2.5">Affiliate program</th>
                <th className="px-4 py-2.5">Data verified</th>
              </tr>
            </thead>
            <tbody>
              {AFFILIATE_PROVIDERS.map((p, i) => (
                <tr
                  key={p.slug}
                  className={i < AFFILIATE_PROVIDERS.length - 1 ? 'border-b' : ''}
                >
                  <td className="px-4 py-3 font-medium">
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {p.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Yes</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.lastVerified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground">
        <p>
          Providers <strong>without</strong> affiliate programs that still appear in results:{' '}
          {PROVIDERS.filter(p => !p.hasAffiliateProgram)
            .map(p => p.name)
            .join(', ')}
          .
        </p>
        <p>
          If you have questions about our affiliate relationships, open an issue on{' '}
          <a
            href="https://github.com/resmi360io/nomad-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </main>
  );
}
