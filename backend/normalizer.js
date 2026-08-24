function normalizeLog(raw, source = 'http-api') {
  const timestamp = raw['@timestamp'] || raw.timestamp || raw.eventTime || new Date().toISOString();
  
  let vendor = 'Unknown';
  let product = 'Generic';
  let event_type = 'Unknown';
  let src_ip = '0.0.0.0';
  let user = 'N/A';
  // ดึง severity จาก raw ถ้ามี ถ้าไม่มีให้ default เป็น 1
  let severity = raw.severity !== undefined ? Number(raw.severity) : 1;

  // AWS CloudTrail Format
  if (raw.eventName || raw.eventSource) {
    vendor = 'AWS';
    product = 'CloudTrail';
    event_type = raw.eventName || 'AWS_Event';
    src_ip = raw.sourceIPAddress || '0.0.0.0';
    if (raw.userIdentity) {
      user = raw.userIdentity.userName || raw.userIdentity.arn || 'AWS_User';
    }
  }
  // Microsoft 365 Audit Log Format
  else if (raw.Operation || raw.Workload) {
    vendor = 'Microsoft';
    product = raw.Workload || 'M365';
    event_type = raw.Operation || 'M365_Operation';
    src_ip = raw.ClientIP || '0.0.0.0';
    user = raw.UserId || 'M365_User';
  }
  // Syslog / Generic Log
  else if (typeof raw === 'string') {
    vendor = 'Syslog';
    product = 'NetworkDevice';
    event_type = raw.includes('FAIL') || raw.includes('Failed') ? 'LogonFailed' : 'SyslogMessage';
    const ipMatch = raw.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    if (ipMatch) src_ip = ipMatch[0];
  } else if (raw.event_type) {
    event_type = raw.event_type;
    src_ip = raw.src_ip || src_ip;
    user = raw.user || user;
    vendor = raw.vendor || vendor;
  }

  // ปรับ Severity เพิ่มอัตโนมัติหากเป็น LogonFailed
  if (event_type === 'LogonFailed' && severity < 8) {
    severity = 8;
  }

  return {
    '@timestamp': timestamp,
    tenant: raw.tenant || 'default',
    source,
    vendor,
    product,
    event_type,
    severity,
    src_ip,
    user,
    raw
  };
}

module.exports = { normalizeLog };
