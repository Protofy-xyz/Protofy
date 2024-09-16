const { spawn } = require('child_process');
const path = require('path');

const pythonScript = path.join(__dirname, 'setup.py');
const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';

let subprocess;  // Declare subprocess variable to use globally

try {
    // Execute the Python script and keep it running
    subprocess = spawn(pythonExecutable, [pythonScript], {
        windowsHide: true // Hide the window on Windows
    });

    // Redirect output to the parent process' stdout and stderr
    subprocess.stdout.on('data', (data) => {
        process.stdout.write(data);
    });

    subprocess.stderr.on('data', (data) => {
        process.stderr.write(data);
    });

    subprocess.on('close', (code) => {
        console.log(`Jupyter process exited with code ${code}`);
        process.exit(code);
    });

} catch (err) {
    console.error(`Error launching Jupyter: ${err.message}`);
}

// Handle process termination and stop the subprocess
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down...');
    if (subprocess) {
        subprocess.kill('SIGINT');
    }
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down...');
    if (subprocess) {
        subprocess.kill('SIGTERM');
    }
    process.exit();
});