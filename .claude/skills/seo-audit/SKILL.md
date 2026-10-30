---
name: seo-audit
description: Run the paidacross SEO agent. Use for the weekly SEO audit (crawl, technical checks, Search Console and Bing, Google update watch, action plan), for an SEO review of any planned change before it ships (anything touching routes, titles, meta descriptions, headings, copy, internal links or structured data), and when the owner sends new SEO videos or articles to add to the knowledge base. The seo-analyst agent does the judging; this skill is the procedure the orchestrating session follows to gather data, invoke it, and apply its proposals.
---

# SEO audit, review and watch

The analyst is `.claude/agents/seo-analyst.md` (read-only). Its knowledge is `docs/seo/KNOWLEDGE.md`.
The scripts are in `scripts/seo/`. You, the orchestrating session, are the only writer.

Set these once per run:

```bash
RUN=/tmp/seo-run-$(date -u +%F)        # or the session scratchpad
mkdir -p $RUN
export PW_CHROMIUM=/opt/pw-browsers/chromium   # cloud sessions only; omit locally
```

## Mode 1: weekly audit

1. **Start level with production.** `git fetch origin main` then `git checkout -B <working-branch>
   origin/main`. The working tree may hold last week's leftovers otherwise.
2. **Crawl production.** `node scripts/seo/snapshot.mjs $RUN https://paidacross.com`
3. **Technical checks.** `node scripts/seo/checks.mjs $RUN/seo.json > $RUN/checks.txt`
4. **Week over week.** `node scripts/seo/diff.mjs docs/seo/snapshots/latest.json $RUN/seo.slim.json >
   $RUN/diff-vs-previous.txt` (skip on the first run, when there is no `latest.json`).
5. **Search Console** through the OpenRush MCP (`get_search_performance`, website_id
   `aab70b77-7a4d-4d6e-9f13-85584c82a534`). Save each result as JSON in $RUN:
   - `gsc-pages.json`: group_by page, last_28_days, compare_to previous_period.
   - `gsc-queries.json`: group_by page and query, last_3_months, limit 500.
   Most queries on this site are anonymised; say so rather than over-reading the few that are not.
6. **Bing** through the Hermoso MCP `call_tool`: `bing_webmaster_query_stats` and `bing_webmaster_crawl`
   with `siteUrl: https://paidacross.com/`. Save as `bing-queries.json` and `bing-crawl.json`. Bing
   updates weekly; its long, chatbot-style queries are the best view we have of real wording.
   Use only these read tools. Never call a Hermoso tool that publishes, posts, spends or submits as part
   of an audit.
7. **Update sources.** `curl -s https://status.search.google.com/incidents.json > $RUN/google-incidents.json`,
   `curl -sL -A "Mozilla/5.0" https://blogs.bing.com/webmaster/feed/ > $RUN/bing-feed.xml` and
   `curl -sL https://developers.google.com/search/updates > $RUN/google-doc-updates.html`. The last is Google's
   documentation changelog: the end of FAQ rich results (2026-05-07) was posted there and never on the blog.
7a. **New referring domains (first audit of each month).** OpenRush `inspect_backlinks` for `paidacross.com`,
   views `referring_domains`, saved as `$RUN/backlinks.json`. Write every domain whose `first_seen` is after the
   previous report's date and that is not in `docs/seo/disavow.txt` to `$RUN/new-referring-domains.txt` (domain,
   first_seen, spam score). The analyst classifies each (link-farm pattern, editorial, unknown) and applies
   KNOWLEDGE.md measurement rule 6. Never upload a disavow file from a session; that is the owner's job.
7b. **AI referrals (first audit of each month; interactive sessions only).** PostHog is a separate MCP from
   OpenRush and Hermoso, so the scheduled host cannot run this either. HogQL, saved as `$RUN/ai-referrals.json`:
   ```sql
   SELECT properties.$referring_domain AS source, properties.$pathname AS page,
          count() AS pageviews, count(DISTINCT person_id) AS visitors
   FROM events
   WHERE event = '$pageview'
     AND properties.$host = 'paidacross.com'
     AND properties.$referring_domain IN ('chatgpt.com', 'www.perplexity.ai', 'perplexity.ai',
                                          'copilot.microsoft.com', 'gemini.google.com', 'claude.ai')
     AND timestamp >= now() - INTERVAL 28 DAY
   GROUP BY source, page
   ORDER BY pageviews DESC
   ```
   Record total `$pageview` count for the same 28 days and host as the denominator. Baseline (90 days to
   2026-10-30): 3 AI referrals (SEO_PLAN item 17). The analyst reads it under measurement rule 13.
7c. **Backlink gap (first audit of January, April, July and October; next 2027-01-04).** OpenRush
   `compare_backlink_gap` for `paidacross.com` against exiap.com, statrys.com, monito.com, skydo.com and
   xflowpay.com with `min_competitors 2`, `min_authority 100`, `max_spam 30`, saved as `$RUN/backlink-gap.json`.
   Save a slim list (domain, authority, spam, competitor count) as `docs/seo/backlink-gap-latest.txt` in the step
   10 commit and give the analyst the previous one. It reports only rows new since the last run and names at most
   six to open by hand; the list itself is never an outreach list.
8. If a connector or source is unavailable, write one line saying so into `$RUN/unavailable.txt` and
   carry on. A partial audit is better than none; the report must say what it could not see. The
   scheduled host has no MCP connectors at all (see KNOWLEDGE.md section 0), so on a scheduled run
   steps 5, 6, 7a, 7b and 7c are expected to be unavailable: check once with ToolSearch, record it, never fill
   the gap with guessed numbers. An interactive session with the connectors can add them later.
9. **Invoke `seo-analyst`** in AUDIT and WATCH modes (one call), giving it `$RUN` and today's date. It
   returns the report.
10. **Write and commit**, in one commit:
    - the report to `docs/seo/reports/YYYY-MM-DD.md`, verbatim except for removing any em or en dashes;
    - `cp $RUN/seo.slim.json docs/seo/snapshots/latest.json` (next week's baseline);
    - the analyst's proposed edits to `SEO_PLAN.md` and `docs/seo/KNOWLEDGE.md`, applied exactly, but
      ONLY edits to those two files. Anything that changes page copy, data, fees or code becomes an
      action item, never an edit here.
11. **Push and open a pull request** titled `SEO audit YYYY-MM-DD`, with the Summary and Action plan in
    the body. If no GitHub pull request tool is available (the scheduled host has none), push the
    branch and give https://github.com/resmi360io/nomad-stack/compare/main...claude/seo-audit
    instead, so the owner can open it in one click. Do NOT merge it: merging deploys, and the owner reviews the action plan. If the owner has
    set `Auto-merge reports: yes` in KNOWLEDGE.md, merge only when the PR changes nothing outside
    `docs/seo/` and `SEO_PLAN.md`.
12. **Report** in the session: the Summary, the action plan, the PR link, and anything unavailable.

## Mode 2: review a planned change (before it ships)

Required for any change that touches routes, `generateMetadata`/`metadata`, titles, meta descriptions,
headings, page copy, internal links, `app/sitemap.ts`, `app/robots.ts` or JSON-LD.

1. `node scripts/seo/snapshot.mjs $RUN/before https://paidacross.com`
2. Build the change and serve it: `npm run build && npx next start -p 3457 &`, wait for HTTP 200.
3. `node scripts/seo/snapshot.mjs $RUN/after http://localhost:3457`
4. `node scripts/seo/diff.mjs $RUN/before/seo.json $RUN/after/seo.json > $RUN/diff-change.txt`
   (exit code 1 means a protected item regressed) and
   `node scripts/seo/checks.mjs $RUN/after/seo.json > $RUN/checks.txt`.
5. `git diff origin/main...HEAD > $RUN/git-diff.patch`
6. Invoke `seo-analyst` in REVIEW mode with `$RUN`. Put its verdict and the protected-items list in the
   pull request body. HOLD means do not ship until fixed or the owner overrides in writing. The analyst
   also checks that any outbound provider link the change adds carries `rel="sponsored"` when it is an
   affiliate link (Google's link spam policy; today's links in `components/ResultsTable.tsx` and
   `app/rates/[pair]/page.tsx` do).
7. Stop the server: `fuser -k 3457/tcp`.

## Mode 3: new videos or articles from the owner

The point of KNOWLEDGE.md is that nobody re-watches anything. When the owner sends new material:

1. Transcribe videos with the existing pipeline (Supabase project `picxcvahfjmmdevbqlgf`, table
   `reels.items`, function `reels-transcribe`; insert rows with `share_id`, `kind`, `source_url`,
   `source_page`, then trigger the function from SQL with `net.http_post` and the `worker_token` from
   `reels.config`, so the token never leaves the database). The worker claims about three to six items
   per call; re-trigger for the rest. Supadata's free plan is 100 transcripts a month.
2. Give the transcripts (row ids and text) to `seo-analyst` in WATCH mode, asking it to classify each
   new tactic against the existing catalogue: already covered (add the row ids as more evidence), new
   (propose a catalogue row with a verdict), or contradicting a verdict (propose the change with
   evidence, which needs a primary source to flip). Any "Google announced" claim in a video is checked
   against https://developers.google.com/search/updates and the blog before it is classified.
3. Apply its KNOWLEDGE.md edits, add the rows to the Source index, commit, open a PR.

## Rules that always hold

- The analyst is read-only and you apply only what it proposes for `SEO_PLAN.md` and `KNOWLEDGE.md`.
- Never call a write, publish, submit or spend tool on any MCP during an audit.
- Copy, fee and data changes go through the AGENTS.md pipeline (verifier, reviewer, humanizer), and
  ranking-moving changes go to the owner.
- Do not merge to main without the owner, except the docs-only auto-merge the owner may enable.
