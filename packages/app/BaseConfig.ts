export function deepMerge(target, source) {
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    if (typeof sourceValue === 'object' && sourceValue !== null) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
}

export const getBaseConfig = (name, process, config?) => {
  const BaseConfig = {
    mqtt: {
      auth: process.env.ENABLE_MQTT_AUTH === "true" ? true : false
    },
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
                  destination: "../../logs/" + name + '.log'
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
  return config ? deepMerge(BaseConfig, config) : BaseConfig
}
