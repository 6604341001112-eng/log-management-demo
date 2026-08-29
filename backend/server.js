const express = require('express');
const { Client } = require('@opensearch-project/opensearch');

const app = express();
app.use(express.json());

const client = new Client({ node: process.env.OPENSEARCH_NODE || 'http://opensearch:9200' });

// 1. API Login (แมพข้อมูลตามที่ frontend index.html รอรับ)
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (username === 'admin') {
    res.json({ success: true, token: 'mock-admin-token', role: 'Admin', username: 'admin' });
  } else if (username === 'viewer') {
    res.json({ success: true, token: 'mock-viewer-token', role: 'Viewer', username: 'viewer' });
  } else {
    // Default ให้เข้าเป็น Admin
    res.json({ success: true, token: 'mock-admin-token', role: 'Admin', username: username || 'admin' });
  }
});

// 2. Ingest Route
app.post('/ingest', async (req, res) => {
  try {
    const data = req.body;
    const doc = {
      "@timestamp": data["@timestamp"] || data.timestamp || new Date().toISOString(),
      tenant: data.tenant || "demoA",
      vendor: data.vendor || data.source || "AWS",
      action: data.action || data.event_type || "UNKNOWN",
      user: data.user || "-",
      src_ip: data.src_ip || data.ip || "-",
      status: data.status || "SUCCESS",
      severity: parseInt(data.severity || 1, 10)
    };
    await client.index({ index: 'app-logs', body: doc, refresh: true });
    res.status(200).json({ status: 'ok', data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Logs Route (รองรับ tenant filter)
app.get('/api/logs', async (req, res) => {
  try {
    const { tenant } = req.query;
    let query = { match_all: {} };
    if (tenant && tenant !== 'all') {
      query = { term: { "tenant.keyword": tenant } };
    }
    const result = await client.search({
      index: 'app-logs',
      body: { query: query, size: 100, sort: [{ "@timestamp": { order: "desc" } }] }
    });
    const logs = result.body.hits.hits.map(h => h._source);
    res.json(logs);
  } catch (err) {
    res.json([]);
  }
});

// 4. Retention Clean Route
const handleRetentionClean = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const response = await client.deleteByQuery({
      index: 'app-logs',
      body: { query: { range: { "@timestamp": { lt: sevenDaysAgo } } } },
      refresh: true
    });
    res.status(200).json({ success: true, message: `Cleaned ${response.body.deleted || 0} old logs.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

app.post('/api/retention/clean', handleRetentionClean);
app.delete('/api/retention/clean', handleRetentionClean);

app.listen(8080, () => console.log('Backend running on port 8080'));
