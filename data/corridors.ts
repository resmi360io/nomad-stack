// Central corridor registry — every corridor page lives here.
// The sitemap, pillar page, and corridor page templates all import from this file.

export interface CorridorProviderEntry {
  slug: string;
  name: string;
  available: boolean;
  notes: string;
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
    siblingCorridors: [],
  },
];
