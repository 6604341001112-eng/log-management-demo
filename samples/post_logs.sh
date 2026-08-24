#!/bin/bash
echo "🚀 Sending Sample HTTP Logs (AWS / M365 / API)..."

# Sample 1: HTTP API - Login Failed (Trigger Alert)
curl -s -X POST http://localhost:8081/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoA",
    "source": "api",
    "event_type": "LogonFailed",
    "user": "hacker_user",
    "src_ip": "203.0.113.7",
    "severity": 9,
    "@timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
echo ""

# Sample 2: AWS CloudTrail
curl -s -X POST http://localhost:8081/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoB",
    "source": "aws",
    "eventName": "ConsoleLogin",
    "sourceIPAddress": "192.168.1.50",
    "userIdentity": { "userName": "admin-ratima" },
    "@timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
echo ""
echo "✅ HTTP Logs Sent Successfully!"
