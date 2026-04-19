'use strict';

const sar = require('../providers/provider.sar');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.analyze = async (req, res) => {
  try {
    const { asset_type, asset_value } = req.body;
    const data = await sar.analyze(token(req), asset_type, asset_value);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.listAssets = async (req, res) => {
  try {
    const data = await sar.listAssets(token(req), req.params.companyId);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const data = await sar.getAnalysisById(token(req), req.params.id);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};
