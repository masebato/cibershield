'use strict';

const analysisService = require('../services/analysis.service');
const Analysis        = require('../models/analysis.model');

module.exports.analyze = async (req, res) => {
  const { asset_type, asset_value } = req.body;
  const result = await analysisService.analyze(req.user.company_id, asset_type, asset_value);
  res.json(result);
};

module.exports.assetsList = async (req, res) => {
  const rows = await Analysis.findByCompany(req.user.company_id);
  res.json(rows.map((r) => ({
    asset:       r.asset,
    global_risk: r.global_risk,
    max_cvss:    parseFloat(r.max_cvss),
    critical:    parseInt(r.critical, 10),
    high:        parseInt(r.high, 10),
    medium:      parseInt(r.medium, 10),
    low:         parseInt(r.low, 10),
  })));
};

module.exports.getById = async (req, res) => {
  const id     = parseInt(req.params.id, 10);
  const result = await analysisService.getById(id);
  res.json(result);
};
