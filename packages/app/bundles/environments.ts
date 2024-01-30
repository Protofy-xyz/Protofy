export const environments = {
    dev: {
        api: 'http://localhost:3001',
        adminApi: 'http://localhost:3002',
        frontend: 'http://localhost:3000',
        websocket: 'http://localhost:3002',
        admin: 'http://localhost:3003'
    },
    prod: {
        api: 'http://localhost:4001',
        adminApi: 'http://localhost:4002',
        frontend: 'http://localhost:4000',
        websocket: 'http://localhost:4002',
        admin: 'http://localhost:4003'
    }
    // ,
    // protofy: {
    //     api: 'https://dev.protofy.xyz',
    //     adminApi: 'https://dev.protofy.xyz',
    //     frontend: 'https://dev.protofy.xyz',
    //     websocket: 'https://dev.protofy.xyz',
    //     rewriteHost: 'dev.protofy.xyz',
    //     baseUrl: 'http://dev.protofy.xyz'
    // }
}