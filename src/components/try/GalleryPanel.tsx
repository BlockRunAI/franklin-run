"use client";

import { ImageIcon, Trash2 } from "lucide-react";
import type { Conversation } from "@/hooks/use-chat-history";
import { useTryLang } from "@/lib/try-i18n";

interface MediaItem {
  type: "image" | "video";
  url: string;
  prompt: string;
  convId: string;
}

// Gallery of every image/video Franklin has generated, pulled from history.
// Deleting an item removes that media message from its conversation (single
// source of truth — it disappears from the chat too).
export function GalleryPanel({
  conversations,
  onZoom,
  onDelete,
}: {
  conversations: Conversation[];
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
        {items.length === 0 ? (
          <p className="try-gallery-empty">
            <ImageIcon className="h-4 w-4" /> {t.galleryEmpty}
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
