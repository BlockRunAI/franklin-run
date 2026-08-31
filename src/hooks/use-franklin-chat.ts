"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet, chainHeaders, type WalletChain } from "./use-wallet";
import { useX402Payment, parseX402FromResponse, selectRequirement } from "./use-x402-payment";
import { FRANKLIN_SYSTEM_PROMPT, FRANKLIN_TOOLS_PROMPT, systemPromptDateLine } from "@/lib/franklin-system-prompt";

// Browser's IANA timezone (e.g. "Asia/Shanghai") — passed to systemPromptDateLine
// so the model greets in the user's local time. Safe-guarded for SSR.
function userTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

// Browser-side chat + image generation against BlockRun's x402 API, proxied
// through /api/blockrun. Free chat models return 200 directly; paid models
// (and all image models) return 402 first — we sign once with the wallet,
// then retry with X-Payment. Image generation has a fast path (200 inline)
// and a slow path (202 + poll_url) which we poll, reusing one signature.

// Chat goes through Anthropic-native `/v1/messages`, matching Franklin CLI
// (src/agent/llm.ts). The OpenAI-compat `/v1/chat/completions` path on the
// gateway loses fidelity when translating tool schemas for NVIDIA-hosted
// free models (deepseek-v4-flash, qwen3-coder, llama-4-maverick) — they
// receive an unparseable schema and roleplay tool calls as `<tool_call>...`
// text. The Anthropic path preserves the schema end-to-end.
const CHAT_ENDPOINT = "/api/blockrun/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const IMAGE_ENDPOINT = "/api/blockrun/v1/images/generations";
const IMAGE_EDIT_ENDPOINT = "/api/blockrun/v1/images/image2image";
const VIDEO_ENDPOINT = "/api/blockrun/v1/videos/generations";
const MUSIC_ENDPOINT = "/api/blockrun/v1/audio/generations";

// Models whose edit route accepts a reference image — mirrors
// EDIT_SUPPORTED_MODELS in `blockrun/src/app/api/v1/images/image2image/route.ts`
// (OpenAI plus the whole Nano Banana family). When a reference is attached to
// any other model we force gpt-image-2, the only one that also takes a mask.
const EDIT_SUPPORTED_IMAGE_MODELS = new Set([
  "openai/gpt-image-1",
  "openai/gpt-image-2",
  "google/nano-banana",
  "google/nano-banana-2",
  "google/nano-banana-pro",
]);

// Per-provider multi-image fusion cap for image2image. Mirrors the gateway's
// MAX_IMAGES_BY_PREFIX in `blockrun/src/app/api/v1/images/image2image/route.ts`
// — OpenAI gpt-image-* fuses up to 4 anchors, Google Nano Banana up to 3, and
// every other model accepts a single reference. The composer hides the
// "+" button past this cap and gateway hard-rejects any attempt to exceed it.
const IMAGE_FUSION_MAX_BY_PREFIX: Record<string, number> = {
  "openai/": 4,
  "google/": 3,
};
function maxImageFusionFor(modelId: string): number {
  const prefix = modelId.split("/")[0];
  return IMAGE_FUSION_MAX_BY_PREFIX[`${prefix}/`] ?? 1;
}

// Vision-attachment cap for chat mode. Anthropic /v1/messages tolerates 20+
// image blocks per turn and OpenAI vision similarly accepts many; the actual
// constraint is token budget + UX. 4 is a clean upper bound that matches the
// image2image canvas cap so the composer feels symmetric across modes.
const CHAT_VISION_MAX = 4;

/** Max attachments the composer should accept for the given mode + model.
 *  Music mode is text-only; video uses a single seed frame; image and chat
 *  scale by provider. */
export function maxAttachmentsFor(mode: ChatMode, modelId: string): number {
  if (mode === "music") return 0;
  if (mode === "video") return 1;
  if (mode === "image") return maxImageFusionFor(modelId);
  // chat — only meaningful when the active model is vision-capable; the UI
  // gates the file button on that elsewhere.
  return CHAT_VISION_MAX;
}

// Video models that accept a seed image (image-to-video). Sora 2 does not, so a
// reference attached to it falls back to the default img2video model.
const VIDEO_IMAGE_INPUT_MODELS = new Set([
  "xai/grok-imagine-video",
  "bytedance/seedance-2.0-fast",
  "bytedance/seedance-2.0",
  "bytedance/seedance-2.5",
  "bytedance/seedance-1.5-pro",
]);
const DEFAULT_I2V_MODEL = "bytedance/seedance-2.0-fast";

export type ChatMode = "chat" | "image" | "video" | "music";

export interface ChatModel {
  id: string;
  label: string;
  free?: boolean;
  group?: string;
}

// Mirrors Franklin's curated /model picker (src/ui/model-picker.ts in the
// Franklin repo) and the live BlockRun catalog on both chains (blockrun.ai and
// sol.blockrun.ai carry the same ids). Refreshed 2026-08-31 against
// GET /api/v1/models after the gateway's free-tier rebuild (base #448 /
// sol #231) and paid-catalog refresh (base #449 / sol #230).
export const CHAT_MODELS: ChatModel[] = [
  // Auto (smart routing) is hidden for now — kept in resolveAuto for later.
  // Free (no USDC needed). NVIDIA killed the old free lineup (DeepSeek V4
  // Flash, Qwen3 Coder 480B, Llama 4 Maverick all 410'd), so these are the
  // rebuilt ones — each probe-verified on /v1/messages, and each serves
  // ITSELF rather than falling back (Nemotron 3 Ultra 550B, Cohere North
  // Mini Code and Poolside Laguna XS are free in the catalog but currently
  // answer through nemotron-3-nano-30b, so they are not listed). Nano 30B
  // leads: 0.7s to first response, the fastest free model in the catalog.
  { id: "nvidia/nemotron-3-nano-30b", label: "Nemotron 3 Nano 30B", free: true, group: "Free" },
  { id: "nvidia/nemotron-3.5-lightning", label: "Nemotron 3.5 Lightning", free: true, group: "Free" },
  { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning", label: "Nemotron 3 Nano Omni", free: true, group: "Free" },
  { id: "nvidia/llama-3.2-11b-vision", label: "Llama 3.2 11B Vision", free: true, group: "Free" },
  // Premium frontier
  { id: "anthropic/claude-opus-5", label: "Claude Opus 5", group: "Premium frontier" },
  { id: "anthropic/claude-sonnet-5", label: "Claude Sonnet 5", group: "Premium frontier" },
  { id: "openai/gpt-5.6-sol", label: "GPT-5.6 Sol", group: "Premium frontier" },
  { id: "google/gemini-3.1-pro", label: "Gemini 3.1 Pro", group: "Premium frontier" },
  { id: "xai/grok-4.5", label: "Grok 4.5", group: "Premium frontier" },
  { id: "moonshot/kimi-k3", label: "Kimi K3", group: "Premium frontier" },
  // Reasoning
  { id: "openai/o3", label: "o3", group: "Reasoning" },
  { id: "openai/gpt-5.3-codex", label: "GPT-5.3 Codex", group: "Reasoning" },
  { id: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro", group: "Reasoning" },
  { id: "qwen/qwen3.7-max", label: "Qwen3.7 Max", group: "Reasoning" },
  { id: "zai/glm-5.3", label: "GLM-5.3", group: "Reasoning" },
  { id: "google/gemini-3.6-flash", label: "Gemini 3.6 Flash", group: "Reasoning" },
  // Budget
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5", group: "Budget" },
  { id: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna", group: "Budget" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", group: "Budget" },
  { id: "deepseek/deepseek-chat", label: "DeepSeek V4 Flash Chat", group: "Budget" },
  { id: "qwen/qwen3.8-flash", label: "Qwen3.8 Flash", group: "Budget" },
  { id: "xiaomi/mimo-v2.5", label: "MiMo V2.5", group: "Budget" },
];

// Image-model aspect-ratio whitelist — mirrors each model's `sizes` in
// `blockrun/src/lib/models.ts`. Gateway rejects sizes outside this list with
// 400, so the UI builds its "比例" picker from this map. Single-ratio models
// (Nano Banana, Grok Imagine) skip the picker. Defaults are always the
// smallest size in each ratio bucket (cheapest), and the first entry is the
// default selection for that model.
export const IMAGE_MODEL_SIZES: Record<string, { ratio: string; size: string }[]> = {
  "openai/gpt-image-1": [
    { ratio: "1:1", size: "1024x1024" },
    { ratio: "3:2", size: "1536x1024" },
    { ratio: "2:3", size: "1024x1536" },
  ],
  "openai/gpt-image-2": [
    { ratio: "1:1", size: "1024x1024" },
    { ratio: "3:2", size: "1536x1024" },
    { ratio: "2:3", size: "1024x1536" },
  ],
  "bytedance/seedream-5-pro": [
    { ratio: "1:1", size: "1024x1024" },
    { ratio: "16:9", size: "1280x720" },
    { ratio: "9:16", size: "1600x2848" },
    { ratio: "4:3", size: "2304x1728" },
    { ratio: "3:4", size: "1728x2304" },
    { ratio: "2:1", size: "2048x1024" },
  ],
  "google/nano-banana": [{ ratio: "1:1", size: "1024x1024" }],
  "google/nano-banana-2": [{ ratio: "1:1", size: "1024x1024" }],
  "google/nano-banana-pro": [{ ratio: "1:1", size: "1024x1024" }],
  "xai/grok-imagine-image": [{ ratio: "1:1", size: "1024x1024" }],
};
function defaultSizeFor(modelId: string): string {
  return IMAGE_MODEL_SIZES[modelId]?.[0]?.size ?? "1024x1024";
}

// Typical image models (all paid — image generation always needs a wallet).
// GPT Image 2 leads: it takes a mask as well as a reference, so it is the one
// the composer falls back to for edits. Seedream 5.0 Pro is the widest ratio
// range in the catalog (1:1 through 9:16 up to 4K-class).
export const IMAGE_MODELS: ChatModel[] = [
  { id: "openai/gpt-image-2", label: "GPT Image 2" },
  { id: "bytedance/seedream-5-pro", label: "Seedream 5.0 Pro" },
  { id: "google/nano-banana-pro", label: "Nano Banana Pro" },
  { id: "google/nano-banana-2", label: "Nano Banana 2" },
  { id: "google/nano-banana", label: "Nano Banana" },
  { id: "xai/grok-imagine-image", label: "Grok Imagine" },
];

// Typical video models (all paid; generation is async — submit then poll).
export const VIDEO_MODELS: ChatModel[] = [
  { id: "bytedance/seedance-2.0-fast", label: "Seedance 2.0 Fast" },
  { id: "bytedance/seedance-2.0", label: "Seedance 2.0 Pro" },
  { id: "bytedance/seedance-2.5", label: "Seedance 2.5" },
  { id: "xai/grok-imagine-video", label: "Grok Imagine Video" },
  { id: "azure/sora-2", label: "Sora 2" },
];

// Video-model aspect-ratio whitelist. Only token360-backed Seedance models
// accept the `aspect_ratio` param (gateway: `videos/generations` route); for
// xAI Grok Imagine Video and Azure Sora 2 the param is silently ignored, so
// the UI hides the picker for them. Gateway accepts 16:9, 9:16, 1:1, 4:3,
// 3:4, 21:9, 9:21, "adaptive" — we expose the five common ones (skipping
// 21:9 / 9:21 cinematic and "adaptive" auto-mode) to keep the menu tight.
export const VIDEO_MODEL_RATIOS: Record<string, string[]> = {
  "bytedance/seedance-2.0-fast": ["16:9", "9:16", "1:1", "4:3", "3:4"],
  "bytedance/seedance-2.0": ["16:9", "9:16", "1:1", "4:3", "3:4"],
  "bytedance/seedance-2.5": ["16:9", "9:16", "1:1", "4:3", "3:4"],
  "bytedance/seedance-1.5-pro": ["16:9", "9:16", "1:1", "4:3", "3:4"],
};
function defaultVideoRatioFor(modelId: string): string {
  return VIDEO_MODEL_RATIOS[modelId]?.[0] ?? "16:9";
}

// Video-model resolution whitelist — same token360-only constraint as
// aspect_ratio (xAI / Sora ignore the param). Gateway accepts 360p / 480p
// / 540p / 720p / 1080p / 1K / 2K / 4K, but pricing scales with tokens
// (1080p ≈ 2.25x 720p), so we expose the three common steps and default
// to 720p — matches gateway default for Seedance and what users see from
// BytePlus/JiMeng directly.
export const VIDEO_MODEL_RESOLUTIONS: Record<string, string[]> = {
  "bytedance/seedance-2.0-fast": ["480p", "720p", "1080p"],
  "bytedance/seedance-2.0": ["480p", "720p", "1080p"],
  // Seedance 2.5 is the long-form (up to 30s) 720p tier with synced audio —
  // 1080p and 4K live on 2.0 Pro — so the single entry hides the picker.
  "bytedance/seedance-2.5": ["720p"],
  "bytedance/seedance-1.5-pro": ["480p", "720p", "1080p"],
};
function defaultVideoResolutionFor(modelId: string): string {
  return VIDEO_MODEL_RESOLUTIONS[modelId]?.includes("720p") ? "720p" : VIDEO_MODEL_RESOLUTIONS[modelId]?.[0] ?? "720p";
}

// Music models — only MiniMax Music 2.5+ is wired up at the gateway today.
// /v1/audio/generations may return 202 (poll) for long renders; the music
// branch in runMedia handles both 200 and 202 the same way as image/video.
export const MUSIC_MODELS: ChatModel[] = [
  { id: "minimax/music-2.5+", label: "MiniMax Music 2.5+" },
];

// A compact record of the tool run behind an answer — kept on the message so
// it collapses into a "searched N keywords · M sources" summary after the run.
export interface ChatActivity {
  queries: string[]; // search / prediction queries the agent issued
  sources: { title: string; url: string }[]; // web pages it referenced
  tools: string[]; // friendly labels of every tool used (for the non-search case)
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  kind?: "text" | "image" | "video" | "music";
  /** Single image, kept for back-compat with legacy single-attachment
   *  messages already persisted in GCS and for assistant-generated single
   *  image outputs. New multi-attachment user turns use `images` instead. */
  image?: string;
  /** Multi-image user attachments (canvas fusion / chat vision). When
   *  present and non-empty, `image` is ignored on render. */
  images?: string[];
  video?: string;
  music?: string;
  reasoning?: string;
  activity?: ChatActivity;
}

/** Read a user message's attached images, normalized to a flat array — covers
 *  the legacy single-`image` shape and the new `images[]` shape so callers
 *  don't have to branch. Returns [] when the message has no attachments. */
function userImages(m: ChatMessage): string[] {
  if (m.images && m.images.length > 0) return m.images;
  if (m.image) return [m.image];
  return [];
}

// Vision-capable chat models (mirrors Franklin's src/router/vision.ts). Used to
// auto-swap to a vision model when the user attaches an image to a text-only one.
const VISION_MODELS = new Set<string>([
  "anthropic/claude-opus-5",
  "anthropic/claude-sonnet-5",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-5.6-sol",
  "openai/gpt-5.6-luna",
  "google/gemini-3.1-pro",
  "google/gemini-3.6-flash",
  "google/gemini-2.5-flash",
  "xai/grok-4.5",
  "moonshot/kimi-k3",
  "qwen/qwen3.8-flash",
  "xiaomi/mimo-v2.5",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
  "nvidia/llama-3.2-11b-vision",
]);

function isVisionModel(id: string): boolean {
  return VISION_MODELS.has(id);
}

// Lightweight client-side "Auto" router (the gateway's chat endpoint doesn't
// accept the blockrun/auto alias — Franklin routes client-side too). Sends
// simple prompts to a fast model and complex ones to a frontier model.
const AUTO_SIMPLE = "google/gemini-2.5-flash";
const AUTO_COMPLEX = "anthropic/claude-opus-5";
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
  return "anthropic/claude-sonnet-5";
}

// ─── Agent tools (function calling) ────────────────────────────────────────
// Franklin decides when to use these from the conversation; they are NOT
// surfaced as UI buttons. Each maps to a paid BlockRun endpoint (x402).
// Anthropic `/v1/messages` tool shape: `{ name, description, input_schema }`
// (NOT the OpenAI `{ type: "function", function: { parameters } }` wrapper).
const TOOL_SCHEMAS = [
  {
    name: "web_search",
    description:
      "Search the live web for current information — recent events, news, prices, facts you may not know. Returns cited results.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: "The search query" } },
      required: ["query"],
    },
  },
  {
    name: "make_phone_call",
    description:
      "Place an AI voice phone call to a real number and hold a conversation to accomplish a task (e.g. book a table, ask a question). Use only when the user explicitly wants a phone call made. Costs ~$0.54.",
    input_schema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient phone number in E.164 format, e.g. +14155552671" },
        task: { type: "string", description: "What the AI should say / accomplish on the call (min 10 chars)" },
      },
      required: ["to", "task"],
    },
  },
  {
    name: "generate_music",
    description:
      "Generate a piece of music or a song from a text description (and optional lyrics). Returns a playable audio URL. Use when the user asks to create music or a song.",
    input_schema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Description of the music (genre, mood, instruments)" },
        lyrics: { type: "string", description: "Optional lyrics to sing" },
        duration_seconds: { type: "number", description: "Length in seconds (5–240), default 30" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "get_market_price",
    description:
      "Get the current price of a crypto coin, US stock, or FX pair. Use for any 'what's the price of X' question. Cheap ($0.001).",
    input_schema: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "Ticker/symbol, e.g. BTC, AAPL, EUR/USD" },
        market: { type: "string", enum: ["crypto", "usstock", "fx"], description: "Which market the symbol belongs to" },
      },
      required: ["symbol", "market"],
    },
  },
  {
    name: "search_prediction_markets",
    description:
      "Search prediction markets (Polymarket, Kalshi, Limitless, etc.) for live odds on an event or topic. Use for questions about prediction-market odds or what the market thinks. " +
      'Search is strict keyword AND-matching over market titles — query with 1-3 entity keywords (e.g. "World Cup", "Fed rate cut"), never full sentences or qualifiers like "final", "odds", "vs".',
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: '1-3 entity keywords naming the event or topic, e.g. "World Cup" or "Fed rate cut"' } },
      required: ["query"],
    },
  },
] as const;

// Meta-capability mirroring the Franklin CLI's ActivateTool: real tools are
// hidden by default and the model must opt in via activate_tool before it can
// call them. Keeps the inventory tiny (weaker models stop hallucinating tools)
// and gives a visible "activating X" step before any tool runs.
const ACTIVATE_TOOL_NAME = "activate_tool";
const ACTIVATE_SCHEMA = {
  name: ACTIVATE_TOOL_NAME,
  description:
    "Activate the capabilities you need before using them. Tools are hidden by default to keep your inventory small. " +
    'Call with no arguments to list what is available, or { "names": ["web_search", ...] } to enable specific tools — ' +
    "they become callable on the next turn. Activate only what the task needs. Available: " +
    "web_search, search_prediction_markets, get_market_price, generate_music, make_phone_call.",
  input_schema: {
    type: "object",
    properties: {
      names: { type: "array", items: { type: "string" }, description: "Tool names to activate. Omit to list what's available." },
    },
  },
} as const;
const ALL_TOOL_NAMES: readonly string[] = TOOL_SCHEMAS.map((s) => s.name);
const TOOL_ACTIVATION_NOTE =
  "\n\nIMPORTANT: Your tools are hidden by default. To use any capability (web search, prediction markets, prices, music, phone), " +
  "first call activate_tool with the names you need, then call the tool on the following turn.";

// The web client intentionally starts with a tiny tool inventory, but an
// explicit prediction-market request is not ambiguous: routing it through a
// general web search loses the live, structured Predexon result and encourages
// the model to answer from search snippets. The CLI exposes this capability
// directly, so mirror that behaviour here for clear Polymarket/odds requests.
// The focused-tool buttons still take precedence over this automatic routing.
//
// A match here forces a PAID tool call the model cannot decline, so the
// patterns must be near-zero false positive: venue names (except "limitless",
// a common adjective, which needs market context) and unambiguous
// prediction-market phrases only. Bare "odds"/胜率/盘口 fire on everyday
// language ("odds and ends", game win rates, order-book slang) and are
// deliberately excluded; ambiguous CJK betting terms require betting context.
function impliedToolForPrompt(prompt: string): string | undefined {
  const text = prompt.toLowerCase();
  if (
    /\b(polymarket|kalshi|predict\.fun|limitless\.exchange|limitless (?:exchange|markets?))\b/.test(text) ||
    /\b(prediction markets?|betting odds|market odds|implied probabilit(?:y|ies))\b/.test(text) ||
    /预测市场/.test(prompt) ||
    (/赔率|盘口|胜率/.test(prompt) && /预测|押注|下注|博彩/.test(prompt))
  ) {
    return "search_prediction_markets";
  }
  return undefined;
}

// Predexon /markets/search is strict keyword AND-matching over market titles,
// so a verbose model-composed query ("World Cup final Spain vs Argentina")
// matches nothing while a broader one ("World Cup") has many live markets.
// These helpers back a single automatic retry with the query stripped down to
// its strongest entity keywords. Qualifier/filler words the model tends to
// add that break AND-matching:
const PM_QUERY_FILLER = new Set([
  "a", "an", "the", "this", "that", "these", "those", "next", "last",
  "final", "finals", "game", "games", "match", "matches", "event", "events",
  "odds", "probability", "chance", "chances", "hottest", "top", "best",
  "vs", "versus", "against", "winner", "winners", "win", "wins", "winning",
  "right", "now", "current", "currently", "latest", "live", "today", "upcoming",
  "bet", "bets", "betting", "wager", "market", "markets", "prediction", "predictions",
  "on", "for", "of", "in", "at", "to", "will", "who", "what", "when", "is", "are",
]);

// Strip filler words and keep the first 1-3 remaining entity keywords.
// Returns "" when nothing survives (query was all filler — no retry).
function broadenPmQuery(query: string): string {
  return query
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w]+|[^\w]+$/g, ""))
    .filter((w) => w && !PM_QUERY_FILLER.has(w.toLowerCase()))
    .slice(0, 3)
    .join(" ");
}

// Count hits in a Predexon search response without pinning its exact shape:
// the market list is either the top-level array or under a common container
// key. Unrecognized non-empty shapes return undefined ("has content") so we
// never double-pay a retry on a response we can't read.
function pmResultCount(j: unknown): number | undefined {
  if (Array.isArray(j)) return j.length;
  if (j && typeof j === "object") {
    for (const key of ["data", "markets", "results", "items"]) {
      const v = (j as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v.length;
    }
    if (Object.keys(j).length === 0) return 0;
  }
  return undefined;
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

// A single visible line in the agent's activity log (CLI-style): which model is
// thinking, which tool is running, and any wallet signature in between.
export interface ToolStep {
  id: number;
  label: string;
  state: "run" | "sign" | "done";
}

// A detached, per-conversation media (image/video) generation job. Heavy media
// runs in the background bound to its conversation so switching conversations
// never locks the others (mirrors how ChatGPT/Gemini/Midjourney treat slow
// image/video as async jobs tied to the thread, not a global busy lock).
export interface MediaJob {
  kind: "image" | "video" | "music";
  phase: "signing" | "generating";
}

// Human labels for the agent tools, with the provider behind each (mirrors the
// marketplace), so the activity log reads like the CLI rather than raw names.
const TOOL_LABELS: Record<string, string> = {
  web_search: "Searching the web · Exa",
  search_prediction_markets: "Checking prediction markets · Predexon",
  get_market_price: "Fetching live price",
  generate_music: "Composing music",
  make_phone_call: "Placing phone call",
};
function toolLabel(name: string): string {
  return TOOL_LABELS[name] ?? name;
}
function modelLabel(id: string): string {
  return CHAT_MODELS.find((m) => m.id === id)?.label ?? (id.includes("/") ? id.split("/")[1] : id);
}

type Setter = ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]);

// Controlled messages — the conversation lives in useChatHistory so it can be
// persisted and switched. This hook drives sending/generating against them.
export function useFranklinChat(
  messages: ChatMessage[],
  setMessagesRaw: (m: Setter, targetId?: string) => void,
  ensureConvId: () => string,
  onSpend?: (model: string, usd: number) => void,
  prefill?: { mode?: ChatMode; imageModel?: string; videoModel?: string },
) {
  // Paid features gate on `canPay` rather than "a wallet is attached" — the
  // two are the same today (both chains can settle) but the distinction is what
  // keeps a future read-only or unpayable chain from reaching the signer.
  // `chain` rides along on every paid request so the proxy picks the gateway
  // that issues a requirement this wallet can actually sign (see use-wallet).
  const { canPay, chain } = useWallet();
  const { makePayment } = useX402Payment();
  const onSpendRef = useRef(onSpend);
  // A generation is pinned to the conversation it started in: all writes target
  // this id, so switching conversations mid-generation doesn't leak the result
  // (or the "generating" UI) into another chat.
  const pendingConvIdRef = useRef<string | null>(null);
  const [genConvId, setGenConvId] = useState<string | null>(null);
  const setMessages = useCallback(
    (m: Setter) => setMessagesRaw(m, pendingConvIdRef.current ?? undefined),
    [setMessagesRaw],
  );
  useEffect(() => {
    onSpendRef.current = onSpend;
  }, [onSpend]);
  // Model attributed to the next payment (set by each run* before it pays).
  const modelRef = useRef("");

  const [mode, setMode] = useState<ChatMode>(prefill?.mode ?? "chat");
  const [chatModel, setChatModel] = useState(CHAT_MODELS[0].id);
  const [imageModel, setImageModelState] = useState(prefill?.imageModel ?? IMAGE_MODELS[0].id);
  const [imageSize, setImageSize] = useState<string>(defaultSizeFor(prefill?.imageModel ?? IMAGE_MODELS[0].id));
  // Reset the aspect ratio whenever the image model changes — the old size
  // may not be in the new model's whitelist (gateway would 400). Picking the
  // model's first ratio keeps the selection always valid.
  const setImageModel = useCallback((id: string) => {
    setImageModelState(id);
    setImageSize(defaultSizeFor(id));
  }, []);
  const [videoModel, setVideoModelState] = useState(prefill?.videoModel ?? VIDEO_MODELS[0].id);
  const [videoRatio, setVideoRatio] = useState<string>(defaultVideoRatioFor(prefill?.videoModel ?? VIDEO_MODELS[0].id));
  const [videoResolution, setVideoResolution] = useState<string>(defaultVideoResolutionFor(prefill?.videoModel ?? VIDEO_MODELS[0].id));
  // Reset video ratio + resolution whenever the model changes — Seedance
  // models accept `aspect_ratio` and `resolution`; others don't have a list,
  // so both pickers hide.
  const setVideoModel = useCallback((id: string) => {
    setVideoModelState(id);
    setVideoRatio(defaultVideoRatioFor(id));
    setVideoResolution(defaultVideoResolutionFor(id));
  }, []);
  const [musicModel, setMusicModel] = useState(MUSIC_MODELS[0].id);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [steps, setSteps] = useState<ToolStep[]>([]);
  const stepSeq = useRef(0);
  // Set when the model wants a paid tool but no wallet is connected — drives a
  // "connect your wallet to use paid tools" prompt in the UI.
  const [needsToolWallet, setNeedsToolWallet] = useState(false);
  // Per-conversation media jobs (image/video) running detached in the background.
  const [mediaJobs, setMediaJobs] = useState<Record<string, MediaJob>>({});
  const mediaAbortRef = useRef<Record<string, AbortController>>({});
  // Freshest connection state for async flows (send's closure can be stale).
  const canPayRef = useRef(canPay);
  useEffect(() => {
    canPayRef.current = canPay;
  }, [canPay]);
  // Same reason: a generation can outlive the render that started it, and the
  // gateway a retry goes to must match the wallet signing for it.
  const chainRef = useRef(chain);
  useEffect(() => {
    chainRef.current = chain;
  }, [chain]);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // Always read the freshest messages inside async flows.
  const msgRef = useRef(messages);
  useEffect(() => {
    msgRef.current = messages;
  }, [messages]);

  const model =
    mode === "image" ? imageModel : mode === "video" ? videoModel : mode === "music" ? musicModel : chatModel;
  const setModel =
    mode === "image" ? setImageModel : mode === "video" ? setVideoModel : mode === "music" ? setMusicModel : setChatModel;
  const models =
    mode === "image" ? IMAGE_MODELS : mode === "video" ? VIDEO_MODELS : mode === "music" ? MUSIC_MODELS : CHAT_MODELS;
  const selectedModel = models.find((m) => m.id === model);

  const signal = () => abortRef.current?.signal;

  // Activity-log helpers — every model/tool/signature step shows as a line so
  // the web flow is as legible as the CLI (and signing never stands alone).
  const pushStep = useCallback((label: string, state: ToolStep["state"] = "run") => {
    const id = ++stepSeq.current;
    setSteps((s) => [...s, { id, label, state }]);
    return id;
  }, []);
  const updateStep = useCallback((id: number, patch: Partial<ToolStep>) => {
    setSteps((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  // Pay-aware fetch: probe → 402 → sign → retry with X-Payment. Supports GET
  // (no body) for the read-only data tools (markets, prices, prediction).
  // `extraHeaders` lets callers attach endpoint-specific headers — chat hits
  // `/v1/messages` and needs `anthropic-version`, for example.
  const paidFetch = useCallback(
    async (
      url: string,
      body?: string,
      method: "POST" | "GET" = "POST",
      extraHeaders?: Record<string, string>,
    ): Promise<Response> => {
      const sig = () => abortRef.current?.signal;
      // The chain header must be on the *probe* too, not just the paid retry:
      // it is what decides which gateway answers, and therefore whether the 402
      // we get back is one this wallet can sign at all.
      const init = (extra?: Record<string, string>): RequestInit =>
        method === "GET"
          ? { method, headers: { ...chainHeaders(chainRef.current), ...extraHeaders, ...extra }, signal: sig() }
          : {
              method,
              headers: {
                "Content-Type": "application/json",
                ...chainHeaders(chainRef.current),
                ...extraHeaders,
                ...extra,
              },
              body,
              signal: sig(),
            };
      let res = await fetch(url, init());
      if (res.status === 402) {
        const reqs = parseX402FromResponse(res);
        if (!reqs) throw new Error("Could not read payment requirements from the server.");
        setStatus("signing");
        // Price the offer we will actually sign, not accepts[0] — the same
        // selection makePayment() performs, so the label can never quote one
        // requirement while the wallet signs another.
        const offer = selectRequirement(reqs.accepts ?? [], chainRef.current);
        const usd = Number(offer?.amount || 0) / 1_000_000;
        const usdStr = usd ? (usd < 0.01 ? usd.toFixed(4) : usd.toFixed(2)) : null;
        // Show the signature as its own step alongside the running tool, so the
        // user sees *what* they're paying for, not just a bare "sign" prompt.
        const signId = pushStep(usdStr ? `Awaiting wallet signature · $${usdStr}` : "Awaiting wallet signature", "sign");
        const { payload, error: signErr } = await makePayment(reqs);
        if (!payload) {
          updateStep(signId, { state: "done", label: "Signature cancelled" });
          throw new Error(signErr || "Wallet signature failed.");
        }
        // Signature done — leave "signing" so the tool/working status can show
        // again during the actual request (and the next sign re-sets it).
        setStatus("thinking");
        res = await fetch(url, init({ "X-Payment": payload }));
        // Record the spend only on the *settling* response. The async media
        // submit returns 202 (payment verified, not yet settled) — the poll
        // settles and records instead, so recording here too would double-count.
        if (res.status === 202) {
          updateStep(signId, { state: "done", label: "Submitted" });
        } else {
          updateStep(signId, { state: "done", label: usdStr ? `Paid $${usdStr}` : "Paid" });
          if (usd) onSpendRef.current?.(modelRef.current, usd);
        }
      }
      return res;
    },
    [makePayment, pushStep, updateStep],
  );

  // Abort the in-flight generation and force-clear busy state. Resetting the
  // flags directly (not just aborting the fetch) recovers even when a wallet
  // signature is hung — abort can't cancel a pending wallet popup.
  const stop = useCallback(() => {
    abortRef.current?.abort();
    inFlight.current = false;
    setStatus("idle");
    setActiveTool(null);
    setSteps([]);
    pendingConvIdRef.current = null;
    setGenConvId(null);
  }, []);

  // Cancel a conversation's background media job (image/video).
  const stopMedia = useCallback((convId: string) => {
    mediaAbortRef.current[convId]?.abort();
    delete mediaAbortRef.current[convId];
    setMediaJobs((p) => {
      const n = { ...p };
      delete n[convId];
      return n;
    });
  }, []);

  const send = useCallback(
    async (
      text: string,
      attachments?: string | string[],
      modeOverride?: ChatMode,
      modelOverride?: string,
      forceTool?: string,
    ) => {
      const prompt = text.trim();
      // Normalize the single-string back-compat shape to an array — callers
      // that were passing one image still work; the new multi-pick composer
      // passes an array directly.
      const atts: string[] = Array.isArray(attachments)
        ? attachments
        : attachments
          ? [attachments]
          : [];
      if (!prompt && atts.length === 0) return;
      const activeMode0 = modeOverride ?? mode;
      // Heavy media → detached, per-conversation background job. It doesn't take
      // the global chat lock, so other conversations stay usable while it runs.
      if (activeMode0 === "image" || activeMode0 === "video" || activeMode0 === "music") {
        const mediaConvId = ensureConvId();
        if (mediaAbortRef.current[mediaConvId]) return; // already generating here
        void runMedia(mediaConvId, activeMode0, prompt, atts, modelOverride);
        return;
      }
      if (inFlight.current) return;
      inFlight.current = true;
      // Pin this run to the active conversation before any write.
      const convId = ensureConvId();
      pendingConvIdRef.current = convId;
      setGenConvId(convId);
      setError(null);
      setSteps([]);
      setNeedsToolWallet(false);
      abortRef.current = new AbortController();
      // If a model is forced (e.g. a tool-capable model for a demo case), keep
      // the picker in sync for subsequent turns too.
      if (modelOverride && modelOverride !== chatModel) setChatModel(modelOverride);

      const userMsg: ChatMessage = {
        role: "user",
        content: prompt,
        kind: "text",
        // Persist using the multi-shape when >1, single-shape for 1, so
        // legacy single-image renderers and persisted conversations keep
        // working without a migration.
        ...(atts.length > 1 ? { images: atts } : atts.length === 1 ? { image: atts[0] } : {}),
      };
      const history = [...msgRef.current, userMsg];
      setMessages(history);

      try {
        await runChat(history, modelOverride, forceTool);
      } catch (err) {
        const aborted =
          abortRef.current?.signal.aborted || (err instanceof Error && err.name === "AbortError");
        if (aborted) {
          // User stopped it — keep any partial output, no error shown.
          setStatus("idle");
        } else {
          // Roll back the orphan user message if the turn never produced an
          // assistant reply (e.g. wallet signature rejected). Otherwise it
          // persists into the conversation list, titles the new chat with the
          // user's prompt, and leaks into other windows on next hydrate.
          setMessages((m) => {
            const last = m[m.length - 1];
            return last && last.role === "user" ? m.slice(0, -1) : m;
          });
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setStatus("error");
        }
        // Clear residual activity log — without this, "<model> · thinking"
        // keeps spinning after the error toast is shown.
        setSteps([]);
        setActiveTool(null);
      } finally {
        inFlight.current = false;
        abortRef.current = null;
        pendingConvIdRef.current = null;
        setGenConvId(null);
      }
    },
    // imageSize / videoRatio / videoResolution MUST be in deps — runMedia
    // closes over them, so a stale send() would always send the initial
    // values regardless of what the user picked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, chatModel, imageModel, videoModel, musicModel, imageSize, videoRatio, videoResolution, paidFetch, setMessages, setChatModel, ensureConvId],
  );

  // Regenerate the last answer: drop trailing assistant message(s), then resend
  // the preceding user turn in the matching mode. Updating msgRef synchronously
  // avoids a race with send (which reads msgRef.current).
  const regenerate = useCallback(() => {
    if (inFlight.current) return;
    const msgs = msgRef.current;
    let i = msgs.length - 1;
    let lastKind: ChatMessage["kind"] = "text";
    while (i >= 0 && msgs[i].role === "assistant") {
      lastKind = msgs[i].kind || "text";
      i--;
    }
    if (i < 0 || msgs[i].role !== "user") return;
    const userMsg = msgs[i];
    const base = msgs.slice(0, i);
    msgRef.current = base;
    setMessages(base);
    const m: ChatMode =
      lastKind === "image" ? "image" : lastKind === "video" ? "video" : lastKind === "music" ? "music" : "chat";
    void send(userMsg.content, userImages(userMsg), m);
  }, [send, setMessages]);

  // Paid request → parsed JSON (handles 402→sign→retry). POST by default; GET
  // for read-only data tools. `extraHeaders` forwards endpoint-specific
  // metadata (e.g. `anthropic-version` for `/v1/messages`).
  async function paidJson(
    url: string,
    payload?: unknown,
    method: "POST" | "GET" = "POST",
    extraHeaders?: Record<string, string>,
  ): Promise<Record<string, unknown>> {
    const res = await paidFetch(url, method === "GET" ? undefined : JSON.stringify(payload), method, extraHeaders);
    if (!res.ok) throw new Error(await errMsg(res));
    return res.json();
  }

  // Execute one tool call → returns a string result fed back to the model.
  async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
    setActiveTool(name);
    try {
      if (name === "web_search") {
        modelRef.current = "web_search";
        const j = await paidJson("/api/blockrun/v1/search", { query: String(args.query ?? "") });
        return JSON.stringify(j).slice(0, 4000);
      }
      if (name === "make_phone_call") {
        modelRef.current = "make_phone_call";
        const to = String(args.to ?? "");
        const task = String(args.task ?? "");
        // Human-in-the-loop gate: make_phone_call places a real call (~$0.54)
        // to an arbitrary number with LLM-chosen args. Tool arguments can be
        // steered by untrusted content (web_search results, pasted text), so a
        // generic wallet popup is not enough — require an explicit confirm that
        // names the number, task, and cost before the model can spend.
        const ok =
          typeof window === "undefined" ||
          window.confirm(`Franklin wants to place a phone call (~$0.54):\n\nTo: ${to}\nTask: ${task}\n\nAllow this call?`);
        if (!ok) return "User declined the phone call. Do not retry it.";
        const submit = await paidJson("/api/blockrun/v1/voice/call", {
          to,
          task,
          max_duration: 5,
        });
        const callId = submit.call_id || submit.callId || submit.id;
        if (!callId) return JSON.stringify(submit).slice(0, 2000);
        // Poll the call up to ~3 min for a transcript; otherwise report in-progress.
        const start = Date.now();
        while (Date.now() - start < 180_000) {
          if (signal()?.aborted) break;
          await new Promise((r) => setTimeout(r, 6000));
          // Unpaid status poll, but still gateway-bound: the call was placed on
          // one host and only that host knows the id.
          const s = await fetch(`/api/blockrun/v1/voice/call/${callId}`, {
            headers: chainHeaders(chainRef.current),
            signal: abortRef.current?.signal,
          });
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
        const url =
          res.status === 202
            ? await pollMedia(res, 300_000, "music")
            : extractMediaUrl(await res.json(), "music");
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
        const query = String(args.query ?? "");
        const search = (q: string) =>
          paidJson(`/api/blockrun/v1/pm/markets/search?q=${encodeURIComponent(q)}&limit=10`, undefined, "GET");
        const j = await search(query);
        // Strict AND-matching means over-specific queries return 0 results;
        // retry once with the query broadened to its entity keywords so the
        // model gets real markets instead of an empty list to hallucinate on.
        const broadened = broadenPmQuery(query);
        if (pmResultCount(j) === 0 && broadened && broadened.toLowerCase() !== query.toLowerCase()) {
          const retry = await search(broadened);
          if ((pmResultCount(retry) ?? 1) > 0) {
            return JSON.stringify({
              note: `No markets matched "${query}"; results below are for the broadened query "${broadened}".`,
              results: retry,
            }).slice(0, 4000);
          }
        }
        return JSON.stringify(j).slice(0, 4000);
      }
      return `Unknown tool: ${name}`;
    } catch (e) {
      return `Tool ${name} failed: ${e instanceof Error ? e.message : "error"}`;
    } finally {
      setActiveTool(null);
    }
  }

  // Tool-calling loop (non-streamed) — uses Anthropic-native `/v1/messages`
  // (mirrors Franklin CLI's src/agent/llm.ts). Tool-use / tool-result blocks
  // live only in this API-local array; the user only sees their message and
  // the final answer text.
  async function runChatWithTools(history: ChatMessage[], model: string, forceTool?: string, impliedTool?: boolean) {
    setStatus("thinking");
    type ApiMsg = Record<string, unknown>;
    // Focus mode: nudge the model to use the chosen tool (tool_choice forces it,
    // this just improves the phrasing of the answer afterwards). Implied routing
    // (regex-detected, not user-selected) must NOT claim the user chose the tool:
    // on a false-positive match the honest framing lets the model discard an
    // irrelevant result and answer the actual question.
    const focusNudge = forceTool
      ? impliedTool
        ? `\n\nThe request looks like a prediction-market question, so the ${forceTool} tool has been pre-selected for this turn. If its result is irrelevant to what the user actually asked, ignore it and answer the question directly.`
        : `\n\nThe user selected the ${toolLabel(forceTool)} capability — use the ${forceTool} tool to answer this turn, then summarize the result clearly.`
      : "";
    const systemPrompt = `${FRANKLIN_SYSTEM_PROMPT}\n\n${systemPromptDateLine(userTz())}\n\n${FRANKLIN_TOOLS_PROMPT}${TOOL_ACTIVATION_NOTE}${focusNudge}`;
    // Convert a user-attached image to an Anthropic image content block.
    // Browser attachments come in as `data:image/...;base64,...`; remote URLs
    // (e.g. a previously generated image) go through the `url` source kind.
    const toImageBlock = (image: string): ApiMsg => {
      const dataMatch = image.match(/^data:([^;]+);base64,(.+)$/);
      if (dataMatch) {
        return { type: "image", source: { type: "base64", media_type: dataMatch[1], data: dataMatch[2] } };
      }
      return { type: "image", source: { type: "url", url: image } };
    };
    const apiMessages: ApiMsg[] = history
      .filter((m) => m.kind !== "video" && m.kind !== "music" && !(m.kind === "image" && m.role === "assistant"))
      .map((m) => {
        // User message with one or more attached images → Anthropic-shape
        // content array. userImages() normalizes the legacy single-image
        // and new multi-image shapes so we render either uniformly.
        const imgs = m.role === "user" ? userImages(m) : [];
        if (imgs.length > 0) {
          return {
            role: "user",
            content: [
              ...(m.content ? [{ type: "text", text: m.content }] : []),
              ...imgs.map(toImageBlock),
            ],
          };
        }
        return { role: m.role, content: m.content };
      });

    // Accumulate a compact record of the run so it can collapse into a summary
    // ("searched N keywords · M sources") attached to the final answer.
    const activity: ChatActivity = { queries: [], sources: [], tools: [] };

    // Progressive tool disclosure (mirrors the CLI's ActivateTool): real tools
    // start hidden; the model activates what it needs and they appear next turn.
    // Focus mode pre-activates (and force-calls) the chosen tool.
    const activeTools = new Set<string>();
    if (forceTool) activeTools.add(forceTool);

    for (let i = 0; i < 5; i++) {
      // Show which model is reasoning this turn (a sign step may appear under it
      // if the model is paid).
      const thinkId = pushStep(`${modelLabel(model)} · thinking`);
      // Each turn offers activate_tool + whatever the model has activated so far.
      const turnTools = [ACTIVATE_SCHEMA, ...TOOL_SCHEMAS.filter((s) => activeTools.has(s.name))];
      // Focus mode forces the chosen tool on the first turn; afterwards the
      // model answers freely using the tool's result. Anthropic shape:
      // `{ type: "tool", name }`, not OpenAI's `{ type: "function", function }`.
      const toolChoice = forceTool && i === 0
        ? { tool_choice: { type: "tool", name: forceTool } }
        : {};
      const json = await paidJson(
        CHAT_ENDPOINT,
        {
          model,
          system: systemPrompt,
          messages: apiMessages,
          tools: turnTools,
          max_tokens: 4096,
          ...toolChoice,
        },
        "POST",
        { "anthropic-version": ANTHROPIC_VERSION },
      );
      updateStep(thinkId, { state: "done" });
      // Anthropic response: `{ content: ContentBlock[], stop_reason, ... }`.
      // Tool calls are `tool_use` blocks; the answer text lives in `text` blocks.
      const contentBlocks = (json.content as Array<Record<string, unknown>>) || [];
      const toolUses = contentBlocks.filter((b) => b.type === "tool_use") as Array<{
        id: string;
        name: string;
        input: Record<string, unknown>;
      }>;
      if (toolUses.length) {
        // Replay the assistant's full content (text + tool_use blocks) so the
        // model sees its own message verbatim on the next turn.
        apiMessages.push({ role: "assistant", content: contentBlocks });
        // Anthropic requires tool_result blocks to be batched into a single
        // user message (one per tool_use). Build them as we execute.
        const toolResultBlocks: ApiMsg[] = [];
        for (const tu of toolUses) {
          const parsed: Record<string, unknown> =
            tu.input && typeof tu.input === "object" ? tu.input : {};

          // activate_tool — free meta-step: pull tools into the active set so
          // they're callable next turn. This is the visible "activating X" step.
          if (tu.name === ACTIVATE_TOOL_NAME) {
            const raw = (parsed as { names?: unknown }).names;
            const names = Array.isArray(raw) ? raw.filter((n): n is string => typeof n === "string") : [];
            let result: string;
            if (names.length === 0) {
              const inactive = TOOL_SCHEMAS.filter((s) => !activeTools.has(s.name));
              const stepId = pushStep("Selecting tools");
              result = inactive.length
                ? "Available tools:\n" + inactive.map((s) => `- ${s.name}: ${s.description}`).join("\n")
                : "All tools are already active.";
              updateStep(stepId, { state: "done" });
            } else {
              const added = names.filter((n) => ALL_TOOL_NAMES.includes(n) && !activeTools.has(n));
              const stepId = pushStep(added.length ? `Activating · ${added.map(toolLabel).join(", ")}` : "Selecting tools");
              added.forEach((n) => activeTools.add(n));
              result = added.length
                ? `Activated: ${added.join(", ")}. They are now callable.`
                : "No new tools activated (unknown or already active).";
              updateStep(stepId, { state: "done" });
            }
            toolResultBlocks.push({ type: "tool_result", tool_use_id: tu.id, content: result });
            continue;
          }

          // A real (paid) tool. If there's no wallet, stop and prompt rather
          // than failing on the signature step.
          if (!canPayRef.current) {
            setSteps([]);
            setNeedsToolWallet(true);
            setStatus("idle");
            return;
          }
          // Each tool call is its own visible step (with any signature nested).
          const toolStepId = pushStep(toolLabel(tu.name));
          const result = await executeTool(tu.name, parsed);
          updateStep(toolStepId, { state: "done" });
          // Record the run for the collapsed summary.
          activity.tools.push(toolLabel(tu.name));
          const q = typeof parsed.query === "string" ? parsed.query.trim() : "";
          if (q && !activity.queries.includes(q)) activity.queries.push(q);
          if (tu.name === "web_search") {
            for (const s of extractSources(result)) {
              if (!activity.sources.some((x) => x.url === s.url)) activity.sources.push(s);
            }
          }
          toolResultBlocks.push({ type: "tool_result", tool_use_id: tu.id, content: result });
        }
        apiMessages.push({ role: "user", content: toolResultBlocks });
        continue;
      }
      // No tool calls — collect text answer from `text` blocks.
      const answerText = contentBlocks
        .filter((b) => b.type === "text")
        .map((b) => (typeof b.text === "string" ? b.text : ""))
        .join("");
      const content = answerText || "(empty response)";
      const ue = upstreamErrorMessage(content);
      if (ue) throw new Error(ue);
      const { answer, thinking } = splitThinking(content);
      const hadActivity = activity.tools.length > 0;
      setMessages((m) => [...m, {
        role: "assistant",
        content: answer || content,
        kind: "text",
        reasoning: thinking || undefined,
        ...(hadActivity ? { activity } : {}),
      }]);
      setSteps([]);
      setStatus("idle");
      return;
    }
    setMessages((m) => [...m, { role: "assistant", content: "Stopped after too many tool steps.", kind: "text" }]);
    setSteps([]);
    setStatus("idle");
  }

  // Chat entry. Resolves the model (Auto → concrete, vision-swap if needed)
  // and hands off to the Anthropic-native agent tool-calling loop. Every chat
  // model — free or paid — goes through the same `/v1/messages` path; weak
  // models are absorbed at the gateway, not here.
  async function runChat(history: ChatMessage[], modelOverride?: string, forceTool?: string) {
    setStatus("thinking");
    // Resolve "Auto" client-side, then vision-route: if the turn carries an
    // image and the chosen model can't see, swap to a vision-capable sibling.
    const base = modelOverride || chatModel;
    const hasImage = history.some((m) => m.role === "user" && userImages(m).length > 0);
    const lastPrompt = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
    let effectiveModel = base === "blockrun/auto" ? resolveAuto(lastPrompt) : base;
    if (hasImage && !isVisionModel(effectiveModel)) effectiveModel = pickVisionSibling(effectiveModel);
    modelRef.current = effectiveModel;
    // Implied routing only runs with a connected wallet: forcing a paid tool on
    // a wallet-less visitor would replace their answer with a connect-wallet
    // prompt. Without a wallet the model routes normally (and can still ask).
    const implied =
      !forceTool && canPayRef.current ? impliedToolForPrompt(lastPrompt) : undefined;
    await runChatWithTools(history, effectiveModel, forceTool ?? implied, Boolean(implied));
  }

  // Detached, per-conversation media job (image/video). Adds the user message,
  // signs + submits, polls, writes the result — all pinned to `convId` and
  // tracked in `mediaJobs[convId]`, so it never touches the global chat run and
  // switching conversations leaves it (and other conversations) unaffected.
  async function runMedia(
    convId: string,
    kind: "image" | "video" | "music",
    prompt: string,
    references?: string[],
    modelOverride?: string,
  ) {
    const refs = references ?? [];
    const firstRef = refs[0]; // video seed / single-ref fallback for legacy paths
    const abort = new AbortController();
    mediaAbortRef.current[convId] = abort;
    setMediaJobs((p) => ({ ...p, [convId]: { kind, phase: "generating" } }));
    const setPhase = (phase: MediaJob["phase"]) => setMediaJobs((p) => ({ ...p, [convId]: { kind, phase } }));
    setMessagesRaw(
      (m) => [
        ...m,
        {
          role: "user",
          content: prompt,
          kind: "text",
          ...(refs.length > 1 ? { images: refs } : refs.length === 1 ? { image: refs[0] } : {}),
        },
      ],
      convId,
    );

    // Resolve model + endpoint + body (mirrors the img2img / img2video rules).
    let model: string;
    let endpoint: string;
    let body: string;
    if (kind === "image") {
      const useEdit = refs.length > 0;
      const baseModel = modelOverride ?? imageModel;
      model = useEdit && !EDIT_SUPPORTED_IMAGE_MODELS.has(baseModel) ? "openai/gpt-image-2" : baseModel;
      endpoint = useEdit ? IMAGE_EDIT_ENDPOINT : IMAGE_ENDPOINT;
      if (useEdit) {
        // Per-provider fusion cap — defensive trim. Gateway also caps but a
        // 400 round trip is wasted wallet RTT, so the client mirrors the
        // limit here too.
        const cap = maxImageFusionFor(model);
        const trimmed = refs.slice(0, Math.max(1, cap));
        // The gateway accepts either a single string or a string[] under
        // the `image` key; passing the multi shape only when we actually
        // have multiple keeps single-image requests on the same wire format
        // the route has always honored.
        body = JSON.stringify({
          model,
          prompt,
          image: trimmed.length === 1 ? trimmed[0] : trimmed,
          size: "1024x1024",
          n: 1,
        });
      } else {
        // Text-to-image uses the user's selected aspect ratio, validated
        // against the active model's whitelist.
        const validSize = IMAGE_MODEL_SIZES[model]?.some((s) => s.size === imageSize)
          ? imageSize
          : defaultSizeFor(model);
        body = JSON.stringify({ model, prompt, size: validSize, n: 1 });
      }
    } else if (kind === "video") {
      // Video models still take a single seed image — extra attachments are
      // dropped here rather than at the composer so the user can pre-stage
      // images and switch modes without losing them. First image wins.
      const useSeed = !!firstRef;
      const baseModel = modelOverride ?? videoModel;
      model = useSeed && !VIDEO_IMAGE_INPUT_MODELS.has(baseModel) ? DEFAULT_I2V_MODEL : baseModel;
      endpoint = VIDEO_ENDPOINT;
      const ratios = VIDEO_MODEL_RATIOS[model];
      const aspectRatio = ratios && ratios.includes(videoRatio) ? videoRatio : undefined;
      const resolutions = VIDEO_MODEL_RESOLUTIONS[model];
      const resolution = resolutions && resolutions.includes(videoResolution) ? videoResolution : undefined;
      body = JSON.stringify({
        model,
        prompt,
        ...(useSeed ? { image_url: firstRef } : {}),
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
        ...(resolution ? { resolution } : {}),
      });
    } else {
      // music — gateway picks the model via `model`; the rest of the params are
      // optional (duration / lyrics / instrumental). References are ignored.
      model = modelOverride ?? musicModel;
      endpoint = MUSIC_ENDPOINT;
      body = JSON.stringify({ model, prompt });
    }

    try {
      // Pin the chain for the whole job. A media generation outlives many
      // renders — submit, then poll for up to five minutes — and every one of
      // those requests has to reach the same gateway that issued the 402 the
      // user signed. Reading chainRef per request would let a mid-flight wallet
      // switch send the poll somewhere the job doesn't exist.
      const jobChain = chainRef.current;
      const chainHdr = chainHeaders(jobChain);
      let res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...chainHdr },
        body,
        signal: abort.signal,
      });
      if (res.status === 402) {
        const reqs = parseX402FromResponse(res);
        if (!reqs) throw new Error("Could not read payment requirements from the server.");
        const usd = Number(selectRequirement(reqs.accepts ?? [], jobChain)?.amount || 0) / 1_000_000;
        setPhase("signing");
        const { payload, error: signErr } = await makePayment(reqs);
        if (!payload) throw new Error(signErr || "Wallet signature failed.");
        setPhase("generating");
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...chainHdr, "X-Payment": payload },
          body,
          signal: abort.signal,
        });
        // Record only on the settling response (202 submit is verify-only — the
        // poll settles and records).
        if (usd && res.status !== 202) onSpendRef.current?.(model, usd);
      }

      let url: string | undefined;
      if (res.status === 202) {
        url = await pollMediaJob(convId, kind, res, abort.signal, model, jobChain);
      } else {
        if (!res.ok) throw new Error(await errMsg(res));
        url = extractMediaUrl(await res.json(), kind);
      }
      if (!url)
        throw new Error(
          kind === "image"
            ? "No image came back from the model."
            : kind === "video"
              ? "No video came back from the model."
              : "No audio came back from the model.",
        );
      const extra = kind === "image" ? { image: url } : kind === "video" ? { video: url } : { music: url };
      setMessagesRaw((m) => [...m, { role: "assistant", content: prompt, kind, ...extra }], convId);
    } catch (err) {
      const aborted = abort.signal.aborted || (err instanceof Error && err.name === "AbortError");
      if (!aborted) {
        const msg = err instanceof Error ? err.message : "Generation failed.";
        setMessagesRaw((m) => [...m, { role: "assistant", content: msg, kind: "text" }], convId);
      }
    } finally {
      setMediaJobs((p) => {
        const n = { ...p };
        delete n[convId];
        return n;
      });
      delete mediaAbortRef.current[convId];
    }
  }

  // Poll loop for a media job — its own signal + per-job phase, separate from
  // the global pollMedia used by the music tool.
  async function pollMediaJob(
    convId: string,
    kind: "image" | "video" | "music",
    submitRes: Response,
    signal: AbortSignal,
    model: string,
    chain: WalletChain | null,
  ): Promise<string | undefined> {
    const submit = await submitRes.json();
    const pollPath: string | undefined = submit.poll_url;
    if (!pollPath) return extractMediaUrl(submit, kind);
    // The gateway returns an absolute poll URL on its own host. Strip back to
    // the path and re-home it on our proxy — the browser can't call either
    // gateway directly (CORS, and the 402 header wouldn't survive). Which of
    // the two hosts the proxy then forwards to is carried by the chain header
    // below, not by this URL, so dropping the host here is intentional.
    const proxied = pollPath.startsWith("/api/blockrun")
      ? pollPath
      : `/api/blockrun${pollPath.replace(/^.*\/api/, "")}`;
    const chainHdr = chainHeaders(chain);
    const setPhase = (phase: MediaJob["phase"]) => setMediaJobs((p) => ({ ...p, [convId]: { kind, phase } }));

    let sig: string | null = null;
    const start = Date.now();
    // Image jobs settle quickly; video and music renders can run for minutes.
    const maxMs = kind === "image" ? 180_000 : 300_000;
    while (Date.now() - start < maxMs) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const headers: Record<string, string> = { ...chainHdr };
      if (sig) headers["X-Payment"] = sig;
      const r = await fetch(proxied, { headers, signal });
      if (r.status === 402 && !sig) {
        const reqs = parseX402FromResponse(r);
        if (!reqs) throw new Error("Poll missing payment requirements.");
        setPhase("signing");
        const { payload, error: e } = await makePayment(reqs);
        if (!payload) throw new Error(e || "Wallet signature failed.");
        const usd = Number(selectRequirement(reqs.accepts ?? [], chain)?.amount || 0) / 1_000_000;
        if (usd) onSpendRef.current?.(model, usd);
        sig = payload;
        setPhase("generating");
        continue;
      }
      if (!r.ok) throw new Error(await errMsg(r));
      const j = await r.json();
      if (j.status === "completed" || j.status === "settled" || j.data) return extractMediaUrl(j, kind);
      await new Promise((res) => setTimeout(res, 4000));
    }
    throw new Error("Generation is taking too long — try again.");
  }

  // Slow-path poll for image/video jobs. First poll typically 402 — sign once
  // and reuse that signature for every subsequent poll (server settles on done).
  async function pollMedia(
    submitRes: Response,
    maxMs: number,
    kind: "image" | "video" | "music" = "image",
  ): Promise<string | undefined> {
    const submit = await submitRes.json();
    const pollPath: string | undefined = submit.poll_url;
    if (!pollPath) return extractMediaUrl(submit, kind);
    // See pollMediaJob: the host is stripped on purpose — the chain header
    // below is what routes this back to the gateway that owns the job.
    const proxied = pollPath.startsWith("/api/blockrun")
      ? pollPath
      : `/api/blockrun${pollPath.replace(/^.*\/api/, "")}`;
    // Read once and hold it for the run, so a wallet switch mid-render can't
    // point a later poll at a gateway that never saw this job.
    const chain = chainRef.current;
    const chainHdr = chainHeaders(chain);

    let sig: string | null = null;
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (signal()?.aborted) throw new DOMException("Aborted", "AbortError");
      const headers: Record<string, string> = { ...chainHdr };
      if (sig) headers["X-Payment"] = sig;
      const r = await fetch(proxied, { headers, signal: abortRef.current?.signal });
      if (r.status === 402 && !sig) {
        const reqs = parseX402FromResponse(r);
        if (!reqs) throw new Error("Poll missing payment requirements.");
        setStatus("signing");
        const { payload, error: e } = await makePayment(reqs);
        if (!payload) throw new Error(e || "Wallet signature failed.");
        const usd = Number(selectRequirement(reqs.accepts ?? [], chain)?.amount || 0) / 1_000_000;
        if (usd) onSpendRef.current?.(modelRef.current, usd);
        sig = payload;
        setStatus("generating");
        continue;
      }
      if (!r.ok) throw new Error(await errMsg(r));
      const j = await r.json();
      const st = j.status;
      if (st === "completed" || st === "settled" || j.data) {
        return extractMediaUrl(j, kind);
      }
      await new Promise((res) => setTimeout(res, 4000));
    }
    throw new Error("Generation is taking too long — try again.");
  }

  const isBusy =
    status === "signing" || status === "thinking" || status === "generating";

  // Aspect-ratio options for the current image model — drives the "比例"
  // flyout. Empty / single-entry → UI hides the button.
  const imageSizes = IMAGE_MODEL_SIZES[imageModel] ?? [];
  // Same for video — only Seedance has an aspect-ratio list (xAI / Sora
  // ignore the param). Empty → UI hides the button. Same story for the
  // resolution picker.
  const videoRatios = VIDEO_MODEL_RATIOS[videoModel] ?? [];
  const videoResolutions = VIDEO_MODEL_RESOLUTIONS[videoModel] ?? [];

  return {
    canPay,
    mode,
    setMode,
    model,
    setModel,
    setImageModel,
    setVideoModel,
    models,
    selectedModel,
    status,
    activeTool,
    steps,
    needsToolWallet,
    genConvId,
    mediaJobs,
    error,
    isBusy,
    send,
    stop,
    stopMedia,
    regenerate,
    imageSize,
    setImageSize,
    imageSizes,
    videoRatio,
    setVideoRatio,
    videoRatios,
    videoResolution,
    setVideoResolution,
    videoResolutions,
  };
}

// Pull {title,url} pairs out of a web_search result blob (shape varies by
// provider), so the collapsed summary can list the pages Franklin referenced.
function extractSources(resultStr: string): { title: string; url: string }[] {
  let data: unknown;
  try {
    data = JSON.parse(resultStr);
  } catch {
    return [];
  }
  const out: { title: string; url: string }[] = [];
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const o = node as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url : typeof o.link === "string" ? o.link : "";
    if (/^https?:\/\//.test(url)) {
      const title =
        (typeof o.title === "string" && o.title) ||
        (typeof o.name === "string" && o.name) ||
        url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
      out.push({ title: String(title).slice(0, 140), url });
    }
    for (const v of Object.values(o)) visit(v);
  };
  visit(data);
  // De-dup by url, cap the list.
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true))).slice(0, 12);
}

function extractMediaUrl(
  json: Record<string, unknown>,
  kind: "image" | "video" | "music" = "image",
): string | undefined {
  const data = (json.data as Array<Record<string, string>>) || [];
  const first = data[0];
  if (!first) return undefined;
  if (first.url) return first.url;
  // Some providers return raw bytes as base64 instead of a hosted URL. The MIME
  // must match the media kind — wrapping audio as image/png yields an <audio>
  // element that silently fails to decode.
  if (first.b64_json) {
    const mime = kind === "music" ? "audio/mpeg" : kind === "video" ? "video/mp4" : "image/png";
    return `data:${mime};base64,${first.b64_json}`;
  }
  return undefined;
}

// Some upstream/provider errors come back as the model's *content* (e.g. a 429
// rate-limit or a 410 EOL). Detect those so we can show a clean error instead
// of printing the raw error as Franklin's reply.
function upstreamErrorMessage(text: string): string | null {
  if (/429|Too Many Requests|rate.?limit/i.test(text))
    return "The model is busy right now (rate-limited). Please try again in a moment.";
  const code = /API error:\s*(\d{3})|"status":\s*(\d{3})/.exec(text);
  if (/^\s*\[Error:/i.test(text) || code)
    return `The model returned an error${code ? ` (${code[1] || code[2]})` : ""}. Please try again.`;
  return null;
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
