const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = true

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
                    const forceDev = query.env == 'dev'
                    return process.env.WEBSOCKET_URL ?? 'http://localhost:' + (!forceDev && mode == 'production' && !disableProdApi ? 4003 : 3003)
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
            "name": "nextra",
            "disabled": true,
            "description": "Documentation services for protofy, providing the documentation based on nextra",
            "route": (req, mode) => {
                if(mode == 'development' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7600'
                }
            }
        },
        {
            "name": "nextra-compiled",
            "disabled": true,
            "description": "Compiled documentation services for protofy, providing the documentation based on nextra",
            "route": (req, mode) => {
                if(mode == 'production' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7700'
                }
            }
        },
        {
            "name": "next",
            "description": "Development Frontend services for protofy, providing the web user interface based on nextjs",
            "route": (req, mode) => mode === 'development' ? (process.env.SITE_URL ?? 'http://localhost:3000') : undefined
        },
        {
            "name": "next-compiled",
            "description": "Compiled Frontend services for protofy, providing the web user interface based on nextjs",
            "route": (req, mode) => mode === 'production' ? (process.env.SITE_URL ?? 'http://localhost:4000') : undefined
        }
    ]
}

module.exports = config