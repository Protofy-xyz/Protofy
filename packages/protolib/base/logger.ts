import pino from 'pino';
import { getConfig } from './Config';

var logger;

export const getLogger = () => {
  const config = getConfig()
  if (!logger) {
    logger = pino(config.logger)
  }
  
  //wrapper for pino, allowing to have a third parameter id, to correlate messages with specific code nodes
  return {
    error: (data, msg?, id?) => logger.error(data, msg),
    fatal: (data, msg?, id?) => logger.fatal(data, msg),
    warn: (data, msg?, id?) => logger.warn(data, msg),
    info: (data, msg?, id?) => logger.info(data, msg),
    debug: (data, msg?, id?) => logger.debug(data, msg),
    trace: (data, msg?, id?) => logger.trace(data, msg),
  }
}
