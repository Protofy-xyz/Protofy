const isProduction = process.env.NODE_ENV === 'production';
const disableProdApi = false

const config = {
    "services": [], // This will be populated with services from apps/services.js files
    "routers": []
}

//iterate over apps/ and for each directory, if it has a services.js file, require it and add its services to the config.services array
const fs = require('fs');
const path = require('path');
const appsDir = path.join(__dirname, 'apps');
fs.readdirSync(appsDir).forEach((app) => {
    const appPath = path.join(appsDir, app);
    if (fs.statSync(appPath).isDirectory()) {
        const servicesPath = path.join(appPath, 'services.js');
        if (fs.existsSync(servicesPath)) {
            const appServices = require(servicesPath);
            if (Array.isArray(appServices)) {
                const enabledServices = appServices.filter(service => !service.disabled);
                config.services.push(...enabledServices);
                config.routers.push(...appServices);
            } else {
                console.warn(`Invalid services format in ${servicesPath}`);
            }
        }
    }
});

module.exports = config