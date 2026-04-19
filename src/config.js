'use strict';

module.exports = {
  port:        process.env.PORT     || 3000,
  corsOrigin:  process.env.CORS_ORIGIN || '*',
  swaggerUrl:  '/docs',
  providers: {
    sau: {
      url: process.env.SAU_URL || 'https://sau.cibershield.com',
      apiKey: process.env.SAU_API_KEY || '1234567890',
    },
    scs: {
      url: process.env.SCS_URL || 'https://scs.cibershield.com',
      apiKey: process.env.SCS_API_KEY || '',
    },
    sar: {
      url: process.env.SAR_URL || 'https://sar.cibershield.com',
      apiKey: process.env.SAR_API_KEY || '',
    },
    san: {
      url: process.env.SAN_URL || 'https://san.cibershield.com',
      apiKey: process.env.SAN_API_KEY || '',
    },
    scn: {
      url: process.env.SCN_URL || 'https://scn.cibershield.com',
      apiKey: process.env.SCN_API_KEY || '',
    },
    sre: {
      url: process.env.SRE_URL || 'https://sre.cibershield.com',
      apiKey: process.env.SRE_API_KEY || '',
    },
  },
};
