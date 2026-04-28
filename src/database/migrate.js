'use strict';

const { query } = require('./index');

const SQL = `
  CREATE TABLE IF NOT EXISTS companies (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    sector     VARCHAR(100),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'admin',
    company_id    INTEGER      NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS assets (
    id         SERIAL PRIMARY KEY,
    company_id INTEGER     NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type       VARCHAR(50) NOT NULL CHECK (type IN ('ip','cidr','domain','subdomain')),
    value      VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, value)
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id         SERIAL PRIMARY KEY,
    company_id INTEGER      NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type       VARCHAR(100) NOT NULL,
    asset      VARCHAR(255),
    risk_level VARCHAR(50)  NOT NULL CHECK (risk_level IN ('critico','alto','medio','bajo')),
    summary    TEXT         NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS analysis_results (
    id          SERIAL PRIMARY KEY,
    company_id  INTEGER      NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    asset_type  VARCHAR(50)  NOT NULL,
    asset_value VARCHAR(255) NOT NULL,
    global_risk VARCHAR(50)  NOT NULL CHECK (global_risk IN ('critico','alto','medio','bajo')),
    max_cvss    NUMERIC(4,1) NOT NULL DEFAULT 0,
    analyzed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS findings (
    id            SERIAL PRIMARY KEY,
    analysis_id   INTEGER      NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
    type          VARCHAR(100) NOT NULL,
    description   TEXT         NOT NULL,
    cvss_score    NUMERIC(4,1) NOT NULL DEFAULT 0,
    level         VARCHAR(50)  NOT NULL CHECK (level IN ('critico','alto','medio','bajo')),
    affected_asset VARCHAR(255) NOT NULL,
    recommendation TEXT        NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS reports (
    id           SERIAL PRIMARY KEY,
    company_id   INTEGER      NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    analysis_id  INTEGER      REFERENCES analysis_results(id),
    asset        VARCHAR(255) NOT NULL,
    global_risk  VARCHAR(50)  CHECK (global_risk IN ('critico','alto','medio','bajo')),
    generated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
`;

async function migrate() {
  console.log('Running database migrations...');
  await query(SQL);
  console.log('Migrations complete');
}

module.exports = { migrate };
