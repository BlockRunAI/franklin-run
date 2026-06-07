"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { XIcon, TelegramIcon, CopyIcon } from "@/components/icons";

// Social share for a gallery page. The page already sets OG/Twitter-card meta,
// so the shared link previews with the example image + title.
export function GalleryShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} — made with Franklin, the AI agent with a wallet. Grab the exact prompt:`;
  const x = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
    url,
  )}&via=BlockRunAI`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="gallery-share">
      <span className="gallery-share-label">Share</span>
      <a className="gallery-share-btn" href={x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <XIcon className="h-4 w-4" />
      </a>
      <a
        className="gallery-share-btn"
        href={tg}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Telegram"
      >
        <TelegramIcon className="h-4 w-4" />
      </a>
      <button type="button" className="gallery-share-btn" onClick={copy} aria-label="Copy link" title="Copy link">
        {copied ? <Check className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
