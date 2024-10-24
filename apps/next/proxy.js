
const system = require('../../system.js');
const httpProxy = require('http-proxy');
const protobose = require('protobase')
const getLogger = protobose.getLogger
const protonode = require('protonode')
const config = require('@my/config')

const isFullDev = process.env.FULL_DEV === '1';
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const setupProxyHandler = (name, server, handle) => {
    const logger = getLogger(name, config.getBaseConfig(name, process, protonode.getServiceToken()))
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

    server.all('*', (req, res) => {
        if(!isFullDev && system['alwaisCompiledPaths'] && system['redirectToCompiled']) {
          //check if alwaisCompiledPaths array contains a path that matches the start of the request url
          const isCompiled = system['alwaisCompiledPaths'].some(path => req.url.startsWith(path));
          if(isCompiled) {
            return system.redirectToCompiled(req, res)
          }
        }
    
        if (req.url.startsWith('/public/')) {
            logger.trace({ url: req.url }, "Serving public file: " + req.url)
            //remove ../ from url
            const url = decodeURIComponent(req.url.replace(/\.\.\//g, ''))
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
    
        if (!resolver || resolver.name == name) {
          return handle(req, res)
        }
    
        logger.trace({
            url: req.url,
            target: resolver.route(req, mode),
            ip: req.connection.remoteAddress,
            method: req.method
        }, "Proxying request for: " + req.url + " to: " + resolver.route(req, mode) + " from: " + req.connection.remoteAddress + " method: " + req.method)
        proxy.web(req, res, { target: resolver.route(req, mode) });
    });
}

module.exports = setupProxyHandler;