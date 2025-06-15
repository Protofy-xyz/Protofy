const services = [
    {
        "name": "core",
        "description": "Core services for protofy",
        "route": (req) => {
            if (req.url.startsWith('/api/core/') || req.url == '/api/core') {
                return process.env.ADMIN_API_URL ?? 'http://localhost:8000'
            }
        }
    },
    {
        "name": "core-websocket",
        "type": "route",
        "description": "Websocket service for protofy",
        "route": (req) => {
            if (req.url == '/websocket') {
                return process.env.WEBSOCKET_URL ?? 'http://localhost:8000'
            }
        }
    },
]

module.exports = services;