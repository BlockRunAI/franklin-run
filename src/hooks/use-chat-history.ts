"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./use-franklin-chat";

// Hybrid conversation history (soft login):
//  - signed out → browser localStorage
//  - signed in  → server (GCS, per wallet); on sign-in, local convos migrate up
// Same interface either way.

const LOCAL_KEY = "franklin-try-history-local-v1";

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

function loadLocal(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const p = raw ? JSON.parse(raw) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}
function saveLocal(convos: Conversation[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(convos));
  } catch {
    /* quota / disabled */
  }
}
async function backendList(): Promise<Conversation[]> {
  try {
    const r = await fetch("/api/try/conversations");
    if (!r.ok) return [];
    return (await r.json()).conversations ?? [];
  } catch {
    return [];
  }
}
async function backendSave(c: Conversation) {
  try {
    await fetch(`/api/try/conversations/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
  } catch {
    /* ignore */
  }
}

export function useChatHistory(address: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const hydrated = useRef(false);
  const signedIn = !!address;
  const signedInRef = useRef(signedIn);
  useEffect(() => {
    signedInRef.current = signedIn;
  }, [signedIn]);

  const setActiveId = useCallback((id: string | null) => {
    activeIdRef.current = id;
    setActiveIdState(id);
  }, []);

  // Load (and migrate local→backend on sign-in) whenever the signed-in wallet changes.
  useEffect(() => {
    let alive = true;
    (async () => {
      let convos: Conversation[];
      if (address) {
        const local = loadLocal();
        if (local.length) {
          await Promise.all(local.map(backendSave));
          saveLocal([]);
        }
        convos = await backendList();
      } else {
        convos = loadLocal();
      }
      if (!alive) return;
      hydrated.current = true;
      setConversations(convos);
      setActiveId(convos[0]?.id ?? null);
    })();
    return () => {
      alive = false;
    };
  }, [address, setActiveId]);

  // Anonymous: persist the whole list locally on change.
  useEffect(() => {
    if (!hydrated.current || signedIn) return;
    saveLocal(conversations);
  }, [conversations, signedIn]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const messages = activeConversation?.messages ?? [];

  const newChat = useCallback(() => setActiveId(null), [setActiveId]);
  const selectChat = useCallback((id: string) => setActiveId(id), [setActiveId]);

  const renameChat = useCallback((id: string, title: string) => {
    const clean = title.trim().slice(0, 80) || "New chat";
    setConversations((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, title: clean, updatedAt: Date.now() } : c));
      if (signedInRef.current) {
        const c = updated.find((x) => x.id === id);
        if (c) backendSave(c);
      }
      return updated;
    });
  }, []);

  const deleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeIdRef.current === id) setActiveId(null);
      if (signedInRef.current) fetch(`/api/try/conversations/${id}`, { method: "DELETE" }).catch(() => {});
    },
    [setActiveId],
  );

  // Delete a generated image/video from a conversation by its media URL (used
  // by the Gallery's delete button). Removes the message entirely; if that
  // empties the conversation, the conversation is dropped too.
  const deleteMedia = useCallback(
    (convId: string, url: string) => {
      setConversations((prev) => {
        const cur = prev.find((c) => c.id === convId);
        if (!cur) return prev;
        const msgs = cur.messages.filter((m) => m.image !== url && m.video !== url);
        if (msgs.length === cur.messages.length) return prev;
        if (msgs.length === 0) {
          if (activeIdRef.current === convId) setActiveId(null);
          if (signedInRef.current) fetch(`/api/try/conversations/${convId}`, { method: "DELETE" }).catch(() => {});
          return prev.filter((c) => c.id !== convId);
        }
        const updated = { ...cur, messages: msgs, updatedAt: Date.now() };
        if (signedInRef.current) backendSave(updated);
        return prev.map((c) => (c.id === convId ? updated : c));
      });
    },
    [setActiveId],
  );

  // Return a stable id for the active conversation, creating one if needed.
  // Lets an async flow (e.g. video generation) pin its writes to the
  // conversation it started in, even if the user switches away meanwhile.
  const ensureConvId = useCallback(() => {
    let id = activeIdRef.current;
    if (!id) {
      id = uid();
      setActiveId(id);
    }
    return id;
  }, [setActiveId]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setMessages = useCallback(
    (next: Setter, targetId?: string) => {
      let resolved = targetId ?? activeIdRef.current;
      if (!resolved) {
        resolved = uid();
        setActiveId(resolved);
      }
      const id = resolved;
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
        if (signedInRef.current) {
          if (saveTimer.current) clearTimeout(saveTimer.current);
          saveTimer.current = setTimeout(() => backendSave(updated), 700);
        }
        return arr;
      });
    },
    [setActiveId],
  );

  return { conversations, activeId, activeConversation, messages, setMessages, ensureConvId, newChat, selectChat, deleteChat, renameChat, deleteMedia };
}
