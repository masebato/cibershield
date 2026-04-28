'use strict';

const db = require('../database');

async function create({ company_id, type, value }) {
  const { rows } = await db.query(
    'INSERT INTO assets (company_id, type, value) VALUES ($1,$2,$3) RETURNING *',
    [company_id, type, value]
  );
  return rows[0];
}

async function findByCompany(company_id) {
  const { rows } = await db.query(
    'SELECT * FROM assets WHERE company_id = $1 ORDER BY created_at DESC',
    [company_id]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM assets WHERE id = $1', [id]);
  return rows[0] || null;
}

async function remove(id, company_id) {
  const { rowCount } = await db.query(
    'DELETE FROM assets WHERE id = $1 AND company_id = $2',
    [id, company_id]
  );
  return rowCount > 0;
}

module.exports = { create, findByCompany, findById, remove };
