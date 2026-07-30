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
      'Pakistani freelancers have fewer options than most -- PayPal has never launched in Pakistan and Pakistani residents cannot open a Wise account for receiving. Payoneer is the dominant choice at up to about 3% all-in (1% fee + up to 2% FX markup on PKR withdrawal). Western Union is cheaper than commonly assumed (around 2% FX spread and a $0 online fee for bank deposits over $200 under the Pakistan Remittance Initiative), though Payoneer remains the standard for recurring client payments.',
    publishedDate: '2026-06-03',
    updatedDate: '2026-07-30',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant choice for Pakistani freelancers receiving from Upwork, Fiverr, Toptal, and direct US clients. Payoneer charges 1% on incoming commercial payments. When you withdraw your Payoneer balance to a local PKR bank account, Payoneer applies an FX conversion at up to 2% above mid-market, giving a typical all-in cost of up to about 3% (1% receiving fee plus up to 2% FX markup). Requires identity verification (CNIC or passport). Works reliably with HBL, UBL, MCB, and Meezan Bank; HBL and Meezan have official real-time withdrawal integrations with Payoneer.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Available for bank deposit to major Pakistani banks, and cheaper than its reputation suggests. Pakistan is a Pakistan Remittance Initiative (PRI) corridor: Western Union charges a $0 online transfer fee for bank deposits over $200, and its USD-to-PKR exchange rate markup is roughly 2% below mid-market. On a $1,000 transfer you effectively lose around $20. That is still more than Payoneer for recurring commercial payments, and PRI terms are aimed at personal remittances, so verify how your transfer is classified before relying on it for client invoices.',
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
        a: 'For Pakistani residents, Payoneer is the cheapest widely-available option at up to about 3% all-in (1% receiving fee plus up to 2% FX markup on PKR withdrawal). The even cheaper approach -- if your client is cooperative -- is to ask them to send via Wise directly to your Pakistani bank account. In that scenario, the recipient cost is zero and the client pays roughly 0.5--1.5% on their end. This does not work on platforms like Upwork or Fiverr that have their own payment processing, but it works for direct clients who invoice you.',
      },
      {
        q: 'How long does it take to receive international payments in Pakistan?',
        a: 'Payoneer to a local PKR bank account: within minutes via the real-time HBL or Meezan Bank app integrations, or typically 1--2 business days for standard bank withdrawals. Payoneer balance to balance is near-instant. Western Union bank deposit: 1--3 business days. SWIFT wire from a US bank to a Pakistani bank: 3--7 business days, sometimes longer if intermediate correspondent banks add delays. The Pakistan banking system adds no unusual delays compared to other developing-country corridors.',
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
    siblingCorridors: ['usd-to-bdt', 'usd-to-ngn'],
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
    updatedDate: '2026-07-30',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant route for Bangladeshi freelancers on Upwork, Fiverr, and direct invoicing. Payoneer charges 1% on incoming commercial payments. When you withdraw to a local BDT bank account, Payoneer applies an FX conversion at roughly 1.2%-4% (the official fee schedule, updated January 2026, states this range; roughly 2% is a representative midpoint). Same-currency USD-to-USD withdrawal is a flat $1.50 instead. You can also withdraw directly to a bKash wallet via Payoneer\'s bKash integration; Payoneer charges a separate conversion fee for this route (approximately 3% plus $1 per transaction as of mid-2026; verify in the Payoneer portal, as this differs from the standard bank withdrawal fee). On the bKash side, cash-out charges apply when withdrawing cash via an agent; rates have changed significantly from historical figures, so check the bKash charge calculator for the current rate before assuming any specific number. The bKash route is fast but does not generate a Foreign Inward Remittance Certificate (FIRC), which is required to claim the export cash incentive and fund an ERQ foreign-currency account. Annual account fee: $29.95/year, charged only if the account receives less than Payoneer\'s minimum activity threshold in any 12 consecutive months; Payoneer\'s help center currently states $6,000, though it has cited $2,000 elsewhere, so verify the current Bangladesh threshold in the Payoneer portal. Typical all-in cost for bank account withdrawal: 3-5%.',
      },
      {
        slug: 'bkash-withdrawal',
        name: 'Payoneer-to-bKash',
        customHeading: 'How the Payoneer-to-bKash withdrawal works',
        available: true,
        notes:
          'Payoneer has a direct integration with bKash that lets Bangladeshi freelancers transfer their Payoneer balance to a bKash wallet without first withdrawing to a bank account. In the Payoneer portal or app, you initiate a withdrawal, select bKash as the destination, enter your bKash-registered phone number, and confirm. The transfer typically completes within a few hours. Payoneer charges a separate conversion fee for this route: approximately 3% plus $1 per transaction as of mid-2026. This is higher than the standard bank account withdrawal route (1% plus roughly 2% FX markup), so the bKash route costs more in fees despite being faster. Always verify the current fee in the Payoneer portal before withdrawing. On the bKash side, you pay bKash\'s standard cash-out charges when withdrawing cash via an agent or ATM. Standard agent cash-out rates increased significantly from historical levels (a figure of 7 Taka per 1,000 cited in older guides is no longer current; standard agent rates were approximately 1.85% as of early 2026). Check the bKash charge calculator for the current rate. The bKash route does not generate a Foreign Inward Remittance Certificate (FIRC), so it is not eligible for the Bangladesh Bank export cash incentive. To qualify for the incentive, you must withdraw to a bank account. For Nagad: Nagad is not a direct Payoneer withdrawal destination as of mid-2026. A foreign client using Wise can push BDT to a Nagad wallet at Wise\'s mid-market rate with no receiving cost to you, but this requires your client to do it manually and does not work on Upwork or Fiverr. Rocket (Dutch-Bangla Bank mobile wallet) supports inbound personal remittances but is not a standard channel for collecting freelance client payments.',
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
          'Bangladeshi residents cannot open a Wise account, cannot hold USD in a Wise wallet, and cannot get Wise receiving details to share with clients. However, Wise is available as a sending tool for your foreign client: a US client can use Wise to push BDT directly to your Bangladeshi bank account, bKash wallet, or Nagad wallet at Wise\'s mid-market rate — the client pays roughly 0.7–1.9% on their end and your receiving cost is zero. This workaround is useful for direct clients willing to set it up manually, but it does not work on freelance platforms (Upwork, Fiverr) that process payments through their own systems.',
      },
      {
        slug: 'paypal',
        name: 'PayPal',
        available: false,
        notes:
          'PayPal commercial receiving is not available in Bangladesh. Only Xoom (a PayPal subsidiary) operates in Bangladesh, and Xoom explicitly states it supports person-to-person inbound remittance only — it does not support transactions for goods or business purposes. A freelancer cannot receive client project payments into a PayPal account in Bangladesh. Note: the availability of the Payoneer-PayPal workaround (receiving PayPal payments via Payoneer) for Bangladesh-registered accounts is unclear as of mid-2026; reports conflict on whether Payoneer\'s PayPal-receiving rollout covers Bangladesh, so check your own Payoneer dashboard for a PayPal option rather than relying on it. There have been repeated government statements about a full PayPal launch in Bangladesh, but no commercial launch has occurred as of mid-2026. Treat PayPal as unavailable and plan billing around Payoneer and bank wire.',
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
        a: 'For most Bangladeshi freelancers, Payoneer to a local bank account is the cheapest widely available option at roughly 3–5% all-in (1% receiving fee plus 1.2–4% FX markup on BDT withdrawal). If your direct client is willing to cooperate, asking them to use Wise to push BDT to your bank account, bKash, or Nagad costs you nothing — the client pays roughly 0.7–1.9% on their end. This does not work on Upwork or Fiverr. For large, infrequent payments over $5,000, a SWIFT bank wire becomes cost-competitive once the flat fee is spread over the larger amount, and it generates the FIRC documentation needed for the export cash incentive.',
      },
      {
        q: 'Does the 2.5% remittance incentive apply to freelancing?',
        a: 'No. The widely-known 2.5% government cash incentive is the Wage-Earner Remittance scheme for overseas Bangladeshis sending personal remittances home — it does not apply to freelance or IT earnings. Freelancers fall under a separate export cash incentive: Bangladesh Bank confirmed unchanged rates for FY2026-27 (covering earnings from 1 July 2026 to 30 June 2027) at 2.5% for individual freelancers and 6% for registered software/ITES firms. This incentive is only claimable via proper banking channels with a FIRC — Payoneer-to-bKash withdrawals do not qualify. Importantly, these incentives are expected to be phased out around Bangladesh\'s LDC graduation to comply with WTO rules. Bangladesh\'s graduation date is still officially 24 November 2026; the UN Committee for Development Policy recommended in mid-2026 extending it to around 24 November 2029, but that recommendation needs UN General Assembly approval, expected around September 2026, before it is final. Verify the current rate and eligibility before relying on it.',
      },
      {
        q: 'Can I keep my earnings in dollars (ERQ account)?',
        a: 'Yes. IT/ICT service exporters and freelancers can retain 35% of export earnings in foreign currency via an Exporter\'s Retention Quota (ERQ) account; the remaining 65% auto-converts to BDT. Note: some bank websites still show 60–70% retention — that figure was cut to 35% in September 2023 and has not been restored. City Bank, Mutual Trust Bank (MTB), and Midland Bank all offer dedicated Freelancer accounts that include an ERQ foreign-currency sub-account. Retaining dollars is useful if you have USD-denominated expenses or want to avoid unfavorable conversion timing.',
      },
      {
        q: 'How long does it take to receive payments in Bangladesh?',
        a: 'Payoneer to a local BDT bank account: typically 1–3 business days after the payment clears on the sender\'s side. Payoneer to bKash: typically instant or within a few hours. SWIFT bank wire to a Bangladeshi bank: 1–3 business days in most cases; can be longer if correspondent banks are involved. Most Bangladeshi banks have improved SWIFT processing and straightforward USD→BDT wires usually settle within 2 business days.',
      },
      {
        q: 'Do I have to pay income tax on foreign freelance earnings?',
        a: 'IT and ITES freelance and business income is income-tax exempt through 30 June 2027 under the Finance Act 2024 / Income Tax Act 2023, Schedule 6. This exemption has two conditions: (a) filing an income tax return even if no tax is owed, and (b) operating cashless — all business income, expenses, and investments must move through bank transfer. Important: this covers independent freelance and business income from IT/ITES work; it does NOT apply to a salaried remote employee of a foreign employer. Rules change with each annual Finance Act — confirm against the FY2026-27 budget. Consult a Bangladeshi tax professional; this site covers transfer fees, not tax.',
      },
      {
        q: 'Can I receive Payoneer payments directly into bKash or Nagad?',
        a: 'Yes for bKash. Payoneer has a direct bKash integration: in the Payoneer portal or app, you can initiate a withdrawal to your bKash wallet by entering your bKash-registered phone number. Payoneer charges approximately 3% plus $1 per transaction for this route as of mid-2026 (verify in the Payoneer portal before withdrawing, as this fee differs from the bank account withdrawal fee). On the bKash side, standard cash-out charges apply when withdrawing cash via an agent; check the bKash charge calculator for the current rate, as rates have changed from historical figures. This route is typically fast (a few hours) but does not generate a FIRC, so it does not qualify for the export cash incentive. For Nagad: Nagad is not a direct Payoneer withdrawal destination as of mid-2026. A foreign client using Wise can push BDT to a Nagad wallet at mid-market rate at no receiving cost to you. Rocket (Dutch-Bangla Bank wallet) supports inbound personal remittances but is not used as a freelance payment collection channel.',
      },
      {
        q: 'Which is better: Payoneer to bank account or to bKash?',
        a: 'The bank account route is cheaper for most transfers: Payoneer charges a higher conversion fee for the bKash route (approximately 3% plus $1) than for bank account withdrawals (1% plus roughly 1.2%-4% FX markup, typical all-in 3-5%). The bKash route is faster, typically settling within hours rather than 1-3 business days. For claiming the export cash incentive or funding an ERQ account, you must use the bank route: bKash withdrawals do not generate a Foreign Inward Remittance Certificate (FIRC). A practical split: use the bKash route for small, urgent withdrawals when you need cash quickly; route your main income through a bank account for savings, incentive claims, and ERQ.',
      },
    ],
    siblingCorridors: ['usd-to-pkr', 'usd-to-ngn'],
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
      'Nigerian freelancers now have strong specialist options: Cleva, Grey, LemFi, and Raenest all issue virtual US bank accounts that convert at near mid-market rates, typically 0-2.4% all-in. Payoneer works but costs roughly 3% all-in and carries a minimum activity threshold (currently $6,000/year per Payoneer\'s help center) below which an annual fee applies. PayPal returned to Nigeria in January 2026 via a Paga partnership, but stacked fees make it roughly 6-7% or more all-in and the most expensive widely-available option.',
    publishedDate: '2026-06-14',
    updatedDate: '2026-07-30',
    providers: [
      {
        slug: 'lemfi',
        name: 'LemFi',
        available: true,
        notes:
          'LemFi (formerly Lemonade Finance) issues a virtual US bank account that Nigerian freelancers can share with clients as standard ACH receiving details. Fee structure: no flat fee, no percentage fee, and LemFi applies the true mid-market exchange rate with no markup, making it the theoretically cheapest option for any transfer size. Typical settlement: 1-2 business days. LemFi is FCA-licensed in the UK, is registered with FINTRAC as a Money Service Business (MSB) in Canada, and operates under CBN approval in Nigeria. As it is a smaller operator than Cleva or Grey, verify current withdrawal limits before relying on it for large amounts.',
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
          'Cleva is a Nigeria-specific fintech that issues a virtual US bank account (routing number and account number) so clients can send a domestic ACH or wire as if paying a US-based contractor. Fee: a two-tier deposit fee on the incoming ACH ($1 for deposits under $300, $3 for deposits of $300 or more); converting and withdrawing to your Nigerian bank account is free at the true mid-market rate. On a $1,000 transfer the total cost is the $3 deposit fee, or 0.3%. On a $200 transfer the deposit fee drops to $1 (0.5%). Typical settlement: within 24 hours of the ACH credit clearing (ACH from client takes 1-2 business days). No annual account fee. CBN-licensed IMTO.',
      },
      {
        slug: 'grey',
        name: 'Grey',
        available: true,
        notes:
          'Grey issues virtual USD (and optionally GBP and EUR) accounts for Nigerian freelancers. Clients send a regular ACH or wire; Grey charges a 0.8% deposit fee (minimum $2, maximum $10) on the incoming USD, plus a 1% conversion fee capped at $6 per transaction, plus approximately 1% FX markup above mid-market. On a $1,000 transfer the combined cost is approximately $24 ($8 deposit fee + $6 capped conversion fee + $10 FX), or about 2.4% effective. On a $5,000 transfer the cost is approximately $66 ($10 deposit cap + $6 conversion cap + $50 FX), or 1.3%. Grey also offers a Visa debit card for a one-time $5 fee. Grey is CBN-regulated (licence 10151) and supports multiple currencies, making it a good option if you also receive GBP or EUR from European clients.',
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
          'SWIFT wires from US banks reach major Nigerian banks (GTBank, Access Bank, Zenith Bank, First Bank, UBA) directly. The sending fee from a typical US bank is $25-45 flat; the receiving bank converts at the NAFEM (official CBN window) rate plus approximately 2% spread. On a $1,000 transfer, the combined cost of a $35 flat fee plus 2% FX is roughly 5.5%. Bank wires make sense for large, infrequent payments over $5,000 where the flat fee becomes a small fraction of the total. Note on the IMTO rule: the CBN issued a circular on March 24, 2026 (effective May 1, 2026) requiring licensed IMTO operators (Western Union, MoneyGram, and similar) to pay out in naira only. This rule does not apply to SWIFT client-to-business wires. Your Nigerian bank can still receive a USD SWIFT wire and convert it at the NAFEM rate.',
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
        a: 'LemFi is theoretically the cheapest at zero fees and true mid-market FX, but it is a smaller operator, so verify withdrawal limits before relying on it for large amounts. Cleva ($1 deposit fee under $300, $3 at $300 or more, then free mid-market conversion) and Raenest (4 free deposits/month, then $1 flat, plus a 0.5% conversion fee capped at $2.70) are competitive and widely used. Grey (0.8% deposit fee plus 1% conversion fee capped at $6, plus about 1% FX, roughly 2.4% all-in on $1,000) is more expensive but well-established and supports GBP and EUR too. Payoneer (1% + up to 2% FX) and PayPal via Paga (roughly 6-7% or more all-in) are significantly more expensive and should be reserved for situations where you have no other option.',
      },
      {
        q: 'Does Wise work for Nigerian freelancers?',
        a: 'Not for receiving. Nigerians can reportedly open a restricted Wise personal account, but it comes without local receiving details you can share with clients or freelance platforms, so it cannot work as a virtual receiving account. A foreign client can use Wise to push NGN to your Nigerian bank account manually, but this requires them to enter your bank details each time and is not available on freelance platforms like Upwork or Fiverr. In practice, use Cleva, Grey, LemFi, or Raenest instead: they all issue virtual US account numbers you can give clients as standard US bank receiving details.',
      },
      {
        q: 'What is the IMTO naira-only rule and does it affect me?',
        a: 'The CBN issued a circular on March 24, 2026 (effective May 1, 2026) requiring licensed International Money Transfer Operators (IMTOs) to pay all incoming remittances in naira only. This applies to Western Union, MoneyGram, and similar licensed IMTO operators. It does not apply to SWIFT bank-to-bank transfers: your Nigerian bank can still receive a USD SWIFT wire and convert it at the official NAFEM window rate. LemFi, Raenest, and Cleva each hold CBN IMTO licences, so the naira-only settlement rule technically covers them too, but in practice this changes nothing for freelancers because these platforms already convert and pay out in naira rather than USD cash. Your practical workflow is unaffected.',
      },
      {
        q: 'How long does it take to receive USD in Nigeria?',
        a: 'Cleva: typically within 24 hours once the US ACH credit clears (the ACH from your client takes 1-2 business days on their side). Grey: typically 24 hours. LemFi: 1-2 business days. Raenest: typically 24 hours. Payoneer to local NGN bank: typically 2-4 business days after the payment clears. SWIFT bank wire: 2-5 business days. PayPal via Paga: timing can vary given the integration is relatively new.',
      },
      {
        q: 'Is Payoneer still worth using for Nigerian freelancers?',
        a: 'Payoneer\'s main advantage is platform compatibility: if you work on Upwork or Fiverr, Payoneer is often the default and cheapest withdrawal method from the platform balance. If you are billing direct clients, Cleva, LemFi, or Raenest give better rates. Watch the annual fee threshold: if your Payoneer account receives less than the minimum activity threshold in any 12-month period, you are charged $29.95 in annual fees. Payoneer\'s help center currently puts that threshold at $6,000, though it has published $2,000 elsewhere, so confirm the figure for your account in the portal. For low-volume freelancers with direct clients, a fee-free option like LemFi or Cleva is clearly better.',
      },
      {
        q: 'Do I have to pay tax on freelance income in Nigeria?',
        a: 'Yes. Foreign-sourced income received in Nigeria is taxable under the Personal Income Tax Act (PITA) for individuals and the Companies Income Tax Act (CITA) for registered businesses. Freelancers assessed as individuals face progressive tax rates from 7% to 24%. Nigeria does not have a blanket income tax exemption for IT freelancers comparable to some other countries. Filing is required. Tax rules change with annual Finance Acts. Consult a Nigerian tax professional: this site covers transfer fees, not tax advice.',
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
    updatedDate: '2026-07-30',
    providers: [
      {
        slug: 'wise',
        name: 'Wise',
        available: true,
        notes:
          'This corridor is the exception among the emerging markets we cover: Philippine residents can open a full Wise account, not a receive-only workaround. You get local USD account details (a US routing number and account number) that a client or platform pays by domestic ACH for free; an incoming USD wire costs $6.11. The money sits in your USD balance until you convert, and conversion to PHP happens at the mid-market rate for a fee that typically lands under 1% (about 0.65% is representative; verify the current fee in the app before converting). Reported limits for Philippine accounts are around $10,000 per transfer or conversion and roughly 10 million PHP per month in top-ups and receipts; check current limits in the app, as we could not confirm these against a live pricing page. Signup requires a Philippine ID and proof of address.',
      },
      {
        slug: 'gcash',
        name: 'GCash Virtual US Account',
        customHeading: 'How the GCash Virtual US Account works',
        available: true,
        notes:
          'GCash launched its Virtual US Account in November 2025 (with wider in-app rollout through December), powered by Meridian Payments US. A verified GCash user gets US ACH and wire receiving details inside the app, and the launch materials name Wise, Gusto, Payoneer, Deel, Upwork, and Chase as senders that work. ACH deposits carry no transfer fee and post in 1-3 business days; wires arrive same day for $15. The dollars land as USD in your GCash wallet and stay there until you choose to convert to pesos. The catch, and the reason GCash does not appear in our ranked table above: GCash has not published the FX spread it applies on that USD-to-PHP conversion. Marketing copy calls the rate competitive, which is not a number. Check the quoted rate in the app against the mid-market rate at open.er-api.com before converting a large amount. If the spread is small, this is a genuinely strong option, since you probably already have the app.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The default payout method on Upwork and Fiverr, and the route most Filipino platform freelancers already use. Payoneer charges up to 1% on incoming commercial payments (minimum $1 on payments under $100). Withdrawing to a Philippine bank account or GoTyme applies an FX conversion of up to about 2% above mid-market, so the typical all-in cost is roughly 3%. Routing a withdrawal straight into GCash may add a separate GCash-side cash-in fee on top of that; reported figures conflict (a flat 1% in GCash\'s Payoneer cash-in help article, versus a monthly free allowance then 2% elsewhere), so check the current rate in the app before assuming the bank figure applies. An annual account fee of $29.95 applies if the account receives less than Payoneer\'s minimum activity threshold in 12 consecutive months; the help center has cited both $2,000 and $6,000 figures at different times, so verify your account\'s threshold in the portal. If you bill direct clients rather than platforms, Wise costs meaningfully less.',
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
          'Available, familiar, and the most expensive mainstream way to receive client money in the Philippines. Cross-border commercial receiving runs about 4.4% plus a fixed fee, and converting the USD balance to pesos adds a currency spread of roughly 3-4% (we could not open PayPal\'s Philippine fee page directly, so treat the exact percentages as estimates and check your own transaction receipts). PayPal links directly to GCash, which used to make the withdrawal step free, but that changed on 7 March 2026: GCash now charges a flat 1% cash-in fee on PayPal transfers, on top of everything above. Settlement still takes about 1-2 business days. Use PayPal when a client insists on it; move recurring clients to Wise or Payoneer.',
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
        a: 'Yes, and this is what sets the Philippines apart from markets like Pakistan or Nigeria. Philippine residents can open a full Wise account with a local ID and proof of address. The account includes US ACH receiving details (routing and account number) you can hand to clients or connect to platforms; receiving USD by ACH is free, and an incoming wire costs $6.11. You hold the dollars in your Wise balance and convert to PHP at the mid-market rate whenever you like, paying a conversion fee that typically comes in under 1%. Reported account limits are about $10,000 per transfer and around 10 million PHP received per month; verify current limits in the app.',
      },
      {
        q: 'What is the cheapest way to receive USD in the Philippines?',
        a: 'Wise, for most people, most of the time. Free ACH receiving plus a sub-1% conversion fee at the true mid-market rate beats everything else we can verify on this corridor. The GCash Virtual US Account also receives ACH for free and might be comparable overall, but GCash does not publish its USD-to-PHP conversion spread, so we cannot rank it honestly; check the app\'s quoted rate against mid-market before converting. Payoneer runs roughly 3% all-in and earns its keep mainly as the default platform payout. PayPal is the most expensive at roughly 8% once the receiving fee and the FX spread stack. For a single large payment, a SWIFT wire into a bank USD account can be cheapest of all, since the flat fees stop mattering and you control when to convert.',
      },
      {
        q: 'How does the GCash Virtual US Account work, and what does it cost?',
        a: 'GCash introduced it in November 2025 with Meridian Payments US as the banking partner, with wider in-app rollout through December. Inside the GCash app you apply through the US Accounts section, and once approved you get US ACH and wire details that US employers, platforms, and payroll services can pay like any domestic account. ACH deposits are free and take 1-3 business days; wires post same day for $15. The money arrives as USD and sits in your wallet until you convert to pesos. What GCash has not published is the FX spread on that conversion, which is the number that decides whether this beats Wise. Until they do, compare the in-app rate to the mid-market rate before converting anything sizable.',
      },
      {
        q: 'How do I withdraw PayPal money to GCash, and what does it cost?',
        a: 'The withdrawal used to be free, but since 7 March 2026 GCash charges a flat 1% cash-in fee on PayPal transfers. PayPal and GCash still have a direct link: connect your GCash account in PayPal, withdraw, and the money typically lands within 1-2 business days. Most of the cost sits earlier in the chain, where PayPal charges about 4.4% plus a fixed fee to receive a cross-border commercial payment and then applies a 3-4% spread when converting USD to pesos. Stack the 1% cash-in fee on top and roughly 9% of the invoice is gone by the time it reaches your wallet.',
      },
      {
        q: 'Do I have to convert my dollars to pesos, or can I keep a USD account?',
        a: 'You can keep dollars. The BSP imposes no mandatory conversion on inward remittances: banks offer USD savings accounts (FCDU accounts) at BDO, BPI, Metrobank, RCBC and others, and both Wise and GCash let you hold a USD balance and convert when you choose. Banks will ask the purpose of inbound commercial transfers (a one-line answer like "payment for design services per contract" is normal) and report transactions of $10,000 or more to the BSP and the Anti-Money Laundering Council, which is routine reporting, not a restriction. Holding USD is genuinely useful if you have dollar expenses or simply do not like the current rate.',
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
    siblingCorridors: ['usd-to-ngn', 'usd-to-bdt'],
  },
];
