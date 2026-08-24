# 🏗️ System Architecture & Data Flow

## 1. Overview
ระบบ Log Management Demo ออกแบบขึ้นมาเพื่อรองรับ Log จากหลายแหล่งข้อมูล (Multi-vendor Ingestion) โดยทำการ Normalize ให้อยู่ในโครงสร้าง Central Schema เดียวกันก่อนจัดเก็บลง OpenSearch เพื่อใช้ในการคีย์ค้นหา แสดงผล Visual Dashboard และแจ้งเตือนเหตุการณ์สุ่มเสี่ยง (Alerts)

---

## 2. High-Level Data Flow

[ Log Sources ]
  - Syslog Devices (UDP 1514)
  - REST API Clients (HTTP 8081)
  - AWS CloudTrail (JSON)
  - Microsoft 365 / AD Logs (JSON)
       |
       v
[ Ingestion & Normalizer Layer (Backend / Node.js) ]
  - UDP Receiver & HTTP Ingest API
  - Normalization Engine (Central Schema Conversion)
  - Alert Rule Engine (LogonFailed / Severity >= 8)
       |
       v
[ Storage & Search Layer ]
  - OpenSearch 2.16 (Port 9200 - Index: app-logs)
       |
       v
[ Presentation Layer (Frontend / Nginx) ]
  - Dashboard UI (Port 3001 - Search, Filter, Top N & Alerts)

---

## 3. Core Components

* Ingestion Layer: รองรับการรับข้อมูล 2 โปรโตคอลหลัก (HTTP POST API และ UDP Syslog)
* Normalization Layer: แปลงข้อมูลจากทุก Vendor เข้าสู่ Central Schema เช่น @timestamp, vendor, product, event_type, severity, src_ip, และ user
* Storage Layer: ใช้ OpenSearch ทำหน้าที่เป็น Search & Indexing Engine รองรับการค้นหาข้อมูลปริมาณมากแบบ Real-time
* Alert System: สแกนข้อมูล Log หากพบ event_type === "LogonFailed" หรือ severity >= 8 จะทำการระบุเป็น Critical Alert เพื่อนำไปแสดงผลบน Dashboard แถบสีแดง

---

## 4. Multi-Tenant Model
ข้อมูลทุก Event จะถูกกำกับด้วยฟิลด์ tenant (เช่น demoA, demoB) ทำให้สามารถกรองข้อมูลแยกตามรายลูกค้าหรือตามบทบาทผู้ใช้งาน (RBAC) ผ่าน Query Parameter ในระดับ API ได้
