const pino = require('pino');

module.exports = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  name: 'proxy',
  level: 'debug'
});