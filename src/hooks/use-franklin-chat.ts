"use client";

import { useCallback, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useX402Payment, parseX402FromResponse } from "./use-x402-payment";

// Browser-side chat against BlockRun's x402 chat API, proxied through
// /api/blockrun. Free models (e.g. nvidia/*) just return 200; paid models
// return 402 first, we sign once with the wallet, then retry with X-Payment.

const CHAT_ENDPOINT = "/api/blockrun/v1/chat/completions";

export interface ChatModel {
  id: string;
  label: string;
  free?: boolean;
}

// A small curated lineup — a free default so anyone can try with no wallet,
// plus paid frontier models to show the pay-per-message flow.
export const CHAT_MODELS: ChatModel[] = [
  { id: "nvidia/deepseek-v4-flash", label: "DeepSeek V4 Flash", free: true },
  { id: "nvidia/nemotron-super-49b", label: "NVIDIA Nemotron Super", free: true },
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5" },
  { id: "anthropic/claude-opus-4.7", label: "Claude Opus 4.7" },
  { id: "google/gemini-3.1-pro", label: "Gemini 3.1 Pro" },
  { id: "deepseek/deepseek-chat", label: "DeepSeek Chat" },
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatStatus = "idle" | "signing" | "thinking" | "error";

export function useFranklinChat(initialModel = CHAT_MODELS[0].id) {
  const { isConnected } = useAccount();
  const { makePayment } = useX402Payment();
  const [model, setModel] = useState(initialModel);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const reset = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setError(null);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || inFlight.current) return;
      inFlight.current = true;
      setError(null);

      const history = [...messages, { role: "user" as const, content: prompt }];
      setMessages(history);

      const body = JSON.stringify({
        model,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        stream: false,
      });

      try {
        setStatus("thinking");
        let res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (res.status === 402) {
          const reqs = parseX402FromResponse(res);
          if (!reqs) throw new Error("Could not read payment requirements from the server.");
          setStatus("signing");
          const { payload, error: signErr } = await makePayment(reqs);
          if (!payload) throw new Error(signErr || "Wallet signature failed.");
          setStatus("thinking");
          res = await fetch(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Payment": payload },
            body,
          });
        }

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error?.message || j.error || j.message || `Request failed (HTTP ${res.status})`);
        }

        const json = await res.json();
        const content: string =
          json.choices?.[0]?.message?.content ??
          json.choices?.[0]?.delta?.content ??
          "";
        setMessages((m) => [...m, { role: "assistant", content: content || "(empty response)" }]);
        setStatus("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      } finally {
        inFlight.current = false;
      }
    },
    [messages, model, makePayment],
  );

  const isBusy = status === "signing" || status === "thinking";
  const selectedModel = CHAT_MODELS.find((m) => m.id === model);

  return {
    isConnected,
    model,
    setModel,
    selectedModel,
    messages,
    status,
    error,
    isBusy,
    send,
    reset,
  };
}
