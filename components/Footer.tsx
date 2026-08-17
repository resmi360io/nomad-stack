export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-xs text-muted-foreground">
      <p>
        Some links on this page are affiliate links:{' '}
        <a
          href="/how-we-make-money"
          className="underline underline-offset-2 hover:text-foreground"
        >
          how we make money
        </a>
        {' · '}
        <a
          href="https://github.com/resmi360io/nomad-stack"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          fee data on GitHub
        </a>
        . Ranking is based on fee math only.
      </p>
      <p className="mt-1">© {new Date().getFullYear()} Paid Across</p>
    </footer>
  );
}
