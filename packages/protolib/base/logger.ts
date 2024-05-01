import pino from 'pino';
import { getConfig } from './Config';

var loggers = {};

export const getLogger = (logId='default', userConfig?) => {
  const config = userConfig ?? getConfig()
  if (!loggers[logId]) {
    loggers[logId] = pino(config.logger)
  }
  
  //wrapper for pino, allowing to have a third parameter id, to correlate messages with specific code nodes
  return {
    error: (data, msg?, id?) => loggers[logId].error(data, msg),
    fatal: (data, msg?, id?) => loggers[logId].fatal(data, msg),
    warn: (data, msg?, id?) => loggers[logId].warn(data, msg),
    info: (data, msg?, id?) => loggers[logId].info(data, msg),
    debug: (data, msg?, id?) => loggers[logId].debug(data, msg),
    trace: (data, msg?, id?) => loggers[logId].trace(data, msg),
  }
}
