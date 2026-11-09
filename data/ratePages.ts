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
  // The line under the per-dollar estimate in the rate card: what the estimate is made of, in the
  // provider's published terms. It is copy, so it goes through verifier, reviewer and humanizer.
  estimateNote: string;
  // Why we do not print a provider rate. Rendered under the intro, after the rate card.
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
      'Today\'s mid-market USD to PKR rate, what Payoneer\'s published fees take out, and roughly what lands in your Pakistani bank account. Payoneer publishes no rate.',
    h1: 'Payoneer USD to PKR rate today, and what you can expect to receive',
    intro:
      'Payoneer does not publish a USD to PKR rate, so the two figures above are the ones that can be checked: today\'s mid-market rate, and what Payoneer\'s own published fees leave you per dollar. Those fees are 1% on a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace), then a conversion cost on withdrawal that Payoneer\'s fee schedule gives as a range of 1.2% to 4% rather than as a rate. A site quoting an exact Payoneer rate is usually showing the mid-market rate with Payoneer written next to it, or one person\'s screenshot from one day. Even the currency converter on Payoneer\'s own site says its rates do not represent Payoneer\'s exchange rates. The table below applies the same fees to a 500, 1,000 and 5,000 dollar payment on the way to your Pakistani bank account. The only exact rate is the one in your own Payoneer account at the moment you press withdraw, so what we can tell you is how big the gap will be and the two numbers it comes from.',
    estimateNote:
      'This is our estimate. It takes today\'s mid-market rate and removes Payoneer\'s 1% fee on a client payment and 2.6%, the middle of the 1.2% to 4% range its fee schedule gives for a withdrawal. Your own withdrawal screen shows the exact figure.',
    rateNote:
      'The mid-market rate is the interbank rate, the one you would see on Google or Reuters. It is the right starting point because it is the only rate with no margin in it, so every provider cost can be measured as a distance from it. Payoneer does not publish how far from the mid it converts. Its fee schedule gives the cost as a band, 1.2% to 4%, and a separate Payoneer explainer says up to 2% for a withdrawal to a local bank account in a different currency, so Payoneer\'s own pages disagree. Both our estimate above and the table below use 2.6%, the midpoint of the band in the fee schedule, which is why they are flagged as an estimate rather than a price. If your own withdrawal screen shows a rate near the bottom of that band you will do better than our figures say, and near the top you will do worse.',
    faqs: [
      {
        q: 'What is the Payoneer USD to PKR rate today?',
        a:
          'Payoneer does not publish one, and that is a real answer rather than a dodge. It charges 1% to receive a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace) and its fee schedule gives a withdrawal conversion cost as a range of 1.2% to 4%, with no public rate feed behind it. So the only exact rate is the one shown in your account at the moment you withdraw. What you can plan with is the gap: start from today\'s mid-market rate above, then, on a client payment, expect to lose roughly 2.2% to 5% of the payment across the two Payoneer charges together, and possibly more on a small payment, because the Payoneer fee schedule says that in some countries a minimum fee of up to 20.00 USD or equivalent may apply, and it does not say which. Our table models the midpoint of the published band because a range is not a price, and we flag it as an estimate for that reason.',
      },
      {
        q: 'What does Payoneer charge in Pakistan?',
        a:
          'On a client payment into your USD receiving account, withdrawn to a Pakistani bank account, expect to lose roughly 2.2% to 5% in total, which our table models at about 3.6%. That is two charges. Receiving the payment costs 1%, with a minimum of 1 USD. Withdrawing it as rupees costs what Payoneer\'s fee schedule, last updated 1 January 2026, gives as a range of 1.2% to 4%, and a separate Payoneer explainer says up to 2% for the same kind of withdrawal. A payout from Upwork, Fiverr or another marketplace is not necessarily priced at 1%: the schedule says only that it varies by marketplace. If a client pays a Payoneer payment request by credit card, the schedule lists up to 3.99% plus 0.49 USD, and Payoneer\'s help centre says the client can choose who pays that fee. Pakistan is not on the list of countries that get Payoneer\'s flat 1.50 USD withdrawal. Two other charges can apply: an annual account fee of 29.95 USD if your account receives less than 6,000 USD in any 12 consecutive months, and a minimum withdrawal fee of up to 20 USD, which the schedule says may apply in some countries without naming them. The Fees section inside your own Payoneer account shows what applies to you.',
      },
      {
        q: 'Why is the Payoneer exchange rate lower than the rate on Google?',
        a:
          'Because the rate on Google is the mid-market rate, which has no margin in it. Some providers, Wise among them, convert at that rate and show their fee separately. Payoneer takes its conversion cost inside the rate it gives you rather than showing it as a separate line, which is why the two numbers never match and why the difference is easy to miss. That is also why we price everything on this site as a distance from the mid rather than quoting rates: a rate quoted without the mid next to it tells you nothing about what it costs.',
      },
      {
        q: 'What exchange rate does Payoneer use?',
        a:
          'Its own. Payoneer converts at a rate it sets, which sits some distance below the mid-market rate, and its fee schedule describes that distance as a band of 1.2% to 4% for a withdrawal, while a separate Payoneer explainer says up to 2% for a withdrawal to a local bank account in a different currency. Neither page says where Pakistani rupees fall, and Payoneer does not publish the rate itself anywhere outside your account. The closest you can get to checking it is what this page does: take the mid-market rate at the moment you withdraw, compare it with the rate on your withdrawal screen, and the difference is what the conversion cost you.',
      },
      {
        q: 'Is Payoneer the cheapest way to get USD into a Pakistani bank account?',
        a:
          'For a client payment, yes, at every amount on this page. Payoneer is the cheapest of the routes we rank for Pakistan. Our Pakistan page does show one lower price, from Western Union, but lists it without ranking it: that number is Pakistan Remittance Initiative pricing, a home remittance scheme, and both Western Union\'s terms and the scheme itself describe it as being for personal transfers rather than client payments. Western Union publishes no commercial rate for this corridor. Payoneer\'s 1% fee on a client payment is reasonable, and its withdrawal conversion, which its fee schedule gives only as a 1.2% to 4% band and never as a rate, is what costs you. What keeps most Pakistani freelancers on it anyway is that Upwork, Fiverr and many direct US clients pay into it with no effort from the client, and a cheaper route you cannot persuade a client to use is not cheaper in practice.',
      },
      {
        q: 'Does the 1% receiving fee apply to Upwork and Fiverr payments?',
        a:
          'Not necessarily. Payoneer\'s 1% (minimum 1 USD) is its fee for a client payment into your USD receiving account. For payouts from a marketplace such as Upwork or Fiverr, its fee schedule says only that the fee varies by marketplace, so check what Payoneer actually charged on one of your own payouts rather than assuming 1%. The marketplace also takes its own cut first, so any Payoneer fee comes out of what left the platform, not what your client was invoiced. The table on this page assumes the 1% client payment fee. For a marketplace payout, read the row closest to what your Upwork or Fiverr statement says left the platform, then adjust: if Payoneer charged less than 1%, you keep a little more than the table shows, and if it charged more, a little less.',
      },
      {
        q: 'Which Pakistani banks does a Payoneer withdrawal reach?',
        a:
          'Our Pakistan page records HBL, UBL, MCB and Meezan as working reliably, with HBL and Meezan having official real-time withdrawal integrations with Payoneer. There is also an announced Payoneer route to a JazzCash mobile wallet, marketed as near real time rather than the one to three days a bank withdrawal usually takes. Neither company publishes a clear fee for the wallet route and third-party guides disagree about what it costs, so check the fee and the rate quoted in your own account before using it. If you claim the 0.25% PSEB tax rate, confirm with your bank or tax adviser that a wallet withdrawal still gives you the documentation you need.',
      },
      {
        q: 'What is the Payoneer to JazzCash dollar rate today?',
        a:
          'There is no separate published rate for it. The JazzCash route is a Payoneer withdrawal to a mobile wallet instead of a bank, so the dollars are converted by Payoneer at its own rate, the same way as any rupee withdrawal, and neither company publishes a clear fee or rate for the wallet route. Third-party guides quote figures that disagree with each other. Before you use it, compare the rupee amount your Payoneer withdrawal screen shows for JazzCash with the amount it shows for your bank at the same moment. If the wallet amount is lower, the difference is the price of speed. Do not confuse this with the Request a Payment option in the JazzCash app. That sends your client a Payoneer payment link, and the money lands in your Payoneer account, not the wallet, so you still withdraw it afterwards.',
      },
      {
        q: 'How often does this page update?',
        a:
          'The mid-market rate on it refreshes hourly from our rate source, and the date and time of the rate publication are printed next to it so you can see how fresh it is rather than trusting us. The Payoneer fee figures change far less often and are re-checked on a weekly rotation against Payoneer\'s own published pricing, with the last check date shown at the foot of the page. If you spot a figure that no longer matches Payoneer\'s own page, that is worth more to us than a compliment.',
      },
    ],
    publishedDate: '2026-10-26',
    updatedDate: '2026-11-04',
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
      'Today\'s mid-market USD to BDT rate, what Payoneer\'s fees take out, and roughly what reaches your Bangladeshi bank or bKash. Payoneer publishes no rate.',
    h1: 'Payoneer USD to BDT rate today, and what you can expect to receive',
    intro:
      'Payoneer does not publish a dollar rate for Bangladesh, and the numbers other sites quote for it tend to differ. The two figures above are the ones that can be checked: today\'s mid-market USD to BDT rate, and what Payoneer\'s published fees leave you per dollar. Those fees are 1% on a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace), then a conversion cost on withdrawal that Payoneer\'s fee schedule gives as a range of 1.2% to 4%, with nothing to say where the taka sits in that range. The table below applies them to a 500, 1,000 and 5,000 dollar payment withdrawn to a Bangladeshi bank account. The exact rate is the one your Payoneer withdrawal screen shows when you press the button.',
    estimateNote:
      'This is our estimate. It takes today\'s mid-market rate and removes Payoneer\'s 1% fee on a client payment and 2.6%, the middle of the 1.2% to 4% range its fee schedule gives for a withdrawal. Your own withdrawal screen shows the exact figure.',
    rateNote:
      'The mid-market rate is the interbank rate Google shows. It is the right yardstick because it has no margin in it, so any provider cost can be measured as a distance from it. Payoneer\'s fee schedule gives the withdrawal cost as a band, 1.2% to 4%, while a separate Payoneer explainer says up to 2% for a withdrawal to a local bank account in a different currency, so Payoneer\'s own pages disagree. Both our estimate above and the table below use 2.6%, the middle of the band in the fee schedule, which is why they are marked as an estimate. If your withdrawal screen shows a rate less than 2.6% below the mid you will do better than our figures, and further below than that you will do worse.',
    faqs: [
      {
        q: 'What is the Payoneer USD to BDT rate today?',
        a:
          'Payoneer does not publish one. It charges 1% to receive a client payment into a USD receiving account (fees on marketplace payouts vary by marketplace) and its fee schedule gives the withdrawal conversion cost as a range of 1.2% to 4%. The only exact rate is the one in your account at the moment you withdraw. To plan, start from today\'s mid-market rate above and, on a client payment, expect to lose somewhere around 2.2% to 5% of the payment across the two charges, and possibly more on a small payment, because the Payoneer fee schedule says that in some countries a minimum fee of up to 20.00 USD or equivalent may apply, and it does not say which. Our table uses the middle of the published band and labels it an estimate, because a range is not a price.',
      },
      {
        q: 'What is Payoneer\'s currency conversion fee?',
        a:
          'Payoneer\'s fee schedule lists three, and the 0.5% you often see quoted is not the one you pay when you withdraw to taka. Converting between your own Payoneer balances, say dollars to euros, costs 0.5% on that schedule, last updated 1 January 2026. Withdrawing dollars to a Bangladeshi bank account as taka is priced separately: the schedule gives it as a range of 1.2% to 4%, and a separate Payoneer explainer says up to 2%; our table uses 2.6%, the middle of the schedule\'s range. A Payoneer card, if your account is eligible for one, charges up to 3.5% on a purchase that needs a currency conversion, and 3.15 USD plus up to 3.5% on a cash withdrawal that does. If you are paid in dollars and withdraw them to a Bangladeshi bank account as taka, the bank withdrawal charge is the one that matters, on top of the 1% Payoneer takes when a client pays into your USD receiving account.',
      },
      {
        q: 'Why is the Payoneer dollar rate lower than the bank rate?',
        a:
          'Usually because it is further from the mid-market rate. Bangladeshi banks convert an incoming wire at their TT buying rate, which banks do not usually publish as a distance from the mid (our Bangladesh table assumes about 1.5% below it), and Payoneer\'s fee schedule gives its conversion cost as 1.2% to 4%. But a bank rate is not the whole cost of a wire. Your client\'s US bank usually charges $25 to $45 to send it and an intermediary bank can take a cut, so on a $500 payment the wire can still lose more in total. On payments of a few thousand dollars the bank route often wins. Our Bangladesh page compares the two at different amounts.',
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
    updatedDate: '2026-11-09',
  },
];
