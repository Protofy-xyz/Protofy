const isProduction = process.env.NODE_ENV === 'production';
const startAll = process.env.START_ALL === '1';

const path = require('path');
const currentDir = path.dirname(__filename);

const disableStartAll = false

const siteDev = {
  name: "next-dev",
  script: path.join(currentDir, 'entrypoint.js'),
  windowsHide: true,
  watch: false,
  env: {
      NODE_ENV: 'development'
  },
  cwd: currentDir,
  log_date_format: "YYYY-MM-DD HH:mm:ss",
  out_file: '../../logs/raw/next-dev.stdout.log',
  error_file: '../../logs/raw/next-dev.stderr.log',
  node_args: '--max-old-space-size=4096'
}

const site = {
  name: "next",
  script: path.join(currentDir, 'dist/apps/next/server.js'),
  windowsHide: true,
  watch: false,
  env: {
      NODE_ENV: 'production',
      PORT: 4000,
      DOTENV_CONFIG_PATH: path.resolve(__dirname, '../../.env')
  },
  cwd: path.join(currentDir, 'dist/apps/next'),
  log_date_format: "YYYY-MM-DD HH:mm:ss",
  out_file: '../../logs/raw/next.stdout.log',
  error_file: '../../logs/raw/next.stderr.log',
  node_args : '-r dotenv/config'
}

module.exports = {
    apps: (startAll && !disableStartAll ? [
        site,
        siteDev
    ] : (isProduction ? [site] : [siteDev]))
}