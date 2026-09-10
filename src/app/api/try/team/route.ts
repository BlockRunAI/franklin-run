import { accountOriginAllowed } from "@/lib/blockrun-account";
import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { jsonPrivate, notSignedIn } from "@/lib/api-response";
import { readBoundedJson, RequestBodyError } from "@/lib/request-body";
import {
  TeamStoreError,
  appendTeamMessage,
  createTeamInvite,
  createTeamWorkspace,
  getTeamWorkspace,
  getTeamSnapshot,
  joinTeamWorkspace,
  listTeamFiles,
  listTeamMessages,
  listTeamWorkspaces,
  readTeamFile,
  saveTeamFile,
  updateTeamMemberRole,
} from "@/lib/team-store";

type ActionBody = {
  action?: string;
  workspaceId?: string;
  name?: string;
  code?: string;
  role?: "user" | "assistant" | "admin" | "member" | "viewer";
  content?: string;
  path?: string;
  expectedVersion?: number;
  targetWallet?: string;
};

function errorResponse(error: unknown) {
  if (error instanceof TeamStoreError) return jsonPrivate({ error: error.message }, { status: error.status });
  console.error("[api/try/team] store error:", error);
  return jsonPrivate({ error: "Team store error" }, { status: 500 });
}

// One authenticated command endpoint keeps the local Franklin proxy small.
// The wallet identity always comes from the verified SIWE session cookie.
export async function POST(req: NextRequest) {
  // Native desktop proxies send the verified session without browser origin
  // headers. Browser requests must be same-origin and all clients send JSON.
  if ((req.headers.has("origin") || req.headers.has("sec-fetch-site")) && !accountOriginAllowed(req)) return jsonPrivate({ error: "Invalid origin" }, { status: 403 });
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return jsonPrivate({ error: "Content-Type must be application/json" }, { status: 415 });
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return notSignedIn();
  if (session.chain !== "evm") return jsonPrivate({ error: "Team workspaces currently require a Base wallet sign-in." }, { status: 400 });
  const wallet = session.address;

  let body: ActionBody;
  try {
    const raw = await readBoundedJson(req, 1024 * 1024);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return jsonPrivate({ error: "Bad request" }, { status: 400 });
    body = raw as ActionBody;
  } catch (error) {
    if (error instanceof RequestBodyError) return jsonPrivate({ error: error.message }, { status: error.status });
    return jsonPrivate({ error: "Bad request" }, { status: 400 });
  }
  if (body.expectedVersion !== undefined && (!Number.isSafeInteger(body.expectedVersion) || body.expectedVersion < 1)) {
    return jsonPrivate({ error: "Invalid expectedVersion" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "workspace.list":
        return jsonPrivate({ workspaces: await listTeamWorkspaces(wallet), wallet });
      case "workspace.create":
        return jsonPrivate({ workspace: await createTeamWorkspace(wallet, String(body.name || "")) }, { status: 201 });
      case "workspace.get":
        return jsonPrivate({ workspace: await getTeamWorkspace(wallet, String(body.workspaceId || "")) });
      case "workspace.snapshot":
        return jsonPrivate(await getTeamSnapshot(wallet, String(body.workspaceId || "")));
      case "workspace.invite":
        return jsonPrivate({ invite: await createTeamInvite(wallet, String(body.workspaceId || ""), body.role === "viewer" ? "viewer" : "member") }, { status: 201 });
      case "workspace.join":
        return jsonPrivate({ workspace: await joinTeamWorkspace(wallet, String(body.code || "")) });
      case "member.role":
        return jsonPrivate({ workspace: await updateTeamMemberRole(wallet, String(body.workspaceId || ""), String(body.targetWallet || ""), body.role === "admin" || body.role === "viewer" ? body.role : "member") });
      case "message.list":
        return jsonPrivate({ messages: await listTeamMessages(wallet, String(body.workspaceId || "")) });
      case "message.append":
        return jsonPrivate(await appendTeamMessage(wallet, String(body.workspaceId || ""), body.role === "assistant" ? "assistant" : "user", String(body.content || "")), { status: 201 });
      case "file.list":
        return jsonPrivate(await listTeamFiles(wallet, String(body.workspaceId || "")));
      case "file.read":
        return jsonPrivate(await readTeamFile(wallet, String(body.workspaceId || ""), String(body.path || "")));
      case "file.save":
        return jsonPrivate(await saveTeamFile(wallet, String(body.workspaceId || ""), String(body.path || ""), String(body.content ?? ""), body.expectedVersion));
      default:
        return jsonPrivate({ error: "Unknown team action" }, { status: 400 });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
