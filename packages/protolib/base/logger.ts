import pino from 'pino';
import { getConfig } from './Config';

var logger;

export const getLogger = () => {
  const config = getConfig()
  if (!logger) {
    logger = pino(config.logger)
  }
  return logger
}
