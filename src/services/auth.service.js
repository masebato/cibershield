'use strict';

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const config  = require('../config');
const User    = require('../models/user.model');
const Company = require('../models/company.model');
const Asset   = require('../models/asset.model');
const Token   = require('../models/refresh_token.model');

const SALT_ROUNDS = 12;

function signTokens(userId, companyId, role) {
  const payload = { sub: userId, company_id: companyId, role };

  const access_token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry,
  });

  const refresh_token = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });

  return { access_token, refresh_token };
}

function buildProfile(user, company, assets) {
  return {
    id:           user.id,
    email:        user.email,
    role:         user.role,
    company_id:   company.id,
    company_name: company.name,
    sector:       company.sector || undefined,
    assets:       assets.map((a) => ({
      id:         a.id,
      type:       a.type,
      value:      a.value,
      created_at: a.created_at,
    })),
  };
}

async function register({ email, password, company_name, sector }) {
  const existing = await User.findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  const company      = await Company.create({ name: company_name, sector });
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user          = await User.create({ email, password_hash, company_id: company.id });

  const { access_token, refresh_token } = signTokens(user.id, company.id, user.role);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.save({ user_id: user.id, token: refresh_token, expires_at: expiresAt });

  return {
    access_token,
    refresh_token,
    user: buildProfile(user, company, []),
  };
}

async function login({ email, password }) {
  const user = await User.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const { access_token, refresh_token } = signTokens(user.id, user.company_id, user.role);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.save({ user_id: user.id, token: refresh_token, expires_at: expiresAt });

  return { access_token, refresh_token };
}

async function logout(refresh_token) {
  const found = await Token.findAndDelete(refresh_token);
  if (!found) {
    const err = new Error('Invalid or expired refresh token');
    err.status = 400;
    throw err;
  }
}

async function getProfile(userId) {
  const user    = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const company = await Company.findById(user.company_id);
  const assets  = await Asset.findByCompany(user.company_id);
  return buildProfile(user, company, assets);
}

async function updateProfile(userId, { company_name, sector }) {
  const user    = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const company = await Company.update(user.company_id, { name: company_name, sector });
  const assets  = await Asset.findByCompany(user.company_id);
  return buildProfile(user, company, assets);
}

module.exports = { register, login, logout, getProfile, updateProfile };
