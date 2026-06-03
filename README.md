# Paid Across

The fee and FX data behind [paidacross.com](https://paidacross.com) -- a free calculator for the real cost of receiving international payments.

## Why this is open

Paid Across ranks providers purely on fee math. No paid placements or sponsorships. If that claim is going to mean anything, the data driving the ranking needs to be public and auditable. So here it is.

Anyone can read the numbers, check them against a provider's pricing page, and open a PR if something is off. That's the deal.

## What's in here

The fee data lives in [`data/providers.ts`](./data/providers.ts). Each provider entry has:

- **`fixedFee`** -- flat fee in the source currency (e.g. $0.69 for Wise on a USD send)
- **`percentageFee`** -- the percentage portion, stored as a decimal (`0.0043` = 0.43%)
- **`fxMarkupBps`** -- FX markup above mid-market in basis points (`100` = 1% above mid-market; `0` means the provider uses the real mid-market rate without markup)
- **`lastVerified`** -- ISO date when the fee was last confirmed against the provider's own pricing page
- **`corridors`** -- which source/destination country and currency pairs the provider supports, with fees per corridor

Corridors not explicitly listed fall back to the provider's `fallbackFee`, which is a conservative estimate.

## How the numbers work

Fees are stored as plain numbers -- no hidden multipliers, no assumptions baked in. The live mid-market FX rate is fetched client-side from [open.er-api.com](https://open.er-api.com), which is free, requires no API key, and covers GEL, THB, and IDR (currencies the ECB's Frankfurter API does not publish). The rate is cached in `sessionStorage` for 4 hours so it doesn't fire on every page load.

The destination amount is calculated by deducting the flat and percentage fees from the send amount, then converting at mid-market adjusted by the provider's FX markup. A provider with `fxMarkupBps: 0` (like Wise) passes through the real mid-market rate; one with `fxMarkupBps: 200` (like Payoneer on cross-currency corridors) costs an extra 2% in FX on top of their percentage fee.

Because the rate comes from a live API, the "you'll receive X" figure reflects what you'd actually get today, not a number someone hardcoded six months ago.

## How fees were verified

All figures were last verified on **2026-06-02** against each provider's public pricing page:

| Provider | Pricing page |
|----------|-------------|
| Wise | https://wise.com/us/pricing/send-money |
| Revolut | https://www.revolut.com/en-US/legal/standard-fees/ |
| Payoneer | https://www.payoneer.com/legal/fees/ |
| PayPal | https://www.paypal.com/us/webapps/mpp/merchant-fees |
| GrabrFi | https://grabrfi.com/pricing |
| Western Union | https://www.westernunion.com/us/en/transfer-fees.html |
| Paysera | https://www.paysera.com/v2/en/fees/euro-transfers |

Bank Wire has no single pricing page. The figures model a typical major-bank SWIFT transfer ($35 flat + 1--3.5% FX), consistent with published rates from Chase, Bank of America, and HSBC. Western Union FX spreads are cross-checked against [bestexchangerates.com](https://bestexchangerates.com) rate comparisons, which calculates the spread from live quotes.

## Submitting a correction

Open an issue or PR with a link to the provider's pricing page showing the correct number. Corrections with a credible source get merged.

If you want to add a provider that isn't listed, include the pricing page URL, which corridors it supports, and the fee structure (fixed fee + percentage + FX markup in bps).

## Disclaimer

Fees change. These figures are a snapshot and may be out of date by the time you read this. Verify with your provider before sending money. Nothing here is financial advice.
