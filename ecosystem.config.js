module.exports = {
    apps: [
      ...require('./apps/admin-api/pm2.config.js').apps,
      ...require('./apps/api/pm2.config.js').apps,
      ...require('./apps/proxy/pm2.config.js').apps,
      ...require('./apps/next/pm2.config.js').apps,
      ...require('./apps/admin/pm2.config.js').apps
    ]
};