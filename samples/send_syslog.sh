#!/bin/bash
echo "🚀 Sending Sample UDP Syslog to Port 1514..."

# ส่งข้อความ Syslog ผ่าน UDP
echo "<134>Aug 24 12:44:56 fw01 vendor=demo product=ngfw action=deny src=10.0.1.10 dst=8.8.8.8 msg=LogonFailed severity=8" | nc -w1 -u 127.0.0.1 1514

echo "✅ Syslog Sent Successfully!"
