'use strict';

const scn = require('../providers/provider.scn');

module.exports.evaluate = async (req, res) => {
  const { token, body } = req.context();
  const data = await scn.evaluate(token, body.findings, body.sector);
  res.json(data);
};

module.exports.listNorms = async (req, res) => {
  const { token } = req.context();
  const data = await scn.listNorms(token);
  res.json(data);
};
