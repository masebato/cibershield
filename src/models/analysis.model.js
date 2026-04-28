'use strict';

const db = require('../database');

async function createAnalysis({ company_id, asset_type, asset_value, global_risk, max_cvss }) {
  const { rows } = await db.query(
    `INSERT INTO analysis_results (company_id, asset_type, asset_value, global_risk, max_cvss)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [company_id, asset_type, asset_value, global_risk, max_cvss]
  );
  return rows[0];
}

async function createFinding({ analysis_id, type, description, cvss_score, level, affected_asset, recommendation }) {
  const { rows } = await db.query(
    `INSERT INTO findings (analysis_id, type, description, cvss_score, level, affected_asset, recommendation)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [analysis_id, type, description, cvss_score, level, affected_asset, recommendation]
  );
  return rows[0];
}

async function findAnalysisById(id) {
  const { rows } = await db.query('SELECT * FROM analysis_results WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findFindingsByAnalysis(analysis_id) {
  const { rows } = await db.query(
    'SELECT * FROM findings WHERE analysis_id = $1 ORDER BY cvss_score DESC',
    [analysis_id]
  );
  return rows;
}

async function findByCompany(company_id) {
  const { rows } = await db.query(
    `SELECT
       a.asset_value AS asset,
       a.global_risk,
       a.max_cvss,
       COUNT(f.id) FILTER (WHERE f.level = 'critico') AS critical,
       COUNT(f.id) FILTER (WHERE f.level = 'alto')    AS high,
       COUNT(f.id) FILTER (WHERE f.level = 'medio')   AS medium,
       COUNT(f.id) FILTER (WHERE f.level = 'bajo')    AS low
     FROM analysis_results a
     LEFT JOIN findings f ON f.analysis_id = a.id
     WHERE a.company_id = $1
     GROUP BY a.id, a.asset_value, a.global_risk, a.max_cvss
     ORDER BY a.analyzed_at DESC`,
    [company_id]
  );
  return rows;
}

module.exports = { createAnalysis, createFinding, findAnalysisById, findFindingsByAnalysis, findByCompany };
