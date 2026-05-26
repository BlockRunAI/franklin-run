"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useX402Payment, parseX402FromResponse } from "./use-x402-payment";
import { FRANKLIN_SYSTEM_PROMPT } from "@/lib/franklin-system-prompt";

// Browser-side chat + image generation against BlockRun's x402 API, proxied
// through /api/blockrun. Free chat models return 200 directly; paid models
// (and all image models) return 402 first — we sign once with the wallet,
// then retry with X-Payment. Image generation has a fast path (200 inline)
// and a slow path (202 + poll_url) which we poll, reusing one signature.

const CHAT_ENDPOINT = "/api/blockrun/v1/chat/completions";
const IMAGE_ENDPOINT = "/api/blockrun/v1/images/generations";
const VIDEO_ENDPOINT = "/api/blockrun/v1/videos/generations";

export type ChatMode = "chat" | "image" | "video";

export interface ChatModel {
  id: string;
  label: string;
  free?: boolean;
  group?: string;
}

// Mirrors Franklin's curated /model picker (src/ui/model-picker.ts in the
// Franklin repo) so the web preview offers the same lineup. The free default
// (DeepSeek V4 Flash) leads so anyone can try with no wallet.
export const CHAT_MODELS: ChatModel[] = [
  // Auto (smart routing) is hidden for now — kept in resolveAuto for later.
  // Free (no USDC needed)
  { id: "nvidia/deepseek-v4-flash", label: "DeepSeek V4 Flash", free: true, group: "Free" },
  { id: "nvidia/qwen3-coder-480b", label: "Qwen3 Coder 480B", free: true, group: "Free" },
  { id: "nvidia/llama-4-maverick", label: "Llama 4 Maverick", free: true, group: "Free" },
  // Premium frontier
  { id: "anthropic/claude-opus-4.7", label: "Claude Opus 4.7", group: "Premium frontier" },
  { id: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6", group: "Premium frontier" },
  { id: "openai/gpt-5.5", label: "GPT-5.5", group: "Premium frontier" },
  { id: "google/gemini-3.1-pro", label: "Gemini 3.1 Pro", group: "Premium frontier" },
  { id: "xai/grok-4-0709", label: "Grok 4", group: "Premium frontier" },
  // Reasoning
  { id: "openai/o3", label: "O3", group: "Reasoning" },
  { id: "openai/gpt-5.3-codex", label: "GPT-5.3 Codex", group: "Reasoning" },
  { id: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro", group: "Reasoning" },
  { id: "xai/grok-4-1-fast-reasoning", label: "Grok 4.1 Fast", group: "Reasoning" },
  // Budget
  { id: "anthropic/claude-haiku-4.5-20251001", label: "Claude Haiku 4.5", group: "Budget" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", group: "Budget" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", group: "Budget" },
  { id: "deepseek/deepseek-chat", label: "DeepSeek V4 Flash Chat", group: "Budget" },
  { id: "moonshot/kimi-k2.6", label: "Kimi K2.6", group: "Budget" },
];

// Typical image models (all paid — image generation always needs a wallet).
export const IMAGE_MODELS: ChatModel[] = [
  { id: "google/nano-banana-pro", label: "Nano Banana Pro" },
  { id: "openai/gpt-image-2", label: "GPT Image 2" },
  { id: "openai/dall-e-3", label: "DALL·E 3" },
  { id: "xai/grok-imagine-image", label: "Grok Imagine" },
];

// Typical video models (all paid; generation is async — submit then poll).
export const VIDEO_MODELS: ChatModel[] = [
  { id: "bytedance/seedance-2.0-fast", label: "Seedance 2.0 Fast" },
  { id: "bytedance/seedance-2.0", label: "Seedance 2.0 Pro" },
  { id: "xai/grok-imagine-video", label: "Grok Imagine Video" },
  { id: "azure/sora-2", label: "Sora 2" },
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  kind?: "text" | "image" | "video";
  image?: string;
  video?: string;
  reasoning?: string;
}

// Vision-capable chat models (mirrors Franklin's src/router/vision.ts). Used to
// auto-swap to a vision model when the user attaches an image to a text-only one.
const VISION_MODELS = new Set<string>([
  "anthropic/claude-opus-4.7",
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-haiku-4.5-20251001",
  "openai/gpt-5.5",
  "openai/gpt-5-mini",
  "openai/o3",
  "google/gemini-3.1-pro",
  "google/gemini-2.5-flash",
  "xai/grok-4-0709",
  "moonshot/kimi-k2.6",
  "nvidia/llama-4-maverick",
]);

function isVisionModel(id: string): boolean {
  return VISION_MODELS.has(id);
}

// Lightweight client-side "Auto" router (the gateway's chat endpoint doesn't
// accept the blockrun/auto alias — Franklin routes client-side too). Sends
// simple prompts to a fast model and complex ones to a frontier model.
const AUTO_SIMPLE = "google/gemini-2.5-flash";
const AUTO_COMPLEX = "anthropic/claude-opus-4.7";
function resolveAuto(prompt: string): string {
  const complex =
    prompt.length > 400 ||
    /\b(code|coding|debug|refactor|algorithm|prove|analy[sz]e|architect|optimi[sz]e|step[- ]by[- ]step|why|design)\b/i.test(
      prompt,
    );
  return complex ? AUTO_COMPLEX : AUTO_SIMPLE;
}

// Pick a vision sibling in the same provider family, else a sensible default.
function pickVisionSibling(id: string): string {
  const family = id.split("/")[0]?.toLowerCase();
  if (family) {
    const sibling = [...VISION_MODELS].find((m) => m.startsWith(`${family}/`));
    if (sibling) return sibling;
  }
  return "anthropic/claude-sonnet-4.6";
}

// ─── Agent tools (function calling) ────────────────────────────────────────
// Franklin decides when to use these from the conversation; they are NOT
// surfaced as UI buttons. Each maps to a paid BlockRun endpoint (x402).
const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the live web for current information — recent events, news, prices, facts you may not know. Returns cited results.",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "The search query" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "make_phone_call",
      description:
        "Place an AI voice phone call to a real number and hold a conversation to accomplish a task (e.g. book a table, ask a question). Use only when the user explicitly wants a phone call made. Costs ~$0.54.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient phone number in E.164 format, e.g. +14155552671" },
          task: { type: "string", description: "What the AI should say / accomplish on the call (min 10 chars)" },
        },
        required: ["to", "task"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_music",
      description:
        "Generate a piece of music or a song from a text description (and optional lyrics). Returns a playable audio URL. Use when the user asks to create music or a song.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Description of the music (genre, mood, instruments)" },
          lyrics: { type: "string", description: "Optional lyrics to sing" },
          duration_seconds: { type: "number", description: "Length in seconds (5–240), default 30" },
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_market_price",
      description:
        "Get the current price of a crypto coin, US stock, or FX pair. Use for any 'what's the price of X' question. Cheap ($0.001).",
      parameters: {
        type: "object",
        properties: {
          symbol: { type: "string", description: "Ticker/symbol, e.g. BTC, AAPL, EUR/USD" },
          market: { type: "string", enum: ["crypto", "usstock", "fx"], description: "Which market the symbol belongs to" },
        },
        required: ["symbol", "market"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_prediction_markets",
      description:
        "Search prediction markets (Polymarket, Kalshi, Limitless, etc.) for live odds on an event or topic. Use for questions about prediction-market odds or what the market thinks.",
      parameters: {
        type: "object",
        properties: { query: { type: "string", description: "Event or topic to search for" } },
        required: ["query"],
      },
    },
  },
] as const;

// Only models with reliable function-calling get tools (and run non-streamed).
// Free NVIDIA models stay on the streaming path without tools.
function supportsTools(model: string): boolean {
  return /^(openai|anthropic|google|x-ai|xai|deepseek|moonshot)\//.test(model);
}

// Split inline <think>…</think> chain-of-thought out of a model's text.
function splitThinking(raw: string): { answer: string; thinking: string } {
  let thinking = "";
  let answer = raw.replace(/<think(?:ing)?>([\s\S]*?)<\/think(?:ing)?>/gi, (_, inner) => {
    thinking += inner;
    return "";
  });
  const openIdx = answer.search(/<think(?:ing)?>/i);
  if (openIdx !== -1) {
    thinking += answer.slice(openIdx).replace(/<think(?:ing)?>/i, "");
    answer = answer.slice(0, openIdx);
  }
  return { answer: answer.trim(), thinking: thinking.trim() };
}

export type ChatStatus = "idle" | "signing" | "thinking" | "generating" | "error";

type Setter = ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]);

// Controlled messages — the conversation lives in useChatHistory so it can be
// persisted and switched. This hook drives sending/generating against them.
export function useFranklinChat(
  messages: ChatMessage[],
  setMessages: (m: Setter) => void,
  onSpend?: (model: string, usd: number) => void,
) {
  const { isConnected } = useAccount();
  const { makePayment } = useX402Payment();
  const onSpendRef = useRef(onSpend);
  useEffect(() => {
    onSpendRef.current = onSpend;
  }, [onSpend]);
  // Model attributed to the next payment (set by each run* before it pays).
  const modelRef = useRef("");

  const [mode, setMode] = useState<ChatMode>("chat");
  const [chatModel, setChatModel] = useState(CHAT_MODELS[0].id);
  const [imageModel, setImageModel] = useState(IMAGE_MODELS[0].id);
  const [videoModel, setVideoModel] = useState(VIDEO_MODELS[0].id);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // Always read the freshest messages inside async flows.
  const msgRef = useRef(messages);
  useEffect(() => {
    msgRef.current = messages;
  }, [messages]);

  const model = mode === "image" ? imageModel : mode === "video" ? videoModel : chatModel;
  const setModel = mode === "image" ? setImageModel : mode === "video" ? setVideoModel : setChatModel;
  const models = mode === "image" ? IMAGE_MODELS : mode === "video" ? VIDEO_MODELS : CHAT_MODELS;
  const selectedModel = models.find((m) => m.id === model);

  const signal = () => abortRef.current?.signal;

  // Pay-aware fetch: probe → 402 → sign → retry with X-Payment. Supports GET
  // (no body) for the read-only data tools (markets, prices, prediction).
  const paidFetch = useCallback(
    async (url: string, body?: string, method: "POST" | "GET" = "POST"): Promise<Response> => {
      const sig = () => abortRef.current?.signal;
      const init = (extra?: Record<string, string>): RequestInit =>
        method === "GET"
          ? { method, headers: { ...extra }, signal: sig() }
          : { method, headers: { "Content-Type": "application/json", ...extra }, body, signal: sig() };
      let res = await fetch(url, init());
      if (res.status === 402) {
        const reqs = parseX402FromResponse(res);
        if (!reqs) throw new Error("Could not read payment requirements from the server.");
        setStatus("signing");
        const { payload, error: signErr } = await makePayment(reqs);
        if (!payload) throw new Error(signErr || "Wallet signature failed.");
        const usd = Number(reqs.accepts?.[0]?.amount || 0) / 1_000_000;
        if (usd) onSpendRef.current?.(modelRef.current, usd);
        res = await fetch(url, init({ "X-Payment": payload }));
      }
      return res;
    },
    [makePayment],
  );

  // Abort the in-flight generation; partial streamed output is kept.
  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const send = useCallback(
    async (text: string, attachment?: string, modeOverride?: ChatMode) => {
      const prompt = text.trim();
      if ((!prompt && !attachment) || inFlight.current) return;
      inFlight.current = true;
      setError(null);
      abortRef.current = new AbortController();
      const activeMode = modeOverride ?? mode;

      const userMsg: ChatMessage = {
        role: "user",
        content: prompt,
        kind: "text",
        ...(attachment ? { image: attachment } : {}),
      };
      const history = [...msgRef.current, userMsg];
      setMessages(history);

      try {
        if (activeMode === "image") {
          await runImage(prompt);
        } else if (activeMode === "video") {
          await runVideo(prompt);
        } else {
          await runChat(history);
        }
      } catch (err) {
        const aborted =
          abortRef.current?.signal.aborted || (err instanceof Error && err.name === "AbortError");
        if (aborted) {
          // User stopped it — keep any partial output, no error shown.
          setStatus("idle");
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setStatus("error");
        }
        setStreaming(false);
      } finally {
        inFlight.current = false;
        abortRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, chatModel, imageModel, videoModel, paidFetch, setMessages],
  );

  // Paid request → parsed JSON (handles 402→sign→retry). POST by default; GET
  // for read-only data tools.
  async function paidJson(url: string, payload?: unknown, method: "POST" | "GET" = "POST"): Promise<Record<string, unknown>> {
    const res = await paidFetch(url, method === "GET" ? undefined : JSON.stringify(payload), method);
    if (!res.ok) throw new Error(await errMsg(res));
    return res.json();
  }

  // Execute one tool call → returns a string result fed back to the model.
  async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
    try {
      if (name === "web_search") {
        modelRef.current = "web_search";
        const j = await paidJson("/api/blockrun/v1/search", { query: String(args.query ?? "") });
        return JSON.stringify(j).slice(0, 4000);
      }
      if (name === "make_phone_call") {
        modelRef.current = "make_phone_call";
        const submit = await paidJson("/api/blockrun/v1/voice/call", {
          to: String(args.to ?? ""),
          task: String(args.task ?? ""),
          max_duration: 5,
        });
        const callId = submit.call_id || submit.callId || submit.id;
        if (!callId) return JSON.stringify(submit).slice(0, 2000);
        // Poll the call up to ~3 min for a transcript; otherwise report in-progress.
        const start = Date.now();
        while (Date.now() - start < 180_000) {
          if (signal()?.aborted) break;
          await new Promise((r) => setTimeout(r, 6000));
          const s = await fetch(`/api/blockrun/v1/voice/call/${callId}`, { signal: abortRef.current?.signal });
          if (!s.ok) continue;
          const sj = await s.json();
          if (sj.status === "completed" || sj.completed || sj.transcript) {
            return JSON.stringify({ status: sj.status, transcript: sj.transcript, summary: sj.summary }).slice(0, 4000);
          }
        }
        return `Call placed (id ${callId}); still in progress.`;
      }
      if (name === "generate_music") {
        modelRef.current = "generate_music";
        const res = await paidFetch(
          "/api/blockrun/v1/audio/generations",
          JSON.stringify({
            prompt: String(args.prompt ?? ""),
            ...(args.lyrics ? { lyrics: String(args.lyrics) } : {}),
            duration_seconds: Number(args.duration_seconds) || 30,
          }),
        );
        if (!res.ok) throw new Error(await errMsg(res));
        const url = res.status === 202 ? await pollMedia(res, 180_000) : extractMediaUrl(await res.json());
        return url ? `Music generated: ${url}` : "Music generation returned no audio.";
      }
      if (name === "get_market_price") {
        modelRef.current = "get_market_price";
        const market = ["crypto", "usstock", "fx"].includes(String(args.market)) ? String(args.market) : "crypto";
        const symbol = encodeURIComponent(String(args.symbol ?? "").replace(/\//g, "-"));
        const j = await paidJson(`/api/blockrun/v1/${market}/price/${symbol}`, undefined, "GET");
        return JSON.stringify(j).slice(0, 2000);
      }
      if (name === "search_prediction_markets") {
        modelRef.current = "search_prediction_markets";
        const q = encodeURIComponent(String(args.query ?? ""));
        const j = await paidJson(`/api/blockrun/v1/pm/markets/search?q=${q}&limit=10`, undefined, "GET");
        return JSON.stringify(j).slice(0, 4000);
      }
      return `Unknown tool: ${name}`;
    } catch (e) {
      return `Tool ${name} failed: ${e instanceof Error ? e.message : "error"}`;
    }
  }

  // Tool-calling loop (non-streamed) for tool-capable models. Tool-call and
  // tool-result messages live only in this API-local array — they are never
  // shown in the UI; the user just sees their message and the final answer.
  async function runChatWithTools(history: ChatMessage[], model: string) {
    setStatus("thinking");
    type ApiMsg = Record<string, unknown>;
    const apiMessages: ApiMsg[] = [
      { role: "system", content: FRANKLIN_SYSTEM_PROMPT },
      ...history
        .filter((m) => m.kind !== "video" && !(m.kind === "image" && m.role === "assistant"))
        .map((m) =>
          m.role === "user" && m.image
            ? {
                role: "user",
                content: [
                  ...(m.content ? [{ type: "text", text: m.content }] : []),
                  { type: "image_url", image_url: { url: m.image } },
                ],
              }
            : { role: m.role, content: m.content },
        ),
    ];

    for (let i = 0; i < 6; i++) {
      const json = await paidJson(CHAT_ENDPOINT, { model, messages: apiMessages, tools: TOOL_SCHEMAS, stream: false });
      const choices = json.choices as Array<{ message?: ApiMsg }> | undefined;
      const msg = choices?.[0]?.message;
      const toolCalls = (msg?.tool_calls as Array<{ id: string; function: { name: string; arguments: string } }>) || [];
      if (toolCalls.length) {
        apiMessages.push(msg as ApiMsg);
        for (const tc of toolCalls) {
          let parsed: Record<string, unknown> = {};
          try {
            parsed = JSON.parse(tc.function.arguments || "{}");
          } catch {
            /* ignore */
          }
          const result = await executeTool(tc.function.name, parsed);
          apiMessages.push({ role: "tool", tool_call_id: tc.id, content: result });
        }
        continue;
      }
      const content = (msg?.content as string) || "(empty response)";
      const { answer, thinking } = splitThinking(content);
      setMessages((m) => [...m, { role: "assistant", content: answer || content, kind: "text", reasoning: thinking || undefined }]);
      setStatus("idle");
      return;
    }
    setMessages((m) => [...m, { role: "assistant", content: "Stopped after too many tool steps.", kind: "text" }]);
    setStatus("idle");
  }

  // Streamed chat — required because slow models can exceed the upstream
  // (Cloudflare) 100s budget on a non-streamed call and 524. Streaming starts
  // emitting tokens immediately, and gives a typewriter effect.
  async function runChat(history: ChatMessage[]) {
    setStatus("thinking");
    // Resolve "Auto" client-side, then vision-route: if the turn carries an
    // image and the chosen model can't see, swap to a vision-capable sibling.
    const hasImage = history.some((m) => m.role === "user" && m.image);
    const lastPrompt = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
    let effectiveModel = chatModel === "blockrun/auto" ? resolveAuto(lastPrompt) : chatModel;
    if (hasImage && !isVisionModel(effectiveModel)) effectiveModel = pickVisionSibling(effectiveModel);
    modelRef.current = effectiveModel;

    // Tool-capable models run the agent tool-calling loop (non-streamed).
    // Free/other models stay on the streaming path below (no tools).
    if (supportsTools(effectiveModel)) {
      await runChatWithTools(history, effectiveModel);
      return;
    }

    const body = JSON.stringify({
      model: effectiveModel,
      messages: [
        { role: "system", content: FRANKLIN_SYSTEM_PROMPT },
        ...history
          .filter((m) => m.kind !== "video" && !(m.kind === "image" && m.role === "assistant"))
          .map((m) => {
            // A user message with an attached image → OpenAI vision content array.
            if (m.role === "user" && m.image) {
              return {
                role: "user",
                content: [
                  ...(m.content ? [{ type: "text", text: m.content }] : []),
                  { type: "image_url", image_url: { url: m.image } },
                ],
              };
            }
            return { role: m.role, content: m.content };
          }),
      ],
      stream: true,
    });

    const res = await paidFetch(CHAT_ENDPOINT, body);
    if (!res.ok || !res.body) throw new Error(await errMsg(res));

    // Append the assistant bubble we'll stream into.
    setMessages((m) => [...m, { role: "assistant", content: "", kind: "text" }]);
    setStatus("idle");
    setStreaming(true);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let acc = "";          // raw content (may contain <think> tags)
    let reasoningAcc = ""; // from the separate reasoning_content field

    const writeLast = (content: string, reasoning: string) =>
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant")
          copy[copy.length - 1] = { ...last, content, reasoning: reasoning || undefined };
        return copy;
      });

    const flush = () => {
      const { answer, thinking } = splitThinking(acc);
      const reasoning = [reasoningAcc.trim(), thinking].filter(Boolean).join("\n").trim();
      writeLast(answer, reasoning);
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const data = t.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta || {};
          if (delta.reasoning_content) reasoningAcc += delta.reasoning_content;
          if (delta.content) acc += delta.content;
          if (delta.content || delta.reasoning_content) flush();
        } catch {
          /* ignore keep-alive / partial lines */
        }
      }
    }

    if (!acc && !reasoningAcc) writeLast("(empty response)", "");
    setStreaming(false);
  }

  async function runImage(prompt: string) {
    setStatus("generating");
    modelRef.current = imageModel;
    const body = JSON.stringify({ model: imageModel, prompt, n: 1 });
    const res = await paidFetch(IMAGE_ENDPOINT, body);
    setStatus("generating");

    let url: string | undefined;
    if (res.status === 202) {
      url = await pollMedia(res, 120_000);
    } else {
      if (!res.ok) throw new Error(await errMsg(res));
      url = extractMediaUrl(await res.json());
    }
    if (!url) throw new Error("No image came back from the model.");
    setMessages((m) => [...m, { role: "assistant", content: prompt, kind: "image", image: url }]);
    setStatus("idle");
  }

  // Video is always async: submit returns 202 + poll_url, poll until completed
  // (can take 1–3 min). Cheaper/faster models recommended for the preview.
  async function runVideo(prompt: string) {
    setStatus("generating");
    modelRef.current = videoModel;
    const body = JSON.stringify({ model: videoModel, prompt });
    const res = await paidFetch(VIDEO_ENDPOINT, body);
    setStatus("generating");

    let url: string | undefined;
    if (res.status === 202 || res.ok) {
      url = res.status === 202 ? await pollMedia(res, 300_000) : extractMediaUrl(await res.json());
    } else {
      throw new Error(await errMsg(res));
    }
    if (!url) throw new Error("No video came back from the model.");
    setMessages((m) => [...m, { role: "assistant", content: prompt, kind: "video", video: url }]);
    setStatus("idle");
  }

  // Slow-path poll for image/video jobs. First poll typically 402 — sign once
  // and reuse that signature for every subsequent poll (server settles on done).
  async function pollMedia(submitRes: Response, maxMs: number): Promise<string | undefined> {
    const submit = await submitRes.json();
    const pollPath: string | undefined = submit.poll_url;
    if (!pollPath) return extractMediaUrl(submit);
    const proxied = pollPath.startsWith("/api/blockrun")
      ? pollPath
      : `/api/blockrun${pollPath.replace(/^.*\/api/, "")}`;

    let sig: string | null = null;
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (signal()?.aborted) throw new DOMException("Aborted", "AbortError");
      const headers: Record<string, string> = {};
      if (sig) headers["X-Payment"] = sig;
      const r = await fetch(proxied, { headers, signal: abortRef.current?.signal });
      if (r.status === 402 && !sig) {
        const reqs = parseX402FromResponse(r);
        if (!reqs) throw new Error("Poll missing payment requirements.");
        setStatus("signing");
        const { payload, error: e } = await makePayment(reqs);
        if (!payload) throw new Error(e || "Wallet signature failed.");
        const usd = Number(reqs.accepts?.[0]?.amount || 0) / 1_000_000;
        if (usd) onSpendRef.current?.(modelRef.current, usd);
        sig = payload;
        setStatus("generating");
        continue;
      }
      if (!r.ok) throw new Error(await errMsg(r));
      const j = await r.json();
      const st = j.status;
      if (st === "completed" || st === "settled" || j.data) {
        return extractMediaUrl(j);
      }
      await new Promise((res) => setTimeout(res, 4000));
    }
    throw new Error("Generation is taking too long — try again.");
  }

  const isBusy =
    status === "signing" || status === "thinking" || status === "generating" || streaming;

  return {
    isConnected,
    mode,
    setMode,
    model,
    setModel,
    models,
    selectedModel,
    status,
    error,
    isBusy,
    send,
    stop,
  };
}

function extractMediaUrl(json: Record<string, unknown>): string | undefined {
  const data = (json.data as Array<Record<string, string>>) || [];
  const first = data[0];
  if (!first) return undefined;
  if (first.url) return first.url;
  if (first.b64_json) return `data:image/png;base64,${first.b64_json}`;
  return undefined;
}

async function errMsg(res: Response): Promise<string> {
  const j = await res.json().catch(() => ({}));
  return (
    (j as Record<string, { message?: string }>).error?.message ||
    (j as Record<string, string>).error ||
    (j as Record<string, string>).message ||
    `Request failed (HTTP ${res.status})`
  );
}
