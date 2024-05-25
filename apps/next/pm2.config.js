const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: isProduction? [] : [
      {
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
    ]
  };