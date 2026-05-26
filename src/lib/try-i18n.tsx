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
  connectWallet: string;
  connecting: string;
  installWallet: string;
  image: string;
  video: string;
  attachImage: string;
  attachChatOnly: string;
  language: string;
  phone: string;
  casePrediction: string;
  casePrediction2: string;
  casePrediction3: string;
  // empty-state titles (the word "Franklin" is highlighted at render time)
  emptyChat: string;
  emptyImage: string;
  emptyVideo: string;
  // composer placeholders
  phMessage: string;
  phImage: string;
  phVideo: string;
  phConnect: string;
  // wallet hints
  hintImage: string;
  hintVideo: string;
  hintChat: (model: string) => string;
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
  // suggestions
  sugChat: string[];
  sugImage: string[];
  sugVideo: string[];
}

const en: TryDict = {
  newChat: "New chat",
  noConversations: "No conversations yet.",
  connectWallet: "Connect wallet",
  connecting: "Connecting…",
  installWallet: "Install a wallet",
  image: "Image",
  video: "Video",
  attachImage: "Attach an image",
  attachChatOnly: "Attachments work in Chat mode",
  language: "Language",
  phone: "Phone",
  casePrediction: "What are the odds the Fed cuts rates in March?",
  casePrediction2: "Who is favored to win the next US election on Polymarket?",
  casePrediction3: "What do prediction markets say about a recession this year?",
  emptyChat: "What should Franklin do?",
  emptyImage: "What should Franklin draw?",
  emptyVideo: "What should Franklin film?",
  phMessage: "Message Franklin…",
  phImage: "Describe an image…",
  phVideo: "Describe a video…",
  phConnect: "Connect a wallet to begin…",
  hintImage: "Connect a wallet to generate images.",
  hintVideo: "Connect a wallet to generate videos.",
  hintChat: (m) => `Connect a wallet to use ${m}, or switch to a free model.`,
  statusSigning: "Sign the payment in your wallet…",
  statusWorking: "Franklin is working…",
  statusImage: "Painting your image…",
  statusVideo: "Rendering your video (this can take a minute)…",
  openFull: "Open full size",
  downloadMp4: "Download MP4",
  reasoning: "Thoughts",
  spent: "Spent",
  requests: (n) => `${n} request${n===1?"":"s"}`,
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
  connectWallet: "连接钱包",
  connecting: "连接中…",
  installWallet: "安装钱包",
  image: "图像",
  video: "视频",
  attachImage: "添加图片",
  attachChatOnly: "附件仅在对话模式可用",
  language: "语言",
  phone: "电话",
  casePrediction: "美联储 3 月降息的概率是多少？",
  casePrediction2: "Polymarket 上谁更可能赢得下届美国大选？",
  casePrediction3: "预测市场怎么看今年会不会衰退？",
  emptyChat: "让 Franklin 做点什么？",
  emptyImage: "让 Franklin 画点什么？",
  emptyVideo: "让 Franklin 拍点什么？",
  phMessage: "给 Franklin 发消息…",
  phImage: "描述一张图片…",
  phVideo: "描述一段视频…",
  phConnect: "连接钱包后开始…",
  hintImage: "连接钱包以生成图片。",
  hintVideo: "连接钱包以生成视频。",
  hintChat: (m) => `连接钱包以使用 ${m}，或切换到免费模型。`,
  statusSigning: "请在钱包中签名付款…",
  statusWorking: "Franklin 正在处理…",
  statusImage: "正在绘制图片…",
  statusVideo: "正在渲染视频（可能需要一会儿）…",
  openFull: "查看原图",
  downloadMp4: "下载 MP4",
  reasoning: "推理过程",
  spent: "已花费",
  requests: (n) => `${n} 次请求`,
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
  connectWallet: "Conectar billetera",
  connecting: "Conectando…",
  installWallet: "Instalar billetera",
  image: "Imagen",
  video: "Video",
  attachImage: "Adjuntar una imagen",
  attachChatOnly: "Los adjuntos funcionan en modo Chat",
  language: "Idioma",
  phone: "Teléfono",
  casePrediction: "¿Qué probabilidad hay de que la Fed baje tasas en marzo?",
  casePrediction2: "¿Quién es favorito para ganar las próximas elecciones de EE.UU. en Polymarket?",
  casePrediction3: "¿Qué dicen los mercados de predicción sobre una recesión este año?",
  emptyChat: "¿Qué debería hacer Franklin?",
  emptyImage: "¿Qué debería dibujar Franklin?",
  emptyVideo: "¿Qué debería filmar Franklin?",
  phMessage: "Escribe a Franklin…",
  phImage: "Describe una imagen…",
  phVideo: "Describe un video…",
  phConnect: "Conecta una billetera para empezar…",
  hintImage: "Conecta una billetera para generar imágenes.",
  hintVideo: "Conecta una billetera para generar videos.",
  hintChat: (m) => `Conecta una billetera para usar ${m}, o cambia a un modelo gratuito.`,
  statusSigning: "Firma el pago en tu billetera…",
  statusWorking: "Franklin está trabajando…",
  statusImage: "Pintando tu imagen…",
  statusVideo: "Renderizando tu video (puede tardar un minuto)…",
  openFull: "Ver tamaño completo",
  downloadMp4: "Descargar MP4",
  reasoning: "Razonamiento",
  spent: "Gastado",
  requests: (n) => `${n} solicitud${n===1?"":"es"}`,
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
