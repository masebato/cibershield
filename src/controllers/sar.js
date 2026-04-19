'use strict';

const sar = require('../providers/provider.sar');

module.exports.analyze = async (req, res) => {
  const { token, body } = req.context();
  const data = await sar.analyze(token, body.asset_type, body.asset_value);
  res.json(data);
};

module.exports.listAssets = async (req, res) => {
  const { token, params } = req.context();
  const data = await sar.listAssets(token, params.companyId);
  res.json(data);
};

module.exports.getById = async (req, res) => {
  const { token, params } = req.context();
  const data = await sar.getAnalysisById(token, params.id);
  res.json(data);
};
