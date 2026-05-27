"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Copy, Check, BookOpen, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { useTryLang } from "@/lib/try-i18n";

const INSTALL_CMD = "npm install -g @blockrun/franklin";
const RUN_CMD = "franklin";

// "Install the CLI" overview — the same agent, in your terminal. Promoted to a
// dedicated sidebar view so it's discoverable (it used to hide in Settings).
export function CLIPanel() {
  const { t } = useTryLang();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (cmd: string) => {
    navigator.clipboard?.writeText(cmd).then(() => {
      setCopied(cmd);
      setTimeout(() => setCopied((c) => (c === cmd ? null : c)), 1800);
    });
  };

  const cmdRow = (cmd: string) => (
    <button className="try-cli-cmd" onClick={() => copy(cmd)} aria-label={t.cliCopy}>
      <span className="try-cli-prompt">$</span>
      <code>{cmd}</code>
      {copied === cmd ? (
        <Check className="try-cli-copy-icon" />
      ) : (
        <Copy className="try-cli-copy-icon" />
      )}
    </button>
  );

  return (
    <div className="try-tools-panel">
      <div className="try-tools-inner try-cli-inner">
        <div className="try-cli-badge">
          <Terminal className="h-4 w-4" />
          {t.cli}
        </div>
        <h2 className="try-tools-h">{t.cliTitle}</h2>
        <p className="try-tools-sub">{t.cliSub}</p>

        <div className="try-cli-steps">
          <div className="try-cli-step">
            <div className="try-cli-step-label">{t.cliStepInstall}</div>
            {cmdRow(INSTALL_CMD)}
          </div>
          <div className="try-cli-step">
            <div className="try-cli-step-label">{t.cliStepRun}</div>
            {cmdRow(RUN_CMD)}
          </div>
        </div>

        <div className="try-cli-links">
          <Link className="try-cli-link" href="/docs/getting-started/installation">
            <BookOpen className="h-4 w-4" />
            {t.docs}
          </Link>
          <a
            className="try-cli-link"
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5 try-cli-link-ext" />
          </a>
        </div>
      </div>
    </div>
  );
}
