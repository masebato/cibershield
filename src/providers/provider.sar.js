'use strict';

const axios = require('axios');
const config = require('../config');

const base = () => config.providers.sar.url;
const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports.analyze = async (token, asset_type, asset_value) => {
  const r = await axios.post(`${base()}/api/sar/analyze`, { asset_type, asset_value }, { headers: auth(token) });
  return r.data;
};

module.exports.listAssets = async (token, companyId) => {
  const r = await axios.get(`${base()}/api/sar/assets/${companyId}`, { headers: auth(token) });
  return r.data;
};

module.exports.getAnalysisById = async (token, id) => {
  const r = await axios.get(`${base()}/api/sar/analysis/${id}`, { headers: auth(token) });
  return r.data;
};
