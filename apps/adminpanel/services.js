const services = [
    {
        "name": "adminpanel",
        "disabled": true,
        "description": "Admin panel UI to manage and interact with core services",
        "route": (req) => {
            if(req.url.startsWith('/workspace/') || req.url == '/workspace') {
                return process.env.ADMIN_PANEL_URL ?? 'http://localhost:3002'
            }
        } 
    }
]

module.exports = services;