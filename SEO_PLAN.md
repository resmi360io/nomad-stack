# SEO plan for paidacross.com

The working SEO plan: what has shipped, what is next, who does it and when. Tick items here when they
are done, and add the PR number or date, so the next session starts from the truth rather than from
memory. Fact-checking rules for anything that touches page copy live in AGENTS.md and still apply:
verifier, then reviewer, then humanizer, and ranking-moving changes go to the owner.

Last updated: 2026-10-30 (fourth revision, after the fourth video batch, rows 133 to 145, and the first backlink-gap run).

Legend: `[x]` done, `[~]` in progress or partly done, `[ ]` not started. Owner is **You** (site owner)
or **Claude** (a session in this repo).

## Baseline to measure against

Google Search Console, 2026-07-31 to 2026-10-28 (the first baseline, keep it as the reference):

| Metric | Value |
|---|---|
| Clicks | 4 |
| Impressions | 1,570 |
| Average position | 50.5 |
| Pillar `/receive-international-payments` | 1,181 impressions at 63.4, mostly sender-intent queries |
| Country pages on page 1 | Portugal 6.6, Thailand 7.4, Indonesia 8.1, Nigeria 8.6, Georgia 8.7, Philippines 9.1 |
| Closest to page 1 | Bangladesh 11.4 (97 impressions) |
| Country pages with 0 impressions | Mexico, Brazil, Uzbekistan, India, Colombia, South Africa, Argentina, Poland, Ukraine |

Latest 28 days, 2026-10-02 to 2026-10-29 (preliminary, read 2026-10-29): 2 clicks, 355 impressions
(down 173 on the previous 28 days), average position 45.4.

| Page | Impressions | Position | Note |
|---|---|---|---|
| Pillar | 218 | 65.2 | Still the bulk of impressions, still sender-intent; the sender page is three days old |
| Payoneer PKR rate page | 24 | 15.8 | New; "payoneer usd to pkr rate today" at 14.5, "today payoneer dollar rate in pakistan" at 9.5 |
| Payoneer BDT rate page | 12 | 10.3 | New |
| Indonesia | 28 | 8.6 | The only country page with a click |
| Philippines | 22 | 9.7 | |
| Portugal | 12 | 6.9 | |
| Bangladesh | 10 | 9.0 | Moved onto page 1 (was 11.4) |
| Nigeria, Georgia, Thailand | 5, 4, 6 | 5.6, 6.0, 8.3 | Page 1, almost no demand |
| Pakistan | 8 | 21.4 | Up from about 47; Payoneer queries now go to the rate page |

Read the drop in impressions with care: the 28-day window is short, and most impressions are on
anonymised queries (only 50 of 422 over three months are attributable to a query), so the per-query
picture is thin. Do not change pages in response to one month of this. Two more reasons, from the
2026-10-29 audit: both 28-day windows overlap the September 2026 spam update rollout (2026-09-24 to
2026-10-08), and the drop sits on three pages (pillar 81, Bangladesh 62, Georgia 31). The Bangladesh
rate page was live for only the last four days of the window, so a shift between our own pages can
explain at most a small part of the Bangladesh fall; the checkpoint tests it.

Bing Webmaster (2026-09-07 to 2026-10-26): about 100 impressions and 1 click, many from long,
chatbot-style questions where the site ranks 1 to 7. Crawl issues reported on 2026-10-29: none.

Backlinks: 28 referring domains, 26 of them link-farm spam (disavowed). There are no editorial links yet.
On 2026-10-30 OpenRush shows 29: 27 of the same link-farm pattern plus two startup-launch directories
(launchintel.pro, startuptile.com). The newest three (seolinkagency.shop 2026-10-22, seopxl-organic-boost-lab.shop
2026-10-26, seopxl-ranking-boost-lab.shop 2026-10-28) may not be in the disavow file, which is not in the repo,
so nobody can check. Still no editorial links.

The zero-impression country pages are indexed (owner checked India and Brazil on 2026-10-29). The cause
is demand, not indexing: English searches for receiving money in India are tiny (about 40 a month), and
Brazil searches in Portuguese ("como receber dinheiro do exterior", about 1,000 a month).

## Done

### Site changes (shipped to production)

- [x] **New corridors: South Africa, Argentina, Poland.** PR #58, 2026-10-23.
- [x] **Ukraine corridor, and the verification rotation fixed** so it runs in a persistent host session.
  PR #61, 2026-10-26.
- [x] **Rotation is shipping corrections on its own:** #60 (ZAR, THB) and #63 (BDT).
- [x] **First provider rate page, `/rates/payoneer-usd-to-pkr`, and a monetization audit** showing 7 of
  17 corridors have no paying provider. PR #62.
- [x] **Pillar split by intent.** `/receive-international-payments` serves receive intent only. PR #62.
- [x] **Sender page, `/pay-freelancers-internationally`**, for the "pay freelancers internationally"
  queries. PR #62.
- [x] **Homepage rebuilt** with its own title, description and canonical. PR #62.
- [x] **Shared `CorridorTable`** on the homepage, pillar and sender page, computed by `calculate()`. PR #62.
- [x] **Second rate page, `/rates/payoneer-usd-to-bdt`**, plus Payoneer-rate and JazzCash FAQs. PR #62.
- [x] **Pillar intro answers first; every corridor page links to the sender page.** PR #64.
- [x] **BDT rotation corrections carried to the pillar and the sender page.** PR #64.
- [x] **Philippines FAQ "Should my client pay me in US dollars or in pesos?"**, from Bing queries. PR #65.
- [x] **Payoneer possible minimum-fee caveat** on PKR, BDT, INR and both rate pages. PR #65.
- [x] **Design skills installed** (frontend-design, impeccable, vercel-react-best-practices). PR #67.
- [x] **Redesign, two iterations**, with the rendered HTML of all 24 URLs diffed before and after each:
  calculator in the first phone screen, readable guides, section navigation, key facts. PRs #68, #69.
- [x] **Financial correctness release.** Capped and tiered fees (Grey now $16 at $5,000, not $46), one
  ranking rule for every surface, personal-remittance and unconfirmed routes shown but not ranked,
  reviewed corrections on Nigeria (PayPal via Paga about 8%), Pakistan (Wise cannot take business
  payments to PKR) and Georgia. Pakistan meta description corrected to 3.6%. The broken sitewide
  SearchAction removed. The "re-checked weekly" claim made accurate. PR #70.
- [x] **Rate pages linked from the footer of every page and from the top of the PK and BD guides**; PKR
  rate FAQ reworded to match the ranking. PR #71.

### Search engines and tooling

- [x] **Google indexing requested for every URL in the sitemap** (owner, 2026-10-27 to 2026-10-29).
- [x] **Disavow file uploaded** for 26 spam domains (owner, URL-prefix property).
- [x] **Bing Webmaster connected**, sitemap resubmitted and all 24 URLs submitted, 2026-10-29.
- [x] **Search Console, Bing and OpenRush data pulled**; refreshed 2026-10-29 for the table above.
- [x] **Corridor vs rate page cannibalization checked for Pakistan: none.**
- [x] **Video research, four rounds**: 89 SEO reels, then 7 Facebook links and 6 Payoneer YouTube videos,
  then 18 more Facebook reels on 2026-10-29 (reels ids 115 to 132). What the third round changed is in
  the section below. Fourth round, 13 reels on 2026-10-30 (ids 133 to 145; 143 and 144 had no speech):
  classified in KNOWLEDGE.md (tactics 70 to 73, section 3b); its main finding is that FAQ rich results
  ended for every site on 2026-05-07, which changes nothing on the site.
- [x] **Releases are recorded** in `RELEASES.md` with the verification run and the rollback point.

## What the third video batch changed

Ten of the 18 were about SEO; the rest were AI-income pitches, a design-skills list and a "ChatGPT
watermark remover", and are ignored. What survives a sceptical read:

| Idea from the videos | Verdict for this site | Where it lands below |
|---|---|---|
| Rewrite titles on pages with impressions and no clicks, mirroring the top query, then request indexing (two separate reels) | Yes. It is the cheapest lever we have, and the rate pages show the effect is real: titles that match the query sit at 9 to 16 | This week, item 1 |
| Put the exact query in title, meta description, URL, H1 and the first sentence, and nowhere else forced | Mostly already true for titles and H1s. The first sentence of most corridor intros does not contain the query | This week, item 1 |
| Find the questions people ask (People Also Ask, AnswerThePublic), read the top three results, answer better | Yes, and it sharpens the weekly FAQ item: one real question, checked against what currently ranks | Ongoing |
| Record yourself answering a question, use the transcript as the base of the page | Yes, and it replaces the written expert interview: a voice memo is easier for you, and the transcript is your experience in your words, which is what nobody else can copy | Weeks 2 to 3 |
| Backlink gap: see where competitors have links (directories, lists, guest posts) and close it | Yes, with one filter: only places a person would read. We just disavowed 26 link farms; do not add more | Weeks 2 to 3 |
| Competitors' top pages by traffic as content ideas | Yes, as an input to the backlink-gap run | Weeks 2 to 3 |
| Launch where builders look: Show HN, r/SideProject, Product Hunt (Tuesday to Thursday), Indie Hackers, Uneed (a link if voted) | Yes, it replaces the vague "post on Product Hunt" item | Weeks 2 to 3 |
| Localised listings and articles in less competitive languages (a Russian founder doing this across 52 languages) | Supports the Q1 decision on Portuguese and Spanish; does not change it | Q1 2027 |
| AI visibility checker tools | We already have OpenRush for this; no need for an opt-in tool | Weeks 2 to 3 |
| Local citations (Bright Local, Yext) for a Google Business Profile | Not applicable: the site has no local business presence | Decided against |
| Building Reddit karma on unrelated posts so link posts are not banned | No. That is the astroturfing the plan already rules out | Decided against |
| Removing "AI watermarks" from text | No. The claim is dubious, and our humanizer pass exists for readability, not for hiding anything | Decided against |
| Hundreds of short videos a month from an AI "content engine" | No at that scale. Keep the December plan: a few corridor videos with real numbers | December |

## Next

### This week (by 2026-11-05)

1. [~] **Claude:** title, meta description and first-sentence pass on the pages already on page 1, in
   this order: Indonesia, Philippines, Portugal, Bangladesh, then Thailand, Nigeria, Georgia. For each,
   take the top queries from Search Console (page plus query), mirror the most common wording in the
   title, answer the question in the meta description in one sentence, and make sure the query appears
   in the first sentence of the intro. Copy changes, so humanizer first, `updatedDate` bumped, and you
   request indexing for each URL afterwards. Measure at the checkpoint, not before.
   **Shipped in PR #72 (2026-10-29)** for all seven, using Bing query wording because Search Console
   hides almost every query on these pages. Left to do: you request indexing for the seven URLs (not
   done at the 2026-10-29 audit) in Search Console and in Bing URL Submission, and note the date here.
   The measurement clock starts at each URL's recrawl, not at the merge.
   **2026-10-30:** you requested indexing for 3 of the 7; the other 4 on 2026-10-31. Record which URL went
   on which day here, because each page's clock starts at its own recrawl.
2. [x] **You:** apply to the Payoneer affiliate programme (application sent 2026-10-30; awaiting reply). Both rate pages and 7 corridors earn nothing,
   and the rate pages are now linked from every page.
3. [x] **You:** decided 2026-10-30: leave it as is (no minimum modelled). The Georgia question from PR #70: under about $300 the dollar table ranks
   Payoneer first on a model without its possible $15 or $20 minimum fee. Options: leave it (current),
   or model a minimum and let Wise rank first at small amounts.
4. [x] **You:** decided 2026-10-30: leave as is ("warning only" stays live). The Payoneer minimum fee elsewhere: "warning only" (recommended, live) or
   "model it" (now possible with fee components, but ranking-moving).
5. [x] **Claude:** add a calculator usage event in PostHog (`calc_run`, with corridor and amount band).
   **Go-ahead given 2026-10-30; built** (`lib/analytics.ts`, one event per Compare press, amount as a band,
   corridor in the same format as `affiliate_click`). **Shipped in PR #76 (77674a1, 2026-10-30).** Left to
   do: confirm the first real events in PostHog (it sends nothing from an automated browser, so it could
   not be watched in testing). **Confirmed 2026-10-30:** four real `calc_run` events arrived with every
   property (USD to PKR and USD to NGN, amount bands correct).
   Only `$pageview` and `affiliate_click` exist, so there is no way to see whether people use the tool.
   Needs your go-ahead, since it changes analytics.
13. [x] **Claude:** remove the en dash between 3 and 8 in "lose 3 to 8% of every international invoice" on
    `/about/author` (AGENTS.md no-dash rule; found by the 2026-10-29 audit). Humanizer pass, no claim change.
    **Done 2026-10-30** (same PR as item 15).
14. [x] **You:** decided 2026-10-30: ship the weeks 2 to 3 copy when it is ready, including on Bangladesh,
    Nigeria, the Philippines and Indonesia. The PR #72 read for those four becomes a bundle (titles plus new
    copy), recorded as such; Portugal, Thailand and Georgia keep a clean read as long as no copy lands on them.
    **Applied 2026-10-30:** reviewer-approved fact-check batch on Bangladesh, Nigeria and the Philippines (and
    Pakistan, outside PR #72 but inside the PR #70/#71 window): 5 new FAQs, corrected Payoneer timing and
    annual-fee threshold, PH Payoneer cost now 3.6% on our model. Reads for all four are bundles. Five FAQs in
    one release is a deliberate exception to the one-a-week cadence (KNOWLEDGE.md rule 8); the Pakistan USD
    salary FAQ is still open. Owner: request indexing for the four URLs after deploy and note the date per URL.
    Questions came from Trustpilot complaint themes (item 11): PK annual fee, BD document rejection, NG
    withdrawal not arrived, PH Payoneer IDs, PH Wise to GCash.
19. [x] **Claude:** (done 2026-10-30, reviewer-approved; BDT rate page scoped the same way) align the rest of `/rates/payoneer-usd-to-pkr` (intro line "1% on an incoming commercial
    payment", FAQ 1 "1% to receive a commercial payment", cheapest-route FAQ "Its 1% receive fee") with the
    corridor wording "1% (minimum 1 USD) on a client payment into a USD receiving account; marketplace payouts
    vary", through verifier and reviewer. Its Upwork and Fiverr FAQ was corrected 2026-10-30. Effort S.
20. [x] **You:** decided 2026-10-30: model it on both (applied the same day). Payoneer's 1 USD minimum on the 1% receiving fee for Nigeria and the Philippines. Modelled on
    Pakistan and Bangladesh on 2026-10-30 (no order change). On PH it moves PayPal above Payoneer below about
    $13.30; on NG it moves Cleva above Payoneer below about $28, and below about $7 Raenest takes the top spot
    and the best value badge.
16. [x] **You:** Manual actions report checked 2026-10-30: no issues. Disavow file received 2026-10-30 and committed as `docs/seo/disavow.txt` (26 domains,
    prepared 2026-10-26). Of the 29 referring domains on 2026-10-30, only seopxl-ranking-boost-lab.shop (first
    seen 2026-10-28) is not in it; adding it is optional (measurement rule 6). Original item: send Claude the current disavow file so it can be committed as `docs/seo/disavow.txt` (spam
    domain names only). Without it nobody can tell which of the 29 referring domains are already disavowed.
    Also open Search Console's Manual actions report once and note the result here. Effort S.
17. [x] **Claude:** AI-referral baseline from PostHog, read 2026-10-30 ($pageview on paidacross.com, 90 days,
    by referring domain). Three AI referrals: chatgpt.com to `/receive/usd-to-php` (2026-08-23),
    copilot.microsoft.com to `/receive/usd-to-php` (2026-08-25), www.perplexity.ai to `/receive/usd-to-thb`
    (2026-09-17). For scale: $direct 351 pageviews (117 visitors), www.google.com 54 (49). Too few to measure;
    this is the baseline the monthly read (SKILL.md Mode 1, step 7b) compares against. AI apps often send no
    referrer, so the true number is at least three, not three.
18. [x] **You:** confirmed 2026-10-30: default kept. Original item: confirm that we leave Search Console's "Search generative AI control" (documented
    2026-10-21) at its default, so the site stays eligible for AI Overviews and AI Mode. Our visible demand
    is chatbot-style queries. Effort S.

### Weeks 2 to 3 (2026-11-05 to 2026-11-19)

Measurement note (2026-10-29 audit): items 6 and 11 and the weekly FAQ would add copy to Bangladesh,
Nigeria, the Philippines and Indonesia, four of the seven PR #72 pages, inside the PR #72 window, which
breaks KNOWLEDGE.md measurement rule 4. Recommended: record the voice memos now, but hold new body
copy on those four pages until the PR #72 decision read (2026-12-24 at the earliest), and work on
Pakistan, the pillar and the corridors outside PR #72 first. If you would rather ship, record that the
read for those pages is a bundle. **Decided 2026-10-30 (item 14): ship; those pages are read as a bundle.**

15. [x] **Claude:** shorten the titles over 60 characters on the eight zero-impression corridors (MXN, BRL,
    UZS, COP, ZAR, ARS, PLN, UAH) and the ZAR (177) and homepage (164) descriptions. Pakistan's title (63),
    the pillar description (168) and the PKR rate page description (177) wait until after the checkpoint,
    because those pages are inside a measurement window. Humanizer pass.
    **Done 2026-10-30 (REVIEW: SHIP WITH CHANGES, applied):** titles now "Receive USD in {Country}: real
    costs (2026)" (South Africa exactly 60), ZAR description 149, homepage description 157. `updatedDate`
    deliberately NOT bumped: only head metadata changed, the page body did not, and the date feeds the
    visible "Last updated" line, `dateModified` and the sitemap `<lastmod>` (Google uses lastmod only when it
    is "consistently and verifiably" accurate). No further title edits on these 8 before 2026-12-25
    (measurement rule 2). The homepage read for the redesign window is now a bundle with this description
    change (rule 4).

6. [ ] **You + Claude:** expert answers by voice. Claude sends five questions per corridor group (PK and
   BD, NG, PH and ID); you answer each in a 2-minute voice memo; Claude transcribes them (the same
   Supadata pipeline used for these reels) and turns them into a short "from experience" paragraph per
   corridor, through the humanizer and with your approval of every line. This replaces the written
   20-minute interview.
7. [~] **Claude:** backlink gap against Skydo, Statrys and Xflowpay (OpenRush `compare_backlink_gap`), plus
   their top pages by traffic. Output: an outreach list in this repo of places worth a link (fintech
   comparisons, freelancer resource lists, university and community guides), each with how to get
   listed. Directories that exist only to sell links stay off it.
   **Gap run done 2026-10-30** (with exiap.com and monito.com added): 257 gap domains, not usable as an
   outreach list. Its four "earned" rows are the link farms that also link to us, four of five competitor
   lists hit the 1,000-row cap, and the top 60 are mostly scrapers, AI-summary sites, shorteners,
   directories and unrelated or compromised sites. Left to do: pull the linking URLs for ctc.edu.za,
   creditosenusa.com, globalecommerce.org, oppalerts.com, biyapay.com and grokipedia.com and open them by
   hand; build the outreach list from the categories in KNOWLEDGE.md section 3b instead (career offices,
   freelancer communities, regional tech press, journalist requests) as `docs/seo/outreach.md`. Effort M.
   **2026-10-30:** the `outreach-analyst` agent and `outreach` skill now do this weekly (AGENTS.md). First run
   on 2026-10-30; its board is `docs/seo/outreach.md` and its drafts wait for you in `docs/seo/outreach/drafts/`.
8. [~] **You:** launch the calculator where builders look, one per week rather than all at once: Show HN
   ("I priced what freelancers in 17 countries lose getting paid", with the data), r/SideProject,
   Product Hunt on a Tuesday to Thursday, Indie Hackers, Uneed. Claude drafts each post; you post from
   your own account and answer comments. **Drafts done 2026-10-30:** `docs/seo/launch-posts.md` (one post
   per channel, with the rules and the numbers to refresh on the day). Posting is yours.
9. [x] **Claude:** check AI-answer citations with OpenRush (`discover_ai_citations`,
   `inspect_ai_visibility`) for questions like "cost to receive USD in the Philippines" and "Payoneer
   dollar rate in Pakistan today". Note which pages are cited and close the gaps on ours.
   **Done 2026-10-30:** Google AI Overviews cite paidacross 0 times (OpenRush, US; Wise 150,409, Monito 4,144);
   the sources AI cites for PK and NG are YouTube first, then providers' own pages, Facebook and Reddit
   (detail in the outreach run directory and `docs/seo/outreach.md`). Bing is the opposite: 251 citations
   (item 12). Gaps are closed by the December videos, community answers and outreach, all already planned.
10. [ ] **Claude:** pillar section on receiving from clients in several countries (74 impressions at
    about 45) and on tracking international payments (26 at 55).
11. [x] **Claude:** mine competitor reviews (Trustpilot for Payoneer and Wise, from PK, BD, NG and PH
    users) for real complaints, and turn the best into fact-checked FAQs. **Done 2026-10-30:** about 150
    reviews read; five FAQs shipped in PR #77 after verifier and reviewer, plus four live-page corrections.
12. [x] **Claude:** Bing again: pages indexed (12 on 2026-10-25), sitemap read date, and the chatbot-style
    queries, now that the redesign is live. 2026-10-29 audit: crawl issues none, query stats read (53 rows,
    2026-09-11 to 2026-10-23); indexed count and sitemap read date not pulled yet. **You:** also open AI
    Performance in Bing Webmaster Tools and its Topics Portfolio tab (beta since 2026-10-13), which Bing
    shows only when a site has enough data, and note what is there.
    **2026-10-30 read (Bing API):** 12 pages in the index (2026-10-28), 2 inbound links, no crawl errors except
    one 4xx on 2026-10-25. Sitemap `https://paidacross.com/sitemap.xml` was last crawled by Bing on 2026-06-12
    with 6 URLs (the site now has 24); it was resubmitted 2026-10-29 and Bing has not re-read it yet. A second
    sitemap is registered at `https://www.paidacross.com/sitemap.xml` (last crawled 2026-06-13). Bing traffic
    2026-09-07 to 2026-10-27: 1 click, about 90 impressions. AI Performance has no API in our Bing connector;
    you read it in the dashboard (help: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c, which
    says very sparse citation activity may not surface at all, and that is not a penalty).
    **AI Performance export, read 2026-10-30 (owner, CSV), 2026-09-07 to 2026-10-27:** 251 citations in Copilot
    and Bing AI answers. By page: `/receive/usd-to-pkr` 143, `/receive/usd-to-php` 99, the pillar 6,
    `/receive/usd-to-bdt` 2, `/receive/usd-to-ngn` 1; the other 13 corridors 0; the rate pages 0 (published 2026-10-26, two days old, so not a finding). Daily
    citations averaged 2.8 to 2026-10-14 and 11.1 from 2026-10-15 (144 in 13 days). Grounding queries: "receive
    USD payments from US clients to Pakistani bank account" 57 (34% share), "receive USD payments from US
    clients to Pakistan bank account" 29 (26%), "cost of receiving international payments philippines business"
    29 (51%). Compare Google AI Overviews (OpenRush, same day): 0 citations. Bing is where the site is already
    cited; this is the baseline for KNOWLEDGE.md measurement rule 7.

### Ongoing from now

- [ ] **Claude:** a weekly fact-checked FAQ. One real question from Search Console, Bing or People Also
  Ask; read the top three results first and answer what they miss; then verifier, reviewer and
  humanizer. Can be set up as a weekly scheduled task on request. Until the PR #72 decision read
  (2026-12-24 at the earliest), put it on a page outside the seven PR #72 corridors, or record that the
  read for that page is a bundle. First candidate (2026-10-29 audit): a USD salary question on Pakistan,
  from Bing "best way to receive usd salary in pakistan and convert to pkr" (position 2).
- [ ] **You:** one pitch or correction email a day (newsletters, PK and BD tech press, authors still
  quoting Payoneer "up to 2%"), plus two helpful Reddit or Quora answers a week from a branded account
  that says who you are. Never astroturf.
- [ ] **You:** sign up to Qwoted and Featured.com and answer journalist requests on international payments.
- [ ] **You:** from mid-December 2026, if you belong to large public freelancer Discord servers for our
  countries, answer there under the Reddit rules (branded name, say who you are, link only when the page
  answers the exact question). No server of our own: Discord indexes only servers with at least 1,000
  members that are at least eight weeks old. **Claude** checks in January 2027 whether Discord pages appear
  in the SERP for corridor queries (KNOWLEDGE.md tactic 72).
- [ ] **Claude (rotation):** the daily verification job keeps running. When it corrects a fact that the
  pillar, the sender page or a rate page repeats, carry the change there by hand. Check that main
  actually moves, not the trigger's "succeeded" status.
- [ ] **You:** monthly, open Search Console's Manual actions report. Re-upload the disavow list only if
  there is a manual action, or if spam domains grow to the point where one looks likely (Google's test:
  https://support.google.com/webmasters/answer/2648487, "most sites will not need to use this tool").
  Adding the newest link-farm domains is optional and harmless; if you re-upload, upload the whole list,
  because a new upload replaces the old one. Claude lists new referring domains in the first audit of each
  month (SKILL.md Mode 1, step 7a) against `docs/seo/disavow.txt`.

### Checkpoint: 2026-11-30 (moved from 2026-11-23)

Moved by the 2026-10-29 audit: 2026-11-23 is 25 days after PRs #68 to #72 shipped, short of the four
weeks after recrawl that KNOWLEDGE.md measurement rule 3 requires, and Search Console's last two or
three days are preliminary. If a Google ranking or spam update rolls out inside the window, say so and
draw no conclusion.

- [ ] **Claude:** read Search Console again and compare with both baselines above:
  - Did CTR move on the pages from this week's title pass? Preliminary only, and only for URLs recrawled
    by 2026-11-02. Georgia, Nigeria and Thailand had 4 to 6 impressions in 28 days, so expect no readable
    result for them before the decision read (2026-12-24 at the earliest).
  - Have the sender queries moved from the pillar to `/pay-freelancers-internationally`?
  - Do the rate pages hold or improve on 9 to 16? Any cannibalization with the corridor pages? Check
    Bangladesh as well as Pakistan, with dates restricted to after 2026-10-26: over the 90 days to
    2026-10-29 both PKR pages showed for "payoneer exchange rate usd to pkr" (rate page 63, corridor
    71.7), and the BDT corridor showed for Payoneer rate queries (25.5, 32) that its rate page now targets.
  - Did the redesign and the PR #70 ranking change move any position by more than a few places?
- [ ] **Claude:** decide the next rate page, only where Search Console shows the provider and pair
  query (AGENTS.md rule).

### December 2026

- [ ] **Claude:** one linkable data asset, "What freelancers lose getting paid in 17 countries", built
  from `calculate()` and the frozen-rate fixture, so every number is reproducible. This is also the
  thing to pitch in the daily emails and the Show HN post. Build it as the first edition of a dated index
  (KNOWLEDGE.md section 3b): a stated method, the rate date, a downloadable CSV, a "how to cite" line, and
  comparable rows only (`isComparable()`), with unranked rows shown separately and labelled. Every number
  through verifier and reviewer; any "cheapest in country X" claim is ranking-moving and goes to you.
  **You** decide after the first edition whether to repeat it quarterly (next would be 2027-03); each
  edition costs a full verification pass.
- [ ] **You + Claude:** a few 30-second corridor videos ("what $1,000 from a US client becomes in
  pesos") using your voice-memo answers, linking to each page. YouTube is the most-cited source in AI
  answers for this topic (46 citations). A handful done properly, not a daily stream. Open on the
  number, on screen in the first second (the only usable point of reels 134 and 137); it must match the
  page on the day it is posted, and the description links to the page with the rate date.

- [ ] **You + Claude:** every corridor title carries "2026". Decide before 2027-01-01 whether to change the
  year (a title change on all 17 pages, several inside measurement windows) or drop it from titles. Route
  through REVIEW mode either way.
  **Claude's recommendation (2026-10-30), for your decision:** keep a year in the titles and change it to
  2027 in one release in the first week of January, after the PR #72 decision read (about 2026-12-25), not
  before, so that read is not disturbed. A year is honest here because the weekly fact-check keeps each page
  current; dropping it now would be a title change on 17 pages inside their measurement windows for no
  measured gain. Fold in the held Pakistan title (63 characters) in the same release.

### Q1 2027, decisions rather than tasks

- [ ] **You:** whether to build translated pages: Portuguese for Brazil, Spanish for Mexico, Colombia
  and Argentina. The demand is real and the third video batch adds one more example of less competition
  outside English, but each translated page needs the same fact-checking forever.
- [ ] **You:** whether to unlock programmatic pages. The AGENTS.md gate still fails three of four
  conditions: no editorial backlinks, no top-30 rankings at scale, no 8-week impression trend.

## Decided against (and why)

- **Fake Reddit threads seeded with clients' comments**, and **karma-farming accounts** to post links:
  both get accounts banned and contradict the site's honesty positioning.
- **llms.txt.** Google's own AI guidance says it is not needed.
- **Expired domains, bought links, mass AI location pages, link-only directories.** Each is a spam-policy
  risk.
- **Separate pages for every Payoneer PKR keyword variant.** They would cannibalize each other; the
  variants became FAQs on the one rate page.
- **Local citations (Bright Local, Yext).** They are for businesses with a local address and a Google
  Business Profile, which this site does not have.
- **"AI watermark removal" tools.** The humanizer pass is for readable copy, not for disguising anything.
- **A high-volume AI video "content engine".** The bottleneck is trust and accuracy, not volume.
- **Removing FAQPage JSON-LD because Google ended FAQ rich results (2026-05-07).** It matches visible
  text, costs nothing, and removing it is a protected JSON-LD change with nothing to gain.
- **Scholarship pages, paid "resource page" placements, keyword-anchored links in embeddable widgets, and
  bought links on link marketplaces (PressWiz in reel 139).** Link spam under Google's policy.
