# SEO plan for paidacross.com

The working SEO plan: what has shipped, what is next, who does it and when. Tick items here when they
are done, and add the PR number or date, so the next session starts from the truth rather than from
memory. Fact-checking rules for anything that touches page copy live in AGENTS.md and still apply:
verifier, then reviewer, then humanizer, and ranking-moving changes go to the owner.

Last updated: 2026-10-29.

Legend: `[x]` done, `[~]` in progress or partly done, `[ ]` not started. Owner is **You** (site owner)
or **Claude** (a session in this repo).

## Baseline to measure against

Google Search Console, 2026-07-31 to 2026-10-28:

| Metric | Value |
|---|---|
| Clicks | 4 |
| Impressions | 1,570 |
| Average position | 50.5 |
| Pillar `/receive-international-payments` | 1,181 impressions at 63.4, mostly sender-intent queries |
| Country pages on page 1 | Portugal 6.6, Thailand 7.4, Indonesia 8.1, Nigeria 8.6, Georgia 8.7, Philippines 9.1 |
| Closest to page 1 | Bangladesh 11.4 (97 impressions) |
| Country pages with 0 impressions | Mexico, Brazil, Uzbekistan, India, Colombia, South Africa, Argentina, Poland, Ukraine |

Bing Webmaster (2026-09-07 to 2026-10-26): about 100 impressions and 1 click. Many of those queries are
long, chatbot-style questions where the site ranks 1 to 7, which suggests Copilot or ChatGPT search
already reach it through Bing.

Backlinks: 28 referring domains, 26 of them link-farm spam (disavowed). There are no editorial links yet.

The zero-impression country pages are indexed (owner checked India and Brazil in URL inspection on
2026-10-29). The cause is demand, not indexing. English searches for receiving money in India are tiny
(about 40 a month across variants), and Brazil searches in Portuguese ("como receber dinheiro do
exterior", about 1,000 a month).

## Done

### Site changes (shipped to production)

- [x] **New corridors: South Africa, Argentina, Poland.** PR #58, 2026-10-23.
- [x] **Ukraine corridor, and the verification rotation fixed** so it runs in a persistent host session.
  PR #61, 2026-10-26.
- [x] **Rotation is shipping corrections on its own:** #60 (ZAR, THB) and #63 (BDT).
- [x] **First provider rate page, `/rates/payoneer-usd-to-pkr`, and a monetization audit** showing 7 of
  17 corridors have no paying provider. Shipped in PR #62.
- [x] **Pillar split by intent.** `/receive-international-payments` now serves receive intent only:
  53-character title, about 2,000 words, stale claims fixed. PR #62.
- [x] **New sender page, `/pay-freelancers-internationally`**, for the "pay freelancers internationally"
  queries (about 600 impressions a quarter). PR #62.
- [x] **Homepage rebuilt**: its own title, description and canonical, and 117 words grown to about 700.
  PR #62.
- [x] **Shared `CorridorTable`** on the homepage, pillar and sender page, computed by `calculate()`.
  PR #62.
- [x] **Second rate page, `/rates/payoneer-usd-to-bdt`**, plus FAQs on the PKR page for "what exchange
  rate does Payoneer use" and the JazzCash rate. PR #62.
- [x] **Pillar intro answers first.** PR #64.
- [x] **Every corridor page links to the sender page.** PR #64.
- [x] **BDT rotation corrections carried to the pillar and the sender page** (Wise cannot send business
  transfers to BDT). PR #64.
- [x] **Philippines FAQ "Should my client pay me in US dollars or in pesos?"**, from Bing queries. The
  Maya and VAT passages were hedged at the same time. PR #65.
- [x] **Payoneer possible minimum-fee caveat** on PKR, BDT, INR and both rate pages. India's 24 or 48
  hours and its 1% to 4% range are now both shown, and the PKR rate page separates JazzCash withdrawals
  from Request a Payment. PR #65.

### Search engines and tooling

- [x] **Google indexing requested for every URL in the sitemap** (owner, 2026-10-27 to 2026-10-29).
- [x] **Disavow file uploaded** for 26 spam domains (owner, URL-prefix property). `launchintel.pro` and
  `startuptile.com` were kept off it.
- [x] **Bing Webmaster connected.** The sitemap was resubmitted (Bing last read it on 2026-06-12, with 6
  URLs) and all 24 URLs submitted, 2026-10-29.
- [x] **Search Console, Bing and OpenRush data pulled** for the queries, page positions and keyword
  demand recorded above.
- [x] **Corridor vs rate page cannibalization checked for Pakistan: none.** The rate page sits at 9 to
  16 for Payoneer queries and the corridor page at 65 to 67.
- [x] **Video research**: 89 SEO reels and 7 Facebook links analysed, and 6 Payoneer YouTube videos
  transcribed (Supadata through Supabase).

## Next

### This week (by 2026-11-05)

- [ ] **You:** apply to the Payoneer affiliate programme. Both rate pages and 7 corridors currently earn
  nothing.
- [ ] **You:** decide on the Payoneer minimum fee: "warning only" (recommended, already live) or "model
  it". Modelling it moves rankings and needs a new `minFee` field in `CorridorFee`.
- [ ] **Claude:** rewrite titles and meta descriptions on the six page-1 corridors (Portugal, Thailand,
  Indonesia, Nigeria, Georgia, Philippines). They get about 250 impressions and 0 clicks at positions
  6.6 to 9.1. Include Bangladesh (11.4) in the same pass to try to push it onto page 1. These are copy
  changes, so humanizer first, and the rotation sees them on its next pass.
- [ ] **Claude:** add a calculator usage event in PostHog (for example `calc_run`, with corridor and
  amount band). Only pageviews and `affiliate_click` exist today, so there is no way to see whether
  people use the tool.

### Weeks 2 to 3 (2026-11-05 to 2026-11-19)

- [ ] **Claude:** check AI-answer citations with OpenRush (`discover_ai_citations`,
  `inspect_ai_visibility`) for questions like "cost to receive USD in the Philippines". Note which pages
  are cited and close the gaps on ours.
- [ ] **Claude:** run a backlink gap against Skydo, Statrys and Xflowpay (`compare_backlink_gap`) and turn
  it into an outreach list in this repo.
- [ ] **Claude:** add a section to the pillar on receiving from clients in several countries ("how
  freelancers receive payments from multiple countries" gets 74 impressions at about 45) and on tracking
  international payments (26 at 55).
- [ ] **You + Claude:** a 20-minute expert interview. Claude sends questions and your answers become a
  short "from experience" paragraph per corridor. Twenty years in payments is the one thing competitors
  cannot copy.
- [ ] **Claude:** mine competitor reviews (Trustpilot for Payoneer and Wise, from PK, BD, NG and PH
  users) for real complaints and turn the best into fact-checked FAQs.
- [ ] **Claude:** check Bing again: did it read the new sitemap, and how many pages are indexed now
  (12 on 2026-10-25)?

### Ongoing from now

- [ ] **You:** one pitch or correction email a day (newsletters, PK and BD tech press, authors still
  quoting Payoneer "up to 2%"), plus two helpful Reddit or Quora answers a week from a branded account.
  Never astroturf.
- [ ] **You:** sign up to Qwoted and Featured.com and answer journalist requests on international
  payments.
- [ ] **You:** post the calculator on Product Hunt and Indie Hackers.
- [ ] **Claude:** a weekly fact-checked FAQ. Take one real question from Bing or Search Console and add it
  to the matching page through the verifier, the reviewer and the humanizer. Can be set up as a weekly
  scheduled task on request.
- [ ] **Claude (rotation):** the daily verification job keeps running. When it corrects a corridor fact
  that the pillar, the sender page or a rate page repeats, carry the same change there by hand, as on
  2026-10-29.
- [ ] **You:** monthly, re-check Bing and Search Console for new spam domains and re-upload the full
  disavow list if any appear.

### Checkpoint: around 2026-11-23

- [ ] **Claude:** read Search Console again and compare with the baseline above:
  - Have the sender queries moved from the pillar to `/pay-freelancers-internationally`?
  - Did Bangladesh reach page 1?
  - Did CTR on the six page-1 corridors move after the title rewrite?
  - Do the rate pages hold or improve their positions (9 to 16)?
  - Is there any cannibalization between the corridor and rate pages?
- [ ] **Claude:** decide the next rate page, only where Search Console shows the provider and pair
  query (AGENTS.md rule).

### December 2026

- [ ] **Claude:** build one linkable data asset, "What freelancers lose getting paid in 17 countries",
  from the site's own `calculate()` output. Original data is the strongest signal per the reels and
  Google's own guidance.
- [ ] **You + Claude:** 30-second videos per corridor ("what $1,000 from a US client becomes in pesos")
  linking to each page. YouTube is the most-cited source in AI answers for this topic (46 citations).
  Everygen or Hermoso can produce them.

### Q1 2027, decisions rather than tasks

- [ ] **You:** whether to build translated pages: Portuguese for Brazil, Spanish for Mexico, Colombia
  and Argentina. The demand is real but each translated page needs the same fact-checking forever.
- [ ] **You:** whether to unlock programmatic pages. The AGENTS.md gate still fails three of four
  conditions: there are no editorial backlinks, no top-30 rankings at scale and no 8-week impression
  trend. Do not lift it until those hold.

## Decided against (and why)

- **Fake Reddit threads seeded with clients' comments.** It gets accounts banned and contradicts the
  site's honesty positioning.
- **llms.txt.** Google's own AI guidance says it is not needed.
- **Expired domains, bought links, mass AI location pages.** Each is a spam-policy risk. The reels that
  rated them low and the "Mount AI" traffic collapse are the evidence.
- **Separate pages for every Payoneer PKR keyword variant.** They would cannibalize each other, so the
  variants became FAQs on the one rate page instead.
