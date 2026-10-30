# Launch posts: drafts and where to post them

Drafted 2026-10-30 for SEO_PLAN item 8. You post from your own accounts and answer the comments yourself;
nothing here is posted automatically. One channel per week, not all at once, so you can actually be in
each thread.

## Before every post

0. **Check the personal lines are true for you.** The backstory is taken from your `/about/author` page
   (the spreadsheet, "3 to 8% of every international invoice"). Change anything that is not how you would
   say it; these are your accounts and your voice.

1. **Refresh the numbers on the day.** Every figure below was computed by `calculate()` at the
   2026-10-29 rate fixture. Rates move. Ask Claude to re-run `tests/snapshot-quotes.ts`-style numbers
   against live rates the morning you post, and change the figures if they moved.
2. **Say who you are and how you earn.** The site earns from Wise (Partnerize) and a GrabrFi referral
   link, and says so on `/how-we-make-money`. Say it in the post before anyone asks. Several of the
   routes the site recommends (Payoneer for Pakistan and Bangladesh; Cleva, Grey, LemFi and Raenest for
   Nigeria) pay nothing.
3. **Never ask anyone to upvote or comment**, on any of these sites. HN's guidelines say so explicitly,
   and Product Hunt and Reddit penalise it.
4. **Link to the page that answers the thread**, not always the homepage.

## The numbers you can use (2026-10-29 rates, $1,000 payment, ranked routes only)

| Corridor | Cheapest ranked route | Dearest ranked route | Gap on $1,000 |
|---|---|---|---|
| Brazil | Higlobe 0.20% | PayPal 9.69% | $95 |
| Portugal (EUR) | Revolut 0.30% | PayPal 7.77% | $75 |
| Poland | Wise 0.47% | PayPal 7.77% | $73 |
| Colombia | Wise 1.54% | PayPal 8.74% | $72 |
| Philippines | Wise 0.65% | PayPal 7.77% | $71 |
| India | Wise 0.52% | PayPal 7.30% | $68 |
| South Africa | Wise 0.74% (margin estimated) | PayPal 7.30% | $66 |
| Thailand | Wise 0.77% | PayPal 7.30% | $65 |
| Mexico | Western Union 1.99% | PayPal 7.77% (estimated) | $58 |
| Argentina | Payoneer 2.98% (estimated) | PayPal 8.74% | $58 |
| Georgia | Wise 1.47% | Bank wire 6.88% (estimated) | $54 |
| Nigeria | Raenest 0.27% | Bank wire 5.43% (estimated) | $52 |

The safe headline: **"In 13 of the 17 countries, the cheapest and dearest way to receive a $1,000 client
payment differ by $50 to $95."** (The 13th is Indonesia, $71, where Wise's margin is estimated.) Pakistan,
Bangladesh, Uzbekistan and Ukraine have fewer ranked routes and smaller gaps, so leave them out of a
headline. Where a row says "estimated", say so if you quote it.

---

## Week 1: Show HN (Hacker News)

**Where:** https://news.ycombinator.com/submit. Title must start with "Show HN:". Link to the homepage
(the calculator is on it, no signup, which HN asks for).

**When:** a weekday morning US Eastern, Tuesday to Thursday. Be at the keyboard for the first three hours.

**Rules that matter** (https://news.ycombinator.com/showhn.html, read 2026-10-30): it must be something
people can try without a signup; it must be something you made and are around to discuss; "Don't post
quickly-generated one-offs"; no asking friends to upvote. So the post says plainly how it was built and
why it is not a one-off: a fee model per provider and corridor, and a fact-checking process behind every
number.

**Title:**
> Show HN: What a $1,000 client payment really becomes in 17 countries

**Text (first comment, posted right after submitting):**
> It started as a personal spreadsheet. I watched colleagues and friends (developers, designers,
> consultants) lose 3 to 8% of every international invoice to fees and FX spread without knowing where it
> went. Most "cheapest way to get paid" pages compare the advertised fee and ignore the exchange-rate
> margin, which is usually the bigger cost.
>
> The calculator prices each route from the provider's published schedule: fixed fees, percentage fees,
> caps and tiers, plus the margin against the live mid-market rate. A route is only ranked when it is
> comparable. If it might not exist, only works as a family remittance, or has a charge we can't price,
> it's shown separately with the reason, not in the ranking.
>
> At yesterday's rates the cheapest and dearest way to receive $1,000 differ by $50 to $95 in 13 of the
> 17 countries. Brazil is the widest.
>
> Every fee claim goes through a research pass, a separate verification pass and a reviewer before it
> ships, and a weekly job re-checks each corridor. It still gets things wrong, so corrections with a
> source are the most useful thing you can send me.
>
> How it earns: Wise pays an affiliate commission and GrabrFi a referral bonus. Both are labelled, and
> neither can change the ranking. Several of the routes it recommends pay nothing.
>
> Stack: Next.js, a TypeScript fee engine with tests, rates from open.er-api.com.

**Expect:** questions about rate sources, why provider X is missing, and whether the affiliate links bias
it. Answer with the method, not adjectives.

## Week 2: r/SideProject (Reddit)

**Where:** https://www.reddit.com/r/SideProject/. Read the sidebar rules on the day; they change.
Post from an account that has some history, under your own name or a branded username, and say it is
yours.

**Title:**
> I built a calculator that shows what freelancers in 17 countries actually lose getting paid from abroad

**Body:**
> Background: I watched colleagues and friends lose 3 to 8% of every international invoice to fees and FX
> spread. People compare payment apps by the advertised fee, but the bigger cost is usually the
> exchange-rate margin, which nobody shows next to the fee.
>
> So I priced it. For each country the calculator takes a payment amount and shows what lands in your
> account with each provider, after fees and after the margin against the mid-market rate. On $1,000 the
> gap between the cheapest and dearest option is $50 to $95 in 13 of the 17 countries (at
> [date] rates).
>
> The hard part was not the calculator. It was keeping the fee data right. Every number goes through a
> research pass and two separate checks, and I still find errors every week.
>
> It's free with no signup. Two providers pay me if you sign up through my link (Wise and GrabrFi). That's
> disclosed on the site and doesn't affect the order.
>
> I'd love feedback on two things: is the result table clear on a phone, and which country should I add
> next?
>
> [link]

## Week 3: Indie Hackers

**Where:** https://www.indiehackers.com. Create the product page first, then post in the main feed.
Indie Hackers readers want the story and the numbers behind the business, not the pitch.

**Title:**
> Building a fee-comparison site where accuracy is the whole product

**Body:**
> Paid Across shows freelancers what receiving a USD payment really costs in 17 countries. It's live,
> free, and earns a little from two disclosed affiliate links.
>
> What I didn't expect: the calculator is the easy part. The fee data takes all the time. Each new country
> page goes through research, a draft, a verification pass and a reviewer. The verifier still finds
> roughly 7 to 9 real errors per new country in a draft that felt finished.
>
> Where it is now: about 50 Google visits in the last 90 days, a few Bing ones, and three visits from AI
> assistants. Small. The bet is that being right about fees compounds over time, the way a fast content
> site's traffic doesn't.
>
> Happy to share the fee model or the verification process if that's useful to anyone building in a
> niche where the data goes stale.

(Update the traffic numbers on the day. They are from PostHog, 2026-10-30.)

## Week 4: Product Hunt

**Where:** https://www.producthunt.com/posts/new. You need a maker account. Launches run on a Pacific-time
day starting 00:01 PT; schedule it for a Tuesday to Thursday and be available all that day.

**Name:** Paid Across

**Tagline (60 characters max):**
> See what a client payment really becomes in your country

**Description:**
> Freelancers compare payment apps by the advertised fee, but the exchange-rate margin is often the
> bigger cost. Paid Across prices both for 17 countries and shows what actually lands in your account,
> ranked only where the routes are comparable. Free, no signup. Every fee is fact-checked.

**First comment (maker):** reuse the HN text, shortened, including the affiliate disclosure.

**Gallery:** three screenshots at phone width: the calculator with a result, one corridor page's key
facts, and the "shown separately, not ranked" group. Claude can take them with the browser-screenshots
skill.

Do not buy upvotes, "launch packages" or hunter services.

## Week 5: Uneed

**Where:** https://www.uneed.best. Submit to the free queue.

**Do not pay to skip the line.** A paid placement that comes with a followed link is the kind of paid link
the knowledge base rejects (KNOWLEDGE.md, Rejected list: buying links). If the listing's link turns out
to be nofollow, a paid skip is just advertising and the decision is yours, but it is not an SEO tactic.

**Tagline and description:** reuse the Product Hunt text.

---

## Where else, and where not

- **Freelancer communities in the 17 countries** (r/PakistaniTech, r/phinvest, r/Nigeria, r/freelance,
  r/Upwork, Facebook freelancer groups): do not post a launch there. Answer real questions there under the
  community rules in KNOWLEDGE.md (tactic 53): branded account, say who you are, link only when the page
  answers the exact question. Most of these subreddits remove self-promotion.
- **Facebook and YouTube** are the most-cited sources in AI answers for these questions in Pakistan and
  Nigeria (OpenRush, 2026-10-30). That is the December videos, not a launch post.
- **Not:** link directories that charge for a listing, "submit your startup to 100 directories" services,
  or any launch site that sells a followed link.
