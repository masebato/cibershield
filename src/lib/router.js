'use strict';

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadSpec(specPath) {
  const content = fs.readFileSync(path.resolve(specPath), 'utf8');
  return specPath.endsWith('.json') ? JSON.parse(content) : yaml.load(content);
}

function toExpressPath(openApiPath) {
  return openApiPath.replace(/\{([^}]+)\}/g, ':$1');
}

function wrapController(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

function registerRoutes(app, spec, controllers, endpointMiddlewares = {}, basePath = '/') {
  const base = basePath === '/' ? '' : basePath;

  for (const [apiPath, pathItem] of Object.entries(spec.paths || {})) {
    const expressPath = base + toExpressPath(apiPath);

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;

      const { operationId } = operation;
      if (!operationId) continue;

      const controller = controllers[operationId];
      if (!controller) {
        process.stderr.write(`[server] No controller for operationId "${operationId}"\n`);
        continue;
      }

      const xMiddlewares = (operation['x-middlewares'] || [])
        .map((name) => endpointMiddlewares[name])
        .filter(Boolean);

      app[method](expressPath, ...xMiddlewares, wrapController(controller));
    }
  }
}

module.exports = { loadSpec, registerRoutes };
