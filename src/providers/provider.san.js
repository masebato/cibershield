'use strict';

const axios = require('axios');
const config = require('../config');

const base = () => config.providers.san.url;
const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports.listAlerts = async (token, companyId, query) => {
  const r = await axios.get(`${base()}/api/san/alerts/${companyId}`, { headers: auth(token), params: query });
  return r.data;
};

module.exports.markRead = async (token, id) => {
  const r = await axios.put(`${base()}/api/san/alerts/${id}/read`, {}, { headers: auth(token) });
  return r.data;
};

module.exports.markAllRead = async (token) => {
  const r = await axios.put(`${base()}/api/san/alerts/read-all`, {}, { headers: auth(token) });
  return r.data;
};

module.exports.deleteAlert = async (token, id) => {
  const r = await axios.delete(`${base()}/api/san/alerts/${id}`, { headers: auth(token) });
  return r.data;
};
