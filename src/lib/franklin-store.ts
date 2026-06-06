import { Storage } from "@google-cloud/storage";
import fs from "node:fs/promises";
import path from "node:path";

// Per-wallet conversation storage. Production: GCS, replicating BlockRun's
// pattern (src/lib/gcs-logger.ts) — `new Storage()` uses Cloud Run's default
// service-account credentials, JSON objects under a franklin-try/ prefix in
// the same bucket. Local dev (FRANKLIN_STORE_LOCAL=1, or no GCS creds): a
// local .franklin-store/ folder, so the flow is testable without GCS access.

const BUCKET = process.env.GCS_MEDIA_BUCKET || process.env.GCS_LOG_BUCKET || "blockrun-prod-2026-logs";
const PREFIX = "franklin-try";
// Use the local fs store ONLY when explicitly asked, or in a genuinely local
// dev context. `K_SERVICE` is set on every Cloud Run revision, so even a deploy
// whose NODE_ENV isn't exactly "production" (staging/preview) never silently
// falls back to the container's ephemeral disk — which would lose data on
// restart and not share across instances.
const USE_LOCAL =
  process.env.FRANKLIN_STORE_LOCAL === "1" ||
  (!process.env.K_SERVICE &&
    process.env.NODE_ENV !== "production" &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS);
const LOCAL_DIR = path.join(process.cwd(), ".franklin-store");

// How many GCS objects to download at once when listing. Conversations can be
// multi-MB (inlined base64 images), so an uncapped Promise.all over a large
// history would spike instance memory and saturate egress.
const DOWNLOAD_CONCURRENCY = 8;

// Write-path bounds. Conversations legitimately carry inlined images, so the
// cap is generous but stays clear of Cloud Run's 32MB request ceiling.
export const MAX_CONVERSATION_BYTES = 24 * 1024 * 1024;
const MAX_MESSAGES = 2000;
const MAX_TITLE_LEN = 512;

const storage = USE_LOCAL ? null : new Storage();
const bucket = storage?.bucket(BUCKET);

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  kind?: "text" | "image" | "video" | "music";
  image?: string;
  images?: string[];
  video?: string;
  music?: string;
  reasoning?: string;
  activity?: unknown;
}

export interface StoredConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
}

export class ValidationError extends Error {}

// Canonical conversation id: the client generates base36 ids, so this only
// rejects malformed/hostile input. Enforcing it at the route door (instead of
// silently normalizing) prevents two distinct ids from collapsing to the same
// storage key and overwriting/deleting each other's data.
export function isValidConversationId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,80}$/.test(id);
}

// Hard whitelist — wallet is a verified address, id is already validated by
// isValidConversationId at the route. Strip anything but safe chars as
// defense-in-depth so neither can contain "/" or ".." (prevents path traversal
// in the local-dev fs store, keeps GCS keys clean).
function safeWallet(wallet: string): string {
  return wallet.toLowerCase().replace(/[^a-z0-9x]/g, "");
}
function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "invalid";
}

function gcsPath(wallet: string, id: string): string {
  return `${PREFIX}/${safeWallet(wallet)}/conversations/${safeId(id)}.json`;
}
function gcsDir(wallet: string): string {
  return `${PREFIX}/${safeWallet(wallet)}/conversations/`;
}
function localDir(wallet: string): string {
  return path.join(LOCAL_DIR, safeWallet(wallet));
}
function localPath(wallet: string, id: string): string {
  return path.join(localDir(wallet), `${safeId(id)}.json`);
}

// Run async tasks with a concurrency cap. If any task rejects, the whole call
// rejects (so a transport failure surfaces as a 500 rather than a silent
// partial result).
async function mapWithConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (true) {
      const i = next++;
      if (i >= tasks.length) return;
      results[i] = await tasks[i]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function listConversations(wallet: string): Promise<StoredConversation[]> {
  let convos: (StoredConversation | null)[];
  if (USE_LOCAL) {
    const dir = localDir(wallet);
    let names: string[];
    try {
      names = (await fs.readdir(dir)).filter((n) => n.endsWith(".json"));
    } catch {
      names = [];
    }
    convos = await mapWithConcurrency(
      names.map((n) => async () => {
        try {
          return JSON.parse(await fs.readFile(path.join(dir, n), "utf8")) as StoredConversation;
        } catch {
          return null; // dev store — tolerate a stray/corrupt file
        }
      }),
      DOWNLOAD_CONCURRENCY,
    );
  } else {
    const [files] = await bucket!.getFiles({ prefix: gcsDir(wallet) });
    convos = await mapWithConcurrency(
      files.map((f) => async () => {
        // Download outside try: a transport error rejects the whole list (→ 500)
        // instead of silently dropping a conversation a sync client could then
        // mistake for a deletion. Only genuinely corrupt JSON is skipped.
        const [buf] = await f.download();
        try {
          return JSON.parse(buf.toString("utf8")) as StoredConversation;
        } catch {
          console.error(`[franklin-store] skipping corrupt object: ${f.name}`);
          return null;
        }
      }),
      DOWNLOAD_CONCURRENCY,
    );
  }
  return convos
    .filter((c): c is StoredConversation => !!c)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Lightweight conversation metadata — no message bodies in the response.
 *  NOTE: this still reads every conversation object from GCS server-side (it
 *  projects from listConversations); the saving is client bandwidth, not GCS
 *  reads. A per-wallet index object is the planned follow-up to make this a
 *  single read. */
export interface ConversationMeta {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export async function listConversationMeta(wallet: string): Promise<ConversationMeta[]> {
  const convos = await listConversations(wallet);
  return convos.map((c) => ({
    id: c.id,
    title: typeof c.title === "string" ? c.title : "",
    createdAt: typeof c.createdAt === "number" ? c.createdAt : 0,
    updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : 0,
    messageCount: Array.isArray(c.messages) ? c.messages.length : 0,
  }));
}

export async function getConversation(wallet: string, id: string): Promise<StoredConversation | null> {
  if (USE_LOCAL) {
    try {
      return JSON.parse(await fs.readFile(localPath(wallet, id), "utf8")) as StoredConversation;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e; // real read/parse error — let the route return 500, not 404
    }
  }
  // Single download (no exists() pre-check): a missing object throws a 404 we
  // translate to null; any other error (outage, corrupt JSON) propagates so the
  // route returns 500 instead of masquerading a store failure as "Not found".
  try {
    const [buf] = await bucket!.file(gcsPath(wallet, id)).download();
    return JSON.parse(buf.toString("utf8")) as StoredConversation;
  } catch (e) {
    if ((e as { code?: number }).code === 404) return null;
    throw e;
  }
}

// Validate role + content (the fields the server relies on) without rebuilding
// the message: extra fields (images[], music, activity, future shapes) are
// preserved as-is on the stored object.
function isValidMessage(m: unknown): m is StoredMessage {
  if (!m || typeof m !== "object") return false;
  const o = m as Record<string, unknown>;
  if (o.role !== "user" && o.role !== "assistant") return false;
  return typeof o.content === "string";
}

// Shape/size-validate a client-supplied conversation before persisting. Rejects
// malformed input (throws ValidationError) and stamps a server-authoritative
// updatedAt so a client-sent NaN/string can't poison the list sort comparator.
export function normalizeConversation(input: unknown, id: string): StoredConversation {
  if (!input || typeof input !== "object") throw new ValidationError("Body must be an object");
  const o = input as Record<string, unknown>;
  if (!Array.isArray(o.messages)) throw new ValidationError("messages must be an array");
  if (o.messages.length > MAX_MESSAGES) throw new ValidationError("Too many messages");
  for (const m of o.messages) {
    if (!isValidMessage(m)) throw new ValidationError("Invalid message shape");
  }
  const now = Date.now();
  const createdAt =
    typeof o.createdAt === "number" && Number.isFinite(o.createdAt) ? o.createdAt : now;
  return {
    id,
    title: typeof o.title === "string" ? o.title.slice(0, MAX_TITLE_LEN) : "New chat",
    createdAt,
    updatedAt: now,
    messages: o.messages as StoredMessage[],
  };
}

export async function saveConversation(wallet: string, convo: StoredConversation): Promise<void> {
  if (USE_LOCAL) {
    await fs.mkdir(localDir(wallet), { recursive: true });
    await fs.writeFile(localPath(wallet, convo.id), JSON.stringify(convo));
    return;
  }
  await bucket!.file(gcsPath(wallet, convo.id)).save(JSON.stringify(convo), {
    contentType: "application/json",
    resumable: false,
  });
}

export async function deleteConversation(wallet: string, id: string): Promise<void> {
  if (USE_LOCAL) {
    await fs.rm(localPath(wallet, id), { force: true });
    return;
  }
  await bucket!.file(gcsPath(wallet, id)).delete({ ignoreNotFound: true });
}
