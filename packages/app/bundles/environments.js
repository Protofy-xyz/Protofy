const environments = {
    dev: {
        api: 'http://localhost:3001',
        adminApi: 'http://localhost:3002',
        frontend: 'http://localhost:3000'
    },
    prod: {
        api: 'http://localhost:4001',
        adminApi: 'http://localhost:4002',
        frontend: 'http://localhost:4000'
    }
}

module.exports = environments