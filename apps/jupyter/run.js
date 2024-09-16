const { spawn } = require('child_process');
const path = require('path');

const pythonScript = path.join(__dirname, 'setup.py');
const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';

try {
    // Execute the Python script and keep it running
    const subprocess = spawn(pythonExecutable, [pythonScript], {
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