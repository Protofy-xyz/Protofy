const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = false

const config = {
    "services": [
        {
            "name": "core",
            "description": "Core services for protofy",
            "route": (req) => {
                const url = req.url.split('?')[0]
                const queryString = req.url.split('?')[1]
                const query = queryString ? queryString.split('&').reduce((acc, val) => {
                    const [key, value] = val.split('=')
                    acc[key] = value
                    return acc
                }, {}) : {}

                if (url.startsWith('/api/core/') || url == '/api/core') {
                    return process.env.ADMIN_API_URL ?? 'http://localhost:3002'
                } else if (url == '/websocket') {
                    return process.env.WEBSOCKET_URL ?? 'http://localhost:3003'
                }
            }
        },
        {
            "name": "api",
            "description": "API services for protofy",
            "route": (req) => {
                if (req.url.startsWith('/api/v1/') || req.url == '/api/v1') {
                    return process.env.API_URL ?? 'http://localhost:3001'
                }
            }
        },
        {
            "name": "nextra",
            "disabled": true,
            "description": "Documentation service, providing the documentation based on nextra",
            "route": (req) => {
                if (req.url.startsWith('/documentation/') || req.url == '/documentation') {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:7600'
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
            "name": "python",
            "description": "Python integration services",
            "disabled": true,
            "route": (req) => {
                if (req.url.startsWith('/pyapi/') || req.url == '/pyapi') {
                    return process.env.API_URL ?? 'http://localhost:5000'
                }
            }
        },
        {
            "name": "expo",
            "description": "Expo services, providing the mobile user interface based on expo",
            "disabled": true,
            "route": () => false
        },
        {
            "name": "adminpanel",
            "disabled": false,
            "description": "Admin panel UI to manage and interact with core services",
            "route": (req) => {
                if(req.url.startsWith('/workspace/') || req.url == '/workspace') {
                    return process.env.ADMIN_PANEL_URL ?? 'http://localhost:8000'
                }
            } 
        },
        {
            "name": "next",
            "description": "Frontend services, providing the web user interface based on nextjs",
            "route": (req) => process.env.SITE_URL ?? 'http://localhost:3000'
        }
    ]
}

module.exports = config