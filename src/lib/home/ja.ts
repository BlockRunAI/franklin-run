import type { HomeDict } from "./types";

export const ja: HomeDict = {
  nav: {
    features: "特徴",
    compare: "比較",
    blog: "ブログ",
    gallery: "ギャラリー",
    docs: "ドキュメント",
    tryFranklin: "Franklin を試す",
    github: "GitHub",
    getStarted: "はじめる",
  },

  hero: {
    eyebrow: "自律型エコノミックエージェント",
    titleLine1: "AI エージェント、",
    titleLine2Pre: "ただし",
    titleLine2Em: "ウォレット",
    titleLine2Post: "付き。",
    subPre: "他のエージェントはコードを書く。Franklin はコードを書き、",
    subEm: "お金を使って",
    subPost:
      "やり遂げる — モデル、データ、画像、検索。予算はあなたが決める。実行は Franklin に任せる。",
    ctaPrimary: "無料ではじめる",
    ctaSecondary: "GitHub でスター",
    copyInstallAriaLabel: "インストールコマンドをコピー",
    pillYopoSuffix: "成果にだけ支払う",
    pillUsdcBefore: "USDC on",
    pillX402Before: "ネイティブ対応",
    termAbort: "esc で中断",
  },

  trustBar: {
    builtOn: "基盤は",
    routesPrefix: "ルーティング先は",
    routesModels: "60+ のフロンティアモデル",
    providersPrefix: "提供元は",
  },

  terminalDemo: {
    eyebrow: "実行を見る",
    titlePre: "5つのタスク。",
    titleEm: "5回の実行。5枚のレシート。",
    sub:
      "実際の Franklin Agent セッション。各コマンドはルーティングされたモデルを呼び出し、USDC でコールごとに支払い、コストを出力する。",
  },

  features: {
    eyebrow: "四つの章",
    titleTop: "ウォレットが",
    titleEm: "変える",
    introPre: "コーディング能力はもう前提条件。差を生むのは",
    introEm: "購買力",
    introPost:
      "— そして、自分の帳簿を自分で合わせなければならないエージェントが身につける、静かな規律。",
    cards: [
      {
        label: "ウォレット",
        title: "お金を使えるソフトウェア。",
        desc: "Franklin は USDC を Base または Solana 上で保持する。モデル、データフィード、画像が必要になれば、自ら署名して支払う。ノンカストディアル。鍵はあなたの端末に残る。上限はあなたが設定し、Franklin がそれを守る。",
      },
      {
        label: "トレーディング",
        title: "データを買い、テープを読み、判断する。",
        desc: "「BTC はどう見える？」と尋ねれば、Franklin はリアルタイム価格を購入し、RSI・MACD・Bollinger・ボラティリティをローカルで計算してシグナルを返す。プロンプト一発。タブ五枚も API キーの絡まりもない。",
      },
      {
        label: "Smart Router",
        title: "60 以上のモデル。選ぶのはルーター。得をするのはあなた。",
        desc: "すべてに最強の単一モデルなど存在しない。ルーターはあらゆるリクエストを 1 ミリ秒未満で分類しルーティングする。200 万件超の実リクエストで訓練、Elo で継続的に採点、あなたの上書きにも適応。常に Opus と比べて最大 89% の節約。",
      },
      {
        label: "あなたを学ぶ",
        title: "セッションごとに賢くなる。",
        desc: "Claude Code は実行間で記憶を失う。Franklin は嗜好 — 言語、スタイル、モデル選択、ワークフロー — を抽出し、次のセッションに注入する。確認されたパターンは確信度が上がり、古いものは 30 日で減衰する。",
      },
    ],
  },

  getStarted: {
    eyebrow: "料金 · インストール · 入金",
    titlePre: "支払うのは",
    titleEm: "成果",
    titleAfterEm: "、",
    titlePost: "それ以外は何も。",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "プロバイダ原価 + 5%、アクションごとに署名。",
    yopoBody:
      "サブスクリプションなし（アクセスへの支払いはない）。コール毎課金もなし（失敗したリトライへの支払いはない）。ウォレット残高がハードキャップ。ゼロに達した瞬間、Franklin は止まる。料金体系はそれだけ。",
    steps: [
      {
        title: "インストール",
        body: "npm コマンド一つ。Node 20+。macOS、Linux、WSL に対応。",
      },
      {
        title: "無料で動かす",
        body: "NVIDIA Nemotron と DeepSeek V4 Flash を最初から無料で。ウォレット不要。",
      },
      {
        title: "入金（5 ドルで十分）",
        body: "Base または Solana のウォレットを生成。USDC を送金。すべてのフロンティアモデルを解放。",
      },
      {
        title: "成果を宣言する",
        body: "コード、トレード、リサーチ、生成 — Franklin が選び、支払い、報告し、止まる。",
      },
    ],
    ctaInstall: "npm からインストール",
    ctaGitHub: "GitHub で見る",
    slashEyebrow: "スラッシュコマンド · 18 種類組み込み",
    slashDescs: [
      "対話ピッカーまたは直接切替",
      "読み取り専用で計画、その後実行",
      "難問のための深い推論",
      "構造化されたコンテキスト圧縮",
      "コードベースを検索",
      "過去セッション横断の全文検索",
      "任意セッションを検査・復元",
      "Git ワークフロー補助",
      "レビュー・修正・テストを一発で",
      "セッション支出 + アドレス + 残高",
      "支出の内訳とトレンド",
      "Franklin が学んだこと",
    ],
  },

  compare: {
    eyebrow: "台帳",
    titleTop: "表に並べて、",
    titleBottom: "率直に語る。",
    intro:
      "AI 製品が売っているのはアクセス権だ。サブスクは月ごとの罪悪感とレート制限を渡してくる。コール毎課金は失敗したリトライにも請求する。Franklin は成果で精算する — 一回、USDC で。",
    headers: {
      saas: "サブスク SaaS",
      ppc: "コール毎課金 API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "支払う対象",
        saas: "使っても使わなくてもアクセス権",
        ppc: "失敗を含むあらゆる試行",
        franklin: "成果。一度きり。",
      },
      {
        label: "月額料金",
        saas: "$20 〜 $200",
        ppc: "$0、ただし利用料は別",
        franklin: "$0。使った分だけ。",
      },
      {
        label: "レート制限",
        saas: "あり。一番必要なときに締まる。",
        ppc: "キー単位の枠、階層制",
        franklin: "なし。上限はウォレット残高だけ。",
      },
      {
        label: "本人確認",
        saas: "メール + クレジットカード",
        ppc: "ベンダー口座、モデルごとの API キー",
        franklin: "ウォレット一つ。メールも KYC も不要。",
      },
      {
        label: "モデル選択",
        saas: "単一ベンダー",
        ppc: "12 個の鍵を捌く羽目に",
        franklin: "ウォレット一つで 60+ モデル · ルーターが決定。",
      },
      {
        label: "プロバイダ障害",
        saas: "あなたも止まる。",
        ppc: "あなたも止まる。",
        franklin: "次のプロバイダへルーティング。",
      },
      {
        label: "残高超過リスク",
        saas: "静かな自動更新",
        ppc: "月末に上限なしの請求",
        franklin: "なし。ウォレットが空 ⇒ Franklin が停止。",
      },
      {
        label: "ソース",
        saas: "クローズド",
        ppc: "クローズドな SDK",
        franklin: "Apache 2.0 · ローカルファースト。",
      },
    ],
  },

  openSource: {
    eyebrow: "コモンズ · Apache 2.0",
    titleTop: "あなたが所有する、",
    titleEm: "すべて",
    labels: [
      { k: "あなたのデータ", v: "~/.blockrun/" },
      { k: "あなたのウォレット", v: "秘密鍵 · ローカル" },
      { k: "あなたのモデル", v: "60+ · 1 コマンドで切替" },
      { k: "あなたのライセンス", v: "Apache 2.0" },
      { k: "あなたの稼働率", v: "フォークしてセルフホスト。" },
    ],
    paragraphs: [
      "クローズドな AI ツールでは、利用データも嗜好も履歴もベンダーが所有する。規約が変われば、あなたは受け入れる。値上げされれば、あなたは払う。落ちれば、あなたは止まる。",
      "Franklin は Apache 2.0 で、あなたの端末で動く。ウォレットの鍵もセッション履歴も学習データも、すべて ~/.blockrun/ に収まる。テレメトリはゼロ。何も外に送らない。",
      "もし明日 BlockRun が消えても、USDC はあなたのウォレットに残り、エージェントは動き続ける。それが要点だ。",
    ],
    smallParagraph:
      "全行を読める：エージェントループ、16 個の組み込みツール、プラグイン SDK、x402 クライアント、ルーター — すべてリポジトリにある。監査して、フォークして、自分の縦軸製品を出荷せよ。",
  },

  blog: {
    eyebrow: "便り",
    titleTop: "現場からの",
    titleEm: "覚書",
    intro:
      "マルチモデルのコーディングエージェント、ウォレットネイティブな AI、グローバルなクレジットカードを持たない開発者のためのフロンティアモデルについてのノート。",
    allPosts: "すべての記事 →",
  },

  faq: {
    eyebrow: "問い合わせ",
    titleTop: "問いと、",
    titleEm: "答え",
    intro: "自律型エコノミックエージェントというモデルを、平易な言葉で。曖昧さなしに。",
    items: [
      {
        q: "Claude Code や Cursor とは何が違うのか？",
        a: "彼らは素晴らしいコードを書く。だがお金は使えない。トレーディングデータの購入も、API コールの支払いも、画像生成への課金も、ウェブ検索の精算もできない。Franklin はできる — USDC ウォレットを保持し、x402 でアクションごとに支払うからだ。コーディング能力は前提条件。経済的自律こそがカテゴリーだ。",
      },
      {
        q: "「ウォレット付きエージェント」とは具体的に何を意味するのか？",
        a: "Franklin は USDC を Base または Solana 上で保持する。モデル、データフィード、サービスが必要になれば、EIP-712 マイクロペイメントに署名して支払う。予算はあなたが決め、Franklin が守る。一セントまでリアルタイムで追跡される。サブスクなし、API キーなし、請求ポータルなし。",
      },
      {
        q: "Franklin は何に支払えるのか？",
        a: "60 以上の AI モデル（Claude、GPT、Gemini、Grok、DeepSeek、Kimi など）、画像生成（GPT Image、Nano Banana、Grok Imagine）、動画生成、Exa のニューラルウェブ検索、予測市場データ（Polymarket、Kalshi）、X / Twitter インテリジェンス、音楽生成。Smart Router がタスクごとに最適なモデルを選ぶ — 常に Opus と比べて最大 89% の節約。",
      },
      {
        q: "コストはどれくらいか？",
        a: "YOPO — 成果にだけ支払う。プロバイダ原価 + 5%、コールごとに USDC で精算。簡単な質問なら約 $0.001。コーディングセッションで $0.02〜$0.10。30 分の深いセッションで $0.10〜$0.50。サブスクも月額もレート制限もなし。NVIDIA の無料モデルは常にゼロコストで利用可能 — ウォレット不要。",
      },
      {
        q: "本当に私の働き方を学ぶのか？",
        a: "学ぶ。各セッション後に Franklin は嗜好 — 言語、スタイル、モデル選択、ワークフロー — を抽出し、次の実行に注入する。確認された嗜好は確信度が上がり、古いものは 30 日で減衰する。何を知っているかは /learnings で確認できる。",
      },
      {
        q: "データはプライベートに保たれるのか？",
        a: "すべては ~/.blockrun/ にローカルで残る。セッション履歴も学習データもウォレット鍵も、何一つ外には送らない。テレメトリゼロ、クラッシュ報告ゼロ。秘密鍵があなたの端末を出ることはない。コードは Apache 2.0 — 全行を監査できる。",
      },
      {
        q: "無料で使えるのか？",
        a: "使える。NVIDIA の無料モデル（Nemotron、DeepSeek V4 Flash）はウォレットも USDC もサインアップも不要で動く。ウォレットに入金するのは、Sonnet、Opus、GPT、Gemini、Grok、有料ツールを使いたいときだけ。",
      },
      {
        q: "なぜ Base と Solana なのか？",
        a: "高速なファイナリティ、無視できる手数料、成熟した USDC サポート、そして両方に本物の x402 エコシステムがあるから。セットアップ時に選び、いつでも切り替え可能。同じウォレット UX、同じモデル、異なるレール。",
      },
    ],
  },

  closing: {
    kicker: "Franklin Agent",
    titleTop: "経済エージェントを走らせる。",
    titleEm: "お金で失敗するエージェントを見るのは終わり。",
    cta: "Franklin Agent をインストール",
  },

  footer: {
    tagline:
      "ウォレット付きの AI エージェント。あなたの USDC を保持し、成果に向けて使う。Apache 2.0。",
    aboutPre: "",
    aboutLink: "BlockRun.ai",
    aboutPost: "のプロダクト。x402 マイクロペイメントプロトコルで動作。",
    ctaGetStarted: "はじめる",
    colProduct: "プロダクト",
    colResources: "リソース",
    colCommunity: "コミュニティ",
    linkFeatures: "特徴",
    linkCompare: "比較",
    linkGetStarted: "はじめる",
    linkNpm: "npm",
    linkDocs: "ドキュメント",
    linkBlog: "ブログ",
    linkGallery: "ギャラリー",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 プロトコル",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. All rights reserved.",
    bottomRight: "BlockRun.ai が贈る、自律型エコノミックエージェント",
  },

  localeSwitcherLabel: "言語：",

  meta: {
    title: "Franklin — ウォレット付きの AI エージェント",
    description:
      "ウォレット付きの AI エージェント Franklin。あなたの USDC を保持し、代わりに使う — 60 以上のモデル、トレーディングデータ、画像生成、動画生成、ウェブ検索。ウォレット一つ、API キーなし。オープンソース。",
    ogTitle: "Franklin — ウォレット付きの AI エージェント",
    ogDescription:
      "他のエージェントはコードを書く。Franklin はコードを書き、お金を使ってやり遂げる。60 以上のモデル、トレーディングデータ、画像生成、ウェブ検索 — USDC ウォレット一つで。オープンソース。",
    twitterTitle: "Franklin — ウォレット付きの AI エージェント",
    twitterDescription:
      "ウォレット付きの AI エージェント。60 以上のモデル、トレーディングデータ、画像生成 — あなたの USDC を保持し、代わりに使う。オープンソース。",
  },
};
