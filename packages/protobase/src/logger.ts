import pino from 'pino';
import { getConfig } from './Config';

export const getLogger = (module?: string, submodule?: string, entity?: string, userConfig?) => {
  const config = userConfig ?? getConfig()
  const baseLogger = pino(config.logger)

  let logger = baseLogger
  if (module || submodule || entity) {
    logger = baseLogger.child({
      ...(module ? { module } : {}),
      ...(submodule ? { submodule } : {}),
      ...(entity ? { entity } : {})
    })
  }

  return {
    error: (data, msg?, id?) => logger.error(data, msg),
    fatal: (data, msg?, id?) => logger.fatal(data, msg),
    warn:  (data, msg?, id?) => logger.warn(data, msg),
    info:  (data, msg?, id?) => logger.info(data, msg),
    debug: (data, msg?, id?) => logger.debug(data, msg),
    trace: (data, msg?, id?) => logger.trace(data, msg),
  }
}