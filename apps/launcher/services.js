const path = require('path')

const services = [
      {
        "name": "launcher",
        "disabled": true,
        "description": "Launcher UI to manage and interact with projects",
        "route": (req) => {
          if (req.url.startsWith('/launcher/') || req.url == '/launcher') {
            return process.env.ADMIN_PANEL_URL ?? 'http://localhost:3008'
          }
        }
    }
]

module.exports = services;