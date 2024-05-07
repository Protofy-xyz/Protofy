const isProduction = process.env.NODE_ENV === 'production';
const startAll = process.env.START_ALL === '1';

const path = require('path');
const currentDir = path.dirname(__filename);

const api = {
    name: 'api',
    script: path.join(currentDir, 'dist/apps/api/src/index.js'),
    node_args: "-r module-alias/register",
    watch: false,
    autorestart: true,
    env: {
        NODE_ENV: 'production'
    },
    cwd: currentDir,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    out_file: '../../logs/raw/api.stdout.log',
    error_file: '../../logs/raw/api.stderr.log'
}

const apiDev = {
    name: 'api-dev',
    script: path.join(currentDir, '../../node_modules/ts-node/dist/bin.js'),
    args: '--files --project tsconfig.json src/index.ts',
    watch: false,
    autorestart: true,
    env: {
        NODE_ENV: 'development'
    },
    cwd: currentDir,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    out_file: '../../logs/raw/api-dev.stdout.log',
    error_file: '../../logs/raw/api-dev.stderr.log'
}

module.exports = {
    apps: (startAll ? [
        api,
        apiDev
    ] : (isProduction ? [api] : [apiDev]))
};