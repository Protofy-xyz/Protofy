const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        {
            name: isProduction? 'api': 'api-dev',
            script: path.join(currentDir, '../../node_modules/ts-node/dist/bin.js'),
            args: '--files --project tsconfig.json src/index.ts',
            watch: false,
            windowsHide: true,
            autorestart: !isProduction,
            env: {
                NODE_ENV: isProduction ? 'production' : 'development'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/api.stdout.log',
            error_file: '../../logs/raw/api.stderr.log'
        }
    ],
};