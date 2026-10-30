import Link from 'next/link';
import { RATE_PAGES } from '@/data/ratePages';
import { PROVIDERS } from '@/data/providers';

// The provider rate pages are reached from search far more than from browsing, so they are not in
// the header menu; listing them here puts them one tap away from every page. Built from RATE_PAGES,
// so a new rate page appears here without another edit.
const rateLinks = RATE_PAGES.map((rp) => ({
  href: `/rates/${rp.slug}`,
  label: `${PROVIDERS.find((p) => p.slug === rp.providerSlug)?.name ?? rp.providerSlug} ${rp.source} to ${rp.destination} rate`,
}));

const linkClass =
  'text-cover-foreground underline decoration-cover-muted underline-offset-4 hover:decoration-cover-foreground';

export function Footer() {
  return (
    <footer className="mt-12 bg-cover text-cover-muted sm:mt-20">
      <div className="pa-shell flex flex-col gap-5 py-8 text-sm leading-relaxed sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          {rateLinks.length > 0 && (
            <nav aria-label="Provider rates">
              <p className="font-semibold text-cover-foreground">Provider rates</p>
              <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                {rateLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <p className="max-w-[60ch]">
            Some links on this page are affiliate links:{' '}
            <a href="/how-we-make-money" className={linkClass}>
              how we make money
            </a>
            {' · '}
            <a href="/freelancer-payment-cost-index" className={linkClass}>
              freelancer payment cost index
            </a>
            {' · '}
            <a
              href="https://github.com/resmi360io/nomad-stack"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              fee data on GitHub
            </a>
            . Ranking is based on fee math only.
          </p>
        </div>
        <p className="shrink-0 font-semibold text-cover-foreground">© {new Date().getFullYear()} Paid Across</p>
      </div>
    </footer>
  );
}
