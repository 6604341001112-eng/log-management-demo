const test = require("node:test");
const assert = require("node:assert");
const { app } = require("./server");

async function request(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:8080${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch (err) {}

  return { response, data };
}

test("POST /api/login succeeds with valid credentials", async () => {
  const { response, data } = await request("/api/login", {
    method: "POST",
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });

  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.role, "Admin");
  assert.ok(data.token);
});

test("DELETE /api/retention/clean returns success", async () => {
  const { response, data } = await request("/api/retention/clean", {
    method: "DELETE",
    headers: { Authorization: "Bearer demo-token" },
  });

  assert.strictEqual(response.status, 200);
  assert.strictEqual(data.success, true);
  assert.ok(data.message);
});
