const isProduction = process.env.NODE_ENV === 'production';
const startAll = process.env.START_ALL === '1';

const path = require('path');
const currentDir = path.dirname(__filename);

const disableStartAll = false

const nextraDev = {
  name: "nextra-dev",
  script: path.join(currentDir, 'entrypoint.js'),
  windowsHide: true,
  watch: false,
  env: {
      NODE_ENV: 'development'
  },
  cwd: currentDir,
  log_date_format: "YYYY-MM-DD HH:mm:ss",
  out_file: '../../logs/raw/nextra-dev.stdout.log',
  error_file: '../../logs/raw/nextra-dev.stderr.log',
  node_args: '--max-old-space-size=4096'
}

const nextra = {
  name: "nextra",
  script: path.join(currentDir, 'dist/apps/nextra/server.js'),
  windowsHide: true,
  watch: false,
  env: {
      NODE_ENV: 'production',
      PORT: 7700,
  },
  cwd: path.join(currentDir, 'dist/apps/nextra'),
  log_date_format: "YYYY-MM-DD HH:mm:ss",
  out_file: '../../../../../logs/raw/nextra.stdout.log',
  error_file: '../../../../../logs/raw/nextra.stderr.log'
}

module.exports = {
    apps: (startAll && !disableStartAll ? [
        nextra,
        nextraDev
    ] : (isProduction ? [nextra] : [nextraDev]))
}