const isProduction = process.env.NODE_ENV === 'production';

const path = require('path');
const currentDir = path.dirname(__filename);

const api = {
    name: 'api',
    script: 'src/index.ts',
    interpreter: 'node',
    interpreter_args: '--import tsx',
    watch: false,
    autorestart: true,
    windowsHide: true,
    env: {
        NODE_ENV: 'production'
    },
    cwd: currentDir,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    out_file: '../../logs/raw/api.stdout.log',
    error_file: '../../logs/raw/api.stderr.log',
    vizion: false
}

const apiDev = {
    name: 'api-dev',
    script: 'src/index.ts',
    interpreter: 'node',
    interpreter_args: '--import tsx',
    watch: ["../../packages/app"],
    autorestart: true,
    windowsHide: true,
    env: {
        NODE_ENV: 'development'
    },
    cwd: currentDir,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    out_file: '../../logs/raw/api-dev.stdout.log',
    error_file: '../../logs/raw/api-dev.stderr.log',
    vizion: false
}

module.exports = {
    apps: isProduction ? [api] : [apiDev],
};