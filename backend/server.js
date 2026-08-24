const express = require('express');
const cors = require('cors');
const dgram = require('dgram');
const { Client } = require('@opensearch-project/opensearch');
const { normalizeLog } = require('./normalizer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const UDP_PORT = process.env.UDP_PORT || 1514;
const OPENSEARCH_URL = process.env.OPENSEARCH_URL || 'http://opensearch:9200';

const client = new Client({ node: OPENSEARCH_URL });

app.get('/api/logs', async (req, res) => {
  try {
    const result = await client.search({
      index: 'app-logs',
      body: { query: { match_all: {} }, sort: [{ "@timestamp": { order: "desc" } }] }
    });
    res.json(result.body.hits.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route สำหรับ Alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const result = await client.search({
      index: 'app-logs',
      body: {
        query: {
          bool: {
            should: [
              { match: { event_type: "LogonFailed" } },
              { range: { severity: { gte: 8 } } }
            ]
          }
        },
        sort: [{ "@timestamp": { order: "desc" } }]
      }
    });
    res.json(result.body.hits.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ingest', async (req, res) => {
  try {
    const normalized = normalizeLog(req.body, 'http-api');
    await client.index({ index: 'app-logs', body: normalized, refresh: true });
    res.status(201).json({ success: true, data: normalized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));

const udpServer = dgram.createSocket('udp4');
udpServer.on('message', async (msg) => {
  try {
    const rawMsg = msg.toString();
    const normalized = normalizeLog({ action: 'syslog', message: rawMsg }, 'syslog');
    await client.index({ index: 'app-logs', body: normalized, refresh: true });
  } catch (err) {
    console.error('UDP Error:', err);
  }
});
udpServer.bind(UDP_PORT, () => console.log(`UDP Syslog listening on port ${UDP_PORT}`));
