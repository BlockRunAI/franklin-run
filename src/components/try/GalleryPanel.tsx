"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Trash2, Copy, Check, X, Play } from "lucide-react";
import type { Conversation } from "@/hooks/use-chat-history";
import { useTryLang } from "@/lib/try-i18n";
import { cdnUrl } from "@/lib/cdn";
import { showcasePoster, type ShowcaseItem } from "@/lib/showcase-gallery";

interface MediaItem {
  type: "image" | "video";
  url: string;
  prompt: string;
  convId: string;
}

// Gallery of every image/video Franklin has generated, pulled from history.
// Deleting an item removes that media message from its conversation (single
// source of truth — it disappears from the chat too).
//
// A curated `showcase` (seeded examples) renders above the user's own media so
// a brand-new user opens the gallery to inspiration, not an empty state. Each
// showcase tile opens a detail modal with the verbatim prompt + a copy button,
// so anyone can reproduce it.
export function GalleryPanel({
  conversations,
  showcase = [],
  onZoom,
  onDelete,
}: {
  conversations: Conversation[];
  showcase?: ShowcaseItem[];
  onZoom: (url: string) => void;
  onDelete: (convId: string, url: string) => void;
}) {
  const { t } = useTryLang();
  const [detail, setDetail] = useState<ShowcaseItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  const copyPrompt = async () => {
    if (!detail?.prompt) return;
    try {
      await navigator.clipboard.writeText(detail.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  const items: MediaItem[] = [];
  for (const c of conversations) {
    for (const m of c.messages) {
      if (m.kind === "image" && m.image) items.push({ type: "image", url: m.image, prompt: m.content, convId: c.id });
      else if (m.kind === "video" && m.video) items.push({ type: "video", url: m.video, prompt: m.content, convId: c.id });
    }
  }

  const remove = (it: MediaItem) => {
    if (typeof window !== "undefined" && !window.confirm(t.galleryDeleteConfirm)) return;
    onDelete(it.convId, it.url);
  };

  return (
    <div className="try-gallery">
      <div className="try-gallery-inner">
        <h2 className="try-tools-h">{t.galleryTitle}</h2>

        {showcase.length > 0 && (
          <>
            <div className="try-gallery-section-row">
              <h3 className="try-gallery-section">{t.showcaseTitle}</h3>
              <a className="try-gallery-browse" href="/gallery" target="_blank" rel="noopener noreferrer">
                {t.galleryBrowseAll}
              </a>
            </div>
            <div className="try-gallery-grid">
              {showcase.map((it) => {
                const url = cdnUrl(it.path);
                return (
                  <div
                    key={it.id}
                    className="try-gallery-item"
                    title={it.title}
                    onClick={() => {
                      setCopied(false);
                      setDetail(it);
                    }}
                  >
                    {it.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={it.title} loading="lazy" />
                    ) : (
                      <video src={url} poster={cdnUrl(showcasePoster(it))} muted playsInline preload="none" />
                    )}
                    {it.type === "video" && (
                      <span className="try-gallery-play">
                        <Play className="h-5 w-5" />
                      </span>
                    )}
                    <div className="try-gallery-cap">
                      <span className="try-gallery-cap-title">{it.title}</span>
                      {it.credit &&
                        (it.sourceUrl ? (
                          <a
                            className="try-gallery-cap-credit"
                            href={it.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {it.credit}
                          </a>
                        ) : (
                          <span className="try-gallery-cap-credit">{it.credit}</span>
                        ))}
                    </div>
                    {it.prompt && (
                      <span className="try-gallery-badge">
                        <Copy className="h-3 w-3" /> {t.promptLabel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {items.length > 0 && (
          <>
            <h3 className="try-gallery-section">{t.galleryYours}</h3>
            <div className="try-gallery-grid">
              {items.map((it, i) => (
                <div key={i} className="try-gallery-item" title={it.prompt}>
                  {it.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.url} alt={it.prompt} loading="lazy" onClick={() => onZoom(it.url)} />
                  ) : (
                    <video src={it.url} controls playsInline preload="metadata" />
                  )}
                  <button
                    className="try-gallery-del"
                    aria-label={t.galleryDelete}
                    title={t.galleryDelete}
                    onClick={() => remove(it)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {items.length === 0 && showcase.length === 0 && (
          <p className="try-gallery-empty">
            <ImageIcon className="h-4 w-4" /> {t.galleryEmpty}
          </p>
        )}
      </div>

      {detail && (
        <div className="try-showcase-modal" onClick={() => setDetail(null)}>
          <div className="try-showcase-card" onClick={(e) => e.stopPropagation()}>
            <button className="try-showcase-close" aria-label="Close" onClick={() => setDetail(null)}>
              <X className="h-4 w-4" />
            </button>
            <div className="try-showcase-media">
              {detail.type === "video" ? (
                <video src={cdnUrl(detail.path)} controls autoPlay loop muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cdnUrl(detail.path)} alt={detail.title} />
              )}
            </div>
            <div className="try-showcase-side">
              <h3 className="try-showcase-title">{detail.title}</h3>
              <p className="try-showcase-meta">
                {detail.model}
                {detail.credit && (
                  <>
                    {" · "}
                    {detail.sourceUrl ? (
                      <a href={detail.sourceUrl} target="_blank" rel="noopener noreferrer">
                        {detail.credit}
                      </a>
                    ) : (
                      detail.credit
                    )}
                  </>
                )}
              </p>
              <a
                className="try-showcase-page"
                href={`/gallery/${detail.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.galleryOpenPage}
              </a>
              {detail.prompt ? (
                <>
                  <div className="try-showcase-prompt-head">
                    <span>{t.promptLabel}</span>
                    <button className="try-showcase-copy" onClick={copyPrompt}>
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? t.copied : t.copyPrompt}
                    </button>
                  </div>
                  <pre className="try-showcase-prompt">{detail.prompt}</pre>
                </>
              ) : (
                <p className="try-showcase-note">{t.showcaseFilmNote}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
