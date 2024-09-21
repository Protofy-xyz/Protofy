const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [{
        name: "jupyter",
        script: path.join(currentDir, '..', 'python', 'run.js'),
        args: '-m jupyterlab --no-browser --port 8888 --ip=0.0.0.0 --notebook-dir=../../ --no-browser',
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