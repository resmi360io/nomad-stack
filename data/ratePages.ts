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
      'Today\'s mid-market USD to PKR rate, what Payoneer\'s published fees take out of it, and what actually lands in your Pakistani bank account. Payoneer publishes no rate of its own.',
    h1: 'Payoneer USD to PKR rate today, and what you actually receive',
    intro:
      'If you came here for a single number labelled the Payoneer rate, we have to start by telling you that no such number is published. Payoneer does not run a public rate feed. What it publishes is a fee structure: 1% on an incoming commercial payment, and then a conversion cost on withdrawal that it states as a range of 1.2% to 4% rather than a rate. Everything you will read quoting an exact Payoneer rate is either showing you the mid-market rate with Payoneer written next to it, or reporting one person\'s screenshot from one day. So here is the honest version instead. Below is today\'s mid-market USD to PKR rate from our rate source, with the date it was published, and then what Payoneer\'s own published fees do to a 500, 1,000 and 5,000 dollar payment on the way to your Pakistani bank account. The only rate that will ever be exactly right is the one quoted in your own Payoneer account at the moment you press withdraw, so the useful thing we can give you is the size of the gap to expect and the two numbers it is built from.',
    rateNote:
      'That is the interbank mid-market rate, which is the rate you would see on Google or Reuters and the rate nobody actually gives you. It is the correct starting point because it is the only rate with no margin in it, so every provider cost can be measured as a distance from it. Payoneer does not publish how far from the mid it converts. It publishes the cost as a band, 1.2% to 4%, and our figures below use the midpoint of that band, 2.6%, which is why they are flagged as an estimate rather than a price. If your own withdrawal screen shows a rate near the bottom of that band you will do better than our table says, and near the top you will do worse.',
    faqs: [
      {
        q: 'What is the Payoneer USD to PKR rate today?',
        a:
          'Payoneer does not publish one, and that is a real answer rather than a dodge. It publishes 1% to receive a commercial payment and a withdrawal conversion cost given as a range of 1.2% to 4%, with no public rate feed behind it. So the only exact rate is the one shown in your account at the moment you withdraw. What you can plan with is the gap: start from today\'s mid-market rate above, then expect to lose roughly 2.2% to 5% of the payment across the two Payoneer charges together. Our table models the midpoint of the published band because a range is not a price, and we flag it as an estimate for that reason.',
      },
      {
        q: 'Why is the Payoneer exchange rate lower than the rate on Google?',
        a:
          'Because the rate on Google is the mid-market rate, which has no margin in it and is not offered to retail customers by anyone. Payoneer takes its conversion cost inside the rate it gives you rather than showing it as a separate line, which is why the two numbers never match and why the difference is easy to miss. That is also why we price everything on this site as a distance from the mid rather than quoting rates: a rate quoted without the mid next to it tells you nothing about what it costs.',
      },
      {
        q: 'What exchange rate does Payoneer use?',
        a:
          'Its own. Payoneer converts at a rate it sets, which sits some distance below the mid-market rate, and it describes that distance only as a band of 1.2% to 4% for a withdrawal that involves conversion. It does not say where Pakistani rupees fall inside the band, and it does not publish the rate itself anywhere outside your account. The closest you can get to checking it is what this page does: take the mid-market rate at the moment you withdraw, compare it with the rate on your withdrawal screen, and the difference is what the conversion cost you.',
      },
      {
        q: 'Is Payoneer the cheapest way to get USD into a Pakistani bank account?',
        a:
          'Not quite, and the exception is more interesting than the answer. Payoneer comes second of the three routes we can price into Pakistan at every amount we model. The only thing beating it is Western Union, and our Pakistan page spends a paragraph explaining why that is not the comparison it looks like: the cheap Western Union number is Pakistan Remittance Initiative pricing, which is a home remittance scheme, and both Western Union\'s terms and the scheme itself describe that pricing as being for personal transfers rather than client payments. Western Union sold its business payments arm in 2022 and publishes no commercial rate for this corridor. So against things a freelancer can actually invoice through, Payoneer is the cheaper of what is left. Its 1% receive fee is reasonable and the undisclosed withdrawal conversion is what costs you. What keeps most Pakistani freelancers on it anyway is that Upwork, Fiverr and many direct US clients pay into it with no effort from the client, and a cheaper route you cannot persuade a client to use is not cheaper in practice.',
      },
      {
        q: 'Does the 1% receiving fee apply to Upwork and Fiverr payments?',
        a:
          'Payoneer\'s charge of 1% is on incoming commercial payments, which is what a marketplace payout is. The thing to watch is that the marketplace usually takes its own cut first, so the 1% applies to what reaches Payoneer rather than to what your client was invoiced, and the two can be a long way apart. Check what your Upwork or Fiverr statement says left the platform, not what the client paid, and apply the figures below to that.',
      },
      {
        q: 'Which Pakistani banks does a Payoneer withdrawal reach?',
        a:
          'Our Pakistan page records HBL, UBL, MCB and Meezan as working reliably, with HBL and Meezan having official real-time withdrawal integrations with Payoneer. There is also an announced Payoneer route to a JazzCash mobile wallet, marketed as near real time rather than the one to three days a bank withdrawal usually takes. Neither company publishes a clear fee for the wallet route and third-party guides disagree about what it costs, so check the fee and the rate quoted in your own account before using it. If you claim the 0.25% PSEB tax rate, confirm with your bank or tax adviser that a wallet withdrawal still gives you the documentation you need.',
      },
      {
        q: 'What is the Payoneer to JazzCash dollar rate today?',
        a:
          'There is no separate published rate for it. The JazzCash route is a Payoneer withdrawal to a mobile wallet instead of a bank, so the dollars are converted by Payoneer at its own rate, the same way as any rupee withdrawal, and neither company publishes a clear fee or rate for the wallet route. Third-party guides quote figures that disagree with each other. Before you use it, compare the rupee amount your Payoneer withdrawal screen shows for JazzCash with the amount it shows for your bank at the same moment. If the wallet amount is lower, the difference is the price of speed.',
      },
      {
        q: 'How often does this page update?',
        a:
          'The mid-market rate on it refreshes hourly from our rate source, and the date and time of the rate publication are printed next to it so you can see how fresh it is rather than trusting us. The Payoneer fee figures change far less often and are re-checked on a weekly rotation against Payoneer\'s own published pricing, with the last check date shown at the foot of the page. If you spot a figure that no longer matches Payoneer\'s own page, that is worth more to us than a compliment.',
      },
    ],
    publishedDate: '2026-10-26',
    updatedDate: '2026-10-26',
  },
  // Second page, on the same evidence rule as the first. GSC for 2026-07-29 to 2026-10-26 shows
  // the BDT corridor page already ranking for "payoneer dollar rate in bangladesh today" around
  // position 25 and "payoneer exchange rate usd to bdt" around 32, with "payoneer to bkash" near
  // 39. Every fact below is taken from the usd-to-bdt corridor entry, so the rotation's
  // corrections to that entry have to be carried here by hand until rate pages join it.
  {
    slug: 'payoneer-usd-to-bdt',
    providerSlug: 'payoneer',
    corridorSlug: 'usd-to-bdt',
    source: 'USD',
    destination: 'BDT',
    country: 'Bangladesh',
    title: 'Payoneer dollar rate in Bangladesh today',
    metaDescription:
      'Today\'s mid-market USD to BDT rate, what Payoneer\'s fees take out of it, and what reaches your Bangladeshi bank or bKash. Payoneer publishes no rate of its own.',
    h1: 'Payoneer USD to BDT rate today, and what you actually receive',
    intro:
      'Search for the Payoneer dollar rate in Bangladesh and you will find a different number on every site. None of them comes from Payoneer, because Payoneer does not publish one. What it publishes is a fee structure: 1% on a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace), then a conversion cost on withdrawal that it gives as a range of 1.2% to 4%, with nothing to say where the taka sits in that range. So this page does the one thing that can be checked. It shows today\'s mid-market USD to BDT rate with the date it was published, then applies Payoneer\'s published fees to a 500, 1,000 and 5,000 dollar payment withdrawn to a Bangladeshi bank account. The exact rate is the one your Payoneer withdrawal screen shows when you press the button. What we can tell you is roughly how far below the mid it will be, and why.',
    rateNote:
      'That is the interbank mid-market rate, the one Google shows and nobody actually pays out. It is the right yardstick because it has no margin in it, so any provider cost can be measured as a distance from it. Payoneer gives its conversion cost only as a band, 1.2% to 4%, and our figures below use 2.6%, the middle of the band, which is why they are marked as an estimate. If your withdrawal screen shows a rate near the mid you will do better than our table, and further away you will do worse.',
    faqs: [
      {
        q: 'What is the Payoneer USD to BDT rate today?',
        a:
          'Payoneer does not publish one. It charges 1% to receive a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace) and gives its withdrawal conversion cost as a range of 1.2% to 4%, and the only exact rate is the one in your account at the moment you withdraw. To plan, start from today\'s mid-market rate above and expect to lose somewhere around 2.2% to 5% of the payment across the two charges. Our table uses the middle of the published band and labels it an estimate, because a range is not a price.',
      },
      {
        q: 'Why is the Payoneer dollar rate lower than the bank rate?',
        a:
          'Usually because it is further from the mid-market rate. Bangladeshi banks convert an incoming wire at their TT buying rate, which banks do not usually publish as a distance from the mid (our Bangladesh table assumes about 1.5% below it), and Payoneer\'s conversion cost is given as 1.2% to 4%. But a bank rate is not the whole cost of a wire. Your client\'s US bank usually charges $25 to $45 to send it and an intermediary bank can take a cut, so on a $500 payment the wire can still lose more in total. On payments of a few thousand dollars the bank route often wins. Our Bangladesh page compares the two at different amounts.',
      },
      {
        q: 'Is Payoneer to bKash cheaper than Payoneer to a bank account?',
        a:
          'Usually not. The 1% receiving fee applies either way. After it, Payoneer charges roughly 3% plus $1 per transfer to convert for the bKash route as of mid 2026, against 1.2% to 4% for a bank withdrawal. Then bKash charges to cash out: 18.50 Taka per 1,000 at a standard agent, or 7 Taka per 1,000 if you cash out Payoneer money at a BRAC Bank, City Bank or participating Q-Cash ATM. On a $1,000 payment the bank route comes out about a percentage point ahead at the middle of Payoneer\'s range (about 3.6% against about 4.7% with the ATM cash-out), and the two only draw level if your Payoneer conversion lands at about 3.8%, near the top of the range. The bKash route is faster, usually a few hours instead of one to three business days. Check both fees in the Payoneer portal and the bKash app before you rely on these figures.',
      },
      {
        q: 'Does a Payoneer withdrawal count for the 2.5% freelancer incentive?',
        a:
          'Only a withdrawal to a bank account can, because the incentive needs a Foreign Inward Remittance Certificate and only a bank issues one. Payoneer to bKash produces no certificate, and bKash\'s own Payoneer page says the government incentive does not apply to that service. Bangladesh Bank confirmed the 2.5% rate for individual freelancers for the year from 1 July 2026, and these incentives are expected to be phased out around the country\'s graduation from least developed country status, so check the current position with your bank before counting on it.',
      },
      {
        q: 'How much can I send from Payoneer to bKash at once?',
        a:
          'bKash is reported to set a minimum of 1,000 Taka and a maximum of 250,000 Taka per transfer, which is a little over $2,000 at mid 2026 rates. A larger payout has to be split across several transfers or sent to a bank account instead. Check what the Payoneer withdrawal screen will accept before you plan around the bKash route, and make sure your bKash account is fully verified against the same name Payoneer holds for you, since a name mismatch is a common reason a first transfer fails.',
      },
      {
        q: 'How often does this page update?',
        a:
          'The mid-market rate refreshes hourly, with the publication date printed next to it. The Payoneer fees change far less often and come from the same data as our Bangladesh page, which is re-checked against Payoneer\'s published pricing on a weekly rotation. The last check date is at the foot of this page. If a figure here no longer matches what Payoneer shows you, tell us and we will fix it.',
      },
    ],
    publishedDate: '2026-10-26',
    updatedDate: '2026-10-27',
  },
];
