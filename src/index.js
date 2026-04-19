'use strict';

const server = require('@masebato/apix');
const { errors: { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } } = require('@masebato/apix');

server.openapi     = './src/openapi/openapi.yml';
server.controllers = './src/controllers/index.js';

// server.securityHandlers = {
//   BearerAuth: async (req, scopes, schema) => {
//     const token = req.context().token?.replace('Bearer ', '');
//     if (!token) throw new UnauthorizedError('Missing token');
//     req.user = await verifyToken(token);
//     return true;
//   },
// };

// Converts axios proxy errors from backend services into typed apix errors
// so the error middleware can format them with the correct HTTP status.
server.onError = async (err) => {
  if (!err.response) return err;
  const { status, data } = err.response;
  const message = data?.error || data?.message || err.message;
  const map = {
    400: BadRequestError,
    401: UnauthorizedError,
    403: ForbiddenError,
    404: NotFoundError,
    409: ConflictError,
  };
  const Ctor = map[status];
  return Ctor ? new Ctor(message) : new AppError(message, status || 502);
};

server.onStart = async (app, openapi, config) => {
  console.log(`Cibershield started [${config.nodeEnv}] on port ${config.port}`);
};

server.onShutdown = async () => {
  console.log('Cibershield shutting down');
};

server.start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
