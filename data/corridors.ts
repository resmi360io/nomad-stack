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
      'Pakistani freelancers have fewer options than most -- PayPal is blocked for receiving and Pakistani residents cannot open a Wise account. Payoneer is the dominant choice at roughly 3% all-in (1% fee + up to 2% FX markup on PKR withdrawal). Western Union works but the FX spread on Pakistani rupee is typically 4--5%, making it significantly more expensive on recurring payments.',
    publishedDate: '2026-06-03',
    updatedDate: '2026-06-03',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant choice for Pakistani freelancers receiving from Upwork, Fiverr, Toptal, and direct US clients. Payoneer charges 1% on incoming commercial payments (from clients, not marketplace withdrawals -- some marketplace rates differ). When you withdraw your Payoneer balance to a local PKR bank account, Payoneer applies an FX conversion at up to 2% above mid-market, giving a typical all-in cost of 2.5--3.5%. Requires identity verification (CNIC or passport). Works reliably with HBL, UBL, MCB, Meezan, and Standard Chartered Pakistan. There is a $1.50 flat fee for same-currency USD withdrawals to a USD-denominated Pakistani bank account, but this does not apply to cross-currency PKR withdrawals.',
      },
      {
        slug: 'western-union',
        name: 'Western Union',
        available: true,
        notes:
          'Available for bank deposit to major Pakistani banks. Western Union quotes a send fee of approximately $5 for online USD bank-deposit transfers to Pakistan, but the bigger cost is the FX spread -- PKR is classified as a minor corridor and Western Union\'s quoted exchange rate is typically 4--5% below the mid-market rate. On a $1,000 transfer at a 4.5% FX spread plus $5 flat fee, you effectively lose around $50--55. This is more than double the Payoneer cost. Western Union is useful if your client insists on it, but it is not the cheapest option for recurring payments.',
      },
      {
        slug: 'bank-wire',
        name: 'Bank Wire (SWIFT)',
        available: true,
        notes:
          'SWIFT wires reach all major Pakistani banks (HBL, UBL, MCB, Allied Bank, Bank Alfalah). The problem is the flat fee: most US banks charge $25--45 to send an outgoing international wire, and some Pakistani banks charge a separate incoming SWIFT fee of $5--15. On a $1,000 transfer, the combined flat fees alone represent 3--6% of the amount. The bank\'s FX spread on converting USD to PKR adds another 2--4%. Bank wires make sense for large one-time payments over $5,000 where the flat fee becomes a smaller percentage, but they are impractical for regular freelance invoices.',
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
          'PayPal does not support receiving commercial payments in Pakistan. While Pakistani users can create a PayPal account, incoming international payments from clients are blocked or indefinitely held. This restriction has been in place since 2013 and has not been lifted. Do not list a PayPal address as a payment method for your international clients -- you will not receive the money.',
      },
      {
        slug: 'grabrfi',
        name: 'GrabrFi',
        available: false,
        notes:
          'GrabrFi currently supports withdrawals to Georgia, Mexico, Thailand, and Indonesia only. Pakistan is not a supported destination.',
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
        a: 'No. PayPal does not support receiving commercial payments in Pakistan. Incoming payments from international clients are blocked or held indefinitely. This has been the case since 2013 when PayPal restricted Pakistani accounts following compliance issues. As of 2026, PayPal has not restored receiving functionality for Pakistan. If a client sends you money via PayPal, do not expect to be able to withdraw it. Use Payoneer or bank wire instead.',
      },
      {
        q: 'What is the cheapest way to receive USD in Pakistan?',
        a: 'For Pakistani residents, Payoneer is the cheapest widely-available option at roughly 2.5--3.5% all-in (1% receiving fee plus up to 2% FX markup on PKR withdrawal). The even cheaper approach -- if your client is cooperative -- is to ask them to send via Wise directly to your Pakistani bank account. In that scenario, the recipient cost is zero and the client pays roughly 0.5--1.5% on their end. This does not work on platforms like Upwork or Fiverr that have their own payment processing, but it works for direct clients who invoice you.',
      },
      {
        q: 'How long does it take to receive international payments in Pakistan?',
        a: 'Payoneer to a local PKR bank account: typically 2--5 business days after the payment clears on the sender\'s side. Payoneer balance to balance is near-instant. Western Union bank deposit: 1--3 business days. SWIFT wire from a US bank to a Pakistani bank: 3--7 business days, sometimes longer if intermediate correspondent banks add delays. The Pakistan banking system adds no unusual delays compared to other developing-country corridors.',
      },
      {
        q: 'Do I need to declare international freelance income to FBR?',
        a: 'Yes. Income received from foreign clients is taxable in Pakistan and must be declared to the Federal Board of Revenue (FBR). As of the 2024--25 fiscal year, IT and IT-enabled services export income has a reduced tax rate, and there is a withholding tax exemption certificate process for registered exporters. Rules change with each annual budget. Consult a Pakistani tax professional -- this site covers fees, not tax, and the regulatory landscape changes too frequently to summarize reliably.',
      },
      {
        q: 'Which Pakistani banks work best with Payoneer?',
        a: 'HBL, UBL, MCB, Meezan Bank, and Bank Alfalah are the most commonly reported to work without issues. Standard Chartered Pakistan and Faysal Bank also work. The main requirement is that the account is in your legal name exactly as it appears in your Payoneer verification documents (CNIC or passport). Joint accounts or accounts with name mismatches can cause delays or rejections. Most users on freelance forums report the fastest processing with HBL and UBL.',
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
    updatedDate: '2026-06-18',
    providers: [
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'The dominant route for Bangladeshi freelancers on Upwork, Fiverr, and direct invoicing. Payoneer charges 1% on incoming commercial payments. When you withdraw to a local BDT bank account, Payoneer applies an FX conversion at roughly 1.2%-4% (the official fee schedule, updated January 2026, states this range; roughly 2% is a representative midpoint). Same-currency USD-to-USD withdrawal is a flat $1.50 instead. You can also withdraw directly to a bKash wallet via Payoneer\'s bKash integration; Payoneer charges a separate conversion fee for this route (approximately 3% plus $1 per transaction as of mid-2026; verify in the Payoneer portal, as this differs from the standard bank withdrawal fee). On the bKash side, cash-out charges apply when withdrawing cash via an agent; rates have changed significantly from historical figures, so check the bKash charge calculator for the current rate before assuming any specific number. The bKash route is fast but does not generate a Foreign Inward Remittance Certificate (FIRC), which is required to claim the export cash incentive and fund an ERQ foreign-currency account. Annual account fee: $29.95/year, charged only if the account receives less than $6,000 in any 12 consecutive months (most active freelancers pay nothing). Typical all-in cost for bank account withdrawal: 3-5%.',
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
          'PayPal commercial receiving is not available in Bangladesh. Only Xoom (a PayPal subsidiary) operates in Bangladesh, and Xoom explicitly states it supports person-to-person inbound remittance only — it does not support transactions for goods or business purposes. A freelancer cannot receive client project payments into a PayPal account in Bangladesh. Note: the Payoneer-PayPal workaround (receiving PayPal payments via Payoneer) is explicitly blocked for Bangladesh-registered Payoneer accounts — do not rely on it. There have been repeated government statements about a full PayPal launch in Bangladesh, but no commercial launch has occurred as of mid-2026. Treat PayPal as unavailable and plan billing around Payoneer and bank wire.',
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
          'GrabrFi currently supports withdrawals to Georgia, Mexico, Thailand, and Indonesia only. Bangladesh is not a supported destination.',
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
        a: 'No. The widely-known 2.5% government cash incentive is the Wage-Earner Remittance scheme for overseas Bangladeshis sending personal remittances home — it does not apply to freelance or IT earnings. Freelancers fall under a separate export cash incentive: as of FY2025-26 (valid to 30 June 2026), the rate is 2.5% for individual freelancers and 6% for registered software/ITES firms, per Bangladesh Bank circular. This incentive is only claimable via proper banking channels with a FIRC — Payoneer-to-bKash withdrawals do not qualify. Importantly, these incentives are being phased out around Bangladesh\'s LDC graduation (scheduled November 2026) to comply with WTO rules. Verify the current rate and eligibility before relying on it.',
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
      'Nigerian freelancers now have strong specialist options: Cleva, Grey, LemFi, and Raenest all issue virtual US bank accounts that convert at near mid-market rates, typically 0-1.8% all-in. Payoneer works but costs roughly 3% all-in and carries a $2,000/year minimum activity threshold. PayPal returned to Nigeria in January 2026 via a Paga partnership, but stacked fees make it roughly 6-7% all-in and the most expensive widely-available option.',
    publishedDate: '2026-06-14',
    updatedDate: '2026-06-17',
    providers: [
      {
        slug: 'lemfi',
        name: 'LemFi',
        available: true,
        notes:
          'LemFi (formerly Lemonade Finance) issues a virtual US bank account that Nigerian freelancers can share with clients as standard ACH receiving details. Fee structure: no flat fee, no percentage fee, and LemFi applies the true mid-market exchange rate with no markup, making it the theoretically cheapest option for any transfer size. Typical settlement: 1-2 business days. LemFi is FCA-licensed in the UK, holds a FINTRAC Money Business Operator licence in Canada, and operates under CBN approval in Nigeria. As it is a smaller operator than Cleva or Grey, verify current withdrawal limits before relying on it for large amounts.',
      },
      {
        slug: 'raenest',
        name: 'Raenest',
        available: true,
        notes:
          'Raenest (also marketed as GeegPay) issues virtual USD and GBP accounts for African freelancers and remote workers. US ACH receiving details are provided via Regent Bank (Member FDIC) and are accepted by Upwork, Fiverr, and direct clients. Fee model: 1 free ACH deposit and 1 free stablecoin deposit per month; additional deposits cost $1 flat each. Beyond the deposit fee, Raenest applies a 0.5% FX markup above mid-market on the USD-to-NGN conversion. On a $1,000 transfer within the free monthly allowance, the cost is approximately $5 (0.5% effective). No annual account fee. Typical settlement: 24 hours. CBN-licensed; also supports GBP receiving for UK clients.',
      },
      {
        slug: 'cleva',
        name: 'Cleva',
        available: true,
        notes:
          'Cleva is a Nigeria-specific fintech that issues a virtual US bank account (routing number and account number) so clients can send a domestic ACH or wire as if paying a US-based contractor. Fee: $3 flat per USD-to-NGN withdrawal, no percentage fee, and Cleva applies the true mid-market rate. On a $1,000 transfer the cost is $3, or 0.3%. On a $300 transfer it becomes 1.0%, so Cleva is better suited to transfers of $500 or more. Typical settlement: within 24 hours of the ACH credit clearing (ACH from client takes 1-2 business days). No annual account fee. CBN-regulated.',
      },
      {
        slug: 'grey',
        name: 'Grey',
        available: true,
        notes:
          'Grey issues virtual USD (and optionally GBP and EUR) accounts for Nigerian freelancers. Clients send a regular ACH or wire; Grey charges a 1% conversion fee capped at $6 per transaction, plus approximately 1% FX markup above mid-market. On a $1,000 transfer the combined cost is approximately $16 ($6 capped conversion fee + $10 FX), or 1.6% effective. On a $5,000 transfer the cost is approximately $56 ($6 cap + $50 FX), or 1.1%. Grey also offers a Visa debit card for a one-time $5 fee. Grey is CBN-regulated (licence 10151) and supports multiple currencies, making it a good option if you also receive GBP or EUR from European clients.',
      },
      {
        slug: 'payoneer',
        name: 'Payoneer',
        available: true,
        notes:
          'Payoneer works in Nigeria and is a common choice for freelancers on Upwork, Fiverr, and Toptal where Payoneer is the default platform payout method. Payoneer charges 1% on incoming commercial payments. When you withdraw to a Nigerian NGN bank account, Payoneer applies an FX conversion at up to 2% above mid-market, giving a typical all-in cost of 2.5-3.5%. Works with GTBank, Access Bank, Zenith Bank, First Bank, and UBA. Important: Payoneer charges an annual account fee of $29.95/year if the account receives less than $2,000 in any 12 consecutive months. Low-volume freelancers should track their activity level. If you are billing direct clients rather than using a platform, Cleva, LemFi, or Raenest will save you money.',
      },
      {
        slug: 'paypal',
        name: 'PayPal (via Paga)',
        available: true,
        notes:
          'PayPal re-enabled NGN payouts in Nigeria in January 2026 via a partnership with Paga, a CBN-licensed payment company. Nigerian PayPal users can now withdraw their USD PayPal balance to a naira bank account via Paga. The combined fee is approximately 2.9% + $0.30 on the PayPal receiving side, plus roughly 3.5% FX markup on the USD-to-NGN conversion, giving an all-in cost of roughly 6-7% on a $1,000 transfer. That is the most expensive widely-available option. The main use case is if a client specifically insists on PayPal and you have no alternative. Payouts are naira-only. The Paga integration is recent (January 2026) and processing times can vary.',
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
          'Nigerian residents cannot open a Wise account or obtain Wise receiving details. Wise does not support Nigeria as a destination country for account holders as of mid-2026. A foreign client can technically use Wise to send a wire directly to a Nigerian bank account by entering the account details manually, but this is not available on Upwork or Fiverr and requires client cooperation each time. Wise has not announced a Nigerian launch date.',
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
          'GrabrFi currently supports withdrawals to Georgia, Mexico, Thailand, and Indonesia only. Nigeria is not a supported destination.',
      },
    ],
    supportedProviders: ['lemfi', 'raenest', 'cleva', 'grey', 'payoneer', 'paypal', 'bank-wire'],
    faqs: [
      {
        q: 'What is the cheapest way to receive USD in Nigeria?',
        a: 'LemFi is theoretically the cheapest at zero fees and true mid-market FX, but it is a smaller operator, so verify withdrawal limits before relying on it for large amounts. Cleva ($3 flat, mid-market FX) and Raenest (1 free deposit/month, then $1 flat plus 0.5% FX) are competitive and widely used. Grey (1% fee capped at $6, plus 1% FX) is slightly more expensive but well-established and supports GBP and EUR too. For recurring small invoices under $500, Raenest ($1 flat on paid deposits) is cheaper than Cleva ($3 flat). Payoneer (1% + up to 2% FX) and PayPal via Paga (roughly 6-7% all-in) are significantly more expensive and should be reserved for situations where you have no other option.',
      },
      {
        q: 'Does Wise work for Nigerian freelancers?',
        a: 'Not directly. Nigerian residents cannot open a Wise account, so you cannot share Wise receiving details with clients. A foreign client can use Wise to push NGN to your Nigerian bank account manually, but this requires them to enter your bank details each time and is not available on freelance platforms like Upwork or Fiverr. In practice, use Cleva, Grey, LemFi, or Raenest instead: they all issue virtual US account numbers you can give clients as standard US bank receiving details.',
      },
      {
        q: 'What is the IMTO naira-only rule and does it affect me?',
        a: 'The CBN issued a circular on March 24, 2026 (effective May 1, 2026) requiring licensed International Money Transfer Operators (IMTOs) to pay all incoming remittances in naira only. This applies to Western Union, MoneyGram, and similar licensed IMTO operators. It does not apply to SWIFT bank-to-bank transfers: your Nigerian bank can still receive a USD SWIFT wire and convert it at the official NAFEM window rate. It also does not affect Cleva, Grey, LemFi, or Raenest, which operate as payment processors rather than licensed IMTOs. Your practical workflow is unaffected.',
      },
      {
        q: 'How long does it take to receive USD in Nigeria?',
        a: 'Cleva: typically within 24 hours once the US ACH credit clears (the ACH from your client takes 1-2 business days on their side). Grey: typically 24 hours. LemFi: 1-2 business days. Raenest: typically 24 hours. Payoneer to local NGN bank: typically 2-4 business days after the payment clears. SWIFT bank wire: 2-5 business days. PayPal via Paga: timing can vary given the integration is relatively new.',
      },
      {
        q: 'Is Payoneer still worth using for Nigerian freelancers?',
        a: 'Payoneer\'s main advantage is platform compatibility: if you work on Upwork or Fiverr, Payoneer is often the default and cheapest withdrawal method from the platform balance. If you are billing direct clients, Cleva, LemFi, or Raenest give better rates. Watch the annual fee threshold: if your Payoneer account receives less than $2,000 in any 12-month period, you are charged $29.95 in annual fees. For low-volume freelancers with direct clients, a fee-free option like LemFi or Cleva is clearly better.',
      },
      {
        q: 'Do I have to pay tax on freelance income in Nigeria?',
        a: 'Yes. Foreign-sourced income received in Nigeria is taxable under the Personal Income Tax Act (PITA) for individuals and the Companies Income Tax Act (CITA) for registered businesses. Freelancers assessed as individuals face progressive tax rates from 7% to 24%. Nigeria does not have a blanket income tax exemption for IT freelancers comparable to some other countries. Filing is required. Tax rules change with annual Finance Acts. Consult a Nigerian tax professional: this site covers transfer fees, not tax advice.',
      },
    ],
    siblingCorridors: ['usd-to-pkr', 'usd-to-bdt'],
  },
];
