'use strict';

const logger = require('../logger');

function createErrorMiddleware(getOnError) {
  return async function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    let error = err;
    const onError = getOnError();
    if (onError) {
      try {
        error = (await onError(err, req, res)) || err;
      } catch {}
    }

    const status = error.status || error.statusCode || 500;

    if (status >= 500)                         logger.error({ message: error.message, err: error, status });
    else if (status === 400 || status === 409)  logger.warn({ message: error.message, status });
    else                                        logger.debug({ message: error.message, status });

    const body = { error: error.message };
    if (error.errors) body.errors = error.errors;

    res.status(status).json(body);
  };
}

module.exports = createErrorMiddleware;
