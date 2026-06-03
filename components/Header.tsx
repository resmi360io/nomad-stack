import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-semibold text-sm hover:text-muted-foreground transition-colors">
          Paid Across
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/receive-international-payments" className="hover:text-foreground transition-colors">
            Country guides
          </Link>
          <Link href="/how-we-make-money" className="hover:text-foreground transition-colors">
            How we make money
          </Link>
        </nav>
      </div>
    </header>
  );
}
