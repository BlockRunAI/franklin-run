"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./use-franklin-chat";

// Conversation history backed by the server (GCS, per signed-in wallet). The
// /try page is gated behind wallet sign-in, so this always has a session.
// Local optimistic state; changes are debounce-saved to the backend.

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

type Setter = ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function titleFrom(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  return firstUser?.content.slice(0, 48) || "New chat";
}

async function saveConvo(c: Conversation) {
  try {
    await fetch(`/api/try/conversations/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
  } catch {
    /* ignore — local state stays; will retry on next edit */
  }
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const setActiveId = useCallback((id: string | null) => {
    activeIdRef.current = id;
    setActiveIdState(id);
  }, []);

  // Load this wallet's conversations from the backend once.
  useEffect(() => {
    fetch("/api/try/conversations")
      .then((r) => (r.ok ? r.json() : { conversations: [] }))
      .then((d) => setConversations(d.conversations ?? []))
      .catch(() => {});
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const messages = activeConversation?.messages ?? [];

  const newChat = useCallback(() => setActiveId(null), [setActiveId]);
  const selectChat = useCallback((id: string) => setActiveId(id), [setActiveId]);

  const deleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeIdRef.current === id) setActiveId(null);
      fetch(`/api/try/conversations/${id}`, { method: "DELETE" }).catch(() => {});
    },
    [setActiveId],
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleSave = useCallback((c: Conversation) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveConvo(c), 700);
  }, []);

  const setMessages = useCallback(
    (next: Setter) => {
      let targetId = activeIdRef.current;
      if (!targetId) {
        targetId = uid();
        setActiveId(targetId);
      }
      const id = targetId;
      setConversations((prev) => {
        const cur = prev.find((c) => c.id === id);
        const prevMsgs = cur?.messages ?? [];
        const msgs = typeof next === "function" ? next(prevMsgs) : next;
        const now = Date.now();
        let updated: Conversation;
        let arr: Conversation[];
        if (!cur) {
          if (msgs.length === 0) return prev;
          updated = { id, title: titleFrom(msgs), createdAt: now, updatedAt: now, messages: msgs };
          arr = [updated, ...prev];
        } else {
          updated = {
            ...cur,
            messages: msgs,
            title: cur.title && cur.title !== "New chat" ? cur.title : titleFrom(msgs),
            updatedAt: now,
          };
          arr = prev.map((c) => (c.id === id ? updated : c));
        }
        scheduleSave(updated);
        return arr;
      });
    },
    [setActiveId, scheduleSave],
  );

  return { conversations, activeId, activeConversation, messages, setMessages, newChat, selectChat, deleteChat };
}
