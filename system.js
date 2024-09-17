const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = false

const systemConfig = {
    compiledPort: 8080
}

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

                if (url.startsWith('/adminapi/') || url == '/adminapi') {
                    return process.env.ADMIN_API_URL ?? 'http://localhost:3002'
                } else if (url == '/websocket') {
                    if (query.env && (query.env == 'dev' || query.env == 'prod')) {
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
                if (req.url.startsWith('/api/') || req.url == '/api') {
                    return process.env.API_URL ?? 'http://localhost:' + (mode == 'production' && !disableProdApi ? 4001 : 3001)
                }

                if (req.url.startsWith('/_dev/api/') || req.url == '/_dev/api') {
                    var target = process.env.API_URL ?? 'http://localhost:3001'
                    return target
                }
            }
        },
        {
            "name": "nextra",
            "disabled": true,
            "description": "Development mode of the documentation service, providing the documentation based on nextra",
            "route": (req, mode) => {
                if (mode == 'development' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7600'
                }
            }
        },
        {
            "name": "nextra-compiled",
            "disabled": true,
            "description": "Documentation service, providing the documentation based on nextra",
            "route": (req, mode) => {
                if (mode == 'production' && (req.url.startsWith('/documentation/') || req.url == '/documentation')) {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7700'
                }
            }
        },
        {
            "name": "jupyter",
            "description": "Jupyter notebook for interactive computing",
            "disabled": true,
            "route": () => false
        },
        {
            "name": "expo",
            "description": "Expo services, providing the mobile user interface based on expo",
            "disabled": true,
            "route": () => false
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
    ],

    "alwaysCompiledPaths": [
        "/workspace/prod",
        "/workspace/dev/users",
        "/workspace/dev/groups",
        "/workspace/dev/keys",
        "/workspace/dev/events",
        "/workspace/dev/messages",
        "/workspace/dev/services",
        "/workspace/dev/databases",
        "/workspace/dev/objects",
        "/workspace/dev/pages",
        "/workspace/dev/apis",
        "/workspace/dev/stateMachines",
        "/workspace/dev/stateMachineDefinitions",
        "/workspace/dev/files",
        "/workspace/dev/resources",
        "/workspace/dev/databases",
        "/workspace/dev/devices",
        "/workspace/dev/deviceDefinitions",
    ],
    "redirectToCompiled": (req, res) => {
        const host = req.headers.host.split(':')[0]
        const port = systemConfig.compiledPort
        const url = req.url
        const redirectUrl = `http://${host}:${port}${url}`
        res.writeHead(302, {
            Location: redirectUrl
        })
        res.end()
    }
}

module.exports = config