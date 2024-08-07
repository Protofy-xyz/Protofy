const fs = require('fs');
const path = require('path');
const config = require(path.resolve(__dirname, '..', 'system.js'));
const { execSync, spawn } = require('child_process');
const { exit } = require('process');

const docker_compose_cmd = getDockerComposeCmd();
main();

function main() {
    const args = process.argv.slice(2);
    // Initialize flags
    let PROD = false;
    let SERVICE = false;
    let COMMAND = null;
    // The command should be the first argument
    if (args.length > 0) {
        const firstArg = args[0];
        if (['start', 'stop', 'build', 'add-user'].includes(firstArg)) {
            COMMAND = firstArg;
            args.shift(); // Remove the command from the args array
        }
        if (!COMMAND) {
            console.error("Error: The command 'build', 'add-user', 'start' or 'stop' must be provided and must be the last argument.");
            process.exit(1);
        }
    }
    // Parse flags
    args.forEach(arg => {
        switch (arg) {
            case '--prod':
                PROD = true;
                arg.shift();
                break;
            case '--service':
                SERVICE = true;
                arg.shift();
                break
        }
    });
    // Check dependencies
    checkDependencies();
    // Your logic here
    switch (COMMAND) {
        case 'build':
            build(PROD);
            break;
        case 'start':
            start(PROD, SERVICE);
            break;
        case 'stop':
            stop()
            break;
        case 'add-user':
            const addUser_args = [...args].reduce((total, arg) => total += (arg + " "), "").trim();
            addUser(addUser_args)
            break;
    }

}


// MAIN PROCESSES
function start(isProd = false, isService = false) {
    console.log('Running start command...');
    let startCommand = `${docker_compose_cmd} -p protofy ${getComposeFiles(isProd)} up`;
    if (isService) {
        console.log('Service mode enabled.');
        startCommand = `${startCommand} -d`; // Run in detached mode and show logs in a separate process
    }
    console.log('startCommand: ', startCommand);
    execSync(startCommand);
    if (isService) {
        // Show logs with new process
        const logsCmd = getDockerLogsCmd();
        runCommand(logsCmd);
    }
}

function stop() {
    console.log('Running stop command...');
    try {
        const stopCmd = `${docker_compose_cmd} -p protofy stop`
        runCommand(stopCmd);
        return true;
    } catch (error) {
        console.error('Could not stop project')
        process.exit(1);
    }
}

function build(isProd = false) {
    if (isProd) {
        console.log('Generating docker production build...');
        try {
            const buildProdCmd = `docker build -f Dockerfile.prod -t protofy/protofy ..`
            runCommand(buildProdCmd);
            return true;
        } catch (error) {
            console.error('Could not generate production build')
            process.exit(1);
        }
    } else {
        console.log('Generating docker development build...');
        // init build: prepare some volumes and dependencies for development build
        const MODULES_VOLUME_NAME = "protofy_modules";
        const NEXT_VOLUME_NAME = "protofy_next";
        if (!volumeExists(MODULES_VOLUME_NAME)) createDockerVolume(MODULES_VOLUME_NAME)
        if (!volumeExists(NEXT_VOLUME_NAME)) createDockerVolume(NEXT_VOLUME_NAME)
        try {
            const buildDevCmd = `docker build -t protofy/workspace . && ${docker_compose_cmd} -f build.yml up`
            runCommand(buildDevCmd);
            return true;
        } catch (error) {
            console.error('Could not generate development build')
            process.exit(1);
        }
    }
}

function addUser(args) {
    runCommandInContainer("admin-api", `sh -c "yarn add-user ${args}"`)
}

// HELPERS
// Check dependencies
function checkDependencies() {
    hasDocker();
    getDockerComposeCmd();
}
// Get Docker Compose command (depending if v1 or v2)
function getDockerComposeCmd() {
    const hasDockerCompose = commandExists('docker-compose --version');
    if (hasDockerCompose) return 'docker-compose';
    const hasDockerComposeV2 = commandExists('docker compose version');
    if (hasDockerComposeV2) return 'docker compose';
    if (!hasDockerCompose && !hasDockerComposeV2) {
        console.error("Error: Neither 'docker-compose' or 'docker compose' is installed.");
        process.exit(1);
    }
}
// Check if has docker installed
function hasDocker() {
    const hasDocker = commandExists('docker --version');
    if (!hasDocker) {
        console.error("Error: docker is not installed.");
        process.exit(1);
    }
}

function getDockerLogsCmd() {
    return `${docker_compose_cmd} -p protofy logs -f`
}

function getEnabledServices() {
    const availableServices = config?.services;
    const enabledServices = availableServices.reduce((total, service) => {
        if (service?.disabled) return total; // No push if service is disabled
        return total.concat(service?.dirname ?? service?.name); // Get the service by its dirname and if not specified get it by its name
    }, [])
    if (!enabledServices || !enabledServices.length) {
        console.error("There are no services enabled, check system.js and check that you have at least one enabled.")
    }
    return enabledServices
}

function getComposeFiles(isProd = false) {
    const enabledServices = getEnabledServices();
    const aplicationsDir = path.join(__dirname, '..', 'apps');
    let composeFiles = enabledServices.reduce((total, service, index) => {
        const baseDockerComposeFilePath = path.join(aplicationsDir, service, "docker.yml");
        const devDockerComposeFilePath = path.join(aplicationsDir, service, "docker.dev.yml");
        const prodDockerComposeFilePath = path.join(aplicationsDir, service, "docker.prod.yml");
        // Warning: only copy docker.yml if it is running in Prod and has docker.prod.yml or in dev and it has docker.dev.yml
        if (fs.existsSync(baseDockerComposeFilePath) && (fs.existsSync(devDockerComposeFilePath) && !isProd || fs.existsSync(prodDockerComposeFilePath) && isProd)) total += `-f ${baseDockerComposeFilePath} `;
        if (!isProd && fs.existsSync(devDockerComposeFilePath)) total += `-f ${devDockerComposeFilePath} `;
        if (isProd && fs.existsSync(prodDockerComposeFilePath)) total += `-f ${prodDockerComposeFilePath} `;
        return total
    }, '')
    return composeFiles.trim();
}

// check if command exists
function commandExists(command) {
    try {
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
};


// Function to check if a Docker volume exists
function volumeExists(volumeName) {
    try {
        // Execute Docker command to list volumes and filter by the specific volume name
        const result = execSync(`docker volume ls -q --filter name=${volumeName}`).toString().trim();
        return result === volumeName;
    } catch (error) {
        console.error(`Error checking volume: ${error.message}`);
        return false;
    }
}

function createDockerVolume(volumeName) {
    try {
        execSync(`docker volume create ${volumeName}`, { stdio: 'ignore' })
    } catch (e) {
        console.error('Error creating docker volume')
    }
}


// Function to run a command with real-time logging
function runCommand(command) {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, { stdio: 'inherit' });

    child.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    child.on('close', (code) => {
        if (code !== 0) {
            console.error(`Command failed with code ${code}`);
            process.exit(1);
        }
    });
}

function runCommandInContainer(containerName, command) {
    try {
        const runCmd = `docker exec ${containerName} ${command}`;
        execSync(runCmd)
    } catch (e) {
        exit(1);
    }
}