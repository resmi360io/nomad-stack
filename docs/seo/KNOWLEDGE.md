# SEO knowledge base for paidacross.com

The memory of the SEO agent (`.claude/agents/seo-analyst.md`, run through `.claude/skills/seo-audit/SKILL.md`).
It holds everything learned from the video research and from running the site, so nobody has to re-watch,
re-transcribe or re-derive it. The agent reads this file first on every run and changes it only through
sourced, dated edits recorded in the Changelog at the end.

Read it with `SEO_PLAN.md` (decisions, owners, dates) and `AGENTS.md` (the fact-checking pipeline, the no-dash
rule, the pSEO gate, the rate-page rule, the one ranking rule). Where this file and the plan disagree, the plan
wins until someone updates both.

## 0. Settings and operations

| Setting | Value | Who changes it |
|---|---|---|
| Auto-merge reports | no | Owner only. When `yes`, the weekly audit may merge its own PR if it touches nothing outside `docs/seo/` and `SEO_PLAN.md`. |
| Audit cadence | weekly | Owner |
| Last checked (WATCH) | 2026-10-01 | The agent, every run, to the run date |
| Search Console property | paidacross.com (domain), OpenRush website_id `aab70b77-7a4d-4d6e-9f13-85584c82a534` | |
| Bing property | `https://paidacross.com/`, read through the Hermoso MCP `call_tool` (read tools only) | |
| Scheduled host session | to be recorded when created | Owner or an interactive session |
| Scheduled trigger | to be recorded when created | Owner or an interactive session |

### Update watchlist (WATCH mode)

Only primary sources can change a verdict. Industry coverage may raise a question, never settle it.

| Source | How to read it | What to look for |
|---|---|---|
| Google Search Status Dashboard | `https://status.search.google.com/incidents.json` (JSON, machine readable) | Core, spam, helpful-content and ranking updates: begin and end dates. A ranking read taken during a rollout is noise. |
| Google Search Central ranking updates | `https://developers.google.com/search/updates/ranking` | Named updates and what they target |
| Google Search Central blog | `https://developers.google.com/search/blog` | Policy changes (spam policies, structured data support, AI features guidance) |
| Bing Webmaster blog | `https://blogs.bing.com/webmaster/feed/` (RSS; fetch with redirects and a browser user agent) | Bing and Copilot changes, AI Performance reporting, IndexNow, sitemap guidance |
| Bing Webmaster Tools for the site | Hermoso `bing_webmaster_crawl`, `bing_webmaster_query_stats` | Crawl issues, the long chatbot-style queries |

### Site-specific thresholds (used by `scripts/seo/checks.mjs`)

- Title, including the ` | Paid Across` suffix: at most 60 characters.
- Meta description: 70 to 160 characters, answering the page's main query in one sentence.
- Every sitemap URL: HTTP 200, self-referencing canonical, no noindex, exactly one H1, no heading jumps.
- FAQPage JSON-LD only for questions visible on the page. No SearchAction (the site has no search).
- No em or en dash characters in titles, descriptions or copy.
- A sitemap page with fewer than 3 inbound internal links from other sitemap pages is flagged.

## Evidence base

Distilled from every transcribed row in Supabase `reels.items` (project `picxcvahfjmmdevbqlgf`, status `done`,
transcript not null): 119 rows, ids 1 to 132, about 211k characters, read in full on 2026-10-29. Nobody should
need to re-watch or re-transcribe these videos; the Source index at the end says what each one contains.

Read this with `SEO_PLAN.md` (what is scheduled) and `AGENTS.md` (fact-checking pipeline, no em or en dashes in
copy, pSEO gate, rate-page rules). This file records evidence and verdicts; the plan records decisions and dates.
Where this file and the plan disagree, the plan wins until someone updates both.

Context the verdicts assume (2026-10-29): paidacross.com, 17 corridor guides at `/receive/usd-to-xxx`, pillar
`/receive-international-payments`, sender page `/pay-freelancers-internationally`, two rate pages
(`/rates/payoneer-usd-to-pkr`, `/rates/payoneer-usd-to-bdt`), a calculator. About 355 Google impressions and 2
clicks in the last 28 days, average position about 45, most queries anonymised. Bing about 100 impressions in 7
weeks, many long chatbot-style queries ranking 1 to 7. 28 referring domains, 26 disavowed spam, no editorial
links. FAQPage JSON-LD already ships on corridor and rate pages.

How to read the verdicts:

- **Adopt**: do it, it is durable practice consistent with Google Search Central guidance.
- **Adopt with limits**: do it only inside the stated limits (usually the fact-checking pipeline, the pSEO gate,
  or "only where a human would read it").
- **Already done**: shipped; the row says where, so nobody redoes it.
- **Not applicable**: sound for some sites, irrelevant to a national-scope comparison site with no local
  business, no blog, no ads.
- **Rejected**: conflicts with Google spam policies, with the site's honesty positioning, or is a myth.

Scepticism notes that apply to almost every reel: most are lead magnets ("comment SEO", "comment rank") for an
agency or course; results ("rank #1 overnight", "4x traffic", "+10 positions in a week", "$40,000 of free
traffic") are single anecdotes with no control; "secret", "force Google", "guaranteed" signal hype. The useful
residue is a small set of practices Google itself recommends: find real questions, answer them first and
better, show first-hand experience and original data, link pages sensibly, get indexed, earn links from
places people read, and measure before changing again.

## 1. Tactics catalogue

Count = number of distinct row ids that make the tactic. Rows are cited by `reels.items.id`.

### A. Research and keywords

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 1 | Mine real questions (AnswerThePublic, findquestions.com, People Also Ask, Reddit, Quora, what clients ask) and answer one per week | 13 | 1, 6, 7, 10, 12, 24, 25, 30, 31, 38, 95, 118, 122 | Answering the questions people ask makes Google see you as a topical expert; one post a week is enough; 15% of Google searches are new every day so unanswered questions are easy wins | Adopt with limits | Durable and matches "people-first content". The 15% figure is Google's own. "Force Google to rank you" is hype | Already the weekly fact-checked FAQ item in SEO_PLAN. Source questions from GSC (row 95 regex), Bing query report, OpenRush `inspect_serp` PAA, Reddit threads in PK/BD/NG/PH freelancer subs. Answer on the existing corridor or rate page as an FAQ, not as a standalone blog post. Verifier, reviewer, humanizer, `updatedDate` bump. Max one per week |
| 2 | Check that the keyword has real demand and use the variant people actually type | 3 | 11, 34, 116 | Most sites rank for nothing because they guess the keyword; look it up in Semrush or Ubersuggest and use the variation with volume | Adopt | Basic and correct. Caveat: volume tools are unreliable for small non-US markets (India English receive queries about 40 a month) | Prefer GSC and Bing queries we already earn. Spot-check with OpenRush `inspect_keyword` or Semrush MCP (limited units) with the right country database (pk, bd, ng, ph, in). Do not rename existing URLs to match a variant |
| 3 | Competitor keyword gap (keywords they rank for that you do not) | 4 | 15, 20, 34, 37 | Take every keyword the competitor ranks for and add it to your site | Adopt with limits | Good input, bad instruction: "add them all" produces off-topic pages | OpenRush `compare_keyword_coverage` against Wise, Remitly, Skydo, Statrys, Xflowpay. Keep only receive-USD intent for our 17 countries and provider-rate intent with GSC evidence (AGENTS.md rate-page rule) |
| 4 | Competitor top pages by traffic as content ideas | 3 | 35, 119, 120 | Find their top pages, write a better version with your own insight | Adopt with limits | Fine as an idea source; "steal their traffic" is hype | Part of SEO_PLAN item 7. A better version here means our computed numbers and verified fees, not a rewrite |
| 5 | Compare your sitemap with a competitor's sitemap in an LLM to find missing topics | 2 | 24, 26 | Paste both sitemaps, ask for content gaps | Adopt with limits | Cheap and harmless; output is a list of candidates, not a plan | Run once against Wise and Remitly receive guides; filter through tactic 3 limits |
| 6 | Before writing, open the top 3 results and note what they cover and miss, then answer better | 8 | 19, 23, 24, 34, 38, 109, 118, 120 | Read the top three, summarise them, compare with your page, fill the gaps; "Google tells you what it wants" | Adopt | Matches how quality is judged: add what is missing, especially first-hand data | Mandatory step of the weekly FAQ (already in SEO_PLAN). Use OpenRush `inspect_serp` or Playwright for the SERP; usual gap on this topic is exact fees at a stated amount and date, which `calculate()` gives us |
| 7 | Build an outline from the top 3 pages' headings plus PAA questions | 4 | 19, 24, 34, 38 | Combine their H2s, "change them up a little", fill in | Adopt with limits | As a coverage checklist only. Copying heading structure produces commodity content, the opposite of Google's non-commodity guidance (row 73) | Use the heading list to check nothing a reader expects is missing; write our own structure |
| 8 | Mine competitor reviews for questions, pain points, objections | 1 | 59 | Copy a competitor's Google reviews into Claude, extract questions, turn them into FAQs | Adopt | Real user language and real complaints | SEO_PLAN item 11: Trustpilot reviews of Payoneer and Wise from PK, BD, NG, PH users. Every resulting FAQ still goes through the pipeline |
| 9 | Free Google Autocomplete endpoint as a keyword list | 1 | 89 | A "secret link" returns Google suggestions; paste into an LLM to sort by relevance | Adopt with limits | Unofficial endpoint (`suggestqueries.google.com`), fine for occasional manual idea generation, not for scraping at scale | Use with `hl`/`gl` for PK, BD, NG, PH to see local phrasing ("payoneer dollar rate today") |
| 10 | GSC custom regex to show only question queries | 1 | 95 | Filter queries with a question-word regex, sort by impressions, make the ranking page answer it directly | Adopt | Correct GSC feature | Regex: `^(who\|what\|why\|how\|when\|where\|which\|can\|is\|are\|does\|do\|should)\b`. Over 3 to 6 months, since most of our queries are anonymised |
| 11 | GSC regex for queries of 7 or more words as a proxy for AI-style prompts | 1 | 108 | Long queries read like AI prompts and Google already finds you relevant; answer them | Adopt | Sensible proxy, matches our Bing finding | Regex: `^(\S+\s+){6,}\S+$`. Pair with Bing's long chatbot-style queries. Answer on the page that already ranks |
| 12 | Judge whether a query is under-targeted from the SERP: how well pages are optimised and how authoritative the ranking sites are | 1 | 116 | Expensive-CPC terms are often under-optimised in organic; weak page scores plus low domain authority means winnable | Adopt with limits | Reasonable heuristic; DA is a third-party metric, not a Google one | OpenRush `inspect_serp` and `inspect_keyword` before choosing the next rate page or FAQ target |
| 13 | Map the intent or "moment" behind a query (know, go, do, buy; pain, budget, doubt) | 1 | 31 | Same keyword, different moment, different content; AI rewards content matched to the situation | Already done | The pillar was split by intent (receive vs sender) in PR #62 | When adding an FAQ, state which moment it serves (comparison, doubt "is Payoneer worth it", how-to "withdraw to JazzCash") |
| 14 | Use the sources an AI Overview cites as research for a better page | 1 | 111 | Search "how much does X cost in city", open the AI answer's sources, write a deeper page with price ranges and what drives them | Adopt | Shows what Google currently considers good enough | For "cost to receive USD in {country}" and "payoneer rate today", check the cited sources with OpenRush `discover_ai_citations`, then add what they lack (dated fees at fixed amounts) |
| 15 | Target high-volume "calculator" queries | 1 | 28 | Calculator terms get millions of searches; build a calculator site and add AdSense | Adopt with limits | The calculator half is our product; the AdSense half conflicts with an affiliate-disclosed comparison site | Check GSC and Semrush for "{provider} fee calculator", "usd to pkr payoneer calculator" before any new page; follow the rate-page GSC-evidence rule |
| 16 | Analyse a competitor channel's titles and views to pick video topics and titles | 2 | 53, 115 | Feed every title with views to Claude, research evergreen topics, generate title variants | Adopt with limits | Only for the December videos; "rebuild viral videos" (115) is Rejected (tactic 61) | Before scripting corridor videos, list the top Payoneer/Wise receive videos for PK, BD, NG, PH and their titles |

### B. On-page and content

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 17 | Answer the question in the first sentence (TL;DR, key takeaways at the top) | 3 | 2, 24, 31 | AI and readers skip pages that bury the answer; lead with it | Already done | Pillar intro (PR #64) and the seven page-1 corridors (PR #72) | Keep for every new FAQ answer: first sentence answers, with a number and a date where one exists |
| 18 | Put the exact query in title, meta description, URL, H1 and first sentence, and nowhere else forced | 3 | 24, 116, 122 | Those five places are enough; more is mild keyword stuffing. Title under 60 characters with the keyword first, meta under 156. Counterclaim in 118: keyword in URL, word count and heading order barely matter | Already done | Titles and H1s match; first sentences fixed in PR #72 | Never change existing URLs for this (redirect risk, no gain). Length limits are display guidance, not ranking rules |
| 19 | Rewrite titles on pages with impressions and no clicks to mirror the top query, tighten the meta to a one-sentence answer, then request indexing | 3 | 24, 121, 126 | "4x traffic in a month" (121), "+10 positions in a week" (126) | Already done | Shipped for seven page-1 corridors in PR #72 | Judge at the checkpoint with the thresholds in section 4, not before. One rewrite per page per cycle |
| 20 | Write question headings in the exact words people use | 2 | 31, 38 | Matching the prompt word for word makes you the answer | Adopt with limits | Good for FAQ headings; do not turn every H2 into a question | Use the wording from GSC/Bing queries for FAQ questions only |
| 21 | FAQ sections built from real questions on main pages | 5 | 21, 24, 31, 38, 59 | Top 10 ATP questions as FAQs moves AI citation more than months of technical SEO | Already done | FAQs exist on corridors and rate pages with FAQPage JSON-LD | Grow by one fact-checked FAQ a week. Note: Google has shown FAQ rich results only for authoritative government and health sites since August 2023, so the markup will not add SERP features here |
| 22 | Striking distance: GSC queries at positions 11 to 20 with the most impressions; compare with the #1 page and add what is missing (original data, stories, FAQs) | 2 | 21, 74 | Page 1 gets over 96% of clicks; page 2 queries are the easiest wins | Adopt with limits | Durable practice; the 96% figure is unverified but directionally right | Candidates now: Pakistan corridor (21.4), pillar queries around 45. Use the page plus query view. With our volume, pool 90 days |
| 23 | Capture first-hand experience: have an LLM interview you, or record a voice memo or video, and build the page from the transcript | 7 | 12, 24, 25, 92, 109, 111, 122 | AI output is generic; your stories, opinions and data are what rank and what nobody can copy | Adopt | Directly serves E-E-A-T "experience" | SEO_PLAN item 6: owner voice memos, transcribed through the same Supadata pipeline, turned into a short "from experience" paragraph per corridor group, owner approves every line |
| 24 | Use AI to draft, then edit and fact-check by hand | 9 | 6, 10, 12, 19, 38, 92, 112, 122, 128 | Google is fine with AI content if it helps people; "99% written by AI" ranks; you must fact-check because models hallucinate (92 quotes Google) | Adopt with limits | Google's AI-content guidance allows it; scaled AI content is spam (tactic 69) | Only through the AGENTS.md pipeline: verifier, reviewer, humanizer, owner for ranking-moving changes. No unreviewed AI text reaches a page |
| 25 | Original data, case studies, unique point of view | 4 | 21, 24, 73, 112 | Rated 10/10, "best thing you can do for AI and SEO" | Adopt | Matches Google's "non-commodity content" guidance and is our only moat | December data asset "What freelancers lose getting paid in 17 countries", built from `calculate()` and the frozen-rate fixture so every number reproduces |
| 26 | A cost page with ranges, what drives the cost, and a calculator | 1 | 111 | "How much does X cost" pages get cited by AI; add a calculator to capture leads | Already done | This is the site | Keep each meta description answering the cost question with a number at a stated amount |
| 27 | Remove the template feel from AI text | 2 | 63, 88 | Feed real human samples, strip "AI slop" | Already done | The `humanizer` skill is mandatory for all copy (AGENTS.md) | Run it again after applying reviewer text (AGENTS.md lesson) |
| 28 | Add schema markup, including FAQ schema | 2 | 24, 73 | 24: generate schema for every post. 73: Google says do not over-focus on structured data | Already done | Valid JSON-LD is hygiene, not a ranking lever | Keep FAQPage, BreadcrumbList and dateModified valid; do not add schema types for their own sake |
| 29 | Use unique images and video, not stock or AI-generated | 1 | 73 | Google's generative-AI guidance asks for high-quality, original media | Adopt with limits | Fine where an image carries information | Charts generated from our own data on the December asset; no decorative AI images |
| 30 | Repurpose one page into a carousel, reel script and email | 2 | 24, 122 | One piece of research becomes many posts | Adopt with limits | Only for the December videos and the launch posts | Scripts quote numbers from the page and link to it |
| 31 | Topical authority through a cluster of related pages (topical map) | 3 | 10, 24, 122 | Answering many questions in a niche makes the money keywords easier | Adopt with limits | Our cluster already exists (17 corridors, pillar, sender, rate pages) | Do not start an off-topic blog. New pages only where GSC shows demand; rate pages only per the AGENTS.md rule |
| 32 | Location pages, each genuinely different | 1 | 112 | Rated 8/10 "underrated, but each one must be different"; mass AI location pages rated 1/10 | Adopt with limits | Corridor pages are our location pages and each is hand-verified | Any expansion beyond hand-built corridors is blocked by the pSEO gate (three of four conditions still fail) |

### C. Internal links

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 33 | New page: link out to about 3 related pages (one money page with a descriptive anchor), and add links to it from 2 or 3 older pages that already rank | 4 | 6, 12, 38, 122 | Helps Google find and rank the new page faster | Adopt | Standard discovery and context practice | Any new rate page or section: link from the matching corridor's intro and from the pillar table; already done for rate pages (footer, PK and BD guides, PR #71) |
| 34 | Find pages that mention a keyword and link that phrase to the target page (site:domain "keyword", or ask an LLM using the sitemap) | 2 | 16, 24 | Simple internal-link wins | Adopt | Correct | Faster here: grep `data/corridors.ts` and `data/ratePages.ts` for the phrase (for example "Payoneer rate") and add links in the data, then build |
| 35 | Pass authority from pages that have the most external links (GSC Links report) to pages you want to rank | 1 | 36 | 3 to 5 internal links from a well-linked page lifts the others | Not applicable | We have no editorial backlinks yet; the linked pages are spam targets | Revisit once real links land (after the backlink-gap outreach) |
| 36 | Detect cannibalization (two pages for one query in GSC) and pick one | 1 | 13 | "Google shows neither"; fix by linking the weaker to the stronger | Already done | Checked for Pakistan rate page vs corridor: none | Repeat at each checkpoint for every rate page against its corridor, using GSC query then pages view |

### D. Indexing and technical

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 37 | Check `site:` and use GSC URL Inspection "Request indexing" after changes | 2 | 5, 126 | "Forces Google to know about your page" | Already done | All sitemap URLs requested 2026-10-27 to 29; requests are a hint, not a force | Owner requests indexing for each URL whose copy changed; check last-crawl date before judging a change |
| 38 | Add the site to Bing Webmaster Tools by importing from GSC and submitting the sitemap | 1 | 4 | "Double your traffic" | Already done | Connected 2026-10-29; Bing is our best source of visible query text | Read Bing monthly (SEO_PLAN item 12) |
| 39 | Descriptive link and button text; no layout shift while loading | 1 | 32 | Framed as "Google's new update checks the accessibility tree, CLS and llms.txt" | Adopt | Descriptive anchors are in Google's link guidance and CLS is a Core Web Vital; the "update" framing is false and llms.txt is not a Google requirement | Playwright check for empty or generic link text ("click here", "learn more"); watch CWV in GSC |
| 40 | Page speed only matters when the site is slow | 1 | 112 | Rated 2/10 unless the site is really slow | Already done | Static Next.js pages | Check the GSC Core Web Vitals report quarterly; act only on "Poor" URLs |
| 41 | Publish an llms.txt file | 2 | 29, 32 | Makes it easy for AI to read your site; "your competitors don't know yet" | Rejected | Google's own AI guidance (row 73) says it is not needed; already in "Decided against" | Do not add. Revisit only if a major AI engine documents that it uses it |

### E. Measurement and automation

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 42 | A reporting view of impressions, clicks, CTR, position, with content grouped by the month it shipped | 1 | 22 | Looker Studio report; track each month's posts over time | Adopt with limits | The cohort idea is good; a Looker dashboard is overhead at our size | Keep the checkpoint tables in SEO_PLAN, with a "changed on" date per page so each change is judged against its own window |
| 43 | A scheduled AI agent that reads GSC weekly and recommends changes (page-2 queries, questions, risk of editing a page) | 3 | 74, 94, 121 | Claude or Cowork runs it weekly and emails recommendations, including copy to paste | Adopt with limits | Useful once there is data; weekly is too often at 355 impressions a month, and pasted copy would bypass the pipeline | Monthly at most, read-only, output is a candidate list for the owner; any copy goes through verifier, reviewer, humanizer. Can be a scheduled task on request |
| 44 | GA4 exploration of sessions by hour of day | 1 | 110 | See which hours get the most traffic | Not applicable | No decision on this site depends on it | Skip |
| 45 | Conversions and form fills as a ranking signal | 1 | 18 | A one-page tool ranked because people visited from social and filled the form; "Google uses that data" | Rejected | Unproven causal claim from one anecdote | Measure real usage for our own decisions instead: the proposed PostHog `calc_run` event (SEO_PLAN item 5) |

### F. Links and PR

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 46 | Backlink gap: list where competitors have links (directories, lists, PR, guest posts) and get listed too | 3 | 27, 119, 123 | "If you have all their links, only content differs"; register in every directory they use | Adopt with limits | The gap list is useful; "register everywhere" and "whatever they are paying for" lead to link schemes | SEO_PLAN item 7 with OpenRush `compare_backlink_gap`. Keep only places a person would read (fintech comparisons, freelancer resource lists, university or community guides). No paid placements, no link-only directories |
| 47 | Find unlinked brand mentions and ask for a link | 2 | 24, 33 | People already mention you, so ask them to link | Not applicable | Almost no mentions exist yet | Revisit after the launch posts and the December data asset; search the brand name and "paidacross" quarterly |
| 48 | Linkable assets: free tools, data, studies, templates | 3 | 24, 28, 112 | People link to tools and original data | Adopt | Earned links, fully within guidelines | The calculator and the December data asset; pitch them in the daily emails and the Show HN post |
| 49 | Link quality over quantity; 10 to 40 links is typical on page 1; spammy links hurt; links take 1 to 3 months; nofollow links are still worth having | 2 | 112, 114 | Four links a month is enough; Fiverr link packs get sites penalised; a natural profile mixes follow and nofollow | Adopt | Consistent with Google's link spam policy | Count only editorial links as progress; judge link work at 2 to 3 months; welcome nofollow mentions (Reddit, news, Wikipedia) for traffic |
| 50 | Digital PR and genuine guest features | 1 | 123 | "If it's PR, get PR; if it's a guest post, ask to be featured" | Adopt with limits | Fine when earned; paid guest posts with followed links are link spam | Qwoted and Featured.com answers, correction emails to authors quoting stale Payoneer fees (SEO_PLAN ongoing items) |
| 51 | Buy expired domains with authority and rebuild them | 1 | 44 | "Google ranks you immediately because the authority already exists" | Rejected | Expired domain abuse is a named Google spam policy | Never |
| 52 | Buy links or reviews | 2 | 112, 114 | 112 rates buying reviews 0/10; 114 warns about Fiverr link packs | Rejected | Link spam and fake-review policies; also contradicts our positioning | Never |

### G. Community, launch and distribution

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 53 | Helpful Reddit answers from an account named after the business, no self-promotion; turn the questions into content | 1 | 30 | The username is all the advertising you need | Adopt with limits | Honest participation is fine; Reddit is heavily cited by AI engines (31) | Owner, two answers a week from a branded account that says who it is (SEO_PLAN ongoing). Link only when the page answers the exact question |
| 54 | Seed a fake Reddit thread with your clients, then edit in your link | 1 | 17 | "Sneaky SEO" | Rejected | Astroturfing; bans; already in "Decided against" | Never |
| 55 | Farm Reddit karma on unrelated posts so link posts are not removed | 1 | 128 | Needed so you are not banned for links | Rejected | Same as 54; already in "Decided against" | Never |
| 56 | Launch where builders look: r/SideProject, Show HN, Product Hunt (Tuesday to Thursday), Indie Hackers, Uneed (a link if voted up) | 1 | 130 | Five places that send first users | Adopt | Real audiences, earned attention, one possible followed link | SEO_PLAN item 8, one per week, owner posts and answers comments; lead with the data |
| 57 | Republish articles on Medium, Dev.to, Teletype, vc.ru, Pikabu | 1 | 128 | Free extra reach for a small product | Adopt with limits | Duplicate content risk is low if attributed, value is low | Only for the December data story, with a canonical or clear "originally published at" link; never syndicate corridor pages |
| 58 | Localise into less competitive languages | 1 | 128 | A Chrome extension translated its store listing into 52 languages; Portuguese and Japanese had far less competition | Adopt with limits | Supports the Q1 2027 decision; every translated page needs the same fact-checking forever | No machine-translated financial pages. Owner decides Portuguese (Brazil) and Spanish (Mexico, Colombia, Argentina) in Q1 2027 |
| 59 | Record one short video per answer, post to 7 platforms, boost the best performers as local ads | 1 | 122 | 49 posts a week; reach 500k people for free | Adopt with limits | The repurposing is sound; the volume math is hype and ads are out of scope | December: a few 30-second corridor videos with real numbers, linking to each page |
| 60 | An AI "content engine" producing hundreds of posts a month | 2 | 125, 131 | Being found takes hundreds of posts a month; one person cannot do it by hand | Rejected | Trust and accuracy are the bottleneck, not volume; already in "Decided against" | Keep the December plan |
| 61 | Spin viral videos into "original" ones (ShadowScript, a "virality" skill that rebuilds viral videos in your voice) | 2 | 69, 115 | A million views a month for 20 minutes' work | Rejected | Derivative mass content; platform spam rules; no accuracy | Never |
| 62 | Phrase the first slide or title of social content as the question people type into TikTok or YouTube search | 1 | 83 | Optimises the post for social search, where travellers now search | Adopt with limits | Social search is real; applies only to the December videos | Title videos with the query ("what $1,000 from a US client becomes in pesos") |

### H. AI search (GEO)

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 63 | Get mentioned where AI engines already pull from: Reddit, review sites (G2, Capterra, Trustpilot), "best X" roundups | 1 | 31 | About 75% of what AI cites is off your own site | Adopt with limits | Directionally plausible; the statistic is NP Digital's own and unverified | Use OpenRush `discover_ai_citations` to list the roundups cited for our questions; pitch inclusion with our data; branded Reddit answers (53); no fake reviews |
| 64 | Check AI visibility with a checker tool | 3 | 14, 31, 117 | Free tools score whether ChatGPT and AI Overviews show you and who is ahead | Already done | We have OpenRush `inspect_ai_visibility` and `discover_ai_citations`; the free tools need an email opt-in | SEO_PLAN item 9 |
| 65 | Follow Google's "optimizing for generative AI" guidance: AEO and GEO are still SEO | 2 | 73, 92 | No llms.txt, no special markup, no chunking, no rewriting for AI, no inauthentic mentions, do not over-focus on structured data; fact-check AI output | Adopt | It is Google's own documentation and matches everything else here | Treat as the baseline policy for any "AI optimisation" idea that arrives later |
| 66 | Remove "AI watermarks" from generated text | 1 | 129 | OpenAI watermarks all ChatGPT text; a tool removes them | Rejected | Dubious claim; the purpose is disguise; already in "Decided against" | Humanizer is for readability only |

### I. Local

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 67 | NAP consistency and local citations (BrightLocal, Yext, napchecker.com) | 2 | 91, 132 | Consistent name, address, phone builds Google trust for local ranking | Not applicable | No physical business or Google Business Profile | Skip; already in "Decided against" |
| 68 | Hyper-local service pages and posts for your city | 1 | 24 | Rank locally with city pages | Not applicable | National-scope comparison site | Skip |

### J. Scaled content warning

| # | Tactic | n | Row ids | Claim as the videos state it | Verdict | Reason | How to apply here |
|---|---|---|---|---|---|---|---|
| 69 | Mass AI-generated pages (thousands of location pages, AI articles at scale) | 2 | 112, 113 | 112: "Google knows what you're doing, fire anyone who does this". 113: a course seller's own site shows "Mount AI", a traffic spike then a collapse after a 2025 core update; Google's scaled content abuse policy quoted | Rejected | Scaled content abuse is a named spam policy; the traffic graph in 113 is the cautionary example | pSEO gate in AGENTS.md stays closed until its conditions pass; corridor and rate pages stay hand-built and verified |

Distinct tactics: 69.

## 2. Tools mentioned

| Tool | Rows | Used for in the videos | Equivalent we already have | Note |
|---|---|---|---|---|
| AnswerThePublic | 10, 12, 31, 38, 118, 122 | Question clusters for a topic | OpenRush `research_keywords`, `inspect_serp` (PAA); GSC question regex | 3 free searches a day; optional for idea generation |
| findquestions.com | 1, 6, 25, 95 | Questions customers ask | Same as above | Not needed |
| Google People Also Ask | 19, 24, 122 | Questions and outlines | OpenRush `inspect_serp`; Playwright | Use |
| Google Autocomplete endpoint | 89 | Free keyword list | curl from Bash | Occasional, manual |
| Google Keyword Planner | 28 | Search volume | OpenRush `inspect_keyword`, Semrush MCP | Needs an Ads account; not needed |
| Semrush | 11, 19, 34, 123 | Keyword gap, variations, difficulty, competitor backlinks | Semrush MCP (limited units) | Spend units on country databases where OpenRush is thin |
| Ubersuggest / Neil Patel traffic checker | 11, 15, 20, 31, 35, 37, 119, 120 | Similar sites, keyword gap, top pages, backlinks, AI visibility report | OpenRush `discover_competitors`, `compare_keyword_coverage`, `inspect_domain`, `inspect_backlinks`, `inspect_ai_visibility` | Not needed |
| Moz Keyword Research (SERP analysis, page score, DA) | 116 | Judge whether a query is under-targeted | OpenRush `inspect_serp`, `inspect_keyword` | Not needed |
| pageaudit.com, Detailed SEO extension | 23, 34, 38 | Read a competitor page's title, meta, headings, word count | OpenRush `inspect_page`; Playwright | Not needed |
| featspot blog list | 34 | Find sites in an industry | OpenRush `discover_competitors` | Not needed |
| linkgap.io, the backlink-gap site in row 18 | 18, 27 | Backlink gap | OpenRush `compare_backlink_gap` | Not needed |
| unlinked.io | 33 | Unlinked brand mentions | Web search for the brand | Later, when mentions exist |
| Google Search Console | 5, 13, 21, 36, 74, 94, 95, 108, 121, 126 | Request indexing, cannibalization, page-2 queries, links report, regex filters, title rewrites | GSC via OpenRush `get_search_performance` plus the owner's UI | Have |
| Google Analytics 4 | 110 | Sessions by hour | GA via OpenRush `get_website_analytics`; PostHog is primary | Have |
| Looker Studio | 22 | Monthly SEO dashboard | Checkpoint tables in SEO_PLAN | Not needed |
| Bing Webmaster Tools | 4 | Import from GSC, sitemap | Hermoso MCP | Have |
| PageSpeed Insights | 32 | CLS and speed | Playwright; GSC Core Web Vitals report | Have equivalent |
| Yoast SEO llms.txt switch | 29, 32 | Generate llms.txt | n/a (WordPress) | Rejected (tactic 41) |
| AI readiness checker, Go Big AI Visibility Checker, Ubersuggest AI visibility | 14, 31, 117 | AI visibility score | OpenRush `inspect_ai_visibility`, `discover_ai_citations` | Have |
| ChatGPT, Claude, Claude Cowork, Gemini deep research | many (2, 6, 12, 19, 23, 24, 25, 26, 38, 53, 59, 74, 94, 109, 111, 120, 121, 122) | Drafting, interviewing, summarising competitors, analysing GSC exports | Claude Code with the corridor agents and skills | Have; all copy goes through the pipeline |
| Claude GSC agent prompt (heytony.ca), Cowork GSC prompt | 74, 94 | Weekly page-2 and question report | Scheduled task plus OpenRush | Build only on request, monthly |
| YouTube unlisted upload for free transcripts | 122 | Transcribe an expert video | Supabase plus Supadata pipeline | Have |
| Instagram in-app editor, captions; Meta Ads Manager | 51, 122 | Edit and boost short videos | n/a | December only, no ads |
| Trello | 53 | Content pipeline board | SEO_PLAN checklist | Not needed |
| BrightLocal, Yext, napchecker.com | 91, 132 | Local citations, NAP checks | n/a | Not applicable |
| expireddomains.net | 44 | Expired domains | n/a | Rejected |
| ShadowScript, YouTube Agent Skill, a scheduling tool | 69, 115 | Spin and schedule viral videos | n/a | Rejected |
| Hostinger Horizons, Google AdSense | 28 | Build and monetise a calculator site | Our calculator | AdSense not applicable |
| Marketing Skills pack (SEO audit), Stop Slop, Caveman, Hyperframes | 88 | Claude skills for SEO audits, de-slopping text, video | `humanizer`, `impeccable`; OpenRush `audit_site`; Semrush `site_audit` | Not needed |
| Taste, Design Lang, React Bits, GSAP skills, Playwright CLI, Impeccable, Transitions.dev, AwesomeDesign.md, shadcn MCP, Frontend Design | 84, 88, 124 | Design quality in Claude-built sites | `impeccable`, `frontend-design`, Playwright (installed PR #67) | Not SEO |
| "Watermark remover" | 129 | Remove claimed AI text watermarks | n/a | Rejected |
| Medium, Dev.to, Teletype, vc.ru, Pikabu | 128 | Syndication | n/a | Tactic 57 limits |
| r/SideProject, Hacker News, Product Hunt, Indie Hackers, Uneed | 130 | Launch | n/a | SEO_PLAN item 8 |
| G2, Capterra, Trustpilot | 31 | Review profiles that AI cites | n/a | Trustpilot is the relevant one for mining (item 11) |
| Google Search Central docs: "Optimizing for generative AI", spam policies, AI-generated content guidance | 73, 92, 113 | The rules | Read directly | Reference baseline |
| Sensor Tower, Acquire, Flippa, B-Stock, liquidation.com, USAspending, SEC EDGAR | 41, 42, 43, 39, 47 | Non-SEO money schemes | n/a | Ignore |

## 3. AI search / GEO findings

What the videos claim, and our verdict on each.

| Claim | Rows | Verdict | Note for this site |
|---|---|---|---|
| Lead with the answer; AI lifts a complete answer from the top of a page and skips pages that warm up first | 2, 31 | Accept | Already done (PR #64, PR #72); keep for every FAQ |
| Question headings in the user's exact words and real FAQ sections raise citation rates | 31 | Accept with limits | FAQ questions from GSC, Bing and PAA wording |
| Google ranking and AI citation are now separate scores. Rank 1 gave a 31.4% chance of appearing in the AI answer, rank 4 only 2.6%; 90% of cited pages rank 21 or lower; AI citations from Google's top 10 fell from 76% to 38% (NP Digital study, 500 keywords, 4,000 prompts) | 31 | Unverified, directional only | Internally inconsistent (90% cited from rank 21+ sits badly with rank 1 at 31.4%). Our own Bing data fits the direction: long chatbot-style queries already reach us. Check with OpenRush rather than trusting the numbers |
| Short queries (1 to 3 words) trigger an AI answer 23% of the time, 6 or more words 77% | 31 | Plausible, unverified | Supports tactic 11 (7+ word GSC regex) |
| Zero-click searches were 57 to 59% before AI Overviews; the top result's CTR fell from 1.76% to 0.61% | 31 | First figure plausible; second implausible as stated | Do not quote either. Do expect lower CTR at a given position than older benchmarks |
| ChatGPT citations of brand sites jumped from 8% to 56% between two model versions, then fell back | 31 | Unverified, but the lesson is sound | Do not optimise for one model; check AI visibility quarterly, not weekly |
| About 75% of what AI cites is off your site: Reddit, review profiles, roundups | 31 | Directional | Tactic 63; SEO_PLAN already notes YouTube is the most-cited source for this topic (46 citations), which supports the December videos |
| Leads from AI search rose from 3.1% to 7.4% in a year across 22 companies | 31 | Unverified agency figure | Not decision-relevant at our volume |
| Google's own guidance: AEO and GEO are SEO; no llms.txt, no special markup, no chunking, no rewriting for AI, no inauthentic mentions, do not over-focus on structured data; unique non-commodity content, good headings, original media | 73 | Accept as the baseline | Overrides any reel that sells an "AI optimisation" trick |
| Google: AI output can hallucinate, fact-check before publishing; interview yourself to add experience; do not game the algorithm | 92 | Accept | Already enforced by the AGENTS.md pipeline |
| llms.txt helps you rank in ChatGPT; "Google's update checks for llms.txt" | 29, 32 | Reject | Contradicted by row 73 and already in "Decided against" |
| Long GSC queries (7+ words) are the queries people now ask AI, and Google already finds you relevant | 108 | Accept as a heuristic | Answer them on the page that ranks |
| The sources an AI Overview cites for "how much does X cost" show what to beat; write a deeper cost page | 111 | Accept | Our core query type; check cited sources for "cost to receive USD in {country}" |
| Case studies and original data are the best thing for AI and SEO | 112 | Accept | December data asset |
| Answering one customer question a week got a business recommended by ChatGPT with no rankings | 7 | Anecdote | Same practice as tactic 1 |
| A one-page tool with no SEO appeared in AI Overviews because of social traffic and form fills | 18 | Anecdote, causal claim rejected | Shows tools can be cited; does not show user signals rank |
| Free AI visibility checkers | 14, 31, 117 | Tools fine, not needed | OpenRush covers it |
| Remove AI watermarks so text is not detected | 129 | Reject | Disguise, not quality |
| Scaled AI content spikes then collapses at a core update | 113 | Accept as a warning | pSEO gate stays closed |

Net for paidacross: no separate GEO workstream. Do the same things as for Google (answer first, verified numbers
with dates, FAQs in the user's words, original data), plus earned presence where AI engines read (Reddit answers,
genuine roundups, YouTube videos, a Trustpilot-informed FAQ). Measure with OpenRush quarterly.

## 4. Measurement rules

What the videos suggest:

| Source rows | Suggested rule or timing |
|---|---|
| 21, 74 | Page-2 candidates: positions 11 to 20, sorted by impressions |
| 121, 126 | Retitle pages with many impressions and few or no clicks; "+10 positions in a week", "4x traffic in a month" |
| 13 | Fixing cannibalization can move rankings "overnight" |
| 114 | A new backlink can take a month to move anything; expect compounding after 2 to 3 months; about 4 good links a month is plenty |
| 19 | Two AI-assisted articles a week for six months: 76, 360, 2,500, 8,000 monthly visitors at months 1, 2, 4, 6 |
| 6, 7, 10 | One question-answer post a week, about an hour |
| 22 | Monthly dashboard; track each month's posts as a cohort |
| 74, 94 | Weekly automated GSC review |
| 24 | Title under 60 characters, meta description under 156 |
| 116 | Exact query in 5 places; more is mild stuffing |
| 31 | AI citation shares swing between model versions; build pages that are always extractable |

Reconciled rules for a site with about 355 impressions and 2 clicks a month:

1. **Small numbers first.** With n impressions and 0 clicks, the 95% upper bound on the true CTR is about 3/n
   (rule of three). At 30 impressions a page could have a real CTR near 10% and still show 0 clicks. Do not call
   a page's CTR low below about 100 impressions in the comparison window, and do not compare CTR between pages
   with under about 50 impressions each.
2. **Title rewrite trigger.** A page qualifies when, over the last 90 days, it has at least 100 impressions,
   average position 15 or better, and 0 clicks or CTR under 1%. Rewrite once (tactic 19), log the date in
   SEO_PLAN, request indexing, then leave the title alone for at least 8 weeks.
3. **Waiting time before judging a change.** Confirm the recrawl first (GSC URL Inspection, last crawl date
   after the change). Read a preliminary result no earlier than 4 weeks after recrawl and a decision result at 8
   weeks, comparing equal windows (28 days vs the previous 28, or 8 weeks vs 8 weeks). For PR #72 (2026-10-29)
   that means the 2026-11-23 checkpoint is preliminary and about 2026-12-24 is the decision read.
4. **One change per page per cycle.** Title, intro and FAQ changes on the same page in the same window cannot be
   attributed. Stagger them, or accept that the read is for the bundle.
5. **Position needs query context.** Average position on a low-volume page moves when a new query starts
   triggering it. Read page plus query in GSC; because GSC hides most query text here, use Bing's query report
   for wording and trend.
6. **Backlinks.** Judge link work at 2 to 3 months, by editorial referring domains gained (not total links, and
   never counting the 26 disavowed domains). Re-check monthly for new spam domains (owner, SEO_PLAN).
7. **AI visibility.** Check quarterly with OpenRush on a fixed question set (for example "cost to receive USD in
   the Philippines", "Payoneer dollar rate in Pakistan today"), because model updates swing citation shares.
8. **Cadences.** Daily: the verification rotation (AGENTS.md). Weekly: at most one fact-checked FAQ. Monthly: GSC
   and Bing read, spam-domain check, any automated GSC candidate report. Checkpoints: around 2026-11-23, then
   every 4 to 8 weeks. Quarterly: AI visibility, Core Web Vitals, keyword gap refresh.
9. **Do not react to one month.** Already the SEO_PLAN rule; the 28-day drop of 173 impressions is within noise
   for a site this size.
10. **Engagement.** Ranking claims about user signals are unproven (row 18), but whether people use the
    calculator is the product question. Add the PostHog `calc_run` event (SEO_PLAN item 5, needs owner go-ahead)
    and read it monthly.
11. **Volume claims from the videos are not targets.** "Two posts a week for six months" (19) and "49 posts a
    week" (122) assume generic small-business topics; our limit is the fact-checking pipeline (38 to 60 claims
    and 7 to 9 real errors per new corridor, AGENTS.md).

## 5. Rejected and why

| Tactic | Rows | Why |
|---|---|---|
| Fake Reddit threads seeded with clients, then an edited-in link | 17 | Astroturfing; account bans; contradicts the site's honesty positioning |
| Reddit karma farming on unrelated posts to make link posts stick | 128 | Same as above |
| Expired domains bought for their authority | 44 | Google spam policy: expired domain abuse |
| Buying links (Fiverr packs, paid directory or guest-post links) | 114, 123 (the "whatever they're paying for" part) | Google link spam policy |
| Buying or faking reviews | 112 | Platform suspensions; deceptive |
| Mass AI pages, thousands of location pages, AI articles at scale | 112, 113 (and the scale implied in 19) | Google spam policy: scaled content abuse; "Mount AI" collapse in 113; pSEO gate closed |
| High-volume AI "content engine" (hundreds of posts a month) | 125, 131 | Trust and accuracy are the bottleneck; already decided against |
| Spinning viral videos into "original" videos; rebuilding competitors' viral videos | 69, 115 | Derivative mass content; platform spam rules |
| Social algorithm tricks: 5-second looping reel with the story in the caption; "uniqualiser" reposting near-duplicate reels | 61, 93 | Manipulative; irrelevant to search; would hurt the December videos' credibility |
| llms.txt as a ranking lever | 29, 32 | Google says it is not needed (73); already decided against |
| AI watermark removal | 129 | Dubious claim; purpose is disguise |
| Treating conversions or form fills as a ranking signal | 18 | Unproven causal claim |
| Copying the top three pages' heading structure "changed a little" | 34 | Produces commodity content; use headings only as a coverage checklist (tactic 7) |
| Changing existing URLs to include the keyword | 116, 122 (implied) | No meaningful gain, redirect risk; 118 itself says URL keywords barely matter |
| Local citations, NAP, Google Business Profile, hyper-local pages | 24, 91, 132 | Not applicable: no local business |
| Calculator site monetised with AdSense | 28 | Conflicts with an affiliate-disclosed comparison site; our calculator stays |
| Pasting AI-suggested copy straight onto pages from an automated GSC agent | 94 | Bypasses verifier, reviewer, humanizer |
| Out of scope and in some cases harmful (not SEO): hijacking expired API domains, buying dead toll-free numbers, squatting app bundle IDs, reselling API access against terms | 45, 49, 48, 66 | Fraud, hijacking or terms violations; never relevant |

## 6. Source index

SEO = contains an SEO, GEO, content, link or distribution tactic or claim used above. Payoneer = product facts
for content accuracy (not SEO tactics). no = ignore. `analysis` jsonb holds only batch labels plus, for ids 1 to
11, a method and verdict from an earlier pass; transcripts are the source. Rows 8, 9, 46, 64, 65, 68, 78, 79,
86, 98, 99, 101, 107 have no done transcript and are not in this index.

| id | Summary | SEO |
|---|---|---|
| 1 | findquestions.com: answer industry questions one at a time to be seen as a topical expert | yes |
| 2 | ChatGPT prompt to rewrite a post intro so the first sentence answers the question, or add a TL;DR, for AI | yes |
| 3 | Georgian bank accounts for foreigners: 48 hours, "up to 13% interest", no tax on foreign income (hype, unverified) | no |
| 4 | Bing Webmaster Tools: import sites from GSC, sitemap submitted; "double your traffic" | yes |
| 5 | `site:` check, then GSC URL Inspection request indexing | yes |
| 6 | One hour a week: findquestions question, ChatGPT draft, images, 3 internal links | yes |
| 7 | One blog post a week answering customer questions; 15% of searches are new daily; recommended by ChatGPT | yes |
| 10 | AnswerThePublic questions with no current answer, one a week, "topical mapping", AI may write it | yes |
| 11 | Verify keyword volume in Semrush or Ubersuggest and use the variation people search | yes |
| 12 | ATP question, ChatGPT interview prompt (voice mode), 3 links out and 3 links in from older pages | yes |
| 13 | GSC cannibalization: two pages on one query, link weaker to stronger | yes |
| 14 | "AI readiness checker" free tool for ChatGPT visibility (email report) | yes |
| 15 | Ubersuggest similar websites plus keyword gap, add their keywords | yes |
| 16 | Google `site:domain "keyword"` to find pages to link from with that anchor | yes |
| 17 | Fake Reddit "who is the best X" thread with clients commenting, then edit in a link | yes (rejected) |
| 18 | One-page backlink-gap tool ranks and appears in AI Overviews; claims social traffic and form fills drive ranking | yes |
| 19 | Agency case: Semrush easy keywords, summarise top 3, outline from headings and PAA, AI article twice a week, 76 to 8,000 visitors in 6 months | yes |
| 20 | Ubersuggest keyword gap (duplicate of 15) | yes |
| 21 | GSC positions 11 to 20 by impressions, compare with #1, add original data, stories, FAQs | yes |
| 22 | Looker Studio report: impressions, clicks, CTR, position, posts tracked by month | yes |
| 23 | pageaudit.com on the #1 page and yours, ask ChatGPT what to change to outrank | yes |
| 24 | Long list of ChatGPT SEO prompts: interview, internal links from sitemap, titles under 60, metas under 156, FAQ from PAA/Reddit/Quora, content gaps, schema, audit, outlines, buyer-journey ideas, linkable assets, unlinked mentions, local pages | yes |
| 25 | findquestions plus an LLM interview prompt (10 questions, voice mode) for unique content | yes |
| 26 | Competitor sitemap vs yours in ChatGPT for content gap ideas | yes |
| 27 | linkgap.io backlink gap analysis | yes |
| 28 | Keyword Planner "calculator" terms with huge volume; build a calculator site and add AdSense | yes |
| 29 | llms.txt via Yoast "to rank in ChatGPT" | yes (rejected) |
| 30 | Reddit: branded username, local subs, helpful comments, never self-promote, turn questions into posts | yes |
| 31 | NP Digital long video: micro-moments, zero-click, AI citation statistics, answer-first, question headings, FAQs, 75% of citations off-site (Reddit, reviews, roundups), Ubersuggest AI visibility | yes |
| 32 | "Google update" checks accessibility tree (link text), CLS and llms.txt; PageSpeed Insights | yes |
| 33 | unlinked.io: find unlinked brand mentions and ask for links | yes |
| 34 | featspot site list, Semrush keyword gap and variations, Detailed SEO on top 3, combine their headings | yes |
| 35 | Ubersuggest competitor top pages by traffic, write better | yes |
| 36 | GSC Links report: pages with most linking sites, add 3 to 5 internal links from them | yes |
| 37 | Ubersuggest common keywords and keyword gap with a local competitor | yes |
| 38 | ATP question, summarise top 3, headings via Detailed SEO, ATP questions as H2s, long ChatGPT prompt with FAQ, edit, link from 2 to 3 old posts | yes |
| 39 | Trade on government contract awards from USAspending.gov | no |
| 40 | Rebrand open-source government code as a SaaS | no |
| 41 | Validate app ideas with Sensor Tower, Acquire, Flippa, Reddit | no |
| 42 | Buy B-Stock overstock pallets, resell on Marketplace | no |
| 43 | Buy Amazon return pallets, resell | no |
| 44 | Buy expired domains with authority for affiliate sites or resale | yes (rejected) |
| 45 | Hijack expired API domains of dead SaaS and proxy their traffic | no (harmful) |
| 47 | Copy hedge-fund 13F filings from SEC EDGAR | no |
| 48 | Squat startups' app bundle IDs for settlements | no (harmful) |
| 49 | Buy dead toll-free numbers and route callers to pay-per-call offers | no (harmful) |
| 50 | Persian song fragment, no content | no |
| 51 | Paid funnel: AI ad hooks, one landing page, CRM, 5 to 7 day follow-up | no |
| 52 | Stripe dispute protection: refund policy, chargeback alerts, response template | no |
| 53 | Clone a YouTube niche: Claude analyses competitor titles and views, Gemini deep research for topics, title variants | yes |
| 54 | Sell AI automation to local businesses using Claude Code and scraped leads | no |
| 55 | Five free AI certifications | no |
| 56 | 1,000 leads a month and tiered offers | no |
| 57 | People pay when value exceeds price | no |
| 58 | High-ticket affiliate marketing on Instagram | no |
| 59 | Copy a competitor's Google reviews into Claude, extract questions and objections, turn into FAQs | yes |
| 60 | Russian: five YouTube channels about money | no |
| 61 | Russian: 5-second looping reel with the story in the caption to inflate watch time | no |
| 62 | Duplicate of 58 | no |
| 63 | Russian: prompts to make AI posts sound human, feed it real human texts | yes |
| 66 | OpenAI API resale arbitrage on Discord (against terms) | no |
| 67 | Twelve self-help books | no |
| 69 | YouTube automation: spin viral shorts into "original" videos with ShadowScript, bulk schedule | yes (rejected) |
| 70 | Veritasium-style explainer on phosphorus-atom qubits | no |
| 71 | Napoleon Hill style motivational monologue (1, 6, 7, 11, 16) | no |
| 72 | CPU core counts explained, 1 to 128 cores | no |
| 73 | Google's "Optimizing for generative AI" doc summarised: AEO/GEO is SEO, no llms.txt, no special markup, no chunking, unique non-commodity content | yes |
| 74 | Claude agent that reads GSC weekly for page-2 keywords and emails recommendations (prompt is a lead magnet) | yes |
| 75 | Etsy digital products: reverse engineer best sellers via a hidden URL filter, Google Trends, AI image tools | no |
| 76 | Armenian transcript, garbled; mentions marketing strategy and a mentor; unusable | no |
| 77 | Armenian transcript, garbled; unusable | no |
| 80 | Russian: four books to get rich | no |
| 81 | Russian: two Jim Collins books for founders | no |
| 82 | Podcast intro fragment, no content | no |
| 83 | Russian: travel carousels titled as the question people type, for TikTok search, CTA to an app | yes |
| 84 | Russian: AwesomeDesign.md and a shadcn MCP so Claude sites look less templated | no |
| 85 | Promo for joinrw.com (SEO course), no tactic | no |
| 87 | Russian: Kickbox ads in the Claude Code spinner | no |
| 88 | Russian: Claude skills list (Hyperframes, Frontend Design, Marketing Skills with SEO audit, Stop Slop, Caveman) | yes (tools only) |
| 89 | Free Google Autocomplete "secret link" for keyword research, sorted by an LLM | yes |
| 90 | Russian: Google Boost Bytes free AI mini-courses | no |
| 91 | napchecker.com: directory and NAP consistency report for local SEO | yes |
| 92 | Google AI-content guidance: hallucinations, fact-check, interview yourself, do not game the algorithm | yes |
| 93 | Russian: "uniqualiser" bot reposts near-duplicate reels to beat the algorithm | no |
| 94 | Claude Cowork prompt: GSC questions, site scan, ranking diagnosis, risk of editing, copy-paste text | yes |
| 95 | GSC custom regex for question queries, sort by impressions, make the page answer directly | yes |
| 96 | Russian: quiz-video format for education apps | no |
| 97 | Prompting framework: outcome, task, context, format | no |
| 100 | Reverse engineer an App Store app with Claude to find a blue-ocean angle | no |
| 102 | Nigerian freelancer: Payoneer worth it in 2026? Two stars; see Payoneer notes | Payoneer |
| 103 | Hindi: Payoneer 2026 withdrawal flow to an Indian bank, fee screen, adding a bank; see Payoneer notes | Payoneer |
| 104 | JazzCash "Freelance payments" with Payoneer, step by step; see Payoneer notes | Payoneer |
| 105 | Bengali (partly garbled): Payoneer to bKash via the Remittance option; see Payoneer notes | Payoneer |
| 106 | Payoneer YouTube video; transcript is music only | no |
| 108 | GSC custom regex for queries of 7+ words, which read like AI prompts | yes |
| 109 | Compare your page with the top 3 for "service in city" in Claude, then let it interview you on the gaps | yes |
| 110 | GA4 exploration: sessions by hour of day | yes |
| 111 | For "how much does X cost in city", read the AI Overview's sources, build a cost page with ranges and factors, add a calculator | yes |
| 112 | Ratings: speed 2, legit backlinks 9, AI mass location pages 1, question blogs 9, AI writing 5, case studies and original data 10, buying reviews 0, distinct location pages 8 | yes |
| 113 | "Mount AI": a course seller's site spiked on AI content then collapsed after a 2025 core update; Google scaled-content policy; then a pitch to sell SEO | yes |
| 114 | Backlink myths: 10 to 40 links typical, quality over quantity, spam hurts, 1 to 3 months to act, nofollow still valuable | yes |
| 115 | "YouTube Agent Skill" for Claude, 11 skills including rebuilding viral videos | yes (rejected part) |
| 116 | Moz SERP analysis: page score and domain authority show under-targeted queries; exact keyword in title, meta, URL, H1, first sentence only | yes |
| 117 | Go Big AI Visibility Checker (opt-in) | yes |
| 118 | ATP question, read top 3 in incognito, write one page better than all three; word count, URL keywords, heading order barely matter | yes |
| 119 | Ubersuggest competitor backlinks (lists, local directories) and top pages; write your own with unique insight | yes |
| 120 | Neil Patel traffic checker on the #1 site's top pages, Claude finds weaknesses, write better | yes |
| 121 | Export GSC to Claude, find high-impression low-click pages, retitle to match the search; "4x traffic" | yes |
| 122 | "Find me everywhere": questions, record an answer, YouTube transcript, AI blog post, fact-check, query in title/meta/H1, 3 links out and 1 in, scripts for 7 platforms, boost winners with ads | yes |
| 123 | Semrush competitor backlinks: register in their directories, get PR, ask for guest features | yes |
| 124 | Seven Claude design skills against "AI slop" (Taste, Design Lang, React Bits, GSAP, Playwright CLI, Impeccable, Transitions.dev) | no |
| 125 | Nine lanes to make money with AI; the "content engine" powers all of them; course pitch | yes (rejected part) |
| 126 | GSC page with impressions and no clicks: mirror top query in title, one-sentence meta answer, headers, request indexing; "+10 positions in a week" | yes |
| 127 | Seven "laws" of making money with AI; course pitch | no |
| 128 | Russian: Chrome extension growth: store listing in 52 languages, Claude-written blog, syndication, Reddit karma farming, YouTube, reviews drive store ranking | yes |
| 129 | Russian: "ChatGPT now watermarks all text", tool to remove it | yes (rejected) |
| 130 | Launch an app on r/SideProject, Hacker News, Product Hunt (Tuesday to Thursday), Indie Hackers, Uneed | yes |
| 131 | AI "content engine": hundreds of posts a month across platforms; course pitch | yes (rejected) |
| 132 | Local citations through BrightLocal or Yext for a Google Business Profile | yes |

Totals: 119 rows read; 72 SEO-relevant; 4 Payoneer product rows (102 to 105); 43 not relevant.

### Payoneer notes (rows 102 to 105, `source_page = paidacross-research`)

Creator claims and screen recordings, not primary sources. Under AGENTS.md none of this can reach a page without
a primary source and the verifier and reviewer. Use it to know what to check and what readers search for.

- **Row 102, Nigeria** (https://www.youtube.com/watch?v=ZL13HgYgjGA). Says Payoneer charges "up to 3.5%" on
  withdrawals and gives a below-market NGN rate: about 1,360 NGN per USD vs about 1,390 on Grey, Raenest and
  Cleva on the day filmed (2026), about 30,000 NGN less per 1,000 USD, roughly 2.2%. Fiverr lets Nigerian accounts
  withdraw only to PayPal or Payoneer. Payoneer can withdraw to a Nigerian USD domiciliary account as well as to
  NGN, which the creator says other fintechs do not. Rates Payoneer 2/5, keeps it as a backup. Query intent:
  "is Payoneer worth it 2026", "Payoneer vs Grey", "Payoneer to domiciliary account". Check against the
  `usd-to-ngn` Payoneer row and copy.
- **Row 103, India** (https://www.youtube.com/watch?v=3qswWRxbnds, Hindi). Screen recording of the 2026
  withdrawal flow. The fee info icon reads that withdrawals of 375 USD and under are subject to a minimum fee of
  15 USD. Creator thinks there is a 50 USD minimum but did not check. Screen says about 1 business day; creator
  says 5 days, sometimes up to 14. Adding an Indian bank needs account number, IFSC, PAN and account type
  (savings or current); approval within 24 hours to 2 or 3 days. Consistent with the Payoneer possible
  minimum-fee caveat already live on INR, PKR, BDT and both rate pages (PR #65); worth a primary-source check
  for the exact threshold on INR.
- **Row 104, Pakistan JazzCash** (https://www.youtube.com/watch?v=abwnWEYVxbQ). Generic narrated how-to: in the
  JazzCash app open "Freelance payments" (or Payoneer) under services, opt in, link an existing Payoneer account,
  then request a payment; the client receives a Payoneer payment link and pays by methods available in their
  region; status shows pending, paid, completed; funds land in the JazzCash wallet. No fees or limits stated.
  Matches the JazzCash FAQ intent on the PK pages.
- **Row 105, Bangladesh bKash** (https://www.youtube.com/watch?v=64oy6lBtuuQ, Bengali, transcript partly
  garbled across scripts; low confidence). bKash app has a "Remittance" option where you can link an existing
  Payoneer account or open one from inside bKash; there are daily and monthly limits (figures unreadable);
  sending from Payoneer to a bank account carries a charge; Payoneer card ATM withdrawals carry Visa or
  Mastercard ATM charges; the creator says Payoneer charges about 2% of the amount on a bKash transfer and bKash
  adds no charge, with something said about a government or bKash incentive that is unreadable. Do not use any
  figure from this row without a primary source.
- **Row 106** (https://www.youtube.com/watch?v=87eFszuCKAo) transcribed as music only; content unknown.

## Changelog

Every edit the agent proposes to this file and the orchestrator applies gets one dated line here, with its source.

- 2026-10-29: File created from 119 transcribed videos (`reels.items` ids 1 to 132; 72 SEO-relevant, 69 tactics)
  and the site's own history (PRs #58 to #72). Watchlist and thresholds set. "Last checked" set to 2026-10-01 so
  the first WATCH run evaluates October 2026 (the September 2026 spam update, completed 2026-10-08; Bing's AI
  Performance Topics Portfolio, 2026-10-13).
