# franklin.run Little Room Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Raise franklin.run to Little Room–grade polish (à la m0.org / catena.com) while staying on the light/cream editorial base, by adding a guilloché banknote signature motif, dramatic light/dark section rhythm, and refined numbered feature cards.

**Architecture:** Pure presentational change. One new reusable React component (`<Guilloche />`, an SVG), one new CSS divider utility (`.guilloche-rule`), reuse of existing tokens (`--gold`, `--bill-green`, `--accent`) and existing motif classes (`feat-numeral`, `dark-section`, `stamp-402`). All copy stays in `src/lib/home/<locale>.ts`; no hardcoded English. No new dependencies.

**Tech Stack:** Next.js 16 (App Router, React 19, TS strict), Tailwind v4 + custom CSS in `src/app/globals.css`, Instrument Serif / IBM Plex.

**Design doc:** `docs/plans/2026-06-08-franklin-run-littleroom-redesign-design.md` (on master).

---

## Working agreements

- **Worktree:** `.worktrees/redesign-littleroom` on branch `feat/littleroom-redesign`.
- **"Test" = verify**, since this is visual: after each task run `npm run typecheck`, then screenshot via the browse binary at `~/.claude/skills/gstack/browse/dist/browse` against `http://localhost:3000` (run `npm run dev` in the worktree on port 3000) and Read the PNG. Commit only after both pass.
- **No hardcoded user-facing English.** Any new string → add the field to `src/lib/home/types.ts`, then to all 13 locale files (`en, zh-CN, ja, ko, ru, id, ar, hi, ur, pt-BR, vi, tr, fa`), consume via `dict`.
- **RTL:** verify `ar` (or `ur`/`fa`) doesn't break under the motif/dividers.
- **Commit frequently** — one commit per task.
- **No deploy** until the user reviews. `npm run deploy` is manual and ships to Cloud Run.

---

### Task 0: Start dev server (one-time, background)

**Step 1:** In the worktree, start dev on port 3000:

```bash
cd .worktrees/redesign-littleroom && npm run dev
```

Run it in the background. Confirm `http://localhost:3000` shows the Franklin homepage (title "Franklin Agent — the AI agent with a wallet"). Capture a baseline screenshot to `/tmp/fr-baseline.png` and Read it.

---

### Task 1: `<Guilloche />` component + base CSS

**Files:**
- Create: `src/components/Guilloche.tsx`
- Modify: `src/app/globals.css` (append a `/* === Guilloché motif === */` block)

**Step 1: Create the component.** An SVG that draws engine-turned (spirograph/Lissajous) line patterns with `stroke: var(--gold-line)`. Props: `variant?: "rosette" | "wave" | "panel"`, `className?: string`, `opacity?: number`. Use deterministic math (no `Math.random`) to generate path `d` strings so SSR output is stable. Keep it `aria-hidden`, `pointer-events: none`, `preserveAspectRatio` set so it scales as a backdrop.

Representative shape:

```tsx
interface GuillocheProps {
  variant?: "rosette" | "wave" | "panel";
  className?: string;
  opacity?: number;
}

export function Guilloche({ variant = "rosette", className, opacity = 1 }: GuillocheProps) {
  // build path strings deterministically from variant params
  return (
    <svg
      aria-hidden
      className={className}
      style={{ opacity }}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* <path stroke="var(--gold-line)" strokeWidth={0.6} d={...} /> ... */}
    </svg>
  );
}
```

**Step 2:** Add CSS for the divider utility and a backdrop helper:

```css
/* === Guilloché motif === */
.guilloche-rule {
  height: 14px;
  background-repeat: repeat-x;
  background-position: center;
  /* inline SVG wave in --gold-line; or a bordered hairline fallback */
  opacity: 0.6;
}
.guilloche-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.guilloche-bg > svg { width: 100%; height: 100%; }
```

**Step 3:** `npm run typecheck` → PASS. (No visual yet; component unused.)

**Step 4: Commit.**

```bash
git add src/components/Guilloche.tsx src/app/globals.css
git commit -m "feat(home): add Guilloche SVG motif component + divider utility"
```

---

### Task 2: Hero — guilloché backdrop + rule

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/app/globals.css` (`.hero`, `.hero-backdrop`)

**Step 1:** Render `<Guilloche variant="rosette" />` inside a `.guilloche-bg` wrapper behind the headline, faint (`opacity ~0.12`), layered under the existing `.hero-backdrop` portrait. Ensure headline/CTAs sit at `z-index: 1`.

**Step 2:** Add a `.guilloche-rule` divider directly beneath the headline block (under "with a *wallet*.").

**Step 3:** `npm run typecheck` → PASS. Screenshot hero to `/tmp/fr-hero.png`, Read it. Confirm: gold spirograph visible but subtle, headline legible, no layout shift, CTAs intact.

**Step 4: Commit** `feat(home): guilloché hero backdrop + rule`.

---

### Task 3: Global section rhythm (whitespace)

**Files:** Modify `src/app/globals.css` (`:root` `--section-y`, `--site-gutter`, and the responsive `@media` override near line ~6615).

**Step 1:** Increase `--section-y` (e.g. 112px → 128px) and `--section-y-compact` proportionally; widen `--site-gutter` max slightly. Keep mobile values sane.

**Step 2:** `npm run typecheck` → PASS. Full-page screenshot `/tmp/fr-rhythm.png`, Read it. Confirm more breathing room, nothing overlapping.

**Step 3: Commit** `style(home): more generous section spacing`.

---

### Task 4: TrustBar polish

**Files:** Modify `src/components/TrustBar.tsx`, `src/app/globals.css` (`.trust-bar`).

**Step 1:** Add hairline `border-top`/`border-bottom` (`var(--border)`), increase eyebrow letter-spacing, center logo strip with even gaps. Uses existing WIP dict fields (`dict.trustBar`). No new strings.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-trust.png`, Read. **Commit** `style(home): trust bar hairline framing`.

---

### Task 5: TerminalSection → first dark band + watermark

**Files:** Modify `src/components/TerminalSection.tsx`, `src/app/globals.css` (`.term-section`).

**Step 1:** Give the section the `dark-section` treatment (full-bleed dark bg via existing token; check existing `.dark-section` rules). Add a faint `<Guilloche variant="wave" />` watermark behind the terminal (`opacity ~0.08`, gold-line reads on dark). Keep eyebrow/title from `dict.terminalDemo`.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-term.png`, Read. Confirm dark band reads as a deliberate pulse, terminal legible, watermark subtle.

**Step 3: Commit** `feat(home): terminal section as dark band with guilloché watermark`.

---

### Task 6: FeaturesSection numbered-card polish

**Files:** Modify `src/app/globals.css` (`.feat-block`, `.feat-numeral`, `.feat-label`, dividers). Component already renders numbered cards (01–04) — likely no TSX change.

**Step 1:** Add a crisp hairline divider (`border-top: 1px solid var(--border)`) above each `.feat-block` (except first), tune `.feat-numeral` to the Little Room look (large, gold, tabular), tighten `.feat-label` small-caps tracking. Optional: tiny guilloché corner flourish on each `.feat-visual` card via `::before`.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-features.png`, Read. Confirm 01–04 read as a crisp numbered sequence with dividers.

**Step 3: Commit** `style(home): refine numbered feature cards`.

---

### Task 7: GettingStarted breathing room

**Files:** Modify `src/components/GettingStartedSection.tsx` and/or `src/app/globals.css` (`.steps`, `.slash-wrap`).

**Step 1:** Reduce density: increase spacing between steps, ensure it reads as light/airy between the two dark bands. No new strings.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-getstarted.png`, Read. **Commit** `style(home): airier getting-started`.

---

### Task 8: CompareSection → second dark band

**Files:** Modify `src/components/CompareSection.tsx`, `src/app/globals.css` (`.compare`, `.compare-wrap`).

**Step 1:** Apply `dark-section` treatment so the comparison table sits in the second dramatic pulse. Ensure table contrast (text, borders, label cells) works on dark — adjust `.compare tbody td.label` etc. Add a faint guilloché edge if it helps frame it.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-compare.png`, Read. Confirm table fully legible on dark, no contrast failures.

**Step 3: Commit** `feat(home): compare section as dark band`.

---

### Task 9: OpenSource + Blog divider polish

**Files:** Modify `src/app/globals.css` (`.post`, open-source section), optionally components.

**Step 1:** Add `.guilloche-rule` or hairline section dividers between OpenSource → Blog for Little Room rhythm; tidy blog card borders/hover.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-os-blog.png`, Read. **Commit** `style(home): section dividers for open-source + blog`.

---

### Task 10: FAQ guilloché flourishes

**Files:** Modify `src/components/FAQSection.tsx`, `src/app/globals.css` (`.faq-h`, faq wrap).

**Step 1:** Add subtle guilloché corner flourishes (small `<Guilloche variant="panel" />` or `::before`) framing the FAQ block; keep accordions/contents from dict untouched.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-faq.png`, Read. **Commit** `style(home): guilloché flourish on FAQ`.

---

### Task 11: ClosingCTA → full-bleed dark finale

**Files:** Modify `src/components/ClosingCTA.tsx`, `src/app/globals.css` (`.closing-cta`).

**Step 1:** Make the closing a full-bleed dark band in `--bill-green` (the strongest dark moment, mirroring Catena's close), with a bold `<Guilloche variant="rosette" />` watermark (`opacity ~0.14`) and the install CTA. Uses existing WIP `dict.closing` fields. Ensure CTA button contrast on green.

**Step 2:** typecheck → PASS. Screenshot `/tmp/fr-closing.png`, Read. Confirm it lands as the dramatic finale.

**Step 3: Commit** `feat(home): bill-green closing finale with guilloché`.

---

### Task 12: i18n + RTL sweep

**Step 1:** `grep -rn` the touched components for any hardcoded user-facing English literals introduced during the redesign. If any exist, move them into `types.ts` + all 13 locale files and consume via `dict`. (Motif is decorative/`aria-hidden`, so likely zero new strings.)

**Step 2:** Run dev, load `/ar` (RTL) and `/zh-CN`. Screenshot each (`/tmp/fr-ar.png`, `/tmp/fr-zh.png`), Read. Confirm: dir flips correctly, guilloché/dividers/dark bands don't break, CJK serif renders.

**Step 3: Commit** (only if changes) `fix(home): i18n + RTL adjustments for redesign`.

---

### Task 13: Full verification

**Step 1:** `npm run check` (lint + typecheck + build) → must PASS. Paste the tail of output.

**Step 2:** `responsive` screenshots (mobile 375 / tablet 768 / desktop 1280) of the full page via browse; Read all three. Confirm the light→dark→light→dark→light rhythm holds at every breakpoint and nothing overflows on mobile.

**Step 3:** Final full-page desktop screenshot `/tmp/fr-final.png`, Read, compare against `/tmp/fr-baseline.png`.

**Step 4:** Report DONE with before/after screenshots. Do NOT deploy — hand back to the user for review, then `/ship` or merge + `npm run deploy`.

---

## Out of scope (YAGNI)

- No palette shift to dark (staying light per decision).
- No new copy/messaging rewrite — this is visual only.
- No blog/docs page redesign — homepage only.
- No new dependencies or animation libraries (CSS + SVG only).
