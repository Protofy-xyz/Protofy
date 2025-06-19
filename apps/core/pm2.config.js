const isProduction = process.env.NODE_ENV === 'production';
const isFullDev = process.env.FULL_DEV === '1';
const path = require('path');
const currentDir = path.dirname(__filename);

const commonEnv = {
  PATH: `${path.resolve(currentDir, '../../bin')}${path.delimiter}${process.env.PATH}`
};

module.exports = {
    apps: [
        isFullDev ? {
            name: 'core-dev',
            script: 'src/index.ts',
            interpreter: 'node',
            interpreter_args: '--import tsx',
            watch: false,
            autorestart: true,
            windowsHide: true,
            env: {
                NODE_ENV: 'development',
                ...commonEnv
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/core-dev.stdout.log',
            error_file: '../../logs/raw/core-dev.stderr.log',
            vizion: false
        } : {
            name: 'core',
            script: 'src/index.ts',
            interpreter: 'node',
            interpreter_args: '--import tsx',
            watch: false,
            autorestart: true,
            windowsHide: true,
            env: {
                NODE_ENV: 'production',
                ...commonEnv
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/core.stdout.log',
            error_file: '../../logs/raw/core.stderr.log',
            vizion: false
        }
    ],
};