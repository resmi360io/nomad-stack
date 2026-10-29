export function Footer() {
  return (
    <footer className="mt-12 bg-cover text-cover-muted sm:mt-20">
      <div className="pa-shell flex flex-col gap-3 py-8 text-sm leading-relaxed sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-[60ch]">
          Some links on this page are affiliate links:{' '}
          <a
            href="/how-we-make-money"
            className="text-cover-foreground underline decoration-cover-muted underline-offset-4 hover:decoration-cover-foreground"
          >
            how we make money
          </a>
          {' · '}
          <a
            href="https://github.com/resmi360io/nomad-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cover-foreground underline decoration-cover-muted underline-offset-4 hover:decoration-cover-foreground"
          >
            fee data on GitHub
          </a>
          . Ranking is based on fee math only.
        </p>
        <p className="shrink-0 font-semibold text-cover-foreground">© {new Date().getFullYear()} Paid Across</p>
      </div>
    </footer>
  );
}
