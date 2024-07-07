
import { getLogger } from 'protobase';
import { getBaseConfig } from '@my/config'
import { getServiceToken } from 'protonode'
import http from 'http';
import httpProxy from 'http-proxy';
import { join } from 'path';
import fs from 'fs';
var mime = require('mime-types')

const isFullDev = process.env.FULL_DEV === '1';

const system = require(isFullDev ? '../../../system.js' : '../../../../../../system.js')

const startTime = new Date().getTime();

export const startProxy = () => {
    _startProxy(8080, "production") //production proxy on port 8080
    _startProxy(8000, "development") //development proxy on port 8000
}

export const _startProxy = (Port, mode) => {
    const logger = getLogger('proxy', getBaseConfig("proxy", process, getServiceToken()))

    var proxy = httpProxy.createProxyServer({
        ws: true,
        xfwd: true
    });

    proxy.on('proxyReq', function (proxyReq, req, res, options) {
        proxyReq.path = req.url.replace('/_dev/api/', '/api/')
    });

    proxy.on('error', (err, req, res) => {
        if (startTime + 10000 > new Date().getTime()) {
            // Ignore errors that occur within the first 10 seconds of starting the service
            return;
        }
        logger.error({ err, url: req.url }, 'Proxy error occurred');

        if (res.writeHead) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
        }
        res.end('Bad Gateway: Unable to connect to upstream service');
    });

    var server = http.createServer(function (req, res) {
        // You can define here your custom logic to handle the request
        // and then proxy the request.
        //check if request is for a public file
        if (req.url.startsWith('/public/')) {
            logger.trace({ url: req.url }, "Serving public file: " + req.url)
            //remove ../ from url
            const url = req.url.replace(/\.\.\//g, '')
            const path = join('../../data/', mode == "production" ? 'prod': 'dev', url)
            if(!fs.existsSync(path)){
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return
            }

            res.writeHead(200, { 'Content-Type': mime.lookup(path) });
            fs.createReadStream(path).pipe(res)
            return
        }
        const resolver = system.services.find((resolver) => resolver.route(req, mode))
        if (!resolver) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return
        }

        logger.trace({
            url: req.url,
            target: resolver.route(req, mode),
            ip: req.connection.remoteAddress,
            method: req.method
        }, "Proxying request for: " + req.url + " to: " + resolver.route(req, mode) + " from: " + req.connection.remoteAddress + " method: " + req.method)
        proxy.web(req, res, { target: resolver.route(req, mode) });
    });

    server.on('upgrade', (req, socket, head) => {
        const resolver = system.services.find((resolver) => resolver.route(req, mode))
        if (!resolver) {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            socket.destroy();
            return;
        }
        proxy.ws(req, socket, head, { target: resolver.route(req, mode) });
    });
    server.listen(Port);
    logger.debug({ service: { protocol: "http", port: Port } }, "Service started: HTTP")
}
