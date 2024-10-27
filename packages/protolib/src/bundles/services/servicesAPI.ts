import { handler, AutoAPI, getServiceToken } from 'protonode'
import fs from 'fs';
import pm2 from 'pm2';
import { ServiceModel } from './servicesSchema';
import { generateEvent } from '../library';
import { generate as uuidv4 } from 'short-uuid'

const readService = async (name, cb) => {
  pm2.connect(err => {
    if (err) {
      throw new Error(`Error connecting to pm2: ${err}`);
    }

    pm2.describe(name, (err, desc) => {
      pm2.disconnect()
      if (err) {
        throw new Error(`Error getting service description: ${err}`);
      }
      const service = desc[0];
      cb({
        name: service.name,
        status: service.pm2_env.status,
        uptime: Date.now() - service.pm2_env.pm_uptime,
        restarts: service.pm2_env.restart_time,
        memory: service.monit.memory,
        cpu: service.monit.cpu
      })
    });
  });
}

const listServices = () => {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) {
        reject(new Error(`Error connecting to PM2: ${err}`));
        return;
      }

      pm2.list((err, list) => {
        pm2.disconnect();
        if (err) {
          reject(new Error(`Error getting service list: ${err}`));
          return;
        }

        const serviceList = list.map(service => ({
          name: service.name,
          status: service.pm2_env.status,
          uptime: Date.now() - service.pm2_env.pm_uptime,
          restarts: service.pm2_env.restart_time,
          memory: service.monit.memory,
          cpu: service.monit.cpu
        }));

        resolve(serviceList);
      });
    });
  });
};

const monitorServices = (context) => {
  pm2.connect(err => {
    if (err) {
      console.error(`Error connecting to PM2: ${err}`);
      return;
    }

    setInterval(() => {
      pm2.list((err, list) => {
        if (err) {
          console.error(`Error getting service list: ${err}`);
          pm2.disconnect();
          return;
        }

        list.forEach(service => {
          const serviceData = {
            name: service.name,
            status: service.pm2_env.status,
            uptime: Date.now() - service.pm2_env.pm_uptime,
            restarts: service.pm2_env.restart_time,
            memory: service.monit.memory,
            cpu: service.monit.cpu
          };

          const entityModel = ServiceModel.load(serviceData)
          if (context.mqtt) {
            context.mqtt.publish(entityModel.getNotificationsTopic('update'), entityModel.getNotificationsPayload())
          }
        });
      });
    }, 1000);
  });
};


const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      try {
        // Esperamos los servicios de forma asíncrona
        const services: any = await listServices();
        for (const service of services) {
          // Podemos usar 'yield' aquí porque estamos en una función generadora asíncrona
          yield [service.name, JSON.stringify(service)];
        }
      } catch (error) {
        console.error("Error retrieving services:", error);
      }
    },

    async del(key, value) {

    },

    async put(key, value) {

    },

    async get(key) {
      const name = key;
      return new Promise((resolve, reject) => {
        readService(name, (service) => {
          resolve(JSON.stringify(service));
        });
      });
    }
  };

  return db;
}

const serviceAutoAPI = AutoAPI({
  modelName: 'services',
  modelType: ServiceModel,
  prefix: '/api/core/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*']
})

console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

const getServicePath = async (service) => {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) {
        reject(new Error(`Error connecting to PM2: ${err}`));
        return;
      }

      pm2.describe(service, (err, desc) => {
        pm2.disconnect();
        if (err) {
          reject(new Error(`Error getting service description: ${err}`));
          return;
        }

        resolve(desc[0].pm2_env['PWD']);
      });
    });
  });
}

export const ServicesAPI = (app, context) => {
  monitorServices(context)
  serviceAutoAPI(app, context)
  app.get('/api/core/v1/services/:service/restart', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const service = req.params.service;

    pm2.connect(err => {
      if (err) {
        console.error(`Error connecting to pm2: ${err}`);
        res.status(500).send({ error: "Error connecting to pm2" });
        return;
      }

      generateEvent({
        path: 'services/' + service + '/restart',
        from: 'core',
        user: session.user.id,
        payload: { service }
      }, getServiceToken())

      pm2.restart(service, (err, proc) => {
        pm2.disconnect();
        if (err) {
          console.error(`Error restarting service: ${err}`);
          res.status(500).send({ error: "Error restarting service" });
          return;
        }

        res.send({ success: true });
      });
    });
  }));

  app.get('/api/core/v1/services/:service/package', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }
    const packageId = uuidv4()

    const service = req.params.service;

    const _generateEvent = (type, payload?) => {
      generateEvent({
        path: 'services/' + service + '/package/' + packageId + '/' + type,
        from: 'core',
        user: session.user.id,
        payload: { packageId, ...payload }
      }, getServiceToken())
    }
    try {
      const path = await getServicePath(service);
      //check if the service has a package command in the package.json
      const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.package) {
        res.status(400).send({ error: "Service does not have a package script" });
        return;
      }

      _generateEvent('start')
      res.send({ packageId: packageId });
      //run the package command
      const { exec } = require('child_process');
      exec('npm run package', { cwd: path, windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error packaging service: ${error}`);
          _generateEvent('error', { error })
          res.status(500).send({ error: "Error packaging service" });
          return;
        }
        _generateEvent('done')
      });
    } catch (e) {
      console.error(`Error getting service path: ${e}`);
      _generateEvent('error', { error: e })
      res.status(500).send({ error: "Error getting service information" });
    }
  }));

  app.get('/api/core/v1/services/:service/logs', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    //@ts-ignore
    const linesRequested = req.query.lines ? parseInt(req.query.lines, 10) : 5000;
    if (isNaN(linesRequested)) {
      res.status(400).send({ error: "Invalid lines parameter" });
      return;
    }

    pm2.connect(err => {
      if (err) {
        console.error('Error connecting to pm2:', err);
        res.status(500).send({ error: "Error connecting to pm2" });
        return;
      }

      pm2.describe(req.params.service, (err, desc) => {
        pm2.disconnect();
        if (err || desc.length === 0) {
          res.status(500).send({ error: "Error getting service description" });
          return;
        }

        const logFilePath = desc[0].pm2_env.pm_out_log_path;

        readLastNLines(logFilePath, linesRequested).then(logs => {
          res.send(logs);
        }).catch(fileErr => {
          console.error('Error reading log files:', fileErr);
          res.status(500).send({ error: "Error reading log files" });
        });
      });
    });
  }));

  async function readLastNLines(file, n) {
    const stats = fs.statSync(file);
    const chunkSize = 1024;
    let filePosition = stats.size - chunkSize;
    let linesCount = 0;
    let output = '';

    while (filePosition > 0 && linesCount < n) {
      const buffer = Buffer.alloc(chunkSize);
      let bytesRead = fs.readSync(fs.openSync(file, 'r'), buffer, 0, chunkSize, filePosition);
      output = buffer.toString('utf8') + output;
      linesCount = (output.match(/\n/g) || []).length;
      filePosition -= chunkSize;
    }

    if (linesCount >= n) {
      output = output.split('\n').slice(-n).join('\n');
    }

    return output;
  }
}



