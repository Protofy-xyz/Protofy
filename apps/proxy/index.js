const Redbird = require('redbird');
const cookie = require('cookie');
const fs = require('fs');

const SiteConfigData = (fs.readFileSync('../../packages/app/conf.js').toString().split('\n').filter(line => !line.startsWith('export')).join('\n'))+"\nreturn SiteConfig;\n"
const wrappedString = `(function() { ${SiteConfigData} })()`;
const SiteConfig = eval(wrappedString);
const isProduction = process.env.NODE_ENV === 'production';

const APIUrl = process.env.API_URL ?? 'http://localhost:' + (isProduction ? '4001' : '3001');
const ServerUrl = process.env.SITE_URL ?? 'http://localhost:' + (isProduction ? '4000' : '3000');
const AdminAPIUrl = process.env.ADMIN_API_URL ?? 'http://localhost:' + (isProduction ? '4002' : '3002');
const Port = process.env.PORT ?? (isProduction ? 8000 : 8080);

console.log('API URL: ', APIUrl);
console.log('ADMIN API URL: ', AdminAPIUrl);
console.log('SERVER URL: ', ServerUrl);
console.log('PORT: ', Port);

function addClientIpHeader(req) {
    var clientIp = req.connection.remoteAddress;
    req.headers['X-Client-IP'] = clientIp;
}

function parseCookies(req) {
    return cookie.parse(req.headers.cookie || '');
}

var customResolver1 = function (host, url, req) {
    addClientIpHeader(req);

    if (/^\/api\//.test(url)) {
        try {
            const cookies = parseCookies(req);
            const session = JSON.parse(cookies['session'] ?? '{}')
            const query = new URLSearchParams(url.split('?')[1]);
            const __env = query.get('__env');
            const requestedSession = __env? __env : session.environment

            if(requestedSession) {
                const enviro = SiteConfig.environments.find(e => e.name == requestedSession)
                if(enviro) {
                    //console.log('Forcing environment from cookie: ', requestedSession)
                    return enviro.api
                } else {
                    console.error("Invalid environment found in cookie, ignoring: ", requestedSession)
                }
            }
        } catch(e) {
            console.error("Error reading cookies for routing...")
        }
        return APIUrl;
    }
};

customResolver1.priority = 100;

var customResolver2 = function (host, url, req) {
    addClientIpHeader(req);

    if (/^\/adminapi\//.test(url) || url === '/websocket') {
        try {
            const cookies = parseCookies(req);
            const session = JSON.parse(cookies['session'] ?? '{}')
            const query = new URLSearchParams(url.split('?')[1]);
            const __env = query.get('__env');
            const requestedSession = __env? __env : session.environment
            if(requestedSession) {
                const enviro = SiteConfig.environments.find(e => e.name == requestedSession)
                if(enviro) {
                    // console.log('Forcing environment from cookie: ', requestedSession)
                    return enviro.adminApi
                } else {
                    console.error("Invalid environment found in cookie, ignoring: ", requestedSession)
                }
            }
        } catch(e) {
            console.error("Error reading cookies for routing...")
        }
        return AdminAPIUrl;
    }
};

customResolver2.priority = 101;

var devResolver = function (host, url, req) {
    if (isProduction && host.startsWith('dev.')) {
        return 'http://localhost:8080';
    }
};

devResolver.priority = 200;

var proxy = new Redbird({
    port: Port,
    bunyan: {
        name: 'redbird',
        level: 'error'
    },
    resolvers: [
        devResolver,
        customResolver1,
        customResolver2,
        function (host, url, req) {
            return ServerUrl;
        }
    ]
});