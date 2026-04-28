'use strict';

const shodanService = require('../services/shodan.service');

module.exports.health = async (req, res) => {
  const result = await shodanService.ping();
  res.json(result);
};

module.exports.host = async (req, res) => {
  const data = await shodanService.getHost(req.body.ip);
  res.json(data);
};

module.exports.search = async (req, res) => {
  const { query, page = 1, minify = true } = req.body;
  const data = await shodanService.search(query, page, minify);
  res.json(data);
};

module.exports.count = async (req, res) => {
  const data = await shodanService.count(req.body.query);
  res.json(data);
};

module.exports.dnsDomain = async (req, res) => {
  const data = await shodanService.dnsDomain(req.body.domain);
  res.json(data);
};

module.exports.dnsResolve = async (req, res) => {
  const data = await shodanService.dnsResolve(req.body.hostnames);
  res.json(data);
};

module.exports.alert = async (req, res) => {
  const { name, ips } = req.body;
  const data = await shodanService.createAlert(name, ips);
  res.json(data);
};
