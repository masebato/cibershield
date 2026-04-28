'use strict';

const db = require('../database');

async function create({ email, password_hash, role = 'admin', company_id }) {
  const { rows } = await db.query(
    'INSERT INTO users (email, password_hash, role, company_id) VALUES ($1,$2,$3,$4) RETURNING *',
    [email, password_hash, role, company_id]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { create, findByEmail, findById };
