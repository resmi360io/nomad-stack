import { fetchRatesServer } from '@/lib/fetchRates';

// The calculator reads rates from here instead of calling a rate provider from the browser, so an
// API key never leaves the server. Same source order as the server-rendered pages: FastForex when a
// key is configured, then open.er-api.com. Checked at most once an hour.
export const revalidate = 3600;

export async function GET() {
  const result = await fetchRatesServer();
  if (!result) {
    return Response.json(
      { error: 'Rates unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
    );
  }
  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=3600',
      // Not a page: keep the JSON out of search indexes without blocking the calculator from loading it.
      'X-Robots-Tag': 'noindex',
    },
  });
}
