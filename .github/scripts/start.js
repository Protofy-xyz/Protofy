const path = require('path');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

const PROJECT_DIR = path.join(__dirname, "..", "..")
const DEV_SERVER_URL = "http://127.0.0.1:8080"
const TIMEOUT = 120000 // 2 min
const RETRY_TIME = 1000 // 1 sec
// Run project
const start = () => {
    console.log('Starting project...')
    exec(`cd ${PROJECT_DIR} && yarn dev-full > /dev/null &`, { encoding: 'utf-8' });
}

const healthCheck = () => { // Check system is up and ready to use
    console.log('Running healthcheck, waiting to be ready...')
    return new Promise((resolve, reject) => {
        const isReady = () => {
            let isEnabled = execSync(`curl -s ${DEV_SERVER_URL} | grep -q "__next" && echo true || echo false`, { encoding: 'utf-8' }).trim()
            if (isEnabled === 'true') {
                console.log('System Ready!')
                clearInterval(interval)
                resolve()
            }
            else {
                console.log('healthchecking, please wait...')
            }
        }
        let interval = setInterval(isReady, RETRY_TIME);
        setTimeout(() => {
            clearInterval(interval)
            reject("Error: healthcheck timeout.")
        }, TIMEOUT)
    })
}

const main = async () => {
    start()
    await healthCheck()
    process.exit()
}
main()
