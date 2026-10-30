---
name: outreach
description: Run the paidacross link-earning and promotion agent. Use to find pages worth contacting (stale fee figures to correct, unlinked mentions, pages AI engines cite, resource and career-office pages, journalist requests), score them, draft one-to-one emails for the owner to send, or track new referring domains and earned links each month. The outreach-analyst agent judges and drafts; this skill is the procedure the orchestrating session follows to gather data, invoke it, and write its output to docs/seo/outreach/.
---

# Outreach: discover, qualify, draft, track

The analyst is `.claude/agents/outreach-analyst.md` (read-only). Its strategy is KNOWLEDGE.md section 3b
and measurement rule 6; its guardrails are in `docs/seo/outreach/research-2026-10-30.md`. You, the
orchestrating session, are the only writer. Nobody here sends, posts or submits anything: the owner sends
every email by hand from their own mailbox.

If the named agent is not loaded (a session that started before the file existed), pass the body of
`.claude/agents/outreach-analyst.md` (without the frontmatter) to a `general-purpose` agent with
`model: opus`, and add "You are read-only: do not create, edit or delete any file" to the prompt.

```bash
RUN=<scratchpad>/outreach-$(date -u +%F)
mkdir -p $RUN
```

## Mode A: discover, qualify, draft (weekly, or on request)

1. **Verified numbers.** Write the figures the agent may quote to `$RUN/numbers.md`: `calculate()` at the
   current or fixture rates for the corridors in play (see `docs/seo/launch-posts.md` for the $1,000 table
   method), with the rate date. Nothing else may be quoted in a draft.
2. **OpenRush inputs** (spend credits deliberately; `compare_backlink_gap` is the expensive one):
   `discover_ai_citations` for two or three category questions in the target markets (location set to the
   country), and `inspect_serp` for the queries in play. Save each result as JSON in `$RUN` with a manifest
   line: tool, arguments, `observed_at`. Reuse files younger than a week.
3. **Journalist requests:** if the owner pasted any, save them to `$RUN/requests.md`.
4. **Invoke `outreach-analyst`** with `$RUN`, today's date and the modes to run (normally DISCOVER, QUALIFY,
   DRAFT). Cap: about 15 candidates and at most 5 drafts per run.
5. **Qualify with data** for rows the agent passed through the gates: `inspect_domain` and
   `inspect_backlinks` (authority, referring_domains) for at most 10 domains, then send the results back to
   the same agent with SendMessage to finish the scores. Skip when the gates already settled it.
6. **Humanizer** over every draft, then check: no em or en dashes, the disclosure line present, the opt-out
   line present, no anchor text suggested, numbers match `$RUN/numbers.md`.
7. **Write**, in one commit:
   - new rows appended to `docs/seo/outreach/log.json` (state `drafted`, `monitor` or `dropped`);
   - each draft to `docs/seo/outreach/drafts/YYYY-MM-DD-<domain>.md`;
   - `docs/seo/outreach.md` regenerated: the board of open rows by state, drafts waiting for the owner,
     follow-ups due.
8. **Report** to the owner: the drafts to send, with the contact route for each, and the rows to monitor.
   When the owner says a draft was sent, set `sent` with the date; when a reply comes, record it.

## Mode B: track (first run of each month)

1. `inspect_backlinks` for paidacross.com, views `referring_domains` (and `status: "new"` with `since` set
   to the last report date), saved to `$RUN/backlinks.json`.
2. Invoke `outreach-analyst` in TRACK mode with `$RUN` and the log. It classifies new domains, re-checks
   every `linked` row (live, `rel`, not noindex) and lists follow-ups due.
3. Write `docs/seo/links/YYYY-MM.md` and update the log states. Count success only as new editorial
   referring domains, judged at 2 to 3 months (measurement rule 6).

## Rules that always hold

- No sending, posting, submitting or buying through any tool, ever. Never call a Hermoso publish, post or
  ads tool, or any email-sending tool, from this skill.
- One follow-up at most, 7 to 10 days after a delivered first email, and only if it adds something new.
- Opt-outs and declines go to `docs/seo/outreach/suppression.txt` at once and are never contacted again.
- Contact routes are URLs (contact page, author page). Never commit personal email addresses.
- A draft that quotes a fee or rule follows AGENTS.md: primary source, rate date, hedge what cannot be
  confirmed. A correction to our own pages found along the way goes through the corridor pipeline, not here.
