console.log('API URL: ', process.env.API_URL ?? 'http://localhost:3001')
console.log('SERVER URL: ', process.env.SITE_URL ?? 'http://localhost:3000')
console.log('PORT: ', process.env.PORT ?? 8080)
var customResolver1 = function (host, url, req) {
    if (/^\/api\//.test(url) || url === '/websocket') {
        return process.env.API_URL ?? 'http://localhost:3001';
    }
};

var customResolver2 = function (host, url, req) {
    if (/^\/adminapi\//.test(url)) {
        return process.env.API_URL ?? 'http://localhost:3002';
    }
};


// assign high priority
customResolver1.priority = 100;
customResolver2.priority = 101;

var proxy = new require('redbird')({
    port: process.env.PORT ?? 8080,
    bunyan: {
        name: 'redbird',
        level: 'error'
    },
    resolvers: [
        customResolver1,
        customResolver2,
        function (host, url, req) {
            return process.env.SITE_URL ?? 'http://localhost:3000'
    }]
})