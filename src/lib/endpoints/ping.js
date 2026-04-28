'use strict';

const startedAt = Date.now();

module.exports = function ping(req, res) {
  res.json({ status: 'ok', uptime: Math.floor((Date.now() - startedAt) / 1000) });
};
