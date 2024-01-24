import pino from 'pino';

var config =  {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  name: 'default',
  level: 'debug'
}
var logger;

export const setLoggerConfig = (customConfig)=> {
  logger = undefined //clear cache
  config = {...config, ...customConfig}
  return config
}

export const getLogger = ()=>{
  if (!logger) {
    logger = pino(config)
  }
  return logger
}
