import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const BUCKET = process.env.GCS_MEDIA_BUCKET || process.env.GCS_LOG_BUCKET || "blockrun-prod-2026-logs";
const PREFIX = "franklin-team";
const USE_LOCAL =
  process.env.FRANKLIN_STORE_LOCAL === "1" ||
  (!process.env.K_SERVICE && process.env.NODE_ENV !== "production" && !process.env.GOOGLE_APPLICATION_CREDENTIALS);
const LOCAL_DIR = path.join(process.cwd(), ".franklin-store", "team");
let bucketPromise: Promise<import("@google-cloud/storage").Bucket> | null = null;
const localWriteLocks = new Map<string, Promise<void>>();

function getBucket() {
  if (!bucketPromise) bucketPromise = import("@google-cloud/storage").then(({ Storage }) => new Storage().bucket(BUCKET));
  return bucketPromise;
}

export type TeamRole = "owner" | "admin" | "member" | "viewer";

export interface TeamMember {
  wallet: string;
  name: string;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamMessage {
  id: string;
  role: "user" | "assistant";
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TeamFile {
  path: string;
  content: string;
  bytes: number;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface TeamWorkspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  members: TeamMember[];
  messages: TeamMessage[];
  files: TeamFile[];
}

interface InviteRecord {
  codeHash: string;
  workspaceId: string;
  role: "member" | "viewer";
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
  usedAt?: string;
}

interface Document<T> {
  value: T;
  generation: string | number;
}

export class TeamStoreError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}_${crypto.randomBytes(10).toString("hex")}`;

function safeWallet(wallet: string): string {
  const normalized = wallet.toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(normalized)) throw new TeamStoreError(400, "Invalid wallet address");
  return normalized;
}

function safeId(id: string): string {
  const value = id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  if (!value || value !== id) throw new TeamStoreError(400, "Invalid identifier");
  return value;
}

function safeRelative(input: string): string {
  const value = path.posix.normalize(input.trim().replaceAll("\\", "/")).replace(/^\/+/, "");
  if (!value || value === "." || value.startsWith("../") || value.includes("/../") || value.length > 240) {
    throw new TeamStoreError(400, "Invalid workspace file path");
  }
  return value;
}

function walletLabel(wallet: string): string {
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
}

function workspaceKey(id: string): string {
  return `${PREFIX}/workspaces/${safeId(id)}.json`;
}

function walletRefKey(wallet: string, workspaceId: string): string {
  return `${PREFIX}/wallets/${safeWallet(wallet)}/workspaces/${safeId(workspaceId)}.json`;
}

function walletRefPrefix(wallet: string): string {
  return `${PREFIX}/wallets/${safeWallet(wallet)}/workspaces/`;
}

function inviteKey(codeHash: string): string {
  return `${PREFIX}/invites/${codeHash}.json`;
}

function localPath(key: string): string {
  return path.join(LOCAL_DIR, ...key.replace(`${PREFIX}/`, "").split("/"));
}

async function readDocument<T>(key: string): Promise<Document<T> | null> {
  try {
    if (USE_LOCAL) {
      const file = localPath(key);
      const stat = await fs.stat(file);
      return { value: JSON.parse(await fs.readFile(file, "utf8")) as T, generation: stat.mtimeMs };
    }
    const file = (await getBucket()).file(key);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [[buffer], [metadata]] = await Promise.all([file.download(), file.getMetadata()]);
    return { value: JSON.parse(buffer.toString("utf8")) as T, generation: metadata.generation || "0" };
  } catch (error) {
    if ((error as { code?: number }).code === 404) return null;
    throw error;
  }
}

async function withLocalWriteLock<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = localWriteLocks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => gate);
  localWriteLocks.set(key, queued);
  await previous;
  try { return await operation(); }
  finally {
    release();
    if (localWriteLocks.get(key) === queued) localWriteLocks.delete(key);
  }
}

function preconditionFailed(): Error & { code: number } {
  return Object.assign(new Error("Document changed concurrently"), { code: 412 });
}

async function writeDocument<T>(key: string, value: T, generation?: string | number): Promise<void> {
  const body = JSON.stringify(value);
  if (Buffer.byteLength(body) > 4_000_000) throw new TeamStoreError(413, "Workspace exceeds the 4 MB preview limit");
  if (USE_LOCAL) {
    await withLocalWriteLock(key, async () => {
      const file = localPath(key);
      await fs.mkdir(path.dirname(file), { recursive: true });
      if (generation === 0) {
        try { await fs.writeFile(file, body, { flag: "wx" }); }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === "EEXIST") throw preconditionFailed();
          throw error;
        }
        return;
      }
      if (generation !== undefined) {
        let actual: number;
        try { actual = (await fs.stat(file)).mtimeMs; }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") throw preconditionFailed();
          throw error;
        }
        if (actual !== Number(generation)) throw preconditionFailed();
      }
      const tmp = `${file}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
      try {
        await fs.writeFile(tmp, body, { flag: "wx" });
        await fs.rename(tmp, file);
      } finally {
        await fs.rm(tmp, { force: true }).catch(() => undefined);
      }
    });
    return;
  }
  await (await getBucket()).file(key).save(body, {
    contentType: "application/json",
    resumable: false,
    preconditionOpts: { ifGenerationMatch: generation ?? 0 },
  });
}

async function listKeys(prefix: string): Promise<string[]> {
  if (USE_LOCAL) {
    const dir = localPath(prefix);
    try { return (await fs.readdir(dir)).filter((name) => name.endsWith(".json")).map((name) => `${prefix}${name}`); }
    catch { return []; }
  }
  const [files] = await (await getBucket()).getFiles({ prefix });
  return files.map((file) => file.name);
}

async function loadWorkspace(id: string): Promise<Document<TeamWorkspace>> {
  const doc = await readDocument<TeamWorkspace>(workspaceKey(id));
  if (!doc) throw new TeamStoreError(404, "Workspace not found");
  return doc;
}

function requireMember(workspace: TeamWorkspace, wallet: string): TeamMember {
  const member = workspace.members.find((item) => item.wallet === safeWallet(wallet));
  if (!member) throw new TeamStoreError(403, "You are not a member of this workspace");
  return member;
}

async function mutateWorkspaceUnlocked<T>(id: string, mutate: (workspace: TeamWorkspace) => T): Promise<{ workspace: TeamWorkspace; result: T }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = await loadWorkspace(id);
    const workspace = structuredClone(doc.value);
    const result = mutate(workspace);
    workspace.version += 1;
    workspace.updatedAt = now();
    try {
      await writeDocument(workspaceKey(id), workspace, doc.generation);
      return { workspace, result };
    } catch (error) {
      if ((error as { code?: number }).code !== 412 || attempt === 4) throw error;
    }
  }
  throw new TeamStoreError(409, "Workspace changed concurrently; retry the request");
}

async function mutateWorkspace<T>(id: string, mutate: (workspace: TeamWorkspace) => T): Promise<{ workspace: TeamWorkspace; result: T }> {
  if (USE_LOCAL) return withLocalWriteLock(`mutation:${safeId(id)}`, () => mutateWorkspaceUnlocked(id, mutate));
  return mutateWorkspaceUnlocked(id, mutate);
}

export function publicWorkspace(workspace: TeamWorkspace, wallet: string) {
  const member = requireMember(workspace, wallet);
  return {
    id: workspace.id,
    name: workspace.name,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
    version: workspace.version,
    runtime: "member-franklin",
    role: member.role,
    members: workspace.members.map((item) => ({ userId: item.wallet, name: item.name, role: item.role, joinedAt: item.joinedAt })),
  };
}

export async function listTeamWorkspaces(wallet: string) {
  const normalized = safeWallet(wallet);
  const keys = await listKeys(walletRefPrefix(normalized));
  const values = await Promise.all(keys.map(async (key) => {
    const ref = await readDocument<{ workspaceId: string }>(key);
    if (!ref) return null;
    try { return publicWorkspace((await loadWorkspace(ref.value.workspaceId)).value, normalized); }
    catch { return null; }
  }));
  return values.filter((value): value is NonNullable<typeof value> => value !== null);
}

export async function createTeamWorkspace(wallet: string, name: string) {
  const normalized = safeWallet(wallet);
  const cleanName = name.trim().slice(0, 100);
  if (!cleanName) throw new TeamStoreError(400, "Workspace name is required");
  const timestamp = now();
  const workspace: TeamWorkspace = {
    id: makeId("tw"), name: cleanName, createdBy: normalized, createdAt: timestamp, updatedAt: timestamp, version: 1,
    members: [{ wallet: normalized, name: walletLabel(normalized), role: "owner", joinedAt: timestamp }],
    messages: [],
    files: [{ path: "README.md", content: `# ${cleanName}\n\nShared Franklin Team workspace.\n`, bytes: Buffer.byteLength(`# ${cleanName}\n\nShared Franklin Team workspace.\n`), version: 1, updatedAt: timestamp, updatedBy: normalized }],
  };
  await writeDocument(workspaceKey(workspace.id), workspace, 0);
  await writeDocument(walletRefKey(normalized, workspace.id), { workspaceId: workspace.id, joinedAt: timestamp }, 0);
  return publicWorkspace(workspace, normalized);
}

export async function getTeamWorkspace(wallet: string, id: string) {
  return publicWorkspace((await loadWorkspace(id)).value, wallet);
}

export async function getTeamSnapshot(wallet: string, id: string) {
  const workspace = (await loadWorkspace(id)).value;
  requireMember(workspace, wallet);
  return {
    workspace: publicWorkspace(workspace, wallet),
    messages: workspace.messages,
    files: workspace.files,
  };
}

export async function createTeamInvite(wallet: string, id: string, role: "member" | "viewer" = "member") {
  const normalized = safeWallet(wallet);
  const workspace = (await loadWorkspace(id)).value;
  const member = requireMember(workspace, normalized);
  if (member.role !== "owner" && member.role !== "admin") throw new TeamStoreError(403, "Only owners and admins can invite members");
  const code = `FW-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  const record: InviteRecord = {
    codeHash: crypto.createHash("sha256").update(code).digest("hex"), workspaceId: workspace.id, role,
    createdBy: normalized, createdAt: now(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  await writeDocument(inviteKey(record.codeHash), record, 0);
  return { code, role, expiresAt: record.expiresAt };
}

export async function joinTeamWorkspace(wallet: string, code: string) {
  const normalized = safeWallet(wallet);
  const normalizedCode = code.trim().toUpperCase();
  if (!/^FW-[0-9A-F]{12}$/.test(normalizedCode)) throw new TeamStoreError(404, "Invite is invalid, used, or expired");
  const codeHash = crypto.createHash("sha256").update(normalizedCode).digest("hex");
  const inviteDoc = await readDocument<InviteRecord>(inviteKey(codeHash));
  if (!inviteDoc || (inviteDoc.value.usedBy && inviteDoc.value.usedBy !== normalized) || Date.parse(inviteDoc.value.expiresAt) <= Date.now()) {
    throw new TeamStoreError(404, "Invite is invalid, used, or expired");
  }
  await loadWorkspace(inviteDoc.value.workspaceId);
  const claimed = inviteDoc.value.usedBy
    ? inviteDoc.value
    : { ...inviteDoc.value, usedBy: normalized, usedAt: now() };
  if (!inviteDoc.value.usedBy) {
    try { await writeDocument(inviteKey(codeHash), claimed, inviteDoc.generation); }
    catch (error) {
      if ((error as { code?: number }).code === 412) throw new TeamStoreError(409, "Invite was already used");
      throw error;
    }
  }
  const { workspace } = await mutateWorkspace(claimed.workspaceId, (draft) => {
    if (!draft.members.some((member) => member.wallet === normalized)) {
      draft.members.push({ wallet: normalized, name: walletLabel(normalized), role: claimed.role, joinedAt: now() });
    }
  });
  try {
    await writeDocument(walletRefKey(normalized, workspace.id), { workspaceId: workspace.id, joinedAt: now() }, 0);
  } catch (error) {
    if ((error as { code?: number }).code !== 412) throw error;
    const existing = await readDocument<{ workspaceId: string }>(walletRefKey(normalized, workspace.id));
    if (existing?.value.workspaceId !== workspace.id) throw error;
  }
  return publicWorkspace(workspace, normalized);
}

export async function updateTeamMemberRole(wallet: string, id: string, targetWallet: string, role: "admin" | "member" | "viewer") {
  const normalized = safeWallet(wallet);
  const target = safeWallet(targetWallet);
  const { workspace } = await mutateWorkspace(id, (draft) => {
    const actor = requireMember(draft, normalized);
    if (actor.role !== "owner") throw new TeamStoreError(403, "Only the workspace owner can change roles");
    const member = requireMember(draft, target);
    if (member.role === "owner") throw new TeamStoreError(400, "The workspace owner role cannot be changed");
    member.role = role;
  });
  return publicWorkspace(workspace, normalized);
}

export async function listTeamMessages(wallet: string, id: string) {
  const workspace = (await loadWorkspace(id)).value;
  requireMember(workspace, wallet);
  return workspace.messages;
}

export async function appendTeamMessage(wallet: string, id: string, role: "user" | "assistant", content: string) {
  const normalized = safeWallet(wallet);
  const clean = content.trim().slice(0, 40_000);
  if (!clean) throw new TeamStoreError(400, "Message is required");
  const { workspace, result } = await mutateWorkspace(id, (draft) => {
    const member = requireMember(draft, normalized);
    if (member.role === "viewer") throw new TeamStoreError(403, "Viewers cannot send messages");
    const message: TeamMessage = {
      id: makeId("tm"), role, authorId: normalized,
      authorName: role === "assistant" ? `Franklin response · submitted by ${member.name}` : member.name, content: clean, createdAt: now(),
    };
    draft.messages.push(message);
    if (draft.messages.length > 500) draft.messages.splice(0, draft.messages.length - 500);
    return message;
  });
  return { message: result, version: workspace.version };
}

export async function listTeamFiles(wallet: string, id: string) {
  const workspace = (await loadWorkspace(id)).value;
  requireMember(workspace, wallet);
  return {
    files: workspace.files.map((file) => ({
      path: file.path,
      bytes: file.bytes,
      version: file.version,
      updatedAt: file.updatedAt,
      updatedBy: file.updatedBy,
    })),
    version: workspace.version,
  };
}

export async function readTeamFile(wallet: string, id: string, filePath: string) {
  const workspace = (await loadWorkspace(id)).value;
  requireMember(workspace, wallet);
  const cleanPath = safeRelative(filePath);
  const file = workspace.files.find((item) => item.path === cleanPath);
  if (!file) throw new TeamStoreError(404, "File not found");
  return { path: file.path, content: file.content, bytes: file.bytes, version: workspace.version };
}

export async function saveTeamFile(wallet: string, id: string, filePath: string, content: string, expectedVersion?: number) {
  const normalized = safeWallet(wallet);
  const cleanPath = safeRelative(filePath);
  if (Buffer.byteLength(content) > 500_000) throw new TeamStoreError(413, "File exceeds the 500 KB limit");
  const { workspace } = await mutateWorkspace(id, (draft) => {
    const member = requireMember(draft, normalized);
    if (member.role === "viewer") throw new TeamStoreError(403, "Viewers cannot edit files");
    const existing = draft.files.find((item) => item.path === cleanPath);
    if (existing && expectedVersion === undefined) {
      throw new TeamStoreError(409, "File version is required when overwriting an existing file");
    }
    if (expectedVersion !== undefined && existing && existing.version !== expectedVersion) {
      throw new TeamStoreError(409, "File changed since it was opened");
    }
    const next: TeamFile = {
      path: cleanPath, content, bytes: Buffer.byteLength(content), version: (existing?.version || 0) + 1,
      updatedAt: now(), updatedBy: normalized,
    };
    if (existing) Object.assign(existing, next);
    else draft.files.push(next);
  });
  return { ok: true, version: workspace.version };
}

export async function clearLocalTeamStoreForTests(): Promise<void> {
  if (USE_LOCAL) await fs.rm(LOCAL_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
}
