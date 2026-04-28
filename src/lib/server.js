'use strict';

const http        = require('http');
const path        = require('path');
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const compression = require('compression');
const { middleware: openApiMiddleware } = require('express-openapi-validator');

const logger                = require('./logger');
const contextMiddleware     = require('./middleware/context');
const createErrorMiddleware = require('./middleware/errors');
const { loadSpec, registerRoutes } = require('./router');
const ping              = require('./endpoints/ping');
const createReadyHandler = require('./endpoints/ready');
const setupDocs          = require('./endpoints/docs');

const DEFAULTS = {
  port:                    3000,
  host:                    '0.0.0.0',
  nodeEnv:                 'development',
  swaggerUrl:              '/docs',
  bodySizeLimit:           '300kb',
  corsOrigin:              '*',
  shutdownTimeout:         10000,
  disableRequestValidation:  false,
  disableResponseValidation: false,
};

class Server {
  constructor() {
    this._controllersPath     = './src/controllers/index.js';
    this._openapiPath         = './src/openapi/openapi.yml';
    this._middlewares         = [];
    this._endpointMiddlewares = {};
    this._securityHandlers    = {};
    this._redirections        = {};

    this._httpServer  = null;
    this._config      = null;
    this._state       = { ready: false };
    this._stopping    = false;
    this._connections = new Set();
    this._busySockets = new WeakSet();

    this.onStart            = async () => {};
    this.onShutdown         = async () => {};
    this.onError            = null;
    this.afterExpressConfig = () => {};
  }

  set controllers(v)          { this._controllersPath     = v; }
  set openapi(v)              { this._openapiPath         = v; }
  set middlewares(v)          { this._middlewares         = v; }
  set endpointMiddlewares(v)  { this._endpointMiddlewares = v; }
  set securityHandlers(v)     { this._securityHandlers    = v; }
  set redirections(v)         { this._redirections        = v; }

  _buildConfig() {
    const projectConfig = require(path.resolve('./src/config.js'));
    return Object.assign({}, DEFAULTS, projectConfig);
  }

  async start() {
    if (this._httpServer) throw new Error('Server already started');

    this._config = this._buildConfig();
    const config      = this._config;
    const specPath    = path.resolve(this._openapiPath);
    const spec        = loadSpec(specPath);
    const controllers = require(path.resolve(this._controllersPath));

    const app = express();

    app.use((req, res, next) => {
      if (req.path.startsWith('/docs') || req.path === '/openapi.json') return next();
      helmet()(req, res, next);
    });
    app.use(cors({ origin: config.corsOrigin }));
    app.use(compression());
    app.use(express.json({ limit: config.bodySizeLimit }));
    app.use(express.urlencoded({ extended: true, limit: config.bodySizeLimit }));
    app.use(contextMiddleware);

    app.use((req, res, next) => {
      this._busySockets.add(req.socket);
      res.on('finish', () => {
        this._busySockets.delete(req.socket);
        if (this._stopping) req.socket.destroy();
      });
      next();
    });

    for (const mw of this._middlewares) app.use(mw);

    for (const [from, to] of Object.entries(this._redirections)) {
      app.all(from, (req, res) => res.redirect(307, to));
    }

    app.get('/ping',  ping);
    app.get('/ready', createReadyHandler(() => this._state));
    setupDocs(app, spec, config);

    this.afterExpressConfig(app, spec, config);

    const hasSecurityHandlers = Object.keys(this._securityHandlers).length > 0;
    const validateRequests    = !config.disableRequestValidation;
    const validateResponses   = !config.disableResponseValidation;

    if (validateRequests || validateResponses) {
      app.use(
        openApiMiddleware({
          apiSpec:           specPath,
          validateRequests,
          validateResponses,
          operationHandlers: false,
          validateSecurity:  hasSecurityHandlers
            ? { handlers: this._securityHandlers }
            : false,
        })
      );
    }

    registerRoutes(app, spec, controllers, this._endpointMiddlewares, config.basePath);

    app.use(createErrorMiddleware(() => this.onError));

    this._httpServer = http.createServer(app);

    this._httpServer.on('connection', (socket) => {
      this._connections.add(socket);
      socket.once('close', () => this._connections.delete(socket));
    });

    await new Promise((resolve, reject) => {
      this._httpServer.once('error', reject);
      this._httpServer.listen(config.port, config.host, resolve);
    });

    this._state.ready = true;

    process.once('SIGTERM', () => this.stop());
    process.once('SIGINT',  () => this.stop());

    logger.info({ message: `Server listening on ${config.host}:${config.port}` });

    await this.onStart(app, spec, config);

    return this;
  }

  async stop() {
    if (this._stopping) return;
    this._stopping = true;
    this._state.ready = false;

    logger.info({ message: 'Graceful shutdown started' });

    const timeout = this._config?.shutdownTimeout ?? 10000;

    await new Promise((resolve) => {
      for (const socket of this._connections) {
        if (!this._busySockets.has(socket)) socket.destroy();
      }

      const timer = setTimeout(() => {
        for (const socket of this._connections) socket.destroy();
        resolve();
      }, timeout);

      this._httpServer.close(() => {
        clearTimeout(timer);
        resolve();
      });
    });

    try {
      await this.onShutdown();
    } catch (err) {
      logger.error({ message: 'onShutdown hook threw', err });
    }

    logger.info({ message: 'Graceful shutdown complete' });
    process.exit(0);
  }
}

module.exports = Server;
