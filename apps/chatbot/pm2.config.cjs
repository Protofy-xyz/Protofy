const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        {
            name: 'chatbot',
            script: path.join(currentDir, 'src', 'run.js'),
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'production'
            },
            cwd: currentDir,
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: '../../logs/raw/chatbot.stdout.log',
            error_file: '../../logs/raw/chatbot.stderr.log'
        }
    ]
};