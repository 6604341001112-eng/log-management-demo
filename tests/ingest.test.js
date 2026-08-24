const assert = require('assert');
const { normalizeLog } = require('../backend/normalizer');

console.log("🧪 Running Integration & Normalization Tests...\n");

// Test Case 1: AWS CloudTrail
try {
  const awsRaw = { 
    eventName: "ConsoleLogin", 
    sourceIPAddress: "192.168.1.50", 
    userIdentity: { userName: "admin-ratima" } 
  };
  const result = normalizeLog(awsRaw, 'http-api');
  
  assert.strictEqual(result.vendor, 'AWS', 'Vendor should be AWS');
  assert.strictEqual(result.user, 'admin-ratima', 'User should be admin-ratima');
  assert.strictEqual(result.src_ip, '192.168.1.50', 'IP should be 192.168.1.50');
  console.log("✅ Test 1 Passed: AWS CloudTrail Normalization");
} catch (err) {
  console.error("❌ Test 1 Failed:", err.message);
  process.exit(1);
}

// Test Case 2: Microsoft 365
try {
  const m365Raw = { 
    Operation: "FileDownloaded", 
    ClientIP: "203.0.113.195", 
    UserId: "user@company.com" 
  };
  const result = normalizeLog(m365Raw, 'http-api');
  
  assert.strictEqual(result.vendor, 'Microsoft', 'Vendor should be Microsoft');
  assert.strictEqual(result.user, 'user@company.com', 'User should be user@company.com');
  assert.strictEqual(result.src_ip, '203.0.113.195', 'IP should be 203.0.113.195');
  console.log("✅ Test 2 Passed: Microsoft 365 Normalization");
} catch (err) {
  console.error("❌ Test 2 Failed:", err.message);
  process.exit(1);
}

// Test Case 3: Alert Condition
try {
  const alertRaw = { 
    eventName: "LogonFailed", 
    sourceIPAddress: "45.33.32.156", 
    userIdentity: { userName: "hacker_user" },
    severity: 9
  };
  const result = normalizeLog(alertRaw, 'http-api');
  
  assert.strictEqual(result.event_type, 'LogonFailed', 'Event type should be LogonFailed');
  assert.strictEqual(result.severity, 9, 'Severity should be 9');
  console.log("✅ Test 3 Passed: Critical Alert Event Detection");
} catch (err) {
  console.error("❌ Test 3 Failed:", err.message);
  process.exit(1);
}

console.log("\n🎉 All 3 Test Cases Passed Successfully!");
