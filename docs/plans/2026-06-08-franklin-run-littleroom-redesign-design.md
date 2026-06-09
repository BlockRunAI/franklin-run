# franklin.run — Little Room–grade redesign

**Date:** 2026-06-08
**Status:** Validated, ready for implementation
**Scope:** Bold redesign, staying on the light/cream editorial base, adding a banknote signature motif.

## Context

Three reference sites were reviewed: [littleroom.co](https://littleroom.co), [m0.org](https://www.m0.org), [catena.com](https://catena.com). All three are built by the **Little Room** design studio and share one design language. Catena ("a governance and banking platform for AI agents") is a direct competitor to Franklin ("the AI agent with a wallet").

Shared Little Room language:
- Editorial serif display headlines, one word emphasized.
- A signature visual motif per site (M0: red technical line-grids; Catena: vibrant color-spectrum "equalizer" bar in hero).
- Numbered feature cards (01/02/03) with crisp hairline dividers + small-caps eyebrows.
- Dramatic light/dark section rhythm (big dark bands alternating with light).
- Generous whitespace.

franklin.run already shares the editorial-serif DNA (serif headlines with italic accent words, warm cream palette, eyebrows, terminal mockup) and a deep banknote-themed design system in `globals.css`:
- Tokens: `--gold #c9a227` (banknote gold), `--paper`, `--bill-green #1a4d3a`, `--accent` petrol-ink, `--gold-line`.
- Motif classes already present: `feat-numeral` (numbered cards), `dark-section` (dark bands), `stamp-402` (402 Payment Required stamp), `bill`, `ledger`, `signal-card`.

There is uncommitted WIP (foundational, NOT conflicting): TrustBar / TerminalSection / ClosingCTA made locale-aware (new dict fields `trustBar`, `terminalDemo`, `closing` across all 13 locales + `types.ts`), plus ~709 lines added to `globals.css`. **Preserve and build on this WIP.**

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Ambition | Bold redesign |
| Direction | Keep light/cream editorial base (no shift to dark like Catena) |
| Signature motif | **Guilloché banknote engraving** — engine-turned spirograph security line-patterns, gold-line on cream, drawn as SVG |

Palette stays: cream + banknote gold (`--gold`) + petrol-ink / bill-green for dark bands.

## The four moves

1. **Signature motif** — a reusable `<Guilloche />` SVG component (gold-line on cream). Debuts as a faint hero backdrop; recurs as section dividers (`.guilloche-rule`), card corner flourishes, dark-band watermarks, and behind the 402 stamp.
2. **Dramatic section rhythm** — use the existing `dark-section` + `bill-green`/petrol-ink tokens for 3 full-bleed dark bands, creating an M0-style light→dark→light pulse.
3. **Numbered feature cards (01–04)** — formalize the Little Room numbered-card pattern on the Features section using the existing `feat-numeral`, crisp hairline dividers, alternating text/visual, small-caps eyebrows.
4. **More breathing room** — bump `--section-y`, widen gutters, fewer elements per viewport, especially in the dense table/ledger middle.

## Section-by-section plan

Current order: Hero → TrustBar → TerminalSection → FeaturesSection → GettingStartedSection → CompareSection → OpenSourceSection → BlogSection → FAQSection → ClosingCTA → Footer.

| Section | Change |
|---------|--------|
| **Hero** | Faint gold guilloché SVG behind the serif headline; thin `.guilloche-rule` beneath "with a *wallet*."; tightened CTAs (install + docs). Motif debut. |
| **TrustBar** | Keep "Built on … 60+ frontier models" logo strip (new WIP dict). Add hairline borders top+bottom; more eyebrow tracking. |
| **TerminalSection** ("Five runs. Five receipts.") | Promote to first full-bleed **dark band** with faint guilloché watermark. First dramatic pulse. |
| **FeaturesSection** ("What a wallet *changes*") | Centerpiece. Convert 4 chapters into numbered cards (01–04): `feat-numeral`, hairline dividers, alternating text/visual, small-caps eyebrows. |
| **GettingStarted + Compare** | Tighten to breathe. Compare ("In a table, *to plain*") gets the second **dark band**. |
| **OpenSource / Blog** | Spacing + divider polish. |
| **FAQSection** ("Questions, *answered*") | Guilloché corner flourishes. |
| **ClosingCTA** ("Run an Economic Agent") | Full-bleed dark finale (bill-green) with bold guilloché watermark + install CTA. Strongest dark moment (mirrors Catena's close). |
| **Footer** | Spacing polish only. |

**Net rhythm:** Hero(light) → Trust → Terminal(**dark**) → Features(light, numbered) → Getting Started → Compare(**dark**) → OpenSource → Blog → FAQ → Closing(**dark**).

## Global / shared work

- `<Guilloche />` reusable SVG component (props: variant, opacity, color).
- `.guilloche-rule` divider utility.
- Formalized numbered-card CSS.
- `--section-y` bump + gutter widening.

## i18n constraints

- Never hardcode user-facing English. All new copy goes into `src/lib/home/<locale>.ts` (13 locales) and consumed via the `dict` prop. Update `types.ts` first.
- RTL locales (`ar`, `ur`, `fa`) must keep `dir` flipping correctly; guilloché/dividers must not break under RTL.

## Verification

- `npm run check` (lint + typecheck + build) must pass.
- Visual QA via `/browse` at desktop + mobile + one RTL locale.
- Spot-check 2-3 non-English locales for layout integrity.
- Deploy is manual: `npm run deploy` (Cloud Run, NOT Vercel) — only after review.

## Process note

Per project CLAUDE.md: agent teammates work in their own worktree branches; orchestrator merges at the end.
