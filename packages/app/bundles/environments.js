const environments = {
    dev: {
        api: 'http://localhost:3001',
        adminApi: 'http://localhost:3002',
        frontend: 'http://localhost:3000',
        adminFrontend: 'http://localhost:3000',
        websocket: 'http://localhost:3002'
    },
    prod: {
        api: 'http://localhost:4001',
        adminApi: 'http://localhost:4002',
        frontend: 'http://localhost:4000',
        adminFrontend: 'http://localhost:4000',
        websocket: 'http://localhost:4002'
    }
    //,
    // protofy: {
    //     api: 'https://dev.protofy.xyz',
    //     adminApi: 'https://dev.protofy.xyz',
    //     frontend: 'https://dev.protofy.xyz',
    //     adminFrontend: 'https://localhost:3000',
    //     websocket: 'https://dev.protofy.xyz',
    //     rewriteHost: 'dev.protofy.xyz'
    // }
}

module.exports = environments