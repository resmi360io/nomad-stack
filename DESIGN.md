# Design system: Passbook (iteration 2, ledger)

Chosen by the owner on 2026-10-29. Tokens live in `app/globals.css` (`:root` and the `pa-*` component
classes); fonts are loaded in `app/layout.tsx`. PRODUCT.md holds product truth; this file holds the look.

## Idea

Iteration 2 (2026-10-29) keeps the passbook idea but moves it out of the chrome and into the numbers:
a light, quiet shell, one raised card for the calculator, and results set like a statement, where the
amount received is the largest thing on the screen and every cost behind it is labelled.

## Colour

| Token | Value | Job |
|---|---|---|
| `--background` | #f5f6f4 | Page paper |
| `--sheet` | #ffffff | Cards, tables, header |
| `--foreground` | #141a19 | Ink (16.3:1 on paper) |
| `--muted-foreground` | #525d5a | Secondary text (6.3:1 on paper) |
| `--primary` (= `--stamp`) | #6b1f2e | Oxblood: primary button, links, best value badge (10.4:1) |
| `--accent` / `--stamp-tint` | #f7eef0 | Best value row |
| `--positive` / tint | #1f6a49 / #e8f3ed | "Fees verified" status, live-rate dot |
| `--caution` / tint / border | #7a4f00 / #fbf3e0 / #ecd9a8 | Estimates, personal remittance notices |
| `--border` / `--rule` | #e1e5e2 / #c7cfcb | Hairlines / section rules |
| `--input` | #8a9692 | Control borders (3.06:1) |
| `--cover` | #141a19 | Footer only |

Oxblood is the only brand colour. Green and amber appear only where they mean verified or estimated.

## Type

- Schibsted Grotesk (variable) for everything, including figures (`.pa-figure`: lining, proportional;
  its tabular figures widen punctuation, so they are not used).
- `.pa-h1` 26 to 42px fluid, `.pa-h2` 21 to 26px, `.pa-h3` 18px, prose and intros 16 to 17px at 1.68,
  meta 13px. Sentence case, no eyebrows.
- Long single-string prose from `data/` is split into paragraphs at sentence boundaries by
  `lib/paragraphs.ts`; the words are unchanged.

## Shape and space

Radius 6px (`--radius: 0.375rem`), 10px on `.pa-card`. 1px borders. One shadow, on `.pa-card` only.

## Components

- Header: white, 56px, one row at every width; monogram drawn with CSS so the link name stays "Paid Across".
- Calculator (`.pa-card`): 48px controls, labels 13px semibold, full-width button on phones, inline
  amount validation, live-rate line with a green dot once rates load.
- Result cards: rank, provider, best value badge; "You receive" figure at 28px; a three-cell strip of
  transfer fee, FX margin and total cost (amount and %); amber notice for personal remittance pricing;
  status footer (verified green or estimated amber) with the same outline CTA on every row.
- Corridor pages: key facts strip (top of the table at $1,000, total cost, options priced), section list,
  comparison table led by Net received and Total cost, related guides as a two-column grid.

## Rules that protect SEO and the money

Design changes are classes, wrappers and ids. Never change copy, headings, link text or hrefs,
metadata, JSON-LD, `calculate()`, provider data, affiliate `rel` values or analytics calls in a design
pass. Verify with the rendered-HTML diff recipe used on 2026-10-29 (titles, meta, canonical, JSON-LD,
headings, links and main text per sitemap URL, before and after).
