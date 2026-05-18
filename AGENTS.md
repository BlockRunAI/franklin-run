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

@docs/research/INSPECTION_GUIDE.md
