
import { getLogger } from 'protolib/base/logger';
import { getBaseConfig } from '../../../packages/app/BaseConfig'
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import http from 'http';
import httpProxy from 'http-proxy';

const isProduction = process.env.NODE_ENV === 'production';
const isFullDev = process.env.DEV_ADMIN_API === '1';

const system = require(isFullDev ? '../../../system.js' : '../../../../../../system.js')

export const startProxy = () => {
    const logger = getLogger('proxy', getBaseConfig("proxy", process, getServiceToken()))

    const Port = process.env.PORT ?? (isProduction ? 8000 : 8080);
    var proxy = httpProxy.createProxyServer({
        ws: true,
        xfwd: true
    });
    var server = http.createServer(function(req, res) {
        // You can define here your custom logic to handle the request
        // and then proxy the request.
        const resolver = system.services.find((resolver) => resolver.route(req))
        if(!resolver) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return
        }
        logger.trace({
            url: req.url,
            target: resolver.endpoint,
            ip: req.connection.remoteAddress,
            method: req.method
        }, "Proxying request for: "+ req.url + " to: " + resolver.endpoint + " from: " + req.connection.remoteAddress + " method: " + req.method)
        proxy.web(req, res, { target: resolver.endpoint });
    });

    server.on('upgrade', (req, socket, head) => {
        const resolver = system.services.find((resolver) => resolver.route(req));
        if (!resolver) {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            socket.destroy();
            return;
        }
        proxy.ws(req, socket, head, { target: resolver.endpoint });
    });
    server.listen(Port);
    logger.debug({ service: { protocol: "http", port: Port } }, "Service started: HTTP")
}
