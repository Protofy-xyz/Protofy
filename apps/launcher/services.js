const path = require('path')

const services = [
      {
        "name": "launcher",
        "disabled": true,
        "description": "Launcher UI to manage and interact with projects",
        "route": (req) => {
          if (req.url.startsWith('/launcher/') || req.url == '/workspace') {
            return process.env.ADMIN_PANEL_URL ?? 'http://localhost:3008'
          }
        },
        disabledRoute: (req) => {
          if (req.url.startsWith('/launcher/') || req.url == '/launcher') {
            let r = req.url.split('?')[0]
            const file = path.join("/electron/launcher", r)
            return "file://" + file
          }
        }
    }
]

module.exports = services;