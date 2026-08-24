import requests

url = "http://localhost:8081/api/ingest"

logs = [
    {
        "eventName": "ConsoleLogin",
        "sourceIPAddress": "192.168.1.50",
        "userIdentity": {"userName": "admin-ratima"}
    },
    {
        "CreationTime": "2026-08-24T10:05:00Z",
        "Operation": "FileDownloaded",
        "ClientIP": "203.0.113.195",
        "UserId": "user@company.com"
    },
    # Log ที่จะ Trigger Alert 🚨
    {
        "eventName": "LogonFailed",
        "sourceIPAddress": "45.33.32.156",
        "userIdentity": {"userName": "hacker_user"},
        "severity": 9
    }
]

for log in logs:
    res = requests.post(url, json=log)
    print("Response:", res.json())
