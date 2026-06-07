"use client";

import { ImageIcon, Trash2, Play, ExternalLink } from "lucide-react";
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
// showcase tile is a real link to its own /gallery/<id> page (image/video, the
// full copyable prompt, share, and "make your own"), opened in a new tab so the
// chat session is preserved.
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
                  <a
                    key={it.id}
                    className="try-gallery-item try-gallery-link"
                    href={`/gallery/${it.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={it.title}
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
                      {it.credit && <span className="try-gallery-cap-credit">{it.credit}</span>}
                    </div>
                    <span className="try-gallery-badge">
                      <ExternalLink className="h-3 w-3" /> {it.prompt ? t.promptLabel : t.galleryOpenPage}
                    </span>
                  </a>
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
    </div>
  );
}
