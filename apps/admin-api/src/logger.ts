import Pino from 'pino'

export const logger = Pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    name: 'admin-api',
    level: 'debug'
});