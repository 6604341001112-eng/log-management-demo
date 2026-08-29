import argparse
import random
import time
import requests

parser = argparse.ArgumentParser(description="Log Simulator for Log Management System")
parser.add_argument("--url", type=str, default="http://localhost:9200/logs-index/_doc", help="Target ingestion URL")
parser.add_argument("--interval", type=float, default=1.0, help="Interval between requests (seconds)")
args = parser.parse_args()

URL = args.url
vendors = ["AWS", "Azure", "GCP", "On-Prem"]
actions = ["LOGIN_SUCCESS", "LOGIN_FAILED", "FILE_UPLOAD", "DELETE_DB", "ACCESS_DENIED"]
users = ["admin", "viewer", "alice", "bob", "attacker"]
tenants = ["demoA", "demoB", "default"]

print(f"🚀 Starting Log Simulator (Sending to {URL})...")

try:
    while True:
        status_choice = random.choice(["SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "ALERT"])
        doc = {
            "tenant": random.choice(tenants),
            "vendor": random.choice(vendors),
            "action": random.choice(actions),
            "user": random.choice(users),
            "src_ip": f"192.168.1.{random.randint(1, 254)}",
            "status": status_choice,
            "severity": 9 if status_choice in ["FAILED", "ALERT"] else random.randint(1, 5),
            "@timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        
        try:
            res = requests.post(URL, json=doc, headers={"Content-Type": "application/json"}, timeout=2)
            print(f"Sent: {doc['tenant']} | {doc['action']} [{doc['status']}] -> Status {res.status_code}")
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(args.interval)
except KeyboardInterrupt:
    print("\n🛑 Stopped Log Simulator.")
