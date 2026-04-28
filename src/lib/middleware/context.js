'use strict';

const { randomUUID } = require('crypto');
const logger = require('../logger');

function contextMiddleware(req, res, next) {
  const transactionId = req.headers['x-transaction-id'] || randomUUID();

  res.setHeader('x-transaction-id', transactionId);

  req.logger = logger.child({ transactionId });

  req.context = function () {
    return {
      params:        req.params,
      query:         req.query,
      body:          req.body,
      headers:       req.headers,
      token:         req.headers.authorization || null,
      transactionId,
    };
  };

  next();
}

module.exports = contextMiddleware;
