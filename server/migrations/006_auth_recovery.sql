ALTER TABLE users ADD COLUMN email_verified_at TEXT;
CREATE TABLE auth_challenges(id TEXT PRIMARY KEY,company_id TEXT NOT NULL REFERENCES companies(id),user_id TEXT NOT NULL REFERENCES users(id),kind TEXT NOT NULL CHECK(kind IN ('reset','verify')),token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,used_at TEXT,created_at TEXT NOT NULL);
CREATE INDEX auth_challenges_user ON auth_challenges(user_id,kind,created_at);
CREATE TABLE auth_outbox(id TEXT PRIMARY KEY,company_id TEXT NOT NULL REFERENCES companies(id),challenge_id TEXT NOT NULL REFERENCES auth_challenges(id),recipient TEXT NOT NULL,payload TEXT,state TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,available_at TEXT NOT NULL,lease_until TEXT,lease_token TEXT,provider_id TEXT,error_code TEXT,created_at TEXT NOT NULL);
CREATE INDEX auth_outbox_due ON auth_outbox(state,available_at);
