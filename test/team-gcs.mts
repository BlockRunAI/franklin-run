import assert from "node:assert/strict";
import { mock } from "node:test";

// Exercise the production GCS branch with a generation-aware bucket. No cloud
// credentials or network access are used by this test.
process.env.FRANKLIN_STORE_LOCAL = "0";
process.env.K_SERVICE = "team-gcs-test";
type Revision = { generation: string; body: string };
const documents = new Map<string, Revision>();
let revision = 0;
let interleave = "";
let discardOld = false;
let alwaysConflict = false;
function concurrentWrite(key: string) {
  const current = documents.get(key)!;
  const workspace = JSON.parse(current.body);
  workspace.messages.push({ id: "external", role: "user", content: "teammate update" });
  workspace.version++;
  documents.set(key, { generation: String(++revision), body: JSON.stringify(workspace) });
}
const bucket = {
  file(key: string, options?: { generation?: string | number }) {
    return {
      async exists() { return [documents.has(key)]; },
      async getMetadata() {
        const current = documents.get(key);
        if (!current) throw Object.assign(new Error("missing"), { code: 404 });
        return [{ generation: current.generation }];
      },
      async download() {
        const current = documents.get(key)!;
        if (interleave === key) {
          interleave = "";
          concurrentWrite(key);
          if (discardOld && options?.generation) throw Object.assign(new Error("old generation discarded"), { code: 404 });
        }
        return [Buffer.from(current.body)];
      },
      async save(body: string, opts: { preconditionOpts: { ifGenerationMatch: string | number } }) {
        const expected = String(opts.preconditionOpts.ifGenerationMatch);
        if (alwaysConflict || expected !== (documents.get(key)?.generation ?? "0")) {
          throw Object.assign(new Error("precondition failed"), { code: 412 });
        }
        documents.set(key, { generation: String(++revision), body });
      },
    };
  },
};
mock.module("@google-cloud/storage", { namedExports: { Storage: class { bucket() { return bucket; } } } });
const store = await import("../src/lib/team-store.ts");
const owner = "0x1111111111111111111111111111111111111111";
for (const discard of [false, true]) {
  discardOld = discard;
  const workspace = await store.createTeamWorkspace(owner, "Concurrent team");
  interleave = `franklin-team/workspaces/${workspace.id}.json`;
  await store.appendTeamMessage(owner, workspace.id, "user", "my update");
  const messages = await store.listTeamMessages(owner, workspace.id);
  assert.deepEqual(messages.map(m => m.content), ["teammate update", "my update"],
    `concurrent update must survive (${discard ? "non-versioned" : "versioned"} bucket)`);
  alwaysConflict = true;
  await assert.rejects(() => store.appendTeamMessage(owner, workspace.id, "user", "conflicting"),
    (error: unknown) => error instanceof store.TeamStoreError && error.status === 409);
  alwaysConflict = false;
}
console.log("team GCS: concurrent updates preserved, discarded generations retried, conflicts return 409");
