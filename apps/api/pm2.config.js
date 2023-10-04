const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    apps: [
        {
            name: 'api',
            script: '../../node_modules/ts-node/dist/bin.js',
            args: '--project tsconfig.json src/index.ts',
            watch: isProduction ? false : ["src/**", "../../packages/common/**", "../../packages/protolib/**"],
            autorestart: !isProduction,
            ignore_watch: ["src/**/*.spec.ts"],
            watch_options: {
                "followSymlinks": false,
                "usePolling": true,
                "alwaysStat": true,
                "useFsEvents": false
            },
            env: {
                NODE_ENV: isProduction ? 'production' : 'development'
            }
        }
    ],
};