const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [{
        name: "jupyter",
        script: path.join(currentDir, 'run.js'),
        interpreter: "node",  // Make sure this points to "node"
        windowsHide: true,
        autorestart: false,
        env: {
            NODE_ENV: 'development'
        },
        cwd: currentDir,
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        out_file: '../../logs/raw/jupyter.stdout.log',
        error_file: '../../logs/raw/jupyter.stderr.log',
    }]
};