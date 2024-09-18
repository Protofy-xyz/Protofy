const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        {
            name: 'proxy',
            script: path.join(currentDir, 'src', 'proxy.js'),
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'production'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/proxy.stdout.log',
            error_file: '../../logs/raw/proxy.stderr.log'
        }
    ]
};