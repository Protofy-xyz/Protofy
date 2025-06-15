const services = [
    {
        "name": "next",
        "disabled": true,
        "description": "Frontend services, providing the web user interface based on nextjs",
        "route": (req) => process.env.SITE_URL ?? 'http://localhost:3000'
    }
]

module.exports = services;