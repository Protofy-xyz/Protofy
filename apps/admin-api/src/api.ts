import { app, getMQTTClient } from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import adminModules from 'protolib/adminapi'
import BundleAPI from 'app/bundles/adminapi'
import httpLogger from "pino-http";
import { getLogger } from 'protolib/base';

const modulesDir = path.join(__dirname, 'modules');
const logger = getLogger()
logger.debug({ adminModules }, 'Admin modules: ', JSON.stringify(adminModules))

fs.readdir(modulesDir, (error, files) => {
  if (error) {
    logger.error({ error }, "Error reading modules directory")
    return
  }

  files.forEach((file) => {
    if (path.extname(file) === '.ts') {
      require(path.join(modulesDir, file));
      logger.debug(`API Module loaded: ${file.substr(0, file.length - 3)}`)
    }
  })
})

export const logRequest = httpLogger({
  serializers: {
    req: (req) => {
      if (process.env.NODE_ENV === "development") {
        return {
          method: req.method,
          url: req.url,
        };
      } else {
        return req;
      }
    },
    res: (res) => {
      if (process.env.NODE_ENV === "development") {
        return {
          code: res.statusCode,
        };
      } else {
        return res;
      }
    },
  },
  level: "info",
  transport: {
    target: 'pino-pretty'
  }
});

app.use(logRequest);
BundleAPI(app, { mqtt: getMQTTClient() })
export default app