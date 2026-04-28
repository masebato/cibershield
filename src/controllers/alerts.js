'use strict';

const Alert                   = require('../models/alert.model');
const { buildRandomAlert }    = require('../mocks/alerts-mock');

module.exports.list = async (req, res) => {
  const { unread, limit = 20, offset = 0 } = req.query;
  const alerts = await Alert.findByCompany(req.user.company_id, { unread, limit, offset });

  if (alerts.length === 0) {
    const mockAlerts = await Promise.all(
      Array.from({ length: 5 }, () => Alert.create(buildRandomAlert(req.user.company_id)))
    );
    res.json(mockAlerts);
    Promise.all(mockAlerts.map(a => Alert.remove(a.id))).catch(() => {});
    return;
  }

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

module.exports.generateMock = async (req, res) => {
  const count      = Math.min(Math.max(parseInt(req.query.count, 10) || 5, 1), 20);
  const company_id = req.user.company_id;

  const created = await Promise.all(
    Array.from({ length: count }, () => Alert.create(buildRandomAlert(company_id)))
  );

  res.status(201).json({ generated: created.length, alerts: created });
};
