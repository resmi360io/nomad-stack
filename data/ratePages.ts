// Provider-specific rate pages, the one query pattern this site has PROOF of demand for.
//
// Why this file exists. The 2026-06-14 GSC diagnostic found that the generic corridor pages pull
// almost no named queries, with one exception: USD to PKR was ranking around position 33 for
// "payoneer exchange rate usd to pkr", "payoneer dollar to pkr" and "usd to pkr payoneer rate
// today". That is the only confirmed search demand this project has ever measured, and until now
// nothing on the site targeted it. A corridor page answers "which provider should I use"; these
// pages answer "what will THIS provider give me today", which is a different and more
// transactional intent.
//
// Honesty constraint that shapes every page here, and the reason they are worth writing. Most
// pages ranking for these queries show a mid-market rate and present it as the provider's rate.
// For Payoneer that is not a thing that exists: Payoneer publishes a FEE STRUCTURE, including a
// withdrawal conversion cost it gives only as a 1.2% to 4% range, and no public rate feed. So
// these pages show today's mid-market rate, apply the provider's published fees to it, and say
// plainly that the exact rate is the one in your own account at the moment you withdraw. That is
// less satisfying than a number and it is the only defensible version.
//
// This is NOT programmatic SEO and must not become it. AGENTS.md gates bulk generation behind
// roughly 25 indexed corridors, several ranking in the top 30, impressions trending up for 8+
// weeks and 3 to 5 editorial backlinks. None of the last three hold yet. These are hand-written
// against a measured query, one at a time.

import type { Currency } from './providers';

export interface RatePageFaq {
  q: string;
  a: string;
}

export interface RatePage {
  slug: string;              // URL segment, written to match the query: payoneer-usd-to-pkr
  providerSlug: string;      // must exist in PROVIDERS
  corridorSlug: string;      // must exist in CORRIDORS; the page links back to it
  source: Currency;
  destination: Currency;
  country: string;
  title: string;             // <title>, under 60 chars where possible
  metaDescription: string;
  h1: string;
  intro: string;
  // Why we do not print a provider rate. Rendered under the live rate block.
  rateNote: string;
  faqs: RatePageFaq[];
  publishedDate: string;
  updatedDate: string;
}

export const RATE_PAGES: RatePage[] = [
  {
    slug: 'payoneer-usd-to-pkr',
    providerSlug: 'payoneer',
    corridorSlug: 'usd-to-pkr',
    source: 'USD',
    destination: 'PKR',
    country: 'Pakistan',
    title: 'Payoneer USD to PKR rate today: what you net',
    metaDescription:
      'Today mid-market USD to PKR rate, what Payoneer published fees take out of it, and what actually lands in your Pakistani bank account. Payoneer publishes no rate of its own.',
    h1: 'Payoneer USD to PKR rate today, and what you actually receive',
    intro:
      'If you came here for a single number labelled the Payoneer rate, we have to start by telling you that no such number is published. Payoneer does not run a public rate feed. What it publishes is a fee structure: 1% on an incoming commercial payment, and then a conversion cost on withdrawal that it states as a range of 1.2% to 4% rather than a rate. Everything you will read quoting an exact Payoneer rate is either showing you the mid-market rate with Payoneer written next to it, or reporting one person screenshot from one day. So here is the honest version instead. Below is today mid-market USD to PKR rate from our rate source, with the date it was published, and then what Payoneer own published fees do to a 500, 1,000 and 5,000 dollar payment on the way to your Pakistani bank account. The only rate that will ever be exactly right is the one quoted in your own Payoneer account at the moment you press withdraw, so the useful thing we can give you is the size of the gap to expect and the two numbers it is built from.',
    rateNote:
      'That is the interbank mid-market rate, which is the rate you would see on Google or Reuters and the rate nobody actually gives you. It is the correct starting point because it is the only rate with no margin in it, so every provider cost can be measured as a distance from it. Payoneer does not publish how far from the mid it converts. It publishes the cost as a band, 1.2% to 4%, and our figures below use the midpoint of that band, 2.6%, which is why they are flagged as an estimate rather than a price. If your own withdrawal screen shows a rate near the bottom of that band you will do better than our table says, and near the top you will do worse.',
    faqs: [
      {
        q: 'What is the Payoneer USD to PKR rate today?',
        a:
          'Payoneer does not publish one, and that is a real answer rather than a dodge. It publishes 1% to receive a commercial payment and a withdrawal conversion cost given as a range of 1.2% to 4%, with no public rate feed behind it. So the only exact rate is the one shown in your account at the moment you withdraw. What you can plan with is the gap: start from today mid-market rate above, then expect to lose roughly 2.2% to 5% of the payment across the two Payoneer charges together. Our table models the midpoint of the published band because a range is not a price, and we flag it as an estimate for that reason.',
      },
      {
        q: 'Why is the rate in my Payoneer account lower than the rate on Google?',
        a:
          'Because the rate on Google is the mid-market rate, which has no margin in it and is not offered to retail customers by anyone. Payoneer takes its conversion cost inside the rate it gives you rather than showing it as a separate line, which is why the two numbers never match and why the difference is easy to miss. That is also why we price everything on this site as a distance from the mid rather than quoting rates: a rate quoted without the mid next to it tells you nothing about what it costs.',
      },
      {
        q: 'Is Payoneer the cheapest way to get USD into a Pakistani bank account?',
        a:
          'Not quite, and the exception is more interesting than the answer. Payoneer comes second of the three routes we can price into Pakistan at every amount we model. The only thing beating it is Western Union, and our Pakistan page spends a paragraph explaining why that is not the comparison it looks like: the cheap Western Union number is Pakistan Remittance Initiative pricing, which is a home remittance scheme, and both Western Union terms and the scheme itself describe that pricing as being for personal transfers rather than client payments. Western Union sold its business payments arm in 2022 and publishes no commercial rate for this corridor. So against things a freelancer can actually invoice through, Payoneer is the cheaper of what is left. Its 1% receive fee is reasonable and the undisclosed withdrawal conversion is what costs you. What keeps most Pakistani freelancers on it anyway is that Upwork, Fiverr and many direct US clients pay into it with no effort from the client, and a cheaper route you cannot persuade a client to use is not cheaper in practice.',
      },
      {
        q: 'Does the 1% receiving fee apply to Upwork and Fiverr payments?',
        a:
          'Payoneer charge of 1% is on incoming commercial payments, which is what a marketplace payout is. The thing to watch is that the marketplace usually takes its own cut first, so the 1% applies to what reaches Payoneer rather than to what your client was invoiced, and the two can be a long way apart. Check what your Upwork or Fiverr statement says left the platform, not what the client paid, and apply the figures below to that.',
      },
      {
        q: 'Which Pakistani banks does a Payoneer withdrawal reach?',
        a:
          'Our Pakistan page records HBL, UBL, MCB and Meezan as working reliably, with HBL and Meezan having official real-time withdrawal integrations with Payoneer. There is also an announced Payoneer route to a JazzCash mobile wallet, marketed as near real time rather than the one to three days a bank withdrawal usually takes. Neither company publishes a clear fee for the wallet route and third-party guides disagree about what it costs, so check the fee and the rate quoted in your own account before using it. If you claim the 0.25% PSEB tax rate, confirm with your bank or tax adviser that a wallet withdrawal still gives you the documentation you need.',
      },
      {
        q: 'How often does this page update?',
        a:
          'The mid-market rate on it refreshes hourly from our rate source, and the date and time of the rate publication are printed next to it so you can see how fresh it is rather than trusting us. The Payoneer fee figures change far less often and are re-checked on a weekly rotation against Payoneer own published pricing, with the last check date shown at the foot of the page. If you spot a figure that no longer matches Payoneer own page, that is worth more to us than a compliment.',
      },
    ],
    publishedDate: '2026-10-26',
    updatedDate: '2026-10-26',
  },
];
