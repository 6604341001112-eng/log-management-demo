# 🏗️ Architecture & Data Flow

## 1. System Overview
ระบบ Demo Log Management พัฒนาด้วยสถาปัตยกรรม Microservices บน Docker Compose รองรับการเก็บ Log จากหลากหลายแหล่งข้อมูล (AWS CloudTrail, Microsoft 365, UDP Syslog) นำมาปรับรูปแบบให้อยู่ในมาตรฐานเดียวกัน (Normalization) บันทึกลง OpenSearch และแสดงผลผ่าน Web Dashboard พร้อมระบบแจ้งเตือน (Alerts)

## 2. Component Architecture
- Ingestion Layer (Backend): พัฒนาด้วย Express.js (Node.js) รับ Log ผ่าน HTTP API (POST /api/ingest) พอร์ต 8081 และ UDP Syslog พอร์ต 1514
- Normalization Layer: ใช้ backend/normalizer.js แปลง Schema ของแต่ละ Vendor ให้อยู่ในรูปแบบ Central Schema
- Storage Layer: OpenSearch 2.16 (Port 9200) ทำหน้าที่จัดเก็บ Index app-logs และรองรับ Query
- Presentation Layer (Frontend): Nginx Web Server (Port 3000/3001) แสดง Web UI และเรียกใช้งาน REST APIs (/api/logs และ /api/alerts)

## 3. Data Flow
Log Sources -> Ingestion (HTTP/UDP) -> Normalizer -> OpenSearch Storage -> REST API -> Frontend Dashboard & Alerts
