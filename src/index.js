'use strict';

const server = require('@masebato/apix');

server.openapi     = './src/openapi/openapi.yml';
server.controllers = './src/controllers/index.js';

// server.securityHandlers = {
//   BearerAuth: async (req, scopes, schema) => {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     if (!token) throw new Error('Missing token');
//     req.user = await verifyToken(token);
//     return true;
//   },
// };

server.onStart = async (app, openapi, config) => {
  console.log(`Cibershield started [${config.nodeEnv}] on port ${config.port}`);
};

server.onShutdown = async () => {
  console.log('Cibershield shutting down');
};

server.onError = async (err, req, res) => {
  return err;
};

server.start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
