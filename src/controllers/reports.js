'use strict';

const Report = require('../models/report.model');

module.exports.latest = async (req, res) => {
  const report = await Report.findLatestByCompany(req.user.company_id);
  if (!report) return res.status(404).json({ error: 'No reports found for this company' });
  res.json(report);
};

module.exports.list = async (req, res) => {
  const reports = await Report.findAllByCompany(req.user.company_id);
  res.json(reports);
};

module.exports.generate = async (req, res) => {
  const { analysisId, asset, globalRisk } = req.body;
  const report = await Report.create({
    company_id:  req.user.company_id,
    analysis_id: analysisId || null,
    asset,
    global_risk: globalRisk || null,
  });
  res.json(report);
};
