CREATE TABLE IF NOT EXISTS application_states (
  radar_id TEXT NOT NULL, item_id TEXT NOT NULL,
  application_status TEXT NOT NULL, result_status TEXT,
  updated_at TEXT NOT NULL, revision INTEGER NOT NULL, mutation_id TEXT NOT NULL,
  PRIMARY KEY (radar_id, item_id)
);
CREATE TABLE IF NOT EXISTS used_nonces (nonce TEXT PRIMARY KEY, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS state_events (
  mutation_id TEXT PRIMARY KEY, radar_id TEXT NOT NULL, item_id TEXT NOT NULL,
  application_status TEXT NOT NULL, result_status TEXT,
  updated_at TEXT NOT NULL, revision INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS run_requests (
  id TEXT PRIMARY KEY, radar_id TEXT NOT NULL, status TEXT NOT NULL,
  requested_at TEXT NOT NULL, updated_at TEXT NOT NULL, note TEXT
);
