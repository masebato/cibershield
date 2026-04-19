'use strict';

const sre = require('../providers/provider.sre');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.listReports = async (req, res) => {
  try {
    const data = await sre.listReports(token(req), req.params.companyId);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.generateReport = async (req, res) => {
  try {
    const data = await sre.generateReport(token(req), req.params.companyId, req.body);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.latestReport = async (req, res) => {
  try {
    const r = await sre.latestReport(token(req), req.params.companyId);
    res.set('Content-Type', 'application/pdf');
    res.send(Buffer.from(r.data));
  } catch (err) {
    handleError(res, err);
  }
};
