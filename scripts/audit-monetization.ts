import { CORRIDORS } from '@/data/corridors';
import { PROVIDERS } from '@/data/providers';
import type { Currency } from '@/data/providers';
import { calculate, getDestCurrencies } from '@/lib/calculate';

const mid: Record<Currency, number> = { USD:1,EUR:0.861,GBP:0.746,GEL:2.705,MXN:18.34,THB:32.4,
  IDR:16620,PKR:281.2,BDT:121.5,NGN:1452,PHP:58.1,BRL:5.38,INR:88.4,COP:3890,UZS:12190,
  ZAR:17.28,ARS:1540,PLN:3.64,UAH:45.05 };

const paying = new Set(PROVIDERS.filter(p => p.affiliateLink && p.affiliateLink.trim()).map(p => p.slug));
console.log('Providers with a live affiliate link:', [...paying].join(', ') || 'NONE');
console.log('Providers with an EMPTY affiliate link:', PROVIDERS.filter(p=>!p.affiliateLink||!p.affiliateLink.trim()).map(p=>p.slug).join(', '));
console.log();
console.log('slug'.padEnd(22), 'local tab: paying provider?'.padEnd(34), 'rank', ' listed-but-mute');

let monet = 0, dead = 0;
const deadList: string[] = [], weak: string[] = [];
for (const c of CORRIDORS) {
  const currencies = getDestCurrencies(c.destCountry, PROVIDERS);
  const local = currencies[0] as Currency;
  const qs = calculate(c.sourceCountry, c.destCountry, local, 1000, PROVIDERS, mid);
  const payRows = qs.filter(q => paying.has(q.provider.slug));
  const rank = payRows.length ? (qs.findIndex(q => paying.has(q.provider.slug)) + 1) + '/' + qs.length : '-';
  // listed in supportedProviders but produces no quote in ANY offered currency
  const quoting = new Set<string>();
  for (const cur of currencies)
    for (const q of calculate(c.sourceCountry, c.destCountry, cur as Currency, 1000, PROVIDERS, mid)) quoting.add(q.provider.slug);
  const mute = c.supportedProviders.filter(s => paying.has(s) && !quoting.has(s));
  const label = payRows.length ? payRows.map(q=>q.provider.slug).join('+') : 'NONE — no monetizable CTA';
  console.log(c.slug.padEnd(22), label.padEnd(34), String(rank).padEnd(4), mute.join(',') || '');
  if (payRows.length) { monet++; if (payRows.length && (qs.findIndex(q=>paying.has(q.provider.slug))+1) > 2) weak.push(c.slug); }
  else { dead++; deadList.push(c.slug); }
}
console.log();
console.log('MONETIZABLE on the local tab:', monet, 'of', CORRIDORS.length);
console.log('NO paying provider quotes at all:', dead, '->', deadList.join(', '));
console.log('Paying provider ranks 3rd or worse (weak click odds):', weak.join(', ') || 'none');
