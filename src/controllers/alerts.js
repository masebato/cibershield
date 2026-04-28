'use strict';

const Alert = require('../models/alert.model');

module.exports.list = async (req, res) => {
  const { unread, limit = 20, offset = 0 } = req.query;
  const alerts = await Alert.findByCompany(req.user.company_id, { unread, limit, offset });
  res.json(alerts);
};

module.exports.markRead = async (req, res) => {
  const id    = parseInt(req.params.id, 10);
  const alert = await Alert.markRead(id);
  if (!alert) return res.status(400).json({ error: 'Alert not found' });
  res.json(alert);
};

module.exports.markAllRead = async (req, res) => {
  const updated = await Alert.markAllRead(req.user.company_id);
  res.json({ updated });
};

module.exports.delete = async (req, res) => {
  const id      = parseInt(req.params.id, 10);
  const deleted = await Alert.remove(id);
  if (!deleted) return res.status(400).json({ error: 'Alert not found' });
  res.json({ message: 'Alerta eliminada correctamente' });
};
