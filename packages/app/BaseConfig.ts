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
              },
              {
                target: 'protolib/lib/RemoteTransport.ts', // Asegúrate de que la ruta sea correcta
                options: { /* Opciones para tu transport */ }
              }
            ]

          }
        } : {}),
      name: name ?? 'default',
      level: 'debug'
    }
  }
}