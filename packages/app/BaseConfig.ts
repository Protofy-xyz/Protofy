export const getBaseConfig = (process) => {
    return {
        logger: {
            ...(process && process.env.NODE_ENV === 'development' && typeof window === "undefined" ?
                {
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            colorize: true
                        }
                    }
                } : {}),
            name: 'default',
            level: 'info'
        }
    }
}