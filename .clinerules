<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Franklin Agent — Marketing Site

## What This Is
Source for [**franklin.run**](https://franklin.run), the marketing site for **Franklin Agent** — the AI agent with a wallet. Multilingual homepage in 13 locales, MDX blog, and a `/docs` section. The product agent itself lives at [blockrunai/franklin](https://github.com/blockrunai/franklin).

This repo was forked from an upstream website-reverse-engineer template, so the `/clone-website` skill (under `.claude/skills/clone-website/`) is still wired up and works for cloning new pages or sections from any URL. Use it when you need to lift a layout or component from another live site — otherwise treat the project as a normal Next.js codebase.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React + extracted SVGs in `src/components/icons.tsx`
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Fonts:** Instrument Serif (display) + IBM Plex Sans / Mono (body + code) + Noto Serif SC (CJK)
- **Content:** MDX with `gray-matter` front matter; `next-mdx-remote` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`
- **Deployment:** Google Cloud Run (NOT Vercel)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build
- `npm run deploy` — Deploy to Cloud Run (franklin.run)

## Deployment — IMPORTANT
**franklin.run is hosted on Google Cloud Run, NOT Vercel.** Pushing to GitHub does NOT trigger a deploy. After every push you want live, run `npm run deploy`.

- **Project:** `blockrun-prod-2026`
- **Service:** `franklin-run`
- **Region:** `us-central1`
- **Image:** `us-central1-docker.pkg.dev/blockrun-prod-2026/blockrun-images/franklin-run`
- **Script:** `scripts/deploy.sh` — builds from `Dockerfile` via Cloud Build, tags with git short SHA, rolls out automatically.

Typical flow: `git push origin master` → `npm run deploy`.

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Brand thread:** Franklin Agent — quiet, trustworthy, technical. Echelon-inspired typography (Instrument Serif at 400, IBM Plex eyebrows at 12px / 3px tracking) with a single banknote-era touchpoint: the grayscale Franklin portrait.
- **Real content** — use actual product copy, not placeholders. Marketing copy lives in `src/lib/home/<locale>.ts` dictionaries; blog content lives under `content/blog/<locale>/`.
- **Locale-aware** — every homepage section reads from the `dict` prop; never hardcode user-facing English. RTL locales (`ar`, `ur`, `fa`) flip `dir` via `HtmlLangSync`.
- **Beauty-first** — every pixel matters.

## Internationalization
13 locales, defined in `src/lib/locales.ts`:
`en`, `zh-CN`, `ja`, `ko`, `ru`, `id`, `ar`, `hi`, `ur`, `pt-BR`, `vi`, `tr`, `fa`.
RTL set: `ar`, `ur`, `fa`.

- English homepage: `/` (server-rendered from `src/app/page.tsx`)
- Other locales: `/[locale]` (under `src/app/[locale]/page.tsx`)
- Blog: `/blog` (English), `/blog/[locale]` (per-locale index), `/blog/[locale]/[slug]` (post)
- Each homepage gets `hreflang` alternates via `layout.tsx`; `llms.txt` exposes a GEO/AI-search-friendly index.

## Project Structure
```
src/
  app/
    [locale]/          # Localized homepage routes (12 non-English locales)
    blog/              # MDX blog (English + per-locale subroutes)
    docs/              # MDX docs tree (getting-started, user-guide, developer-guide, reference)
    llms.txt/          # GEO / AI-search index route
    layout.tsx         # Global metadata + hreflang + fonts
    page.tsx           # English homepage
    robots.ts          # robots.txt
    sitemap.ts         # sitemap.xml (multi-locale)
  components/
    ui/                # shadcn/ui primitives
    blog/              # Blog-specific components (HtmlLangSync, post layout, etc.)
    docs/              # Docs-specific components (sidebar, layout)
    HeroSection.tsx, TerminalSection.tsx, FeaturesSection.tsx,
    CompareSection.tsx, GettingStartedSection.tsx, OpenSourceSection.tsx,
    BlogSection.tsx, FAQSection.tsx, ClosingCTA.tsx, TrustBar.tsx,
    Header.tsx, Footer.tsx, HomePage.tsx
    icons.tsx          # Extracted SVG icon set
  lib/
    blog/              # Blog content loader (MDX + gray-matter)
    home/              # Homepage dict loader (per-locale strings)
    locales.ts         # 13-locale config + RTL set
    cdn.ts             # CDN URL helper
    docs-navigation.ts # Docs sidebar tree
    utils.ts           # cn() utility
  types/               # TypeScript interfaces
  hooks/               # Custom React hooks
content/
  blog/<locale>/       # MDX blog posts per locale
public/
  images/, videos/, seo/
docs/
  research/            # Inspection notes (legacy clone-template reference)
scripts/
  deploy.sh                 # Cloud Run deploy
  sync-agent-rules.sh       # Regenerate per-agent rule files from AGENTS.md
  sync-skills.mjs           # Regenerate /clone-website skill for all platforms
```

## MOST IMPORTANT NOTES
- When launching Claude Code agent teams (e.g., via the `/clone-website` skill), ALWAYS have each teammate work in their own worktree branch and merge everyone's work at the end. You are the orchestrator and have full context to resolve merge conflicts in service of the goal.
- After editing `AGENTS.md`, run `bash scripts/sync-agent-rules.sh` to regenerate platform-specific instruction files (`.github/copilot-instructions.md`, `.continue/rules/project.md`, `.amazonq/rules/project.md`, etc.). `CLAUDE.md` and `GEMINI.md` are thin `@AGENTS.md` pointers and do not need regeneration.
- After editing `.claude/skills/clone-website/SKILL.md`, run `node scripts/sync-skills.mjs` to regenerate the `/clone-website` skill for every supported agent platform.
- Never hardcode user-facing English strings in homepage sections. Add them to `src/lib/home/<locale>.ts` and consume via the `dict` prop so all 13 locales stay in sync.

# Website Inspection Guide

## How to Reverse-Engineer Any Website

This guide outlines what to capture when inspecting a target website via Chrome MCP or browser DevTools.

## Phase 1: Visual Audit

### Screenshots to Capture
- [ ] Every distinct page — desktop, tablet, mobile
- [ ] Dark mode variants (if applicable)
- [ ] Light mode variants (if applicable)
- [ ] Key interaction states (hover, active, open menus, modals)
- [ ] Loading/skeleton states
- [ ] Empty states
- [ ] Error states

### Design Tokens to Extract
- [ ] **Colors** — background, text (primary/secondary/muted), accent, border, hover, error, success, warning
- [ ] **Typography** — font family, sizes (h1-h6, body, caption, label), weights, line heights, letter spacing
- [ ] **Spacing** — padding/margin patterns (look for a scale: 4px, 8px, 12px, 16px, 24px, 32px, etc.)
- [ ] **Border radius** — buttons, cards, avatars, inputs
- [ ] **Shadows/elevation** — card shadows, dropdown shadows, modal overlay
- [ ] **Breakpoints** — when does the layout shift? (inspect with DevTools responsive mode)
- [ ] **Icons** — which icon library? custom SVGs? sizes?
- [ ] **Avatars** — sizes, shapes, fallback behavior
- [ ] **Buttons** — all variants (primary, secondary, ghost, icon-only, danger)
- [ ] **Inputs** — text fields, textareas, selects, checkboxes, toggles

## Phase 2: Component Inventory

For each distinct UI component, document:
1. **Name** — what would you call this component?
2. **Structure** — what HTML elements / child components does it contain?
3. **Variants** — does it have different sizes, colors, or states?
4. **States** — default, hover, active, disabled, loading, error, empty
5. **Responsive behavior** — how does it change at different breakpoints?
6. **Interactions** — click, hover, focus, keyboard navigation
7. **Animations** — transitions, entrance/exit animations, micro-interactions

### Common Components to Look For
- Navigation (top bar, sidebar, bottom bar)
- Cards / list items
- Buttons and links
- Forms and inputs
- Modals and dialogs
- Dropdowns and menus
- Tabs and segmented controls
- Avatars and user badges
- Loading skeletons
- Toast notifications
- Tooltips and popovers

## Phase 3: Layout Architecture

- [ ] **Grid system** — CSS Grid? Flexbox? Fixed widths?
- [ ] **Column layout** — how many columns at each breakpoint?
- [ ] **Max-width** — main content area max-width
- [ ] **Sticky elements** — header, sidebar, floating buttons
- [ ] **Z-index layers** — navigation, modals, tooltips, overlays
- [ ] **Scroll behavior** — infinite scroll, pagination, virtual scrolling

## Phase 4: Technical Stack Analysis

- [ ] **Framework** — React? Vue? Angular? Check `__NEXT_DATA__`, `__NUXT__`, `ng-version`
- [ ] **CSS approach** — Tailwind (utility classes), CSS Modules, Styled Components, Emotion, vanilla CSS
- [ ] **State management** — Redux (check DevTools), React Query, Zustand, Pinia
- [ ] **API patterns** — REST, GraphQL (check network tab for `/graphql` requests)
- [ ] **Font loading** — Google Fonts, self-hosted, system fonts
- [ ] **Image strategy** — CDN, lazy loading, srcset, WebP/AVIF
- [ ] **Animation library** — Framer Motion, GSAP, CSS transitions only

## Phase 5: Documentation Output

After inspection, create these files in `docs/research/`:
1. `DESIGN_TOKENS.md` — All extracted colors, typography, spacing
2. `COMPONENT_INVENTORY.md` — Every component with structure notes
3. `LAYOUT_ARCHITECTURE.md` — Page layouts, grid system, responsive behavior
4. `INTERACTION_PATTERNS.md` — Animations, transitions, hover states
5. `TECH_STACK_ANALYSIS.md` — What the site uses and our chosen equivalents
