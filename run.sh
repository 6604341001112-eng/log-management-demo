#!/bin/bash
echo "Starting Log Management Appliance System..."
docker compose up -d --build
echo "System ready at https://localhost (or http://localhost:8080)"
