
const Redbird = require('redbird-no-etcd');
import { getLogger } from 'protolib/base/logger';
import { getBaseConfig } from '../../../packages/app/BaseConfig'
import { getServiceToken } from 'protolib/api/lib/serviceToken'


const isProduction = process.env.NODE_ENV === 'production';
const isFullDev = process.env.DEV_ADMIN_API === '1';

const system = require(isFullDev?'../../../system.js':'../../../../../../system.js')

export const startProxy = () => {
    const logger = getLogger('proxy', getBaseConfig("proxy", process, getServiceToken()))

    const Port = process.env.PORT ?? (isProduction ? 8000 : 8080);
    
    function addClientIpHeader(req) {
        var clientIp = req.connection.remoteAddress;
        req.headers['X-Client-IP'] = clientIp;
    }

    const resolvers = system.services.map((service) => {
        const fn = function (host, url, req) {
            if (!service.disabled && service.route && service.route(url, host, req)) {
                addClientIpHeader(req);
                return service.endpoint;
            }
        }
        fn.priority = service.priority;
        return fn
    })
    
    // if(!isFullDev) {
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    //@ts-ignore
    process.stdout.write = (chunk, encoding, callback) => {
        try {
            const data = chunk.toString();
            const content = JSON.parse(data)
            
            if(content.processed) return
            //rewire proxy logs to 
            if(content.name == 'proxy' && content.level < 50) {
                const {level, ...rest} = content
                logger.trace({...rest, processed: true})
            } else {
                logger.info({...content, processed: true})
                if(content.name != 'proxy' || (content.name == 'proxy' && content.code != 'ECONNREFUSED' && content.code != 'ECONNRESET')) {
                    originalStdoutWrite(chunk, encoding, callback);
                }
            }
        } catch(e) {}
    };
    
    process.on('uncaughtException', (err) => {
        originalStdoutWrite('Uncaught exception in admin-api: ' + JSON.stringify(err, null, 4) + '\n');
    });

    
    var proxy = new Redbird({
        port: Port,
        bunyan: {
            name: "proxy"
        },
        resolvers: resolvers
    });
    
    logger.debug({ service: { protocol: "http", port: Port } }, "Service started: HTTP")
}
