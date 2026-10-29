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
    // Light, one row, 56px at every width: the bar is chrome, not content, and on a phone every
    // pixel it gives back moves the calculator up.
    <header className="sticky top-0 z-50 border-b border-border bg-sheet/95 backdrop-blur-sm supports-[backdrop-filter]:bg-sheet/85">
      <div className="pa-shell flex h-14 items-center justify-between gap-3">
        <Link
          href="/"
          aria-current={isActive(pathname, '/') ? 'page' : undefined}
          className="flex shrink-0 items-center gap-2 rounded-sm text-[1rem] font-bold tracking-[-0.02em] text-foreground"
        >
          {/* The monogram is drawn with generated content, not text, so the link's accessible
              and crawlable name stays exactly "Paid Across". */}
          <span
            aria-hidden="true"
            className="hidden size-6 place-items-center rounded-[5px] bg-primary text-[0.6875rem] font-bold tracking-normal text-primary-foreground before:content-['PA'] sm:grid"
          />
          Paid Across
        </Link>
        <nav aria-label="Main" className="-mr-2 flex items-center text-[0.8125rem] sm:text-[0.9375rem]">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center rounded-sm px-2 font-medium whitespace-nowrap transition-colors sm:px-3',
                isActive(pathname, href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
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
