const isProduction = process.env.NODE_ENV === 'production';

const config = {
    "services": [
        {
            "name": "admin",
            "description": "Admin panel to extend, customize and manage protofy",
            "route": (url) => url.startsWith('/admin/') || url == '/admin',
            "endpoint": process.env.ADMIN_SITE_URL ?? 'http://localhost:'+(isProduction ? 4003 : 3003),
            "priority": 100
        },
        {
            "name": "admin-api",
            "description": "Administration API services for protofy admin panel",
            "route": (url) => url.startsWith('/adminapi/') || url == '/websocket' || url == '/adminapi',
            "endpoint": process.env.ADMIN_API_URL ?? 'http://localhost:'+(isProduction ? 4002 : 3002),
            "priority": 100
        },
        {
            "name": "api",
            "description": "API services for protofy",
            "route": (url) => url.startsWith('/api/') || url == '/api',
            "endpoint": process.env.API_URL ?? 'http://localhost:'+(isProduction ? 4001 : 3001),
            "priority": 100
        },
        {
            "name": "nextra",
            "description": "Documentation services for protofy, providing the documentation based on nextra",
            "route": (url) => url.startsWith('/documentation/' || url == '/documentation'),
            "endpoint": process.env.DOCS_SITE_URL ?? 'http://localhost:'+(isProduction ? 7700 : 7600),
            "priority": 100
        },
        {
            "name": "next",
            "description": "Frontend services for protofy, providing the web user interface based on nextjs",
            "route": (url) => true,
            "endpoint": process.env.SITE_URL ?? 'http://localhost:'+(isProduction ? 4000 : 3000),
            "priority": 0
        }
    ]
}

module.exports = config