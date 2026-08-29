const express = require('express');
const { Client } = require('@opensearch-project/opensearch');

const app = express();
app.use(express.json());

const client = new Client({ node: process.env.OPENSEARCH_NODE || 'http://opensearch:9200' });

// 1. Route Ingest
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

    await client.index({
      index: 'app-logs',
      body: doc,
      refresh: true
    });

    res.status(200).json({ status: 'ok', data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Fetch Logs (Query จาก app-logs)
app.get('/api/logs', async (req, res) => {
  try {
    const result = await client.search({
      index: 'app-logs',
      body: { query: { match_all: {} }, size: 100, sort: [{ "@timestamp": { order: "desc" } }] }
    });
    const logs = result.body.hits.hits.map(h => h._source);
    res.json(logs);
  } catch (err) {
    res.json([]);
  }
});

// 3. Retention Clean Route (แก้ Error 404 /api/retention/clean)
const handleRetentionClean = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const response = await client.deleteByQuery({
      index: 'app-logs',
      body: {
        query: {
          range: {
            "@timestamp": { lt: sevenDaysAgo }
          }
        }
      },
      refresh: true
    });
    res.status(200).json({ status: 'ok', deleted: response.body.deleted || 0 });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

app.post('/api/retention/clean', handleRetentionClean);
app.delete('/api/retention/clean', handleRetentionClean);

app.listen(8080, () => console.log('Backend running on port 8080'));
