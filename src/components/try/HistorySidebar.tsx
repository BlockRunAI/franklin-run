"use client";

import { Plus, MessageSquare, Trash2, Wallet, Phone } from "lucide-react";
import type { Conversation } from "@/hooks/use-chat-history";
import type { Usage } from "@/hooks/use-usage-stats";
import { useTryLang } from "@/lib/try-i18n";
import { SettingsMenu } from "./SettingsMenu";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  usage: Usage;
  view: "chat" | "phone";
  onPhone: () => void;
  open: boolean;
}

function fmtUsd(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

export function HistorySidebar({ conversations, activeId, onNew, onSelect, onDelete, usage, view, onPhone, open }: Props) {
  const { t } = useTryLang();
  return (
    <aside className={`try-sidebar${open ? " is-open" : ""}`}>
      {/* Nav: dedicated Phone panel (like the dashboard's Calls tab) */}
      <button className={`try-nav-item${view === "phone" ? " is-active" : ""}`} onClick={onPhone}>
        <Phone className="h-4 w-4" />
        {t.phone}
      </button>

      {/* Usage summary — mirrors the dashboard's "Total Spent" metric */}
      <div className="try-usage">
        <div className="try-usage-row">
          <Wallet className="h-3.5 w-3.5" />
          <span className="try-usage-label">{t.spent}</span>
          <span className="try-usage-value">{fmtUsd(usage.totalUsd)}</span>
        </div>
        <div className="try-usage-sub">{t.requests(usage.requests)}</div>
      </div>

      <button className="try-newchat" onClick={onNew}>
        <Plus className="h-4 w-4" />
        {t.newChat}
      </button>

      <div className="try-history">
        {conversations.length === 0 ? (
          <p className="try-history-empty">{t.noConversations}</p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              className={`try-history-item${c.id === activeId ? " is-active" : ""}`}
              onClick={() => onSelect(c.id)}
            >
              <MessageSquare className="try-history-icon" />
              <span className="try-history-title">{c.title || "New chat"}</span>
              <button
                className="try-history-del"
                aria-label="Delete conversation"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer — language switcher in the bottom-left circle */}
      <div className="try-sidebar-footer">
        <SettingsMenu />
      </div>
    </aside>
  );
}
