import { PROVIDERS } from '@/data/providers';
import {
  AFFILIATE_STATUS,
  getLatestAffiliateUpdate,
  type AffiliateStatus,
} from '@/data/affiliate-status';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Format an ISO date (YYYY-MM-DD) as "Month D, YYYY" without timezone drift.
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

// Subtle status dot — informational, not a marketing badge.
// "Not available" intentionally has no dot.
const STATUS_DOT: Record<AffiliateStatus, string | null> = {
  pending: 'bg-gray-400',
  approved: 'bg-green-500',
  'personal-referral': 'bg-blue-500',
  'not-available': null,
};

const lastUpdated = getLatestAffiliateUpdate();

export default function HowWeMakeMoney() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">How We Make Money</h1>
        <p className="text-muted-foreground">
          Last updated: {formatIsoDate(lastUpdated)}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          As of May 29, 2026, we have not earned any affiliate commission. All
          affiliate applications were submitted on or after May 27, 2026 and are
          in review with the respective providers. We update this page as
          statuses change.
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
        <h2 className="text-lg font-semibold">Affiliate program status</h2>
        <p className="text-sm leading-relaxed">
          We disclose every commercial relationship transparently and update this table as
          application statuses change. No tracking links are live as of the date below.
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
                        <span
                          aria-hidden="true"
                          className={`inline-block size-2 shrink-0 rounded-full ${dot ?? ''}`}
                        />
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
      </section>

      <section className="space-y-2 text-sm text-muted-foreground">
        <p>
          Providers without affiliate programs that appear in results:{' '}
          {PROVIDERS.filter(p => !p.hasAffiliateProgram)
            .map(p => p.name)
            .join(', ')}
          . These are included on the same fee-math basis as all others. Affiliate program status
          does not affect ranking — every provider is ranked by the net amount you receive after all
          fees and FX markup, calculated identically regardless of whether we have an affiliate
          relationship. If we never get approved by a provider, they still appear if they&apos;re
          competitive on the math.
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
