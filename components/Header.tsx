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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
        <Link
          href="/"
          aria-current={isActive(pathname, '/') ? 'page' : undefined}
          className={cn(
            'font-semibold text-sm transition-colors',
            isActive(pathname, '/')
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Paid Across
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
              className={cn(
                'transition-colors',
                isActive(pathname, href)
                  ? 'text-foreground'
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
