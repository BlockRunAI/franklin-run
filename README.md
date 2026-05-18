# Franklin Agent — franklin.run

Source code for [**franklin.run**](https://franklin.run), the marketing site for **Franklin Agent** — the AI agent with a wallet.

Franklin writes code and spends money to get things done. Open-source, runs anywhere, pays per call in USDC via [x402](https://x402.gitbook.io/x402) — 55+ models, trading data, image gen, web search. One wallet, no API keys.

> Looking for the product? Visit [franklin.run](https://franklin.run) or the agent repo at [blockrunai/franklin](https://github.com/blockrunai/franklin).

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Fonts** — Instrument Serif (display) + IBM Plex Sans/Mono (body + code) + Noto Serif SC (CJK)
- **Content** — MDX blog with multilingual front matter, MDX docs section
- **Hosting** — Google Cloud Run (NOT Vercel)

## What's on the Site

- **Homepage** — Echelon-inspired clean/technical aesthetic with a side-anchored Franklin portrait, available in 13 locales
- **Blog** (`/blog`) — Multilingual MDX engine with GEO/AI-search optimization (`llms.txt`, structured data, hreflang)
- **Docs** (`/docs`) — 29-page documentation tree (getting-started, user-guide, developer-guide, reference)
- **Routes** — `/` (English), `/[locale]` for every other locale, `/blog/[slug]`, `/blog/[locale]/[slug]`, `/docs/...`, `/llms.txt`

### Supported locales

`en`, `zh-CN`, `ja`, `ko`, `ru`, `id`, `ar`, `hi`, `ur`, `pt-BR`, `vi`, `tr`, `fa` (13 total; RTL: `ar`, `ur`, `fa`)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint check
npm run typecheck  # TypeScript check
npm run check      # Lint + typecheck + build
npm run deploy     # Deploy to Cloud Run (franklin.run)
```

### Docker

```bash
docker compose up app --build  # build + run production image
docker compose up dev --build  # dev mode on port 3001
```

## Deployment — IMPORTANT

**franklin.run is hosted on Google Cloud Run, NOT Vercel.** Pushing to GitHub does NOT trigger a deploy. After every push you want live, run `npm run deploy`.

| Field    | Value                                                                            |
| -------- | -------------------------------------------------------------------------------- |
| Project  | `blockrun-prod-2026`                                                             |
| Service  | `franklin-run`                                                                   |
| Region   | `us-central1`                                                                    |
| Image    | `us-central1-docker.pkg.dev/blockrun-prod-2026/blockrun-images/franklin-run`     |
| Script   | `scripts/deploy.sh` — builds from `Dockerfile` via Cloud Build, tags with git SHA |

Typical flow: `git push origin master` → `npm run deploy`.

## Project Structure

```
src/
  app/
    [locale]/        # Localized homepage routes (12 non-English locales)
    blog/            # MDX blog (English + per-locale subroutes)
    docs/            # MDX docs (getting-started, user-guide, developer-guide, reference)
    llms.txt/        # GEO/AI-search index
    layout.tsx       # Global metadata + hreflang + fonts
    page.tsx         # English homepage
    robots.ts        # robots.txt
    sitemap.ts       # sitemap.xml (multi-locale)
  components/
    ui/              # shadcn/ui primitives
    blog/            # Blog-specific components
    docs/            # Docs-specific components
    HeroSection.tsx, TerminalSection.tsx, FeaturesSection.tsx, ...  # Marketing sections
    icons.tsx        # SVG icon set
  lib/
    blog/            # Blog content loader (MDX + gray-matter)
    home/            # Homepage dict loader (per-locale strings)
    locales.ts       # 13-locale config + RTL set
    cdn.ts           # CDN URL helper
    docs-navigation.ts
    utils.ts         # cn() utility
content/
  blog/<locale>/     # MDX blog posts per locale
public/
  images/, videos/, seo/
docs/
  research/          # Inspection notes (legacy clone-template reference)
scripts/
  deploy.sh             # Cloud Run deploy
  sync-agent-rules.sh   # Regenerate per-agent rule files from AGENTS.md
  sync-skills.mjs       # Regenerate /clone-website skill for all agent platforms
AGENTS.md               # Single source of truth for AI coding agent instructions
CLAUDE.md, GEMINI.md    # Thin pointers that @-import AGENTS.md
```

## Working With AI Coding Agents

`AGENTS.md` is the project's single source of truth for AI coding agents. Most modern agents (Claude Code, Codex CLI, Cursor, Windsurf, Aider, Augment, Roo) read it directly. For agents that need their own file format (Copilot, Cline, Continue, Amazon Q), generated copies live under `.github/`, `.continue/`, `.amazonq/`, etc.

After editing `AGENTS.md`, regenerate the per-agent copies:

```bash
bash scripts/sync-agent-rules.sh
```

The repo also ships the `/clone-website` skill (under `.claude/skills/clone-website/`) — a parallel-agent pipeline that reverse-engineers any URL into Next.js components. It powered the original landing-page builds; the skill remains available for future cloning work. After editing `.claude/skills/clone-website/SKILL.md`, run:

```bash
node scripts/sync-skills.mjs
```

| Source of truth                         | Sync script                       |
| --------------------------------------- | --------------------------------- |
| `AGENTS.md`                             | `bash scripts/sync-agent-rules.sh`|
| `.claude/skills/clone-website/SKILL.md` | `node scripts/sync-skills.mjs`    |

## License

MIT
