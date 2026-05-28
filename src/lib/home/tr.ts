import type { HomeDict } from "./types";

/**
 * Türkçe — franklin.run ana sayfa kopyası.
 *
 * Marka, protokol ve model isimleri (Franklin, BlockRun, USDC, Base, Solana,
 * x402, YOPO, kimi-k2.6 vb.) İngilizce olarak korunur. Kod parçacıkları ve
 * slash komut isimleri evrenseldir, çevrilmez.
 */
export const tr: HomeDict = {
  nav: {
    features: "Özellikler",
    compare: "Karşılaştır",
    blog: "Blog",
    docs: "Dokümanlar",
    tryFranklin: "Franklin'i Dene",
    github: "GitHub",
    getStarted: "Başla",
  },

  hero: {
    eyebrow: "Otonom Ekonomik Ajan",
    titleLine1: "AI ajanı,",
    titleLine2Pre: "artık bir",
    titleLine2Em: "cüzdanı",
    titleLine2Post: " var.",
    subPre: "Diğer ajanlar kod yazar. Franklin kod yazar",
    subEm: "ve para harcar",
    subPost:
      "— işi bitirmek için: modeller, veri, görseller, arama. Bütçeyi siz koyarsınız. O çalıştırır.",
    ctaPrimary: "Ücretsiz Başla",
    ctaSecondary: "GitHub'da Star Ver",
    copyInstallAriaLabel: "Kurulum komutunu kopyala",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "Ağ üzerinde USDC:",
    pillX402Before: "Yerel",
    termAbort: "iptal için esc",
  },

  features: {
    eyebrow: "Dört Bölüm",
    titleTop: "Bir cüzdanın",
    titleEm: "değiştirdiği",
    introPre: "Kod zekâsı artık asgari şart. Asıl fark",
    introEm: "satın alma gücü",
    introPost:
      "— ve kendi defterini kapatmak zorunda olan bir ajanın getirdiği sessiz disiplin.",
    cards: [
      {
        label: "Cüzdan",
        title: "Para harcayabilen yazılım.",
        desc: "Franklin, Base veya Solana üzerinde USDC tutar. Bir modele, veri akışına ya da görsele ihtiyaç duyduğunda — ödemeyi imzalar ve alır. Non-custodial. Anahtarlar makinenizden çıkmaz. Limiti siz koyarsınız; o uygular.",
      },
      {
        label: "Trading",
        title: "Veriyi al. Tape'i oku. Karar ver.",
        desc: "“BTC nasıl görünüyor?” diye sorun; Franklin canlı fiyatları satın alır, RSI, MACD, Bollinger ve volatiliteyi yerelde hesaplar, sinyali döner. Tek prompt. Ne beş tarayıcı sekmesi, ne API anahtarı spagettisi.",
      },
      {
        label: "Smart Router",
        title: "60+ model. O seçer. Siz kazanırsınız.",
        desc: "Tek bir model her şeyde en iyi değildir. Router, her isteği milisaniyenin altında sınıflandırır ve yönlendirir. 2M+ gerçek istekte eğitildi, sürekli Elo ile puanlanır, sizin override'larınıza uyum sağlar. Hep-Opus'a karşı %89'a varan tasarruf.",
      },
      {
        label: "Sizi Öğrenir",
        title: "Her oturumda akıllanır.",
        desc: "Claude Code oturumlar arasında unutur. Franklin tercihleri çıkarır — dil, stil, model seçimleri, iş akışı — ve bir sonraki oturuma enjekte eder. Doğrulanan örüntüler güven kazanır. Eskiyen örüntüler 30 günde söner.",
      },
    ],
  },

  getStarted: {
    eyebrow: "Fiyat · Kurulum · Yükle",
    titlePre: "Sadece",
    titleEm: "sonuç",
    titleAfterEm: " için ödeyin,",
    titlePost: "başka hiçbir şey için değil.",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Sağlayıcı maliyeti + %5, eylem başına imzalı.",
    yopoBody:
      "Abonelik yok (erişim için ödemezsiniz). Çağrı başına ücret yok (başarısız denemeler için ödemezsiniz). Cüzdan bakiyesi sert tavandır. Sıfıra indiğinde Franklin durur. Tüm fiyatlandırma modeli bu.",
    steps: [
      {
        title: "Kur",
        body: "Tek npm komutu. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "Ücretsiz çalıştır",
        body: "Kutudan ücretsiz NVIDIA Nemotron ve DeepSeek V4 Flash. Cüzdan gerekmez.",
      },
      {
        title: "Yükle (5$ fazlasıyla yeter)",
        body: "Base veya Solana cüzdanı oluştur. USDC gönder. Tüm frontier modelleri aç.",
      },
      {
        title: "Sonucu söyle",
        body: "Kod, trade, araştırma, üretim — Franklin seçer, öder, raporlar, durur.",
      },
    ],
    ctaInstall: "npm üzerinden kur",
    ctaGitHub: "GitHub'da görüntüle",
    slashEyebrow: "Slash Komutları · 18 yerleşik",
    slashDescs: [
      "İnteraktif seçici veya doğrudan geçiş",
      "Önce read-only planla, sonra çalıştır",
      "Zorlu problemler için derin akıl yürütme",
      "Yapılandırılmış bağlam sıkıştırma",
      "Kod tabanında ara",
      "Geçmiş oturumlarda tam metin arama",
      "Herhangi bir oturumu incele veya geri yükle",
      "Git iş akışı yardımcıları",
      "Tek atışta inceleme, bugfix, test",
      "Oturum harcaması + adres + bakiye",
      "Harcama dökümleri ve trendler",
      "Franklin'in öğrendikleri",
    ],
  },

  compare: {
    eyebrow: "Defter",
    titleTop: "Bir tabloda,",
    titleBottom: "açıkça.",
    intro:
      "AI ürünleri erişim satar. Abonelikler size aylık suçluluk ve rate limit verir. Çağrı başına ödeme her başarısız deneme için faturalar. Franklin sonuca göre mutabakat yapar — bir kez, USDC ile.",
    headers: {
      saas: "Abonelik SaaS",
      ppc: "Çağrı başına API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "Ödediğiniz şey",
        saas: "Erişim, kullansanız da kullanmasanız da",
        ppc: "Her deneme, çıkmaz sokaklar dahil",
        franklin: "Sonuç. Bir kez.",
      },
      {
        label: "Aylık ücret",
        saas: "20$ — 200$",
        ppc: "0$, artı kullanım",
        franklin: "0$. Sadece harcadığınızı ödersiniz.",
      },
      {
        label: "Rate limit",
        saas: "Var. En çok ihtiyacınız olduğunda sıkışır.",
        ppc: "Anahtar başına kota, kademeler",
        franklin: "Yok. Tek tavan cüzdan bakiyesi.",
      },
      {
        label: "Kimlik",
        saas: "E-posta + kredi kartı",
        ppc: "Sağlayıcı hesabı, model başına API anahtarları",
        franklin: "Bir cüzdan. E-posta yok, KYC yok.",
      },
      {
        label: "Model seçimi",
        saas: "Tek sağlayıcı",
        ppc: "12 anahtarı siz yönetirsiniz",
        franklin: "Tek cüzdanla 60+ model · router karar verir.",
      },
      {
        label: "Sağlayıcı kesintisi",
        saas: "Durdunuz.",
        ppc: "Durdunuz.",
        franklin: "Bir sonraki sağlayıcıya yönlendirir.",
      },
      {
        label: "Aşım riski",
        saas: "Sessiz otomatik yenileme",
        ppc: "Ay sonunda sınırsız fatura",
        franklin: "Yok. Cüzdan boş ⇒ Franklin durur.",
      },
      {
        label: "Kaynak",
        saas: "Kapalı",
        ppc: "Kapalı SDK",
        franklin: "Apache 2.0 · local-first.",
      },
    ],
  },

  openSource: {
    eyebrow: "Müşterekler · Apache 2.0",
    titleTop: "Her şey",
    titleEm: "sizin",
    labels: [
      { k: "Veriniz", v: "~/.blockrun/" },
      { k: "Cüzdanınız", v: "Özel anahtarlar · yerel" },
      { k: "Modelleriniz", v: "60+ · 1 komutla geçiş" },
      { k: "Lisansınız", v: "Apache 2.0" },
      { k: "Uptime'ınız", v: "Fork'la. Self-host et." },
    ],
    paragraphs: [
      "Kapalı AI araçlarında kullanım veriniz, tercihleriniz ve geçmişiniz sağlayıcının elindedir. Şartları değiştirir — kabul edersiniz. Fiyat artırır — ödersiniz. Düşerler — durursunuz.",
      "Franklin Apache 2.0 ve sizin makinenizde çalışır. Cüzdan anahtarları, oturum geçmişi, öğrenmeler — hepsi ~/.blockrun/ içinde. Sıfır telemetri. Hiçbir şey eve telefon etmez.",
      "BlockRun yarın yok olsa, USDC'niz cüzdanınızda kalır ve ajanınız çalışmaya devam eder. Mesele bu.",
    ],
    smallParagraph:
      "Her satırı okuyun: tüm ajan döngüsü, 16 yerleşik araç, plugin SDK, x402 client, router — hepsi repoda. Denetleyin, fork'layın, kendi dikeyinizi yayınlayın.",
  },

  blog: {
    eyebrow: "Notlar",
    titleTop: "Atölyeden",
    titleEm: "sahaya",
    intro:
      "Çok modelli kod ajanları, cüzdan-yerel AI ve uluslararası kredi kartı olmayan geliştiriciler için frontier modeller üzerine notlar.",
    allPosts: "Tüm yazılar →",
  },

  faq: {
    eyebrow: "Sorular",
    titleTop: "Sorular,",
    titleEm: "yanıtlar",
    intro:
      "Otonom ekonomik ajan modeli, açık dille. Lafı dolandırmadan.",
    items: [
      {
        q: "Bunun Claude Code veya Cursor'dan farkı ne?",
        a: "Onlar harika kod yazar. Para harcayamaz. Trading verisi alamaz, API çağrısı satın alamaz, görsel üretimi için ödeme yapamaz, web arama faturasını kapatamaz. Franklin yapar — çünkü bir USDC cüzdanı tutar ve x402 üzerinden eylem başına öder. Kod zekâsı asgari şart; ekonomik özerklik ise yepyeni bir kategori.",
      },
      {
        q: "“Cüzdanı olan ajan” aslında ne demek?",
        a: "Franklin Base veya Solana üzerinde USDC tutar. Bir modele, veri akışına ya da hizmete ihtiyaç duyduğunda EIP-712 mikroödemesini imzalar ve öder. Bütçeyi siz koyarsınız; Franklin uygular. Her cent gerçek zamanlı izlenir. Abonelik yok, API anahtarı yok, faturalama portalı yok.",
      },
      {
        q: "Franklin neye harcayabilir?",
        a: "60+ AI modeli (Claude, GPT, Gemini, Grok, DeepSeek, Kimi vb.), görsel üretimi (GPT Image, Nano Banana, Grok Imagine), video üretimi, Exa nöral web araması, prediction-market verisi (Polymarket, Kalshi), X / Twitter zekâsı, müzik üretimi. Smart Router her görev için en iyi modeli seçer — hep-Opus'a karşı %89'a varan tasarruf.",
      },
      {
        q: "Fiyatı ne?",
        a: "YOPO — You Only Pay Outcome. Sağlayıcı maliyeti + %5, USDC ile çağrı başına mutabakat. Basit soru: ~0,001$. Kod oturumu: 0,02$–0,10$. 30 dakikalık derin oturum: 0,10$–0,50$. Abonelik yok, aylık ücret yok, rate limit yok. Ücretsiz NVIDIA modelleri her zaman sıfır maliyetle hazır — cüzdan gerekmez.",
      },
      {
        q: "Gerçekten nasıl çalıştığımı öğreniyor mu?",
        a: "Evet. Her oturumdan sonra Franklin tercihleri çıkarır — dil, stil, model seçimleri, iş akışı — ve bir sonraki çalıştırmaya enjekte eder. Doğrulanan tercihler güven kazanır. Eskiyenler 30 günde söner. Ne bildiğini görmek için /learnings çalıştırın.",
      },
      {
        q: "Verim gizli mi?",
        a: "Her şey ~/.blockrun/ içinde yerel kalır. Oturum geçmişi, öğrenmeler, cüzdan anahtarları — hiçbiri eve telefon etmez. Sıfır telemetri, sıfır crash raporu. Özel anahtarlarınız makinenizden çıkmaz. Kod Apache 2.0 — her satırı denetleyin.",
      },
      {
        q: "Ücretsiz kullanabilir miyim?",
        a: "Evet. Ücretsiz NVIDIA modelleri (Nemotron, DeepSeek V4 Flash) cüzdansız, USDC'siz, kayıt olmadan çalışır. Sonnet, Opus, GPT, Gemini, Grok ya da ücretli araçlar isterseniz cüzdanı yüklersiniz.",
      },
      {
        q: "Neden Base ve Solana?",
        a: "Hızlı kesinleşme, ihmal edilebilir ücretler, olgun USDC desteği ve her ikisinde de gerçek bir x402 ekosistemi. Kurulumda seçersiniz, dilediğiniz zaman değiştirirsiniz. Aynı cüzdan UX'i, aynı modeller, farklı raylar.",
      },
    ],
  },

  footer: {
    tagline:
      "Cüzdanı olan AI ajanı. USDC'nizi tutar ve sonuçlar için harcar. Apache 2.0.",
    aboutPre: "Bir",
    aboutLink: "BlockRun.ai",
    aboutPost: "ürünü. x402 mikroödeme protokolüyle çalışır.",
    ctaGetStarted: "Başla",
    colProduct: "Ürün",
    colResources: "Kaynaklar",
    colCommunity: "Topluluk",
    linkFeatures: "Özellikler",
    linkCompare: "Karşılaştır",
    linkGetStarted: "Başla",
    linkNpm: "npm",
    linkDocs: "Dokümantasyon",
    linkBlog: "Blog",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 Protokolü",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. Tüm hakları saklıdır.",
    bottomRight: "BlockRun.ai tarafından otonom ekonomik ajan",
  },

  localeSwitcherLabel: "Dil:",

  meta: {
    title: "Franklin — Cüzdanı Olan AI Ajanı",
    description:
      "Cüzdanı olan AI ajanı. USDC'nizi tutar ve sizin için harcar — 60+ model, trading verisi, görsel üretimi, video üretimi, web araması. Tek cüzdan, API anahtarı yok. Açık kaynak.",
    ogTitle: "Franklin — Cüzdanı Olan AI Ajanı",
    ogDescription:
      "Diğer ajanlar kod yazar. Franklin kod yazar ve işi bitirmek için para harcar. 60+ model, trading verisi, görsel üretimi, web araması — tek USDC cüzdanı. Açık kaynak.",
    twitterTitle: "Franklin — Cüzdanı Olan AI Ajanı",
    twitterDescription:
      "Cüzdanı olan AI ajanı. 60+ model, trading verisi, görsel üretimi — USDC'nizi tutar ve sizin için harcar. Açık kaynak.",
  },
};
