import assert from "node:assert/strict";

const store = await import("../src/lib/team-store.ts");
const owner = "0x1111111111111111111111111111111111111111";
const member = "0x2222222222222222222222222222222222222222";
const viewer = "0x3333333333333333333333333333333333333333";

await store.clearLocalTeamStoreForTests();
try {
  const workspace = await store.createTeamWorkspace(owner, "Team Store Test");
  assert.equal(workspace.role, "owner");
  assert.equal(workspace.members.length, 1);

  const invite = await store.createTeamInvite(owner, workspace.id, "member");
  const joined = await store.joinTeamWorkspace(member, invite.code);
  assert.equal(joined.role, "member");
  assert.equal(joined.members.length, 2);
  assert.equal((await store.listTeamWorkspaces(member))[0]?.id, workspace.id);
  assert.equal((await store.updateTeamMemberRole(owner, workspace.id, member, "admin")).members.find((item) => item.userId === member)?.role, "admin");

  await store.appendTeamMessage(member, workspace.id, "user", "hello team");
  await store.appendTeamMessage(member, workspace.id, "assistant", "hello from Franklin");
  const messages = await store.listTeamMessages(owner, workspace.id);
  assert.equal(messages.length, 2);
  assert.match(messages[1].authorName, /^Franklin response · submitted by /);

  const concurrent = await Promise.all(
    Array.from({ length: 12 }, (_, index) => store.appendTeamMessage(member, workspace.id, "user", `concurrent-${index}`)),
  );
  assert.equal(new Set(concurrent.map((item) => item.version)).size, 12);
  assert.equal((await store.listTeamMessages(owner, workspace.id)).length, 14);

  await store.saveTeamFile(member, workspace.id, "plans/launch.md", "v1");
  const first = await store.readTeamFile(owner, workspace.id, "plans/launch.md");
  assert.equal(first.content, "v1");
  await store.saveTeamFile(owner, workspace.id, "plans/launch.md", "v2", 1);
  await assert.rejects(
    () => store.saveTeamFile(member, workspace.id, "plans/launch.md", "stale", 1),
    (error: unknown) => error instanceof store.TeamStoreError && error.status === 409,
  );
  await assert.rejects(
    () => store.saveTeamFile(member, workspace.id, "plans/launch.md", "blind overwrite"),
    (error: unknown) => error instanceof store.TeamStoreError && error.status === 409,
  );

  const retriedJoin = await store.joinTeamWorkspace(member, invite.code);
  assert.equal(retriedJoin.role, "admin");

  const viewerInvite = await store.createTeamInvite(owner, workspace.id, "viewer");
  await store.joinTeamWorkspace(viewer, viewerInvite.code);
  await assert.rejects(
    () => store.appendTeamMessage(viewer, workspace.id, "user", "not allowed"),
    (error: unknown) => error instanceof store.TeamStoreError && error.status === 403,
  );
  await assert.rejects(
    () => store.saveTeamFile(viewer, workspace.id, "viewer.md", "not allowed"),
    (error: unknown) => error instanceof store.TeamStoreError && error.status === 403,
  );

  console.log("team-store: owner/member/viewer, invite, chat, files, and conflicts passed");
} finally {
  await store.clearLocalTeamStoreForTests();
}
