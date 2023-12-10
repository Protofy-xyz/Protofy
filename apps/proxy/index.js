const Redbird = require('redbird');
const cookie = require('cookie');
const environments = require('../../packages/app/bundles/environments')
const isProduction = process.env.NODE_ENV === 'production';
const Port = process.env.PORT ?? (isProduction ? 8000 : 8080);
const defaultEnvironment = environments[isProduction?'prod':'dev']

console.log('Proxy environments:', environments)
console.log('Proxy default environment:', defaultEnvironment)
console.log('Proxy mode:', isProduction?'producton':'development')
console.log('Proxy port:', Port)

function getEnvironment(host) {
    const prefix = host.split('.')[0]
    return environments[prefix] ?? defaultEnvironment
}

function addClientIpHeader(req) {
    var clientIp = req.connection.remoteAddress;
    req.headers['X-Client-IP'] = clientIp;
}

var customResolver1 = function (host, url, req) {
    addClientIpHeader(req);

    if (/^\/api\//.test(url)) {
        return getEnvironment(host).api;
    }
};

customResolver1.priority = 100;

var customResolver2 = function (host, url, req) {
    addClientIpHeader(req);

    if (/^\/adminapi\//.test(url) || url === '/websocket') {
        return getEnvironment(host).adminApi;
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
            return getEnvironment(host).frontend;
        }
    ]
});