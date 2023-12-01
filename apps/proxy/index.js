const Redbird = require('redbird');
const cookie = require('cookie');
// const SiteConfig = require('../../packages/app/conf')
// console.log('CONFIIIIIIIIIIIIIIIIIIIIIIG', SiteConfig)
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
    const cookies = parseCookies(req);



    // // Utiliza las cookies para influir en el enrutamiento
    // if (cookies['user-preference'] === 'specialRoute' && /^\/api\//.test(url)) {
    //     return SpecialRouteUrl; // Redirige a una URL especial basada en la cookie
    // }

    if (/^\/api\//.test(url)) {
        return APIUrl;
    }
};

customResolver1.priority = 100;

var customResolver2 = function (host, url, req) {
    addClientIpHeader(req);
    //const cookies = parseCookies(req);
    //const session = JSON.parse(cookies['session'] ?? '{}')
    // console.log('COOOOOOOOOOOOOOKIES: ', session)
    if (/^\/adminapi\//.test(url) || url === '/websocket') {
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