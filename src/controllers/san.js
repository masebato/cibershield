'use strict';

const san = require('../providers/provider.san');

module.exports.listAlerts = async (req, res) => {
  const { token, params, query } = req.context();
  const data = await san.listAlerts(token, params.companyId, query);
  res.json(data);
};

module.exports.markRead = async (req, res) => {
  const { token, params } = req.context();
  const data = await san.markRead(token, params.id);
  res.json(data);
};

module.exports.markAllRead = async (req, res) => {
  const { token } = req.context();
  const data = await san.markAllRead(token);
  res.json(data);
};

module.exports.deleteAlert = async (req, res) => {
  const { token, params } = req.context();
  const data = await san.deleteAlert(token, params.id);
  res.json(data);
};
