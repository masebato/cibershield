'use strict';

module.exports = function createReadyHandler(getState) {
  return function ready(req, res) {
    const { ready, reason } = getState();
    if (ready) {
      res.json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready', reason: reason || 'starting' });
    }
  };
};
