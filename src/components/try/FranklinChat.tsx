"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, PanelLeft, ImageIcon, Clapperboard, X, Plus, Check, BarChart3, TrendingUp } from "lucide-react";
import { ModelSelect } from "./ModelSelect";
import { HistorySidebar, type TryView } from "./HistorySidebar";
import { MessageContent } from "./MessageContent";
import { ActivitySummary } from "./ActivitySummary";
import { MessageActions } from "./MessageActions";
import { PhonePanel } from "./PhonePanel";
import { ToolsPanel, type TryAction } from "./ToolsPanel";
import { GalleryPanel } from "./GalleryPanel";
import { WalletPanel } from "./WalletPanel";
import { SkillsPanel } from "./SkillsPanel";
import { useFranklinChat } from "@/hooks/use-franklin-chat";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useUsageStats } from "@/hooks/use-usage-stats";
import { useAuth } from "@/hooks/use-auth";
import { useTryLang } from "@/lib/try-i18n";
import { prepareImageForUpload } from "@/lib/image-compress";

// Composer "focus" modes — force a specific live-data tool (server tool_choice).
type ToolFocus = "search_prediction_markets" | "web_search" | "get_market_price";
const TOOL_FOCUS_MODEL = "google/gemini-2.5-flash";

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
  const auth = useAuth();
  const history = useChatHistory(auth.address);
  const { usage, recordSpend } = useUsageStats();
  const chat = useFranklinChat(history.messages, history.setMessages, history.ensureConvId, recordSpend);
  const { mode, setMode, model, setModel, models, selectedModel, status, activeTool, steps, needsToolWallet, genConvId, mediaJobs, error, isBusy, isConnected, send, stop, stopMedia, regenerate } = chat;
  // Only show the live (chat) generation UI in the conversation that started it.
  const genHere = genConvId === null || genConvId === history.activeId;
  // Heavy media (image/video) runs as a per-conversation background job — show
  // its placeholder only in its own conversation; other conversations stay free.
  const activeMediaJob = history.activeId ? mediaJobs[history.activeId] : undefined;
  const busy = isBusy || !!activeMediaJob;

  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<TryView>("chat");
  // Focus mode: a composer toggle that forces a specific live-data tool (and a
  // tool-capable model). Like ChatGPT's "Search" / Perplexity Focus.
  const [focus, setFocus] = useState<ToolFocus | null>(null);
  const FOCUSES: { key: ToolFocus; icon: React.ReactNode; label: string; ph: string }[] = [
    { key: "search_prediction_markets", icon: <BarChart3 className="h-4 w-4" />, label: t.focusPrediction, ph: t.phPrediction },
    { key: "get_market_price", icon: <TrendingUp className="h-4 w-4" />, label: t.focusPrice, ph: t.phPrice },
  ];
  const activeFocus = FOCUSES.find((f) => f.key === focus);

  // Skill cards prefill the composer (and optionally pick a tool-capable model).
  const pickSkill = (template: string, model?: string) => {
    setView("chat");
    setMode("chat");
    if (model) setModel(model);
    setInput(template);
  };
  // Marketplace "Try" — switch mode/view, pick a model, prefill the composer.
  const tryMarketplace = (a: TryAction) => {
    if (a.view && a.view !== "chat") {
      setView(a.view);
      return;
    }
    setView("chat");
    if (a.mode) setMode(a.mode);
    if (a.model) setModel(a.model);
    if (a.template !== undefined) setInput(a.template);
  };
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const activeConvo = history.activeConversation;
  const commitTitle = () => {
    if (activeConvo) history.renameChat(activeConvo.id, titleDraft);
    setEditingTitle(false);
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const messages = history.messages;

  const [attachError, setAttachError] = useState<string | null>(null);
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAttachError(null);
    try {
      // Downscale/re-encode large images before upload (see image-compress.ts).
      setAttachment(await prepareImageForUpload(file));
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : "Could not load that image.");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Image/video always need a wallet; paid chat models too.
  // Image/video need a wallet; paid chat models too; and an attachment forces a
  // (paid) vision model, so it needs one as well.
  const needsWallet = (mode !== "chat" || !selectedModel?.free || !!attachment) && !isConnected;
  const canSend = (!!input.trim() || !!attachment) && !busy && !needsWallet;
  const suggestions = mode === "image" ? t.sugImage : mode === "video" ? t.sugVideo : t.sugChat;

  // Chat-mode opening cases showcase the three headline capabilities. Clicking
  // switches to the right mode; image/video need a wallet, so if not connected
  // we just switch + prefill instead of sending.
  // Prediction cases need a tool-capable model (the free default can't call
  // tools), so they force a cheap one — Gemini 2.5 Flash — and need a wallet.
  const TOOL_MODEL = "google/gemini-2.5-flash";
  const CASES: { mode: "chat" | "image" | "video"; prompt: string; model?: string }[] = [
    { mode: "chat", prompt: t.casePrediction, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrice, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseSearch, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrediction2, model: TOOL_MODEL },
    { mode: "image", prompt: t.sugImage[0] },
    { mode: "video", prompt: t.sugVideo[0] },
    { mode: "chat", prompt: t.casePrediction3, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseMusic, model: TOOL_MODEL },
    { mode: "chat", prompt: t.sugChat[0] },
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
    if (focus) {
      // Force the focused tool; bump unreliable free models to a tool-capable one.
      const m = model.startsWith("nvidia/") ? TOOL_FOCUS_MODEL : model;
      send(input, attachment ?? undefined, "chat", m, focus);
    } else {
      send(input, attachment ?? undefined);
    }
    setInput("");
    setAttachment(null);
  };

  const placeholder = needsWallet
    ? t.phConnect
    : mode === "image"
      ? t.phImage
      : mode === "video"
        ? t.phVideo
        : activeFocus
          ? activeFocus.ph
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
        view={view}
        onView={setView}
        open={sidebarOpen}
        auth={auth}
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

          {view === "chat" && activeConvo && (
            <div className="try-bar-title">
              {editingTitle ? (
                <input
                  className="try-bar-title-input"
                  value={titleDraft}
                  autoFocus
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitTitle();
                    } else if (e.key === "Escape") {
                      setEditingTitle(false);
                    }
                  }}
                />
              ) : (
                <button
                  className="try-bar-title-btn"
                  onClick={() => {
                    setTitleDraft(activeConvo.title);
                    setEditingTitle(true);
                  }}
                  title={t.rename}
                >
                  {activeConvo.title}
                </button>
              )}
            </div>
          )}
        </div>

        {view === "phone" ? (
          <PhonePanel />
        ) : view === "tools" ? (
          <ToolsPanel onTry={tryMarketplace} />
        ) : view === "skills" ? (
          <SkillsPanel onPick={pickSkill} />
        ) : view === "gallery" ? (
          <GalleryPanel conversations={history.conversations} onZoom={setLightbox} onDelete={history.deleteMedia} />
        ) : view === "wallet" ? (
          <WalletPanel usage={usage} />
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
                      <div className="try-msg-attach">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt="attachment" loading="lazy" className="try-zoomable" onClick={() => setLightbox(m.image!)} />
                      </div>
                    )}
                    {m.activity && <ActivitySummary activity={m.activity} />}
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
                {m.role === "assistant" && !(busy && i === messages.length - 1) && (
                  <MessageActions
                    content={m.content}
                    onRegenerate={i === messages.length - 1 && !busy ? regenerate : undefined}
                  />
                )}
              </div>
            ))
          )}

          {/* Generation placeholder — a shimmering skeleton so the user can see
              the image/video is on its way, not stuck. */}
          {activeMediaJob && (
            <div className="try-msg try-msg-assistant">
              <div className="try-msg-role">Franklin</div>
              <div className={`try-gen-skeleton${activeMediaJob.kind === "video" ? " is-video" : ""}`}>
                {activeMediaJob.kind === "video" ? (
                  <Clapperboard className="try-gen-skeleton-icon" />
                ) : (
                  <ImageIcon className="try-gen-skeleton-icon" />
                )}
                <span className="try-gen-skeleton-shimmer" aria-hidden />
              </div>
            </div>
          )}

          {/* CLI-style activity log: every model/tool/signature step on its own
              line, so signing always shows next to what it's paying for. */}
          {genHere && (steps.length > 0 ? (
            <div className="try-steps">
              {steps.map((s) => (
                <div key={s.id} className={`try-step is-${s.state}`}>
                  <span className="try-step-mark" aria-hidden>
                    {s.state === "done" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : s.state === "sign" ? (
                      <span className="try-coin" />
                    ) : (
                      <span className="try-dots"><i /><i /><i /></span>
                    )}
                  </span>
                  <span className="try-step-text">{s.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <>
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
                    {activeTool
                      ? t.toolRunning(activeTool)
                      : mode === "image"
                        ? t.statusImage
                        : mode === "video"
                          ? t.statusVideo
                          : t.statusWorking}
                  </span>
                </div>
              )}
            </>
          ))}
          {error && <div className="try-error">{error}</div>}
        </div>

        <div className="try-input-wrap">
          {needsToolWallet && (
            <div className="try-input-hint try-input-hint-action">
              <span>{t.hintToolWallet}</span>
              <button className="try-hint-connect" onClick={() => auth.signIn()} disabled={auth.signingIn}>
                {auth.signingIn ? t.connecting : t.signIn}
              </button>
            </div>
          )}
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
            {attachError && <div className="try-attach-error">{attachError}</div>}
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
              disabled={busy}
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
                  disabled={busy}
                  aria-label={t.attachImage}
                  title={mode === "video" ? t.attachSeed : mode === "image" ? t.attachRef : t.attachImage}
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
                <ModelSelect models={models} model={model} onChange={setModel} disabled={busy} />
                {mode === "chat" ? (
                  <>
                    <button className="try-tool" onClick={() => { setFocus(null); setMode("image"); }} disabled={busy}>
                      <ImageIcon className="h-4 w-4" /> {t.image}
                    </button>
                    <button className="try-tool" onClick={() => { setFocus(null); setMode("video"); }} disabled={busy}>
                      <Clapperboard className="h-4 w-4" /> {t.video}
                    </button>
                    {FOCUSES.map((f) => (
                      <button
                        key={f.key}
                        className={`try-tool try-focus${focus === f.key ? " is-active" : ""}`}
                        onClick={() => setFocus((cur) => (cur === f.key ? null : f.key))}
                        disabled={busy}
                        title={f.label}
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <span className="try-mode-pill">
                    {mode === "image" ? <ImageIcon className="h-4 w-4" /> : <Clapperboard className="h-4 w-4" />}
                    {mode === "image" ? t.image : t.video}
                    <button
                      className="try-mode-pill-x"
                      onClick={() => setMode("chat")}
                      disabled={busy}
                      aria-label="Back to chat"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
              </div>
              {busy ? (
                <button
                  className="try-send try-send-stop"
                  onClick={() => (activeMediaJob ? stopMedia(history.activeId!) : stop())}
                  aria-label="Stop"
                >
                  <span className="try-stop-sq" />
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
