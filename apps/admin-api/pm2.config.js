const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        {
            name: isProduction ? 'admin-api' : 'admin-api-dev',
            script: path.join(currentDir, '../../node_modules/ts-node/dist/bin.js'),
            args: '--files --project tsconfig.json src/index.ts',
            watch: isProduction ? false : ["src/**", "../../packages/protolib/**"],
            autorestart: !isProduction,
            ignore_watch: ["src/**/*.spec.ts"],
            watch_options: {
                "followSymlinks": false,
                "usePolling": true,
                "alwaysStat": true,
                "useFsEvents": false
            },
            env: {
                NODE_ENV: isProduction ? 'production' : 'development'
            },
            cwd: currentDir
        }
    ],
};