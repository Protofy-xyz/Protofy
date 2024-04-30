export const environments = {
    dev: {
        api: process.env.API_URL ?? 'http://localhost:3001',
        adminApi: process.env.ADMIN_API_URL ?? 'http://localhost:3002',
        frontend: process.env.SITE_URL ?? 'http://localhost:3000',
        admin: process.env.ADMIN_SITE_URL ?? 'http://localhost:3003',
        docs: process.env.DOCS_SITE_URL ?? 'http://localhost:7600',
        proxy: process.env.PROXY_URL ?? 'http://localhost:8080'
    },
    prod: {
        api: process.env.API_URL ?? 'http://localhost:4001/',
        adminApi: process.env.ADMIN_API_URL ?? 'http://localhost:4002/',
        frontend: process.env.SITE_URL ?? 'http://localhost:4000/',
        admin: process.env.ADMIN_SITE_URL ?? 'http://localhost:4003/',
        docs: process.env.DOCS_SITE_URL ?? 'http://localhost:7700/',
        proxy: process.env.PROXY_URL ?? 'http://localhost:8000'
    }
}