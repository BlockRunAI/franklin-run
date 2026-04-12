# Multica.ai Page Topology

## Global Info
- **URL:** https://multica.ai
- **Title:** Multica — Project Management for Human + Agent Teams
- **Lang:** en (content is Chinese)
- **Total height:** ~10143px (inside scroll container with body overflow:hidden)
- **Scroll container:** `div` with font classes (Instrument Serif + Noto Serif SC)
- **Framework:** Next.js (confirmed by `/_next/image` paths)
- **No smooth scroll library** (no Lenis, no Locomotive Scroll)

## Fonts
- **Headings (h1, h2):** Instrument Serif, weight 400 + Noto Serif SC for Chinese characters
- **Body:** Geist, weight 400
- **Code/mono:** Geist Mono
- **Sizes:** h1=102.4px, h2=67.2px, body p=17px/28px

## Color Palette
- **Dark bg primary:** #0a0d12 (rgb(10, 13, 18))
- **Dark bg deep:** #05070b (rgb(5, 7, 11))
- **Light gray bg:** #f8f8f8 (rgb(248, 248, 248))
- **White:** #ffffff
- **Text on dark:** white, white/84 for subtitles
- **Text on light:** #0a0d12
- **Muted text on light:** #0a0d12 at 36% opacity

## Sections (top to bottom)

### 0. Hero (div.relative) — 1618px
- Absolute header overlay (z-30, 76px height, transparent bg)
- Full-width background image: `/images/landing-bg.jpg` (mountain landscape, blue/pink gradient)
- Large heading: "你的下一批员工不是人类。" (Instrument Serif, 102.4px)
- Subtitle paragraph (17px, white/84)
- Two CTA buttons: "免费开始" (white bg, dark text) + "GitHub" (transparent bg, white border)
- Install code block with copy button
- Supported tools row: "支持" + Claude Code, Codex, OpenClaw, OpenCode logos
- Kanban board screenshot overlay: `/images/landing-hero.png`

### 1. Features Section (section.bg-white) — 5245px
- Contains 4 feature sub-sections with shared sticky sidebar nav
- Sidebar: sticky (top: 112px), 180px wide, contains 4 buttons
- Active nav item: full color #0a0d12, inactive: 36% opacity
- **Interaction model:** Scroll-driven — sidebar items highlight as you scroll past sub-sections

#### 1a. 团队协作 (Team Collaboration)
- H2: "像分配给同事一样分配给 Agent"
- Subtitle paragraph
- Feature cards: Agent 出现在指派人选择器中, 自主参与, 统一的活动时间线
- Issue detail mock UI with conversation
- Background: `/images/feature-bg.jpg`

#### 1b. 自主执行 (Autonomous Execution)
- H2: "设置后无需管理——Agent 在你睡觉时工作"
- Feature cards: 完整的任务生命周期, 主动报告阻塞, 实时进度推送
- Dark terminal/agent activity UI mock
- Background: `/images/feature-bg-2.jpg`

#### 1c. 技能库 (Skills Library)
- H2: "每个解决方案都成为全团队可复用的技能"
- Three column feature descriptions: 可复用的技能定义, 全团队共享, 复合增长
- Background: `/images/feature-bg-3.jpg`

#### 1d. 运行时 (Runtime)
- H2: "一个控制台管理所有算力"
- Runtime dashboard mock UI (Activity + Daily Cost charts)
- Feature cards: 统一运行时面板, 实时监控, 自动检测与即插即用
- Background: `/images/feature-bg-4.jpg`

### 2. Getting Started (section.bg-[#05070b]) — 958px
- Label: "开始使用"
- H2: "招募你的第一个 AI 员工只需一小时。"
- 4 numbered steps (01-04) in a grid with border dividers
- Two CTA buttons: "开始使用" (white bg) + "在 GitHub 上查看" (dark bg, border)

### 3. Open Source (section.bg-white) — 735px
- Label: "开源"
- H2: "开源为所有人。"
- Subtitle paragraph
- 4 feature cards: 随处自托管, 无供应商锁定, 默认透明, 社区驱动

### 4. FAQ (section.bg-[#f8f8f8]) — 936px
- Label: "常见问题"
- H2: "问与答。"
- 6 accordion items with + icons
- Questions about supported agents, self-hosting, differences, autonomy, security, limits

### 5. Footer (footer.bg-[#0a0d12]) — 650px
- Logo (asterisk clip-path + "multica" text)
- Description: "人类 + Agent 团队的项目管理。开源、可自托管、为未来的工作方式而建。"
- Social links: X (Twitter), GitHub
- "开始使用" button
- Nav columns: 产品 (功能特性, 如何工作, 更新日志), 资源 (文档, API, X), 关于 (关于我们, 开源, GitHub)
