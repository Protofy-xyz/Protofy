const { app, BrowserWindow, ipcMain } = require('electron');
const pm2 = require('pm2');
const net = require('net');
const path = require('path');
const fs = require('fs');


process.chdir(__dirname);
console.log('Starting app...');
console.log('Current directory:', __dirname);

const isDev = process.argv.includes('--dev');
process.env.NODE_ENV = isDev ? 'development' : 'production';

const PORT = 8000;
const ECOSYSTEM_FILE = 'ecosystem.config.js';

let mainWindow;

function logToRenderer(msg) {
  console.log(msg); // también logea en consola
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
          reject(new Error(`Timeout esperando a que el puerto ${port} esté disponible`));
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

function startPM2AndApp() {
  pm2.connect(err => {
    if (err) {
      logToRenderer(`❌ Error conectando con PM2: ${err.message}`);
      process.exit(2);
    }

    logToRenderer('✅ PM2 conectado. Lanzando app...');

    pm2.start({
      script: ECOSYSTEM_FILE,
    }, err => {
      if (err) {
        logToRenderer(`❌ Error arrancando PM2 con ecosystem: ${err.message}`);
        process.exit(2);
      }

      logToRenderer('🚀 Ecosystem lanzado con éxito. Esperando a que el puerto 8000 esté disponible...');

      waitForPort(PORT)
        .then(() => {
          logToRenderer('✅ Puerto 8000 disponible. Lanzando ventana.');
          createWindow();
        })
        .catch(err => {
          logToRenderer(`❌ ${err.message}`);
          process.exit(1);
        });
    });
  });
}

// Redirigir console.log y error al renderer
['log', 'error'].forEach(fn => {
  const original = console[fn];
  console[fn] = (...args) => {
    original(...args);
    logToRenderer(args.join(' '));
  };
});

app.whenReady().then(startPM2AndApp);

app.on('window-all-closed', () => {
  app.quit();
});