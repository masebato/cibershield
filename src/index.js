'use strict';

const jwt    = require('jsonwebtoken');
const server = require('@masebato/apix');
const config = require('./config');
const db     = require('./database');
const { migrate } = require('./database/migrate');

server.openapi     = './src/openapi/openapi.yml';
server.controllers = './src/controllers/index.js';

server.securityHandlers = {
  bearerAuth: async (req) => {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      const err = new Error('Missing or malformed Authorization header');
      err.status = 401;
      throw err;
    }
    const token = header.slice(7);
    try {
      req.user = jwt.verify(token, config.jwt.secret);
      return true;
    } catch {
      const err = new Error('Invalid or expired token');
      err.status = 401;
      throw err;
    }
  },
};

server.onStart = async (app, openapi, cfg) => {
  await migrate();
  console.log(`Cibershield started [${cfg.nodeEnv}] on port ${cfg.port}`);
};

server.onShutdown = async () => {
  await db.close();
  console.log('Cibershield shutting down');
};

server.onError = async (err) => {
  return err;
};

server.start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
