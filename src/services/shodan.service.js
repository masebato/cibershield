'use strict';

const axios  = require('axios');
const config = require('../config');

const BASE_URL = 'https://api.shodan.io';

function client() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    params:  { key: config.shodan.apiKey },
  });
}

function shodanError(err) {
  const status  = err.response?.status  || 500;
  const message = err.response?.data?.error || err.message || 'Shodan error';
  const e       = new Error(message);
  e.status      = status >= 400 && status < 500 ? status : 500;
  return e;
}

async function ping() {
  try {
    await client().get('/api-info');
    return { service: 'scs', status: 'ok' };
  } catch (err) {
    throw shodanError(err);
  }
}

async function getHost(ip) {
  try {
    const { data } = await client().get(`/shodan/host/${ip}`);
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

async function search(query, page = 1, minify = false) {
  try {
    const { data } = await client().get('/shodan/host/search', {
      params: { query, page, minify },
    });
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

async function count(query) {
  try {
    const { data } = await client().get('/shodan/host/count', {
      params: { query },
    });
    return { total: data.total };
  } catch (err) {
    throw shodanError(err);
  }
}

async function dnsDomain(domain) {
  try {
    const { data } = await client().get(`/dns/domain/${domain}`);
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

async function dnsResolve(hostnames) {
  try {
    const { data } = await client().get('/dns/resolve', {
      params: { hostnames: hostnames.join(',') },
    });
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

async function createAlert(name, ips) {
  try {
    const { data } = await client().post('/shodan/alert', { name, filters: { ip: ips } });
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

module.exports = { ping, getHost, search, count, dnsDomain, dnsResolve, createAlert };
