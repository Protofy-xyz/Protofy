const path = require('path');
const currentDir = path.dirname(__filename);

module.exports = {
    apps: [
        {
            name: "proxy",
            script: path.join(currentDir, "./index.js"),
            watch: false, // Establecer en true si deseas reiniciar la aplicación al modificar archivos.
            env: {
                NODE_ENV: "production"
            },
            cwd:currentDir
        }
    ]
};