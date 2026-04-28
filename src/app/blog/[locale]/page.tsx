import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { LocaleSwitcher } from "@/components/blog/LocaleSwitcher";
import { HtmlLangSync } from "@/components/blog/HtmlLangSync";
import {
  LOCALES,
  LOCALE_META,
  blogIndexUrl,
  getPostsByLocale,
  isValidLocale,
  isRTL,
  type Locale,
} from "@/lib/blog";

const SITE_URL = "https://franklin.run";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const meta = LOCALE_META[locale];
  const titles: Record<Locale, string> = {
    en: "Dispatches — Franklin",
    "zh-CN": "Franklin 速递 — 让你的智能体自己付钱",
    ja: "Franklin ディスパッチ — マルチモデル AI エージェント",
    ko: "Franklin 디스패치 — 멀티모델 AI 에이전트",
    ru: "Franklin Dispatches — мульти-модельный AI агент",
    id: "Franklin Dispatches — Agen AI multi-model",
    ar: "فرانكلين — وكيل ذكاء اصطناعي متعدد النماذج",
    hi: "Franklin डिस्पैच — मल्टी-मॉडल AI एजेंट",
    ur: "فرینکلن — کثیر النمونہ AI ایجنٹ",
    "pt-BR": "Franklin Dispatches — Agente AI multi-modelo",
    vi: "Franklin Dispatches — AI agent đa mô hình",
    tr: "Franklin Dispatches — çok modelli AI ajanı",
    fa: "فرانکلین — عامل هوش مصنوعی چند مدلی",
  };
  const descriptions: Record<Locale, string> = {
    en: "Field notes on multi-model coding agents, wallet-native AI, and frontier models for the half of the world without a credit card.",
    "zh-CN":
      "多模型 coding agent、钱包原生的 AI、以及为没有全球信用卡的开发者打开的前沿大模型入口。",
    ja: "マルチモデルのコーディングエージェント、ウォレットネイティブな AI、そしてクレジットカードを持たない世界の半分のための最前線モデルについての現場ノート。",
    ko: "멀티모델 코딩 에이전트, 지갑 네이티브 AI, 그리고 신용카드 없이도 사용할 수 있는 최전선 모델에 대한 현장 노트.",
    ru: "Полевые заметки о мульти-модельных AI агентах, кошельковой идентичности и фронтирных моделях для половины мира без кредитки.",
    id: "Catatan lapangan tentang agen AI multi-model, identitas berbasis dompet, dan model frontier untuk separuh dunia tanpa kartu kredit.",
    ar: "ملاحظات ميدانية عن وكلاء البرمجة متعددي النماذج، الذكاء الاصطناعي القائم على المحفظة، ونماذج الجبهة الأمامية لنصف العالم بدون بطاقة ائتمان.",
    hi: "मल्टी-मॉडल कोडिंग एजेंट्स, वॉलेट-नेटिव AI, और बिना क्रेडिट कार्ड वाली दुनिया के लिए फ्रंटियर मॉडल्स पर फ़ील्ड नोट्स।",
    ur: "کثیر النمونہ کوڈنگ ایجنٹس، والیٹ پر مبنی AI، اور بغیر کریڈٹ کارڈ والی آدھی دنیا کے لیے فرنٹیئر ماڈلز پر فیلڈ نوٹس۔",
    "pt-BR":
      "Notas de campo sobre agentes de código multi-modelo, IA com carteira nativa, e modelos de fronteira para metade do mundo sem cartão de crédito.",
    vi: "Ghi chú thực địa về AI agent đa mô hình, AI ví-bản-địa, và các mô hình tiên phong dành cho nửa thế giới không có thẻ tín dụng.",
    tr: "Çok modelli kodlama ajanları, cüzdan-yerli AI ve kredi kartı olmayan yarım dünya için sınır modeller hakkında saha notları.",
    fa: "یادداشت‌های میدانی در مورد عامل‌های کدنویسی چند مدلی، هوش مصنوعی مبتنی بر کیف پول، و مدل‌های پیشرو برای نیمی از جهان بدون کارت اعتباری.",
  };

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[LOCALE_META[l].htmlLang] = `${SITE_URL}${blogIndexUrl(l)}`;
  }
  languages["x-default"] = `${SITE_URL}${blogIndexUrl("en")}`;

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: blogIndexUrl(locale),
      languages,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${blogIndexUrl(locale)}`,
      title: titles[locale],
      description: descriptions[locale],
      locale: meta.htmlLang,
      siteName: "Franklin",
    },
  };
}

export default async function BlogLocaleIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const posts = getPostsByLocale(locale);
  const headings: Record<Locale, { eyebrow: string; title: string; em: string; intro: string }> = {
    en: {
      eyebrow: "Dispatches",
      title: "From the",
      em: "bench",
      intro:
        "Notes on multi-model coding agents, wallet-native AI, and frontier models for developers without global credit cards.",
    },
    "zh-CN": {
      eyebrow: "速递",
      title: "来自",
      em: "工位",
      intro:
        "关于多模型 coding agent、钱包原生的 AI，以及为那些没有全球信用卡的开发者打开的前沿大模型入口。",
    },
    ja: {
      eyebrow: "ディスパッチ",
      title: "現場",
      em: "ノート",
      intro:
        "マルチモデルのコーディングエージェント、ウォレットネイティブな AI、そしてグローバルなクレジットカードを持たない開発者のための最前線モデル。",
    },
    ko: {
      eyebrow: "디스패치",
      title: "워크벤치",
      em: "노트",
      intro:
        "멀티모델 코딩 에이전트, 지갑 네이티브 AI, 그리고 글로벌 신용카드 없이 사용할 수 있는 최전선 모델에 대한 현장 노트.",
    },
    ru: {
      eyebrow: "Заметки",
      title: "Со",
      em: "стола",
      intro:
        "Заметки о мульти-модельных AI агентах, кошельковой идентичности и фронтирных моделях для разработчиков без глобальной кредитки.",
    },
    id: {
      eyebrow: "Catatan",
      title: "Dari",
      em: "bangku",
      intro:
        "Catatan tentang agen pengkodean multi-model, AI berbasis dompet, dan model frontier untuk pengembang tanpa kartu kredit global.",
    },
    ar: {
      eyebrow: "ملاحظات",
      title: "من",
      em: "الميدان",
      intro:
        "ملاحظات عن وكلاء البرمجة متعددي النماذج، الذكاء الاصطناعي القائم على المحفظة، ونماذج الجبهة الأمامية للمطورين بدون بطاقة ائتمان عالمية.",
    },
    hi: {
      eyebrow: "डिस्पैच",
      title: "वर्कबेंच से",
      em: "नोट्स",
      intro:
        "मल्टी-मॉडल कोडिंग एजेंट्स, वॉलेट-नेटिव AI, और बिना ग्लोबल क्रेडिट कार्ड वाले डेवलपर्स के लिए फ्रंटियर मॉडल्स पर नोट्स।",
    },
    ur: {
      eyebrow: "ڈسپیچز",
      title: "ورک بنچ سے",
      em: "نوٹس",
      intro:
        "کثیر النمونہ کوڈنگ ایجنٹس، والیٹ پر مبنی AI، اور بغیر گلوبل کریڈٹ کارڈ والے ڈویلپرز کے لیے فرنٹیئر ماڈلز پر نوٹس۔",
    },
    "pt-BR": {
      eyebrow: "Despachos",
      title: "Da",
      em: "bancada",
      intro:
        "Notas sobre agentes de código multi-modelo, IA com carteira nativa, e modelos de fronteira para desenvolvedores sem cartão de crédito global.",
    },
    vi: {
      eyebrow: "Ghi chú",
      title: "Từ",
      em: "bàn làm việc",
      intro:
        "Ghi chú về AI agent đa mô hình, AI ví-bản-địa, và các mô hình tiên phong cho lập trình viên không có thẻ tín dụng toàn cầu.",
    },
    tr: {
      eyebrow: "Saha Notları",
      title: "Çalışma",
      em: "tezgahından",
      intro:
        "Çok modelli kodlama ajanları, cüzdan-yerli AI ve küresel kredi kartı olmayan geliştiriciler için sınır modeller hakkında notlar.",
    },
    fa: {
      eyebrow: "یادداشت‌ها",
      title: "از",
      em: "میز کار",
      intro:
        "یادداشت‌هایی در مورد عامل‌های کدنویسی چند مدلی، هوش مصنوعی مبتنی بر کیف پول، و مدل‌های پیشرو برای توسعه‌دهندگانی که کارت اعتباری بین‌المللی ندارند.",
    },
  };
  const h = headings[locale];

  return (
    <>
      <HtmlLangSync
        lang={LOCALE_META[locale].htmlLang}
        dir={isRTL(locale) ? "rtl" : "ltr"}
      />
      <Header variant="paper" />
      <main>
        <section className="light grain">
          <div className="top-rule" />
          <div className="inner">
            <div className="blog-head">
              <div>
                <div className="eyebrow">
                  <span className="line" />
                  <span className="engraved">{h.eyebrow}</span>
                </div>
                <h2 className="section-h">
                  {h.title}
                  <br />
                  <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>
                    {h.em}
                  </em>
                  .
                </h2>
              </div>
              <div className="right">
                <p className="intro">{h.intro}</p>
                <LocaleSwitcher
                  current={locale}
                  available={[...LOCALES]}
                  hrefForLocale={(l) => blogIndexUrl(l)}
                />
              </div>
            </div>

            {posts.length === 0 ? (
              <div
                style={{
                  padding: "80px 0 120px",
                  textAlign: "center",
                  color: "rgba(10,13,18,0.5)",
                }}
              >
                <p style={{ fontSize: 16, marginBottom: 16 }}>
                  Translations in flight. Read in the meantime in:
                </p>
                <Link
                  href={blogIndexUrl("en")}
                  style={{
                    color: "var(--gold-dim)",
                    borderBottom: "1px solid var(--gold-dim)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    paddingBottom: 3,
                  }}
                >
                  English →
                </Link>
              </div>
            ) : (
              <div className="blog-grid">
                {posts.map((post, i) => (
                  <PostCard
                    key={post.frontmatter.slug}
                    post={post}
                    locale={locale}
                    index={i}
                    lead={post.frontmatter.lead || i === 0}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="bot-rule" />
        </section>
      </main>
      <Footer />
    </>
  );
}
