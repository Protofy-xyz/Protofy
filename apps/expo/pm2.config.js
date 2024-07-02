const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: isProduction? [] : [
      {
        name: "expo",
        script: '../../.yarn/releases/yarn-3.5.0.cjs',
        args: 'start',
        windowsHide: true,
        watch: false,
        env: {
            NODE_ENV: 'development'
        },
        cwd: currentDir,
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        out_file: '../../logs/raw/expo-dev.stdout.log',
        error_file: '../../logs/raw/expo-dev.stderr.log',
        node_args: '--max-old-space-size=4096'
      }
    ]
  };