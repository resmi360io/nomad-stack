// Compares two snapshots from scripts/seo/snapshot.mjs and reports, per page, what changed in the
// things search engines read. This is the SEO regression gate: run it on every change that touches
// routes, metadata, headings, copy, links or structured data, before shipping.
//
//   node scripts/seo/diff.mjs <before/seo.json> <after/seo.json> [--json]
//
// Exit code 1 when a PROTECTED item regressed: a route disappeared or changed status, a canonical or
// robots directive changed, or a heading, link or anchor id was removed. Everything else (titles,
// descriptions, added text, moved text) is reported for a human or the seo-analyst agent to judge,
// and does not fail the gate on its own. Numbers are masked in text comparison because live rates
// change hourly.
import fs from 'node:fs';

const [beforePath, afterPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const asJson = process.argv.includes('--json');
if (!beforePath || !afterPath) {
  console.error('usage: node scripts/seo/diff.mjs <before/seo.json> <after/seo.json> [--json]');
  process.exit(2);
}
const b = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
const a = JSON.parse(fs.readFileSync(afterPath, 'utf8'));

const maskNumbers = (t) => t.replace(/\d[\d,.]*/g, '#');
const stripLastmod = (x) => x.replace(/<lastmod>[^<]*<\/lastmod>/g, '');
const beforeDir = beforePath.replace(/seo\.json$/, '');
const afterDir = afterPath.replace(/seo\.json$/, '');
const readIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

function flatten(o, pre = '', out = {}) {
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) flatten(v, Array.isArray(o) ? `${pre}[${k}]` : `${pre}.${k}`, out);
  } else out[pre] = o;
  return out;
}

// Word-level LCS diff, enough to tell removed text from moved text on pages of a few thousand words.
function removedPassages(beforeText, afterText) {
  const x = beforeText.split(' ');
  const y = afterText.split(' ');
  const n = x.length;
  const m = y.length;
  if (n * m > 60_000_000) return [{ text: '(page too long for word diff; compare by hand)', moved: false }];
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const removed = [];
  let i = 0, j = 0, run = [];
  const flush = () => { if (run.length) { removed.push(run.join(' ')); run = []; } };
  while (i < n && j < m) {
    if (x[i] === y[j]) { flush(); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { run.push(x[i]); i++; } else { flush(); j++; }
  }
  while (i < n) run.push(x[i++]);
  flush();
  return removed.map((t) => ({ text: t, moved: t.split(' ').length >= 6 && afterText.includes(t) }));
}

const report = { protectedRegressions: [], site: {}, pages: {} };
report.site.routesIdentical = JSON.stringify(b.paths) === JSON.stringify(a.paths);
if (!report.site.routesIdentical) {
  const gone = b.paths.filter((p) => !a.paths.includes(p));
  const added = a.paths.filter((p) => !b.paths.includes(p));
  report.site.routesRemoved = gone;
  report.site.routesAdded = added;
  if (gone.length) report.protectedRegressions.push(`routes removed from sitemap: ${gone.join(', ')}`);
}
// Compare the probe URLs both snapshots checked (404 handling, social images).
const changedStatuses = Object.keys(b.statuses).filter((k) => k in a.statuses && b.statuses[k] !== a.statuses[k]);
report.site.statusesIdentical = changedStatuses.length === 0;
for (const k of changedStatuses) report.protectedRegressions.push(`${k}: status ${b.statuses[k]} -> ${a.statuses[k]}`);
const rb = readIf(`${beforeDir}robots.txt`), ra = readIf(`${afterDir}robots.txt`);
report.site.robotsIdentical = rb === ra;
if (rb !== null && ra !== null && rb !== ra) report.protectedRegressions.push('robots.txt changed');
const sb = readIf(`${beforeDir}sitemap.xml`), sa = readIf(`${afterDir}sitemap.xml`);
report.site.sitemapIdentical = sb && sa ? stripLastmod(sb) === stripLastmod(sa) : null;

for (const p of b.paths) {
  const x = b.pages[p];
  const y = a.pages[p];
  if (!y) continue;
  const d = {};
  if (x.status !== y.status) { d.status = [x.status, y.status]; report.protectedRegressions.push(`${p}: status ${x.status} -> ${y.status}`); }
  if (x.canonical !== y.canonical) { d.canonical = [x.canonical, y.canonical]; report.protectedRegressions.push(`${p}: canonical changed`); }
  if (x.robots !== y.robots) { d.robots = [x.robots, y.robots]; report.protectedRegressions.push(`${p}: robots meta changed`); }
  for (const k of ['title', 'description', 'breadcrumb']) if (x[k] !== y[k]) d[k] = [x[k], y[k]];
  for (const k of ['og', 'twitter', 'imgs', 'tables']) if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) d[k] = [x[k], y[k]];
  if (JSON.stringify(x.jsonld) !== JSON.stringify(y.jsonld)) {
    const fb = flatten(x.jsonld), fa = flatten(y.jsonld);
    d.jsonld = {
      changed: Object.keys(fb).filter((k) => k in fa && fb[k] !== fa[k]).map((k) => [k, String(fb[k]).slice(0, 120), String(fa[k]).slice(0, 120)]),
      removed: Object.keys(fb).filter((k) => !(k in fa)),
      added: Object.keys(fa).filter((k) => !(k in fb)),
    };
  }
  const hRemoved = x.headings.filter((h) => !y.headings.includes(h));
  const hAdded = y.headings.filter((h) => !x.headings.includes(h));
  if (hRemoved.length) { d.headingsRemoved = hRemoved; report.protectedRegressions.push(`${p}: headings removed: ${hRemoved.join(' | ')}`); }
  if (hAdded.length) d.headingsAdded = hAdded;
  const key = (l) => `${l.href}\u0000${l.text}\u0000${l.rel}`;
  const lb = new Set(x.links.map(key)), la = new Set(y.links.map(key));
  const lRemoved = [...lb].filter((k) => !la.has(k)).map((k) => k.split('\u0000').slice(0, 2).join(' :: '));
  const lAdded = [...la].filter((k) => !lb.has(k)).map((k) => k.split('\u0000').slice(0, 2).join(' :: '));
  if (lRemoved.length) { d.linksRemoved = lRemoved; report.protectedRegressions.push(`${p}: links removed: ${lRemoved.slice(0, 5).join(' | ')}`); }
  if (lAdded.length) d.linksAdded = lAdded;
  const ib = new Set(x.ids ?? []), ia = new Set(y.ids ?? []);
  const idRemoved = [...ib].filter((i) => !ia.has(i));
  if (idRemoved.length) { d.idsRemoved = idRemoved; report.protectedRegressions.push(`${p}: anchor ids removed: ${idRemoved.join(', ')}`); }
  const idAdded = [...ia].filter((i) => !ib.has(i));
  if (idAdded.length) d.idsAdded = idAdded;
  const tb = maskNumbers(x.mainText ?? ''), ta = maskNumbers(y.mainText ?? '');
  if (x.mainText === undefined || y.mainText === undefined) {
    if (x.mainTextHash !== y.mainTextHash) d.text = { note: 'main text changed (slim snapshot: no text to diff)', wordsBefore: x.wordCount, wordsAfter: y.wordCount };
  } else if (tb !== ta) {
    const passages = removedPassages(tb, ta);
    d.text = {
      wordsBefore: x.wordCount,
      wordsAfter: y.wordCount,
      moved: passages.filter((r) => r.moved).map((r) => r.text.slice(0, 120)),
      removedOrReplaced: passages.filter((r) => !r.moved).map((r) => r.text.slice(0, 160)),
    };
  }
  if (Object.keys(d).length) report.pages[p] = d;
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const s = report.site;
  console.log(`routes identical: ${s.routesIdentical} | statuses identical: ${s.statusesIdentical} | robots.txt identical: ${s.robotsIdentical} | sitemap URLs identical (lastmod ignored): ${s.sitemapIdentical}`);
  const unchanged = b.paths.filter((p) => !report.pages[p]).length;
  console.log(`${unchanged} of ${b.paths.length} pages unchanged`);
  for (const [p, d] of Object.entries(report.pages)) {
    console.log(`\n${p}`);
    for (const [k, v] of Object.entries(d)) {
      if (k === 'text' && v.note) {
        console.log(`  text: ${v.note} (${v.wordsBefore} -> ${v.wordsAfter} words)`);
      } else if (k === 'text') {
        console.log(`  text: ${v.wordsBefore} -> ${v.wordsAfter} words; moved ${v.moved.length}; removed or replaced ${v.removedOrReplaced.length}`);
        for (const r of v.removedOrReplaced.slice(0, 8)) console.log(`    - ${r}`);
      } else console.log(`  ${k}: ${JSON.stringify(v).slice(0, 400)}`);
    }
  }
  console.log(`\nPROTECTED REGRESSIONS: ${report.protectedRegressions.length}`);
  for (const r of report.protectedRegressions) console.log(`  ! ${r}`);
}
process.exit(report.protectedRegressions.length ? 1 : 0);
