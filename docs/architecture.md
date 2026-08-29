# System Architecture

Data Flow:
Log Source -> Ingest -> Normalizer -> OpenSearch -> Backend -> Frontend

Components:
- Ingestion Layer: Syslog & HTTP API
- Normalization Layer: Standard Schema
- Search Engine: OpenSearch
- RBAC: Tenant Isolation
