'use strict';

const scs = require('../providers/provider.scs');

module.exports.health = async (req, res) => {
  const { token } = req.context();
  const data = await scs.health(token);
  res.json(data);
};

module.exports.host = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.host(token, body.ip);
  res.json(data);
};

module.exports.search = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.search(token, body.query, body.page, body.minify);
  res.json(data);
};

module.exports.count = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.count(token, body.query);
  res.json(data);
};

module.exports.dnsDomain = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.dnsDomain(token, body.domain);
  res.json(data);
};

module.exports.dnsResolve = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.dnsResolve(token, body.hostnames);
  res.json(data);
};

module.exports.alert = async (req, res) => {
  const { token, body } = req.context();
  const data = await scs.createAlert(token, body.name, body.ips);
  res.json(data);
};
