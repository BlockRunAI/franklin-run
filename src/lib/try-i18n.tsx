"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type TryLang = "en" | "zh" | "es";

export const TRY_LANGS: { id: TryLang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "es", label: "Español" },
];

export interface TryDict {
  newChat: string;
  noConversations: string;
  history: string;
  connectWallet: string;
  connecting: string;
  installWallet: string;
  baseNetwork: string;
  switchToBase: string;
  noWalletFound: string;
  openInWalletApp: string;
  image: string;
  video: string;
  attachImage: string;
  attachChatOnly: string;
  attachRef: string;
  attachSeed: string;
  actionLike: string;
  actionDislike: string;
  actionRetry: string;
  actionCopy: string;
  language: string;
  theme: string;
  themeGold: string;
  themeLight: string;
  themeDark: string;
  installCli: string;
  copied: string;
  phone: string;
  tools: string;
  skills: string;
  gallery: string;
  wallet: string;
  marketplace: string;
  marketplaceTitle: string;
  tryIt: string;
  poweredBy: string;
  examples: string;
  toolsTitle: string;
  toolsSub: string;
  skillsTitle: string;
  skillsSub: string;
  galleryTitle: string;
  galleryEmpty: string;
  galleryDelete: string;
  galleryDeleteConfirm: string;
  walletTitle: string;
  balance: string;
  topUp: string;
  costByModel: string;
  receipts: string;
  walletEmpty: string;
  searchChats: string;
  noResults: string;
  today: string;
  yesterday: string;
  last7days: string;
  older: string;
  signIn: string;
  more: string;
  settings: string;
  officialSite: string;
  rename: string;
  about: string;
  docs: string;
  blog: string;
  casePrediction: string;
  casePrediction2: string;
  casePrediction3: string;
  casePrice: string;
  caseSearch: string;
  caseMusic: string;
  // empty-state titles (the word "Franklin" is highlighted at render time)
  emptyChat: string;
  emptyImage: string;
  emptyVideo: string;
  // composer placeholders
  phMessage: string;
  phImage: string;
  phVideo: string;
  phConnect: string;
  focusPrediction: string;
  focusSearch: string;
  focusPrice: string;
  phPrediction: string;
  phSearch: string;
  phPrice: string;
  // wallet hints
  hintImage: string;
  hintVideo: string;
  hintChat: (model: string) => string;
  hintToolWallet: string;
  // status
  statusSigning: string;
  statusWorking: string;
  statusImage: string;
  statusVideo: string;
  // media links
  openFull: string;
  downloadMp4: string;
  reasoning: string;
  spent: string;
  requests: (n: number) => string;
  toolRunning: (tool: string) => string;
  activitySearched: (queries: number, sources: number) => string;
  activityUsed: (n: number) => string;
  // suggestions
  sugChat: string[];
  sugImage: string[];
  sugVideo: string[];
}

const en: TryDict = {
  newChat: "New chat",
  noConversations: "No conversations yet.",
  history: "History",
  connectWallet: "Connect wallet",
  connecting: "Connecting…",
  installWallet: "Install a wallet",
  baseNetwork: "Base",
  switchToBase: "Switch to Base",
  noWalletFound: "No wallet found",
  openInWalletApp: "Open in the MetaMask or Coinbase Wallet app browser.",
  image: "Image",
  video: "Video",
  attachImage: "Attach an image",
  attachChatOnly: "Attachments work in Chat mode",
  attachRef: "Attach a reference image (image-to-image)",
  attachSeed: "Attach a seed image (image-to-video)",
  actionLike: "Good response",
  actionDislike: "Bad response",
  actionRetry: "Regenerate",
  actionCopy: "Copy",
  language: "Language",
  theme: "Theme",
  themeGold: "Gold",
  themeLight: "Light",
  themeDark: "Dark",
  installCli: "Install from npm",
  copied: "Copied",
  phone: "Phone",
  tools: "Tools",
  skills: "Skills",
  gallery: "Gallery",
  wallet: "Wallet",
  marketplace: "Marketplace",
  marketplaceTitle: "Marketplace",
  tryIt: "Try",
  poweredBy: "Powered by",
  examples: "Examples",
  toolsTitle: "What Franklin can do",
  toolsSub: "Chat, generation, and live tools — pay per request in USDC, no subscription. Tools marked \u201cauto\u201d are called by Franklin automatically when useful.",
  skillsTitle: "Skills",
  skillsSub: "Quick-start a task — pick a skill and Franklin sets up the prompt.",
  galleryTitle: "Gallery",
  galleryEmpty: "Images and videos you generate will show up here.",
  galleryDelete: "Delete",
  galleryDeleteConfirm: "Delete this from your gallery? It will also be removed from the conversation.",
  walletTitle: "Wallet",
  balance: "Balance",
  topUp: "Send USDC on Base to your connected wallet to top up.",
  costByModel: "Cost by model",
  receipts: "Receipts",
  walletEmpty: "Connect your wallet to see your balance and spend.",
  searchChats: "Search chats",
  noResults: "No matches.",
  today: "Today",
  yesterday: "Yesterday",
  last7days: "Last 7 days",
  older: "Older",
  signIn: "Sign in",
  more: "More",
  settings: "Settings",
  officialSite: "Official site",
  rename: "Rename",
  about: "About",
  docs: "Docs",
  blog: "Blog",
  casePrediction: "What are the odds the Fed cuts rates in March?",
  casePrediction2: "Who is favored to win the next US election on Polymarket?",
  casePrediction3: "What do prediction markets say about a recession this year?",
  casePrice: "What is the price of BTC right now?",
  caseSearch: "What is the latest news on AI agents?",
  caseMusic: "Compose a 30-second lo-fi study beat.",
  emptyChat: "What should Franklin do?",
  emptyImage: "What should Franklin draw?",
  emptyVideo: "What should Franklin film?",
  phMessage: "Message Franklin…",
  phImage: "Describe an image…",
  phVideo: "Describe a video…",
  phConnect: "Connect a wallet to begin…",
  focusPrediction: "Prediction",
  focusSearch: "Web search",
  focusPrice: "Prices",
  phPrediction: "Ask about prediction-market odds…",
  phSearch: "Search the web…",
  phPrice: "Ask for a live price…",
  hintImage: "Connect a wallet to generate images.",
  hintVideo: "Connect a wallet to generate videos.",
  hintChat: (m) => `Connect a wallet to use ${m}, or switch to a free model.`,
  hintToolWallet: "Franklin needs a paid tool (web search, prediction markets, …). Connect your wallet to continue.",
  statusSigning: "Sign the payment in your wallet…",
  statusWorking: "Franklin is working…",
  statusImage: "Painting your image…",
  statusVideo: "Rendering your video (this can take a minute)…",
  openFull: "Open full size",
  downloadMp4: "Download MP4",
  reasoning: "Thoughts",
  spent: "Spent",
  requests: (n) => `${n} request${n===1?"":"s"}`,
  toolRunning: (tool) => ({web_search:"Searching the web…",get_market_price:"Checking live prices…",search_prediction_markets:"Checking prediction markets…",generate_music:"Composing music…",make_phone_call:"Placing the call…"}[tool] || "Using a tool…"),
  activitySearched: (q, s) => `Searched ${q} ${q === 1 ? "keyword" : "keywords"}${s ? ` · ${s} ${s === 1 ? "source" : "sources"}` : ""}`,
  activityUsed: (n) => `Used ${n} ${n === 1 ? "tool" : "tools"}`,
  sugChat: [
    "Explain x402 micropayments in two sentences.",
    "Write a Python function to fetch a USDC balance.",
    "What can an AI agent with a wallet do that a chatbot can't?",
  ],
  sugImage: [
    "A grayscale portrait of Benjamin Franklin, banknote engraving style",
    "An isometric 3D gold coin, soft studio lighting",
    "A minimalist poster for an autonomous AI agent, cream and gold",
  ],
  sugVideo: [
    "Slow dolly shot over a calm ocean at golden hour",
    "A gold coin spinning on a marble table, macro, cinematic",
    "Neon city street in the rain, reflections, 4k",
  ],
};

const zh: TryDict = {
  newChat: "新对话",
  noConversations: "还没有对话。",
  history: "历史记录",
  connectWallet: "连接钱包",
  connecting: "连接中…",
  installWallet: "安装钱包",
  baseNetwork: "Base 链",
  switchToBase: "切换到 Base 链",
  noWalletFound: "未检测到钱包",
  openInWalletApp: "请在 MetaMask 或 Coinbase Wallet 应用的内置浏览器中打开。",
  image: "图像",
  video: "视频",
  attachImage: "添加图片",
  attachChatOnly: "附件仅在对话模式可用",
  attachRef: "添加参考图（图生图）",
  attachSeed: "添加首帧图（图生视频）",
  actionLike: "赞",
  actionDislike: "踩",
  actionRetry: "重新生成",
  actionCopy: "复制",
  language: "语言",
  theme: "主题",
  themeGold: "金色",
  themeLight: "浅色",
  themeDark: "深色",
  installCli: "从 npm 安装",
  copied: "已复制",
  phone: "电话",
  tools: "工具",
  skills: "技能",
  gallery: "作品库",
  wallet: "钱包",
  marketplace: "应用市场",
  marketplaceTitle: "应用市场",
  tryIt: "试用",
  poweredBy: "技术支持",
  examples: "示例",
  toolsTitle: "Franklin 能做什么",
  toolsSub: "对话、生成、实时工具——按次用 USDC 付费，无订阅。标「auto」的工具由 Franklin 在需要时自动调用。",
  skillsTitle: "技能",
  skillsSub: "快速开始——选一个技能，Franklin 帮你搭好提示词。",
  galleryTitle: "图库",
  galleryEmpty: "你生成的图片和视频会显示在这里。",
  galleryDelete: "删除",
  galleryDeleteConfirm: "从图库删除这张?它也会从对话里一并移除。",
  walletTitle: "钱包",
  balance: "余额",
  topUp: "在 Base 上把 USDC 转到你连接的钱包即可充值。",
  costByModel: "按模型花费",
  receipts: "账单",
  walletEmpty: "连接钱包以查看余额和花费。",
  searchChats: "搜索对话",
  noResults: "无匹配结果。",
  today: "今天",
  yesterday: "昨天",
  last7days: "最近 7 天",
  older: "更早",
  signIn: "登录",
  more: "更多",
  settings: "设置",
  officialSite: "官网",
  rename: "重命名",
  about: "关于",
  docs: "文档",
  blog: "博客",
  casePrediction: "美联储 3 月降息的概率是多少？",
  casePrediction2: "Polymarket 上谁更可能赢得下届美国大选？",
  casePrediction3: "预测市场怎么看今年会不会衰退？",
  casePrice: "比特币现在多少钱？",
  caseSearch: "AI agent 最新有什么新闻？",
  caseMusic: "做一段 30 秒的 lo-fi 学习音乐。",
  emptyChat: "让 Franklin 做点什么？",
  emptyImage: "让 Franklin 画点什么？",
  emptyVideo: "让 Franklin 拍点什么？",
  phMessage: "给 Franklin 发消息…",
  phImage: "描述一张图片…",
  phVideo: "描述一段视频…",
  phConnect: "连接钱包后开始…",
  focusPrediction: "预测市场",
  focusSearch: "联网搜索",
  focusPrice: "实时行情",
  phPrediction: "问问预测市场的赔率…",
  phSearch: "联网搜索…",
  phPrice: "查询实时价格…",
  hintImage: "连接钱包以生成图片。",
  hintVideo: "连接钱包以生成视频。",
  hintChat: (m) => `连接钱包以使用 ${m}，或切换到免费模型。`,
  hintToolWallet: "Franklin 需要调用付费工具（联网搜索、预测市场等）。请连接钱包以继续。",
  statusSigning: "请在钱包中签名付款…",
  statusWorking: "Franklin 正在处理…",
  statusImage: "正在绘制图片…",
  statusVideo: "正在渲染视频（可能需要一会儿）…",
  openFull: "查看原图",
  downloadMp4: "下载 MP4",
  reasoning: "推理过程",
  spent: "已花费",
  requests: (n) => `${n} 次请求`,
  toolRunning: (tool) => ({web_search:"正在联网搜索…",get_market_price:"正在查实时行情…",search_prediction_markets:"正在查预测市场…",generate_music:"正在生成音乐…",make_phone_call:"正在拨打电话…"}[tool] || "正在调用工具…"),
  activitySearched: (q, s) => `搜索 ${q} 个关键词${s ? `，参考 ${s} 篇资料` : ""}`,
  activityUsed: (n) => `调用了 ${n} 个工具`,
  sugChat: [
    "用两句话解释 x402 微支付。",
    "写一个获取 USDC 余额的 Python 函数。",
    "带钱包的 AI agent 能做哪些聊天机器人做不到的事？",
  ],
  sugImage: [
    "本杰明·富兰克林的灰度肖像，钞票雕刻风格",
    "等距 3D 金币，柔和的影棚灯光",
    "自主 AI agent 的极简海报，米色与金色",
  ],
  sugVideo: [
    "黄金时刻平静海面上的缓慢推镜",
    "大理石桌上旋转的金币，微距，电影感",
    "雨中的霓虹街道，倒影，4k",
  ],
};

const es: TryDict = {
  newChat: "Nuevo chat",
  noConversations: "Aún no hay conversaciones.",
  history: "Historial",
  connectWallet: "Conectar billetera",
  connecting: "Conectando…",
  installWallet: "Instalar billetera",
  baseNetwork: "Base",
  switchToBase: "Cambiar a Base",
  noWalletFound: "No se encontró billetera",
  openInWalletApp: "Ábrelo en el navegador de la app MetaMask o Coinbase Wallet.",
  image: "Imagen",
  video: "Video",
  attachImage: "Adjuntar una imagen",
  attachChatOnly: "Los adjuntos funcionan en modo Chat",
  attachRef: "Adjunta una imagen de referencia (imagen a imagen)",
  attachSeed: "Adjunta una imagen inicial (imagen a video)",
  actionLike: "Buena respuesta",
  actionDislike: "Mala respuesta",
  actionRetry: "Regenerar",
  actionCopy: "Copiar",
  language: "Idioma",
  theme: "Tema",
  themeGold: "Dorado",
  themeLight: "Claro",
  themeDark: "Oscuro",
  installCli: "Instalar desde npm",
  copied: "Copiado",
  phone: "Teléfono",
  tools: "Herramientas",
  skills: "Habilidades",
  gallery: "Galería",
  wallet: "Cartera",
  marketplace: "Mercado",
  marketplaceTitle: "Mercado",
  tryIt: "Probar",
  poweredBy: "Con tecnología de",
  examples: "Ejemplos",
  toolsTitle: "Qué puede hacer Franklin",
  toolsSub: "Chat, generación y herramientas en vivo — pago por uso en USDC, sin suscripción. Las marcadas «auto» las usa Franklin automáticamente.",
  skillsTitle: "Habilidades",
  skillsSub: "Empieza rápido — elige una habilidad y Franklin prepara el prompt.",
  galleryTitle: "Galería",
  galleryEmpty: "Las imágenes y videos que generes aparecerán aquí.",
  galleryDelete: "Eliminar",
  galleryDeleteConfirm: "¿Eliminar esto de tu galería? También se quitará de la conversación.",
  walletTitle: "Billetera",
  balance: "Saldo",
  topUp: "Envía USDC en Base a tu billetera conectada para recargar.",
  costByModel: "Costo por modelo",
  receipts: "Recibos",
  walletEmpty: "Conecta tu billetera para ver saldo y gastos.",
  searchChats: "Buscar chats",
  noResults: "Sin resultados.",
  today: "Hoy",
  yesterday: "Ayer",
  last7days: "Últimos 7 días",
  older: "Anteriores",
  signIn: "Iniciar sesión",
  more: "Más",
  settings: "Ajustes",
  officialSite: "Sitio oficial",
  rename: "Renombrar",
  about: "Acerca de",
  docs: "Docs",
  blog: "Blog",
  casePrediction: "¿Qué probabilidad hay de que la Fed baje tasas en marzo?",
  casePrediction2: "¿Quién es favorito para ganar las próximas elecciones de EE.UU. en Polymarket?",
  casePrediction3: "¿Qué dicen los mercados de predicción sobre una recesión este año?",
  casePrice: "¿Cuál es el precio de BTC ahora?",
  caseSearch: "¿Cuáles son las últimas noticias sobre agentes de IA?",
  caseMusic: "Compón un beat lo-fi de 30 segundos.",
  emptyChat: "¿Qué debería hacer Franklin?",
  emptyImage: "¿Qué debería dibujar Franklin?",
  emptyVideo: "¿Qué debería filmar Franklin?",
  phMessage: "Escribe a Franklin…",
  phImage: "Describe una imagen…",
  phVideo: "Describe un video…",
  phConnect: "Conecta una billetera para empezar…",
  focusPrediction: "Predicción",
  focusSearch: "Búsqueda web",
  focusPrice: "Precios",
  phPrediction: "Pregunta por probabilidades de mercados de predicción…",
  phSearch: "Busca en la web…",
  phPrice: "Pide un precio en vivo…",
  hintImage: "Conecta una billetera para generar imágenes.",
  hintVideo: "Conecta una billetera para generar videos.",
  hintChat: (m) => `Conecta una billetera para usar ${m}, o cambia a un modelo gratuito.`,
  hintToolWallet: "Franklin necesita una herramienta de pago (búsqueda web, mercados de predicción…). Conecta tu billetera para continuar.",
  statusSigning: "Firma el pago en tu billetera…",
  statusWorking: "Franklin está trabajando…",
  statusImage: "Pintando tu imagen…",
  statusVideo: "Renderizando tu video (puede tardar un minuto)…",
  openFull: "Ver tamaño completo",
  downloadMp4: "Descargar MP4",
  reasoning: "Razonamiento",
  spent: "Gastado",
  requests: (n) => `${n} solicitud${n===1?"":"es"}`,
  toolRunning: (tool) => ({web_search:"Buscando en la web…",get_market_price:"Consultando precios…",search_prediction_markets:"Consultando mercados de predicción…",generate_music:"Componiendo música…",make_phone_call:"Realizando la llamada…"}[tool] || "Usando una herramienta…"),
  activitySearched: (q, s) => `Buscó ${q} ${q === 1 ? "palabra clave" : "palabras clave"}${s ? ` · ${s} ${s === 1 ? "fuente" : "fuentes"}` : ""}`,
  activityUsed: (n) => `Usó ${n} ${n === 1 ? "herramienta" : "herramientas"}`,
  sugChat: [
    "Explica los micropagos x402 en dos frases.",
    "Escribe una función de Python para consultar un saldo de USDC.",
    "¿Qué puede hacer un agente de IA con billetera que un chatbot no?",
  ],
  sugImage: [
    "Un retrato en escala de grises de Benjamin Franklin, estilo grabado de billete",
    "Una moneda de oro 3D isométrica, luz de estudio suave",
    "Un póster minimalista de un agente de IA autónomo, crema y oro",
  ],
  sugVideo: [
    "Travelling lento sobre un océano en calma a la hora dorada",
    "Una moneda de oro girando sobre mármol, macro, cinematográfico",
    "Calle de ciudad con neón bajo la lluvia, reflejos, 4k",
  ],
};

const DICTS: Record<TryLang, TryDict> = { en, zh, es };
const STORAGE_KEY = "franklin-try-ui-lang";

interface Ctx {
  lang: TryLang;
  setLang: (l: TryLang) => void;
  t: TryDict;
}
const TryLangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: en });

export function TryLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<TryLang>("en");
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as TryLang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);
  const setLang = useCallback((l: TryLang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);
  return <TryLangCtx.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</TryLangCtx.Provider>;
}

export function useTryLang() {
  return useContext(TryLangCtx);
}
