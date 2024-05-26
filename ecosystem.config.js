const system = require('./system.js')
module.exports = {
    apps: system.services.reduce((total, service) => {
      if(service.disabled) return total
      return [...total, ...require('./apps/'+(service.dirname ?? service.name)+'/pm2.config.js').apps]
    }, [])
};