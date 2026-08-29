#!/bin/bash
curl -X POST "http://localhost:8081/ingest" \
  -H "Content-Type: application/json" \
  -d '{"tenant":"demoA","vendor":"AWS","action":"IAM_USER_LOGIN","user":"ratima_admin","src_ip":"10.0.0.15","status":"SUCCESS","severity":1}'
