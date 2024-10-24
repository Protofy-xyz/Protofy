const isProduction = process.env.NODE_ENV === 'production';
const isFullDev = process.env.FULL_DEV === '1';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        isFullDev ? {
            name: 'core-dev',
            script: path.join(currentDir, '..', '..', 'node_modules', 'ts-node', 'dist', 'bin.js'),
            args: '--files --project tsconfig.json src/index.ts',
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'development'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/core-dev.stdout.log',
            error_file: '../../logs/raw/core-dev.stderr.log'
        } : {
            name: 'core',
            script: path.join(currentDir, 'dist', 'apps', 'core', 'src', 'index.js'),
            node_args: "-r module-alias/register",
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'production'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/core.stdout.log',
            error_file: '../../logs/raw/core.stderr.log'
        }
    ],
};