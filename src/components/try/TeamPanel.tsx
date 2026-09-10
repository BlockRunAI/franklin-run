"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { useTryLang } from "@/lib/try-i18n";
import { ACCOUNT_COPY } from "@/lib/account-i18n";
import type { useAuth } from "@/hooks/use-auth";
interface Workspace { id: string; name: string; role: string; members: { userId: string; name: string; role: string }[] }
interface SharedFile { path: string; content: string; version: number }
interface Snapshot { workspace: Workspace; messages: { id: string; authorName: string; content: string }[]; files: SharedFile[] }
const COPY = {
  en: { login: "Sign in with a Base wallet to open shared workspaces.", create: "Create workspace", name: "Workspace name", join: "Join with invite", code: "Invite code", select: "Choose a workspace", invite: "Create member invite", refresh: "Refresh", message: "Message your team", send: "Send message", members: "Members", files: "Shared files", path: "File path", save: "Save file", newFile: "New file", note: "Shared messages and files sync with the desktop Team workspace. Agent execution runs in the desktop app.", editor: "File contents", inviteNote: "Single-use invite · share it with your teammate", signin: "Sign in with wallet", viewer: "View-only access", empty: "No shared messages yet.", loading: "Loading…" },
  zh: { login: "用 Base 钱包签名登录后，即可打开团队工作区。", create: "创建工作区", name: "工作区名称", join: "通过邀请加入", code: "邀请码", select: "选择工作区", invite: "创建成员邀请", refresh: "刷新", message: "给团队留言", send: "发送留言", members: "成员", files: "共享文件", path: "文件路径", save: "保存文件", newFile: "新建文件", note: "消息和文件与桌面版 Team 工作区同步。Agent 任务在桌面应用中执行。", editor: "文件内容", inviteNote: "一次性邀请码 · 可分享给团队成员", signin: "钱包签名登录", viewer: "只读权限", empty: "还没有共享留言。", loading: "加载中…" },
  es: { login: "Firma con una billetera de Base para abrir espacios compartidos.", create: "Crear espacio", name: "Nombre del espacio", join: "Unirse con invitación", code: "Código de invitación", select: "Elige un espacio", invite: "Crear invitación", refresh: "Actualizar", message: "Mensaje al equipo", send: "Enviar mensaje", members: "Miembros", files: "Archivos compartidos", path: "Ruta del archivo", save: "Guardar archivo", newFile: "Nuevo archivo", note: "Los mensajes y archivos se sincronizan con Team en escritorio. El agente se ejecuta en la app de escritorio.", editor: "Contenido del archivo", inviteNote: "Invitación de un solo uso · compártela con tu equipo", signin: "Firmar con billetera", viewer: "Solo lectura", empty: "Aún no hay mensajes compartidos.", loading: "Cargando…" },
};
async function command<T>(body: Record<string, unknown>): Promise<T> {
  const r = await fetch("/api/try/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
  return d as T;
}
export function TeamPanel({ auth }: { auth: ReturnType<typeof useAuth> }) {
  // A new authenticated identity remounts the workspace and clears drafts.
  return <TeamWorkspace key={auth.address || "guest"} auth={auth} />;
}
function TeamWorkspace({ auth }: { auth: ReturnType<typeof useAuth> }) {
  const { lang } = useTryLang(); const L = COPY[lang];
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [id, setId] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [name, setName] = useState(""); const [code, setCode] = useState("");
  const [message, setMessage] = useState(""); const [invite, setInvite] = useState("");
  const [file, setFile] = useState<SharedFile>({ path: "", content: "", version: 0 });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const active = useRef(id);
  useEffect(() => { active.current = id; }, [id]);
  const refresh = useCallback(async () => {
    const selected = active.current;
    const list = await command<{ workspaces: Workspace[] }>({ action: "workspace.list" });
    setWorkspaces(list.workspaces);
    if (selected) {
      const data = await command<Snapshot>({ action: "workspace.snapshot", workspaceId: selected });
      if (active.current === selected) setSnapshot(data);
    }
  }, []);
  useEffect(() => {
    if (!auth.address || auth.chain !== "evm") return;
    let disposed = false;
    const update = () => { if (!disposed) void refresh().catch(e => { if (!disposed) setError(e.message); }); };
    update(); const timer = setInterval(update, 15_000);
    return () => { disposed = true; clearInterval(timer); };
  }, [auth.address, auth.chain, id, refresh]);
  const run = async (task: () => Promise<void>) => {
    setBusy(true); setError("");
    try { await task(); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); } finally { setBusy(false); }
  };
  const select = (value: string) => { active.current = value; setId(value); setSnapshot(null); setMessage(""); setFile({ path: "", content: "", version: 0 }); setInvite(""); setError(""); };
  const viewer = snapshot?.workspace.role === "viewer";
  const canInvite = snapshot && ["owner", "admin"].includes(snapshot.workspace.role);
  return <div className="try-tools-panel"><div className="try-tools-inner try-team-panel">
    <div className="try-cli-badge"><Users size={18} />{ACCOUNT_COPY[lang].team}</div>
    <h2 className="try-tools-h">{ACCOUNT_COPY[lang].team}</h2><p className="try-tools-sub">{L.note}</p>
    {(!auth.address || auth.chain !== "evm") ? <><p>{L.login}</p><button className="btn-primary" onClick={auth.signIn} disabled={auth.signingIn}>{L.signin}</button>{auth.error && <p role="alert">{auth.error}</p>}</> : <>
      <div className="try-team-setup">
        <form onSubmit={e => { e.preventDefault(); void run(async () => { const d = await command<{ workspace: Workspace }>({ action: "workspace.create", name }); select(d.workspace.id); setName(""); }); }}><label>{L.name}<input disabled={busy} required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></label><button disabled={busy}>{L.create}</button></form>
        <form onSubmit={e => { e.preventDefault(); void run(async () => { const d = await command<{ workspace: Workspace }>({ action: "workspace.join", code }); select(d.workspace.id); setCode(""); }); }}><label>{L.code}<input disabled={busy} required value={code} onChange={e => setCode(e.target.value)} /></label><button disabled={busy}>{L.join}</button></form>
      </div>
      <label>{L.select}<select value={id} onChange={e => select(e.target.value)} disabled={busy}><option value="">{L.select}</option>{workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
      <button onClick={() => void run(refresh)} disabled={busy}>{L.refresh}</button>
      {error && <p role="alert">{error}</p>}
      {id && !snapshot && <p>{L.loading}</p>}
      {snapshot && <>
        <h3>{L.members}</h3><div className="try-team-members">{snapshot.workspace.members.map(m => <span key={m.userId}>{m.name} · {m.role}</span>)}</div>
        {canInvite && <button disabled={busy} onClick={() => void run(async () => { const d = await command<{ invite: { code: string } }>({ action: "workspace.invite", workspaceId: id }); setInvite(d.invite.code); })}>{L.invite}</button>}
        {invite && <p>{L.inviteNote}<br /><code>{invite}</code></p>}
        <section className="try-team-messages" aria-label={L.message}>{snapshot.messages.length === 0 && <p>{L.empty}</p>}{snapshot.messages.map(m => <article key={m.id}><strong>{m.authorName}</strong><p>{m.content}</p></article>)}</section>
        {viewer ? <p>{L.viewer}</p> : <form onSubmit={e => { e.preventDefault(); void run(async () => { await command({ action: "message.append", workspaceId: id, role: "user", content: message }); setMessage(""); }); }}><label>{L.message}<textarea disabled={busy} required maxLength={100000} value={message} onChange={e => setMessage(e.target.value)} /></label><button disabled={busy}>{L.send}</button></form>}
        <h3>{L.files}</h3><div className="try-team-members">{snapshot.files.map(f => <button disabled={busy} key={f.path} onClick={() => setFile({ ...f })}>{f.path} · v{f.version}</button>)}{!viewer && <button disabled={busy} onClick={() => setFile({ path: "", content: "", version: 0 })}>{L.newFile}</button>}</div>
        <form onSubmit={e => { e.preventDefault(); void run(async () => { await command({ action: "file.save", workspaceId: id, path: file.path, content: file.content, ...(file.version ? { expectedVersion: file.version } : {}) }); setFile(f => ({ ...f, version: f.version + 1 })); }); }}>
          <label>{L.path}<input disabled={busy} required value={file.path} readOnly={viewer || file.version > 0} onChange={e => setFile(f => ({ ...f, path: e.target.value }))} /></label>
          <label>{L.editor}<textarea disabled={busy} rows={10} value={file.content} readOnly={viewer} onChange={e => setFile(f => ({ ...f, content: e.target.value }))} /></label>
          {!viewer && <button disabled={busy || !file.path}>{L.save}</button>}
        </form>
      </>}
    </>}
  </div></div>;
}
