// 📦 main.js
const { app, BrowserWindow, session, contextBridge, globalShortcut } = require('electron');
const http = require('http');
const net = require('net');
const path = require('path');
const { getNodeBinary, startPM2, stopPM2 } = require('./pm2-wrapper');
const { genToken } = require('protonode')
//set node env to production
const isDev = process.argv.includes('--dev')
const isFullDev = process.argv.includes('--coredev')

// 🔧 Setear NODE_ENV solo si no estaba seteado ya
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = isDev ? 'development' : 'production'
}

if (isFullDev) {
  process.env.FULL_DEV = '1'
}

// 
process.chdir(__dirname);
//load envars from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🟢 Starting app...');
console.log('📁 Current directory:', __dirname);

// Avoid recursion
if (process.env.IS_ECOSYSTEM_CHILD === '1') {
  console.log('🚫 Detected child process. Exiting to avoid recursion.');
  process.exit(0);
}

const PORT = 8000;
let logWindow = null;
let mainWindow = null;

function logToRenderer(msg) {
  console.log(msg);
  if (logWindow) {
    logWindow.webContents.send('log', msg);
  }
}

const genNewSession = () => {
  const data = {
    id: 'admin@localhost',
    type: 'admin',
    admin: true,
    permissions: [["*"], 'admin']
  }
  return {
    user: data,
    token: genToken(data)
  }
}

const userSession = genNewSession()

function waitForPortHttp(port, path = '/', timeout = 30000, interval = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const req = http.get({ hostname: '127.0.0.1', port, path, timeout: 2000 }, res => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(); // ✅ Servidor disponible y responde correctamente
        } else {
          res.resume(); // 🧹 Consumir el cuerpo para liberar memoria
          retry();
        }
      });

      req.on('error', retry);
      req.on('timeout', () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for HTTP server on port ${port}`));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

// Create log window (renderer.html)
function createLogWindow() {
  logWindow = new BrowserWindow({
    width: 900,
    height: 700,
    title: 'Service Logs',
    autoHideMenuBar: true,
    // useContentSize: true,
    resizable: true,
    scrollBounce: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  logWindow.loadFile(path.join(__dirname, 'renderer.html'));
  logWindow.on('closed', () => {
    logWindow = null;
  });
}

// Create main window (localhost:8000)
function createMainWindow() {
  const sessionStr = JSON.stringify(userSession);
  const encoded = encodeURIComponent(sessionStr);

  const electronSession = session.defaultSession;

  // Set cookie
  const cookie = {
    url: 'http://localhost:8000',
    name: 'session',
    value: encoded,
    path: '/',
  };

  electronSession.cookies.set(cookie)
    .then(() => {
      mainWindow = new BrowserWindow({
        width: 1700,
        height: 1000,
        title: 'Main App',
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload-main.js'),
          additionalArguments: [`--session=${encoded}`],
          contextIsolation: false,
          nodeIntegration: false,
        },
      });

      mainWindow.maximize();
      //close log window
      if (logWindow) {
        logWindow.close();
      }

      mainWindow.loadURL('http://localhost:8000/workspace/dashboard');


      let isQuitting = false;

      app.on('before-quit', async (event) => {
        if (!isQuitting) {
          event.preventDefault();
          isQuitting = true;
      
          logToRenderer('🛑 Cleaning up PM2...');
          await stopPM2(logToRenderer);
      
          app.quit();
        }
      });
    })
    .catch(error => {
      console.error('❌ Failed to set session cookie:', error);
    });
}

app.whenReady().then(async () => {
  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.reload();
    }
  });

  try {
    const nodeBin = getNodeBinary(__dirname);

    let resolveWhenCoreReady;
    const coreStarted = new Promise(resolve => {
      resolveWhenCoreReady = resolve;
    });

    await startPM2({
      ecosystemFile: path.join(__dirname, 'ecosystem.config.js'),
      nodeBin,
      onLog: logToRenderer,
      waitForLog: line => {
        if (line.includes('Service Started: core')) {
          resolveWhenCoreReady(); // ✅
        }
      }
    });

    createLogWindow(); // Show logs immediately

    logToRenderer('⏳ Waiting for core service to start...');
    await coreStarted;

    logToRenderer('⏳ Waiting for port 8000...');
    await waitForPortHttp(PORT, '/workspace/dashboard');

    await new Promise(resolve => setTimeout(resolve, 1000));
    logToRenderer('✅ Port 8000 ready. Opening main window...');
    createMainWindow();
  } catch (err) {
    logToRenderer(`❌ Startup failed: ${err.message}`);
    process.exit(1);
  }
});