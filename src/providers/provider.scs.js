'use strict';

const axios = require('axios');
const config = require('../config');

const base = () => config.providers.scs.url;
const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports.health = async (token) => {
  const r = await axios.get(`${base()}/api/scs/health`, { headers: auth(token) });
  return r.data;
};

module.exports.host = async (token, ip) => {
  const r = await axios.post(`${base()}/api/scs/host`, { ip }, { headers: auth(token) });
  return r.data;
};

module.exports.search = async (token, query, page, minify) => {
  const r = await axios.post(`${base()}/api/scs/search`, { query, page, minify }, { headers: auth(token) });
  return r.data;
};

module.exports.count = async (token, query) => {
  const r = await axios.post(`${base()}/api/scs/count`, { query }, { headers: auth(token) });
  return r.data;
};

module.exports.dnsDomain = async (token, domain) => {
  const r = await axios.post(`${base()}/api/scs/dns/domain`, { domain }, { headers: auth(token) });
  return r.data;
};

module.exports.dnsResolve = async (token, hostnames) => {
  const r = await axios.post(`${base()}/api/scs/dns/resolve`, { hostnames }, { headers: auth(token) });
  return r.data;
};

module.exports.createAlert = async (token, name, ips) => {
  const r = await axios.post(`${base()}/api/scs/alert`, { name, ips }, { headers: auth(token) });
  return r.data;
};
