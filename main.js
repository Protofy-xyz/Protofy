// 📦 main.js
const { app, BrowserWindow, session, ipcMain, globalShortcut, shell } = require('electron');
const http = require('http');
const net = require('net');
const path = require('path');
const { getNodeBinary, startPM2, stopPM2 } = require('./pm2-wrapper');
const { genToken } = require('protonode')
const { execSync } = require('child_process');

const minimist = require('minimist');
const args = minimist(process.argv.slice(1));
const isDev = args.dev || false;
const isFullDev = args.coredev || false;
const initialUrl = args.initialUrl || 'http://localhost:8000/workspace/boards';
const fullscreen = args.fullscreen || false;
const dev = args.dev || false;

process.env.NODE_ENV = 'development';
if (dev) {
  //set envar FULL_DEV=1
  process.env.FULL_DEV = '1';
}

// 🔧 Setear NODE_ENV solo si no estaba seteado ya
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = isDev ? 'development' : 'production'
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

function waitForPortHttp(url, timeout = 30000, interval = 500) {
  //get port host and path from url
  const urlObj = new URL(url);
  const port = urlObj.port || (urlObj.protocol === 'http:' ? 80 : 443);
  const path = urlObj.pathname || '/';
  const hostname = urlObj.hostname || 'localhost';


  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const req = http.get({ hostname, port, path, timeout: 2000 }, res => {
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
    fullscreen: fullscreen,
  });

  logWindow.loadFile(path.join(__dirname, 'renderer.html'));
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
          contextIsolation: true,
          nodeIntegration: false,
        },
        fullscreen: fullscreen
      });

      mainWindow.maximize();

      mainWindow.on('close', async () => {
        try {
          console.log('🔚 Main window closed. Stopping PM2 and exiting...');
          await stopPM2(logToRenderer);
        } catch (err) {
          console.error('❌ Error stopping PM2:', err);
        } finally {
          app.exit(0); // esto termina el proceso principal
        }
      });
      //close log window
      if (logWindow) {
        logWindow.hide();
      }

      mainWindow.loadURL(initialUrl);
    })
    .catch(error => {
      console.error('❌ Failed to set session cookie:', error);
    });
}

app.whenReady().then(async () => {
  // globalShortcut.register('CommandOrControl+R', () => {
  //   if (mainWindow && !mainWindow.isDestroyed()) {
  //     mainWindow.reload();
  //   }
  // });

  try {
    const nodeBin = getNodeBinary(__dirname);

    let resolveWhenCoreReady;
    const coreStarted = new Promise(resolve => {
      resolveWhenCoreReady = resolve;
    });

    //run yarn
    // execSync(`node ./.yarn/releases/yarn-4.1.0.cjs`, { stdio: 'inherit' });

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
    await waitForPortHttp(initialUrl);

    await new Promise(resolve => setTimeout(resolve, 1000));
    logToRenderer('✅ Port 8000 ready. Opening main window...');
    createMainWindow();
  } catch (err) {
    logToRenderer(`❌ Startup failed: ${err.message}`);
    process.exit(1);
  }
});

ipcMain.on('open-external-url', (_event, url) => {
  shell.openExternal(url);
});

ipcMain.on('toggle-log-window', () => {
  if (!logWindow) return;

  if (logWindow.isVisible()) {
    logWindow.hide();
  } else {
    logWindow.show();
    logWindow.focus();
  }
});