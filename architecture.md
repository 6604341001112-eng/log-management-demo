# 🏗️ System Architecture

## 🔄 Data Flow
Log Source -> Ingest -> Normalizer -> OpenSearch -> Backend -> Frontend

- **Log Source:** แหล่งกำเนิด Log จากอุปกรณ์ Network, Server หรือ Application ภายนอก
- **Ingest:** รับข้อมูล Log เข้าสู่ระบบผ่าน 2 ช่องทางหลัก (Syslog UDP Port 1514 และ HTTP API `/ingest`)
- **Normalizer:** แปลงโครงสร้าง Log จากค่ายต่างๆ ให้อยู่ในรูปแบบมาตรฐาน (Standard Schema)
- **OpenSearch:** ฐานข้อมูล Search Engine ทำหน้าที่บันทึกและทำ Index ข้อมูล Log
- **Backend:** Express API ควบคุม Business Logic และกั้นสิทธิ์ข้อมูลด้วย `tenant.keyword:tenant`
- **Frontend:** Web Dashboard แสดงผลข้อมูล Log และ Alerts แบบ Real-time

---

## 🧩 Components

- **Ingestion Layer:** Syslog & HTTP API
- **Normalization Layer:** Standard Schema
- **Search Engine:** OpenSearch
- **RBAC:** Tenant Isolation (จำกัดสิทธิ์ข้อมูลตาม `tenant.keyword:tenant`)
