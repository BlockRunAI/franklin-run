import type { HomeDict } from "./types";

export const hi: HomeDict = {
  nav: {
    features: "फ़ीचर्स",
    compare: "तुलना",
    blog: "ब्लॉग",
    docs: "Docs",
    tryFranklin: "Franklin आज़माएं",
    github: "GitHub",
    getStarted: "शुरू करें",
  },

  hero: {
    eyebrow: "स्वायत्त आर्थिक एजेंट",
    titleLine1: "वो AI एजेंट",
    titleLine2Pre: "जिसके पास है",
    titleLine2Em: "वॉलेट",
    titleLine2Post: ".",
    subPre: "दूसरे एजेंट code लिखते हैं। Franklin code लिखता है",
    subEm: "और पैसे खर्च करता है",
    subPost:
      "ताकि काम पूरा हो — models, data, images, search। Budget आप तय करें। बाक़ी वो चलाएगा।",
    ctaPrimary: "मुफ़्त में शुरू करें",
    ctaSecondary: "GitHub पर Star दें",
    copyInstallAriaLabel: "Install command कॉपी करें",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "USDC, चलता है",
    pillX402Before: "Native",
    termAbort: "रोकने के लिए esc",
  },

  features: {
    eyebrow: "चार अध्याय",
    titleTop: "Wallet क्या",
    titleEm: "बदलता है",
    introPre: "Coding intelligence तो basic है। असली फ़र्क़ है",
    introEm: "purchasing power",
    introPost:
      "— और वो ख़ामोश अनुशासन जो उस एजेंट के साथ आता है जिसे अपना ख़ुद का हिसाब रखना पड़ता है।",
    cards: [
      {
        label: "वॉलेट",
        title: "वो software जो पैसे खर्च कर सकता है।",
        desc: "Franklin Base या Solana पर USDC रखता है। जब उसे model, data feed, या image चाहिए — वो payment sign करता है और ले लेता है। Non-custodial। Keys आपकी मशीन पर रहती हैं। Cap आप सेट करते हैं; वो लागू करता है।",
      },
      {
        label: "Trading",
        title: "Data ख़रीदो। Tape पढ़ो। फ़ैसला लो।",
        desc: "पूछिए “BTC कैसा दिख रहा है?” और Franklin live prices ख़रीदता है, RSI, MACD, Bollinger और volatility locally compute करता है, फिर signal लौटाता है। एक prompt। न पाँच browser tabs, न API key का जंजाल।",
      },
      {
        label: "Smart Router",
        title: "55+ models। वो चुनता है। आप बचाते हैं।",
        desc: "कोई एक model हर चीज़ में सबसे अच्छा नहीं होता। Router हर request को classify करता है और एक millisecond से कम में route करता है। 2M+ असली requests पर trained, Elo से लगातार scored, आपके overrides के साथ adapt होता है। हमेशा-Opus के मुक़ाबले 89% तक बचत।",
      },
      {
        label: "आपको सीखता है",
        title: "हर session में और होशियार।",
        desc: "Claude Code हर run के बीच भूल जाता है। Franklin preferences extract करता है — language, style, model choices, workflow — और अगले session में inject करता है। Confirmed patterns का confidence बढ़ता है। पुराने 30 दिन में decay हो जाते हैं।",
      },
    ],
  },

  getStarted: {
    eyebrow: "Pricing · Install · Fund",
    titlePre: "पैसे दीजिए",
    titleEm: "नतीजे",
    titleAfterEm: " के,",
    titlePost: "और किसी चीज़ के नहीं।",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Provider cost + 5%, हर action पर signed।",
    yopoBody:
      "कोई subscription नहीं (access के पैसे नहीं देते)। कोई pay-per-call नहीं (failed tries के पैसे नहीं देते)। Wallet balance ही hard cap है। शून्य पर पहुँचते ही Franklin रुक जाता है। बस यही पूरा pricing model है।",
    steps: [
      {
        title: "Install करें",
        body: "एक npm command। Node 20+। macOS, Linux, WSL।",
      },
      {
        title: "मुफ़्त में चलाएँ",
        body: "बिना कुछ किए free NVIDIA Nemotron और DeepSeek V4 Flash। Wallet की ज़रूरत नहीं।",
      },
      {
        title: "Fund करें ($5 काफ़ी है)",
        body: "Base या Solana wallet generate करें। USDC भेजें। हर frontier model unlock करें।",
      },
      {
        title: "Outcome बताएँ",
        body: "Code, trade, research, generate — Franklin चुनता है, pay करता है, report करता है, रुक जाता है।",
      },
    ],
    ctaInstall: "npm से Install करें",
    ctaGitHub: "GitHub पर देखें",
    slashEyebrow: "Slash Commands · 18 built-in",
    slashDescs: [
      "Interactive picker या सीधा switch",
      "पहले read-only planning, फिर run",
      "मुश्किल समस्याओं के लिए deep reasoning",
      "Structured context compression",
      "Codebase में search",
      "पुराने sessions में full-text search",
      "किसी भी session को inspect या restore करें",
      "Git workflow helpers",
      "एक shot में review, bugfix, tests",
      "Session spend + address + balance",
      "Spend breakdowns और trends",
      "Franklin ने आपके बारे में क्या सीखा",
    ],
  },

  compare: {
    eyebrow: "हिसाब-किताब",
    titleTop: "एक table में,",
    titleBottom: "साफ़-साफ़।",
    intro:
      "AI products access बेचते हैं। Subscriptions आपको हर महीने guilt और rate limit देती हैं। Pay-per-call हर failed try का बिल भेजता है। Franklin सिर्फ़ outcome पर settle करता है — एक बार, USDC में।",
    headers: {
      saas: "Subscription SaaS",
      ppc: "Pay-per-call API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "आप पैसे देते हैं",
        saas: "Access के, इस्तेमाल हो या न हो",
        ppc: "हर कोशिश के, dead-ends समेत",
        franklin: "Outcome के। एक बार।",
      },
      {
        label: "Monthly fee",
        saas: "$20 — $200",
        ppc: "$0, ऊपर से usage",
        franklin: "$0। जितना खर्च, उतना ही।",
      },
      {
        label: "Rate limits",
        saas: "हाँ। ज़रूरत के वक़्त ही कसते हैं।",
        ppc: "Per-key quotas, tiers",
        franklin: "कोई नहीं। बस wallet balance ही cap है।",
      },
      {
        label: "Identity",
        saas: "Email + credit card",
        ppc: "Vendor account, हर model के API keys",
        franklin: "एक wallet। न email, न KYC।",
      },
      {
        label: "Model choice",
        saas: "एक ही vendor",
        ppc: "12 keys आप संभालिए",
        franklin: "एक wallet से 55+ models · router तय करता है।",
      },
      {
        label: "Provider outage",
        saas: "आप रुक जाते हैं।",
        ppc: "आप रुक जाते हैं।",
        franklin: "अगले provider पर route कर देता है।",
      },
      {
        label: "Overdraft का ख़तरा",
        saas: "चुपचाप auto-renew",
        ppc: "महीने के आख़िर में बेहिसाब बिल",
        franklin: "कोई नहीं। Wallet ख़ाली ⇒ Franklin रुक जाता है।",
      },
      {
        label: "Source",
        saas: "Closed",
        ppc: "Closed SDK",
        franklin: "Apache 2.0 · local-first।",
      },
    ],
  },

  openSource: {
    eyebrow: "The Commons · Apache 2.0",
    titleTop: "आपका है",
    titleEm: "सब कुछ",
    labels: [
      { k: "आपका data", v: "~/.blockrun/" },
      { k: "आपका wallet", v: "Private keys · local" },
      { k: "आपके models", v: "55+ · 1 cmd में switch" },
      { k: "आपका license", v: "Apache 2.0" },
      { k: "आपका uptime", v: "Fork करो। Self-host।" },
    ],
    paragraphs: [
      "Closed AI tools में vendor आपका usage data, preferences, history — सब अपने पास रखता है। वो terms बदलते हैं — आप मानते हैं। दाम बढ़ाते हैं — आप देते हैं। बंद होते हैं — आप रुक जाते हैं।",
      "Franklin Apache 2.0 है और आपकी मशीन पर चलता है। Wallet keys, session history, learnings — सब ~/.blockrun/ में रहता है। Zero telemetry। कुछ भी घर फ़ोन नहीं करता।",
      "अगर BlockRun कल ग़ायब हो जाए, आपकी USDC आपके wallet में रहती है और आपका एजेंट चलता रहता है। यही पूरी बात है।",
    ],
    smallParagraph:
      "हर line पढ़िए: पूरा agent loop, 16 built-in tools, plugin SDK, x402 client, router — सब repo में है। Audit करें, fork करें, अपना vertical ship करें।",
  },

  blog: {
    eyebrow: "Dispatches",
    titleTop: "हमारी",
    titleEm: "workbench से",
    intro:
      "Multi-model coding agents, wallet-native AI, और बिना global credit card वाले developers के लिए frontier models — इन पर नोट्स।",
    allPosts: "सभी posts →",
  },

  faq: {
    eyebrow: "सवाल-जवाब",
    titleTop: "सवाल,",
    titleEm: "जवाब के साथ",
    intro:
      "स्वायत्त आर्थिक एजेंट का model — सीधी ज़ुबान में। कोई गोलमोल नहीं।",
    items: [
      {
        q: "यह Claude Code या Cursor से अलग कैसे है?",
        a: "वो शानदार code लिखते हैं। पैसे खर्च नहीं कर सकते। Trading data नहीं ख़रीद सकते, API calls नहीं ख़रीद सकते, image generation का payment नहीं कर सकते, web-search का बिल नहीं चुका सकते। Franklin कर सकता है — क्योंकि उसके पास USDC wallet है और वो x402 के ज़रिए हर action पर pay करता है। Coding intelligence तो basic है; आर्थिक autonomy ही असली category है।",
      },
      {
        q: "“Wallet वाला एजेंट” का मतलब असल में क्या है?",
        a: "Franklin Base या Solana पर USDC रखता है। जब उसे model, data feed या service चाहिए, वो EIP-712 micropayment sign करता है और pay कर देता है। आप budget सेट करते हैं; Franklin लागू करता है। हर सिक्का real-time में track होता है। न subscriptions, न API keys, न billing portals।",
      },
      {
        q: "Franklin किन चीज़ों पर खर्च कर सकता है?",
        a: "55+ AI models (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, वग़ैरह), image gen (DALL·E, Nano Banana, Grok Imagine), video gen, Exa neural web search, prediction-market data (Polymarket, Kalshi), X/Twitter intelligence, music gen। Smart Router हर task के लिए सबसे अच्छा model चुनता है — हमेशा-Opus के मुक़ाबले 89% तक बचत।",
      },
      {
        q: "खर्च कितना आता है?",
        a: "YOPO — You Only Pay Outcome। Provider cost + 5%, हर call पर USDC में settle। आसान सवाल: ~$0.001। Coding session: $0.02–$0.10। 30 मिनट का deep session: $0.10–$0.50। न subscriptions, न monthly fees, न rate limits। Free NVIDIA models हमेशा शून्य लागत पर मिलते हैं — wallet की ज़रूरत नहीं।",
      },
      {
        q: "क्या यह सच में मेरे काम का तरीक़ा सीखता है?",
        a: "हाँ। हर session के बाद Franklin preferences extract करता है — language, style, model choices, workflow — और अगले run में inject करता है। Confirmed preferences का confidence बढ़ता है। पुराने 30 दिन में decay हो जाते हैं। `/learnings` चलाइए, देखिए वो क्या जानता है।",
      },
      {
        q: "क्या मेरा data private रहता है?",
        a: "सब कुछ ~/.blockrun/ में local रहता है। Session history, learnings, wallet keys — कुछ भी घर फ़ोन नहीं करता। Zero telemetry, zero crash reporting। आपकी private keys आपकी मशीन से कभी नहीं निकलतीं। Code Apache 2.0 है — हर line audit करें।",
      },
      {
        q: "क्या मैं इसे मुफ़्त में इस्तेमाल कर सकता हूँ?",
        a: "हाँ। Free NVIDIA models (Nemotron, DeepSeek V4 Flash) बिना wallet, बिना USDC, बिना signup के चलते हैं। Wallet सिर्फ़ तब fund कीजिए जब Sonnet, Opus, GPT, Gemini, Grok, या paid tools चाहिए हों।",
      },
      {
        q: "Base और Solana ही क्यों?",
        a: "तेज़ finality, नगण्य fees, mature USDC support, और दोनों पर असली x402 ecosystem। Setup पर चुनिए, कभी भी switch करें। वही wallet UX, वही models, सिर्फ़ rails अलग।",
      },
    ],
  },

  footer: {
    tagline:
      "वो AI एजेंट जिसके पास wallet है। आपकी USDC रखता है और outcomes के लिए खर्च करता है। Apache 2.0।",
    aboutPre: "एक",
    aboutLink: "BlockRun.ai",
    aboutPost: "product। x402 micropayment protocol से चलता है।",
    ctaGetStarted: "शुरू करें",
    colProduct: "Product",
    colResources: "Resources",
    colCommunity: "Community",
    linkFeatures: "फ़ीचर्स",
    linkCompare: "तुलना",
    linkGetStarted: "शुरू करें",
    linkNpm: "npm",
    linkDocs: "Documentation",
    linkBlog: "ब्लॉग",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 Protocol",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai। सर्वाधिकार सुरक्षित।",
    bottomRight: "BlockRun.ai का स्वायत्त आर्थिक एजेंट",
  },

  localeSwitcherLabel: "इस भाषा में पढ़ें:",

  meta: {
    title: "Franklin — वो AI एजेंट जिसके पास Wallet है",
    description:
      "वो AI एजेंट जिसके पास wallet है। आपकी USDC रखता है और आपके लिए खर्च करता है — 55+ models, trading data, image generation, video generation, web search। एक wallet, कोई API keys नहीं। Open source।",
    ogTitle: "Franklin — वो AI एजेंट जिसके पास Wallet है",
    ogDescription:
      "दूसरे एजेंट code लिखते हैं। Franklin code लिखता है और काम पूरा करने के लिए पैसे खर्च करता है। 55+ models, trading data, image gen, web search — एक USDC wallet। Open source।",
    twitterTitle: "Franklin — वो AI एजेंट जिसके पास Wallet है",
    twitterDescription:
      "वो AI एजेंट जिसके पास wallet है। 55+ models, trading data, image gen — आपकी USDC रखता है और आपके लिए खर्च करता है। Open source।",
  },
};
