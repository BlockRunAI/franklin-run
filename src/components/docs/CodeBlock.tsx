"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasHeader = filename || language;

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14]">
      {/* Header bar */}
      {hasHeader && (
        <div className="flex items-center justify-between border-b border-white/8 bg-[#08090f] px-4 py-2.5">
          <div className="flex items-center gap-3">
            {filename && (
              <span className="font-mono text-[12px] text-white/40">
                {filename}
              </span>
            )}
            {language && !filename && (
              <span className="font-mono text-[12px] text-white/30">
                {language}
              </span>
            )}
            {language && filename && (
              <span className="font-mono text-[11px] text-white/20">
                {language}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors",
              copied
                ? "text-[#10b981]"
                : "text-white/30 hover:text-white/60"
            )}
            aria-label="Copy code"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {!hasHeader && (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "absolute right-3 top-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] opacity-0 transition-all group-hover:opacity-100",
              copied
                ? "text-[#10b981]"
                : "text-white/30 hover:text-white/60"
            )}
            aria-label="Copy code"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}

        <pre className="overflow-x-auto p-4">
          <code className="block font-mono text-[13px] leading-6 text-[#10b981]/90">
            {children.trim()}
          </code>
        </pre>
      </div>
    </div>
  );
}
