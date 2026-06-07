"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

// Copy-to-clipboard button for a showcase prompt. Lives on the server-rendered
// gallery detail page (the prompt itself is in the HTML for SEO; this just adds
// the one-click copy).
export function CopyPromptButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button type="button" className="gallery-copy" onClick={copy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}
