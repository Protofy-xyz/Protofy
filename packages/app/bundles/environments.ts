export const environments = {
    dev: {
        api: process.env.API_URL ?? 'http://localhost:3001',
        adminApi: process.env.ADMIN_API_URL ?? 'http://localhost:3002',
        frontend: process.env.SITE_URL ?? 'http://localhost:3000',
        // TODO add missing docker url from docker envs
        websocket: 'http://localhost:3002',
        admin: 'http://localhost:3003',
        docs: 'http://localhost:7600'
    },
    prod: {
        api: process.env.API_URL ?? 'http://localhost:4001/',
        adminApi: process.env.ADMIN_API_URL ?? 'http://localhost:4002/',
        frontend: process.env.SITE_URL ?? 'http://localhost:4000/',
        // TODO add missing docker url from docker from docker envs
        websocket: 'http://localhost:4002/',
        admin: 'http://localhost:4003/',
        docs: 'http://localhost:7700/'
    }
}