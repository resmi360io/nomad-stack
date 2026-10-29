'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/receive-international-payments') {
    // corridor pages (/receive/usd-to-pkr etc.) live under this section
    return pathname === href || pathname.startsWith('/receive/');
  }
  return pathname === href;
}

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/receive-international-payments', label: 'Country guides' },
    { href: '/how-we-make-money', label: 'How we make money' },
  ];

  return (
    // The cover of the passbook: one oxblood band. Sticky from sm up only, because on a phone the
    // nav wraps to a second line and a two-line sticky bar would eat the calculator's viewport.
    <header className="z-50 bg-cover text-cover-foreground sm:sticky sm:top-0">
      <div className="pa-shell flex flex-wrap items-center gap-x-8 gap-y-0.5 pt-2.5 pb-1.5 sm:h-14 sm:pb-0 sm:pt-0 sm:flex-nowrap sm:py-0">
        <Link
          href="/"
          aria-current={isActive(pathname, '/') ? 'page' : undefined}
          className="rounded-sm text-[1.0625rem] font-bold tracking-[-0.015em] text-cover-foreground focus-visible:outline-cover-foreground"
        >
          Paid Across
        </Link>
        <nav aria-label="Main" className="-mx-2 flex items-center text-[0.9375rem]">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
              className={cn(
                'rounded-sm px-2 py-1.5 underline-offset-[6px] transition-colors focus-visible:outline-cover-foreground',
                isActive(pathname, href)
                  ? 'text-cover-foreground underline decoration-cover-muted decoration-2'
                  : 'text-cover-muted hover:text-cover-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
