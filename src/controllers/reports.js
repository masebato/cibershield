'use strict';

const Report = require('../models/report.model');

module.exports.latest = async (req, res) => {
  const companyId = parseInt(req.params.companyId, 10);
  const report    = await Report.findLatestByCompany(companyId);
  if (!report) return res.status(404).json({ error: 'No reports found for company' });
  res.json(report);
};

module.exports.list = async (req, res) => {
  const companyId = parseInt(req.params.companyId, 10);
  const reports   = await Report.findAllByCompany(companyId);
  res.json(reports);
};

module.exports.generate = async (req, res) => {
  const companyId            = parseInt(req.params.companyId, 10);
  const { analysisId, asset, globalRisk } = req.body;
  const report = await Report.create({
    company_id:  companyId,
    analysis_id: analysisId || null,
    asset,
    global_risk: globalRisk || null,
  });
  res.json(report);
};
