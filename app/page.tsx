import { Calculator } from '@/components/Calculator';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Real Cost of Receiving International Payments
        </h1>
        <p className="text-lg text-muted-foreground">
          Compare fees across 7 ways to get paid abroad. Enter your payment details to see the true cost.
        </p>
      </header>

      <Calculator />

      <p className="border-t pt-4 text-xs text-muted-foreground">
        Fees are estimates based on publicly available pricing as of May 2026. FX rates shown are indicative mid-market rates; actual rates may vary. Verify with your provider before transferring.{' '}
        <a href="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
          How we make money
        </a>
      </p>

      <Footer />
    </main>
  );
}
