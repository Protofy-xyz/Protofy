import { handler } from '../../api'
import fs from 'fs';
import pm2 from 'pm2';
import { getSourceFile, getDefinition, AutoAPI, getRoot } from '../../api'
import { ServiceModel } from './servicesSchema';

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
        uptime: Date.now() -  service.pm2_env.pm_uptime,
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
          uptime: Date.now() - service.pm2_env.pm_uptime ,
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
          context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('update'), entityModel.getNotificationsPayload())
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
        const services:any = await listServices();
        for (const service of services) {
          // Podemos usar 'yield' aquí porque estamos en una función generadora asíncrona
          yield [service.name, JSON.stringify(service)];
        }
      } catch (error) {
        console.error("Error retrieving services:", error);
      }
    },

    async del (key, value) {

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
  prefix: '/adminapi/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*'],
  useDatabaseEnvironment: false
})


export const ServicesAPI = (app, context) => {
  monitorServices(context)
  serviceAutoAPI(app, context)
  app.get('/adminapi/v1/services/:service/logs', handler(async (req, res, session) => {
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



