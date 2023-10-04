module.exports = {
    apps: [
        {
            name: "proxy",
            script: "./index.js",
            watch: false, // Establecer en true si deseas reiniciar la aplicación al modificar archivos.
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};