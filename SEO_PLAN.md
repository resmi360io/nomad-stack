# SEO plan for paidacross.com

The working SEO plan: what has shipped, what is next, who does it and when. Tick items here when they
are done, and add the PR number or date, so the next session starts from the truth rather than from
memory. Fact-checking rules for anything that touches page copy live in AGENTS.md and still apply:
verifier, then reviewer, then humanizer, and ranking-moving changes go to the owner.

Last updated: 2026-10-29 (second revision, after PR #71 and the third video batch).

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
picture is thin. Do not change pages in response to one month of this.

Bing Webmaster (2026-09-07 to 2026-10-26): about 100 impressions and 1 click, many from long,
chatbot-style questions where the site ranks 1 to 7. Crawl issues reported on 2026-10-29: none.

Backlinks: 28 referring domains, 26 of them link-farm spam (disavowed). There are no editorial links yet.

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
- [x] **Video research, three rounds**: 89 SEO reels, then 7 Facebook links and 6 Payoneer YouTube videos,
  then 18 more Facebook reels on 2026-10-29 (reels ids 115 to 132). What the third round changed is in
  the section below.
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
   hides almost every query on these pages. Left to do: you request indexing for the seven URLs.
2. [ ] **You:** apply to the Payoneer affiliate programme. Both rate pages and 7 corridors earn nothing,
   and the rate pages are now linked from every page.
3. [ ] **You:** decide the Payoneer Georgia question from PR #70: under about $300 the dollar table ranks
   Payoneer first on a model without its possible $15 or $20 minimum fee. Options: leave it (current),
   or model a minimum and let Wise rank first at small amounts.
4. [ ] **You:** decide on the Payoneer minimum fee elsewhere: "warning only" (recommended, live) or
   "model it" (now possible with fee components, but ranking-moving).
5. [ ] **Claude:** add a calculator usage event in PostHog (`calc_run`, with corridor and amount band).
   Only `$pageview` and `affiliate_click` exist, so there is no way to see whether people use the tool.
   Needs your go-ahead, since it changes analytics.

### Weeks 2 to 3 (2026-11-05 to 2026-11-19)

6. [ ] **You + Claude:** expert answers by voice. Claude sends five questions per corridor group (PK and
   BD, NG, PH and ID); you answer each in a 2-minute voice memo; Claude transcribes them (the same
   Supadata pipeline used for these reels) and turns them into a short "from experience" paragraph per
   corridor, through the humanizer and with your approval of every line. This replaces the written
   20-minute interview.
7. [ ] **Claude:** backlink gap against Skydo, Statrys and Xflowpay (OpenRush `compare_backlink_gap`), plus
   their top pages by traffic. Output: an outreach list in this repo of places worth a link (fintech
   comparisons, freelancer resource lists, university and community guides), each with how to get
   listed. Directories that exist only to sell links stay off it.
8. [ ] **You:** launch the calculator where builders look, one per week rather than all at once: Show HN
   ("I priced what freelancers in 17 countries lose getting paid", with the data), r/SideProject,
   Product Hunt on a Tuesday to Thursday, Indie Hackers, Uneed. Claude drafts each post; you post from
   your own account and answer comments.
9. [ ] **Claude:** check AI-answer citations with OpenRush (`discover_ai_citations`,
   `inspect_ai_visibility`) for questions like "cost to receive USD in the Philippines" and "Payoneer
   dollar rate in Pakistan today". Note which pages are cited and close the gaps on ours.
10. [ ] **Claude:** pillar section on receiving from clients in several countries (74 impressions at
    about 45) and on tracking international payments (26 at 55).
11. [ ] **Claude:** mine competitor reviews (Trustpilot for Payoneer and Wise, from PK, BD, NG and PH
    users) for real complaints, and turn the best into fact-checked FAQs.
12. [ ] **Claude:** Bing again: pages indexed (12 on 2026-10-25), sitemap read date, and the chatbot-style
    queries, now that the redesign is live.

### Ongoing from now

- [ ] **Claude:** a weekly fact-checked FAQ. One real question from Search Console, Bing or People Also
  Ask; read the top three results first and answer what they miss; then verifier, reviewer and
  humanizer. Can be set up as a weekly scheduled task on request.
- [ ] **You:** one pitch or correction email a day (newsletters, PK and BD tech press, authors still
  quoting Payoneer "up to 2%"), plus two helpful Reddit or Quora answers a week from a branded account
  that says who you are. Never astroturf.
- [ ] **You:** sign up to Qwoted and Featured.com and answer journalist requests on international payments.
- [ ] **Claude (rotation):** the daily verification job keeps running. When it corrects a fact that the
  pillar, the sender page or a rate page repeats, carry the change there by hand. Check that main
  actually moves, not the trigger's "succeeded" status.
- [ ] **You:** monthly, re-check Bing and Search Console for new spam domains and re-upload the full
  disavow list if any appear.

### Checkpoint: around 2026-11-23

- [ ] **Claude:** read Search Console again and compare with both baselines above:
  - Did CTR move on the pages from this week's title pass?
  - Have the sender queries moved from the pillar to `/pay-freelancers-internationally`?
  - Do the rate pages hold or improve on 9 to 16? Any cannibalization with the corridor pages?
  - Did the redesign and the PR #70 ranking change move any position by more than a few places?
- [ ] **Claude:** decide the next rate page, only where Search Console shows the provider and pair
  query (AGENTS.md rule).

### December 2026

- [ ] **Claude:** one linkable data asset, "What freelancers lose getting paid in 17 countries", built
  from `calculate()` and the frozen-rate fixture, so every number is reproducible. This is also the
  thing to pitch in the daily emails and the Show HN post.
- [ ] **You + Claude:** a few 30-second corridor videos ("what $1,000 from a US client becomes in
  pesos") using your voice-memo answers, linking to each page. YouTube is the most-cited source in AI
  answers for this topic (46 citations). A handful done properly, not a daily stream.

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
