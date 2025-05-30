const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = false

const config = {
    "services": [
        {
            "name": "core",
            "description": "Core services for protofy",
            "route": (req) => {
                if (req.url.startsWith('/api/core/') || req.url == '/api/core') {
                    return process.env.ADMIN_API_URL ?? 'http://localhost:3002'
                }
            }
        },
        {
            "name": "core-websocket",
            "type": "route",
            "description": "Websocket service for protofy",
            "route": (req) => {
                if (req.url == '/websocket') {
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
            "disabled": true,
            "description": "Frontend services, providing the web user interface based on nextjs",
            "route": (req) => process.env.SITE_URL ?? 'http://localhost:3000'
        }
    ]
}

module.exports = config