'use strict';

const scn = require('../providers/provider.scn');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.evaluate = async (req, res) => {
  try {
    const { findings, sector } = req.body;
    const data = await scn.evaluate(token(req), findings, sector);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.listNorms = async (req, res) => {
  try {
    const data = await scn.listNorms(token(req));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};
