'use strict';

const logger = require('../logger');

const HTTP_TITLES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

function clientAcceptsJson(acceptHeader) {
  if (!acceptHeader) return true;
  return acceptHeader.includes('application/json') || acceptHeader.includes('*/*');
}

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

    const status        = error.status || error.statusCode || 500;
    const transactionId = res.getHeader('x-transaction-id');
    const reqLogger     = req.logger || logger;

    if (status >= 500)                        reqLogger.error({ message: error.message, err: error, status });
    else if (status === 400 || status === 409) reqLogger.warn({ message: error.message, status });
    else                                       reqLogger.debug({ message: error.message, status });

    if (clientAcceptsJson(req.headers?.accept)) {
      res.status(status).type('application/problem+json').json({
        type:   `https://httpstatuses.com/${status}`,
        title:  error.title || HTTP_TITLES[status] || 'Error',
        status,
        detail: error.message,
        transactionId,
        ...(error.errors ? { errors: error.errors } : {}),
      });
    } else {
      res.status(status).type('text/plain').send(error.message);
    }
  };
}

module.exports = createErrorMiddleware;
