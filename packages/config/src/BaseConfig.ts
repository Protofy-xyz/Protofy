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

export const getConfigWithoutSecrets = (config) => {
  const forbiddenKeys = ['secret', 'token', 'password'];

  const filterConfig = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          return filterConfig(item);
        }
        return item;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        if (!forbiddenKeys.includes(key)) {
          acc[key] = filterConfig(obj[key]);
        }
        return acc;
      }, {});
    }
    return obj;
  };

  return filterConfig(config);
};

export const getBaseConfig = (name, process, token?, config?) => {
  const BaseConfig = {
    mqtt: {
      auth: process.env.ENABLE_MQTT_AUTH === "true" ? true : false
    },
    logger: {
      transport: {
        targets: [
          //prettify logs if in server-side, and only in development mode
          ...(process && typeof window === "undefined" ? [{
            target: 'pino-pretty',
            level: 'debug',
            options: {
              colorize: true,
              ignore: 'pid,hostname,time'
            }
          }] : []),
          //adds log to file if in server-side
          ...(process && typeof window === "undefined" ? [
            {
              target: 'pino/file',
              level: 'trace',
              options: {
                destination: "../../logs/" + name + '.log'
              }
            }
          ] : []),
          //adds log to mqtt if in server-side and a serviceToken is available
          ...(process && typeof window === "undefined" && token ? [
            {
              target: __dirname+'/../../protobase/lib/RemoteTransport.ts',
              level: 'debug',
              options: {
                username: name,
                password: token
              }
            }
          ] : []),
        ]
      },
      name: name ?? 'default',
      level: 'trace'
    }
  }

  return config ? deepMerge(BaseConfig, config) : BaseConfig
}
