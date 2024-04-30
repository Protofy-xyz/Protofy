
const Redbird = require('redbird-no-etcd');
import {environments} from 'app/bundles/environments'
import { getLogger } from 'protolib/base/logger';

export const startProxy = () => {
    const logger = getLogger()

    const isProduction = process.env.NODE_ENV === 'production';
    const Port = process.env.PORT ?? (isProduction ? 8000 : 8080);
    const defaultEnvironment = environments[isProduction ? 'prod' : 'dev']
    
    function getEnvironment(key, host, req) {
        const prefix = host.split('.')[0];
        const environ = environments[prefix] ?? defaultEnvironment;
        const result = environ[key];
    
        // Only rewrite host for external domains
        if (environ.rewriteHost && !result.startsWith('http://localhost')) {
            // Additional check to prevent redirection when already on the correct domain
            if (!host.endsWith(environ.rewriteHost)) {
                req.headers['host'] = environ.rewriteHost;
            }
        }
        return result;
    }
    
    function addClientIpHeader(req) {
        var clientIp = req.connection.remoteAddress;
        req.headers['X-Client-IP'] = clientIp;
    }
    
    var customResolver1 = function (host, url, req) {
        addClientIpHeader(req);
    
        if (/^\/api\//.test(url)) {
            return getEnvironment('api', host, req);
        }
    };
    
    customResolver1['priority'] = 100;
    
    var customResolver2 = function (host, url, req) {
        addClientIpHeader(req);
    
        if (/^\/adminapi\//.test(url)) {
            return getEnvironment('adminApi', host, req);
        } else if (url === '/websocket') {
            return getEnvironment('adminApi', host, req);
        }
    };
    
    customResolver2['priority'] = 101;
    
    var customResolver3 = function (host, url, req) {
        addClientIpHeader(req);
    
        if (/^\/admin\//.test(url)) {
            return getEnvironment('admin', host, req);
        }
    
    };
    
    customResolver3['priority'] = 103;
    
    var customResolver4 = function (host, url, req) {
        addClientIpHeader(req);
        
        if (/^\/documentation/.test(url)) {
            return getEnvironment('docs', host, req);
        }
    
    };
    
    customResolver4['priority'] = 104;
    
    var devResolver = function (host, url, req) {
        if (isProduction && host.startsWith('dev.')) {
            return 'http://localhost:8080';
        }
    };
    
    devResolver['priority'] = 200;
    
    
    
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    //@ts-ignore
    process.stdout.write = (chunk, encoding, callback) => {
        const data = chunk.toString();
        const content = JSON.parse(data)
        logger.debug({...content, level: 20});
        if(content.level == 50 && content.code != 'ECONNREFUSED' && content.code != 'ECONNRESET') {
            originalStdoutWrite(chunk, encoding, callback); //display critical errors in console
        }
    
    };
    
    process.on('uncaughtException', (err) => {
        originalStdoutWrite('whoops! there was an error');
    });
    
    var proxy = new Redbird({
        port: Port,
        bunyan: {
            name: "proxy"
        },
        resolvers: [
            devResolver,
            customResolver1,
            customResolver2,
            customResolver3,
            customResolver4,
            function (host, url, req) {
                return getEnvironment('frontend', host, req);
            }
        ]
    });
    
    logger.debug({ service: { protocol: "http", port: Port } }, "Service started: HTTP")
}
