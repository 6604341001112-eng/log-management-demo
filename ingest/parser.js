function normalizeLog(data) {
  return {
    timestamp: data.timestamp || data['@timestamp'] || new Date().toISOString(),
    tenant: data.tenant || 'default',
    vendor: data.vendor || data.source || 'Syslog',
    action: data.action || data.event_type || 'UNKNOWN',
    user: data.user || data.username || '-',
    src_ip: data.src_ip || data.client_ip || data.ip || '-',
    status: data.status || (data.severity > 5 ? 'FAILED' : 'SUCCESS'),
    severity: parseInt(data.severity || 1, 10)
  };
}

module.exports = { normalizeLog };
