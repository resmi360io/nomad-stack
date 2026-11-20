# Daily plan, 20 November to 4 December 2026 (Pareto)

One most valuable action a day for the owner, and everything Claude can do that day without a human. Every action has
a success criterion, a definition of done and a measurement method. Built 2026-11-20 from Search Console (28 days to
2026-11-20) and PostHog (30 days to 2026-11-20). Longer-term items stay in `SEO_PLAN.md`; this file says what happens
each day. Tick a day when its "done" lines are true and write the result next to it.

**How Claude's daily work runs:** the rotation and the weekly audit run on their own schedules. Everything else in the
"Claude" lines happens when you open the session and say **"today"**; one message a day is enough.

## The 20% that produces 80% of the result

The baseline, 2026-11-20:

| Measure | Now | Source |
|---|---|---|
| Google impressions, 28 days | 1,252 | Search Console, via OpenRush |
| Google clicks, 28 days | 3 (CTR 0.24%) | Search Console |
| Impressions on the two Payoneer rate pages | 447 (36% of the site), 1 click | Search Console, page view |
| Visitors excluding the owner (Georgia), 30 days | 70 people, 109 pageviews; Google 27 people, Bing 3 | PostHog project 430719 |
| Calculator runs excluding the owner, 30 days | 2 | PostHog `calc_run` |
| Affiliate clicks excluding the owner, 30 days | 0 | PostHog `affiliate_click` |
| Editorial referring domains | 0 | OpenRush backlinks, monthly links read |

Three things decide almost everything else:

1. **The two Payoneer rate pages' search snippet (Claude builds, you approve).** They carry 36% of all impressions,
   for "rate today" queries at positions 7 to 13 ("payoneer usd to pkr rate today" 11 at 12.9, "today payoneer
   dollar rate in pakistan" 10 at 12.7, "payoneer dollar rate in bangladesh" 5 at 8.6), yet 1 click in 447. Every
   competitor's snippet shows a number (Pakistan SERP, 2026-11-01); ours shows none. Putting today's estimated
   per-dollar figure into the title and meta description is the cheapest route to clicks.
2. **Distribution: the Show HN post and three outreach emails (you).** Search alone cannot create editorial links,
   brand searches or calculator users at this site's size. Show HN is the one event that can bring hundreds of
   visitors and the first links in a day; the emails are the cheapest earned-link attempts.
3. **Measurement (Claude, done today).** PostHog's default project does receive paidacross.com (361 events in 30
   days); the audits saw nothing only because their host had no connector. Without this, items 1 and 2 cannot be
   judged.

Everything else (the daily fact-check rotation, the weekly audit, the weekly FAQ, video scripting) is the 80% of effort
that produces the remaining 20%. It continues, but it never displaces the three above.

## Fortnight targets (judged on Friday 4 December)

| Target | Success | Measure |
|---|---|---|
| Rate-page CTR | early signal: 3 or more clicks on the two rate pages in the 14 days after each URL's recrawl (about 220 impressions; at the old 0.2% that is about a 1% chance); 1.5% is the 8-week aim | Search Console page plus query against the 447/1 baseline, recrawl date from URL Inspection, November 2026 core update named; no decision before the rule 3 reads |
| Clicks | at least 10 Google clicks in the 28 days to 2026-12-04, from 3 | Search Console site total |
| Calculator runs, excluding the owner | at least 15 in the 14 days to 2026-12-04, from 2 in 30 days | PostHog `calc_run`, country not GE |
| Editorial referring domains | at least 1 new (stretch 2) | OpenRush `inspect_backlinks` new domains, link-farm pattern excluded; verified by opening the page |
| Outreach replies | at least 1 reply of 3 sent | the outreach log |

## Every day (Claude, automatic or on "today")

- **Rotation health.** Success: `main` moved or the host reported "nothing shippable". Done: one line in the day's
  result. Measure: `git log origin/main` and `get_session` on the rotation host (never the trigger's status).
- **Changed pages to Bing.** Success: every URL whose copy changed that day is submitted. Done: Bing returns
  "submitted". Measure: Hermoso `submit_bing_webmaster_urls` response.

## Day by day

### Fri 20 Nov
- **You (5 minutes, this evening):** say "ship" to the rate-page snippet release when Claude reports it ready.
  Success: the release is live today. Done: PR merged and the live pages show today's per-dollar figure in the
  `<title>` and meta description. Measure: Claude's live check (curl of both pages) and `RELEASES.md` row.
- **Claude:**
  1. Measurement baseline (item 31). Success: real-visitor numbers known. Done: the table above, written into
     `SEO_PLAN.md` item 31. Measure: PostHog SQL on project 430719 with `$host = 'paidacross.com'`.
  2. Rate-page snippet release: the title and meta description of both rate pages carry the estimated per-dollar
     figure, computed by `calculate()` from the same row as the page's card; verifier, reviewer, humanizer,
     SEO REVIEW. Success: SEO REVIEW SHIP or SHIP WITH CHANGES, 0 protected regressions, tests and build pass. Done: PR
     open and reported to you. Measure: `diff.mjs` exit code, `npm test`, `npm run build`, rendered `<title>`.
  3. This plan. Done: `docs/seo/DAILY_PLAN.md` on the branch.

### Sat 21 Nov
- **You (10 minutes):** read the refreshed Show HN title and first comment and reply "go" or with changes. Success: the
  text is approved before Sunday 06:00. Done: your reply. Measure: the message.
- **Claude:** refresh every number in the Show HN post against today's data and the cost index edition it links;
  run the humanizer; check the homepage and calculator load in under 2 seconds on a cold build and that `calc_run`
  fires. Success: every figure in the post matches `calculate()` or the frozen index, with its date. Done:
  `docs/seo/launch-posts.md` updated and pushed. Measure: a script printing each quoted figure next to its source.

### Sun 22 Nov
- **You (06:00 to 09:00 Tbilisi):** post Show HN at 06:00 (02:00 UTC) and answer every comment for three hours.
  Success: the post is live, every top-level comment answered within 30 minutes. Done: the HN item URL sent to
  Claude. Measure: the HN page; PostHog referrals from `news.ycombinator.com`.
- **Claude (when you say "today"):** count HN referrals, calculator runs and affiliate clicks from HN visitors;
  draft factual answers to questions about fees or method from the site's own data (you post them). Success: a
  same-day read. Done: the numbers in this file. Measure: PostHog by `$referring_domain`.

### Mon 23 Nov
- **You (05:00 to 06:00 Tbilisi):** send the worldngayon.com email (Philippines), after the three checks in its draft
  header. Success: sent to the contact form. Done: you tell Claude the date. Measure: the outreach log moves to `sent`.
- **Claude:** weekly fact-checked FAQ #7 (the week's one), on the page with the most impressions for an unanswered
  question, through researcher, verifier, reviewer, humanizer, REVIEW. Success: ready to ship. Done: PR reported.
  Measure: verifier and reviewer counts, `diff.mjs` exit 0. Also the first HN result read (48 hours).

### Tue 24 Nov
- **You (08:00 to 09:00 Tbilisi):** send the abroadmate.me email (Pakistan). Same success, done and measure as Monday.
  (If you already sent it on Thursday 19, send brands.ng today instead and tell Claude.)
- **Claude:** ship FAQ #7 on your "ship" (merge, live check, Bing); log outreach dates; first rate-page CTR read since
  the snippet change (early signal only). Success: FAQ live. Measure: `RELEASES.md`, live HTML, Search Console page
  view for the rate pages.

### Wed 25 Nov
- **You (12:00 to 13:00 Tbilisi):** send the brands.ng email (Nigeria) through https://brands.ng/contact-us/.
- **Claude:** outreach run (agent): at most 5 new drafts, each with figures from `calculate()`. Success: at least 2
  drafts that pass every gate. Done: drafts in `docs/seo/outreach/drafts/`, board and log updated. Measure: the run's
  qualify table.

### Thu 26 Nov
- **You (15 minutes):** Search Console sitting: URL Inspection, last crawl date for both rate pages and the
  `/receive/` pages that changed this week; request indexing for any page changed since its last crawl. Success:
  every changed page recrawled or requested. Done: dates written into `SEO_PLAN.md` item 21 (tell Claude). Measure:
  URL Inspection "Last crawl".
- **Claude:** calculator entry point on the rate pages: a "work out your own amount" link that opens the calculator
  prefilled with the corridor, through REVIEW. Success: ready to ship, `calc_run` fires from it in a local test.
  Measure: Playwright run with a stub PostHog capture; `diff.mjs`.

### Fri 27 Nov
- **You (5 minutes):** say "ship" to the calculator entry point; reply to any outreach answer.
- **Claude:** ship it on your word; Payoneer `lastVerified` evidence (item 32): list each corridor's Payoneer row and
  the rotation PR that re-read it; propose a date. Success: you can decide item 32 in one line. Measure: the table.

### Sat 28 Nov
- **You (10 minutes):** read the weekly numbers Claude posts and decide item 32 (bump the date or not).
- **Claude:** weekly numbers: rate-page CTR, clicks, calculator runs, HN effect, outreach replies, against the
  fortnight targets. Success: every target has a current value. Measure: Search Console and PostHog as above.

### Sun 29 Nov
- **You:** nothing required. If HN or email replies arrived, answer them.
- **Claude:** refresh the r/SideProject post's numbers for Tuesday; humanizer. Done: `docs/seo/launch-posts.md`.

### Mon 30 Nov (checkpoint)
- **You (20 minutes):** read the checkpoint report and decide what changes for December.
- **Claude:** checkpoint report (`docs/seo/reports/2026-11-30-checkpoint.md`): every quarter target against the
  2026-11-09 baseline, indexing from Performance, PostHog `calc_run`, the snippet change's effect. The core update's
  ranking read waits until 7 days after Google marks it complete. Success: each target has now, floor, stretch and a
  trend. Measure: Search Console, PostHog, OpenRush.

### Tue 1 Dec
- **You (18:00 to 21:00 Tbilisi):** post r/SideProject from your own account; answer comments. Success: live, not
  removed by moderators. Measure: the Reddit post; PostHog referrals from reddit.com.
- **Claude:** monthly links read (new referring domains against `docs/seo/disavow.txt`); outreach follow-up list
  (one follow-up, 7 to 10 days after each first email, only with something new). Measure: OpenRush backlinks.

### Wed 2 Dec
- **You (10 minutes):** send at most one follow-up from Claude's list, or the best new outreach draft.
- **Claude:** weekly FAQ #8 drafted through the pipeline. Measure: as FAQ #7.

### Thu 3 Dec
- **You (30 minutes):** review the script for the first December walk-through (Pakistan, Payoneer to a bank) and
  decide the recording day.
- **Claude:** the script, with every figure from `calculate()` and its date, the query in the title, the number in
  the first seconds, the format from `docs/seo/videos/competitor-videos-2026-11-18.md`. Done:
  `docs/seo/videos/script-pk-payoneer.md`.

### Fri 4 Dec (fortnight review)
- **You (10 minutes):** read the fortnight result and approve the next fortnight's plan.
- **Claude:** score every fortnight target (success, partial or missed, with the number), then write the plan for
  5 to 18 December in this file, again 20% first.
