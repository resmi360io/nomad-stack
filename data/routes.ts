import type { CountryCode, RouteType } from './providers';

// Routes we describe but cannot rank, per destination country. One record per provider and
// country, read by the calculator (under its results) and by the corridor pages (the label next to
// each provider in "Providers not available"), so the two can never call the same route different
// things. The prose that explains each one stays in data/corridors.ts; this file only says which of
// these states the route is in, and every state needs the same evidence as a fee:
//
// - unpriced: the route exists and is open to a freelancer, but its cost cannot be read from a
//   primary source (a margin the provider does not publish). Listed, never given a number.
// - unverified: we could not confirm the route exists for this country at all.
// - sender: the client sends from their own provider to the freelancer's local bank account; the
//   freelancer opens nothing. Listed when we have not priced it.
// - unavailable: confirmed not open to residents of the country.
export type ListedRouteStatus = 'unpriced' | 'unverified' | 'sender' | 'unavailable';

export interface ListedRoute {
  country: CountryCode;
  provider: string;        // slug, matches data/providers.ts and the corridor entry
  name: string;
  status: ListedRouteStatus;
  routeType: RouteType;
  summary: string;         // one reader-facing line, no em or en dashes
}

export const LISTED_ROUTES: ListedRoute[] = [
  {
    country: 'NG',
    provider: 'lemfi',
    name: 'LemFi',
    status: 'unpriced',
    routeType: 'recipient-account',
    summary: 'LemFi does not publish the margin inside its exchange rate, so we do not put a price on it.',
  },
  {
    country: 'NG',
    provider: 'grabrfi',
    name: 'GrabrFi',
    status: 'unpriced',
    routeType: 'recipient-account',
    summary: 'Open to Nigerian residents with naira withdrawal to a local bank, but GrabrFi does not publish the margin in its exchange rate, so we do not put a price on it.',
  },
  {
    country: 'NG',
    provider: 'wise',
    name: 'Wise',
    status: 'sender',
    routeType: 'sender-transfer',
    summary: 'Your client can send naira from Wise straight to your Nigerian bank account. You open nothing, but they have to set it up each time.',
  },
];

export function listedRoutesFor(country: CountryCode): ListedRoute[] {
  return LISTED_ROUTES.filter((r) => r.country === country);
}

export function listedRoute(country: CountryCode, provider: string): ListedRoute | undefined {
  return LISTED_ROUTES.find((r) => r.country === country && r.provider === provider);
}

export const LISTED_STATUS_LABEL: Record<ListedRouteStatus, string> = {
  unpriced: 'available, not priced',
  unverified: 'not verified',
  sender: 'your client sends with it',
  unavailable: 'not available',
};
