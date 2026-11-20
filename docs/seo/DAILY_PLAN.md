# Daily plan, 20 November to 4 December 2026 (Pareto, owner-only actions)

Rebuilt 2026-11-20 on the owner's rule: **the owner's day holds one action that creates value and that only the
owner can do.** Approvals, decisions Claude can prepare, and routine tasks (indexing requests, data reads, Bing
submissions) are not owner actions: Claude does them, or names them in one line when only the owner's login can do
them. Longer-term items stay in `SEO_PLAN.md`.

## The 20%: what only the owner can do, and why it is most of the value

The site's numbers (2026-11-20): 1,252 Google impressions and 3 clicks in 28 days; 70 real visitors in 30 days;
2 calculator runs by real visitors; 0 affiliate clicks; 0 editorial links. The fact-checking, the pages, the
search snippets and the measurement are now built and largely automatic. What none of that can produce is people
and trust, and those come only through a real person:

| Owner-only lever | What it produces that nothing else can | Targets it moves |
|---|---|---|
| 1. Launch posts from your own accounts (Show HN, r/SideProject, Indie Hackers, Product Hunt) and answering every comment | A burst of real visitors, first brand searches, possible first links, honest feedback | visitors, calculator runs, links |
| 2. One-to-one emails from your own mailbox (drafts ready, one a day) | Editorial links from pages people already read | links (0 to 1+), referral visitors |
| 3. Answers as yourself in communities where freelancers ask (Reddit, Quora, Facebook groups) | Trust, referral visitors, and the sources AI assistants cite most for these questions (KNOWLEDGE.md tactics 53, 63) | visitors, AI citations |
| 4. Your own network: freelancers you know try it and say what is unclear | Real usage and the reasons people do not use it | calculator runs, conversion |
| 5. Your face and voice on video (December walk-throughs) | Long-form video, the most cited format in AI answers for these queries | AI citations, reach |

Everything else (corrections, FAQs, snippets, tooling, reports, outreach research and drafts) is Claude's, every day.

## Fortnight targets (scored Friday 4 December)

| Target | Success | Measure |
|---|---|---|
| Calculator runs by real visitors | at least 15 in the 14 days to 2026-12-04 (from 2 in 30 days) | PostHog `calc_run`, country not GE |
| Real visitors | at least 300 in the 14 days (from 70 in 30 days) | PostHog distinct people, country not GE |
| Editorial links | at least 1 new (stretch 2) | OpenRush backlinks, link-farm pattern excluded, page opened by Claude |
| Outreach replies | at least 1 of the emails sent | the outreach log |
| Rate-page CTR (Claude's lever) | early signal: 3 or more clicks on the two rate pages in the 14 days after each recrawl (about 220 impressions; at the old 0.2% that is about a 1% chance); 1.5% is the 8-week aim | Search Console page plus query against 447 impressions and 1 click; November 2026 core update named |

## Your one action each day

Times are Tbilisi. Each line: the action, success, done when, how it is measured.

| Day | Your action (only you can do it) | Success | Done when | Measured by |
|---|---|---|---|---|
| **Fri 20 Nov (today)** | Send the calculator to 3 to 5 freelancers you know who are paid from abroad, with one question: "What would stop you using this before your next payment?" (message text below) | 3 replies with a concrete answer | you paste the replies to Claude | replies recorded in `docs/seo/feedback.md`; PostHog `calc_run` from new people today and tomorrow |
| Sat 21 Nov | Post 2 answers as yourself in the threads Claude lists (Reddit or Quora), in your own words, linking only where a page answers the exact question | 2 answers live and not removed | you send Claude the 2 links | upvotes or replies after 48 hours; PostHog referrals from reddit.com or quora.com |
| **Sun 22 Nov** | **Show HN at 06:00** (02:00 UTC) from your account, then answer every comment for 3 hours | post live; every top-level comment answered within 30 minutes | you send Claude the HN link | HN points and comments; PostHog visitors and `calc_run` from news.ycombinator.com |
| Mon 23 Nov | Send the worldngayon.com email (Philippines) at 05:00 to 06:00 | sent via its contact form | you tell Claude "sent" | reply within 10 days; outreach log |
| Tue 24 Nov | Send the abroadmate.me email (Pakistan) at 08:00 to 09:00 | sent | "sent" | as above |
| Wed 25 Nov | Send the brands.ng email (Nigeria) at 12:00 to 13:00 via https://brands.ng/contact-us/ | sent | "sent" | as above |
| Thu 26 Nov | Post on LinkedIn to your own network: what you found pricing 17 countries (Claude's draft, your words), with the cost index link | live post | link sent to Claude | reactions and comments; PostHog referrals from linkedin.com |
| Fri 27 Nov | 2 more community answers (Facebook freelancer groups in Pakistan or Bangladesh, or Reddit), from Claude's list | 2 live | links sent | as Saturday |
| Sat 28 Nov | Reply personally to every person who answered, commented or emailed this week (HN, Reddit, email, friends) | no message left unanswered | inbox and threads at zero | replies recorded in the outreach log or `feedback.md` |
| Sun 29 Nov | Rest. Only answer anything new. | | | |
| Mon 30 Nov | Send the best new outreach draft from Claude's Wednesday run | sent | "sent" | outreach log |
| Tue 1 Dec | Post r/SideProject at 18:00 to 21:00 from your account and answer comments | live, not removed | link sent | upvotes and comments; PostHog referrals from reddit.com |
| Wed 2 Dec | One follow-up email (7 to 10 days after a first email, only where Claude found something new) or the next draft | sent | "sent" | outreach log |
| Thu 3 Dec | Record the first walk-through video (Pakistan: Payoneer to a bank, what 1,000 dollars becomes), from Claude's script, about 4 to 8 minutes | one usable take | file shared with Claude | YouTube Studio views after upload; PostHog referrals from youtube.com |
| Fri 4 Dec | Post on Indie Hackers (Claude's draft, your story), then read the fortnight score | live | link sent | comments; PostHog referrals |

## Claude, each day (no human needed)

Done every day: rotation health (`main` moved or a reported hold), changed pages submitted to Bing, and when only your
login can do something (a Google indexing request), one line telling you the URL, never as your daily action.

| Day | Claude's work | Success / done when / measured by |
|---|---|---|
| Fri 20 | Ship the rate-page snippet release (done, #106); find 6 live community threads with the facts to answer each; write the friends message | threads list in `docs/seo/community.md` with each fact sourced to a page on the site; done today |
| Sat 21 | Refresh every number in the Show HN post and first comment against today's data; humanizer | every figure matches `calculate()` or the frozen index; `docs/seo/launch-posts.md` pushed |
| Sun 22 | During and after HN: visitors, calculator runs and clicks from HN; factual answers to fee or method questions from the site's own data, on request | read in this file by Sunday evening |
| Mon 23 | Weekly fact-checked FAQ #7 through the pipeline, shipped | live; verifier and reviewer counts and SEO REVIEW in the PR |
| Tue 24 | HN 48-hour read; feedback from friends turned into fixes where the pipeline allows | read recorded; fixes shipped or listed |
| Wed 25 | Outreach run: up to 5 new drafts; LinkedIn post draft for Thursday | at least 2 drafts passing every gate; draft in `docs/seo/launch-posts.md` |
| Thu 26 | Calculator entry point on the rate pages (open the calculator prefilled), through the pipeline, shipped; item 36 if decided | `calc_run` from rate pages appears in PostHog within a week |
| Fri 27 | Payoneer `lastVerified` evidence (item 32); community thread list for Friday and the following week | table of Payoneer rows and the rotation PR that re-read each |
| Sat 28 | Weekly numbers against the fortnight targets | every target has a current value |
| Mon 30 | Checkpoint report `docs/seo/reports/2026-11-30-checkpoint.md`; walk-through script for Thursday | report and `docs/seo/videos/script-pk-payoneer.md` pushed |
| Tue 1 Dec | Monthly links read; r/SideProject numbers refreshed; follow-up list for Wednesday | new referring domains listed; post ready |
| Wed 2 | Weekly FAQ #8 shipped | as FAQ #7 |
| Thu 3 | Indie Hackers draft for Friday | draft in `docs/seo/launch-posts.md` |
| Fri 4 | Score the fortnight; write the plan for 5 to 18 December, owner-only actions first | each target marked success, partial or missed with its number |

## Results log

- 2026-11-20: rate-page snippet release live (#106): "est. 267 rupees net", "est. 121 taka net"; submitted to Bing.
