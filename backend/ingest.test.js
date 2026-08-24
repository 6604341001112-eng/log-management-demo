const test = require("node:test");
const assert = require("node:assert");
const { normalizeLog } = require("./normalizer");

test("JSON Log Normalization", () => {
  const rawJson = { tenant: "tenantA", source: "api", event_type: "login", user: "alice", ip: "1.2.3.4" };
  const normJson = normalizeLog(rawJson);
  assert.strictEqual(normJson.tenant, "tenantA");
  assert.strictEqual(normJson.user, "alice");
  assert.strictEqual(normJson.src_ip, "1.2.3.4");
});

test("Syslog Normalization", () => {
  const rawSyslog = "<34>1 2026-08-24T15:00:00Z firewall action=deny src=10.0.0.1 user=bob";
  const normSyslog = normalizeLog(rawSyslog);
  assert.strictEqual(normSyslog.action, "deny");
  assert.strictEqual(normSyslog.src_ip, "10.0.0.1");
  assert.strictEqual(normSyslog.user, "bob");
});
