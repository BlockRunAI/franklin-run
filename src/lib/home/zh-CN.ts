import type { HomeDict } from "./types";

export const zhCN: HomeDict = {
  nav: {
    features: "特性",
    compare: "对比",
    blog: "博客",
    docs: "文档",
    github: "GitHub",
    getStarted: "开始使用",
  },

  hero: {
    eyebrow: "自治经济智能体",
    titleLine1: "带钱包的",
    titleLine2Pre: "AI",
    titleLine2Em: "智能体",
    titleLine2Post: "。",
    subPre: "别的智能体只会写代码。Franklin 写代码，",
    subEm: "还会自己花钱",
    subPost:
      "把活干完——模型、数据、图像、搜索。你定预算，它去执行。",
    ctaPrimary: "免费开始",
    ctaSecondary: "在 GitHub 加星",
    copyInstallAriaLabel: "复制安装命令",
    pillYopoSuffix: "只为结果付费",
    pillUsdcBefore: "USDC on",
    pillX402Before: "原生支持",
    termAbort: "按 esc 中止",
  },

  features: {
    eyebrow: "四个篇章",
    titleTop: "钱包带来的",
    titleEm: "改变",
    introPre: "写代码的智商已经是入场券。真正的差别是",
    introEm: "购买力",
    introPost:
      "——以及一个必须自己平账的智能体身上那种安静的克制。",
    cards: [
      {
        label: "钱包",
        title: "会花钱的软件。",
        desc: "Franklin 在 Base 或 Solana 上持有 USDC。需要模型、数据源或图像时，它直接签名付款拿走。非托管，私钥留在你机器上。你设上限，它自己执行。",
      },
      {
        label: "交易",
        title: "买数据，读盘面，做决策。",
        desc: "问一句「BTC 现在怎么样」，Franklin 自己去买实时行情，本地算 RSI、MACD、布林带和波动率，给你一个信号。一句 prompt 搞定，不用开五个浏览器标签，不用拼 API key。",
      },
      {
        label: "智能路由",
        title: "55+ 模型，它挑，你省。",
        desc: "没有任何模型样样最强。路由器把每个请求分类，毫秒级出选择。基于 200 万次真实请求训练，Elo 持续打分，按你的偏好微调。相比无脑用 Opus，最高省 89%。",
      },
      {
        label: "学习你",
        title: "每一次会话都更懂你。",
        desc: "Claude Code 跑完就忘。Franklin 提取偏好——语言、风格、模型选择、工作流——注入下一次会话。被验证的模式信心累加，30 天没用就自动衰减。",
      },
    ],
  },

  getStarted: {
    eyebrow: "定价 · 安装 · 充值",
    titlePre: "只为",
    titleEm: "结果",
    titleAfterEm: "付费，",
    titlePost: "别的不收。",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "供应商成本 + 5%，每次行动单独签名。",
    yopoBody:
      "没有订阅（你不为「访问权」付费）。没有按调用计费（你不为失败的尝试付费）。钱包余额就是硬上限，归零就停。这就是定价模型的全部。",
    steps: [
      {
        title: "安装",
        body: "一条 npm 命令。Node 20+。macOS、Linux、WSL。",
      },
      {
        title: "免费跑",
        body: "开箱即用的免费 NVIDIA Nemotron 与 Qwen3 Coder。无需钱包。",
      },
      {
        title: "充值（5 美元就够)",
        body: "生成 Base 或 Solana 钱包，转入 USDC，解锁所有前沿模型。",
      },
      {
        title: "说一个结果",
        body: "写码、交易、研究、生成——Franklin 自己挑、自己付、自己汇报、自己停。",
      },
    ],
    ctaInstall: "从 npm 安装",
    ctaGitHub: "在 GitHub 查看",
    slashEyebrow: "斜杠命令 · 18 个内置",
    slashDescs: [
      "交互选择或直接切换",
      "只读规划，再执行",
      "深度推理硬题",
      "结构化上下文压缩",
      "在代码库中搜索",
      "历史会话全文检索",
      "查看或恢复任意会话",
      "Git 工作流助手",
      "一键评审、修复、测试",
      "本次花费 + 地址 + 余额",
      "花费分布与趋势",
      "Franklin 学到的偏好",
    ],
  },

  compare: {
    eyebrow: "账本",
    titleTop: "一张表，",
    titleBottom: "把话说透。",
    intro:
      "AI 产品在卖访问权。订阅每月给你愧疚感和限流。按调用计费让你为每次失败买单。Franklin 只为结果结一次账——用 USDC。",
    headers: {
      saas: "SaaS 订阅",
      ppc: "按调用计费 API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "你为什么付费",
        saas: "访问权，用没用都付",
        ppc: "每次尝试，包括死路",
        franklin: "结果。一次。",
      },
      {
        label: "月费",
        saas: "20 — 200 美元",
        ppc: "0 美元，外加用量",
        franklin: "0 美元。花多少付多少。",
      },
      {
        label: "限流",
        saas: "有。最需要的时候掐你。",
        ppc: "按 key 配额、分等级",
        franklin: "无。钱包余额是唯一上限。",
      },
      {
        label: "身份",
        saas: "邮箱 + 信用卡",
        ppc: "厂商账号、每个模型一组 key",
        franklin: "一个钱包。无邮箱、无 KYC。",
      },
      {
        label: "模型选择",
        saas: "单一厂商",
        ppc: "你自己倒腾 12 把 key",
        franklin: "55+ 模型，一个钱包 · 路由器决定。",
      },
      {
        label: "厂商宕机",
        saas: "你被卡死。",
        ppc: "你被卡死。",
        franklin: "自动切到下一家。",
      },
      {
        label: "透支风险",
        saas: "悄悄自动续费",
        ppc: "月底无上限账单",
        franklin: "无。钱包空 ⇒ Franklin 停。",
      },
      {
        label: "源代码",
        saas: "闭源",
        ppc: "闭源 SDK",
        franklin: "Apache 2.0 · 本地优先。",
      },
    ],
  },

  openSource: {
    eyebrow: "公地 · Apache 2.0",
    titleTop: "你拥有",
    titleEm: "一切",
    labels: [
      { k: "你的数据", v: "~/.blockrun/" },
      { k: "你的钱包", v: "私钥 · 本地" },
      { k: "你的模型", v: "55+ · 一行命令切换" },
      { k: "你的许可证", v: "Apache 2.0" },
      { k: "你的可用性", v: "Fork 它，自托管。" },
    ],
    paragraphs: [
      "用闭源 AI 工具，厂商拥有你的使用数据、偏好、历史。条款一改，你只能接受；价格一涨，你只能付；它一宕机，你就停。",
      "Franklin 是 Apache 2.0，跑在你自己机器上。钱包私钥、会话历史、学到的偏好——全都在 ~/.blockrun/。零遥测，绝不回传。",
      "BlockRun 哪天消失了，你的 USDC 还在你钱包里，你的智能体照样跑。这就是重点。",
    ],
    smallParagraph:
      "每一行都可读：完整的 agent 主循环、16 个内置工具、插件 SDK、x402 客户端、路由器——全部在仓库里。审计它，fork 它，做你自己的垂直版本。",
  },

  blog: {
    eyebrow: "战报",
    titleTop: "来自",
    titleEm: "一线",
    intro:
      "关于多模型 coding agent、原生带钱包的 AI、以及给那些没有全球信用卡的开发者用上前沿模型的笔记。",
    allPosts: "全部文章 →",
  },

  faq: {
    eyebrow: "答疑",
    titleTop: "问题，",
    titleEm: "回答",
    intro:
      "用大白话讲清楚自治经济智能体这个模式。不打太极。",
    items: [
      {
        q: "和 Claude Code 或 Cursor 有什么不同？",
        a: "它们写代码很强，但不会花钱。它们没法买行情数据、没法付 API 调用、没法付图像生成、没法结一笔搜索账单。Franklin 可以——因为它持有一个 USDC 钱包，并通过 x402 按行动付款。写代码的智商是入场券；经济自治才是新品类。",
      },
      {
        q: "「带钱包的智能体」到底是什么意思？",
        a: "Franklin 在 Base 或 Solana 上持有 USDC。需要模型、数据源或服务时，它签一笔 EIP-712 微支付直接付。你定预算，Franklin 自己执行。每一分钱实时记账。没有订阅、没有 API key、没有计费后台。",
      },
      {
        q: "Franklin 能花钱买什么？",
        a: "55+ AI 模型（Claude、GPT、Gemini、Grok、DeepSeek、Kimi 等等）、图像生成（DALL·E、Nano Banana、Grok Imagine）、视频生成、Exa 神经网络搜索、预测市场数据（Polymarket、Kalshi）、X / Twitter 情报、音乐生成。智能路由按任务挑最合适的模型——相比无脑用 Opus，最高省 89%。",
      },
      {
        q: "多少钱？",
        a: "YOPO——You Only Pay Outcome。供应商成本 + 5%，每次调用即时用 USDC 结算。一个简单问题：约 0.001 美元。一次 coding 会话：0.02–0.10 美元。30 分钟深度会话：0.10–0.50 美元。无订阅、无月费、无限流。免费的 NVIDIA 模型永远在线，零成本——不需要钱包。",
      },
      {
        q: "它真的会学我的工作方式？",
        a: "会。每次会话结束后，Franklin 提取偏好——语言、风格、模型选择、工作流——注入下一次运行。被验证的偏好信心累加，30 天没用就自动衰减。运行 /learnings 看看它都记住了什么。",
      },
      {
        q: "我的数据私密吗？",
        a: "全部在本地 ~/.blockrun/。会话历史、学到的偏好、钱包私钥——绝不回传。零遥测，零崩溃上报。私钥永远不离开你机器。代码 Apache 2.0，每一行你都能审计。",
      },
      {
        q: "可以免费用吗？",
        a: "可以。免费 NVIDIA 模型（Nemotron、Qwen3 Coder）开箱即用，不要钱包、不要 USDC、不要注册。只有想用 Sonnet、Opus、GPT、Gemini、Grok 或付费工具时，才需要给钱包充值。",
      },
      {
        q: "为什么是 Base 和 Solana？",
        a: "终局速度快、手续费可忽略、USDC 支持成熟，且两条链上都有真正可用的 x402 生态。安装时挑一条，随时切换。同样的钱包体验，同样的模型，只是底层轨道不同。",
      },
    ],
  },

  footer: {
    tagline:
      "带钱包的 AI 智能体。它替你持有 USDC，并把它花向结果。Apache 2.0。",
    aboutPre: "由",
    aboutLink: "BlockRun.ai",
    aboutPost: "出品。基于 x402 微支付协议。",
    ctaGetStarted: "开始使用",
    colProduct: "产品",
    colResources: "资源",
    colCommunity: "社区",
    linkFeatures: "特性",
    linkCompare: "对比",
    linkGetStarted: "开始使用",
    linkNpm: "npm",
    linkDocs: "文档",
    linkBlog: "博客",
    linkGateway: "BlockRun 网关",
    linkX402: "x402 协议",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. 保留所有权利。",
    bottomRight: "由 BlockRun.ai 出品的自治经济智能体",
  },

  localeSwitcherLabel: "切换语言：",

  meta: {
    title: "Franklin — 带钱包的 AI 智能体",
    description:
      "带钱包的 AI 智能体。Franklin 替你持有 USDC，并替你花掉它——55+ 模型、行情数据、图像生成、视频生成、网络搜索。一个钱包，免 API key。开源。",
    ogTitle: "Franklin — 带钱包的 AI 智能体",
    ogDescription:
      "别的智能体只会写代码。Franklin 写代码，还会自己花钱把活干完。55+ 模型、行情数据、图像生成、网络搜索——一个 USDC 钱包搞定。开源。",
    twitterTitle: "Franklin — 带钱包的 AI 智能体",
    twitterDescription:
      "带钱包的 AI 智能体。55+ 模型、行情数据、图像生成——它替你持有 USDC，并替你花掉。开源。",
  },
};
