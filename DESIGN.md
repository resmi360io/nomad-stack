# Design system: Passbook

Chosen by the owner on 2026-10-29. Tokens live in `app/globals.css` (`:root` and the `pa-*` component
classes); fonts are loaded in `app/layout.tsx`. PRODUCT.md holds product truth; this file holds the look.

## Idea

The site prints what landed, the way a savings passbook or a bank credit advice does. One strong
surface (the oxblood cover) frames the shell and the calculator; everything else is white sheets on a
cool tinted paper, ruled with hairlines, with money set in a monospace face.

## Colour

| Token | Value | Job |
|---|---|---|
| `--cover` | #5b1a27 | Header, footer, calculator frame, primary button |
| `--cover-foreground` / `--cover-muted` | #fbf3f4 / #dcc3c8 | Text on the cover (11.9:1, 7.8:1) |
| `--background` | #f3f5f4 | Page paper |
| `--sheet` | #ffffff | Tables, result list, form page |
| `--foreground` | #17201d | Ink (15.2:1 on paper) |
| `--muted-foreground` | #4b5752 | Secondary text (6.9:1 on paper) |
| `--stamp` / `--stamp-tint` | #4c3d9e / #eeebf8 | Links, focus ring, best value mark and row |
| `--border` / `--rule` | #d3dbd7 / #b8c3be | Hairlines inside sheets / section rules |
| `--input` | #84918b | Form control borders (3.3:1, meets 1.4.11) |

No gradients, no glass, no state colour used as decoration. Best value is the only highlighted row and
it uses the stamp tint, never green. Every CTA in the results uses the same outline button.

## Type

- Schibsted Grotesk (variable) for all words. Spline Sans Mono (variable) only for money and counts
  (`.pa-figure`). Large single figures use the text face (`.pa-figure-display`), because mono
  punctuation is a full cell wide.
- Scale: `.pa-h1` 28 to 44px fluid, `.pa-h2` 21 to 26px, `.pa-h3` 18px, body 16px, prose and intros 17px
  at 1.7, meta 13px. Sentence case, no uppercase eyebrows.
- Measure: prose and intros 65ch; `.pa-read` column 44rem; `.pa-shell` 72rem.

## Shape and space

Radius 4px (`--radius: 0.25rem`), 3px inside the cover frame. 1px borders. One shadow, under the
calculator cover only. Sections separate by 48 to 64px; more space above a heading than below it.

## Components

- `.pa-sheet`, `.pa-note`, `.pa-table-wrap`: white sheet, tinted note, scrolling table sheet.
- Calculator: cover frame, white form page, rate source printed on the cover under it.
- Results: one sheet, an entry per provider: rank, name, best value stamp, fee / rate margin / all-in,
  caveat, verification line, credited amount large on the right, outline CTA with AD mark.
- Corridor pages: "On this page" list from the h2s (sticky sidebar at xl, `<details>` below), placed
  after the article in source order.
- Controls are 44px tall or more. Focus is a 2px stamp outline.

## Rules that protect SEO and the money

Design changes are classes, wrappers and ids. Never change copy, headings, link text or hrefs,
metadata, JSON-LD, `calculate()`, provider data, affiliate `rel` values or analytics calls in a design
pass. Verify with the rendered-HTML diff recipe used on 2026-10-29 (titles, meta, canonical, JSON-LD,
headings, links and main text per sitemap URL, before and after).
