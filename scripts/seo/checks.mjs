// Deterministic technical SEO checks over one snapshot from scripts/seo/snapshot.mjs. The seo-analyst
// agent reads this output instead of re-deriving it, so its judgement goes into what to DO, not into
// counting characters.
//
//   node scripts/seo/checks.mjs <snapshot/seo.json> [--json]
//
// Thresholds are deliberately conservative and match docs/seo/KNOWLEDGE.md. Exit code 1 only for
// errors (broken status, missing or wrong canonical, missing H1, noindex on a sitemap URL, FAQ schema
// not visible on the page, em or en dashes in a title or description). Warnings never fail.
import fs from 'node:fs';

const path = process.argv.slice(2).find((a) => !a.startsWith('--'));
const asJson = process.argv.includes('--json');
if (!path) {
  console.error('usage: node scripts/seo/checks.mjs <snapshot/seo.json> [--json]');
  process.exit(2);
}
const snap = JSON.parse(fs.readFileSync(path, 'utf8'));
const SITE = 'https://paidacross.com';
const TITLE_MAX = 60; // Google truncates around 580px, roughly 60 characters
const DESC_MIN = 70;
const DESC_MAX = 160;
const DASH = /[–—]/;

const issues = [];
const add = (level, page, check, detail) => issues.push({ level, page, check, detail });

const titles = new Map();
const descs = new Map();
const inbound = new Map(snap.paths.map((p) => [p, 0]));

for (const p of snap.paths) {
  const f = snap.pages[p];
  if (!f) continue;
  if (f.status !== 200) add('error', p, 'status', `HTTP ${f.status}`);

  const expected = p === '/' ? SITE : SITE + p;
  if (!f.canonical) add('error', p, 'canonical', 'missing');
  else if (f.canonical.replace(/\/$/, '') !== expected.replace(/\/$/, '')) add('error', p, 'canonical', `${f.canonical} is not self-referencing`);
  if (f.robots && /noindex/i.test(f.robots)) add('error', p, 'robots', `noindex on a sitemap URL (${f.robots})`);

  const t = f.title ?? '';
  if (!t) add('error', p, 'title', 'missing');
  if (t.length > TITLE_MAX) add('warn', p, 'title length', `${t.length} chars (over ${TITLE_MAX}, likely truncated): ${t}`);
  if (DASH.test(t)) add('error', p, 'title dash', t);
  titles.set(t, [...(titles.get(t) ?? []), p]);

  const d = f.description ?? '';
  if (!d) add('error', p, 'description', 'missing');
  else if (d.length < DESC_MIN || d.length > DESC_MAX) add('warn', p, 'description length', `${d.length} chars (aim ${DESC_MIN} to ${DESC_MAX})`);
  if (DASH.test(d)) add('error', p, 'description dash', d);
  descs.set(d, [...(descs.get(d) ?? []), p]);

  const h1s = f.headings.filter((h) => h.startsWith('H1 '));
  if (h1s.length === 0) add('error', p, 'h1', 'missing');
  if (h1s.length > 1) add('warn', p, 'h1', `${h1s.length} H1s`);
  // A heading level should not jump more than one step down (H2 to H4).
  let prev = 1;
  for (const h of f.headings) {
    const lvl = Number(h[1]);
    if (lvl > prev + 1) { add('warn', p, 'heading order', `jump to ${h.slice(0, 80)}`); break; }
    prev = lvl;
  }

  if (f.mainText !== undefined && DASH.test(f.mainText)) {
    const m = f.mainText.match(/.{0,40}[–—].{0,40}/);
    add('warn', p, 'dash in copy', m ? m[0] : 'em or en dash in page text');
  }
  if (f.wordCount !== undefined && f.wordCount < 300) add('warn', p, 'thin page', `${f.wordCount} words`);

  const imgsNoAlt = (f.imgs ?? []).filter((i) => i.alt === null);
  if (imgsNoAlt.length) add('warn', p, 'img alt', `${imgsNoAlt.length} images without alt`);

  // Structured data: FAQ entries must be visible text on the page.
  for (const block of f.jsonld ?? []) {
    for (const node of block['@graph'] ?? [block]) {
      if (node['@type'] === 'FAQPage' && f.mainText !== undefined) {
        for (const q of node.mainEntity ?? []) {
          if (!f.mainText.includes(q.name) || !f.mainText.includes(q.acceptedAnswer?.text ?? '')) add('error', p, 'faq schema', `not visible on page: ${q.name.slice(0, 70)}`);
        }
      }
      if (node['@type'] === 'Article' && !node.dateModified) add('warn', p, 'article schema', 'no dateModified');
      if (node.potentialAction?.['@type'] === 'SearchAction') add('warn', p, 'searchaction', 'SearchAction present; the site has no search');
    }
  }

  for (const l of f.links ?? []) {
    const href = (l.href ?? '').replace(SITE, '').split('#')[0];
    if (inbound.has(href) && href !== p) inbound.set(href, inbound.get(href) + 1);
    if (!l.text && href.startsWith('/')) add('warn', p, 'empty anchor', `link to ${href} has no text`);
  }
}

for (const [t, ps] of titles) if (t && ps.length > 1) add('error', ps.join(', '), 'duplicate title', t);
for (const [d, ps] of descs) if (d && ps.length > 1) add('warn', ps.join(', '), 'duplicate description', d.slice(0, 80));
for (const [p, n] of inbound) if (p !== '/' && n === 0) add('warn', p, 'orphan', 'no internal links from other sitemap pages');
// Pages with very few distinct inbound pages are hard for crawlers to value.
const weak = [...inbound].filter(([p, n]) => p !== '/' && n > 0 && n < 3).map(([p, n]) => `${p} (${n})`);
if (weak.length) add('info', 'site', 'few inbound links', weak.join(', '));
for (const [k, v] of Object.entries(snap.statuses ?? {})) {
  const expectNotFound = /does-not-exist|nope/.test(k);
  if (expectNotFound && v !== 404) add('error', k, 'soft 404', `expected 404, got ${v}`);
  if (!expectNotFound && v !== 200) add('error', k, 'status', `expected 200, got ${v}`);
}

const counts = { error: 0, warn: 0, info: 0 };
for (const i of issues) counts[i.level]++;
if (asJson) console.log(JSON.stringify({ checkedAt: new Date().toISOString(), source: path, pages: snap.paths.length, counts, issues }, null, 2));
else {
  console.log(`${snap.paths.length} pages checked: ${counts.error} errors, ${counts.warn} warnings, ${counts.info} info`);
  for (const lvl of ['error', 'warn', 'info']) for (const i of issues.filter((x) => x.level === lvl)) console.log(`${lvl.toUpperCase().padEnd(5)} ${i.check.padEnd(22)} ${i.page}  ${i.detail}`);
}
process.exit(counts.error ? 1 : 0);
