const ventoApps =  [
    'core',
    'api'
]

const ventoExtensions = [
    'actions',
    'apis',
    'assets',
    'assistant',
    'automations',
    'autopilot',
    'basemasks',
    'boards',
    'cards',
    'chatbots',
    'chatgpt',
    'dashboard',
    'databases',
    'devices',
    'events',
    'files',
    'flow',
    'groups',
    'google',
    'icons',
    'keys',
    'lmstudio',
    'logs',
    'network',
    'objects',
    'os',
    'packages',
    'protomemdb',
    'sequences',
    'services',
    'state',
    'tokens',
    'users',
    'utils',
    'vision',
    'workspaces'
]

const ventoPackages = [
    'app',
    'config',
    'protobase',
    'protonode'
]

//using __dirname, remove from ./extensions any folder that is not in the ventoExtensions array
const fs = require('fs');
const path = require('path');
const extensionsDir = path.join(__dirname, 'extensions');
const appsDir = path.join(__dirname, 'apps');
const packagesDir = path.join(__dirname, 'packages');

const removeNonVentoExtensions = (dir, validExtensions) => {
    fs.readdirSync(dir).forEach((item) => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            if (!validExtensions.includes(item)) {
                fs.rmdirSync(itemPath, { recursive: true });
            }
        }
    });
}

removeNonVentoExtensions(extensionsDir, ventoExtensions);
removeNonVentoExtensions(appsDir, ventoApps);
removeNonVentoExtensions(packagesDir, ventoPackages);

//remove node_modules

const removeNodeModules = (dir) => {
    const nodeModulesPath = path.join(dir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        fs.rmdirSync(nodeModulesPath, { recursive: true });
    }
}
removeNodeModules('.');