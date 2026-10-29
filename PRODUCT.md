# Product

<!-- impeccable:product-schema 1 -->

Written 2026-10-29 from the repository, AGENTS.md, SEO_PLAN.md and the owner's redesign brief of the same
day. Facts marked (inferred) come from that evidence rather than from an interview answer.

## Platform

web

## Users

- **Freelancers and remote workers outside the US** (Pakistan, Bangladesh, the Philippines, Nigeria,
  India, Georgia, Brazil and ten more) who invoice US, UK or EU clients and want to know which route
  leaves them the most money. They arrive from search, usually on a phone (inferred from GSC queries
  such as "payoneer dollar rate in bangladesh today"), often comparing against a figure a provider
  quoted them.
- **Clients and businesses paying freelancers abroad**, served by `/pay-freelancers-internationally`.

## Product Purpose

Show what receiving an international payment really costs, per country: the explicit fee plus the
margin hidden in the exchange rate, ranked by the amount that actually lands. Success is a reader who
trusts the number enough to act on it, and returns.

## Positioning

An independent, fact-checked comparison. Ranking is set by one number, net received, and nobody pays to
move up. Every corridor page is re-verified weekly against primary sources by a verifier and an
independent reviewer, and estimates are labelled and kept away from the best value badge. The author
has 20+ years in international payments.

## Operating Context

- 17 corridor guides at `/receive/[corridor]`, a receive pillar, a sender page, two provider rate pages
  at `/rates/[pair]`, `/how-we-make-money` and `/about/author`.
- A client-side calculator on live mid-market rates; server-rendered comparison tables priced at $1,000.
- Search is the acquisition channel. Google and Bing rankings, titles, canonicals, JSON-LD, headings and
  internal links are protected assets (see SEO_PLAN.md).

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind v4, shadcn/ui on Base UI. No new frameworks or heavy dependencies.
- Fee calculation (`lib/calculate.ts`), provider data, rankings and the best value rule must not change
  in design work. Ranking-moving changes need the owner.
- Affiliate links (Wise, Grabr Fi) carry an AD mark and `rel="sponsored nofollow noopener"`. PostHog
  events are `$pageview` and `affiliate_click` only; analytics behaviour must not change.
- Reader-facing copy: no em or en dashes, unconfirmable facts hedged, humanizer on new copy.

## Brand Commitments

- Name: Paid Across. Voice: plain, specific, first-person plural, willing to say "we could not confirm
  this". No hype.
- No logo asset exists yet (inferred). The OG image is generated in `app/opengraph-image.tsx`.

## Evidence on Hand

- Real fee data and live calculations for 17 corridors; verification dates per provider.
- Methodology and disclosure pages. No testimonials, user counts, press or ratings exist, and none may
  be invented.

## Product Principles

1. The net amount received is the headline, everywhere.
2. Show the working: assumptions, estimates and dates sit next to the numbers they qualify.
3. Never let presentation imply a ranking the math does not support.
4. Content is the product. Design serves reading and comparing, and never hides text from readers or
   crawlers.

## Accessibility & Inclusion

WCAG 2.1 AA as the floor (inferred from existing work: labelled selects, live region on results,
captions on tables). Readers on low-end Android phones and slow connections are a core audience
(inferred), so JavaScript and font weight stay small.
