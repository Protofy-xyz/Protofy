import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import httpLogger from "pino-http";
import { getConfig } from '../../base/Config';
import { getLogger } from '../../base/logger';
import { handler } from './handler'
import listEndpoints from "express-list-endpoints";
import { hasPermission } from '../../base/lib/perms';

const logger = getLogger()
const config = getConfig()
export const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(httpLogger({
    customSuccessMessage: function (req, res) {
        return `${req.method} ${req.originalUrl} - ${res.statusCode}`;
    },
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

    ...config.logger,
    useLevel: 'debug'
}))

app.get(global.defaultRoute+'/endpoints', handler(async (req, res, session, next) => {
    hasPermission(session, 'admin/endpoints/list')
    res.send(listEndpoints(app))
}))

logger.debug({route: global.defaultRoute}, "Default route: "+global.defaultRoute)
