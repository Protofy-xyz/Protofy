const services = [
    {
        "name": "api",
        "description": "API services for protofy",
        "route": (req) => {
            if (req.url.startsWith('/api/v1/') || req.url == '/api/v1') {
                return process.env.API_URL ?? 'http://localhost:3001'
            }
        }
    }
]

module.exports = services;