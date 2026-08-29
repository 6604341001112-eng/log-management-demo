import requests
import time
import random
import urllib3

# ปิด Warning เรื่อง SSL Certificate Self-signed
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ใช้ HTTPS port 443 ตาม Nginx/Frontend ของคุณ
API_URL = "https://localhost/api/v1/ingest"

TENANTS = ["demoA", "demoB", "default"]
VENDORS = ["aws", "paloalto", "microsoft", "crowdstrike"]
EVENTS = ["login_failed", "access_denied", "user_created", "firewall_block"]

print("🚀 Starting Log Simulator (Bypassing SSL Verification)...")
while True:
    payload = {
        "tenant": random.choice(TENANTS),
        "vendor": random.choice(VENDORS),
        "event_action": random.choice(EVENTS),
        "user": random.choice(["alice", "bob", "admin", "attacker"]),
        "src_ip": f"192.168.1.{random.randint(10, 200)}",
        "severity": random.randint(1, 10),
        "status": random.choice(["SUCCESS", "ALERT", "DENY"])
    }
    try:
        # ใส่ verify=False เพื่อข้ามการเช็ค Self-signed SSL
        res = requests.post(API_URL, json=payload, verify=False)
        print(f"Sent log: {res.status_code} | Tenant: {payload['tenant']}")
    except Exception as e:
        print(f"Error sending log: {e}")
    time.sleep(2)
