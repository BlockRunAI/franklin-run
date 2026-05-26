/**
 * HomeDict — every translatable string surfaced on the franklin.run homepage.
 *
 * Strings deliberately omitted (kept English in the components):
 *   • Brand / proper nouns: Franklin, BlockRun, USDC, Base, Solana, x402, YOPO,
 *     model names, "Series 2026", "№ 1776".
 *   • Mock data inside dashboards: terminal demo prompts/responses, wallet bill
 *     line items, signal-card numbers, routing-ledger rows, preference rows.
 *     Those are visual props, not user-facing copy.
 *   • Code snippets and slash-command names (`/model`, `franklin --trust`, etc.).
 *
 * Whenever a section title contains an emphasized word rendered as
 * `<em className="shimmer">…</em>` or in gold italic, we expose `titleEm`
 * (and where needed, `titlePre` / `titleAfterEm` / `titlePost`) so each locale
 * can keep the typographic structure intact.
 */
export interface HomeDict {
  nav: {
    features: string;
    compare: string;
    blog: string;
    docs: string;
    tryFranklin: string;
    github: string;
    getStarted: string;
  };

  hero: {
    eyebrow: string;
    /** Title line 1 (no em). e.g. "The AI agent" */
    titleLine1: string;
    /** Line 2 prefix before the em. e.g. "with a" */
    titleLine2Pre: string;
    /** Emphasized word on line 2. e.g. "wallet" */
    titleLine2Em: string;
    /** Trailing punctuation after the em. e.g. "." */
    titleLine2Post: string;
    /** Subtitle prefix before the inline em. */
    subPre: string;
    /** Inline emphasized phrase inside subtitle. */
    subEm: string;
    /** Subtitle text after the inline em. */
    subPost: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** "Copy install command" — aria label for the install-box copy button. */
    copyInstallAriaLabel: string;
    /** Text after "YOPO — " in the pill row. e.g. "You Only Pay Outcome". */
    pillYopoSuffix: string;
    /** "USDC on" — appears before the Base / Solana names. */
    pillUsdcBefore: string;
    /** "Native" — appears before x402 in the pill row. */
    pillX402Before: string;
    termAbort: string;
  };

  features: {
    eyebrow: string;
    /** "What a wallet" */
    titleTop: string;
    /** "changes" */
    titleEm: string;
    introPre: string;
    introEm: string;
    introPost: string;
    cards: Array<{
      label: string;
      title: string;
      desc: string;
    }>;
  };

  getStarted: {
    eyebrow: string;
    /** "Pay for the" */
    titlePre: string;
    /** "outcome" */
    titleEm: string;
    /** ", " — punctuation between the em and the line break. */
    titleAfterEm: string;
    /** "nothing else." */
    titlePost: string;
    yopoLabel: string;
    yopoTitle: string;
    yopoBody: string;
    steps: Array<{ title: string; body: string }>;
    ctaInstall: string;
    ctaGitHub: string;
    slashEyebrow: string;
    /** Descriptions for the 12 slash commands, in the same order they appear in
     *  GettingStartedSection. */
    slashDescs: string[];
  };

  compare: {
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    intro: string;
    headers: { saas: string; ppc: string; franklin: string };
    rows: Array<{ label: string; saas: string; ppc: string; franklin: string }>;
  };

  openSource: {
    eyebrow: string;
    titleTop: string;
    titleEm: string;
    labels: Array<{ k: string; v: string }>;
    paragraphs: string[];
    /** Last paragraph is rendered with the .small class. */
    smallParagraph: string;
  };

  blog: {
    eyebrow: string;
    titleTop: string;
    titleEm: string;
    intro: string;
    allPosts: string;
  };

  faq: {
    eyebrow: string;
    titleTop: string;
    titleEm: string;
    intro: string;
    items: Array<{ q: string; a: string }>;
  };

  footer: {
    tagline: string;
    aboutPre: string;
    aboutLink: string;
    aboutPost: string;
    ctaGetStarted: string;
    colProduct: string;
    colResources: string;
    colCommunity: string;
    linkFeatures: string;
    linkCompare: string;
    linkGetStarted: string;
    linkNpm: string;
    linkDocs: string;
    linkBlog: string;
    linkGateway: string;
    linkX402: string;
    linkGitHub: string;
    linkX: string;
    linkTelegram: string;
    copyright: string;
    bottomRight: string;
  };

  localeSwitcherLabel: string;

  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
}
