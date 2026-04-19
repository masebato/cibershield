'use strict';

const sre = require('../providers/provider.sre');

module.exports.listReports = async (req, res) => {
  const { token, params } = req.context();
  const data = await sre.listReports(token, params.companyId);
  res.json(data);
};

module.exports.generateReport = async (req, res) => {
  const { token, params, body } = req.context();
  const data = await sre.generateReport(token, params.companyId, body);
  res.json(data);
};

module.exports.latestReport = async (req, res) => {
  const { token, params } = req.context();
  const r = await sre.latestReport(token, params.companyId);
  res.set('Content-Type', 'application/pdf');
  res.send(Buffer.from(r.data));
};
