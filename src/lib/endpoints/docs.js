'use strict';

const swaggerUi = require('swagger-ui-express');

module.exports = function setupDocs(app, spec, config) {
  if (config.nodeEnv !== 'production') {
    app.get('/openapi.json', (req, res) => res.json(spec));
  }

  if (config.swaggerUrl) {
    app.use(
      config.swaggerUrl,
      swaggerUi.serve,
      swaggerUi.setup(spec, { customSiteTitle: 'CiberShield API Docs' })
    );
  }
};
