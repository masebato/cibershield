'use strict';

const axios  = require('axios');
const config = require('../config');
const { buildRandomFallbackHost } = require('../mocks/shodan-fallback-reports');

const BASE_URL = 'https://api.shodan.io';

function client() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    params:  { key: config.shodan.apiKey },
  });
}

function shodanError(err) {
  const status  = err.status || err.response?.status || 500;
  const message = err.response?.data?.error || err.message || 'Shodan error';
  const e       = new Error(message);
  e.status      = status >= 400 && status < 500 ? status : 500;
  return e;
}

async function getApiInfo() {
  try {
    const { data } = await client().get('/api-info');
    return {
      queryCredits: Number(data?.query_credits ?? data?.usage_limits?.query_credits ?? 0),
      monitoredIps: Number(data?.monitored_ips ?? data?.usage_limits?.monitored_ips ?? 0),
    };
  } catch (err) {
    throw shodanError(err);
  }
}

function hasSearchFilters(query) {
  if (typeof query !== 'string') return false;
  return /(^|\s)[a-zA-Z_][a-zA-Z0-9_.-]*:/.test(query.trim());
}

function forbidden(message) {
  const err = new Error(message);
  err.status = 403;
  return err;
}

async function ping() {
  try {
    await getApiInfo();
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
    if (config.shodan.mockOnFailure) {
      return buildRandomFallbackHost(ip);
    }
    throw shodanError(err);
  }
}

async function search(query, page = 1, minify = true) {
  try {
    const { queryCredits } = await getApiInfo();
    const safePage = Number.isInteger(page) ? page : parseInt(page, 10) || 1;
    const safeMinify = minify === false ? false : true;

    if (queryCredits <= 0) {
      if (safePage > 1) {
        throw forbidden('Free tier: only page 1 is available without query credits');
      }
      if (hasSearchFilters(query)) {
        throw forbidden('Free tier: search filters require query credits');
      }
    }

    const { data } = await client().get('/shodan/host/search', {
      params: { query, page: safePage, minify: safeMinify },
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
    const { monitoredIps } = await getApiInfo();
    if (monitoredIps <= 0) {
      throw forbidden('Free tier: monitored alerts are not available for this API plan');
    }

    const { data } = await client().post('/shodan/alert', { name, filters: { ip: ips } });
    return data;
  } catch (err) {
    throw shodanError(err);
  }
}

module.exports = { ping, getHost, search, count, dnsDomain, dnsResolve, createAlert };
