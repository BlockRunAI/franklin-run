"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ArrowUp, RotateCcw } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";
import { useFranklinChat, CHAT_MODELS } from "@/hooks/use-franklin-chat";

const SUGGESTIONS = [
  "Explain x402 micropayments in two sentences.",
  "Write a Python function to fetch a USDC balance.",
  "What can an AI agent with a wallet do that a chatbot can't?",
];

export function FranklinChat() {
  const {
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
  } = useFranklinChat();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isPaid = !selectedModel?.free;
  const needsWallet = isPaid && !isConnected;
  const canSend = !!input.trim() && !isBusy && !needsWallet;

  const submit = () => {
    if (!canSend) return;
    send(input);
    setInput("");
  };

  return (
    <div className="try-chat">
      <div className="try-chat-bar">
        <div className="try-model">
          <label className="try-model-label">Model</label>
          <select
            className="try-model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isBusy}
          >
            {CHAT_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
                {m.free ? " · Free" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="try-bar-right">
          {messages.length > 0 && (
            <button className="try-reset" onClick={reset} disabled={isBusy} aria-label="New chat">
              <RotateCcw className="h-3.5 w-3.5" /> New
            </button>
          )}
          <ConnectWallet />
        </div>
      </div>

      <div className="try-messages" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="try-empty">
            <p className="try-empty-eyebrow">Franklin · web preview</p>
            <h2 className="try-empty-title">
              State an outcome. <em>Franklin pays for it.</em>
            </h2>
            <p className="try-empty-sub">
              Connect a browser wallet and chat. Free models run with no wallet; paid models
              charge a few cents of USDC per message, signed in your wallet — no account, no
              subscription.
            </p>
            <div className="try-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="try-suggestion" onClick={() => send(s)} disabled={needsWallet}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`try-msg try-msg-${m.role}`}>
              <div className="try-msg-role">{m.role === "user" ? "You" : "Franklin"}</div>
              <div className="try-msg-body">{m.content}</div>
            </div>
          ))
        )}

        {status === "signing" && (
          <div className="try-status">
            <Loader2 className="h-4 w-4 animate-spin" /> Sign the payment in your wallet…
          </div>
        )}
        {status === "thinking" && (
          <div className="try-status">
            <Loader2 className="h-4 w-4 animate-spin" /> Franklin is working…
          </div>
        )}
        {error && <div className="try-error">{error}</div>}
      </div>

      <div className="try-input-wrap">
        {needsWallet && (
          <div className="try-input-hint">Connect a wallet to use {selectedModel?.label}, or switch to a free model.</div>
        )}
        <div className="try-input-row">
          <textarea
            className="try-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={needsWallet ? "Connect a wallet to begin…" : "Message Franklin…"}
            rows={1}
            disabled={isBusy}
          />
          <button className="try-send" onClick={submit} disabled={!canSend} aria-label="Send">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </div>
        <p className="try-disclaimer">
          Payments settle on Base in USDC via x402, paid to BlockRun. Franklin keeps no account
          and never holds your funds.
        </p>
      </div>
    </div>
  );
}
