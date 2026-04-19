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
  },
};
