import { Calculator } from '@/components/Calculator';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Real Cost of Receiving International Payments
        </h1>
        <p className="text-lg text-muted-foreground">
          Wise, Revolut, Payoneer and 9 more, ranked by what actually lands in your account.
        </p>
      </header>

      <Calculator />

      <p className="border-t pt-4 text-xs text-muted-foreground">
        Fees are estimates based on publicly available pricing, last verified between June and July 2026; each provider card shows its own verification date. FX rates shown are indicative mid-market rates; actual rates may vary. Verify with your provider before transferring.{' '}
        <a href="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
          How we make money
        </a>
      </p>

    </main>
  );
}
