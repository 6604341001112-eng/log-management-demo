import time
import json
import random
import urllib.request

url = "http://localhost:8081/ingest"
tenants = ["demoA", "demoB", "default"]
vendors = ["AWS", "Firewall", "Azure", "GCP"]
users = ["attacker", "ratima_admin", "alice", "bob", "system_job"]
ips = ["203.0.113.77", "10.0.0.15", "192.168.1.100", "172.16.0.4"]
actions = ["app_login_failed", "IAM_USER_LOGIN", "VM_START", "DATABASE_BACKUP", "UNAUTHORIZED_ACCESS"]

print("🚀 Simulator running... Press Ctrl+C to stop.")

while True:
    action = random.choice(actions)
    is_alert = action in ["app_login_failed", "UNAUTHORIZED_ACCESS"]
    payload = {
        "tenant": random.choice(tenants),
        "vendor": random.choice(vendors),
        "action": action,
        "user": random.choice(users),
        "src_ip": random.choice(ips),
        "status": "FAILED" if is_alert else "SUCCESS",
        "severity": 9 if is_alert else 1
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Sent: {payload['action']} | Status: {response.status}")
    except Exception as e:
        print(f"Error sending log: {e}")
    time.sleep(2)
