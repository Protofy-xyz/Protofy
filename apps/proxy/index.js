const isProduction = process.env.NODE_ENV === 'production';

const APIUrl = process.env.API_URL ?? 'http://localhost:'+(isProduction?'4001':'3001')
const ServerUrl = process.env.SITE_URL ?? 'http://localhost:'+(isProduction?'4000':'3000')
const AdminAPIUrl = process.env.ADMIN_API_URL ?? 'http://localhost:'+(isProduction?'4002':'3002')
const Port = process.env.PORT ?? (isProduction?8000:8080)

console.log('API URL: ', APIUrl)
console.log('ADMIN API URL: ', AdminAPIUrl)
console.log('SERVER URL: ', ServerUrl)
console.log('PORT: ', Port)

function addClientIpHeader(req) {
    var clientIp = req.connection.remoteAddress;
    req.headers['X-Client-IP'] = clientIp;
}

var customResolver1 = function (host, url, req) {
    addClientIpHeader(req);
    if (/^\/api\//.test(url)) {
        return APIUrl;
    }
};

var customResolver2 = function (host, url, req) {
    addClientIpHeader(req);
    if (/^\/adminapi\//.test(url) || url === '/websocket') {
        return AdminAPIUrl;
    }
};


// assign high priority
customResolver1.priority = 100;
customResolver2.priority = 101;

var proxy = new require('redbird')({
    port: Port,
    bunyan: {
        name: 'redbird',
        level: 'error'
    },
    resolvers: [
        customResolver1,
        customResolver2,
        function (host, url, req) {
            return ServerUrl
    }]
})