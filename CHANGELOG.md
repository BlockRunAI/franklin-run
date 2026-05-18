# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Franklin Agent — Marketing site era

This repository was forked from `ai-website-cloner-template` and rebuilt as the
homepage for **Franklin Agent** ([franklin.run](https://franklin.run)). The
template-era history is preserved below for reference.

## [Unreleased]

### Changed
- **Homepage redesign — Echelon-inspired clean/technical aesthetic.** Replaced the dark banknote theme (gold + sepia + guilloche + grain) with a white + vapor section system, deep navy CTAs, Instrument Serif at weight 400 (72px h1), and IBM Plex Sans/Mono for body and eyebrows. Hero became a two-column layout with a grayscale Franklin portrait on the right. Wordmark rebranded to "Franklin Agent" across header, footer, and metadata. Geist → IBM Plex Sans/Mono.

### Added
- New marketing sections: `TrustBar` (USDC / Base / Solana / x402 / 55+ models), `TerminalSection` (rotating live demo on vapor background), `ClosingCTA` (Echelon-style serif bookend).
- Restyled every existing section: features (alternating image rows), compare (white card on vapor), getting-started (clean steps + navy 402 callout), blog (white cards), FAQ (single-column accordion), footer (3-column mono eyebrows).

## [Multilingual] - 2026

### Added
- **Multilingual homepage across 13 locales** — `en`, `zh-CN`, `ja`, `ko`, `ru`, `id`, `ar`, `hi`, `ur`, `pt-BR`, `vi`, `tr`, `fa`. Adds `/[locale]` routes, `hreflang` alternates in `<head>`, RTL support for Arabic / Urdu / Persian, and per-locale dictionaries under `src/lib/home/`.
- **Multilingual blog engine + GEO/AI-search optimization** — MDX blog with per-locale content under `content/blog/<locale>/`, sitemap and structured-data emission, `llms.txt` route for AI crawler discoverability.
- **`/docs` section** — 29-page documentation tree with sidebar nav and dark theme covering getting-started, user-guide, developer-guide, and reference.
- **Google Analytics** — measurement ID `G-CDWTPW4YRM`.

### Changed
- Documentation links point to the local `/docs` route instead of GitHub markdown.
- All GitHub links pointed at `blockrunai/franklin`.

## [Landing v2] - 2026

### Added
- **Franklin Landing v2 — editorial banknote design.** Sepia + gold palette, guilloche overlays, animated CLI demo with 4 rotating scenarios, retina dashboard screenshots, mobile responsive + SEO (OG / Twitter cards, structured data, hamburger menu), Circle USDC Hackathon Winner badge, Cloud Run deploy script.
- **YOPO positioning** — "You Only Pay Outcome."
- **Repositioning to "agent with a wallet"** + currency-engraving design system.
- **Real product content** — replaced all template/Multica content with Franklin wallet, models, self-evolution, and social copy. Real Franklin screenshots and BlockRun.ai branding in header/footer.

### Changed
- Marketing copy updated to reference kimi-k2.6 (was k2.5) in first-session docs + hero router demo.

### Fixed
- Removed BuildKit-only cache mounts from `Dockerfile` so the image builds cleanly on Cloud Build.
- Lint errors in effect setState; BlockRun favicon + apple-touch-icon.
- `next/link` used for internal navigation; `sizes` prop on `<Image fill>` to suppress the Next.js warning.

### Removed
- All Multica.ai content and imagery from the active site (legacy reference notes retained under `docs/research/`).

---

## Template-era history

The entries below correspond to the upstream `ai-website-cloner-template`
before this repository was repurposed for Franklin Agent. They are kept verbatim
for traceability — none of these versions are tagged or published from this
repo.

## [0.3.1] - 2026-03-29

### Fixed
- `sync-agent-rules.sh` failing to resolve `@file` imports on Windows due to CRLF line endings — platform instruction files now correctly inline the Inspection Guide content

## [0.3.0] - 2026-03-29

### Added
- Multi-URL support for `/clone-website` — clone multiple sites in a single command with parallel processing and isolated output
- CI quality gates via GitHub Actions — automated lint, typecheck, and build on every push and PR
- `npm run typecheck` and `npm run check` scripts for local quality validation
- `.gitattributes` for cross-platform line ending normalization
- `.nvmrc` to pin Node.js 20 for contributor consistency

### Changed
- Streamlined PR template — removed redundant checklist items and screenshots section
- Improved project description and README — clearer use cases, limitations, and modern wording
- Refined documentation and agent rules across all platforms for clarity and consistency
- Fixed CRLF handling in `sync-skills.mjs` for reliable Windows operation

### Removed
- Outdated use case from README documentation

## [0.2.0] - 2026-03-28

### Added
- Multi-platform AI agent support: Claude Code, Codex CLI, OpenCode, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Cline/Roo Code, Continue, Amazon Q, Augment Code, Aider
- Platform-specific instruction files and `/clone-website` skill for each supported agent
- `scripts/sync-agent-rules.sh` to regenerate platform instruction files from AGENTS.md
- `scripts/sync-skills.mjs` to regenerate `/clone-website` skill across all platforms
- GEMINI.md for Gemini CLI configuration
- Supported Platforms table in README
- "Updating for Other Platforms" documentation section in README

### Changed
- README now describes the project as multi-agent (Claude Code recommended, not required)
- AGENTS.md updated with sync script reminders

## [0.1.1] - 2026-03-28

### Added
- Bug report and feature request issue templates
- Pull request template with checklist
- CHANGELOG.md following Keep a Changelog format
- Package.json metadata (description, repository, homepage, keywords, engines)

### Fixed
- LICENSE copyright holder now attributed to JCodesMore

## [0.1.0] - 2026-03-28

### Added
- Initial template scaffold for website reverse-engineering with Claude Code
- `/clone-website` skill for full-site cloning pipeline
- `/build-from-spec` and `/customize` skills
- Parallel builder agents with git worktree isolation
- Chrome MCP integration for design token extraction
- Comprehensive inspection guide and project structure documentation
- Next.js 16 + shadcn/ui + Tailwind CSS v4 base scaffold
- MIT license
- README with badges, demo section, quick start, and star history
