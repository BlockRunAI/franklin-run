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
const USE_LOCAL =
  process.env.FRANKLIN_STORE_LOCAL === "1" ||
  (process.env.NODE_ENV !== "production" && !process.env.GOOGLE_APPLICATION_CREDENTIALS);
const LOCAL_DIR = path.join(process.cwd(), ".franklin-store");

const storage = USE_LOCAL ? null : new Storage();
const bucket = storage?.bucket(BUCKET);

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  kind?: "text" | "image" | "video";
  image?: string;
  video?: string;
  reasoning?: string;
}

export interface StoredConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
}

// Hard whitelist — wallet is a verified address, id is a client-supplied
// conversation id. Strip anything but hex/safe chars so neither can contain
// "/" or ".." (prevents path traversal in the local-dev fs store, keeps GCS
// keys clean).
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
    convos = await Promise.all(
      names.map(async (n) => {
        try {
          return JSON.parse(await fs.readFile(path.join(dir, n), "utf8")) as StoredConversation;
        } catch {
          return null;
        }
      }),
    );
  } else {
    const [files] = await bucket!.getFiles({ prefix: gcsDir(wallet) });
    convos = await Promise.all(
      files.map(async (f) => {
        try {
          const [buf] = await f.download();
          return JSON.parse(buf.toString("utf8")) as StoredConversation;
        } catch {
          return null;
        }
      }),
    );
  }
  return convos
    .filter((c): c is StoredConversation => !!c)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getConversation(wallet: string, id: string): Promise<StoredConversation | null> {
  try {
    if (USE_LOCAL) {
      return JSON.parse(await fs.readFile(localPath(wallet, id), "utf8")) as StoredConversation;
    }
    const file = bucket!.file(gcsPath(wallet, id));
    const [exists] = await file.exists();
    if (!exists) return null;
    const [buf] = await file.download();
    return JSON.parse(buf.toString("utf8")) as StoredConversation;
  } catch {
    return null;
  }
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
