// Crawler's-eye snapshot of every URL in the sitemap, with JavaScript OFF, so it records what a
// search engine sees in the server-rendered HTML: status, title, meta description, canonical, robots,
// Open Graph and Twitter tags, JSON-LD, headings, links, anchor ids, breadcrumbs, image alts, table
// captions and the main text.
//
//   node scripts/seo/snapshot.mjs <outdir> [base]
//   node scripts/seo/snapshot.mjs /tmp/seo/live https://paidacross.com
//   node scripts/seo/snapshot.mjs /tmp/seo/local http://localhost:3457   (after npm run build && next start)
//
// Writes <outdir>/seo.json, sitemap.xml, robots.txt and html/<page>.html. Compare two snapshots with
// scripts/seo/diff.mjs. In Claude Code cloud sessions set PW_CHROMIUM=/opt/pw-browsers/chromium.
import pw from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const out = process.argv[2];
const base = (process.argv[3] ?? process.env.BASE ?? 'http://localhost:3457').replace(/\/$/, '');
if (!out) {
  console.error('usage: node scripts/seo/snapshot.mjs <outdir> [base]');
  process.exit(2);
}
fs.mkdirSync(`${out}/html`, { recursive: true });

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const robots = await (await fetch(`${base}/robots.txt`)).text();
fs.writeFileSync(`${out}/sitemap.xml`, sitemap);
fs.writeFileSync(`${out}/robots.txt`, robots);

// The sitemap always lists production URLs; fetch the same paths from whichever base we are testing.
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
// Routes that must keep their behaviour: unknown slugs 404, social images render.
const extra = ['/receive/does-not-exist', '/rates/does-not-exist', '/opengraph-image', '/twitter-image'];

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await pw.chromium.launch(executablePath ? { executablePath } : {});
const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();

const result = { base, takenAt: new Date().toISOString(), paths, statuses: {}, pages: {} };
for (const p of extra) result.statuses[p] = (await fetch(base + p, { redirect: 'manual' })).status;

for (const p of paths) {
  const res = await fetch(base + p, { redirect: 'manual' });
  const html = await res.text();
  fs.writeFileSync(`${out}/html/${p === '/' ? '_home' : p.replace(/\//g, '_')}.html`, html);
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const facts = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null;
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const main = document.querySelector('main') ?? document.querySelector('article') ?? document.body;
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      robots: meta('meta[name="robots"]'),
      og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((m) => [m.getAttribute('property'), m.getAttribute('content')])),
      twitter: Object.fromEntries([...document.querySelectorAll('meta[name^="twitter:"]')].map((m) => [m.getAttribute('name'), m.getAttribute('content')])),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
      headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName} ${norm(h.textContent)}`),
      links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: norm(a.textContent), rel: a.getAttribute('rel') })),
      ids: [...document.querySelectorAll('[id]')].map((e) => e.id).filter((i) => !/^(base-ui|_R|:r|«)/.test(i)),
      breadcrumb: norm(document.querySelector('nav[aria-label="Breadcrumb"]')?.textContent),
      imgs: [...document.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') })),
      tables: [...document.querySelectorAll('table')].map((t) => ({ caption: norm(t.caption?.textContent), rows: t.rows.length })),
      mainText: norm(main?.innerText ?? ''),
    };
  });
  facts.status = res.status;
  facts.wordCount = facts.mainText.split(' ').filter(Boolean).length;
  facts.mainTextHash = crypto.createHash('sha1').update(facts.mainText).digest('hex').slice(0, 12);
  result.pages[p] = facts;
}
await browser.close();

fs.writeFileSync(`${out}/seo.json`, JSON.stringify(result, null, 2));
// A slim copy without page text, small enough to commit as the weekly baseline (docs/seo/snapshots/).
// diff.mjs skips the text comparison when either side has no mainText.
const slim = { ...result, pages: Object.fromEntries(Object.entries(result.pages).map(([p, f]) => {
  const { mainText, ...rest } = f;
  return [p, rest];
})) };
fs.writeFileSync(`${out}/seo.slim.json`, JSON.stringify(slim, null, 1));
console.log(`${paths.length} pages from ${base} -> ${out}/seo.json`);
for (const [p, f] of Object.entries(result.pages)) {
  console.log(`${f.status} ${p}  ${f.wordCount} words, ${f.headings.length} headings, ${f.links.length} links, ${f.jsonld.length} json-ld`);
}
