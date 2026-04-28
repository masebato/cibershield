'use strict';

const db = require('../database');

async function create({ company_id, analysis_id, asset, global_risk }) {
  const { rows } = await db.query(
    'INSERT INTO reports (company_id, analysis_id, asset, global_risk) VALUES ($1,$2,$3,$4) RETURNING *',
    [company_id, analysis_id || null, asset, global_risk || null]
  );
  return rows[0];
}

async function findLatestByCompany(company_id) {
  const { rows } = await db.query(
    'SELECT * FROM reports WHERE company_id = $1 ORDER BY generated_at DESC LIMIT 1',
    [company_id]
  );
  return rows[0] || null;
}

async function findAllByCompany(company_id) {
  const { rows } = await db.query(
    'SELECT * FROM reports WHERE company_id = $1 ORDER BY generated_at DESC',
    [company_id]
  );
  return rows;
}

module.exports = { create, findLatestByCompany, findAllByCompany };
