import { Storage } from "@google-cloud/storage";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

// Public, read-only conversation snapshots behind a "copy link" share. Unlike
// franklin-store (per-wallet, auth-gated), a share is an immutable snapshot
// anyone with the unguessable id can read — that's the whole point of a share
// link. Same GCS/local-dev split as franklin-store, but under a separate
// franklin-share/ prefix with no wallet in the path.

const BUCKET = process.env.GCS_MEDIA_BUCKET || process.env.GCS_LOG_BUCKET || "blockrun-prod-2026-logs";
const PREFIX = "franklin-share";
const USE_LOCAL =
  process.env.FRANKLIN_STORE_LOCAL === "1" ||
  (process.env.NODE_ENV !== "production" && !process.env.GOOGLE_APPLICATION_CREDENTIALS);
const LOCAL_DIR = path.join(process.cwd(), ".franklin-store", "_shares");

const storage = USE_LOCAL ? null : new Storage();
const bucket = storage?.bucket(BUCKET);

export interface SharedToolStep {
  label: string;
  detail?: string;
}

export interface SharedMessage {
  role: "user" | "assistant";
  content: string;
  kind?: "text" | "image" | "video" | "music" | "tools";
  // Only inline data: images survive a share (local 127.0.0.1 media is stripped
  // at upload — it would 404 for anyone but the original viewer).
  image?: string;
  // Set when kind === "tools": the tool-call activity for that step, so a shared
  // conversation reproduces tool usage too, not just the prose.
  tools?: SharedToolStep[];
}

export interface SharedConversation {
  id: string;
  title: string;
  createdAt: number;
  messages: SharedMessage[];
}

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}
function gcsPath(id: string): string {
  return `${PREFIX}/${safeId(id)}.json`;
}
function localPath(id: string): string {
  return path.join(LOCAL_DIR, `${safeId(id)}.json`);
}

// 16 random base64url chars (~96 bits) — unguessable, URL-safe, no collisions
// at any realistic scale.
function newShareId(): string {
  return crypto.randomBytes(12).toString("base64url");
}

export async function saveShare(input: { title: string; messages: SharedMessage[] }): Promise<string> {
  const id = newShareId();
  const convo: SharedConversation = {
    id,
    title: input.title.slice(0, 200),
    createdAt: Date.now(),
    messages: input.messages,
  };
  const body = JSON.stringify(convo);
  if (USE_LOCAL) {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(localPath(id), body);
  } else {
    await bucket!.file(gcsPath(id)).save(body, { contentType: "application/json", resumable: false });
  }
  return id;
}

export async function getShare(id: string): Promise<SharedConversation | null> {
  try {
    if (USE_LOCAL) {
      return JSON.parse(await fs.readFile(localPath(id), "utf8")) as SharedConversation;
    }
    const file = bucket!.file(gcsPath(id));
    const [exists] = await file.exists();
    if (!exists) return null;
    const [buf] = await file.download();
    return JSON.parse(buf.toString("utf8")) as SharedConversation;
  } catch {
    return null;
  }
}
