'use strict';

const gatewayController = require('./gateway');
const authController = require('./auth');

// ── Gateway ───────────────────────────────────────────────────────────────────

module.exports['gateway.health'] = gatewayController.health;

// ── Auth ───────────────────────────────────────────────────────────────────────

module.exports['auth.register'] = authController.register;
module.exports['auth.login'] = authController.login;