'use strict';

const san = require('../providers/provider.san');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.listAlerts = async (req, res) => {
  try {
    const { unread, limit, offset } = req.query;
    const data = await san.listAlerts(token(req), req.params.companyId, { unread, limit, offset });
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.markRead = async (req, res) => {
  try {
    const data = await san.markRead(token(req), req.params.id);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.markAllRead = async (req, res) => {
  try {
    const data = await san.markAllRead(token(req));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.deleteAlert = async (req, res) => {
  try {
    const data = await san.deleteAlert(token(req), req.params.id);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};
