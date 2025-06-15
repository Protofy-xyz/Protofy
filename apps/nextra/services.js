const services = [
    {
        "name": "nextra",
        "disabled": true,
        "description": "Documentation service, providing the documentation based on nextra",
        "route": (req) => {
            if (req.url.startsWith('/documentation/') || req.url == '/documentation') {
                return process.env.DOCS_SITE_URL ?? 'http://localhost:7600'
            }
        }
    }
]

module.exports = services;