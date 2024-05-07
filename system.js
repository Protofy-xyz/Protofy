const isProduction = process.env.NODE_ENV === 'production';

const config = {
    "services": [
        {
            "name": "admin-api",
            "description": "Administration API services for protofy admin panel",
            "route": (req) => {
                if(req.url.startsWith('/adminapi/') || req.url == '/websocket' || req.url == '/adminapi') {
                    return process.env.ADMIN_API_URL ?? 'http://localhost:3002'
                }
            }
        },
        {
            "name": "api",
            "description": "API services for protofy",
            "route": (req, mode) => {
                if(req.url.startsWith('/api/') || req.url == '/api') {
                    return process.env.API_URL ?? 'http://localhost:'+(mode == 'production' ? 4001 : 3001)
                }
            }
        },
        {
            "name": "nextra",
            "disabled": true,
            "description": "Documentation services for protofy, providing the documentation based on nextra",
            "route": (req, mode) => {
                if(req.url.startsWith('/documentation/') || req.url == '/documentation') {
                    return process.env.DOCS_SITE_URL ?? 'http://localhost:'+(mode == 'production' ? 7700 : 7600)
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