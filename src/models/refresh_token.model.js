'use strict';

const crypto = require('crypto');
const db     = require('../database');

function hash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function save({ user_id, token, expires_at }) {
  const token_hash = hash(token);
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)',
    [user_id, token_hash, expires_at]
  );
}

async function findAndDelete(token) {
  const token_hash = hash(token);
  const { rows } = await db.query(
    'DELETE FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW() RETURNING *',
    [token_hash]
  );
  return rows[0] || null;
}

async function deleteAllForUser(user_id) {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user_id]);
}

module.exports = { save, findAndDelete, deleteAllForUser };
