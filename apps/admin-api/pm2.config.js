const isProduction = process.env.NODE_ENV === 'production';
const isFullDev = process.env.DEV_ADMIN_API === '1';

const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        isFullDev ?{
            name: 'admin-api-dev',
            script: path.join(currentDir, '../../node_modules/ts-node/dist/bin.js'),
            args: '--files --project tsconfig.json src/index.ts',
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'development'
            },
            cwd: currentDir
        } : {
            name: isProduction ? 'admin-api' : 'admin-api-dev',
            script: path.join(currentDir, 'dist/apps/admin-api/src/index.js'),
            node_args: "-r module-alias/register",
            watch: false,
            autorestart: !isProduction,
            env: {
                NODE_ENV: isProduction ? 'production' : 'development'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm Z",
            out_file: '../../logs/raw/admin-api.stdout.log',
            error_file: '../../logs/raw/admin-api.stderr.log'
        }
    ],
};