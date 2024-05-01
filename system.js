const isProduction = process.env.NODE_ENV === 'production';

const config = {
    "services": [
        {
            "name": "admin",
            "description": "Admin panel to extend, customize and manage protofy",
            "route": (req) => req.url.startsWith('/admin/') || req.url == '/admin',
            "endpoint": process.env.ADMIN_SITE_URL ?? 'http://localhost:'+(isProduction ? 4003 : 3003),
        },
        {
            "name": "admin-api",
            "description": "Administration API services for protofy admin panel",
            "route": (req) => req.url.startsWith('/adminapi/') || req.url == '/websocket' || req.url == '/adminapi',
            "endpoint": process.env.ADMIN_API_URL ?? 'http://localhost:'+(isProduction ? 4002 : 3002),
        },
        {
            "name": "api",
            "description": "API services for protofy",
            "route": (req) => req.url.startsWith('/api/') || req.url == '/api',
            "endpoint": process.env.API_URL ?? 'http://localhost:'+(isProduction ? 4001 : 3001),
        },
        {
            "name": "nextra",
            "disabled": true,
            "description": "Documentation services for protofy, providing the documentation based on nextra",
            "route": (req) => req.url.startsWith('/documentation/' || req.url == '/documentation'),
            "endpoint": process.env.DOCS_SITE_URL ?? 'http://localhost:'+(isProduction ? 7700 : 7600),
        },
        {
            "name": "next",
            "description": "Frontend services for protofy, providing the web user interface based on nextjs",
            "route": (req) => true,
            "endpoint": process.env.SITE_URL ?? 'http://localhost:'+(isProduction ? 4000 : 3000),
        }
    ]
}

module.exports = config