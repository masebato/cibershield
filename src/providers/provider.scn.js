'use strict';

const axios = require('axios');
const config = require('../config');

const base = () => config.providers.scn.url;
const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports.evaluate = async (token, findings, sector) => {
  const r = await axios.post(`${base()}/api/scn/evaluate`, { findings, sector }, { headers: auth(token) });
  return r.data;
};

module.exports.listNorms = async (token) => {
  const r = await axios.get(`${base()}/api/scn/norms`, { headers: auth(token) });
  return r.data;
};
