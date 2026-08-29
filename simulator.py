import requests
import time
import random

# แก้ไข URL ให้ยิงเข้า Backend Endpoint สำหรับ Ingest
URL = "http://localhost:8081/ingest"

vendors = ["AWS", "Azure", "GCP", "On-Prem"]
actions = ["LOGIN_SUCCESS", "LOGIN_FAILED", "FILE_UPLOAD", "DELETE_DB", "ACCESS_DENIED"]
users = ["admin", "viewer", "alice", "bob", "attacker"]
tenants = ["demoA", "demoB", "default"]

print("🚀 Starting Log Simulator (Sending to http://localhost:8081/ingest)...")

while True:
    status_choice = random.choice(["SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "ALERT"])
    doc = {
        "tenant": random.choice(tenants), # 👈 ปั๊มค่า tenant กำหนดสิทธิ์
        "vendor": random.choice(vendors),
        "action": random.choice(actions),
        "user": random.choice(users),
        "src_ip": f"192.168.1.{random.randint(1, 254)}",
        "status": status_choice,
        "severity": 9 if status_choice in ["FAILED", "ALERT"] else random.randint(1, 5)
    }
    
    try:
        res = requests.post(URL, json=doc, timeout=2)
        print(f"Sent: {doc['tenant']} | {doc['action']} [{doc['status']}] -> Status {res.status_code}")
    except Exception as e:
        print(f"Error: {e}")
        
    time.sleep(1)