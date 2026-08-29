const express = require("express");
const cors = require("cors");
const { Client } = require("@opensearch-project/opensearch");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  node: process.env.OPENSEARCH_URL || "http://opensearch:9200",
});

// 🔑 1. Login Endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token-admin",
      role: "Admin",
      username: "admin",
    });
  }

  if (username === "viewer" && password === "viewer123") {
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token-viewer",
      role: "Viewer",
      username: "viewer",
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid username or password",
  });
});

// 📋 2. Get All Logs ( Tenant Isolation)
app.get("/api/logs", async (req, res) => {
  const tenantId = req.query.tenant || "all";

  const filterConditions = [];
  // 🔒 ถ้าไม่ได้เลือก 'all' ให้กรองเฉพาะ tenant ที่ระบุ
  if (tenantId !== "all") {
    filterConditions.push({ term: { "tenant.keyword": tenantId } });
  }

  try {
    const result = await client.search({
      index: "logs-index",
      body: {
        query: {
          bool: {
            must: [{ match_all: {} }],
            filter: filterConditions,
          },
        },
        sort: [{ "@timestamp": { order: "desc" } }],
      },
    });
    res.json(result.body.hits.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚨 3. Get Critical Alerts ( Tenant Isolation)
app.get("/api/alerts", async (req, res) => {
  const tenantId = req.query.tenant || "all";

  const filterConditions = [];
  if (tenantId !== "all") {
    filterConditions.push({ term: { "tenant.keyword": tenantId } });
  }

  try {
    const result = await client.search({
      index: "logs-index",
      body: {
        query: {
          bool: {
            must: [{ range: { severity: { gte: 8 } } }],
            filter: filterConditions,
          },
        },
        sort: [{ "@timestamp": { order: "desc" } }],
      },
    });
    res.json(result.body.hits.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log("Backend running on port 8080"));

// 🧹 4. Retention Clean Endpoint (ลบ Log เก่าเกิน 7 วัน)
app.delete("/api/retention/clean", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const result = await client.deleteByQuery({
      index: "logs-index",
      body: {
        query: {
          range: {
            "@timestamp": {
              lt: sevenDaysAgo,
            },
          },
        },
      },
    });

    res.json({
      message: `Cleaned logs older than 7 days successfully (${result.body.deleted || 0} deleted)`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Login Endpoint (ปรับให้ตรงกับ Frontend)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token-admin",
      role: "Admin",
      username: "admin",
    });
  }

  if (username === "viewer" && password === "viewer123") {
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token-viewer",
      role: "Viewer",
      username: "viewer",
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid username or password",
  });
});
