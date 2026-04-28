'use strict';

const db = require('../database');

async function create({ name, sector }) {
  const { rows } = await db.query(
    'INSERT INTO companies (name, sector) VALUES ($1, $2) RETURNING *',
    [name, sector || null]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM companies WHERE id = $1', [id]);
  return rows[0] || null;
}

async function update(id, { name, sector }) {
  const { rows } = await db.query(
    `UPDATE companies SET
       name   = COALESCE($2, name),
       sector = COALESCE($3, sector)
     WHERE id = $1 RETURNING *`,
    [id, name || null, sector || null]
  );
  return rows[0] || null;
}

module.exports = { create, findById, update };
