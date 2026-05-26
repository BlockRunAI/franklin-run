import type { HomeDict } from "./types";

/**
 * Urdu (ur) — translated from en.ts. Layout handles dir="rtl"; copy is
 * written naturally without manual reversal. Brand and protocol terms
 * (Franklin, BlockRun, USDC, Base, Solana, x402, YOPO, model names, etc.)
 * stay verbatim, as do code literals like ~/.blockrun/ and /learnings.
 */
export const ur: HomeDict = {
  nav: {
    features: "خصوصیات",
    compare: "موازنہ",
    blog: "بلاگ",
    docs: "دستاویزات",
    tryFranklin: "Franklin آزمائیں",
    github: "GitHub",
    getStarted: "شروع کریں",
  },

  hero: {
    eyebrow: "خود مختار اقتصادی ایجنٹ",
    titleLine1: "وہ AI ایجنٹ",
    titleLine2Pre: "جس کے پاس",
    titleLine2Em: "والیٹ",
    titleLine2Post: "ہے۔",
    subPre: "دوسرے ایجنٹ صرف کوڈ لکھتے ہیں۔ Franklin کوڈ لکھتا ہے",
    subEm: "اور پیسے بھی خرچ کرتا ہے",
    subPost:
      "تاکہ کام مکمل ہو — ماڈلز، ڈیٹا، تصاویر، سرچ۔ بجٹ آپ طے کریں، چلانا اس کا کام۔",
    ctaPrimary: "مفت شروع کریں",
    ctaSecondary: "GitHub پر Star کریں",
    copyInstallAriaLabel: "انسٹال کمانڈ کاپی کریں",
    pillYopoSuffix: "آپ صرف نتیجے کا بل دیتے ہیں",
    pillUsdcBefore: "USDC، چین:",
    pillX402Before: "Native",
    termAbort: "روکنے کے لیے esc",
  },

  features: {
    eyebrow: "چار باب",
    titleTop: "والیٹ کیا کچھ",
    titleEm: "بدل دیتا ہے",
    introPre: "کوڈنگ کی ذہانت تو بنیادی شرط ہے۔ اصل فرق ہے",
    introEm: "خریدنے کی طاقت",
    introPost:
      "— اور وہ خاموش نظم جو ہر اُس ایجنٹ کے ساتھ آتی ہے جسے اپنے کھاتے خود متوازن رکھنے ہوں۔",
    cards: [
      {
        label: "والیٹ",
        title: "وہ سافٹ ویئر جو پیسے خرچ کر سکے۔",
        desc: "Franklin USDC رکھتا ہے، Base یا Solana پر۔ جب اسے ماڈل، ڈیٹا فیڈ، یا تصویر چاہیے ہو — وہ ادائیگی پر دستخط کرتا ہے اور خرید لیتا ہے۔ Non-custodial۔ آپ کی keys آپ کی مشین پر رہتی ہیں۔ آپ حد لگائیں، وہ اسے نافذ کرتا ہے۔",
      },
      {
        label: "ٹریڈنگ",
        title: "ڈیٹا خریدو۔ ٹیپ پڑھو۔ فیصلہ کرو۔",
        desc: "پوچھیے ”BTC کیسا لگ رہا ہے؟“ اور Franklin لائیو قیمتیں خریدتا ہے، RSI، MACD، Bollinger، اور volatility مقامی طور پر حساب لگاتا ہے، پھر سگنل لوٹاتا ہے۔ ایک prompt۔ نہ پانچ براؤزر ٹیبز، نہ API key کی الجھن۔",
      },
      {
        label: "Smart Router",
        title: "55+ ماڈلز۔ وہ چنتا ہے۔ آپ بچاتے ہیں۔",
        desc: "کوئی ایک ماڈل ہر کام میں بہترین نہیں۔ Router ہر درخواست کی درجہ بندی کرتا ہے اور ایک ملی سیکنڈ سے کم میں rout کر دیتا ہے۔ 20 لاکھ سے زائد حقیقی درخواستوں پر تربیت یافتہ، Elo سے مسلسل scored، آپ کے overrides سے ڈھلتا ہے۔ ہمیشہ-Opus کے مقابلے میں 89% تک بچت۔",
      },
      {
        label: "آپ کو سیکھتا ہے",
        title: "ہر سیشن کے ساتھ ذہین تر۔",
        desc: "Claude Code ایک رن سے دوسرے رن تک سب بھول جاتا ہے۔ Franklin ترجیحات نکالتا ہے — زبان، اسلوب، ماڈل کے انتخاب، ورک فلو — اور انہیں اگلے سیشن میں شامل کر دیتا ہے۔ تصدیق شدہ نمونے اعتماد پاتے ہیں۔ بے کار 30 دن میں مدھم پڑ جاتے ہیں۔",
      },
    ],
  },

  getStarted: {
    eyebrow: "قیمت · انسٹال · فنڈ",
    titlePre: "بل صرف",
    titleEm: "نتیجے",
    titleAfterEm: "کا،",
    titlePost: "اور کسی شے کا نہیں۔",
    yopoLabel: "آپ صرف نتیجے کا بل دیتے ہیں · YOPO",
    yopoTitle: "Provider کی لاگت + 5%، ہر action پر دستخط شدہ۔",
    yopoBody:
      "نہ کوئی subscription (رسائی کا کوئی بل نہیں)۔ نہ pay-per-call (ناکام کوششوں کا کوئی بل نہیں)۔ والیٹ کا بیلنس ہی سخت حد ہے۔ صفر پر پہنچتے ہی Franklin رک جاتا ہے۔ بس یہی پوری قیمت کا ماڈل ہے۔",
    steps: [
      {
        title: "انسٹال کریں",
        body: "ایک npm کمانڈ۔ Node 20+۔ macOS، Linux، WSL۔",
      },
      {
        title: "مفت چلائیں",
        body: "بکس کے باہر مفت NVIDIA Nemotron اور DeepSeek V4 Flash۔ والیٹ کی ضرورت نہیں۔",
      },
      {
        title: "فنڈ کریں ($5 کافی ہیں)",
        body: "Base یا Solana والیٹ بنائیں۔ USDC بھیجیں۔ ہر frontier ماڈل کھول لیں۔",
      },
      {
        title: "نتیجہ بتائیں",
        body: "کوڈ، ٹریڈ، تحقیق، تخلیق — Franklin چنتا ہے، ادا کرتا ہے، رپورٹ دیتا ہے، رک جاتا ہے۔",
      },
    ],
    ctaInstall: "npm سے انسٹال کریں",
    ctaGitHub: "GitHub پر دیکھیں",
    slashEyebrow: "Slash کمانڈز · 18 بلٹ ان",
    slashDescs: [
      "انٹرایکٹو picker یا براہِ راست سوئچ",
      "پہلے صرف-پڑھنے کی پلاننگ، پھر execute",
      "مشکل مسائل کے لیے گہری استدلال",
      "structured context کمپریشن",
      "کوڈ بیس میں سرچ",
      "گزشتہ سیشنز پر full-text سرچ",
      "کوئی بھی سیشن دیکھیں یا بحال کریں",
      "Git ورک فلو کے ہیلپرز",
      "ایک ہی بار میں جائزہ، بگ فکس، ٹیسٹ",
      "سیشن کا خرچ + ایڈریس + بیلنس",
      "خرچ کی تفصیل اور رجحانات",
      "Franklin نے آپ کے بارے میں کیا سیکھا",
    ],
  },

  compare: {
    eyebrow: "حساب کا کھاتہ",
    titleTop: "ایک میز میں،",
    titleBottom: "صاف بات۔",
    intro:
      "AI پروڈکٹس رسائی بیچتے ہیں۔ Subscriptions ماہانہ ندامت اور rate limits دیتی ہیں۔ Pay-per-call ہر ناکام کوشش کا بل بھیجتا ہے۔ Franklin صرف نتیجے کا حساب چکاتا ہے — ایک بار، USDC میں۔",
    headers: {
      saas: "Subscription SaaS",
      ppc: "Pay-per-call API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "آپ بل دیتے ہیں",
        saas: "رسائی کا، چاہے استعمال ہو یا نہ ہو",
        ppc: "ہر کوشش کا، بشمول بے نتیجہ کے",
        franklin: "نتیجے کا۔ بس ایک بار۔",
      },
      {
        label: "ماہانہ فیس",
        saas: "$20 — $200",
        ppc: "$0، اوپر سے استعمال",
        franklin: "$0۔ صرف وہی جو خرچ کریں۔",
      },
      {
        label: "Rate limits",
        saas: "ہاں۔ سب سے زیادہ ضرورت پر سختی۔",
        ppc: "Per-key کوٹے، tiers",
        franklin: "کچھ نہیں۔ والیٹ کا بیلنس ہی واحد حد۔",
      },
      {
        label: "شناخت",
        saas: "ای میل + کریڈٹ کارڈ",
        ppc: "Vendor اکاؤنٹ، ہر ماڈل کے لیے API keys",
        franklin: "ایک والیٹ۔ نہ ای میل، نہ KYC۔",
      },
      {
        label: "ماڈل کا انتخاب",
        saas: "ایک ہی vendor",
        ppc: "آپ 12 keys سنبھالتے ہیں",
        franklin: "ایک والیٹ سے 55+ ماڈلز · فیصلہ router کا۔",
      },
      {
        label: "Provider بند",
        saas: "آپ رک گئے۔",
        ppc: "آپ رک گئے۔",
        franklin: "اگلے provider پر rout ہو جاتا ہے۔",
      },
      {
        label: "Overdraft کا خطرہ",
        saas: "خاموش auto-renew",
        ppc: "ماہ کے آخر پر بے قابو بل",
        franklin: "کوئی نہیں۔ والیٹ خالی ⇒ Franklin رک جاتا ہے۔",
      },
      {
        label: "ماخذ",
        saas: "بند",
        ppc: "بند SDK",
        franklin: "Apache 2.0 · local-first۔",
      },
    ],
  },

  openSource: {
    eyebrow: "مشترک ورثہ · Apache 2.0",
    titleTop: "ہر چیز کے مالک",
    titleEm: "آپ ہیں",
    labels: [
      { k: "آپ کا ڈیٹا", v: "~/.blockrun/" },
      { k: "آپ کا والیٹ", v: "Private keys · مقامی" },
      { k: "آپ کے ماڈلز", v: "55+ · ایک کمانڈ سے سوئچ" },
      { k: "آپ کا لائسنس", v: "Apache 2.0" },
      { k: "آپ کا uptime", v: "Fork کریں۔ خود host کریں۔" },
    ],
    paragraphs: [
      "بند AI ٹولز میں vendor آپ کے استعمال کے ڈیٹا، ترجیحات، اور تاریخ کا مالک ہوتا ہے۔ وہ شرائط بدلتے ہیں — آپ مانتے ہیں۔ وہ قیمت بڑھاتے ہیں — آپ دیتے ہیں۔ وہ بند ہو جائیں — آپ رک جاتے ہیں۔",
      "Franklin Apache 2.0 ہے اور آپ کی مشین پر چلتا ہے۔ والیٹ keys، سیشن تاریخ، سیکھے ہوئے نمونے — سب ~/.blockrun/ میں رہتے ہیں۔ Zero telemetry۔ کچھ بھی گھر فون نہیں کرتا۔",
      "اگر BlockRun کل غائب ہو جائے، آپ کا USDC آپ کے والیٹ میں رہے گا اور ایجنٹ پھر بھی چلتا رہے گا۔ یہی ساری بات ہے۔",
    ],
    smallParagraph:
      "ہر سطر پڑھیں: پورا ایجنٹ لوپ، 16 بلٹ ان tools، plugin SDK، x402 client، router — سب repo میں موجود ہے۔ آڈٹ کریں، fork کریں، اپنا vertical لانچ کریں۔",
  },

  blog: {
    eyebrow: "ترسیلات",
    titleTop: "ورک بینچ",
    titleEm: "سے",
    intro:
      "ملٹی ماڈل کوڈنگ ایجنٹس، wallet-native AI، اور بغیر گلوبل کریڈٹ کارڈ کے ڈویلپرز کے لیے frontier ماڈلز پر نوٹس۔",
    allPosts: "تمام پوسٹس →",
  },

  faq: {
    eyebrow: "استفسارات",
    titleTop: "سوالات،",
    titleEm: "جوابات",
    intro:
      "خود مختار اقتصادی ایجنٹ کا ماڈل، صاف اردو میں۔ کوئی گول مول بات نہیں۔",
    items: [
      {
        q: "یہ Claude Code یا Cursor سے کیسے مختلف ہے؟",
        a: "وہ بہترین کوڈ لکھتے ہیں۔ پیسے خرچ نہیں کر سکتے۔ نہ trading ڈیٹا خرید سکتے ہیں، نہ API calls کا بل دے سکتے ہیں، نہ تصویر بنانے کی فیس، نہ web-search کا حساب۔ Franklin یہ سب کر سکتا ہے — کیونکہ اس کے پاس USDC والیٹ ہے اور وہ x402 کے ذریعے ہر action کا بل دیتا ہے۔ کوڈنگ کی ذہانت تو بنیادی شرط ہے؛ اقتصادی خود مختاری اصل زمرہ ہے۔",
      },
      {
        q: "”والیٹ والا ایجنٹ“ کا اصل میں مطلب کیا ہے؟",
        a: "Franklin USDC رکھتا ہے، Base یا Solana پر۔ جب اسے ماڈل، ڈیٹا فیڈ، یا کوئی سروس چاہیے ہو، وہ EIP-712 micropayment پر دستخط کرتا ہے اور ادا کر دیتا ہے۔ بجٹ آپ طے کرتے ہیں؛ Franklin اسے نافذ کرتا ہے۔ ہر پیسہ real-time میں ٹریک ہوتا ہے۔ نہ subscriptions، نہ API keys، نہ billing portals۔",
      },
      {
        q: "Franklin کن چیزوں پر خرچ کر سکتا ہے؟",
        a: "55+ AI ماڈلز (Claude، GPT، Gemini، Grok، DeepSeek، Kimi، وغیرہ)، تصویر سازی (DALL·E، Nano Banana، Grok Imagine)، ویڈیو سازی، Exa neural ویب سرچ، prediction-market ڈیٹا (Polymarket، Kalshi)، X / Twitter intelligence، موسیقی۔ Smart Router ہر کام کا بہترین ماڈل چنتا ہے — ہمیشہ-Opus کے مقابلے میں 89% تک بچت۔",
      },
      {
        q: "اس کی قیمت کتنی ہے؟",
        a: "YOPO — آپ صرف نتیجے کا بل دیتے ہیں۔ Provider کی لاگت + 5%، ہر call پر USDC میں settle۔ سادہ سوال: ~$0.001۔ کوڈنگ سیشن: $0.02–$0.10۔ 30 منٹ کا گہرا سیشن: $0.10–$0.50۔ نہ subscriptions، نہ ماہانہ فیس، نہ rate limits۔ مفت NVIDIA ماڈلز ہمیشہ بغیر قیمت دستیاب ہیں — والیٹ کی بھی ضرورت نہیں۔",
      },
      {
        q: "کیا یہ واقعی میرا انداز سیکھتا ہے؟",
        a: "ہاں۔ ہر سیشن کے بعد Franklin ترجیحات نکالتا ہے — زبان، اسلوب، ماڈل کے انتخاب، ورک فلو — اور انہیں اگلے رن میں شامل کرتا ہے۔ تصدیق شدہ ترجیحات اعتماد پاتی ہیں۔ بے کار 30 دن میں مدھم۔ /learnings چلائیں اور دیکھیں کہ اسے کیا معلوم ہے۔",
      },
      {
        q: "کیا میرا ڈیٹا نجی ہے؟",
        a: "سب کچھ مقامی طور پر ~/.blockrun/ میں رہتا ہے۔ سیشن تاریخ، سیکھے ہوئے نمونے، والیٹ keys — کچھ بھی گھر فون نہیں کرتا۔ Zero telemetry، zero crash reporting۔ آپ کی private keys کبھی مشین سے باہر نہیں جاتیں۔ کوڈ Apache 2.0 ہے — ہر سطر آڈٹ کریں۔",
      },
      {
        q: "کیا میں اسے مفت استعمال کر سکتا ہوں؟",
        a: "ہاں۔ مفت NVIDIA ماڈلز (Nemotron، DeepSeek V4 Flash) بغیر والیٹ، بغیر USDC، بغیر سائن اپ کے کام کرتے ہیں۔ والیٹ صرف تب فنڈ کریں جب Sonnet، Opus، GPT، Gemini، Grok، یا paid tools چاہیں۔",
      },
      {
        q: "Base اور Solana ہی کیوں؟",
        a: "تیز finality، نہ ہونے کے برابر فیس، پختہ USDC سپورٹ، اور دونوں پر حقیقی x402 ایکو سسٹم۔ سیٹ اپ پر چن لیں اور کسی بھی وقت سوئچ کر لیں۔ ایک ہی والیٹ UX، ایک ہی ماڈلز، مختلف rails۔",
      },
    ],
  },

  footer: {
    tagline:
      "وہ AI ایجنٹ جس کے پاس والیٹ ہے۔ یہ آپ کا USDC رکھتا ہے اور نتائج کے لیے خرچ کرتا ہے۔ Apache 2.0۔",
    aboutPre: "ایک",
    aboutLink: "BlockRun.ai",
    aboutPost: "پروڈکٹ۔ x402 micropayment پروٹوکول سے چلتی ہے۔",
    ctaGetStarted: "شروع کریں",
    colProduct: "پروڈکٹ",
    colResources: "وسائل",
    colCommunity: "کمیونٹی",
    linkFeatures: "خصوصیات",
    linkCompare: "موازنہ",
    linkGetStarted: "شروع کریں",
    linkNpm: "npm",
    linkDocs: "دستاویزات",
    linkBlog: "بلاگ",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 پروٹوکول",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai۔ جملہ حقوق محفوظ ہیں۔",
    bottomRight: "BlockRun.ai کا خود مختار اقتصادی ایجنٹ",
  },

  localeSwitcherLabel: "زبان:",

  meta: {
    title: "Franklin — والیٹ والا AI ایجنٹ",
    description:
      "وہ AI ایجنٹ جس کے پاس والیٹ ہے۔ یہ آپ کا USDC رکھتا ہے اور آپ کے لیے خرچ کرتا ہے — 55+ ماڈلز، trading ڈیٹا، تصویر سازی، ویڈیو سازی، ویب سرچ۔ ایک والیٹ، کوئی API keys نہیں۔ Open source۔",
    ogTitle: "Franklin — والیٹ والا AI ایجنٹ",
    ogDescription:
      "دوسرے ایجنٹ کوڈ لکھتے ہیں۔ Franklin کوڈ لکھتا ہے اور کام مکمل کرنے کے لیے پیسے خرچ کرتا ہے۔ 55+ ماڈلز، trading ڈیٹا، تصویر سازی، ویب سرچ — ایک USDC والیٹ۔ Open source۔",
    twitterTitle: "Franklin — والیٹ والا AI ایجنٹ",
    twitterDescription:
      "وہ AI ایجنٹ جس کے پاس والیٹ ہے۔ 55+ ماڈلز، trading ڈیٹا، تصویر سازی — یہ آپ کا USDC رکھتا ہے اور آپ کے لیے خرچ کرتا ہے۔ Open source۔",
  },
};
