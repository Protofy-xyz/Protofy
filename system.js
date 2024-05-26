const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = false

const config = {
    "services": [
        {
            "name": "admin-api",
            "description": "Administration API services for protofy admin panel",
            "route": (req, mode) => {
                const url = req.url.split('?')[0]
                const queryString = req.url.split('?')[1]
                const query = queryString ? queryString.split('&').reduce((acc, val) => {
                    const [key, value] = val.split('=')
                    acc[key] = value
                    return acc
                }, {}) : {}

                if(url.startsWith('/adminapi/') || url == '/adminapi') {
                    return process.env.ADMIN_API_URL ?? 'http://localhost:3002'
                } else if(url == '/websocket' ) {
                    if(query.env && (query.env == 'dev' || query.env == 'prod')) {
                        mode = query.env == 'dev' ? 'development' : 'production'
                    }
                    return process.env.WEBSOCKET_URL ?? 'http://localhost:' + (mode == 'production' && !disableProdApi ? 4003 : 3003)
                }
            }
        },
        {
            "name": "api",
            "description": "API services for protofy",
            "route": (req, mode) => {
                if(req.url.startsWith('/api/') || req.url == '/api') {
                    return process.env.API_URL ?? 'http://localhost:'+(mode == 'production' && !disableProdApi? 4001 : 3001)
                }

                if(req.url.startsWith('/_dev/api/') || req.url == '/_dev/api') {
                    var target = process.env.API_URL ?? 'http://localhost:3001'
                    return target
                }
            }
        },
        {
            "name": "nextra-dev",
            "disabled": true,
            "description": "Development mode of the documentation service, providing the documentation based on nextra",
            "route": (req, mode) => {
                if(mode == 'development' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7600'
                }
            }
        },
        {
            "name": "nextra",
            "disabled": true,
            "description": "Documentation service, providing the documentation based on nextra",
            "route": (req, mode) => {
                if(mode == 'production' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7700'
                }
            }
        },
        {
            "name": "next-dev",
            "dirname": "next",
            "description": "Development mode of the frontend service, providing the web user interface based on nextjs",
            "route": (req, mode) => mode === 'development' ? (process.env.SITE_URL ?? 'http://localhost:3000') : undefined
        },
        {
            "name": "next",
            "dirname": "next-compiled",
            "description": "Frontend services, providing the web user interface based on nextjs",
            "route": (req, mode) => mode === 'production' ? (process.env.SITE_URL ?? 'http://localhost:4000') : undefined
        }
    ]
}

module.exports = config