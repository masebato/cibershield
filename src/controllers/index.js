'use strict';

const gatewayController = require('./gateway');


// ── Gateway ───────────────────────────────────────────────────────────────────

module.exports['gateway.health'] = gatewayController.health;
