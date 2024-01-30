export const getBaseConfig = (name, process) => {
  return {
    logger: {
      ...(process && process.env.NODE_ENV === 'development' && typeof window === "undefined" ?
        {
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                level: 'info',
                options: {
                  colorize: true
                }
              },
              {
                target: 'pino/file',
                level: 'debug',
                options: {
                  destination: "../../logs/"+name+'.log'
                }
              }
            ]

          }
        } : {}),
      name: name ?? 'default',
      level: 'debug'
    }
  }
}