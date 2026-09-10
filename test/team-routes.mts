import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/try/team/route.ts";
import { createSessionToken, SESSION_COOKIE } from "../src/lib/session.ts";
import { clearLocalTeamStoreForTests } from "../src/lib/team-store.ts";
process.env.SESSION_SECRET = "team-route-test-secret-at-least-32-bytes";
const token = createSessionToken("evm", "0x1111111111111111111111111111111111111111");
const request = (body: object, headers: Record<string, string> = {}) => new NextRequest("https://franklin.run/api/try/team", { method: "POST", headers: { "content-type": "application/json", cookie: `${SESSION_COOKIE}=${token}`, ...headers }, body: JSON.stringify(body) });
await clearLocalTeamStoreForTests();
try {
  const created = await POST(request({ action: "workspace.create", name: "Native desktop test" }));
  assert.equal(created.status, 201, "native desktop sends no Origin header");
  const { workspace } = await created.json();
  const web = await POST(request({ action: "workspace.snapshot", workspaceId: workspace.id }, { origin: "https://franklin.run" }));
  assert.equal(web.status, 200);
  assert.equal((await web.json()).workspace.name, "Native desktop test");
  assert.equal((await POST(request({ action: "workspace.list" }, { origin: "https://evil.example" }))).status, 403);
  assert.equal((await POST(request({ action: "workspace.list" }, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await POST(request({ action: "workspace.list" }, { cookie: "" }))).status, 401);
  console.log("team routes: native desktop/browser interoperability, origin rejection, JSON enforcement and authentication passed");
} finally { await clearLocalTeamStoreForTests(); }
