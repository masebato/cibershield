'use strict';

const axios = require('axios');
const config = require('../config');

const base = () => config.providers.sre.url;
const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports.listReports = async (token, companyId) => {
  const r = await axios.get(`${base()}/api/sre/report/${companyId}/list`, { headers: auth(token) });
  return r.data;
};

module.exports.generateReport = async (token, companyId, body) => {
  const r = await axios.post(`${base()}/api/sre/report/${companyId}/generate`, body, { headers: auth(token) });
  return r.data;
};

module.exports.latestReport = async (token, companyId) => {
  const r = await axios.get(`${base()}/api/sre/report/${companyId}/latest`, {
    headers: auth(token),
    responseType: 'arraybuffer',
  });
  return r;
};
