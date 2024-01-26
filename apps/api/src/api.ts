import { app, getMQTTClient } from 'protolib/api'
import * as path from 'path';
import * as fs from 'fs';
import BundleAPI from 'app/bundles/apis'
import httpLogger from "pino-http";
import {getLogger } from 'protolib/base';
const logger = getLogger()

export default async () => {
    const mqtt = getMQTTClient()

    const topicSub = (topic, cb) => {
        mqtt.subscribe(topic)
        mqtt.on("message", (topic, message) => {
            const parsedMessage = message.toString();
            cb(parsedMessage, topic)
        });
    };
    
    const topicPub = (topic, data) => {
        mqtt.publish(topic, data)
    }
    
    const deviceSub = (deviceName, component, componentName, cb) => {
        return topicSub(deviceName + '/' + component + '/' + componentName + '/state', cb)
    }
    
    const devicePub = async (deviceName, component, componentName, command) => {
        if (typeof command == "string") {
            topicPub(deviceName + '/' + component + '/' + componentName + '/command', command)
        } else {
            topicPub(deviceName + '/' + component + '/' + componentName + '/command', JSON.stringify(command))
        }
    }
    
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
    
    BundleAPI(app, { mqtt, devicePub, deviceSub })
    return app
}