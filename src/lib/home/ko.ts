import type { HomeDict } from "./types";

export const ko: HomeDict = {
  nav: {
    features: "기능",
    compare: "비교",
    blog: "블로그",
    docs: "문서",
    github: "GitHub",
    getStarted: "시작하기",
  },

  hero: {
    eyebrow: "자율 경제 에이전트",
    titleLine1: "AI 에이전트,",
    titleLine2Pre: "이제",
    titleLine2Em: "지갑",
    titleLine2Post: "을 가졌다.",
    subPre: "다른 에이전트는 코드만 쓴다. Franklin은 코드를 쓰고",
    subEm: "직접 돈을 써서",
    subPost:
      "일을 끝낸다 — 모델, 데이터, 이미지, 검색까지. 예산은 당신이 정한다. 실행은 Franklin이 한다.",
    ctaPrimary: "무료로 시작하기",
    ctaSecondary: "GitHub 스타 누르기",
    copyInstallAriaLabel: "설치 명령어 복사",
    pillYopoSuffix: "결과에만 지불",
    pillUsdcBefore: "USDC on",
    pillX402Before: "Native",
    termAbort: "esc로 중단",
  },

  features: {
    eyebrow: "네 개의 장",
    titleTop: "지갑이",
    titleEm: "바꾼다",
    introPre: "코딩 지능은 기본기다. 진짜 차이는",
    introEm: "구매력",
    introPost:
      "— 그리고 자기 장부를 직접 맞춰야 하는 에이전트가 갖게 되는 조용한 규율이다.",
    cards: [
      {
        label: "지갑",
        title: "돈을 쓸 수 있는 소프트웨어.",
        desc: "Franklin은 Base 또는 Solana 위에 USDC를 보유한다. 모델, 데이터 피드, 이미지가 필요할 때 — 결제에 서명하고 그것을 가져온다. 비수탁형. 키는 당신의 머신에 머무른다. 당신이 한도를 정하면, Franklin이 그것을 강제한다.",
      },
      {
        label: "트레이딩",
        title: "데이터를 사라. 흐름을 읽어라. 결정하라.",
        desc: "“BTC 어때?”라고 물으면 Franklin이 실시간 가격을 구매하고, RSI · MACD · Bollinger · 변동성을 로컬에서 계산해 시그널을 돌려준다. 프롬프트 한 줄. 브라우저 탭 다섯 개도, API 키 스파게티도 없다.",
      },
      {
        label: "Smart Router",
        title: "55개 이상의 모델. Franklin이 고르고, 당신이 절약한다.",
        desc: "단일 모델이 모든 일에 최고일 수는 없다. 라우터는 모든 요청을 분류해 1밀리초 이내에 라우팅한다. 200만 건 이상의 실제 요청으로 학습되고, Elo로 지속적으로 평가되며, 당신의 오버라이드에 적응한다. 항상 Opus 대비 최대 89% 절감.",
      },
      {
        label: "당신을 학습한다",
        title: "세션마다 더 똑똑해진다.",
        desc: "Claude Code는 실행 사이에 잊는다. Franklin은 선호 — 언어, 스타일, 모델 선택, 워크플로우 — 를 추출해 다음 세션에 주입한다. 확인된 패턴은 신뢰도가 올라간다. 오래된 것은 30일에 걸쳐 감쇠한다.",
      },
    ],
  },

  getStarted: {
    eyebrow: "가격 · 설치 · 충전",
    titlePre: "오직",
    titleEm: "결과",
    titleAfterEm: "에",
    titlePost: "지불한다.",
    yopoLabel: "결과에만 지불 · YOPO",
    yopoTitle: "공급자 원가 + 5%, 액션마다 서명.",
    yopoBody:
      "구독 없음 (접근권에 돈을 내지 않는다). 콜당 결제 없음 (실패한 시도에는 돈을 내지 않는다). 지갑 잔고가 곧 하드 캡이다. 0이 되면 Franklin은 멈춘다. 가격 모델은 그게 전부다.",
    steps: [
      {
        title: "설치",
        body: "npm 명령 한 줄. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "무료 실행",
        body: "NVIDIA Nemotron과 Qwen3 Coder를 별도 설정 없이 무료로. 지갑 불필요.",
      },
      {
        title: "충전 ($5면 충분)",
        body: "Base 또는 Solana 지갑을 생성하고 USDC를 보내라. 모든 프론티어 모델이 열린다.",
      },
      {
        title: "결과를 말하라",
        body: "코딩, 트레이딩, 리서치, 생성 — Franklin이 고르고, 결제하고, 보고하고, 멈춘다.",
      },
    ],
    ctaInstall: "npm으로 설치",
    ctaGitHub: "GitHub에서 보기",
    slashEyebrow: "슬래시 명령어 · 18개 내장",
    slashDescs: [
      "인터랙티브 선택 또는 즉시 전환",
      "읽기 전용 계획, 그다음 실행",
      "어려운 문제를 위한 깊은 추론",
      "구조화된 컨텍스트 압축",
      "코드베이스 전체 검색",
      "지난 세션 전반 풀텍스트 검색",
      "어떤 세션이든 조회 또는 복원",
      "Git 워크플로우 헬퍼",
      "원샷 리뷰 · 버그 수정 · 테스트",
      "세션 사용액 + 주소 + 잔고",
      "지출 분석과 추세",
      "Franklin이 학습한 내용",
    ],
  },

  compare: {
    eyebrow: "장부",
    titleTop: "표 한 장으로,",
    titleBottom: "투명하게.",
    intro:
      "AI 제품은 접근권을 판다. 구독은 매달 죄책감과 레이트 리밋을 떠안긴다. 콜당 결제는 실패한 시도까지 청구한다. Franklin은 결과로 정산한다 — 단 한 번, USDC로.",
    headers: {
      saas: "구독형 SaaS",
      ppc: "콜당 결제 API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "지불 대상",
        saas: "사용 여부와 무관한 접근권",
        ppc: "막다른 길까지 포함한 모든 시도",
        franklin: "결과. 단 한 번.",
      },
      {
        label: "월 요금",
        saas: "$20 — $200",
        ppc: "$0, 사용량 별도",
        franklin: "$0. 쓴 만큼만.",
      },
      {
        label: "레이트 리밋",
        saas: "있음. 가장 필요한 순간에 조여든다.",
        ppc: "키별 쿼터, 등급제",
        franklin: "없음. 지갑 잔고만이 유일한 한도.",
      },
      {
        label: "신원",
        saas: "이메일 + 신용카드",
        ppc: "벤더 계정, 모델별 API 키",
        franklin: "지갑 하나. 이메일도 KYC도 없다.",
      },
      {
        label: "모델 선택",
        saas: "단일 벤더",
        ppc: "12개 키를 직접 저글링",
        franklin: "지갑 하나로 55개 이상의 모델 · 라우터가 결정.",
      },
      {
        label: "공급자 장애",
        saas: "당신은 멈춘다.",
        ppc: "당신은 멈춘다.",
        franklin: "다음 공급자로 라우팅한다.",
      },
      {
        label: "초과 청구 위험",
        saas: "조용한 자동 갱신",
        ppc: "월말 무한정 청구",
        franklin: "없음. 지갑이 비면 ⇒ Franklin이 멈춘다.",
      },
      {
        label: "소스",
        saas: "비공개",
        ppc: "비공개 SDK",
        franklin: "Apache 2.0 · 로컬 우선.",
      },
    ],
  },

  openSource: {
    eyebrow: "공유지 · Apache 2.0",
    titleTop: "당신이 모든 것을",
    titleEm: "소유한다",
    labels: [
      { k: "당신의 데이터", v: "~/.blockrun/" },
      { k: "당신의 지갑", v: "프라이빗 키 · 로컬" },
      { k: "당신의 모델", v: "55+ · 명령 한 줄로 전환" },
      { k: "당신의 라이선스", v: "Apache 2.0" },
      { k: "당신의 가동률", v: "포크해서 직접 호스팅." },
    ],
    paragraphs: [
      "비공개 AI 도구에서는 당신의 사용 데이터, 선호, 히스토리를 벤더가 소유한다. 그들이 약관을 바꾸면 — 당신은 받아들인다. 가격을 올리면 — 당신은 낸다. 그들이 멈추면 — 당신도 멈춘다.",
      "Franklin은 Apache 2.0이고 당신의 머신에서 실행된다. 지갑 키, 세션 히스토리, 학습 — 모든 것이 ~/.blockrun/에 있다. 텔레메트리 0. 어디로도 보고하지 않는다.",
      "내일 BlockRun이 사라져도 당신의 USDC는 당신 지갑에 남고, 에이전트는 계속 돈다. 그게 핵심이다.",
    ],
    smallParagraph:
      "한 줄까지 읽어라. 전체 에이전트 루프, 16개의 내장 도구, 플러그인 SDK, x402 클라이언트, 라우터 — 전부 리포지토리에 있다. 감사하라, 포크하라, 당신만의 버티컬을 출시하라.",
  },

  blog: {
    eyebrow: "디스패치",
    titleTop: "현장의",
    titleEm: "작업대",
    intro:
      "멀티 모델 코딩 에이전트, 지갑 네이티브 AI, 그리고 글로벌 신용카드 없는 개발자를 위한 프론티어 모델에 관한 노트.",
    allPosts: "모든 글 →",
  },

  faq: {
    eyebrow: "문의",
    titleTop: "질문에",
    titleEm: "답한다",
    intro:
      "자율 경제 에이전트 모델을 평이한 한국어로. 회피 없음.",
    items: [
      {
        q: "Claude Code나 Cursor와 어떻게 다른가?",
        a: "그들은 코드를 잘 쓴다. 하지만 돈을 쓸 수는 없다. 트레이딩 데이터를 사거나, API 호출 비용을 내거나, 이미지 생성 비용을 내거나, 웹 검색 청구서를 정산할 수 없다. Franklin은 가능하다 — USDC 지갑을 보유하고 x402로 액션마다 결제하기 때문이다. 코딩 지능은 기본기다. 경제적 자율성이 카테고리다.",
      },
      {
        q: "“지갑을 가진 에이전트”가 실제로 무슨 뜻인가?",
        a: "Franklin은 Base 또는 Solana 위에 USDC를 보유한다. 모델, 데이터 피드, 서비스가 필요하면 EIP-712 마이크로페이먼트에 서명해 결제한다. 당신이 예산을 정하면, Franklin이 강제한다. 모든 센트가 실시간으로 추적된다. 구독도, API 키도, 결제 포털도 없다.",
      },
      {
        q: "Franklin은 어디에 돈을 쓸 수 있나?",
        a: "55개 이상의 AI 모델 (Claude, GPT, Gemini, Grok, DeepSeek, Kimi 등), 이미지 생성 (DALL·E, Nano Banana, Grok Imagine), 비디오 생성, Exa 뉴럴 웹 검색, 예측 시장 데이터 (Polymarket, Kalshi), X / Twitter 인텔리전스, 음악 생성. Smart Router가 작업마다 최적 모델을 고른다 — 항상 Opus 대비 최대 89% 절감.",
      },
      {
        q: "비용은 얼마인가?",
        a: "YOPO — 결과에만 지불. 공급자 원가 + 5%, 호출마다 USDC로 정산. 단순 질문: ~$0.001. 코딩 세션: $0.02–$0.10. 30분 딥 세션: $0.10–$0.50. 구독도, 월 요금도, 레이트 리밋도 없다. 무료 NVIDIA 모델은 언제든 무료 — 지갑조차 필요 없다.",
      },
      {
        q: "정말로 내 작업 방식을 학습하나?",
        a: "그렇다. 매 세션 후 Franklin은 선호 — 언어, 스타일, 모델 선택, 워크플로우 — 를 추출해 다음 실행에 주입한다. 확인된 선호는 신뢰도가 오른다. 오래된 것은 30일에 걸쳐 감쇠한다. /learnings 를 실행하면 Franklin이 아는 것을 볼 수 있다.",
      },
      {
        q: "내 데이터는 비공개인가?",
        a: "모든 것이 ~/.blockrun/ 에 로컬로 머문다. 세션 히스토리, 학습, 지갑 키 — 어디로도 보고하지 않는다. 텔레메트리 0, 크래시 리포트 0. 프라이빗 키는 당신의 머신을 떠나지 않는다. 코드는 Apache 2.0 — 한 줄까지 감사할 수 있다.",
      },
      {
        q: "무료로 사용할 수 있나?",
        a: "그렇다. 무료 NVIDIA 모델 (Nemotron, Qwen3 Coder)은 지갑도, USDC도, 가입도 없이 작동한다. Sonnet, Opus, GPT, Gemini, Grok, 또는 유료 도구를 원할 때만 지갑을 충전하라.",
      },
      {
        q: "왜 Base와 Solana인가?",
        a: "빠른 파이널리티, 무시할 만한 수수료, 성숙한 USDC 지원, 그리고 양쪽 모두에 실재하는 x402 생태계. 셋업할 때 고르고 언제든 전환할 수 있다. 같은 지갑 UX, 같은 모델, 다른 레일.",
      },
    ],
  },

  footer: {
    tagline:
      "지갑을 가진 AI 에이전트. 당신의 USDC를 보유하고 결과를 향해 사용한다. Apache 2.0.",
    aboutPre: "",
    aboutLink: "BlockRun.ai",
    aboutPost: "의 제품. x402 마이크로페이먼트 프로토콜 기반.",
    ctaGetStarted: "시작하기",
    colProduct: "제품",
    colResources: "리소스",
    colCommunity: "커뮤니티",
    linkFeatures: "기능",
    linkCompare: "비교",
    linkGetStarted: "시작하기",
    linkNpm: "npm",
    linkDocs: "문서",
    linkBlog: "블로그",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 프로토콜",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. All rights reserved.",
    bottomRight: "BlockRun.ai의 자율 경제 에이전트",
  },

  localeSwitcherLabel: "다른 언어로 읽기:",

  meta: {
    title: "Franklin — 지갑을 가진 AI 에이전트",
    description:
      "지갑을 가진 AI 에이전트, Franklin. 당신의 USDC를 보유하고 직접 사용한다 — 55개 이상의 모델, 트레이딩 데이터, 이미지 생성, 비디오 생성, 웹 검색까지. 지갑 하나, API 키 0. 오픈 소스.",
    ogTitle: "Franklin — 지갑을 가진 AI 에이전트",
    ogDescription:
      "다른 에이전트는 코드만 쓴다. Franklin은 코드를 쓰고 직접 돈을 써서 일을 끝낸다. 55개 이상의 모델, 트레이딩 데이터, 이미지 생성, 웹 검색 — USDC 지갑 하나로. 오픈 소스.",
    twitterTitle: "Franklin — 지갑을 가진 AI 에이전트",
    twitterDescription:
      "지갑을 가진 AI 에이전트. 55개 이상의 모델, 트레이딩 데이터, 이미지 생성 — 당신의 USDC를 보유하고 직접 사용한다. 오픈 소스.",
  },
};
