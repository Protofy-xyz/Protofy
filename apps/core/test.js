// runTests.js
const { startCore } = require('./dist/apps/core/src'); // Ajusta la ruta según corresponda
const { spawn, exec } = require('child_process');


startCore((port, token) => {
  console.log(`Core started at ${port}. Running tests...`);
  console.log('Token:', token);
  const testProcess = spawn('yarn', ['jest'],  { stdio: 'inherit', shell: true, env: { ...process.env, SERVICE_TOKEN: token }});
  
  testProcess.on('close', (code) => {
    console.log(`Tests done, exit code: ${code}`);
    if(process.platform === 'win32') {
        exec(`taskkill /PID ${process.pid} /T /F`, (err, stdout, stderr) => {
            if (err) {
              console.error('Error killing process tree:', err);
            }
            process.exit(code);
          });
    } else {
        process.kill(process.pid, 'SIGTERM');
    }
  });
});
