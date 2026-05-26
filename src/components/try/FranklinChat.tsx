"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, PanelLeft, ImageIcon, Clapperboard, X, Square, Plus } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";
import { ModelSelect } from "./ModelSelect";
import { HistorySidebar } from "./HistorySidebar";
import { MessageContent } from "./MessageContent";
import { PhonePanel } from "./PhonePanel";
import { useFranklinChat } from "@/hooks/use-franklin-chat";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useUsageStats } from "@/hooks/use-usage-stats";
import { useTryLang } from "@/lib/try-i18n";

// Renders an empty-state title with the word "Franklin" gold-emphasized.
function EmphTitle({ text }: { text: string }) {
  const parts = text.split("Franklin");
  return (
    <>
      {parts[0]}
      <em>Franklin</em>
      {parts[1] ?? ""}
    </>
  );
}

export function FranklinChat() {
  const { t } = useTryLang();
  const history = useChatHistory();
  const { usage, recordSpend } = useUsageStats();
  const chat = useFranklinChat(history.messages, history.setMessages, recordSpend);
  const { mode, setMode, model, setModel, models, selectedModel, status, error, isBusy, isConnected, send, stop } = chat;

  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<"chat" | "phone">("chat");

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const messages = history.messages;

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAttachment(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Image/video always need a wallet; paid chat models too.
  // Image/video need a wallet; paid chat models too; and an attachment forces a
  // (paid) vision model, so it needs one as well.
  const needsWallet = (mode !== "chat" || !selectedModel?.free || !!attachment) && !isConnected;
  const canSend = (!!input.trim() || !!attachment) && !isBusy && !needsWallet;
  const suggestions = mode === "image" ? t.sugImage : mode === "video" ? t.sugVideo : t.sugChat;

  // Chat-mode opening cases showcase the three headline capabilities. Clicking
  // switches to the right mode; image/video need a wallet, so if not connected
  // we just switch + prefill instead of sending.
  // Prediction cases need a tool-capable model (the free default can't call
  // tools), so they force a cheap one — Gemini 2.5 Flash — and need a wallet.
  const TOOL_MODEL = "google/gemini-2.5-flash";
  const CASES: { mode: "chat" | "image" | "video"; prompt: string; model?: string }[] = [
    { mode: "chat", prompt: t.casePrediction, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrediction2, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrediction3, model: TOOL_MODEL },
    { mode: "image", prompt: t.sugImage[0] },
    { mode: "video", prompt: t.sugVideo[0] },
  ];
  const runCase = (c: { mode: "chat" | "image" | "video"; prompt: string; model?: string }) => {
    setMode(c.mode);
    // Tool/image/video cases are paid — if no wallet yet, switch + prefill.
    if ((c.mode !== "chat" || c.model) && !isConnected) {
      if (c.model) setModel(c.model);
      setInput(c.prompt);
      return;
    }
    send(c.prompt, undefined, c.mode, c.model);
  };

  const submit = () => {
    if (!canSend) return;
    send(input, attachment ?? undefined);
    setInput("");
    setAttachment(null);
  };

  const placeholder = needsWallet
    ? t.phConnect
    : mode === "image"
      ? t.phImage
      : mode === "video"
        ? t.phVideo
        : t.phMessage;

  return (
    <div className="try-shell">
      <HistorySidebar
        conversations={history.conversations}
        activeId={history.activeId}
        onNew={() => {
          history.newChat();
          setView("chat");
        }}
        onSelect={(id) => {
          history.selectChat(id);
          setView("chat");
        }}
        onDelete={history.deleteChat}
        usage={usage}
        view={view}
        onPhone={() => setView("phone")}
        open={sidebarOpen}
      />

      <div className="try-chat">
        <div className="try-chat-bar">
          <button
            className="try-sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle history"
          >
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
          <ConnectWallet />
        </div>

        {view === "phone" ? (
          <PhonePanel />
        ) : (
        <>
        <div className="try-messages" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="try-empty">
              <h2 className="try-empty-title">
                <EmphTitle text={mode === "image" ? t.emptyImage : mode === "video" ? t.emptyVideo : t.emptyChat} />
              </h2>
              <div className="try-suggestions">
                {mode === "chat"
                  ? CASES.map((c) => (
                      <button key={c.prompt} className="try-suggestion" onClick={() => runCase(c)}>
                        {c.prompt}
                      </button>
                    ))
                  : suggestions.map((s) => (
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
                {m.kind === "image" && m.image ? (
                  <div className="try-msg-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.image}
                      alt={m.content}
                      loading="lazy"
                      className="try-zoomable"
                      onClick={() => setLightbox(m.image!)}
                    />
                    <a className="try-media-link" href={m.image} target="_blank" rel="noreferrer">
                      {t.openFull}
                    </a>
                  </div>
                ) : m.kind === "video" && m.video ? (
                  <div className="try-msg-media">
                    <video src={m.video} controls playsInline preload="metadata" />
                    <a className="try-media-link" href={m.video} target="_blank" rel="noreferrer">
                      {t.downloadMp4}
                    </a>
                  </div>
                ) : (
                  <>
                    {m.image && (
                      <div className="try-msg-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt="attachment" loading="lazy" />
                      </div>
                    )}
                    {m.reasoning && (
                      <details className="try-reasoning">
                        <summary>{t.reasoning}</summary>
                        <div className="try-reasoning-body">{m.reasoning}</div>
                      </details>
                    )}
                    {m.content &&
                      (m.role === "assistant" ? (
                        <div className="try-msg-body">
                          <MessageContent content={m.content} />
                        </div>
                      ) : (
                        <div className="try-msg-body">{m.content}</div>
                      ))}
                  </>
                )}
              </div>
            ))
          )}

          {status === "signing" && (
            <div className="try-status">
              <span className="try-coin" aria-hidden />
              <span className="try-status-text">{t.statusSigning}</span>
            </div>
          )}
          {(status === "thinking" || status === "generating") && (
            <div className="try-status">
              <span className="try-dots" aria-hidden><i /><i /><i /></span>
              <span className="try-status-text">
                {mode === "image" ? t.statusImage : mode === "video" ? t.statusVideo : t.statusWorking}
              </span>
            </div>
          )}
          {error && <div className="try-error">{error}</div>}
        </div>

        <div className="try-input-wrap">
          {needsWallet && (
            <div className="try-input-hint">
              {mode === "image"
                ? t.hintImage
                : mode === "video"
                  ? t.hintVideo
                  : t.hintChat(selectedModel?.label ?? "")}
            </div>
          )}

          {/* Composer: textarea on top, tool row inside the same box */}
          <div className="try-composer">
            {attachment && (
              <div className="try-attach">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={attachment} alt="attachment" />
                <button className="try-attach-x" onClick={() => setAttachment(null)} aria-label="Remove attachment">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
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
              placeholder={placeholder}
              rows={1}
              disabled={isBusy}
            />
            <div className="try-tools">
              <div className="try-tools-left">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="try-file-input"
                  onChange={onPickFile}
                />
                <button
                  className="try-tool-icon"
                  onClick={() => fileRef.current?.click()}
                  disabled={isBusy || mode !== "chat"}
                  aria-label={t.attachImage}
                  title={mode === "chat" ? t.attachImage : t.attachChatOnly}
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
                <ModelSelect models={models} model={model} onChange={setModel} disabled={isBusy} />
                {mode === "chat" ? (
                  <>
                    <button className="try-tool" onClick={() => setMode("image")} disabled={isBusy}>
                      <ImageIcon className="h-4 w-4" /> {t.image}
                    </button>
                    <button className="try-tool" onClick={() => setMode("video")} disabled={isBusy}>
                      <Clapperboard className="h-4 w-4" /> {t.video}
                    </button>
                  </>
                ) : (
                  <span className="try-mode-pill">
                    {mode === "image" ? <ImageIcon className="h-4 w-4" /> : <Clapperboard className="h-4 w-4" />}
                    {mode === "image" ? t.image : t.video}
                    <button
                      className="try-mode-pill-x"
                      onClick={() => setMode("chat")}
                      disabled={isBusy}
                      aria-label="Back to chat"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
              </div>
              {isBusy ? (
                <button className="try-send try-send-stop" onClick={stop} aria-label="Stop">
                  <Square className="h-4 w-4" fill="currentColor" />
                </button>
              ) : (
                <button className="try-send" onClick={submit} disabled={!canSend} aria-label="Send">
                  <ArrowUp className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {lightbox && (
        <div className="try-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="try-lightbox-x" onClick={() => setLightbox(null)} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
