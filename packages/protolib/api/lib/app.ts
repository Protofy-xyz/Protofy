import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import httpLogger from "pino-http";

export const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
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
}))