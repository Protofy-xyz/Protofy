const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
      {
        name: isProduction? "admin" : "admin-dev",
        script: path.join(currentDir, './entrypoint.js'),
        windowsHide: true,
        watch: false,
        env: {
            NODE_ENV: isProduction ? 'production' : 'development'
        },
        cwd: currentDir,
        log_date_format: "YYYY-MM-DD HH:mm Z",
        out_file: '../../logs/raw/admin.stdout.log',
        error_file: '../../logs/raw/admin.stderr.log'
      }
    ]
  };