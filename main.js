// 📦 main.js
const { app, BrowserWindow } = require('electron');
const net = require('net');
const path = require('path');
const { getNodeBinary, startPM2 } = require('./pm2-wrapper');

process.chdir(__dirname);
console.log('🟢 Starting app...');
console.log('📁 Current directory:', __dirname);

// Evita bucles infinitos
if (process.env.IS_ECOSYSTEM_CHILD === '1') {
  console.log('🚫 Detected child process. Exiting to avoid recursion.');
  process.exit(0);
}

const PORT = 8000;
let mainWindow;

function logToRenderer(msg) {
  console.log(msg);
  if (mainWindow) {
    mainWindow.webContents.send('log', msg);
  }
}

function waitForPort(port, timeout = 30000, interval = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.on('timeout', socket.destroy);
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start > timeout) {
          reject(new Error(`Timeout waiting for port ${port}`));
        } else {
          setTimeout(check, interval);
        }
      });
      socket.connect(port, '127.0.0.1');
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer.html'));
}

app.whenReady().then(async () => {
  try {
    const nodeBin = getNodeBinary(__dirname);
    await startPM2({ ecosystemFile: path.join(__dirname, 'ecosystem.config.js'), nodeBin, onLog: logToRenderer });
    logToRenderer('⏳ Waiting for port 8000...');
    await waitForPort(PORT);
    logToRenderer('✅ Port 8000 ready. Opening UI...');
    createWindow();
  } catch (err) {
    logToRenderer(`❌ Startup failed: ${err.message}`);
    process.exit(1);
  }
});

app.on('window-all-closed', () => {
  app.quit();
});