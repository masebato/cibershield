'use strict';

function makeLogger(boundFields = {}) {
  function write(level, obj) {
    const line = JSON.stringify({ level, ...boundFields, ...obj, time: new Date().toISOString() });
    if (level === 'error') process.stderr.write(line + '\n');
    else process.stdout.write(line + '\n');
  }
  return {
    trace: (obj) => write('trace', obj),
    debug: (obj) => write('debug', obj),
    info:  (obj) => write('info',  obj),
    warn:  (obj) => write('warn',  obj),
    error: (obj) => write('error', obj),
    child: (fields) => makeLogger({ ...boundFields, ...fields }),
  };
}

module.exports = makeLogger();
