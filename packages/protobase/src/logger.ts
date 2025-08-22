import pino from 'pino';
import { getConfig } from './Config';

export const getLogger = (meta?: Object, userConfig?) => {
  const config = userConfig ?? getConfig()
  const baseLogger = pino(config.logger)

  let logger = baseLogger
  if (meta && typeof meta !== 'string') {
    logger = baseLogger.child({
      _meta: {...meta}
    })
  }

  return {
    error: (data, msg?, id?) => logger.error(data, msg),
    fatal: (data, msg?, id?) => logger.fatal(data, msg),
    warn: (data, msg?, id?) => logger.warn(data, msg),
    info: (data, msg?, id?) => logger.info(data, msg),
    debug: (data, msg?, id?) => logger.debug(data, msg),
    trace: (data, msg?, id?) => logger.trace(data, msg),
  }
}