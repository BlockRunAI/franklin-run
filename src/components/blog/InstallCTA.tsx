import Link from "next/link";
import type { Locale } from "@/lib/blog";

interface InstallCTAProps {
  locale: Locale;
}

const COPY: Record<
  Locale,
  { eyebrow: string; title: string; sub: string; install: string; github: string }
> = {
  en: {
    eyebrow: "Try it now",
    title: "Install Franklin",
    sub: "Two commands. Free tier runs immediately. Wallet self-generates.",
    install: "Install command",
    github: "Source on GitHub →",
  },
  "zh-CN": {
    eyebrow: "现在就试",
    title: "安装 Franklin",
    sub: "两条命令。免费档立即运行，钱包自动生成。",
    install: "安装命令",
    github: "GitHub 源代码 →",
  },
  ja: {
    eyebrow: "今すぐ試す",
    title: "Franklin をインストール",
    sub: "コマンド二つ。無料枠が即時動く。ウォレットは自動生成。",
    install: "インストールコマンド",
    github: "GitHub ソース →",
  },
  ko: {
    eyebrow: "지금 시도",
    title: "Franklin 설치",
    sub: "두 명령어. 무료 티어가 즉시 작동. 지갑은 자동 생성.",
    install: "설치 명령어",
    github: "GitHub 소스 →",
  },
  ru: {
    eyebrow: "Попробовать сейчас",
    title: "Установить Franklin",
    sub: "Две команды. Бесплатный тир работает сразу. Кошелёк создаётся автоматически.",
    install: "Команда установки",
    github: "Исходник на GitHub →",
  },
  id: {
    eyebrow: "Coba sekarang",
    title: "Install Franklin",
    sub: "Dua perintah. Tier gratis langsung jalan. Dompet generate sendiri.",
    install: "Perintah instalasi",
    github: "Sumber di GitHub →",
  },
  ar: {
    eyebrow: "جرّب الآن",
    title: "تثبيت Franklin",
    sub: "أمران فقط. الدرجة المجانية تعمل فورًا. المحفظة تتولّد تلقائيًا.",
    install: "أمر التثبيت",
    github: "المصدر على GitHub ←",
  },
  hi: {
    eyebrow: "अभी आज़माएँ",
    title: "Franklin install करें",
    sub: "दो commands। Free tier तुरंत चलता है। Wallet ख़ुद generate होता है।",
    install: "Install command",
    github: "GitHub पर source →",
  },
  ur: {
    eyebrow: "ابھی آزمائیں",
    title: "Franklin انسٹال کریں",
    sub: "دو کمانڈز۔ مفت ٹیئر فوراً چلتا ہے۔ والیٹ خود بن جاتا ہے۔",
    install: "انسٹال کمانڈ",
    github: "GitHub پر سورس ←",
  },
  "pt-BR": {
    eyebrow: "Experimente agora",
    title: "Instalar o Franklin",
    sub: "Dois comandos. Tier grátis roda na hora. A carteira se gera sozinha.",
    install: "Comando de instalação",
    github: "Fonte no GitHub →",
  },
  vi: {
    eyebrow: "Thử ngay",
    title: "Cài đặt Franklin",
    sub: "Hai lệnh. Tier miễn phí chạy ngay. Ví tự sinh.",
    install: "Lệnh cài đặt",
    github: "Mã nguồn trên GitHub →",
  },
  tr: {
    eyebrow: "Şimdi dene",
    title: "Franklin'i kur",
    sub: "İki komut. Bedava katman hemen çalışır. Cüzdan kendiliğinden oluşur.",
    install: "Kurulum komutu",
    github: "GitHub'da kaynak →",
  },
  fa: {
    eyebrow: "همین حالا امتحان کن",
    title: "نصب Franklin",
    sub: "دو دستور. لایه رایگان فوراً اجرا می‌شود. کیف پول خودش تولید می‌شود.",
    install: "دستور نصب",
    github: "منبع در GitHub ←",
  },
};

export function InstallCTA({ locale }: InstallCTAProps) {
  const t = COPY[locale] ?? COPY.en;
  return (
    <div
      style={{
        position: "relative",
        margin: "64px 0 32px",
        padding: "32px 36px",
        background:
          "linear-gradient(135deg, rgba(13,31,23,0.96) 0%, rgba(10,24,18,1) 45%, rgba(13,31,23,0.96) 100%)",
        color: "var(--paper-shade)",
        border: "1px solid rgba(201,162,39,0.4)",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow:
          "0 30px 60px -30px rgba(10,13,18,0.5), 0 2px 0 0 rgba(201,162,39,0.18)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,162,39,0.06) 0, transparent 45%), repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 14px, rgba(201,162,39,0.04) 14px, rgba(201,162,39,0.04) 15px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(201,162,39,0.85)",
            marginBottom: 12,
          }}
        >
          {t.eyebrow}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 32,
            lineHeight: 1.1,
            color: "#fff",
            margin: 0,
          }}
        >
          {t.title}
        </h3>
        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(242,233,212,0.78)",
            margin: "12px 0 24px",
          }}
        >
          {t.sub}
        </p>
        <div
          dir="ltr"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(201,162,39,0.25)",
            borderRadius: 4,
            padding: "14px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "#10b981",
            overflowX: "auto",
            textAlign: "left",
          }}
        >
          <span style={{ color: "rgba(201,162,39,0.6)" }}>$ </span>
          npm install -g @blockrun/franklin
          <br />
          <span style={{ color: "rgba(201,162,39,0.6)" }}>$ </span>
          franklin
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <a
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "var(--gold-hi)",
              borderBottom: "1px solid var(--gold-dim)",
              paddingBottom: 3,
              textDecoration: "none",
            }}
          >
            {t.github}
          </a>
          <Link
            href="/docs/getting-started/installation"
            style={{
              color: "rgba(242,233,212,0.6)",
              borderBottom: "1px solid rgba(242,233,212,0.2)",
              paddingBottom: 3,
              textDecoration: "none",
            }}
          >
            /docs/getting-started/installation
          </Link>
        </div>
      </div>
    </div>
  );
}
