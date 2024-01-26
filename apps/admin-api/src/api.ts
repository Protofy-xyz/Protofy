import { app, getMQTTClient } from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import adminModules from 'protolib/adminapi'
import BundleAPI from 'app/bundles/adminapi'
import httpLogger from "pino-http";
import { getLogger } from 'protolib/base';
const logger = getLogger()

export default async () => {
  app.use(httpLogger({
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
  }));
  BundleAPI(app, { mqtt: getMQTTClient() })
  return app
}