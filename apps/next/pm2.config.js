const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
      {
        name: isProduction? "next-app" : "next-app-dev",
        script: path.join(currentDir, './entrypoint.js'),
        windowsHide: true,
        watch: false,
        env: {
            NODE_ENV: isProduction ? 'production' : 'development'
        },
        cwd: currentDir
      }
    ]
  };