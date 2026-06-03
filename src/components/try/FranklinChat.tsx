"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, PanelLeft, ImageIcon, Clapperboard, X, Plus, Check, BarChart3, TrendingUp, Music, ChevronDown, Gauge } from "lucide-react";
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
import { CLIPanel } from "./CLIPanel";
import { useFranklinChat, maxAttachmentsFor } from "@/hooks/use-franklin-chat";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useUsageStats } from "@/hooks/use-usage-stats";
import { useAuth } from "@/hooks/use-auth";
import { useTryLang } from "@/lib/try-i18n";
import { prepareImageForUpload } from "@/lib/image-compress";

// Composer "focus" modes — force a specific live-data tool (server tool_choice).
type ToolFocus = "search_prediction_markets" | "web_search" | "get_market_price";
const TOOL_FOCUS_MODEL = "google/gemini-2.5-flash";

// Tiny SVG that draws the actual aspect-ratio rectangle (16x16 box, scaled
// to fit). Beats picking a single lucide icon — users can see horizontal vs
// vertical at a glance, which is the whole reason for the picker.
function RatioGlyph({ ratio, className }: { ratio: string; className?: string }) {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return null;
  const box = 16;
  const pad = 1;
  const max = Math.max(w, h);
  const W = (w / max) * (box - pad * 2);
  const H = (h / max) * (box - pad * 2);
  return (
    <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className={className} aria-hidden>
      <rect
        x={(box - W) / 2}
        y={(box - H) / 2}
        width={W}
        height={H}
        rx={1.2}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
    </svg>
  );
}

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
  const { mode, setMode, model, setModel, models, selectedModel, status, activeTool, steps, needsToolWallet, genConvId, mediaJobs, error, isBusy, isConnected, send, stop, stopMedia, regenerate, imageSize, setImageSize, imageSizes, videoRatio, setVideoRatio, videoRatios, videoResolution, setVideoResolution, videoResolutions } = chat;
  // Only show the live (chat) generation UI in the conversation that started it.
  const genHere = genConvId === null || genConvId === history.activeId;
  // Heavy media (image/video) runs as a per-conversation background job — show
  // its placeholder only in its own conversation; other conversations stay free.
  const activeMediaJob = history.activeId ? mediaJobs[history.activeId] : undefined;
  const busy = isBusy || !!activeMediaJob;

  const [input, setInput] = useState("");
  // Multi-attachment: gateway image2image accepts up to 4 (OpenAI) / 3 (Google);
  // chat-vision matches the same cap for UX symmetry. maxAttachmentsFor() returns
  // the per-mode/per-model ceiling; the "+" button hides when reached.
  const [attachments, setAttachments] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<TryView>("chat");
  // On mobile the sidebar overlays the chat (position: fixed), so start it
  // collapsed and close it after navigating — the chat should be visible first.
  const MOBILE_BP = 880;
  const closeSidebarOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth <= MOBILE_BP) setSidebarOpen(false);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.innerWidth <= MOBILE_BP) setSidebarOpen(false);
  }, []);
  // Focus mode: a composer toggle that forces a specific live-data tool (and a
  // tool-capable model). Like ChatGPT's "Search" / Perplexity Focus.
  const [focus, setFocus] = useState<ToolFocus | null>(null);
  const FOCUSES: { key: ToolFocus; icon: React.ReactNode; label: string; ph: string }[] = [
    { key: "search_prediction_markets", icon: <BarChart3 className="h-4 w-4" />, label: t.focusPrediction, ph: t.phPrediction },
    { key: "get_market_price", icon: <TrendingUp className="h-4 w-4" />, label: t.focusPrice, ph: t.phPrice },
  ];
  const activeFocus = FOCUSES.find((f) => f.key === focus);
  // Aspect-ratio flyout — shown in image mode (per-model `sizes` whitelist)
  // and video mode (Seedance-only `aspect_ratio` list). Other modes / models
  // with a single ratio hide the button entirely.
  const [ratioOpen, setRatioOpen] = useState(false);
  // Resolution flyout — Seedance-only. Sits next to the ratio picker. The
  // gateway accepts 360p/480p/540p/720p/1080p/1K/2K/4K but we expose three
  // common steps to keep the menu tight.
  const [resOpen, setResOpen] = useState(false);
  // Close both composer flyouts on any mode change — otherwise an open menu in
  // image/video mode survives a return to chat and re-opens unbidden on the next
  // image/video entry (the pickers are merely hidden in chat, not
  // unmounted-with-reset). Done via the "adjust state during render" pattern
  // rather than an effect.
  const [flyoutMode, setFlyoutMode] = useState(mode);
  if (flyoutMode !== mode) {
    setFlyoutMode(mode);
    setRatioOpen(false);
    setResOpen(false);
    // Staged attachments are mode-specific (image fusion refs / chat vision);
    // clearing them here keeps them from leaking into a different mode's send.
    setAttachments([]);
  }
  const ratioOptions: { ratio: string; value: string }[] =
    mode === "image"
      ? imageSizes.map((s) => ({ ratio: s.ratio, value: s.size }))
      : mode === "video"
        ? videoRatios.map((r) => ({ ratio: r, value: r }))
        : [];
  const ratioValue = mode === "image" ? imageSize : mode === "video" ? videoRatio : "";
  const setRatioValue = mode === "image" ? setImageSize : mode === "video" ? setVideoRatio : () => {};
  const currentRatio = ratioOptions.find((o) => o.value === ratioValue)?.ratio ?? ratioOptions[0]?.ratio ?? "";

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
  // Per-mode/per-model attachment ceiling — used for both the file input's
  // accept gate and to hide the "+" button once the user has hit the limit.
  // Falls back to chat-mode when no model is picked (no model = no upload).
  const attachCap = maxAttachmentsFor(mode, model);
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setAttachError(null);
    // Respect the per-model cap on every pick — if the user already attached
    // 3 of 4 then drops 3 more in one go, append only the first 1 that fits.
    const room = Math.max(0, attachCap - attachments.length);
    const accepted = files.slice(0, room);
    if (accepted.length === 0) return;
    try {
      // Downscale/re-encode large images before upload (see image-compress.ts).
      const prepared = await Promise.all(accepted.map((f) => prepareImageForUpload(f)));
      setAttachments((cur) => [...cur, ...prepared].slice(0, attachCap));
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : "Could not load that image.");
    }
  };
  const removeAttachment = (idx: number) => {
    setAttachments((cur) => cur.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Image/video always need a wallet; paid chat models too.
  // Image/video need a wallet; paid chat models too; and an attachment forces a
  // (paid) vision model, so it needs one as well.
  const needsWallet = (mode !== "chat" || !selectedModel?.free || attachments.length > 0) && !isConnected;
  const canSend = (!!input.trim() || attachments.length > 0) && !busy && !needsWallet;
  const suggestions =
    mode === "image" ? t.sugImage : mode === "video" ? t.sugVideo : mode === "music" ? t.sugMusic : t.sugChat;

  // Chat-mode opening cases showcase the three headline capabilities. Clicking
  // switches to the right mode; image/video need a wallet, so if not connected
  // we just switch + prefill instead of sending.
  // Prediction cases need a tool-capable model (the free default can't call
  // tools), so they force a cheap one — Gemini 2.5 Flash — and need a wallet.
  const TOOL_MODEL = "google/gemini-2.5-flash";
  // `prefillOnly` cases need the user's own media (a selfie, a screenshot,
  // their cat) — clicking switches mode + prefills the composer so the user
  // can attach their file and send, rather than firing with no input.
  type Case = { mode: "chat" | "image" | "video"; prompt: string; model?: string; prefillOnly?: boolean };
  const CHAT_CASES: Case[] = [
    { mode: "chat", prompt: t.casePrediction, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrice, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseSearch, model: TOOL_MODEL },
    { mode: "chat", prompt: t.casePrediction2, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseMovers, model: TOOL_MODEL },
    { mode: "video", prompt: t.sugVideo[0] },
    { mode: "chat", prompt: t.caseSports, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseMusic, model: TOOL_MODEL },
    { mode: "chat", prompt: t.caseTech, model: TOOL_MODEL },
  ];
  // Image-mode cases — shown only after the user clicks the Image button.
  const IMAGE_CASES: Case[] = [
    { mode: "image", prompt: t.caseProductPhotos },
    { mode: "image", prompt: t.caseFranklinSpeaker },
    { mode: "image", prompt: t.caseStartupVisuals },
    { mode: "image", prompt: t.caseHeadshots, prefillOnly: true },
    { mode: "image", prompt: t.caseScreenshotDemo, prefillOnly: true },
    { mode: "image", prompt: t.caseCatHedgeFund, prefillOnly: true },
  ];
  const runCase = (c: Case) => {
    setMode(c.mode);
    if (c.model) setModel(c.model);
    // Prefill-only (needs user's media), or paid case without a wallet → just
    // switch mode + prefill; let the user attach/edit and send themselves.
    if (c.prefillOnly || ((c.mode !== "chat" || c.model) && !isConnected)) {
      setInput(c.prompt);
      return;
    }
    send(c.prompt, undefined, c.mode, c.model);
  };

  const submit = () => {
    if (!canSend) return;
    // send() normalizes single → array internally; pass undefined when empty
    // so it can short-circuit the empty-attachment branch cleanly.
    const atts = attachments.length > 0 ? attachments : undefined;
    if (focus) {
      // Force the focused tool; bump unreliable free models to a tool-capable one.
      const m = model.startsWith("nvidia/") ? TOOL_FOCUS_MODEL : model;
      send(input, atts, "chat", m, focus);
    } else {
      send(input, atts);
    }
    setInput("");
    setAttachments([]);
  };

  const placeholder = needsWallet
    ? t.phConnect
    : mode === "image"
      ? t.phImage
      : mode === "video"
        ? t.phVideo
        : mode === "music"
          ? t.phMusic
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
          closeSidebarOnMobile();
        }}
        onSelect={(id) => {
          history.selectChat(id);
          setView("chat");
          closeSidebarOnMobile();
        }}
        onDelete={history.deleteChat}
        view={view}
        onView={(v) => {
          setView(v);
          closeSidebarOnMobile();
        }}
        open={sidebarOpen}
        auth={auth}
      />

      {/* Mobile-only backdrop: tap outside the (overlaying) sidebar to close. */}
      {sidebarOpen && <div className="try-sidebar-scrim" onClick={() => setSidebarOpen(false)} />}

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
        ) : view === "cli" ? (
          <CLIPanel />
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
                <EmphTitle text={mode === "image" ? t.emptyImage : mode === "video" ? t.emptyVideo : mode === "music" ? t.emptyMusic : t.emptyChat} />
              </h2>
              <div className="try-suggestions">
                {mode === "chat"
                  ? CHAT_CASES.map((c) => (
                      <button key={c.prompt} className="try-suggestion" onClick={() => runCase(c)}>
                        {c.prompt}
                      </button>
                    ))
                  : mode === "image"
                    ? IMAGE_CASES.map((c) => (
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
                ) : m.kind === "music" && m.music ? (
                  <div className="try-msg-media try-msg-audio">
                    <audio src={m.music} controls preload="metadata" />
                    <a className="try-media-link" href={m.music} target="_blank" rel="noreferrer">
                      {t.downloadAudio}
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Render every attached input image. Legacy single-image
                        messages set `image`; multi-attachment turns use
                        `images`. Both flatten through this same row so a
                        single attachment doesn't get the multi-row styling. */}
                    {(() => {
                      const imgs = m.images && m.images.length > 0 ? m.images : m.image ? [m.image] : [];
                      if (imgs.length === 0) return null;
                      return (
                        <div className={imgs.length > 1 ? "try-msg-attach-row" : "try-msg-attach"}>
                          {imgs.map((src, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={idx}
                              src={src}
                              alt={`attachment ${idx + 1}`}
                              loading="lazy"
                              className="try-zoomable"
                              onClick={() => setLightbox(src)}
                            />
                          ))}
                        </div>
                      );
                    })()}
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
              <div className={`try-gen-skeleton${activeMediaJob.kind === "video" ? " is-video" : ""}${activeMediaJob.kind === "music" ? " is-music" : ""}`}>
                {activeMediaJob.kind === "video" ? (
                  <Clapperboard className="try-gen-skeleton-icon" />
                ) : activeMediaJob.kind === "music" ? (
                  <Music className="try-gen-skeleton-icon" />
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
              <button className="try-hint-connect" onClick={() => auth.connect()} disabled={auth.signingIn}>
                {auth.signingIn ? t.connecting : t.connectWallet}
              </button>
            </div>
          )}
          {needsWallet && (
            <div className="try-input-hint">
              {mode === "image"
                ? t.hintImage
                : mode === "video"
                  ? t.hintVideo
                  : mode === "music"
                    ? t.hintMusic
                    : t.hintChat(selectedModel?.label ?? "")}
            </div>
          )}

          {/* Composer: textarea on top, tool row inside the same box */}
          <div className="try-composer">
            {attachments.length > 0 && (
              <div className={attachments.length > 1 ? "try-attach-row" : undefined}>
                {attachments.map((src, i) => (
                  <div className="try-attach" key={`${i}-${src.slice(0, 24)}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`attachment ${i + 1}`} />
                    <button
                      className="try-attach-x"
                      onClick={() => removeAttachment(i)}
                      aria-label={`Remove attachment ${i + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
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
                  // Allow multi-pick when the active model fuses multiple refs
                  // (OpenAI gpt-image-* / Google Nano Banana). Single-anchor
                  // modes get the simpler single-pick input behavior.
                  multiple={attachCap > 1}
                  onChange={onPickFile}
                />
                {/* Music ignores reference images, so don't offer an attach
                    button there — it would accept an image, show a thumbnail,
                    and silently drop it from the request. The button also
                    hides once the per-model cap is hit so users don't pick
                    a file that would be rejected. */}
                {mode !== "music" && attachments.length < attachCap && (
                  <button
                    className="try-tool-icon"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                    aria-label={t.attachImage}
                    title={
                      attachCap > 1
                        ? `${t.attachImage} (${attachments.length}/${attachCap})`
                        : mode === "video"
                          ? t.attachSeed
                          : mode === "image"
                            ? t.attachRef
                            : t.attachImage
                    }
                  >
                    <Plus className="h-[18px] w-[18px]" />
                  </button>
                )}
                <ModelSelect models={models} model={model} onChange={setModel} disabled={busy} />
                {mode === "chat" ? (
                  <>
                    <button className="try-tool" onClick={() => { setFocus(null); setMode("image"); }} disabled={busy}>
                      <ImageIcon className="h-4 w-4" /> {t.image}
                    </button>
                    <button className="try-tool" onClick={() => { setFocus(null); setMode("video"); }} disabled={busy}>
                      <Clapperboard className="h-4 w-4" /> {t.video}
                    </button>
                    <button className="try-tool" onClick={() => { setFocus(null); setMode("music"); }} disabled={busy}>
                      <Music className="h-4 w-4" /> {t.music}
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
                  <>
                    <span className="try-mode-pill">
                      {mode === "image" ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : mode === "video" ? (
                        <Clapperboard className="h-4 w-4" />
                      ) : (
                        <Music className="h-4 w-4" />
                      )}
                      {mode === "image" ? t.image : mode === "video" ? t.video : t.music}
                      <button
                        className="try-mode-pill-x"
                        onClick={() => setMode("chat")}
                        disabled={busy}
                        aria-label="Back to chat"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                    {ratioOptions.length > 1 && (
                      <div className="try-ratio">
                        <button
                          className={`try-tool try-ratio-btn${ratioOpen ? " is-active" : ""}`}
                          onClick={() => setRatioOpen((o) => !o)}
                          disabled={busy}
                          title={t.ratio}
                          aria-haspopup="listbox"
                          aria-expanded={ratioOpen}
                        >
                          <RatioGlyph ratio={currentRatio} className="try-ratio-glyph" />
                          {currentRatio}
                          <ChevronDown className="try-ratio-chev h-3.5 w-3.5" />
                        </button>
                        {ratioOpen && (
                          <>
                            <div className="try-ratio-scrim" onClick={() => setRatioOpen(false)} />
                            <div className="try-ratio-menu" role="listbox" aria-label={t.ratio}>
                              {ratioOptions.map((o) => (
                                <button
                                  key={o.value}
                                  role="option"
                                  aria-selected={o.value === ratioValue}
                                  className={`try-ratio-item${o.value === ratioValue ? " is-active" : ""}`}
                                  onClick={() => {
                                    setRatioValue(o.value);
                                    setRatioOpen(false);
                                  }}
                                >
                                  <RatioGlyph ratio={o.ratio} className="try-ratio-item-glyph" />
                                  {o.ratio}
                                  <Check className="try-ratio-item-check h-3.5 w-3.5" />
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {mode === "video" && videoResolutions.length > 1 && (
                      <div className="try-ratio">
                        <button
                          className={`try-tool try-ratio-btn${resOpen ? " is-active" : ""}`}
                          onClick={() => setResOpen((o) => !o)}
                          disabled={busy}
                          title={t.resolution}
                          aria-haspopup="listbox"
                          aria-expanded={resOpen}
                        >
                          <Gauge className="h-4 w-4" />
                          {videoResolution}
                          <ChevronDown className="try-ratio-chev h-3.5 w-3.5" />
                        </button>
                        {resOpen && (
                          <>
                            <div className="try-ratio-scrim" onClick={() => setResOpen(false)} />
                            <div className="try-ratio-menu" role="listbox" aria-label={t.resolution}>
                              {videoResolutions.map((r) => (
                                <button
                                  key={r}
                                  role="option"
                                  aria-selected={r === videoResolution}
                                  className={`try-ratio-item${r === videoResolution ? " is-active" : ""}`}
                                  onClick={() => {
                                    setVideoResolution(r);
                                    setResOpen(false);
                                  }}
                                >
                                  {r}
                                  <Check className="try-ratio-item-check h-3.5 w-3.5" />
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
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
