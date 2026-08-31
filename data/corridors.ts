// Central corridor registry — every corridor page lives here.
// The sitemap, pillar page, and corridor page templates all import from this file.

export interface CorridorProviderEntry {
  slug: string;
  name: string;
  available: boolean;
  notes: string;
  customHeading?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Corridor {
  slug: string;
  source: string;           // ISO currency code of sender, e.g. 'USD'
  sourceCountry: string;    // CountryCode of sender, e.g. 'US'
  destination: string;      // ISO currency code of recipient, e.g. 'PKR'
  destCountry: string;      // CountryCode of recipient, e.g. 'PK'
  country: string;          // Display name, e.g. 'Pakistan'
  title: string;            // <title> — keep under 60 chars
  metaDescription: string;  // meta description — keep under 160 chars
  h1: string;
  intro: string;            // answer capsule — 2–3 sentences, direct answer
  publishedDate: string;    // ISO date
  updatedDate: string;      // ISO date
  providers: CorridorProviderEntry[];  // all relevant providers, including unavailable ones
  supportedProviders: string[];        // slugs of providers that actually support this corridor
  faqs: Faq[];
  siblingCorridors?: string[];  // slugs of related corridors for internal linking
  // Some destinations let a recipient hold foreign currency rather than convert on
  // arrival (Georgian USD/EUR sub-accounts, Thai FCD accounts). The receiving
  // currencies themselves come from DEST_CURRENCIES_MAP in lib/calculate.ts; this is
  // the one sentence of page copy explaining what that means for this country.
  altReceivingNote?: string;
}

export const CORRIDORS: Corridor[] = [
  {
    slug: 'usd-to-pkr',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'PKR',
    destCountry: 'PK',
    country: 'Pakistan',
    title: 'Receive USD in Pakistan: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Pakistan. Payoneer charges ~3% all-in; PayPal and Wise are not available. Live FX rates, worked example, and provider comparison.',
    h1: 'How to receive USD in Pakistan: fees, FX spread, and what you actually net',
    intro:
      'Pakistani freelancers have fewer options than most -- PayPal has never launched in Pakistan and Pakistani residents cannot open a Wise account for receiving. Payoneer is the dominant choice at up to about 3% all-in (1% fee + up to 2% FX markup on PKR withdrawal). Western Union advertises a $0 online fee for bank deposits over $200 and a roughly 2% FX spread, but that pricing runs through the Pakistan Remittance Initiative, a home remittance scheme aimed at personal transfers rather than business payments, so it is not a like-for-like price for client invoices. Payoneer remains the standard for recurring freelance income.',
    publishedDate: '2026-06-03',
    updatedDate: '2026-08-10',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant choice for Pakistani freelancers receiving from Upwork, Fiverr, Toptal, and direct US clients. Payoneer charges 1% on incoming commercial payments. When you withdraw your Payoneer balance to a local PKR bank account, Payoneer applies an FX conversion at up to 2% above mid-market, giving a typical all-in cost of up to about 3% (1% receiving fee plus up to 2% FX markup). Requires identity verification (CNIC or passport). Works reliably with HBL, UBL, MCB, and Meezan Bank; HBL and Meezan have official real-time withdrawal integrations with Payoneer. Payoneer also has an announced partnership with JazzCash: you can send your Payoneer balance to a JazzCash mobile wallet instead of a bank account, and the route is marketed as near real time rather than the 1--3 days a bank withdrawal typically takes. Neither company publishes a clear fee for it and third-party guides disagree on what it costs, so check the fee and rate quoted in your Payoneer account before withdrawing. If you claim the 0.25% PSEB tax rate, also confirm with your bank or tax adviser that a wallet withdrawal gives you the documentation you need.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Available for bank deposit to major Pakistani banks, but the pricing it advertises here is personal remittance pricing, not a price for client payments. Pakistan is a Pakistan Remittance Initiative (PRI) corridor: Western Union advertises a $0 online transfer fee for bank deposits over $200, and third-party rate comparisons put its USD-to-PKR markup at roughly 2% below mid-market. PRI is a home remittance scheme. Western Union and the other operators in it describe that pricing as applying to personal transfers rather than business transactions, and Western Union\'s consumer terms describe the service as being for personal use; Western Union sold its business payments arm (now Convera) in 2022 and publishes no commercial rate for this corridor. So comparing it against Payoneer\'s commercial rate is not like for like. There is also a paperwork risk: money that arrives as a home remittance is not tagged as export of services, which is the classification your bank needs for the 0.25% PSEB rate. Payoneer stays the default for recurring client income; if you want to use Western Union anyway, confirm with Western Union and your bank how the transfer would be classified and what it would cost.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'SWIFT wires reach all major Pakistani banks (HBL, UBL, MCB, Allied Bank, Bank Alfalah). The problem is the flat fee: most US banks charge $25--45 to send an outgoing international wire, and incoming charges on the Pakistani side vary by bank and transfer type (check your bank\'s current schedule of charges). On a $1,000 transfer, the sending fee alone represents 2.5--4.5% of the amount. The bank\'s FX spread on converting USD to PKR typically adds a few percent more; banks do not publish exact spreads. Bank wires make sense for large one-time payments over $5,000 where the flat fee becomes a smaller percentage, but they are impractical for regular freelance invoices.',
      },
      {
        slug: 'wise',
        name: 'Wise',
        available: false,
        notes:
          'Pakistani residents cannot open a Wise account to receive payments -- Pakistan is on Wise\'s restricted-country list as of 2026. However, this does not mean Wise is useless for you: if your US client sends payment via Wise directly to your Pakistani bank account (entering your IBAN/account number rather than a Wise account), they pay Wise\'s fee and you receive PKR at Wise\'s mid-market rate with no recipient-side cost. The limitation is that the convenience of a Wise account (balance, payment link, reusable receiving details) is not available to Pakistani recipients.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Revolut is not licensed to operate in Pakistan. Pakistani residents cannot hold a Revolut account or use Revolut as a receiving method for international payments.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: false,
        notes:
          'PayPal has never officially launched in Pakistan. Pakistan is not in PayPal\'s supported-country list, so Pakistani residents cannot open a standard PayPal account with a local address, phone number, or bank account at all, and no receiving functionality exists. Government overtures to bring PayPal to Pakistan have not produced a launch as of 2026. Do not list PayPal as a payment method for your international clients -- you will not receive the money.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi accounts are limited to a fixed, short eligibility list of countries (mostly Latin America plus the US, UK, India, Nigeria, and a few others; the exact count has varied across GrabrFi\'s own published lists). Pakistan is not a supported country.',
      },
    ],
    supportedProviders: ['payoneer', 'western-union', 'bank-wire'],
    faqs: [
      {
        q: 'Can I use Wise to receive USD in Pakistan?',
        a: 'Not as a Wise account holder. Wise does not allow Pakistani residents to open accounts for receiving payments -- Pakistan is a restricted country. You cannot get a Wise account number to share with clients. However, your US client can use Wise to send money directly to your Pakistani bank account by entering your bank details. In that case, the client pays Wise\'s fee (typically 0.5--1.5% depending on the amount) and you receive PKR converted at Wise\'s mid-market rate. The FX markup on your side is zero. The practical limitation is that your client needs to be willing to do this manually each time rather than just clicking a payment link.',
      },
      {
        q: 'Is PayPal available for freelancers in Pakistan?',
        a: 'No. PayPal has never officially launched in Pakistan. Pakistan is absent from PayPal\'s supported-country list, so you cannot open a standard PayPal account with a Pakistani address, phone number, or bank account, and no receiving functionality exists. Despite repeated government efforts to bring PayPal to Pakistan, no launch has occurred as of 2026. If a client offers to pay via PayPal, ask for Payoneer or a bank wire instead.',
      },
      {
        q: 'What is the cheapest way to receive USD in Pakistan?',
        a: 'For Pakistani residents, Payoneer is the cheapest widely-available option at up to about 3% all-in (1% receiving fee plus up to 2% FX markup on PKR withdrawal). The even cheaper approach -- if your client is cooperative -- is to ask them to send via Wise directly to your Pakistani bank account. In that scenario, the recipient cost is zero and the client pays roughly 0.5--1.5% on their end. This does not work on platforms like Upwork or Fiverr that have their own payment processing, but it works for direct clients who invoice you. If you earn on Upwork specifically, price its own Direct to Local Bank withdrawal before defaulting to Payoneer: it pays PKR into a Pakistani bank account for a flat fee widely reported at $0.99, arriving within about four business days. We could not open Upwork\'s own fee page to confirm that figure. The catch is the rate, not the fee: Upwork states that its payment partners set the exchange rate and may add a markup, and it does not publish what that markup is, so a $0.99 flat fee on its own does not make this cheaper than Payoneer. Compare the PKR figure Upwork quotes you against the mid-market rate on the day, and if you claim the 0.25% PSEB rate, ask your bank how a Direct to Local Bank deposit is classified before switching.',
      },
      {
        q: 'How long does it take to receive international payments in Pakistan?',
        a: 'Payoneer to a local PKR bank account: within minutes via the real-time HBL or Meezan Bank app integrations, or typically 1--3 business days for a standard bank withdrawal, sometimes longer; Payoneer does not publish a guaranteed time for Pakistan, so treat any figure as indicative. Payoneer balance to balance is near-instant. Western Union bank deposit: 1--3 business days. SWIFT wire from a US bank to a Pakistani bank: 3--7 business days, sometimes longer if intermediate correspondent banks add delays. The Pakistan banking system adds no unusual delays compared to other developing-country corridors.',
      },
      {
        q: 'Do I need to declare international freelance income to FBR?',
        a: 'Yes. Income received from foreign clients is taxable in Pakistan and must be declared to the Federal Board of Revenue (FBR). Under Section 154A of the Income Tax Ordinance, IT and IT-enabled services export proceeds are subject to a 0.25% final withholding tax for exporters registered with the Pakistan Software Export Board (PSEB), versus roughly 1% if unregistered, conditional on receiving proceeds through banking channels. The Finance Act 2026 extended the 0.25% rate through Tax Year 2029. Rules change with each annual budget. Consult a Pakistani tax professional -- this site covers fees, not tax, and the regulatory landscape changes too frequently to summarize reliably.',
      },
      {
        q: 'Which Pakistani banks work best with Payoneer?',
        a: 'HBL, UBL, MCB, Meezan Bank, and Bank Alfalah are the most commonly reported to work without issues; Faysal Bank is also frequently mentioned. HBL and Meezan Bank have official real-time withdrawal integrations with Payoneer, making them the fastest routes. The main requirement is that the account is in your legal name exactly as it appears in your Payoneer verification documents (CNIC or passport). Joint accounts or accounts with name mismatches can cause delays or rejections.',
      },
    ],
    siblingCorridors: ['usd-to-bdt', 'usd-to-ngn', 'usd-to-php'],
  },

  // ─── USD → Bangladesh (BDT) ────────────────────────────────────────────────
  {
    slug: 'usd-to-bdt',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'BDT',
    destCountry: 'BD',
    country: 'Bangladesh',
    title: 'Receive USD in Bangladesh: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Bangladesh. Payoneer is the main option (~3–5% all-in); PayPal can\'t receive and Wise is receive-only. Live FX + worked example.',
    h1: 'How to receive USD in Bangladesh: fees, FX spread, and what you actually net',
    intro:
      'Bangladeshi freelancers receive primarily via Payoneer (~3-5% all-in for bank account withdrawal), and the most popular local step after that is Payoneer to bKash. Payoneer has a direct bKash integration that moves your balance to a bKash wallet typically within hours, though Payoneer charges a higher conversion fee for this route than for bank withdrawals (approximately 3% plus $1 per transaction as of mid-2026; verify in the Payoneer portal before withdrawing). Bank account withdrawal takes 1-3 business days and generates the Foreign Inward Remittance Certificate (FIRC) required to claim the export cash incentive. PayPal cannot receive commercial payments in Bangladesh, and Wise is not available to Bangladeshi account holders (though a foreign client using Wise can push BDT directly to your bank account, bKash wallet, or Nagad wallet).',
    publishedDate: '2026-06-04',
    updatedDate: '2026-08-10',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant route for Bangladeshi freelancers on Upwork, Fiverr, and direct invoicing. Payoneer charges 1% on incoming commercial payments. When you withdraw to a local BDT bank account, Payoneer applies an FX conversion at roughly 1.2%-4% (the official fee schedule, updated January 2026, states this range; roughly 2% is a representative midpoint). Same-currency USD-to-USD withdrawal is a flat $1.50 instead. You can also withdraw directly to a bKash wallet via Payoneer\'s bKash integration; Payoneer charges a separate conversion fee for this route (approximately 3% plus $1 per transaction as of mid-2026; verify in the Payoneer portal, as this differs from the standard bank withdrawal fee). On the bKash side, cashing out costs 18.50 Taka per 1,000 (1.85%) at a standard agent, but the bKash Payoneer page advertises 7 Taka per 1,000 (0.70%) for cashing out Payoneer-received funds at BRAC Bank, City Bank and participating Q-Cash ATM booths via the bKash app or *247#, so the channel you use matters. See the Payoneer-to-bKash section for the conditions, and check the bKash charge calculator before assuming any specific number. The bKash route is fast but does not generate a Foreign Inward Remittance Certificate (FIRC), which is required to claim the export cash incentive and fund an ERQ foreign-currency account. Annual account fee: $29.95/year, charged only if the account receives less than Payoneer\'s minimum activity threshold in any 12 consecutive months; Payoneer\'s help center currently states $6,000, though it has cited $2,000 elsewhere, so verify the current Bangladesh threshold in the Payoneer portal. Typical all-in cost for bank account withdrawal: 3-5%.',
      },
      {
        slug: 'bkash-withdrawal',
        name: 'Payoneer-to-bKash',
        customHeading: 'How the Payoneer-to-bKash withdrawal works',
        available: true,
        notes:
          'Payoneer has a direct integration with bKash that lets Bangladeshi freelancers transfer their Payoneer balance to a bKash wallet without first withdrawing to a bank account. In the Payoneer portal or app, you initiate a withdrawal, select bKash as the destination, enter your bKash-registered phone number, and confirm. The transfer typically completes within a few hours. There is a floor and a ceiling on each transfer: bKash is reported to set a minimum of BDT 1,000 and a maximum of BDT 250,000 per transaction, a little over $2,000 at mid-2026 exchange rates. A single client payout larger than that has to be split across several transfers or taken to a bank account instead, so check the amount the Payoneer withdrawal screen will accept before you plan around this route. Payoneer charges a separate conversion fee for this route: approximately 3% plus $1 per transaction as of mid-2026. This is higher than the standard bank account withdrawal route (1% plus roughly 2% FX markup), so the bKash route usually costs more in fees despite being faster. Always verify the current fee in the Payoneer portal before withdrawing. On the bKash side, what you pay to take the money out depends on the channel, and the gap is wide. A standard bKash agent charges 18.50 Taka per 1,000 (1.85%), VAT included. The bKash Payoneer page and the bKash remittance ATM page both state that money received from Payoneer can be cashed out for 7 Taka per 1,000 (0.70%) at BRAC Bank, City Bank and participating Q-Cash ATM booths, using the bKash app or *247#, a rate those pages date to 19 March 2024. The discount is tied to the Payoneer or remittance balance itself: bKash states that a withdrawal exceeding that balance, or the same money taken out at an agent rather than an ATM, is charged at the regular rate. There is also a lower Priyo Agent rate on up to 50,000 Taka per month (the bKash Priyo Agent page has shown 14.90 Taka per 1,000, and Bangladeshi outlets reported a cut to 13.95 in July 2026), so check which applies to you. We could not open bkash.com directly to confirm these figures, so check the bKash charge calculator and the app before assuming any specific number. The bKash route does not generate a Foreign Inward Remittance Certificate (FIRC), so it is not eligible for the Bangladesh Bank export cash incentive. To qualify for the incentive, you must withdraw to a bank account. For Nagad: Nagad is not a direct Payoneer withdrawal destination as of mid-2026. A foreign client using Wise can push BDT to a Nagad wallet at Wise\'s mid-market rate with no receiving cost to you, but this requires your client to do it manually and does not work on Upwork or Fiverr. Rocket (Dutch-Bangla Bank mobile wallet) supports inbound personal remittances but is not a standard channel for collecting freelance client payments.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'SWIFT wires to Bangladeshi banks (City Bank, Mutual Trust Bank, Midland Bank, Standard Chartered Bangladesh, Dutch-Bangla Bank) are the formal route that generates a Foreign Inward Remittance Certificate (FIRC), which is required to claim the export cash incentive and to fund an Exporter\'s Retention Quota (ERQ) foreign-currency account. The bank converts at the TT Buying Rate, typically 1–2% below mid-market. A typical US bank outgoing wire costs $25–45 flat, and a possible $15–30 correspondent bank deduction can reduce the amount further. On small amounts ($500–2,000) the flat fee dominates; on larger sums ($5,000+) the flat fee becomes negligible and the TT spread is competitive. City Bank, Mutual Trust Bank (MTB), and Midland Bank offer dedicated Freelancer accounts bundling a BDT current account with an ERQ sub-account.',
      },
      {
        slug: 'wise',
        name: 'Wise',
        available: false,
        notes:
          'Bangladeshi residents cannot open a Wise account, cannot hold USD in a Wise wallet, and cannot get Wise receiving details to share with clients. However, Wise is available as a sending tool for your foreign client: a US client can use Wise to push BDT directly to your Bangladeshi bank account, bKash wallet, or Nagad wallet at Wise\'s mid-market rate: the client pays roughly 0.7–1.9% on their end and your receiving cost is zero. This workaround is useful for direct clients willing to set it up manually, but it does not work on freelance platforms (Upwork, Fiverr) that process payments through their own systems.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: false,
        notes:
          'PayPal commercial receiving is not available in Bangladesh. Only Xoom (a PayPal subsidiary) operates in Bangladesh, and Xoom explicitly states it supports person-to-person inbound remittance only: it does not support transactions for goods or business purposes. A freelancer cannot receive client project payments into a PayPal account in Bangladesh. Note: the availability of the Payoneer-PayPal workaround (receiving PayPal payments via Payoneer) for Bangladesh-registered accounts is unclear as of mid-2026; reports conflict on whether Payoneer\'s PayPal-receiving rollout covers Bangladesh, so check your own Payoneer dashboard for a PayPal option rather than relying on it. Government statements about a full PayPal launch have recurred for years, and on 29 July 2026 Bangladesh Bank issued a circular letting banks partner with cross-border digital payment providers and open Digital Value Accounts (stored-value wallets) for customers, with each partnership needing prior clearance from the central bank\'s Foreign Exchange Policy Department; news coverage names PayPal and Payoneer as the obvious candidates. That is a regulatory pathway, not a launch: no bank has announced a live PayPal service under it as of early August 2026, and early reporting frames the framework mainly around outward payments rather than receiving client income. Treat PayPal as unavailable for receiving and plan billing around Payoneer and bank wire, and watch for a bank announcement under this framework.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Revolut is not licensed to operate in Bangladesh. Bangladeshi residents cannot open a Revolut account or use Revolut as a receiving method for international payments.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi accounts are limited to a fixed, short eligibility list of countries (mostly Latin America plus the US, UK, India, Nigeria, and a few others; the exact count has varied across GrabrFi\'s own published lists). Bangladesh is not a supported country.',
      },
    ],
    supportedProviders: ['payoneer', 'bank-wire'],
    faqs: [
      {
        q: 'What is the cheapest way to receive USD in Bangladesh?',
        a: 'For most Bangladeshi freelancers, Payoneer to a local bank account is the cheapest widely available option at roughly 3–5% all-in (1% receiving fee plus 1.2–4% FX markup on BDT withdrawal). If your direct client is willing to cooperate, asking them to use Wise to push BDT to your bank account, bKash, or Nagad costs you nothing: the client pays roughly 0.7–1.9% on their end. This does not work on Upwork or Fiverr. For large, infrequent payments over $5,000, a SWIFT bank wire becomes cost-competitive once the flat fee is spread over the larger amount, and it generates the FIRC documentation needed for the export cash incentive.',
      },
      {
        q: 'Does the 2.5% remittance incentive apply to freelancing?',
        a: 'No. The widely-known 2.5% government cash incentive is the Wage-Earner Remittance scheme for overseas Bangladeshis sending personal remittances home: it does not apply to freelance or IT earnings. Freelancers fall under a separate export cash incentive: Bangladesh Bank confirmed unchanged rates for FY2026-27 (covering earnings from 1 July 2026 to 30 June 2027) at 2.5% for individual freelancers and 6% for registered software/ITES firms. This incentive is only claimable via proper banking channels with a FIRC. Payoneer-to-bKash withdrawals do not qualify, and bKash\'s own Payoneer page states that the government\'s 2.5% incentive does not apply to that service. A Bangladesh Bank circular dated 22 July 2026 widened freelancers\' use of mobile financial service and payment service providers and lets platform statements stand as proof of foreign income, but reporting on it does not mention the cash incentive procedure, so treat the bank route as the only one we can confirm qualifies. Importantly, these incentives are expected to be phased out around Bangladesh\'s LDC graduation to comply with WTO rules. Bangladesh\'s graduation date is still officially 24 November 2026. The UN Committee for Development Policy recommended deferring it to 24 November 2029, and on 21 July 2026 the UN Economic and Social Council adopted a consensus decision referring the request to the UN General Assembly and asking it to decide before 24 November 2026. The Assembly\'s new session opens in September 2026, so the final answer is expected in the autumn. Verify the current rate and eligibility before relying on it.',
      },
      {
        q: 'Can I keep my earnings in dollars (ERQ account)?',
        a: 'Yes, and the limit went up recently. A Bangladesh Bank Foreign Exchange Policy Department circular dated 22 July 2026 lets freelancers in the ICT sector retain up to 50% of export earnings in foreign currency via an Exporter\'s Retention Quota (ERQ) account, and up to 30% for other service exporters; the remainder auto-converts to BDT. The previous ICT ceiling was 35%, itself a cut from 70% made in September 2023, so a bank website still showing either figure is out of date. Bangladeshi outlets including the state news agency BSS report the change consistently, but it is very recent: confirm with your bank that it has implemented the new limit before counting on it, and if you export through a registered ICT company rather than as an individual freelancer, ask which of the two percentages applies to you. The same circular also lets freelancers use platform statements, invoices, and emails as proof of foreign income, sets a $20,000 threshold below which inward remittances can be credited without a formal declaration, and sets a $10,000 per-transaction limit for payments through Online Payment Gateway Service Providers (OPGSPs). City Bank, Mutual Trust Bank (MTB), and Midland Bank all offer dedicated Freelancer accounts that include an ERQ foreign-currency sub-account. Retaining dollars is useful if you have USD-denominated expenses or want to avoid unfavorable conversion timing.',
      },
      {
        q: 'How long does it take to receive payments in Bangladesh?',
        a: 'Payoneer to a local BDT bank account: typically 1–3 business days after the payment clears on the sender\'s side. Payoneer to bKash: typically instant or within a few hours. SWIFT bank wire to a Bangladeshi bank: 1–3 business days in most cases; can be longer if correspondent banks are involved. Most Bangladeshi banks have improved SWIFT processing and straightforward USD→BDT wires usually settle within 2 business days.',
      },
      {
        q: 'Do I have to pay income tax on foreign freelance earnings?',
        a: 'IT and ITES freelance and business income is income-tax exempt through 30 June 2027 under the Finance Act 2024 / Income Tax Act 2023, Schedule 6. This exemption has two conditions: (a) filing an income tax return even if no tax is owed, and (b) operating cashless: all business income, expenses, and investments must move through bank transfer. Important: this covers independent freelance and business income from IT/ITES work; it does NOT apply to a salaried remote employee of a foreign employer. Rules change with each annual Finance Act. The Finance Act 2026 took effect on 1 July 2026 and, on the reporting we can see, left the 30 June 2027 end date in place; confirm the position for your own filing year. Consult a Bangladeshi tax professional; this site covers transfer fees, not tax.',
      },
      {
        q: 'Can I receive Payoneer payments directly into bKash or Nagad?',
        a: 'Yes for bKash. Payoneer has a direct bKash integration: in the Payoneer portal or app, you can initiate a withdrawal to your bKash wallet by entering your bKash-registered phone number. Two things trip people up on the first attempt. Your bKash account has to be fully KYC verified against your National ID (NID) rather than left at the basic level, and the identity on that NID has to match the identity Payoneer holds for you, including how your name is spelled. A mismatch between the two is a common reason a first transfer is rejected, so correct the spelling on whichever side is wrong before retrying rather than simply sending again. Payoneer charges approximately 3% plus $1 per transaction for this route as of mid-2026 (verify in the Payoneer portal before withdrawing, as this fee differs from the bank account withdrawal fee). On the bKash side, cashing out at a standard agent costs 18.50 Taka per 1,000 (1.85%), while the bKash Payoneer page advertises 7 Taka per 1,000 (0.70%) for cashing out Payoneer-received funds at BRAC Bank, City Bank and participating Q-Cash ATM booths; check the bKash charge calculator and the app for current rates and conditions. This route is typically fast (a few hours) but does not generate a FIRC, so it does not qualify for the export cash incentive. For Nagad: Nagad is not a direct Payoneer withdrawal destination as of mid-2026. A foreign client using Wise can push BDT to a Nagad wallet at mid-market rate at no receiving cost to you. Rocket (Dutch-Bangla Bank wallet) supports inbound personal remittances but is not used as a freelance payment collection channel.',
      },
      {
        q: 'Which is better: Payoneer to bank account or to bKash?',
        a: 'The bank account route is cheaper for most transfers: Payoneer charges a higher conversion fee for the bKash route (approximately 3% plus $1) than for bank account withdrawals (1% plus roughly 1.2%-4% FX markup, typical all-in 3-5%). The bKash side adds a cash-out charge on top: 18.50 Taka per 1,000 (1.85%) at a standard agent, or 7 Taka per 1,000 (0.70%) if you withdraw Payoneer-received funds at a BRAC Bank, City Bank or participating Q-Cash ATM. Even at the cheaper ATM rate the bank route usually still comes out ahead at a typical 2% FX markup (roughly 3% all-in against roughly 3.8%), but the two are close, and if your Payoneer FX lands near the top of its 1.2%-4% range the bKash-plus-ATM route can match it. If you do use bKash, cash out at one of those ATMs rather than at an agent. The bKash route is faster, typically settling within hours rather than 1-3 business days. For claiming the export cash incentive or funding an ERQ account, you must use the bank route: bKash withdrawals do not generate a Foreign Inward Remittance Certificate (FIRC). A practical split: use the bKash route for small, urgent withdrawals when you need cash quickly; route your main income through a bank account for savings, incentive claims, and ERQ.',
      },
    ],
    siblingCorridors: ['usd-to-pkr', 'usd-to-ngn', 'usd-to-php'],
  },

  // ─── USD → Nigeria (NGN) ───────────────────────────────────────────────────
  {
    slug: 'usd-to-ngn',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'NGN',
    destCountry: 'NG',
    country: 'Nigeria',
    title: 'Receive USD in Nigeria: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Nigeria in 2026. Cleva, Grey, LemFi, and Raenest offer near mid-market rates. Payoneer costs more. Live FX and worked example.',
    h1: 'How to receive USD in Nigeria: fees, FX spread, and what you actually net',
    intro:
      'Nigerian freelancers now have strong specialist options: Cleva, Grey, LemFi, and Raenest all issue virtual US bank accounts that convert at near mid-market rates, typically 0.3-2.4% all-in on published fees. Payoneer works but costs roughly 3% all-in and carries a minimum activity threshold (currently $6,000/year per Payoneer\'s help center) below which an annual fee applies. PayPal returned to Nigeria in January 2026 via a Paga partnership, but stacked fees make it roughly 6-7% or more all-in and the most expensive widely-available option.',
    publishedDate: '2026-06-14',
    updatedDate: '2026-08-10',
    providers: [
      {
        slug: 'lemfi',
        name: 'LemFi',
        available: true,
        notes:
          'LemFi (formerly Lemonade Finance) issues a virtual US bank account that Nigerian freelancers can share with clients as standard ACH receiving details. Fee structure: no flat fee and no percentage fee on this corridor, but the LemFi terms of service state that its exchange rate is a mark-up on the wholesale market rate, so the cost sits inside the quoted rate rather than in a visible fee. LemFi does not publish the size of that mark-up, and we could not open its pricing or terms pages directly to check, so we are not putting a number on it. The comparison table above still models LemFi at zero cost because we have no verified spread figure to use instead, so treat its position there as a floor rather than a measured all-in cost, and compare the rate quoted in the app against a mid-market reference before assuming LemFi is the cheapest option for your transfer. Typical settlement: 1-2 business days. LemFi is FCA-licensed in the UK, is registered with FINTRAC as a Money Service Business (MSB) in Canada, and operates under CBN approval in Nigeria. As it is a smaller operator than Cleva or Grey, verify current withdrawal limits before relying on it for large amounts.',
      },
      {
        slug: 'raenest',
        name: 'Raenest',
        available: true,
        notes:
          'Raenest (also marketed as GeegPay) issues virtual USD and GBP accounts for African freelancers and remote workers. US ACH receiving details are provided via Regent Bank (Member FDIC) and are accepted by Upwork, Fiverr, and direct clients. Fee model: since 6 January 2026, Raenest gives 4 free deposits per month shared across USD, GBP, EUR, USDT, and USDC; once that allowance is used, ACH and stablecoin deposits cost $1 flat each and other deposit methods carry a 0.8% fee capped at $10. The USD-to-NGN conversion charge is 0.5%, capped between $0.25 and $2.70 per conversion, so it does not scale with transfer size the way an uncapped FX markup would. On a $1,000 transfer within the free monthly deposit allowance, the total cost is the capped conversion fee of about $2.70 (roughly 0.27% effective). Raenest has revised these fees several times recently, so verify the current allowance at raenest.com/pricing. No annual account fee. Typical settlement: 24 hours. CBN-licensed IMTO; also supports GBP receiving for UK clients.',
      },
      {
        slug: 'cleva',
        name: 'Cleva',
        available: true,
        notes:
          'Cleva is a Nigeria-specific fintech that issues a virtual US bank account (routing number and account number) so clients can send a domestic ACH or wire as if paying a US-based contractor. Fee: a two-tier deposit fee on the incoming ACH ($1 for deposits under $300, $3 for deposits of $300 or more); converting and withdrawing to your Nigerian bank account is free at Cleva\'s quoted rate, which Cleva describes as mid-market. We could not open Cleva\'s pricing pages to confirm that description, so compare the rate the app quotes against a mid-market reference before converting a large amount. On a $1,000 transfer the total cost is the $3 deposit fee, or 0.3%. On a $200 transfer the deposit fee drops to $1 (0.5%). Typical settlement: within 24 hours of the ACH credit clearing (ACH from client takes 1-2 business days). No annual account fee. CBN-licensed IMTO.',
      },
      {
        slug: 'grey',
        name: 'Grey',
        available: true,
        notes:
          'Grey issues virtual USD (and optionally GBP and EUR) accounts for Nigerian freelancers. Clients send a regular ACH or wire; Grey charges a 0.8% deposit fee (minimum $2, maximum $10) on the incoming USD, plus a 1% conversion fee capped at $6 per transaction, plus approximately 1% FX markup above mid-market. On a $1,000 transfer the combined cost is approximately $24 ($8 deposit fee + $6 capped conversion fee + $10 FX), or about 2.4% effective. On a $5,000 transfer Grey\'s own published schedule works out at roughly $66 ($10 deposit cap plus $6 conversion cap plus $50 FX), or about 1.3%. The comparison above will show you a higher number for that amount, closer to 1.9%, and the difference is ours rather than Grey\'s: our fee model cannot express a capped fee, so above roughly $1,250 it keeps charging the percentage after the real cap has stopped. Trust Grey\'s schedule over our table on large transfers, and check the quote in the app. Grey also offers a Visa debit card for a one-time $5 fee. Grey supports multiple currencies, making it a good option if you also receive GBP or EUR from European clients.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'Payoneer works in Nigeria and is a common choice for freelancers on Upwork, Fiverr, and Toptal where Payoneer is the default platform payout method. Payoneer charges 1% on incoming commercial payments. When you withdraw to a Nigerian NGN bank account, Payoneer applies an FX conversion at up to 2% above mid-market, giving a typical all-in cost of 2.5-3.5%. Works with GTBank, Access Bank, Zenith Bank, First Bank, and UBA. Important: Payoneer charges an annual account fee of $29.95/year if the account receives less than its minimum activity threshold in any 12 consecutive months. Payoneer\'s help center currently states $6,000 (it has cited $2,000 elsewhere), so check the figure that applies to your account in the portal. Low-volume freelancers should track their activity level. If you are billing direct clients rather than using a platform, Cleva, LemFi, or Raenest will save you money.',
      },
      {
        slug: 'paypal',
        name: 'PayPal (via Paga)',
        available: true,
        notes:
          'PayPal re-enabled NGN payouts in Nigeria in January 2026 via a partnership with Paga, a CBN-licensed payment company. Nigerian PayPal users can now withdraw their USD PayPal balance to a naira bank account via Paga. The combined fee is approximately 2.9% + $0.30 on the PayPal receiving side, plus roughly 3.5% FX markup on the USD-to-NGN conversion, giving an estimated all-in cost of roughly 6-7% on a $1,000 transfer. Treat that as a floor rather than a ceiling: Paga does not publish its own conversion spread or withdrawal fee, and third-party reports of the real total run higher. That makes it the most expensive widely-available option. The main use case is if a client specifically insists on PayPal and you have no alternative. Payouts are naira-only. The Paga integration is recent (January 2026) and processing times can vary.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'SWIFT wires from US banks reach major Nigerian banks (GTBank, Access Bank, Zenith Bank, First Bank, UBA) directly. The sending fee from a typical US bank is $25-45 flat; the receiving bank converts at the NFEM (official CBN window) rate plus approximately 2% spread. On a $1,000 transfer, the combined cost of a $35 flat fee plus 2% FX is roughly 5.5%. Bank wires make sense for large, infrequent payments over $5,000 where the flat fee becomes a small fraction of the total. Note on the IMTO rule: the CBN issued a circular on March 24, 2026 (effective May 1, 2026) requiring licensed IMTO operators (Western Union, MoneyGram, and similar) to pay out in naira only. This rule does not apply to SWIFT client-to-business wires. Your Nigerian bank can still receive a USD SWIFT wire and convert it at the NFEM rate.',
      },
      {
        slug: 'wise',
        name: 'Wise',
        available: false,
        notes:
          'Nigerians can reportedly open a Wise personal account, but it is heavily restricted: no NGN balance, no physical card, and critically no local receiving details you can share with clients or freelance platforms, so Wise cannot serve as a virtual receiving account the way Cleva, Grey, LemFi, or Raenest can. A foreign client can use Wise to send money directly to a Nigerian bank account by entering the account details manually, but this is not available on Upwork or Fiverr and requires client cooperation each time.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Revolut is not licensed to operate in Nigeria. Nigerian residents cannot open a Revolut account or use Revolut as a receiving method for international payments.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi advertises USD virtual accounts with NGN withdrawal for Nigerian freelancers, but we have not yet verified its current fees and withdrawal mechanism against its official pricing, so it is not included in the ranked comparison above. If you use GrabrFi, verify current fees on grabrfi.com before relying on it.',
      },
    ],
    supportedProviders: ['lemfi', 'raenest', 'cleva', 'grey', 'payoneer', 'paypal', 'bank-wire'],
    faqs: [
      {
        q: 'What is the cheapest way to receive USD in Nigeria?',
        a: 'Cleva and Raenest are the cheapest options we can actually verify. Cleva charges a $1 deposit fee under $300 or $3 at $300 or more, then converts at mid-market for free, so roughly 0.3% on $1,000. Raenest gives 4 free deposits a month, then $1 flat, plus a 0.5% conversion fee capped at $2.70, so roughly 0.27% on $1,000. LemFi charges no flat or percentage fee and often looks cheapest, but its terms of service say the exchange rate carries a mark-up on the wholesale rate and it does not publish the size, so compare the rate it quotes in the app against a mid-market reference before assuming it wins. Grey (0.8% deposit fee plus 1% conversion fee capped at $6, plus about 1% FX, roughly 2.4% all-in on $1,000) is more expensive but well-established and supports GBP and EUR too. Payoneer (1% + up to 2% FX) and PayPal via Paga (roughly 6-7% or more all-in) are significantly more expensive and should be reserved for situations where you have no other option.',
      },
      {
        q: 'What ID do I need to open a virtual USD account in Nigeria?',
        a: 'A BVN (Bank Verification Number) is the gate for most of these apps, and it is the step people get stuck on. Cleva asks for your BVN at signup along with a government-issued ID (NIN, voter\'s card, international passport, or driver\'s licence) and a selfie. LemFi asks for your BVN and, for its Global USD account, specifically a Nigerian international passport plus a selfie, so the other ID types will not get you through there. Raenest asks Nigerian users for a BVN during verification, and when you open the USD account it also asks for proof that you earn in dollars: a signed contract, a bank or Raenest statement, or a platform certificate of earnings from Upwork or Fiverr. Grey accepts a driver\'s licence, national ID card, or international passport for KYC, and its help center says a BVN is required to create the naira account you withdraw into, so you need one either way, though sources differ on whether Grey demands it at the initial signup step. If you do not have a BVN yet, you do not need an existing bank account to get one: NIBSS describes enrolling at any branch of a bank where you have an account or intend to open one, but it is an in-person step because fingerprints and a photo are captured on the spot. Nigerians abroad can use the diaspora or non-resident BVN route instead. We could not open the Cleva, Grey, LemFi, Raenest, or NIBSS pages directly from our side, so confirm the current document list in the app before you start.',
      },
      {
        q: 'Does Wise work for Nigerian freelancers?',
        a: 'Not for receiving. Nigerians can reportedly open a restricted Wise personal account, but it comes without local receiving details you can share with clients or freelance platforms, so it cannot work as a virtual receiving account. A foreign client can use Wise to push NGN to your Nigerian bank account manually, but this requires them to enter your bank details each time and is not available on freelance platforms like Upwork or Fiverr. In practice, use Cleva, Grey, LemFi, or Raenest instead: they all issue virtual US account numbers you can give clients as standard US bank receiving details.',
      },
      {
        q: 'What is the IMTO naira-only rule and does it affect me?',
        a: 'The CBN issued a circular on March 24, 2026 (effective May 1, 2026) requiring licensed International Money Transfer Operators (IMTOs) to pay all incoming remittances in naira only. This applies to Western Union, MoneyGram, and similar licensed IMTO operators. It does not apply to SWIFT bank-to-bank transfers: your Nigerian bank can still receive a USD SWIFT wire and convert it at the official NFEM window rate. LemFi, Raenest, and Cleva each hold CBN IMTO licences, so the naira-only settlement rule technically covers them too, but in practice this changes nothing for freelancers because these platforms already convert and pay out in naira rather than USD cash. Your practical workflow is unaffected.',
      },
      {
        q: 'How long does it take to receive USD in Nigeria?',
        a: 'Cleva: typically within 24 hours once the US ACH credit clears (the ACH from your client takes 1-2 business days on their side). Grey: typically 24 hours. LemFi: 1-2 business days. Raenest: typically 24 hours. Payoneer to local NGN bank: typically 2-4 business days after the payment clears. SWIFT bank wire: 2-5 business days. PayPal via Paga: timing can vary given the integration is relatively new.',
      },
      {
        q: 'Is Payoneer still worth using for Nigerian freelancers?',
        a: 'Payoneer\'s main advantage is platform compatibility: if you work on Upwork or Fiverr, Payoneer is often the default and cheapest withdrawal method from the platform balance. If you are billing direct clients, Cleva, LemFi, or Raenest give better rates. Watch the annual fee threshold: if your Payoneer account receives less than the minimum activity threshold in any 12-month period, you are charged $29.95 in annual fees. Payoneer\'s help center currently puts that threshold at $6,000, though it has published $2,000 elsewhere, so confirm the figure for your account in the portal. For low-volume freelancers with direct clients, a lower-cost option like Cleva, Raenest, or LemFi is clearly better.',
      },
      {
        q: 'Do I have to pay tax on freelance income in Nigeria?',
        a: 'Yes. Income from foreign clients is taxable in Nigeria and filing is required. The statutory basis changed recently: Nigeria consolidated its main tax laws into a single statute, the Nigeria Tax Act, which took effect on 1 January 2026 and replaced the separate Personal Income Tax Act and Companies Income Tax Act framework that previously applied. The individual rate bands were revised at the same time. We could not open a Nigerian government source to confirm the current band table, so we are not publishing rate figures here. Check your current band, the reliefs available to you, and how income earned abroad is treated with FIRS or a Nigerian tax professional. Nigeria does not have a blanket income tax exemption for IT freelancers comparable to some other countries. Consult a Nigerian tax professional: this site covers transfer fees, not tax advice.',
      },
    ],
    siblingCorridors: ['usd-to-pkr', 'usd-to-bdt', 'usd-to-php'],
  },

  // ─── USD → Philippines (PHP) ───────────────────────────────────────────────
  {
    slug: 'usd-to-php',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'PHP',
    destCountry: 'PH',
    country: 'the Philippines',
    title: 'Receive USD in the Philippines: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in the Philippines. Wise offers mid-market rates, GCash now takes USD directly, PayPal runs 8%+. Live FX comparison.',
    h1: 'How to receive USD in the Philippines: fees, FX spread, and what you actually net',
    intro:
      'Filipino freelancers are in better shape than most of the corridors we cover. Wise is fully available in the Philippines, so you can hold a real USD balance with US ACH receiving details and convert to pesos at the mid-market rate for a conversion fee typically under 1%. GCash launched its own Virtual US Account in November 2025, putting USD receiving inside a wallet most Filipinos already carry. Payoneer remains the default for Upwork and Fiverr at roughly 3% all-in, and PayPal, while everywhere, stacks a 4.4% receiving fee on top of a 3-4% FX spread. One more thing worth knowing up front: there is no forced conversion rule. You can keep your dollars in a bank FCDU account or a multi-currency wallet and convert only when the rate suits you.',
    publishedDate: '2026-07-05',
    updatedDate: '2026-08-19',
    providers: [
      {
        slug: 'wise',
        name: 'Wise',
        available: true,
        notes:
          'This corridor is the exception among the emerging markets we cover: Philippine residents can open a full Wise account, not a receive-only workaround. You get local USD account details (a US routing number and account number) that a client or platform pays by domestic ACH for free; an incoming USD wire costs $6.11. The money sits in your USD balance until you convert, and conversion to PHP happens at the mid-market rate for a fee that typically lands under 1% (about 0.65% is representative; verify the current fee in the app before converting). On limits, Wise\'s Philippine limits page is reported to set $10,000 or equivalent per conversion or transfer and $50,000 or equivalent per calendar month, no cap on how much you can hold, and a 10,000,000 PHP per calendar month cap on what a personal account can top up or receive. Wise scopes those two caps to four situations, and one of them is adding PHP to your Wise account from a different currency such as USD or GBP, so a USD to PHP conversion does count against them. The other cap to watch is the 10,000,000 PHP monthly receiving limit. wise.com is blocked from our side, so these figures come from Wise\'s indexed help article rather than a page we opened; check the live numbers in the app. Signup requires a Philippine ID and proof of address.',
      },
      {
        slug: 'gcash',
        name: 'GCash Virtual US Account',
        customHeading: 'How the GCash Virtual US Account works',
        available: true,
        notes:
          'GCash launched its Virtual US Account in November 2025 (with wider in-app rollout through December), powered by Meridian Payments US. A verified GCash user gets US ACH and wire receiving details inside the app, and the launch materials name Wise, Gusto, Payoneer, Deel, Upwork, and Chase as senders that work. ACH deposits carry no transfer fee and post in 1-3 business days; wires arrive same day for $15. The dollars land as USD in your GCash wallet and stay there until you choose to convert to pesos. The catch, and the reason GCash does not appear in our ranked table above: GCash has not published the FX spread it applies on that USD-to-PHP conversion. Marketing copy calls the rate competitive, which is not a number. Check the quoted rate in the app against the mid-market rate at open.er-api.com before converting a large amount. The second catch is a limit rather than a fee: the USD balance in the Virtual US Account is reported to be uncapped, but converting to pesos moves the money into your ordinary GCash wallet, and GCash states that a USD to PHP withdrawal follows the normal wallet and transaction limits, so once you hit them you wait until the next month. A Fully Verified wallet is reported at PHP 100,000 held and PHP 100,000 received per calendar month, rising to PHP 500,000 on an upgraded profile (GCash pages variously describe that upgrade as GCash Plus, or as holding a linked bank account, GSave, GCredit, or a GCash card). PHP 100,000 is under about $2,000 at recent rates, so one mid-sized invoice can hit it and a large conversion may need to be staggered. help.gcash.com is blocked from our side, so these figures come from GCash\'s indexed help articles and Wise\'s write-up of the product rather than pages we opened; confirm your own limit in the app. If the spread is small, this is a genuinely strong option, since you probably already have the app.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The default payout method on Upwork and Fiverr, and the route most Filipino platform freelancers already use. Payoneer charges up to 1% on incoming commercial payments (minimum $1 on payments under $100). Withdrawing to a Philippine bank account or GoTyme applies an FX conversion of up to about 2% above mid-market, so the typical all-in cost is roughly 3%. Routing a withdrawal straight into GCash may add a separate GCash-side cash-in fee on top of that. GCash prices cash-ins by funding source, and the free-up-to-PHP-8,000-a-month figure often quoted here is the over-the-counter partner schedule rather than the Payoneer one; some reports say Payoneer cash-ins carry no GCash fee at all. We could not open GCash\'s help pages to confirm either, so check the fee the app quotes before you withdraw. An annual account fee of $29.95 applies if the account receives less than Payoneer\'s minimum activity threshold in 12 consecutive months; the help center has cited both $2,000 and $6,000 figures at different times, so verify your account\'s threshold in the portal. If you bill direct clients rather than platforms, Wise costs meaningfully less.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'BDO, BPI, Metrobank, and RCBC all offer USD savings accounts (FCDU accounts) that receive inbound SWIFT wires with no forced conversion, so you can hold dollars and convert on your own timing. The US bank sending fee is $25-45; Philippine banks charge inward remittance fees that vary by bank (commonly in the $6-35 range, and a correspondent bank may deduct its own fee in transit; check your bank\'s current schedule). The bank\'s USD-to-PHP spread applies only when you convert. Wires are the route that produces a Certificate of Inward Remittance, the document that supports VAT zero-rating of exported services, which matters if you invoice foreign clients as a registered professional. Best for large or infrequent payments where the flat fees shrink as a percentage.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: true,
        notes:
          'Available, familiar, and the most expensive mainstream way to receive client money in the Philippines. Cross-border commercial receiving runs about 4.4% plus a fixed fee, and converting the USD balance to pesos adds a currency spread of roughly 3-4% (we could not open PayPal\'s Philippine fee page directly, so treat the exact percentages as estimates and check your own transaction receipts). PayPal links directly to GCash. GCash charges a cash-in fee on that step, and it prices cash-ins differently depending on where the money comes from: a PayPal balance, a Payoneer balance, a linked bank account, and an over-the-counter partner are each on a different schedule. That is why the figures quoted on Philippine finance blogs so often disagree: they are usually real GCash fees attached to the wrong source. For a PayPal-funded cash-in the commonly reported figure is about 1%, and the amounts users post for ordinary cash-ins match it. We could not open GCash\'s help pages to confirm that, and we could not establish how the fee behaves on larger cash-ins, where reports still conflict, so treat about 1% as a guide for ordinary amounts rather than a promise and check the fee the app quotes you before you withdraw. Settlement still takes about 1-2 business days. Use PayPal when a client insists on it; move recurring clients to Wise or Payoneer.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Western Union pays out to GCash, Maya, or a Philippine bank account, and the Philippines is one of its largest markets. It is built for personal remittances rather than commercial invoices, so how your transfer is classified matters if a client pays you this way; the FX spread is embedded in the quoted rate rather than shown as a line item. Compare the quoted PHP amount against the mid-market rate before accepting. Fine as a fallback, not a primary rail for freelance income.',
      },
      {
        slug: 'maya',
        name: 'Maya',
        available: false,
        notes:
          'Maya has a USD wallet you can hold and convert dollars in, but we could not confirm any client-facing USD receiving details comparable to the GCash Virtual US Account or Wise. Confirmed inbound routes are third-party remittance services (Wise, Remitly, WorldRemit) and Western Union, which pay into a PHP balance. Until Maya publishes external USD receiving details, treat it as a cash-out or holding destination rather than a way to receive client payments.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Philippine residents cannot open a Revolut account. A Revolut card issued in another country works for spending in the Philippines, but that does not help you receive payments as a local.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi accounts are limited to a fixed, short eligibility list of countries, mostly Latin America plus the US, UK, India, Nigeria, and a few others (the exact count has varied across GrabrFi\'s own published lists). The Philippines is not on the list.',
      },
    ],
    supportedProviders: ['wise', 'gcash', 'payoneer', 'bank-wire', 'paypal', 'western-union'],
    faqs: [
      {
        q: 'Is Wise available in the Philippines, and can I get USD account details?',
        a: 'Yes, and this is what sets the Philippines apart from markets like Pakistan or Nigeria. Philippine residents can open a full Wise account with a local ID and proof of address. The account includes US ACH receiving details (routing and account number) you can hand to clients or connect to platforms; receiving USD by ACH is free, and an incoming wire costs $6.11. You hold the dollars in your Wise balance and convert to PHP at the mid-market rate whenever you like, paying a conversion fee that typically comes in under 1%. On limits, Wise is reported to cap conversions and transfers at $10,000 or equivalent each and $50,000 or equivalent per calendar month, and to cap what a personal account receives or tops up at 10,000,000 PHP per calendar month, with no cap on the balance you hold. Wise scopes those caps to four situations, one of which is adding PHP to your account from another currency such as USD or GBP, so a USD to PHP conversion does count against them. We could not open Wise\'s help pages, so verify current limits in the app.',
      },
      {
        q: 'What is the cheapest way to receive USD in the Philippines?',
        a: 'Wise, for most people, most of the time. Free ACH receiving plus a sub-1% conversion fee at the true mid-market rate beats everything else we can verify on this corridor. The GCash Virtual US Account also receives ACH for free and might be comparable overall, but GCash does not publish its USD-to-PHP conversion spread, so we cannot rank it honestly; check the app\'s quoted rate against mid-market before converting. Payoneer runs roughly 3% all-in and earns its keep mainly as the default platform payout. PayPal is the most expensive at roughly 8% once the receiving fee and the FX spread stack. For a single large payment, a SWIFT wire into a bank USD account can be cheapest of all, since the flat fees stop mattering and you control when to convert.',
      },
      {
        q: 'How does the GCash Virtual US Account work, and what does it cost?',
        a: 'GCash introduced it in November 2025 with Meridian Payments US as the banking partner, with wider in-app rollout through December. Inside the GCash app you apply through the US Accounts section, and once approved you get US ACH and wire details that US employers, platforms, and payroll services can pay like any domestic account. ACH deposits are free and take 1-3 business days; wires post same day for $15. The money arrives as USD and sits in your wallet until you convert to pesos. What GCash has not published is the FX spread on that conversion, which is the number that decides whether this beats Wise. Until they do, compare the in-app rate to the mid-market rate before converting anything sizable. One more thing the launch coverage skips: the USD balance itself is reported to be uncapped, but converting to pesos moves the money into your ordinary GCash wallet, and GCash says that withdrawal follows the normal wallet and transaction limits. For a Fully Verified account those are reported as PHP 100,000 held and PHP 100,000 received per calendar month, rising to PHP 500,000 on an upgraded profile. Hit the limit and you wait until the next month, so a large invoice may need converting in stages. We could not open GCash\'s help pages, so check your own limit in the app before planning around it.',
      },
      {
        q: 'How do I withdraw PayPal money to GCash, and what does it cost?',
        a: 'PayPal and GCash have a direct link: connect your GCash account in PayPal, withdraw, and the money typically lands within 1-2 business days. Most of the cost sits earlier in the chain, where PayPal charges about 4.4% plus a fixed fee to receive a cross-border commercial payment and then applies a 3-4% spread when converting USD to pesos, so roughly 8% is gone before GCash is involved. GCash then charges its own cash-in fee, and it prices cash-ins differently depending on where the money comes from: a PayPal balance, a Payoneer balance, a linked bank account, and an over-the-counter partner are not on the same schedule. The free-up-to-PHP-8,000-a-month figure you will see repeated, for example, is the over-the-counter partner schedule, not the PayPal one. For PayPal the commonly reported figure is about 1%, and the amounts users post for ordinary cash-ins match it. We could not open GCash\'s help pages to confirm it, and we could not pin down how the fee behaves on larger cash-ins, so plan on roughly 9% all-in for this route, treat the 1% as a guide rather than a promise, and check the fee the app quotes you at the withdrawal screen.',
      },
      {
        q: 'Do I have to convert my dollars to pesos, or can I keep a USD account?',
        a: 'You can keep dollars. The BSP imposes no mandatory conversion on inward remittances: banks offer USD savings accounts (FCDU accounts) at BDO, BPI, Metrobank, RCBC and others, and both Wise and GCash let you hold a USD balance and convert when you choose. Banks will ask the purpose of inbound commercial transfers (a one-line answer like "payment for design services per contract" is normal). Under the Anti-Money Laundering Act, a covered transaction is one above PHP 500,000 in a single banking day, and banks report those to the Anti-Money Laundering Council; the rule covers fund transfers, not just cash, and it is routine reporting rather than a restriction. The US$10,000 figure you may have seen elsewhere is a different rule: it is the threshold above which you must file a written declaration for foreign currency you physically carry into or out of the Philippines, not a wire transfer limit. Holding USD is genuinely useful if you have dollar expenses or simply do not like the current rate.',
      },
      {
        q: 'Do I need to register with the BIR as a freelancer, and how much tax will I pay?',
        a: 'Yes, register as a self-employed professional. You then pick one of two regimes. The 8% flat option taxes gross receipts at 8% (with the first 250,000 PHP exempt for pure freelancers) and replaces both the graduated income tax and the 3% percentage tax; it is available while your gross receipts stay under 3 million PHP a year. The alternative is the graduated 0-35% schedule, usually paired with the 40% Optional Standard Deduction. Services exported to nonresident clients and paid in foreign currency can also qualify for VAT zero-rating under Section 108(B)(2) of the Tax Code, which is why keeping each bank Certificate of Inward Remittance matters. Thresholds shift with tax reform bills, so confirm the current numbers with the BIR or a Philippine accountant. This site covers transfer fees, not tax advice.',
      },
      {
        q: 'Can I receive USD directly into GCash or Maya?',
        a: 'GCash, yes: the Virtual US Account gives you ACH and wire details inside the app, and dollars land in your wallet as USD. Maya, not in the same way. Maya offers a USD wallet for holding and converting, but we could not confirm client-facing USD receiving details you could hand to a US payer; confirmed routes into Maya are remittance services like Wise, Remitly, WorldRemit, and Western Union, which arrive as pesos. If receiving USD into a wallet is the goal, GCash currently has the feature and Maya does not.',
      },
    ],
    siblingCorridors: ['usd-to-idr', 'usd-to-thb', 'usd-to-bdt'],
  },
  // ─── USD → Georgia (GEL) ───────────────────────────────────────────────────
  {
    slug: 'usd-to-gel',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'GEL',
    destCountry: 'GE',
    country: 'Georgia',
    title: 'Receive USD in Georgia: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Georgia. Georgian banks let you hold dollars without converting, and tax is assessed in lari at the day\'s rate.',
    h1: 'How to receive USD in Georgia: holding dollars, converting to lari, and the 1% question',
    intro:
      'If you live in Georgia and bill foreign clients in dollars, the biggest lever is not which app you pick. It is whether you convert at all. TBC and Bank of Georgia both run USD and EUR sub-accounts alongside your lari one, so a client wire can land as dollars and sit there until you want lari. We found no sign of a rule that forces you to sell foreign currency, and Georgia is consistently described as having no currency controls, though we could not open the National Bank or any bank tariff page to confirm it, so treat that as settled practice rather than a citation. Read the first comparison below with that in mind: it prices converting a thousand dollars into lari, which is the thing this page is telling you that you may not need to do. The second table prices receiving dollars as dollars. When you do want lari, Wise is the cheapest of the four at roughly 1.5% all in on a thousand dollars, taken as a visible fee on the mid-market rate. Payoneer is the fallback if your money arrives through Upwork or Fiverr, though check the payout screen before you count on it, because we could not confirm that Payoneer converts to lari at all. Revolut and GrabrFi do not open accounts for Georgian residents, so treat them as something a client might send from rather than something you receive into. One more thing that catches people: if you hold Small Business Status, your 1% is calculated on the lari equivalent at the National Bank rate for the day each payment lands. That is an accounting conversion, not a real one. You can owe tax in lari and still be holding the dollars. Small Business Status is a separate application and consulting is on the excluded list, so do not assume the 1% is yours before you have it.',
    publishedDate: '2026-08-28',
    updatedDate: '2026-08-28',
    altReceivingNote:
      'Georgian banks issue USD and EUR sub-accounts alongside your lari account, so a dollar wire can be credited as dollars and left alone. This is what that costs. Note that the conversion spread is deferred rather than escaped: you pay your bank\'s rate whenever you eventually sell dollars for lari, and that gap is not shown to you as a fee.',
    providers: [
      {
        slug: 'bank-wire',
        name: 'Georgian bank account (SWIFT)',
        customHeading: 'Receiving straight into a Georgian USD account',
        available: true,
        notes:
          'This is the route the rest of the page keeps pointing back to, so we describe it first. Be aware that it is also the last row in the lari comparison above, and for a reason worth understanding: that table prices a thousand dollars converted into lari, and a bank is the expensive way to do that. The second table prices the thing described here, which is a dollar wire landing in a dollar account and staying there. TBC and Bank of Georgia both issue USD and EUR IBANs alongside your lari account, and at Bank of Georgia the foreign currency sub-accounts are reported to be free to hold. Credo is a smaller bank that foreigners often find easier to open with, though we could not confirm that it offers foreign currency sub-accounts, and we have seen at least one report of a Credo account turning out to be unsuitable for SWIFT, so confirm both before you give the details to a client. A dollar wire into a dollar account converts nothing, so there is no conversion spread at that moment. What it does cost is the inbound side: your bank may take an incoming SWIFT commission, and a correspondent bank in the middle often deducts something, commonly reported in the ten to twenty-five dollar range, that nobody warns you about in advance. TBC is reported to offer an option where the sender pays the charges so you receive the full amount. We could not open any Georgian bank tariff page, so we are not publishing a figure for the receiving side. Ask your branch for the current tariff. The catch to be honest about is that the spread is deferred, not escaped. When you eventually sell dollars for lari you pay whatever your bank\'s rate of the day is. Banks do publish a daily buy and sell rate, so you can see the rate, but the gap against the mid-market rate is not shown as a line item and you have to work it out yourself.',
      },
      {
        slug: 'wise',
        name: 'Wise',
        available: true,
        notes:
          'The cheapest widely available way to turn dollars into lari, and the cheapest of the four in the lari comparison above. Wise opens accounts to Georgian residents and prices a USD to GEL transfer at roughly 1.5% all in on a thousand dollars, taken as a transparent fee on top of the real mid-market rate, with lari delivered to a Georgian bank account in about one to two business days. The percentage falls a little on larger amounts. The important unknown is on the receiving side. Wise gives US account details, a routing number and an account number, only to residents of a limited set of countries, and we could not confirm whether Georgia is one of them. That matters more than the fee: with USD details your client pays you by free domestic ACH, and without them your client has to send an international transfer instead, which changes both the cost and who pays it. Open the app and look at whether a USD balance with account details is actually offered to you before you plan around it. Reports also conflict on whether you can hold a lari balance in Wise and whether the Wise card is available to Georgian residents, so we are not making a claim either way. We could not open wise.com from our side, so verify the current fee in the app.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'Widely used in Georgia, almost entirely because it is the default payout on Upwork, Fiverr and similar platforms. Payoneer charges up to 1% on incoming commercial payments, and that part is well established. Everything after it is murkier than the usual Payoneer story, and in a way that matters. The reporting we could reach says Payoneer\'s currency conversion does not cover the lari, which if correct means there is no such thing as a Payoneer withdrawal in lari and the realistic route is receiving dollars and moving them into your Georgian dollar account. Separately, Payoneer\'s cheap flat rate for same-currency withdrawals requires the destination account to be in a country where that currency is the official one, and dollars in Georgia do not meet that test, so the flat rate people quote does not apply here. We could not open Payoneer\'s pricing pages to settle either point, and the Payoneer line in the lari comparison above is modelled on a lari withdrawal we have not been able to confirm exists. Read the cost off your own payout screen rather than treating it as a number you can plan with.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Available as a bank deposit rail into Georgia. Western Union advertises a free first online transfer to Georgian bank accounts, which is a promotion rather than a price, and we could not confirm how long it runs. The cost that matters is the one built into the exchange rate rather than the fee line, and Western Union does not disclose it as a separate item. Our own model uses a five percent spread for this corridor. That figure came from a general assumption about minor corridors rather than a quote we pulled for Georgia, which is why the comparison above marks it as estimated and why it cannot take the best value badge. Treat the Western Union row as an upper bound and get a live quote before you use it. The caveat that actually matters for a freelancer is different: this is consumer remittance pricing, built for someone sending money to family, not a published commercial rate for a client settling an invoice. How your transfer is classified is your client\'s decision, not yours, and it is the sender who chooses the fee and the rate. Fine as an occasional route, not a rail to build your invoicing on.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Georgian residents cannot open a Revolut account, and the Revolut card is not available in Georgia either. A client in the US or the EU can still push a payment from their own Revolut account to your Georgian IBAN, which arrives as an ordinary international transfer, but that is your client using Revolut rather than you. Do not plan on holding a balance there.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi opens accounts only to residents of a fixed list of countries, and Georgia is not on it, so this is not a route you can receive into. Local currency withdrawal is available in a shorter list still. We could not open GrabrFi\'s own eligibility page, so if you see it recommended for Georgia anywhere, check the signup flow before you believe it.',
      },
      {
        slug: 'paysera',
        name: 'Paysera',
        available: false,
        notes:
          'Not an option for dollars, but worth knowing about if any of your clients are in Europe. Paysera issues a Lithuanian IBAN that receives euros over SEPA at no cost, and it is reported to hold a National Bank of Georgia licence, which is why Georgian freelancers use it as a euro rail. We could not open the NBG register to confirm the licence. For a US client paying in dollars it does not help, which is why it is listed here rather than in the comparison above.',
      },
    ],
    supportedProviders: ['wise', 'payoneer', 'western-union', 'bank-wire'],
    faqs: [
      {
        q: 'Can I receive USD in Georgia without converting to lari?',
        a: 'Yes, and for a lot of freelancers this is the right answer. Georgian banks issue USD and EUR sub-accounts alongside your lari account, so a dollar wire from a client can be credited as dollars and stay that way. We found no sign of a rule that forces you to sell foreign currency, and Georgia is consistently described as having no currency controls, though we could not open the National Bank to confirm that directly. Holding dollars makes sense if your own costs are in dollars, if you are saving, or if you simply do not want to convert on your client\'s schedule rather than your own. Two trade-offs. The first is that you have deferred the spread rather than avoided it: whenever you do sell dollars for lari, your bank applies its own rate for that day, and the gap against the mid-market rate is not shown to you as a fee. The second is that holding dollars does not defer the tax. Your turnover is declared in lari at the National Bank rate for the day each payment arrived, whether or not you converted anything, and if you are on the monthly regime the tax is payable in lari every month, so you will need some lari on hand even in a month where you converted nothing.',
      },
      {
        q: 'Is the money safe if I just leave dollars sitting in a Georgian bank?',
        a: 'Deposits in Georgian banks are covered by a deposit insurance scheme, and the reported ceiling was raised to 50,000 lari per depositor per bank from April 2026, up from 30,000. Two details matter if you are using a Georgian account as a dollar savings pot. The limit is per bank, so a balance above it is only as safe as the bank itself. And a foreign currency deposit is reported to be compensated in lari at the National Bank rate on the day of the insured event, not in dollars, so the cover is a lari amount even though your balance is in dollars. We could not open the deposit insurance agency to confirm either figure, so verify the current limit before you decide how much to leave in one place.',
      },
      {
        q: 'How is my USD income converted for the 1% tax?',
        a: 'At the National Bank of Georgia official rate for the date each payment is received, calculated per payment rather than as one lump at year end. This is an accounting conversion and not a real one, which is the part that confuses people: you can declare and pay tax on a lari figure while the dollars are still sitting in your account untouched. If clients pay you several times in a month, each receipt is converted at that day\'s rate, so the arithmetic needs to match rather than use a monthly average. Declarations are filed monthly through rs.ge, and both the filing and the payment are due by the fifteenth of the following month. The usual advice we saw is that money landing in Wise, Payoneer or PayPal counts as received when it arrives there rather than when you move it to a Georgian bank, which would matter for the date you use, but we could not confirm that from the Revenue Service itself. We could not open rs.ge from our side, so confirm the current filing rules with an accountant rather than treating this as authoritative.',
      },
      {
        q: 'How much can I earn before I lose the 1% small business status?',
        a: 'The reported ceiling is 500,000 lari of turnover in a calendar year. Cross it and the rate on your turnover goes to 3% from the month you crossed, for the remainder of that tax year. Cross it in two consecutive years and Small Business Status is reported to be revoked, which drops you to the standard 20% personal income tax. Two things people miss. Registering as an Individual Entrepreneur does not by itself give you the 1% rate: Small Business Status is a separate application to the Revenue Service, and if you skip it you are simply an IE paying 20%. And the timing of that application matters. The rules changed in 2026, through a Ministry of Finance order on special tax regimes reported as published in February and effective in March, which reworked when status starts and how income earned before it starts is taxed. The version we saw describes a fifteen day window to apply after a triggering event, with income earned earlier in the year taxed at the standard 20% if you miss it. We could not open the tax authority or the legal text, so verify the ceiling, the deadline and the current rules with a Georgian accountant before planning around any of them.',
      },
      {
        q: 'Does consulting disqualify me from the 1% tax?',
        a: 'Possibly, and this is the live risk for a lot of the people reading this page. The list of activities excluded from Small Business Status includes consulting, alongside licensed activities, currency exchange, medical, architectural, legal, notarial and audit work, gambling and personnel supply. What nobody can tell you crisply is where consulting ends and ordinary freelance service work begins, because the law does not draw that line sharply. One reading we saw treats technical and software advice as fine while investment and financial advice is not, but that is commentary from a service provider rather than a ruling, and we would not want you to rely on it. If your work could reasonably be described as advisory, this is worth thirty minutes with a Georgian accountant before you register, not after. Getting the activity code wrong at registration is a great deal more expensive to fix later.',
      },
      {
        q: 'Can I open a Wise account in Georgia, and will I get USD account details?',
        a: 'The account, yes: Wise opens accounts to Georgian residents and runs a Georgian site. The account details are the open question, and they are the part that actually decides your cost. Wise issues US account details, a routing number and an account number that accept a free domestic ACH, only to residents of a limited set of countries, and we could not confirm whether Georgia is one of them. If you get them, a US client pays you like a domestic supplier and it costs nothing to receive. If you do not, your client has to send an international transfer instead, which is slower and carries a fee somebody has to pay. Open the app and look at what is actually offered under a USD balance before you send details to a client. Reports also disagree about whether Wise lets you hold a lari balance and whether the Wise card works for Georgian residents, so we are not claiming either way.',
      },
      {
        q: 'Do I need to register for VAT if all my clients are abroad?',
        a: 'We could not resolve this one and would rather say so than guess. Georgian VAT registration is reported to become mandatory above 100,000 lari of taxable supplies in any rolling twelve months. What is genuinely unclear from the sources we could reach is how services exported to non-resident clients are treated: some describe them as zero-rated, others as falling outside the scope of Georgian VAT altogether, and those are different treatments with different consequences for whether that revenue counts toward the threshold at all. That distinction decides whether a freelancer billing 150,000 lari to foreign clients needs to register or not, which is not a detail. The tax authority and legal text sites are blocked from our side, so we cannot settle it. Ask a Georgian accountant specifically about place of supply for your service type, and get the answer in writing.',
      },
      {
        q: 'What will the bank ask for when a client transfer arrives?',
        a: 'Standard anti-money-laundering questions, and they get more thorough as the amount goes up. Expect to be asked for the contract or the invoice behind the payment, and to show that you actually carry on the business activity you say you do. The single most useful habit is making sure the payment purpose your client writes on the transfer matches what your invoice says, because a mismatch is what triggers a slow manual review. We found no sign of a Georgian equivalent of the remittance certificate that some countries issue, so as far as we can tell your evidence of foreign income is the bank statement plus the matching invoice, and that is what your accountant and the Revenue Service will work from. Keep both filed per payment rather than reconstructing them at year end.',
      },
      {
        q: 'How much cash can I bring into Georgia without declaring it?',
        a: 'The reported threshold is 30,000 lari or the equivalent in another currency, above which you must declare the money to customs when crossing the border, with penalties for failing to. This one is worth mentioning only because people find the figure and assume it is a limit on bank transfers. It is not. It applies to physical cash and other bearer instruments you carry across the border in person, and it has nothing whatsoever to do with a client wiring dollars into your account. There is no transfer ceiling of that kind in Georgia. We could not open the customs code itself, so treat the exact figure as one to verify if you are actually planning to travel with cash.',
      },
    ],
    siblingCorridors: ['usd-to-eur-portugal', 'usd-to-thb', 'usd-to-pkr'],
  },
  // ─── USD → Portugal (EUR) ──────────────────────────────────────────────────
  {
    slug: 'usd-to-eur-portugal',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'EUR',
    destCountry: 'PT',
    country: 'Portugal',
    title: 'Receive USD in Portugal: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Portugal. Wise and Revolut are both fully available, so most of your cost is the USD to EUR conversion.',
    h1: 'How to receive USD in Portugal: conversion costs, invoicing, and what you actually keep',
    intro:
      'Portugal is a euro country inside SEPA, so the hard part of this corridor is not moving the money. Once euros exist, they reach a Portuguese IBAN in seconds for nothing. On the two accounts worth using, almost all of your cost is the USD to EUR conversion, and who does it cheapest depends on how much you convert in a month and which day you do it. Wise and Revolut are both fully available to Portuguese residents, which is rare among the corridors we cover, and on a small weekday conversion Revolut can come out ahead on the fees we model. The platform routes work differently: Payoneer and PayPal both charge you to receive the dollars before any conversion happens. Payoneer earns its place as the Upwork and Fiverr default rather than on price, PayPal is the expensive habit worth breaking, and a bank wire only makes sense on large payments. One thing to know up front: there is no forced conversion and no remittance certificate regime here, because capital moves freely inside the EU. Your proof of foreign income is the fatura-recibo you issue through the Portal das Financas, not a document your bank hands you.',
    publishedDate: '2026-08-28',
    updatedDate: '2026-08-28',
    providers: [
      {
        slug: 'wise',
        name: 'Wise',
        available: true,
        notes:
          'Portugal is one of the corridors where Wise works the way the marketing says it does. You open a full account with a Portuguese ID and proof of address, and you get US account details, a routing number and an account number, that a US client pays by ordinary domestic ACH. Receiving that ACH is reported to be free, while an incoming US dollar wire is reported to carry a fixed fee of a few dollars, so ask for ACH. The dollars sit in your USD balance until you decide to convert, and the conversion runs at the real mid-market rate for a fee shown on screen before you confirm. Two details trip people up. Your euro details are normally a Belgian IBAN beginning BE, issued by Wise Europe SA, not a Portuguese PT50 IBAN. Some Portuguese clients and accounting systems push back on that, and they are not entitled to: refusing a valid EEA IBAN for a euro transfer is IBAN discrimination under Article 9 of the SEPA Regulation, and Banco de Portugal describes itself as the national authority that monitors the SEPA Regulation in Portugal and takes reports of non-compliance. The second is timing. The conversion is quick, but your client\'s ACH still takes one to three business days to arrive before you can convert anything. The conversion fee we model here was last checked against Wise\'s own pricing page in June 2026 and we could not reopen wise.com to recheck it for this page, so treat it as the last figure we confirmed rather than today\'s quote. Check the fee the app shows you before converting.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: true,
        notes:
          'Also fully available to Portuguese residents, and on the fees we model it can undercut Wise on small weekday conversions, which is unusual enough to be worth understanding. Two separate charges matter. The first is a transfer fee: our comparison models 0.3% on this route, taken from Revolut\'s published international transfer pricing for US-originated transfers. The second is currency exchange, which Revolut prices by allowance rather than by a flat percentage: on the Standard plan a monthly amount of exchange is reported to be free at the interbank rate, with a percentage charge above that allowance and a further percentage charge on exchanges made over the weekend. Paid plans are reported to raise or remove the allowance. So the honest answer is that it depends on your invoice size and which day you press the button. One modest invoice a month, converted midweek, is cheap but not free. Several thousand euros a month and you are paying the over-allowance rate on most of it in Revolut\'s real pricing, which we would expect to put you behind Wise. Be aware that the comparison above will not show you that: it models Revolut as a flat percentage and has no way to apply an allowance, so it keeps Revolut ahead at every amount. Price your own invoice size in both apps rather than trusting our table on this one. We could not open Revolut\'s Portuguese pricing pages for this page, and the published numbers differ between Revolut\'s US and European entities, so treat the allowance size and the percentages as unconfirmed and read the current ones in the app. The other thing we could not confirm is more practical: whether a Portugal-resident Revolut account gives you US account details that accept a domestic ACH, or only a SWIFT route. Check what the app shows under your USD balance before you hand anything to a client, because a SWIFT-only route changes the arithmetic.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The reason to use Payoneer in Portugal is Upwork and Fiverr, where it is often the default payout. As a way to bill direct clients it is the expensive option here. Payoneer charges up to 1% to receive into your local receiving details, then up to 2% above mid-market when you move dollars into a euro bank account, so roughly 3% all in. Both legs are "up to" rather than fixed, which means the rate you actually get is the rate in the portal on the day, and Payoneer\'s disclosed maximum is not a quote. There is also an annual account fee of $29.95 if the account receives less than Payoneer\'s minimum activity threshold over twelve consecutive months, and Payoneer\'s own material has quoted two different thresholds at different times, so verify yours in the portal. If your income is direct invoices rather than platform work, Wise or Revolut will keep more of it.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: true,
        notes:
          'Available, familiar, and the one to talk your recurring clients out of. A US client paying a Portugal-based seller is a cross-border transaction from outside the EEA, so PayPal\'s international surcharge applies on top of its commercial transaction rate, and a currency conversion charge applies on top of that when the dollars become euros. PayPal publishes a Portuguese merchant fee schedule, and that document is the only thing that settles the actual percentages for a seller here. We could not open it, so every PayPal percentage on this page is an estimate carried over from PayPal\'s US schedule and should be treated as one. Check your own transaction receipts, where the receiving fee and the conversion are itemised separately. What we can say confidently is the shape rather than the size: this is the most expensive mainstream route on this corridor by a wide margin, and the conversion charge is the half people forget to count.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'It exists, it pays into Portuguese bank accounts, and on this corridor it has no real use case. Western Union is built for people sending money to family, not for clients settling commercial invoices, which is the same classification mismatch we flag on the Pakistan page. On a corridor where two properly licensed multi-currency accounts are available to you, there is no version of this that wins. Western Union also states that fees vary by amount, payout method and channel, and it does not disclose its exchange rate margin as a separate line, so verify the quoted euro amount against the mid-market rate before accepting anything.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'The old route, and still the right one occasionally. A US bank charges roughly $25 to $45 to send, a correspondent bank may take a cut in transit, and your Portuguese bank charges its own inbound foreign transfer commission, published in its precario, before converting. On a $1,000 invoice those flat costs are brutal. On a $20,000 project payment they round to nothing, and the wire produces the cleanest paper trail your accountant will ever see. The trap is automatic conversion: dollars arriving into a euro-only account are converted at whatever rate the bank applies that morning, and you do not get to wait for a better one. Portuguese banks do offer dollar accounts, but they carry maintenance fees, so price that against what timing your own conversions would save you. We could not open any Portuguese bank\'s precario, so the receiving-side commission is not modelled in the comparison above and the FX spread we show is likely optimistic for a retail customer.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi opens accounts against a fixed eligibility list keyed to your government-issued ID, and Portugal is reported to be on that list, so opening a US dollar account may well be possible. What we could not confirm is the other half: whether GrabrFi pays out euros to a Portuguese IBAN. Until that is confirmed we do not model it on this corridor, so treat it as unproven here rather than as a route we know works.',
      },
    ],
    supportedProviders: ['wise', 'revolut', 'payoneer', 'paypal', 'western-union', 'bank-wire'],
    faqs: [
      {
        q: 'Wise or Revolut for receiving dollars in Portugal, which is actually cheaper?',
        a: 'It depends on how much you convert and when, which is why nobody gives you a straight answer. Wise charges a small fixed fee plus a percentage of the amount, at the real mid-market rate, and the percentage moves a little with the size and the route rather than with the day of the week. Revolut charges a transfer fee on the route, which we model at 0.3%, and prices the currency exchange separately: Standard users are reported to get a monthly allowance of exchange at the interbank rate, with a percentage charge above it and a further charge on weekend conversions. On the fees we model, one modest invoice a month converted midweek comes out cheaper on Revolut than on Wise, though not free. A freelancer converting several thousand euros a month blows through the allowance and pays the over-allowance rate on most of it, at which point Wise is usually cheaper and considerably more predictable. One caveat about our own table: it models Revolut as a flat percentage, so it cannot represent the allowance running out and will show Revolut ahead at any amount. That is a limitation of our model, not a claim about Revolut. We could not open either provider\'s Portuguese pricing pages for this page, and Revolut\'s published numbers differ between its US and European entities, so check both in-app for a conversion of your actual size before committing. If you want one answer and no arithmetic, Wise is the safer default.',
      },
      {
        q: 'Can I get US account details as a Portugal resident, so my client can pay by ACH?',
        a: 'With Wise, yes. A full Wise account opened with a Portuguese ID gives you US account details, a routing number and an account number, and a US client pays them like any domestic account. Receiving that ACH is reported to be free, and the money lands in your USD balance as dollars. With Revolut we could not confirm it. Revolut does issue USD details to accounts in some markets, but whether a Portugal-resident account gets ACH-capable details or only a SWIFT route is something we could not establish from a source we could open, and it matters: a SWIFT route means your client pays a wire fee and the money takes days rather than hours. Look under your USD balance in the app and confirm what kind of details you have before you send them to anyone.',
      },
      {
        q: 'Do I charge IVA to a US client, and what do I put on the invoice?',
        a: 'You do not charge Portuguese IVA to a US client, but the reason is not the one most people give. Reverse charge, autoliquidacao, is the EU business-to-business mechanism and it does not apply to a US client at all. Services supplied to a business established outside the EU are simply not located in Portugal under the general business-to-business rule in paragraph 6 of Article 6 of the CIVA, so they fall outside the scope of Portuguese VAT, and the invoice carries a non-taxation mention citing that article rather than a reverse charge note. The supply is still reported on your periodic IVA return even though no tax is charged on it. Services to a non-business person outside the EU sit under a different paragraph of the same article. Portuguese practice also requires you to hold evidence that a non-EU client is genuinely a business rather than taking their word for it. Separately from all of this there is the small-business exemption in Article 53 of the CIVA, reported to sit at 15,000 euros of prior-year turnover, which decides whether you are inside the IVA system at all, and how foreign-client income counts towards that threshold is not something we could confirm from a source we could open. The exact wording and your own IVA position matter to the tax authority and vary by which paragraph applies to you, so get both from a Portuguese accountant rather than from a template you found online. This site covers transfer costs, not tax advice.',
      },
      {
        q: 'Is my coefficient 0.75 or 0.35 in the regime simplificado?',
        a: 'This decides how much of your income is taxed at all, and a lot of guides state 0.75 as though it applied to every freelancer. It does not. The 0.75 coefficient applies to professional activities specifically listed in the table referenced by Article 151 of the CIRS. Other service provision that is not in that table takes 0.35 instead. Which activity code you registered under when you opened activity is what settles it. There is also a condition people miss, and it attaches to both coefficients rather than only to 0.75: the presumed expense allowance built into them is only fully recognised if you can justify expenses, largely through e-Fatura, amounting to a set share of your gross income, otherwise part of the allowance is added back to your taxable income. First-year and second-year reductions to the coefficients are also reported to apply, with conditions. We could not open the Ordem dos Contabilistas Certificados or the tax authority pages directly, so confirm your own coefficient and the current conditions with a Portuguese accountant before you plan around either figure.',
      },
      {
        q: 'Does my US client have to withhold the 23% retencao na fonte?',
        a: 'No. A US client with no establishment in Portugal has no obligation to withhold Portuguese IRS, so you issue the receipt marked as being without withholding and you receive the full invoice amount. The 23% people are thinking of is what a Portuguese business client with organised accounting withholds on a domestic invoice and pays to the tax authority on your behalf, and it is the rate for the professional activities listed in the table referenced by Article 151 of the CIRS. Other activities are reported to carry a different and lower rate, and there is also a reported exemption from withholding for freelancers below an annual turnover threshold, so 23% is not automatically your number even on domestic work. That money is not lost when it is withheld, it is a payment on account against your eventual IRS bill, but with foreign clients it simply never happens. The practical consequence is that your tax is not being prepaid during the year, so budget for the full amount at settlement rather than being surprised by it.',
      },
      {
        q: 'What do I pay to Seguranca Social on this income?',
        a: 'This is the cost that surprises people more than IRS, and it is the one thing this page would otherwise leave out. Contributions for the self-employed are reported to be charged at 21.4% on a relevant income base of 70% of your service invoices, declared quarterly, with a minimum monthly contribution and a ceiling tied to the IAS. There is also a reported exemption from contributions for the first twelve months after you open activity for the first time, which you can waive if you would rather start building social protection sooner. Foreign clients change nothing here: income from a US client counts exactly like income from a Portuguese one. We could not open Seguranca Social pages directly, so confirm the current rate, the base and your own exemption status before you budget around them.',
      },
      {
        q: 'Do I qualify for IFICI, the NHR replacement, as a freelancer with US clients?',
        a: 'Probably not, and this is the single most misreported item we found on this corridor. The original NHR is closed to new entrants and IFICI replaced it, offering a flat rate on Portuguese-source employment and self-employment income from qualifying activities for ten years, plus exemption on most foreign-source income other than pensions. Eligibility requires that you were not Portuguese tax resident in the previous five years, that you have not used NHR or another Portuguese incentive, and that you register with the tax authority by a deadline in January of the year after you become resident. The part almost every guide omits is that the qualifying activity generally has to be carried out within an eligible entity, and the eligible list is specific: certified startups, companies benefiting from investment-support tax regimes, exporters in listed sector codes, entities certified for research and development, and public research units and higher education institutions. Plain freelancing for foreign clients on recibos verdes generally does not qualify on its own, even when your profession appears on the qualifying list, because there is no eligible Portuguese entity in the picture. Working through or for one, as an employee or as a service provider, is the route that can qualify. We could not open the legal text, the implementing portaria or the tax authority page, so treat this as a strong signal to get advice rather than a ruling, and do not build a relocation plan on a blog post that says your job title is on a list.',
      },
      {
        q: 'Do I have to report incoming transfers to Banco de Portugal?',
        a: 'Almost certainly not at freelance scale. Portugal has no exchange controls and no forced conversion on inward transfers. Banco de Portugal does run a statistical reporting regime for external transactions and positions, but natural persons are reported to have been taken out of its scope back in 2013, and the exemption threshold for the entities that remain in scope is reported to have been raised to 250,000 euros of external operations a year. We could not open Banco de Portugal\'s own page to confirm either point, so if you trade through a company rather than as a sole trader, check it with your accountant. Separately, your bank applies ordinary anti-money-laundering checks and may ask the purpose of a larger inbound transfer. A copy of the invoice and the client contract answers that in one email. Keep the fatura-recibo for every client payment regardless, since that is your actual evidence of foreign income, not anything the bank issues.',
      },
      {
        q: 'My client will only pay by bank wire. Will my Portuguese bank convert it automatically?',
        a: 'If the account is euro-only, yes, and at whatever rate the bank applies that morning. You do not get to wait for a better one, and the retail spread a Portuguese bank applies is usually well above what Wise or Revolut charge. On top of that the bank takes an inbound foreign transfer commission from its published precario, and a correspondent bank may have already deducted its own fee in transit, which is why the amount that lands is often less than the amount your client sent. On a large payment a wire is still defensible, since the flat costs shrink as a percentage and it produces excellent documentation. If you take dollar wires regularly, ask your bank about a dollar-denominated account so the conversion becomes your decision rather than theirs, and weigh its maintenance fee against what timing your own conversions would save.',
      },
    ],
    siblingCorridors: ['usd-to-gel', 'usd-to-thb', 'usd-to-php'],
  },
  // ─── USD → Thailand (THB) ──────────────────────────────────────────────────
  {
    slug: 'usd-to-thb',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'THB',
    destCountry: 'TH',
    country: 'Thailand',
    title: 'Receive USD in Thailand: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Thailand. Wise is moving Thai customers to automatic baht conversion, and PayPal personal accounts cannot receive.',
    h1: 'How to receive USD in Thailand: what the Wise change means and what still works',
    intro:
      'Thailand used to be the easy one. Open a Wise account, give clients your US routing number, sit on the dollars, convert when the rate looked good. That is ending. Wise now serves customers with a Thai registered address through a locally licensed entity, and reports say that once you are moved, client payments landing in your USD details are converted to baht the moment they arrive. You can still be paid. You just cannot hold the dollars. PayPal is not the fallback either: personal accounts in Thailand lost the ability to receive payments in the 2022 relaunch, and because verification runs through a Thai national ID system, foreign residents cannot open one at all. What is left is Payoneer at roughly 3% all in, Wise at well under 1% with the conversion timing taken out of your hands, and a SWIFT wire into a Thai foreign currency deposit account if holding dollars matters more to you than fees. We should say plainly that Wise pays us a commission when someone signs up through this site, and that the Thailand change is a downgrade for anyone who wanted to park dollars. It is still the cheapest way to turn client dollars into baht. It is no longer a place to keep them.',
    publishedDate: '2026-08-28',
    updatedDate: '2026-08-28',
    altReceivingNote:
      'Thai banks offer foreign currency deposit accounts, commonly called FCD accounts, and the Bank of Thailand does not require inbound foreign currency to be converted. A dollar wire credited to one converts nothing, so you choose when to sell. This is what that costs. Note that the Thai inward remittance commission, reported at 0.25% with a floor and ceiling that vary by bank, is charged on top and is not modelled here.',
    providers: [
      {
        slug: 'wise',
        name: 'Wise',
        customHeading: 'Wise in Thailand: cheapest to convert, no longer a place to hold',
        available: true,
        notes:
          'Still the cheapest route from client dollars to baht, and still the one changing under your feet. Wise now serves personal customers with a Thai registered address through a locally incorporated entity licensed by the Bank of Thailand. What is reported consistently, including in summaries of Wise\'s own help article that we could not open directly, is this: after the move, a non-baht payment arriving from someone else into your foreign currency receiving details, including your US routing number or a UK IBAN, is converted to baht, added to your THB balance, and charged a conversion fee. Money you add yourself from your own overseas bank account into a foreign currency balance is described as working as before, so the forced conversion targets exactly the case this page is about, which is a client paying you. The dates are not really in dispute, they have moved. Accounts opened after 21 January 2026 were being rolled onto the new rules progressively through August 2026, so if you signed up this year you may already be on them. Accounts opened before 21 January 2026 were due to move on 3 August 2026, and Wise is reported to have pushed that back at the end of July to October 2026, with verification documents requested in September. We could not open wise.com from our side to confirm any of it first hand, so check your own account rather than our dates. Two consequences people miss: moving money back out of baht is reported to carry daily caps, and once your balance is baht, paying out to a non-baht account means two conversions instead of one. One wrinkle worth checking yourself: the move is keyed to the registered address on your account rather than your nationality, so a foreign resident who still has a home country address on file may not be in the first wave. Look at the address in your Wise profile rather than assuming. Reports also say a DTV or ED visa is accepted for the Thai verification, which is more than the major Thai banks will accept for opening an account. Wise connected directly to PromptPay in May 2026, so a converted balance can land on a phone number.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank wire and Thai FCD account',
        customHeading: 'The only route that still lets you hold dollars',
        available: true,
        notes:
          'A foreign currency deposit account at a Thai bank is now the main reason to take a SWIFT wire rather than use Wise, and that is a genuine change in this corridor. Bangkok Bank, Kasikornbank and SCB all offer FCD accounts, in both resident and non-resident versions, and a dollar wire credited to one converts nothing on arrival. There is no blanket national rule forcing inbound foreign currency into baht, which is why a Thai bank can hold your dollars. Be careful with the conclusion though: Wise attributes its own change to the Thai regulatory requirements that come with the licence its local entity holds, and that is not a banking licence, so the fairer reading is that a bank and a licensed payment provider are allowed to do different things rather than that Wise simply chose this. What it costs: your client\'s US bank charges roughly $25 to $45 to send, and the major Thai banks publish an inward remittance commission of 0.25% with a floor and a ceiling, reported at a 200 baht minimum and 500 baht maximum at Bangkok Bank and a 300 baht minimum and the same 500 baht maximum at SCB. A correspondent bank may also deduct something in transit. We could not open any Thai bank tariff page, so treat those figures as reported rather than confirmed, and note that the comparison tables on this page do not model the commission at all. The other thing to know is that opening any Thai bank account as a foreigner now effectively requires a long stay non-immigrant visa. Tourist visas no longer work at the major banks, and reports for 2026 say the banks classify the Destination Thailand Visa as a tourist visa for this purpose, so a DTV on its own is unlikely to get you an account. Requirements still vary branch by branch in a way no published policy captures.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The default payout on Upwork and Fiverr, and the most predictable option here now that Wise is changing. Payoneer charges up to 1% on incoming commercial payments and up to 2% above mid-market when it converts dollars to baht on withdrawal, so roughly 3% all in. That is many times what our model has Wise charging on this corridor, and you are paying it for the platform integration rather than for the rate. Bangkok Bank publishes its own guide to receiving Payoneer withdrawals, which is about as close to institutional confirmation as this corridor gets. On speed, our comparison models about two days and that is optimistic. Payoneer\'s own material describes funds arriving within three to five business days of a withdrawal, and linking a bank account for the first time adds its own verification wait on top. We could not open payoneer.com from our side to confirm either figure. Whether a foreigner on a long stay visa can open a Payoneer account in Thailand is something we could not establish either way. Nothing we found says Thai nationality is required, and nothing says it is not, so if you are not Thai, confirm before you route a client to it.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        customHeading: 'Why PayPal probably is not an option for you in Thailand',
        available: true,
        notes:
          'This one needs reading carefully, because PayPal being available in Thailand and PayPal being usable by you are different questions. The 2022 relaunch removed the ability to receive payments from personal accounts in Thailand. Withdrawing an existing balance to a bank account was reported to continue, but receiving stopped, so a Thai freelancer cannot invoice a client into a personal PayPal account any more. For foreign residents it goes further: identity verification for personal accounts runs through Thailand\'s national digital ID system, which requires a thirteen digit Thai national ID, and a foreign passport, work permit, pink ID card or permanent residence permit are all reported as not accepted, so foreigners cannot hold a personal Thai PayPal account at all. The route that remains is a business account under a Thai registered company, which is reported not to need the national ID enrolment. We could not open paypal.com from our side, and we found no Thailand specific merchant fee schedule, so the percentages in our comparison are PayPal\'s generic cross-border pricing rather than anything confirmed for a Thai business account. Treat the number in the table as a placeholder and price your own account.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Western Union\'s cost on this corridor is not one number, and the honest thing is to show you the range rather than pick a point in it. Third party rate trackers put the dollar to baht spread around 1.5% below mid-market, which is what our comparison models. The World Bank\'s remittance price survey carries more than one Western Union entry for United States to Thailand, and the entries we saw quoted differed sharply, from an exchange rate margin of roughly 2% with total cost near 2.5% on one, to a margin above 5% with total cost above 7% on another. That is not two sources contradicting each other so much as Western Union pricing different products and delivery methods very differently, and a small transfer through the wrong one costing several times what a larger one through the right one costs. We could not open westernunion.com or the World Bank pages from our side to check any of these figures directly, so read the spread in our table as the cheap end of a wide range, not as a quote. The transfer fee is promotion driven and moves. Beyond the pricing, the same caution applies as on our Pakistan page: this is a consumer remittance product scoped and priced for someone sending money to family, and a client settling a commercial invoice through it is not the use case. Price your own transfer before accepting one.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Revolut does not open accounts to residents of Thailand, and the card is not available here either. A client abroad can still push a payment from their own Revolut account into your Thai bank account, but that arrives as an ordinary international transfer and you pay the Thai inward remittance commission on it. If you have seen Revolut listed as an option for Thailand, including in our own calculator before today, that was wrong and we have corrected it.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'Thailand does not appear on GrabrFi\'s published list of countries where you can open an account, which is keyed to your government issued ID. We previously listed GrabrFi as supporting Thailand and were showing it in the comparison here. That was wrong, and since we carry a referral link for GrabrFi, it is the kind of wrong that we benefit from, so it is worth stating plainly rather than quietly removing.',
      },
    ],
    supportedProviders: ['wise', 'payoneer', 'paypal', 'western-union', 'bank-wire'],
    faqs: [
      {
        q: 'Can I still hold USD in my Wise account in Thailand?',
        a: 'For now, and probably not for much longer. Wise is moving personal customers with a Thai registered address onto a locally incorporated entity licensed by the Bank of Thailand, and the reported consequence is that once you are moved, payments arriving from someone else into your foreign currency receiving details are converted to baht on arrival and charged a conversion fee. Money you add yourself from your own overseas bank account is described as working as before, so the restriction targets client payments specifically. The reported timing depends on when you signed up. Accounts opened after 21 January 2026 were being moved progressively through August 2026. Accounts opened before that date were due to move on 3 August 2026, and Wise is reported to have pushed that back at the end of July to October 2026, with verification documents requested in September. We could not open the Wise help article to confirm the dates ourselves, and older write ups still quote a May 2026 date that has since been superseded, so check your own account rather than planning around a date you read here. The move is keyed to your registered address, not your nationality, which is worth knowing if you are a foreign resident.',
      },
      {
        q: 'Can foreigners use PayPal in Thailand?',
        a: 'Not with a personal account. Verification for personal accounts in Thailand runs through the national digital ID system, which requires a thirteen digit Thai national ID. A foreign passport, work permit, pink ID card and even Thai permanent residence are all reported as not accepted, so a foreign resident cannot complete verification at all. Thai nationals who verified before the 2022 deadline kept their accounts, but personal accounts lost the ability to receive payments in the relaunch, so a personal account is for paying merchants rather than for getting paid. The only route we could identify for freelance income is a business account under a Thai registered company, which is reported not to require the national ID. If your plan was to invoice clients through PayPal as an individual living in Thailand, that plan does not work.',
      },
      {
        q: 'Do I pay Thai tax if I work remotely for a foreign client?',
        a: 'Probably yes, and probably not for the reason you have been reading about. Almost every article on this topic is about remitted foreign income, because that is what changed in 2024 and what generates the arguments. That is likely the wrong rule for you. Under the Revenue Code, income from work performed in Thailand is Thai source income, and Thai source income is taxable whether it is paid to you in Thailand or abroad and whether or not you ever bring it into the country. Source follows where the work is done, not where your client sits or where the money lands. Thai advisers make the point directly: working in Thailand while being paid into an overseas account does not make the income foreign source. So if you are physically in Thailand doing the work, the ordinary reading is that none of the remittance timing arguments help you. The remittance rules apply to genuinely foreign income, such as work done abroad, a foreign rental property or an offshore portfolio. Two things people get backwards. Thai source income is not switched on by the 180 day test: that test decides whether you are a Thai tax resident, counted cumulatively across a calendar year and on any visa, which is what brings remitted foreign income into scope, while Thai source income is assessable even if you stay under it. And separately from tax, Thai labour law is reported to treat any paid work performed in Thailand as requiring a work permit, even when the employer and the clients are abroad. We are not able to tell you which side of these lines your particular arrangement falls on, and it is worth an hour with a Thai tax adviser rather than an afternoon on an expat forum.',
      },
      {
        q: 'What is the current state of the rule on money I transfer into Thailand?',
        a: 'Unsettled, which is itself the useful answer. Revenue Department orders effective 1 January 2024 changed the interpretation so that foreign source income earned from that date, and remitted by a Thai tax resident in any later year, is assessable in the year you bring it in. Income earned before 2024 sits under the older treatment. Since then a relief measure has been drafted that would exempt foreign source income remitted in the year it was earned or the following calendar year, which would matter a great deal to anyone timing transfers. It needs Cabinet approval, Council of State review and publication in the Royal Gazette, and on the most recent information we could find it had not been published, which is the step that makes it law. We are not able to tell you why it has not moved. We previously said here that it was stalled for want of a government, and that was wrong: Thailand has had a sitting elected government since spring 2026, so whatever is holding the measure up, it is not that. So it is drafted, widely reported, and not in force as far as we can tell. Do not plan around it as though it were settled, and do not assume it is dead either. Verify the current position before making a decision that depends on it.',
      },
      {
        q: 'Can I open a USD account in Thailand?',
        a: 'Yes, and it is now the main reason to take a wire instead of using Wise. Thai banks offer foreign currency deposit accounts, commonly called FCD accounts, in both resident and non-resident versions, and Bangkok Bank, Kasikornbank and SCB all publish them. A dollar wire credited to one converts nothing, so you hold the currency and choose your own moment to sell it. Residents are reported to be able to deposit foreign currency received from abroad without a limit, and there is no end of day balance cap, though depositing physical foreign banknotes is capped, with a daily figure of about USD 15,000 across all accounts and all banks appearing in Thai bank product sheets. One trade off to know about: the FET form that banks issue is a record of converting foreign currency into baht, so money that sits in an FCD unconverted does not generate one, which matters if you are building a paper trail for a condominium purchase. The practical obstacle is not the FCD account itself but the underlying bank relationship. As a foreigner you now generally need a long stay non-immigrant visa to open any Thai bank account, tourist visas no longer work at the major banks, and reports for 2026 say the Destination Thailand Visa is treated as a tourist visa for this purpose. Requirements vary noticeably between branches, so ask at more than one if the first says no.',
      },
      {
        q: 'How much does my Thai bank charge to receive money from abroad?',
        a: 'The figure reported consistently across the major banks is an inward remittance commission of 0.25% of the amount, with a floor and a ceiling. Bangkok Bank is reported at a 200 baht minimum and 500 baht maximum, SCB at a 300 baht minimum and the same 500 baht maximum. Because of that floor and ceiling, small transfers effectively pay a flat minimum and large ones pay a flat maximum, which means the percentage cost falls sharply as the amount rises. On a thousand dollar invoice you are paying the floor, and on a twenty thousand dollar payment the same ceiling applies, which is why wires suit large irregular payments and suit small monthly invoices badly. A correspondent bank in the middle may also deduct its own fee before the money arrives, which nobody warns you about in advance. Our comparison does not model this commission or a correspondent deduction, so treat the wire figures there as covering the sending side only. We could not open any Thai bank tariff page from our side, so verify the current commission with your own bank.',
      },
      {
        q: 'What is a FET form and do I need one?',
        a: 'It is Thailand\'s closest equivalent to the inward remittance certificate that some other countries issue, and it is the document to ask for at the time rather than chase later. A Foreign Exchange Transaction form is issued by the receiving Thai bank and is reported to be required at fifty thousand dollars or equivalent in a single transaction, documenting the inbound money, the conversion into baht and the stated purpose. Below that threshold banks will normally issue a credit advice or a bank letter instead if you ask. You want one because it is the proof of inbound foreign funds that comes up when buying a condominium, and it is useful evidence if the Revenue Department or immigration ever asks where money came from. Note how that interacts with holding dollars: because the form records a conversion into baht, money parked in an FCD account and never converted will not produce one. Separately, banks are reported to require a purpose to be stated on inbound remittances regardless of size. Make sure your client\'s payment carries something like payment for services rather than gift or family support, because the purpose code follows the money and a wrong one is awkward to unpick later.',
      },
    ],
    siblingCorridors: ['usd-to-idr', 'usd-to-php', 'usd-to-gel'],
  },
  // ─── USD → Indonesia (IDR) ─────────────────────────────────────────────────
  {
    slug: 'usd-to-idr',
    source: 'USD',
    sourceCountry: 'US',
    destination: 'IDR',
    destCountry: 'ID',
    country: 'Indonesia',
    title: 'Receive USD in Indonesia: real costs compared 2026',
    metaDescription:
      'Compare the real cost of receiving USD in Indonesia. Wise stopped letting residents hold balances in 2024 and Revolut does not accept Indonesian residents.',
    h1: 'How to receive USD in Indonesia: why the usual advice is wrong, and what actually works',
    intro:
      'Indonesia is a harder corridor than it looks, and most of the guides you will find are wrong in the same two ways. They tell you to receive dollars into Wise, and they list Revolut as an option. Neither works. Wise stopped letting Indonesian residents hold a balance or use receiving account details in May 2024, reportedly because it did not hold the Bank Indonesia licence that would require, so you cannot hand a client Wise USD details from Jakarta. Revolut has never opened accounts to Indonesian residents at all. What is left is Payoneer for platform work, PayPal for the clients who insist on it, and a plain SWIFT wire into a rupiah or dollar account at one of the big banks. Wise still matters, just from the other side of the transaction: your client can send dollars through their own Wise account straight to your Indonesian bank, they pay the fee, and it costs you nothing to receive. Nothing forces you to convert inbound dollars either, so a rekening valas is a real option if you would rather hold the currency and pick your moment. The other thing that changed this year is tax, and not in your favour if you provide services.',
    publishedDate: '2026-08-28',
    updatedDate: '2026-08-28',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        customHeading: 'Payoneer: the practical default now that Wise is out',
        available: true,
        notes:
          'With Wise unable to give you receiving details, Payoneer becomes the realistic way to hand a US client something that looks like a domestic account. Sign-up takes a KTP or passport, a residential address and Indonesian bank details for the withdrawal leg. Payoneer charges up to 1% on incoming commercial payments funded by bank debit, and more if your client pays by card, then up to 2% above mid-market when it converts dollars to rupiah on withdrawal, so roughly 3% all in on a bank-funded payment. That conversion cost is embedded in the rate rather than shown as a line item, which is why people underestimate it. Withdrawals to BCA, Mandiri, BRI and the other large banks are reported to take three to five business days, and our comparison above models three days, which is the fast end of that range. There is also an annual account fee if your receipts fall below a minimum activity threshold over twelve consecutive months, and Payoneer\'s own material has quoted different thresholds at different times, so check yours in the portal rather than trusting a number from a blog. We could not open payoneer.com from our side, so all of these figures are reported rather than confirmed.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank wire and rekening valas',
        customHeading: 'Holding dollars instead of converting them',
        available: true,
        notes:
          'BCA, Mandiri, BNI and BRI all accept inbound SWIFT, and all of them sell foreign currency savings accounts, a rekening valas, to residents. This is the differentiated option on this corridor and it is worth understanding before you default to a wallet. A dollar wire credited to a rekening valas converts nothing, so there is no spread at the moment of receipt and you decide when to sell. Reported holding costs are modest, with opening deposits around a hundred dollars and monthly administration of roughly a dollar at the banks that publish it, though we could not open any bank page to confirm and found nothing usable for BRI at all. Against that, your client\'s US bank charges roughly $25 to $45 to send, and the Indonesian receiving side takes its own fee. Be careful with the inbound numbers circulating online: several of the figures quoted for Mandiri and BNI in search results are actually their outward remittance schedules, which are a different and more expensive thing. The FX spread shown in our comparison assumes conversion on arrival and is an estimate, since no Indonesian bank publishes its spread. If you route the wire into a valas account, that part of the cost is simply deferred until you convert.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: true,
        notes:
          'Available and expensive, with one Indonesia-specific catch worth knowing before you rely on it: withdrawals to an Indonesian bank are consistently reported to arrive in rupiah, with no option to pull dollars out to a local foreign currency account. If that holds, the conversion is compulsory and happens on PayPal\'s terms rather than yours. We could not open PayPal\'s Indonesian pages to confirm it, so check in your own account before you plan around it. The cost stacks the usual way, a cross-border commercial receiving fee of around 4.4% plus a small fixed amount, then a currency conversion charge on top, which the fee wording we found puts at 3% above the base rate when you convert a balance before withdrawing, and higher when the conversion happens inside a transaction. Our comparison models 3.5%, which is a midpoint rather than a figure quoted for Indonesia. Call it roughly 8% before the money reaches your bank, and treat that as an estimate rather than a quote. Withdrawal itself is reported as free at or above Rp1,500,000 and around Rp16,000 below that, taking two to four business days. Use PayPal when a client insists on it and move recurring clients somewhere else.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Pays out to Indonesian bank accounts, and it is the one provider here where we could not find a rate or a spread quoted for this corridor from any source we could open. Western Union does publish a send page for the United States to Indonesia, but no markup. Generic 2026 write-ups put Western Union bank deposit markups somewhere between about 0.5% and 2.5% depending on corridor and payout method, which is too wide to rank on. That is why the comparison above marks the Western Union row as estimated and why it cannot take the best value badge, even though it sorts first on net received. The structural point matters more than the number anyway: this is a personal remittance product, built and priced for someone sending money to family, and a client paying a commercial invoice through it raises the same classification question we flag on the Pakistan page. If you use it, compare the quoted rupiah amount against the mid-market rate before you accept.',
      },
      {
        slug: 'wise',
        name: 'Wise',
        customHeading: 'Wise: not a receiving option here, but still useful from the sender side',
        available: false,
        notes:
          'This is the correction that matters most on this page, because it is what almost every competing guide gets wrong. Indonesian residents cannot receive money into a Wise account, cannot hold a balance and cannot get receiving account details. Wise ended all three for Indonesia-registered customers on 23 May 2024, reportedly because it does not hold the Bank Indonesia electronic money licence that holding customer balances requires. Its Indonesian entity remains licensed for remittance, which is the source of the confusion: Wise still works in Indonesia, just not in the direction you need. So there is no version of this where you hand a US client Wise USD details from here. What does work is the reverse: your client sends dollars from their own Wise account to your Indonesian bank account, or to a DANA, GoPay, OVO or ShopeePay wallet, at the real mid-market rate. They pay the fee. Your receiving cost is zero. That is genuinely the cheapest way to be paid in this corridor, and it costs you nothing but the awkwardness of asking a client to use a specific service. Worth asking.',
      },
      {
        slug: 'revolut',
        name: 'Revolut',
        available: false,
        notes:
          'Indonesia is not on Revolut\'s list of countries where you can sign up, for personal or business accounts, and Indonesian residents cannot open one. An account opened while you lived in a supported country may survive a move, but that is a question about your residency history rather than about availability here. We previously listed Revolut as available for Indonesia in our calculator, and it was ranking first. That was wrong and we have removed it.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi ties account eligibility to a government issued ID from a fixed list of countries, and Indonesia is not on it. Indonesia separately appears on GrabrFi\'s list of countries where its dollar debit card does not work. We had Indonesia listed as supported and were showing GrabrFi in the comparison here alongside a referral link we earn from, which makes this a correction worth stating rather than quietly making.',
      },
    ],
    supportedProviders: ['payoneer', 'paypal', 'western-union', 'bank-wire'],
    faqs: [
      {
        q: 'Can I still use Wise to receive money in Indonesia?',
        a: 'No, and this is the single most common piece of outdated advice about this corridor. Since 23 May 2024, customers registered in Indonesia cannot receive money into a Wise account, cannot hold a balance and cannot use receiving account details. The reported reason is that holding customer balances requires a Bank Indonesia electronic money licence that Wise does not have, while its Indonesian entity stays licensed for remittance. That distinction is why so many guides still list Wise as an option: Wise genuinely does still operate in Indonesia, but only for sending money out and for delivering money in from someone else. The workaround is real and worth using. Ask your client to pay you through their own Wise account. They send dollars, Wise converts at the mid-market rate, rupiah lands in your Indonesian bank account or your e-wallet, and your side of that transaction costs nothing.',
      },
      {
        q: 'Is Revolut available in Indonesia?',
        a: 'No. Indonesia is not on Revolut\'s sign-up list for personal or business accounts, and residents cannot open one. If you opened an account while living in a country Revolut supports and then moved, that account may continue to work, but that is about where you were when you signed up rather than about Indonesia being supported. We list this plainly because our own calculator had Revolut ranked first for Indonesia until we corrected it, and because several of the guides ranking for this question still list it as an option. Treat any article recommending Revolut for an Indonesian freelancer as evidence that its author did not check.',
      },
      {
        q: 'Can I keep my dollars instead of converting to rupiah?',
        a: 'Yes. We found no rule requiring an individual to convert inbound dollars from services income, and Indonesian banks openly sell foreign currency savings accounts, rekening valas, to residents. It is worth saying that proving a negative from search results is not the same as reading the regulation, and we could not open Bank Indonesia\'s site, so verify the current position if a lot of money depends on it. The rule people confuse this with is the export proceeds retention requirement. Government Regulation 8 of 2025 obliges exporters of natural resources to park 100% of their export proceeds in the Indonesian financial system for twelve months, and it took effect on 1 March 2025. It applies to mining other than oil and gas, plantations, forestry and fisheries, and only above an export value of around USD 250,000. Service exports sit outside it, so it has nothing to do with a freelancer invoicing a foreign client. A separate rule is worth knowing if you plan to build a dollar balance: from 1 July 2026 Bank Indonesia lowered the amount of foreign currency a customer can buy against rupiah without supporting documents to around USD 10,000 a month, and lowered the documentation threshold for transferring foreign currency abroad to around USD 25,000. Neither of those bites on dollars you simply receive and keep, but both bite if you buy dollars with rupiah or send dollars back out. One thing that is reported to be non negotiable: PayPal withdrawals to an Indonesian bank arrive in rupiah, so if holding dollars is the goal, PayPal cannot do it and a wire into a valas account is the route.',
      },
      {
        q: 'Can freelancers still use the 0.5% final tax (PPh final UMKM) in 2026?',
        a: 'This changed in 2026 and probably not in your favour. Government Regulation 20 of 2026, signed on 22 April 2026, did two generous things and one restrictive one. It removed the seven year time limit that used to cap how long an individual could use the 0.5% final tax on turnover, so for individuals the scheme now runs indefinitely. It kept the Rp4.8 billion turnover ceiling and kept the rule that the first Rp500 million of an individual\'s annual turnover is not taxed. But it also excluded income from services connected to independent professional work, pekerjaan bebas, from the scheme. Published summaries of the excluded list are not identical to one another, and the versions we found name lawyers, accountants, architects, doctors, consultants, notaries, land deed officials, appraisers and actuaries, plus artists and performers, athletes, teachers and trainers, authors, researchers and translators, online content creators such as influencers, bloggers and vloggers, intermediaries and insurance agents. There is transitional relief: individuals already in the scheme who are caught by the new exclusion are reported to be able to stay on it until the end of the 2026 tax year, with the ordinary regime applying from 2027. Whether a software developer or a designer sits inside pekerjaan bebas is not settled by anything we could read, and we are not going to tell you that you qualify. The exposure is in two catch-all phrases, konsultan and tenaga ahli sejenis lainnya, which are broad enough to reach a freelancer selling expert services in their own name, and other parts of Indonesia\'s income tax rules have long treated computer and application systems services as independent professional work. Plan on the assumption that you may be excluded rather than on the assumption that you are safe. One more change worth knowing: the regulation tests the Rp4.8 billion ceiling on combined turnover across a married couple and any single owner companies either of them has set up, so a spouse\'s business can push you over. We could not open the tax authority pages or the regulation text, so take this to a konsultan pajak before you file.',
      },
      {
        q: 'Will my bank ask what the incoming transfer is for?',
        a: 'Yes, and it is routine rather than suspicious. Indonesian banks attach a purpose code to incoming foreign currency credits for Bank Indonesia reporting, so expect to be asked what the money is for and answer with something specific like payment for software development services per invoice. That reporting is an obligation on the bank rather than on you, and on the information we found it covers foreign exchange flows generally rather than only large ones, so splitting a payment to duck a reporting line does not achieve anything. Do not read that as meaning Indonesia has no thresholds anywhere: separate Bank Indonesia rules that changed on 1 July 2026 set documentation thresholds on buying foreign currency against rupiah and on transferring foreign currency abroad. Keep the credit advice the bank issues, the invoice and a written contract with the client. Indonesia has no equivalent of the inward remittance certificate that some countries issue, so that document set is your evidence of foreign income. We could not confirm whether Indonesian banks issue a standard named certificate on request, so ask yours.',
      },
      {
        q: 'Can I receive money from abroad directly into GoPay, OVO or DANA?',
        a: 'Indirectly, and only through a sender who uses Wise. Wise pays out to DANA, GoPay, OVO and ShopeePay using an Indonesian mobile number, so a client sending you money through their own Wise account can deliver rupiah straight to a wallet. Payoneer and PayPal, as far as we could establish, do not pay out to Indonesian e-wallets at all, so with those you are withdrawing to a bank account regardless. Be aware of the ceilings before you plan around this. Wise is reported to cap wallet payouts far below its bank transfer cap, and on top of that each wallet has its own monthly limits set by your verification tier, which are low enough that a single decent invoice can exceed them. Wallets are a convenience for small amounts, not a way to bank freelance income.',
      },
      {
        q: 'Do I have to charge VAT to a foreign client?',
        a: 'Generally no, because exported services are zero rated, but the mechanics are where people come unstuck. A ministerial regulation sets a 0% rate on exported taxable services and the covered list includes technology and information services such as system analysis, system design, application and website development and IT security, along with a range of consulting categories. Most freelancers never reach the question anyway, because registering as a taxable entrepreneur only becomes compulsory above a turnover threshold that is far above typical freelance income. Two cautions. Zero rated is not the same as outside scope, and the filing mechanics attached to claiming it, including a written agreement and a specific export notification, are the part we could not verify before our research ran out of budget, so we are deliberately not describing the steps. Get those from an Indonesian tax adviser rather than from us.',
      },
    ],
    siblingCorridors: ['usd-to-thb', 'usd-to-php', 'usd-to-pkr'],
  },
];
