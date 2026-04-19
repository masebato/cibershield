'use strict';

const scs = require('../providers/provider.scs');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.health = async (req, res) => {
  try {
    const data = await scs.health(token(req));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.host = async (req, res) => {
  try {
    const data = await scs.host(token(req), req.body.ip);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.search = async (req, res) => {
  try {
    const { query, page, minify } = req.body;
    const data = await scs.search(token(req), query, page, minify);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.count = async (req, res) => {
  try {
    const data = await scs.count(token(req), req.body.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.dnsDomain = async (req, res) => {
  try {
    const data = await scs.dnsDomain(token(req), req.body.domain);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.dnsResolve = async (req, res) => {
  try {
    const data = await scs.dnsResolve(token(req), req.body.hostnames);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.alert = async (req, res) => {
  try {
    const { name, ips } = req.body;
    const data = await scs.createAlert(token(req), name, ips);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};
