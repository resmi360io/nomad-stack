// Affiliate program status — single source of truth for /how-we-make-money.
//
// When an application is approved, change `status` to 'approved', update
// `statusLabel` to 'Approved', and bump `lastUpdated`. No copy changes are
// needed on the page itself.
//
// As of 2026-05-29 we have not earned any affiliate commission. All
// applications were submitted on or after 2026-05-27 and are in review.

export type AffiliateStatus =
  | 'approved'           // affiliate program approved, tracking link deployed in production
  | 'pending'            // applied, awaiting decision
  | 'personal-referral'  // using a personal referral program (no formal affiliate)
  | 'not-available';     // no affiliate program exists for this provider

export type AffiliateStatusEntry = {
  provider: string;
  status: AffiliateStatus;
  statusLabel: string;   // human-readable, matches the four approved phrases
  platform?: string;     // affiliate network, e.g. "Partnerize", "Impact.com", "PartnerStack"
  lastUpdated: string;   // ISO date YYYY-MM-DD
};

export const AFFILIATE_STATUS: AffiliateStatusEntry[] = [
  { provider: 'Wise',     status: 'approved',          statusLabel: 'Approved, link live',       platform: 'Partnerize', lastUpdated: '2026-06-17' },
  { provider: 'Revolut',  status: 'pending',           statusLabel: 'Application pending',        platform: 'Impact.com', lastUpdated: '2026-05-31' },
  { provider: 'Payoneer', status: 'pending',           statusLabel: 'Application pending',                                lastUpdated: '2026-05-31' },
  { provider: 'GrabrFi',  status: 'personal-referral', statusLabel: 'Personal referral link active',                     lastUpdated: '2026-05-31' },
];

/**
 * Most recent `lastUpdated` value across all entries (ISO date string).
 * Drives the "Last updated" line on the page so it never drifts from the data.
 */
export function getLatestAffiliateUpdate(
  entries: AffiliateStatusEntry[] = AFFILIATE_STATUS,
): string {
  return entries.reduce(
    (latest, entry) => (entry.lastUpdated > latest ? entry.lastUpdated : latest),
    entries[0]?.lastUpdated ?? '',
  );
}
