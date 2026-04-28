'use strict';

const FALLBACK_REPORTS = [
  {
    ports: [22, 80, 443],
    org: 'Mock Telecom CO',
    country_name: 'Colombia',
    hostnames: ['gateway.mock.local'],
    os: 'Linux',
    vulns: {
      'CVE-2023-44487': {
        cvss: 7.5,
        summary: 'HTTP/2 Rapid Reset attack exposure',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-44487'],
      },
      'CVE-2021-41773': {
        cvss: 7.5,
        summary: 'Path traversal in Apache 2.4.49',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773'],
      },
    },
  },
  {
    ports: [3389, 445],
    org: 'Mock Financial Services',
    country_name: 'Colombia',
    hostnames: ['rdp.mock.local'],
    os: 'Windows Server',
    vulns: {
      'CVE-2019-0708': {
        cvss: 9.8,
        summary: 'Remote Desktop Services RCE (BlueKeep)',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2019-0708'],
      },
      'CVE-2020-0796': {
        cvss: 10.0,
        summary: 'SMBv3 Remote Code Execution vulnerability',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2020-0796'],
      },
    },
  },
  {
    ports: [21, 8080],
    org: 'Mock Retail Group',
    country_name: 'Colombia',
    hostnames: ['legacy.mock.local'],
    os: 'Ubuntu',
    vulns: {
      'CVE-2015-3306': {
        cvss: 10.0,
        summary: 'ProFTPD mod_copy command execution',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2015-3306'],
      },
      'CVE-2022-22965': {
        cvss: 9.8,
        summary: 'Spring4Shell remote code execution',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2022-22965'],
      },
    },
  },
];

function randomItem(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function buildRandomFallbackHost(ip) {
  const selected = randomItem(FALLBACK_REPORTS);
  return {
    ip_str: ip,
    last_update: new Date().toISOString(),
    tags: ['mock', 'fallback', 'shodan-unavailable'],
    ...selected,
  };
}

module.exports = { buildRandomFallbackHost };
