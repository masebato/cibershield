'use strict';

const db = require('../database');

async function findByCompany(company_id, { unread, limit = 20, offset = 0 } = {}) {
  const conditions = ['company_id = $1'];
  const params     = [company_id];

  if (unread === true || unread === 'true') {
    conditions.push('read = FALSE');
  }

  const where = conditions.join(' AND ');
  const { rows } = await db.query(
    `SELECT * FROM alerts WHERE ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM alerts WHERE id = $1', [id]);
  return rows[0] || null;
}

async function markRead(id) {
  const { rows } = await db.query(
    'UPDATE alerts SET read = TRUE WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
}

async function markAllRead(company_id) {
  const { rowCount } = await db.query(
    'UPDATE alerts SET read = TRUE WHERE company_id = $1 AND read = FALSE',
    [company_id]
  );
  return rowCount;
}

async function remove(id) {
  const { rowCount } = await db.query('DELETE FROM alerts WHERE id = $1', [id]);
  return rowCount > 0;
}

async function create({ company_id, type, asset, risk_level, summary }) {
  const { rows } = await db.query(
    'INSERT INTO alerts (company_id, type, asset, risk_level, summary) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [company_id, type, asset || null, risk_level, summary]
  );
  return rows[0];
}

module.exports = { findByCompany, findById, markRead, markAllRead, remove, create };
