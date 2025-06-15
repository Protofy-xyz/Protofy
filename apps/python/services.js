const services = [
    {
        "name": "python",
        "description": "Python integration services",
        "disabled": true,
        "route": (req) => {
            if (req.url.startsWith('/pyapi/') || req.url == '/pyapi') {
                return process.env.API_URL ?? 'http://localhost:5000'
            }
        }
    }
]

module.exports = services;