import type { HomeDict } from "./types";

/**
 * Brazilian Portuguese (pt-BR) translation of the franklin.run homepage.
 * Brand and protocol terms (Franklin, BlockRun, USDC, Solana, Base, x402,
 * YOPO, kimi-k2.6, etc.) stay verbatim. Code snippets and slash commands
 * are universal — not in this dict.
 */
export const ptBR: HomeDict = {
  nav: {
    features: "Recursos",
    compare: "Comparar",
    blog: "Blog",
    gallery: "Galeria",
    docs: "Docs",
    tryFranklin: "Testar Franklin",
    github: "GitHub",
    getStarted: "Começar",
  },

  hero: {
    eyebrow: "O Agente Econômico Autônomo",
    titleLine1: "O agente de IA",
    titleLine2Pre: "com",
    titleLine2Em: "carteira",
    titleLine2Post: ".",
    subPre: "Outros agentes escrevem código. Franklin escreve código",
    subEm: "e gasta dinheiro",
    subPost:
      "para entregar — modelos, dados, imagens, busca. Você define o orçamento. Ele executa.",
    ctaPrimary: "Comece grátis",
    ctaSecondary: "Star no GitHub",
    copyInstallAriaLabel: "Copiar comando de instalação",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "USDC em",
    pillX402Before: "Nativo",
    termAbort: "esc para abortar",
  },

  trustBar: {
    builtOn: "Construído sobre",
    routesPrefix: "roteia por",
    routesModels: "70+ modelos frontier",
    providersPrefix: "de",
  },

  terminalDemo: {
    eyebrow: "Veja rodando",
    titlePre: "Cinco tarefas.",
    titleEm: "Cinco execuções. Cinco recibos.",
    sub:
      "Uma sessão real do Franklin Agent. Cada comando chama um modelo roteado, paga por chamada em USDC e imprime o custo.",
  },

  features: {
    eyebrow: "Quatro Capítulos",
    titleTop: "O que uma carteira",
    titleEm: "muda",
    introPre: "Inteligência de código é o básico. A diferença é",
    introEm: "poder de compra",
    introPost:
      "— e a disciplina silenciosa de um agente que precisa fechar o próprio caixa.",
    cards: [
      {
        label: "A Carteira",
        title: "Software que pode gastar dinheiro.",
        desc: "Franklin guarda USDC em Solana ou Base. Quando precisa de um modelo, um feed de dados ou uma imagem — ele assina o pagamento e leva. Não-custodial. Suas chaves ficam na sua máquina. Você define um teto; ele respeita.",
      },
      {
        label: "Trading",
        title: "Compra dados. Lê o tape. Decide.",
        desc: "Pergunte “como está o BTC?” e Franklin compra preços ao vivo, calcula RSI, MACD, Bollinger e volatilidade localmente, e devolve um sinal. Um único prompt. Sem cinco abas no navegador, sem espaguete de API key.",
      },
      {
        label: "Smart Router",
        title: "70+ modelos. Ele escolhe. Você economiza.",
        desc: "Nenhum modelo é o melhor em tudo. O router classifica cada requisição e roteia em menos de um milissegundo. Treinado em 2M+ requisições reais, pontuado por Elo continuamente, adapta-se aos seus overrides. Até 89% de economia vs. always-Opus.",
      },
      {
        label: "Aprende com você",
        title: "Fica mais inteligente a cada sessão.",
        desc: "Claude Code esquece entre execuções. Franklin extrai preferências — linguagem, estilo, escolhas de modelo, workflow — e injeta na próxima sessão. Padrões confirmados ganham confiança. Os obsoletos decaem em 30 dias.",
      },
    ],
  },

  account: {
    "title": "Use uma API key",
    "body": "Cadastre-se em user.blockrun.ai, crie uma chave e adicione créditos. Defina BLOCKRUN_API_KEY no ambiente e execute franklin start. A cobrança na conta dispensa carteira. Para pagar com carteira, prefira Solana; Base também é compatível.",
    "register": "Cadastro",
    "keys": "API keys",
    "credits": "Créditos",
    "guide": "Guia de configuração"
},
  getStarted: {
    eyebrow: "Preço · Instalação · Fundo",
    titlePre: "Pague pelo",
    titleEm: "resultado",
    titleAfterEm: ",",
    titlePost: "nada além disso.",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Custo do provider + 5%, assinado por ação.",
    yopoBody:
      "Sem assinatura (você não paga pelo acesso). Sem pay-per-call (você não paga por tentativa que falhou). O saldo da carteira é o teto duro. Quando zera, Franklin para. É todo o modelo de preço.",
    steps: [
      {
        title: "Instale",
        body: "Um comando npm. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "Rode grátis",
        body: "NVIDIA Nemotron 3 e Llama 3.2 Vision gratuitos de fábrica. Sem carteira.",
      },
      {
        title: "Carregue ($5 já basta)",
        body: "Gere uma carteira em Solana ou Base. Envie USDC. Libere todos os modelos de fronteira.",
      },
      {
        title: "Diga o resultado desejado",
        body: "Codar, tradar, pesquisar, gerar — Franklin escolhe, paga, reporta, para.",
      },
    ],
    ctaInstall: "Instalar pelo npm",
    ctaGitHub: "Ver no GitHub",
    slashEyebrow: "Slash Commands · 18 nativos",
    slashDescs: [
      "Seletor interativo ou troca direta",
      "Planejamento somente-leitura, depois executa",
      "Raciocínio profundo para problemas difíceis",
      "Compressão estruturada de contexto",
      "Busca no codebase",
      "Full-text em sessões anteriores",
      "Inspecione ou restaure qualquer sessão",
      "Helpers de workflow Git",
      "Revisão, bugfix e testes em um comando",
      "Gasto da sessão + endereço + saldo",
      "Detalhamento de gastos e tendências",
      "O que Franklin já aprendeu",
    ],
  },

  compare: {
    eyebrow: "O Razão",
    titleTop: "Numa tabela,",
    titleBottom: "para ficar claro.",
    intro:
      "Produtos de IA vendem acesso. Assinaturas entregam culpa mensal e rate limit. Pay-per-call cobra cada tentativa que falhou. Franklin liquida pelo resultado — uma vez, em USDC.",
    headers: {
      saas: "SaaS por assinatura",
      ppc: "API pay-per-call",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "Você paga por",
        saas: "Acesso, usado ou não",
        ppc: "Cada tentativa, inclusive becos sem saída",
        franklin: "O resultado. Uma vez.",
      },
      {
        label: "Mensalidade",
        saas: "$20 — $200",
        ppc: "$0, mais o uso",
        franklin: "$0. Pague só o que gastar.",
      },
      {
        label: "Rate limits",
        saas: "Sim. Aperta justo quando você mais precisa.",
        ppc: "Cotas por chave, tiers",
        franklin: "Nenhum. O saldo da carteira é o único teto.",
      },
      {
        label: "Identidade",
        saas: "E-mail + cartão de crédito",
        ppc: "Conta no fornecedor, API keys por modelo",
        franklin: "Uma carteira. Sem e-mail, sem KYC.",
      },
      {
        label: "Escolha de modelo",
        saas: "Fornecedor único",
        ppc: "Você malabaria 12 chaves",
        franklin: "70+ modelos por uma carteira · o router decide.",
      },
      {
        label: "Queda do provider",
        saas: "Você parou.",
        ppc: "Você parou.",
        franklin: "Roteia para o próximo provider.",
      },
      {
        label: "Risco de estouro",
        saas: "Renovação automática silenciosa",
        ppc: "Conta sem teto no fim do mês",
        franklin: "Nenhum. Carteira vazia ⇒ Franklin para.",
      },
      {
        label: "Código-fonte",
        saas: "Fechado",
        ppc: "SDK fechado",
        franklin: "Apache 2.0 · local-first.",
      },
    ],
  },

  openSource: {
    eyebrow: "O Comum · Apache 2.0",
    titleTop: "Você é dono de",
    titleEm: "tudo",
    labels: [
      { k: "Seus dados", v: "~/.blockrun/" },
      { k: "Sua carteira", v: "Chaves privadas · locais" },
      { k: "Seus modelos", v: "70+ · troca em 1 cmd" },
      { k: "Sua licença", v: "Apache 2.0" },
      { k: "Seu uptime", v: "Forke. Self-host." },
    ],
    paragraphs: [
      "Em ferramentas de IA fechadas, o fornecedor é dono dos seus dados de uso, das suas preferências, do seu histórico. Eles mudam os termos — você aceita. Sobem o preço — você paga. Caem — você para.",
      "Franklin é Apache 2.0 e roda na sua máquina. Chaves da carteira, histórico de sessões, aprendizados — tudo fica em ~/.blockrun/. Zero telemetria. Nada liga pra casa.",
      "Se a BlockRun sumir amanhã, seu USDC continua na sua carteira e seu agente continua rodando. É essa a ideia.",
    ],
    smallParagraph:
      "Leia cada linha: o loop completo do agente, as 16 ferramentas nativas, o SDK de plugins, o cliente x402, o router — está tudo no repo. Audite, forke, lance sua própria vertical.",
  },

  blog: {
    eyebrow: "Despachos",
    titleTop: "Direto da",
    titleEm: "bancada",
    intro:
      "Notas sobre agentes de código multi-modelo, IA wallet-native e modelos de fronteira para devs sem cartão de crédito internacional.",
    allPosts: "Todos os posts →",
  },

  faq: {
    eyebrow: "Perguntas",
    titleTop: "Dúvidas,",
    titleEm: "respondidas",
    intro:
      "O modelo do agente econômico autônomo em português claro. Sem rodeios.",
    items: [
      {
        q: "Qual a diferença para Claude Code ou Cursor?",
        a: "Eles escrevem ótimo código. Não conseguem gastar dinheiro. Não compram dados de trading, chamadas de API, geração de imagem ou bill de busca web. Franklin consegue — porque carrega uma carteira USDC e paga por ação via x402. Inteligência de código é o básico; autonomia econômica é a categoria.",
      },
      {
        q: "O que “um agente com carteira” quer dizer na prática?",
        a: "Cadastre-se em user.blockrun.ai, crie uma chave e adicione créditos. Defina BLOCKRUN_API_KEY no ambiente e execute franklin start. A cobrança na conta dispensa carteira. Para pagar com carteira, prefira Solana; Base também é compatível.",
      },
      {
        q: "Em que Franklin pode gastar?",
        a: "70+ modelos de IA (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, etc.), geração de imagem (GPT Image, Nano Banana, Grok Imagine), geração de vídeo, busca web neural Exa, dados de prediction markets (Polymarket, Kalshi), inteligência X/Twitter, geração de música. O Smart Router escolhe o melhor modelo por tarefa — até 89% de economia vs always-Opus.",
      },
      {
        q: "Quanto custa?",
        a: "YOPO — You Only Pay Outcome. Custo do provider + 5%, liquidado por chamada em USDC. Pergunta simples: ~$0,001. Sessão de código: $0,02–$0,10. Sessão profunda de 30 minutos: $0,10–$0,50. Sem assinatura, sem mensalidade, sem rate limit. Os modelos NVIDIA gratuitos estão sempre disponíveis a custo zero — sem precisar de carteira.",
      },
      {
        q: "Ele aprende mesmo como eu trabalho?",
        a: "Aprende. Depois de cada sessão Franklin extrai preferências — linguagem, estilo, escolhas de modelo, workflow — e injeta na próxima execução. Preferências confirmadas ganham confiança. As obsoletas decaem em 30 dias. Rode /learnings para ver o que ele sabe.",
      },
      {
        q: "Meus dados são privados?",
        a: "Tudo fica local em ~/.blockrun/. Histórico de sessões, aprendizados, chaves da carteira — nada liga pra casa. Zero telemetria, zero crash report. Suas chaves privadas nunca saem da sua máquina. O código é Apache 2.0 — audite cada linha.",
      },
      {
        q: "Posso usar de graça?",
        a: "Pode. Os modelos NVIDIA gratuitos (Nemotron 3, Llama 3.2 Vision) funcionam sem carteira, sem USDC, sem cadastro. Carregue a carteira só quando quiser Sonnet, Opus, GPT, Gemini, Grok ou ferramentas pagas.",
      },
      {
        q: "Por que Solana e Base?",
        a: "Finalidade rápida, taxas irrisórias, suporte maduro a USDC e um ecossistema x402 real nas duas. Você escolhe na configuração e pode trocar quando quiser. Mesma UX de carteira, mesmos modelos, trilhos diferentes.",
      },
    ],
  },

  closing: {
    kicker: "Franklin Agent",
    titleTop: "Rode um agente econômico.",
    titleEm: "Pare de ver agentes falharem com dinheiro.",
    cta: "Instalar Franklin Agent",
  },

  footer: {
    tagline:
      "O agente de IA com carteira. Ele guarda seu USDC e gasta em direção a resultados. Apache 2.0.",
    aboutPre: "Um produto",
    aboutLink: "BlockRun.ai",
    aboutPost: ". Movido pelo protocolo de micropagamento x402.",
    ctaGetStarted: "Começar",
    colProduct: "Produto",
    colResources: "Recursos",
    colCommunity: "Comunidade",
    linkFeatures: "Recursos",
    linkCompare: "Comparar",
    linkGetStarted: "Começar",
    linkNpm: "npm",
    linkDocs: "Documentação",
    linkBlog: "Blog",
    linkGallery: "Galeria",
    linkGateway: "BlockRun Gateway",
    linkX402: "Protocolo x402",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. Todos os direitos reservados.",
    bottomRight: "O agente econômico autônomo da BlockRun.ai",
  },

  localeSwitcherLabel: "Ler em:",

  meta: {
    title: "Franklin — O Agente de IA com Carteira",
    description:
      "O agente de IA com carteira. Guarda seu USDC e gasta por você — 70+ modelos, dados de trading, geração de imagem, geração de vídeo, busca web. Uma carteira, sem API keys. Open source.",
    ogTitle: "Franklin — O Agente de IA com Carteira",
    ogDescription:
      "Outros agentes escrevem código. Franklin escreve código e gasta dinheiro para entregar. 70+ modelos, dados de trading, geração de imagem, busca web — uma carteira USDC. Open source.",
    twitterTitle: "Franklin — O Agente de IA com Carteira",
    twitterDescription:
      "O agente de IA com carteira. 70+ modelos, dados de trading, geração de imagem — guarda seu USDC e gasta por você. Open source.",
  },
};
