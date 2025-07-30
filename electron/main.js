// 📦 main.js
const { app, BrowserWindow, session, ipcMain, shell } = require('electron');
const http = require('http');
const https = require('https');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const process = require('process');
const fs = require('fs');


function getNodePath(rootPath) {
    //get path to the local Node.js binary
  let nodePath = os.platform() === 'win32' ? path.join(rootPath, 'bin/node.exe') : path.join(rootPath, 'bin/node')
  const hasLocalNode = fs.existsSync(nodePath);

  if (hasLocalNode) {
    console.log('🟢 Local Node.js binary found. Using it for child processes: ', nodePath);
    process.execPath = nodePath; // Set the Node.js binary path for child processes
  } else {
    nodePath = 'node'
    console.warn('🟡 No local Node.js binary found. Using system Node.js.');
  }
  return nodePath;
}

module.exports = function start(rootPath) {
  console.log('🚀 Starting Vento Launcher...');
  console.log('📂 Root path:', rootPath);

  const nodePath = getNodePath(rootPath);

  process.chdir(rootPath);
  console.log('🟢 Starting app...');
  console.log('📁 Current directory:', rootPath);

  // Avoid recursion
  if (process.env.IS_ECOSYSTEM_CHILD === '1') {
    console.log('🚫 Detected child process. Exiting to avoid recursion.');
    process.exit(0);
  }

  let logWindow = null;
  let mainWindow = null;

  function logToRenderer(msg) {
    try {
      //if inside process.argv there is a -v argument, then log to console
      if (process.argv.includes('-v') || process.argv.includes('--verbose')) {
        console.log(msg);
      }
      logWindow.webContents.send('log', msg);
    } catch (e) {
      //console.error('❌ Error sending log to renderer:', e);
    }
  }

  const genNewSession = () => {
    const { genToken } = require('protonode')
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

  async function runCommand(command, args = [], onData = (line) => { }) {
    console.log(`🔧 Running command: ${command} ${args.join(' ')}`);
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        windowsHide: true
      });

      child.stdout.setEncoding('utf-8');
      child.stderr.setEncoding('utf-8');

      child.stdout.on('data', data => {
        onData(data.toString());
        logToRenderer(data);
      });

      child.stderr.on('data', data => {
        onData(data.toString());
        logToRenderer(data);
      });

      child.on('error', err => {
        logToRenderer(`❌ Error: ${err.message}`);
        reject(err);
      });
      child.on('close', code => {
        resolve(code);
      });
    });
  }

  async function runYarn(command = '', onLog = (x) => { }) {
    return runCommand(nodePath, ['.yarn/releases/yarn-4.1.0.cjs', ...command.split(' ')], (line) => {
      onLog(line);
    });
  }

  function waitForPortHttp(url, timeout = 120000, interval = 1000) {
    //get port host and path from url
    const urlObj = new URL(url);
    const port = urlObj.port || (urlObj.protocol === 'http:' ? 80 : 443);
    const path = urlObj.pathname || '/';
    const hostname = urlObj.hostname || 'localhost';


    return new Promise((resolve, reject) => {
      const start = Date.now();

      const check = () => {
        const req = http.get({ hostname, port, path, timeout: 5000 }, res => {
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
      width: 1100,
      height: 800,
      title: 'Service Logs',
      autoHideMenuBar: true,
      // useContentSize: true,
      resizable: true,
      scrollBounce: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      }
    });

    logWindow.on('close', (event) => {
      event.preventDefault();
      logWindow.hide();
    });

    logWindow.loadFile(path.join(__dirname, 'splash', 'renderer.html'));
  }

  // Create main window (localhost:8000)
  function createMainWindow(fullscreen, initialUrl) {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
    console.log('ENVIRONMENT VARIABLES:');
    for (const [key, value] of Object.entries(process.env)) {
      console.log(`${key}=${value}`);
    }
    console.log('📦 Creating main window...');
    const userSession = genNewSession()
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
            sandbox: false,
            webSecurity: true,
            media: true
          },
          fullscreen: fullscreen
        });

        mainWindow.maximize();

        mainWindow.on('close', async () => {
          try {
            console.log('🔚 Main window closed. Stopping PM2 and exiting...');
            await runYarn('kill');
          } catch (err) {
            console.error('❌ Error stopping PM2:', err);
          } finally {
            console.log('👋 Exiting app...');
            app.exit(0); // esto termina el proceso principal
          }
        });
        //hide log window
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
    try {
      let resolveWhenCoreReady;
      const coreStarted = new Promise(resolve => {
        resolveWhenCoreReady = resolve;
      });

      createLogWindow(); // Show logs immediately

      //if run from app-dev, skip install since this will delete devdependencies, including electron itself
      if (!global.skipInstall && !process.env.SKIP_INSTALL) {
        await runYarn('workspaces focus --all --production');
        console.log('✅ Yarn completed successfully.');
      }

      await runYarn('kill'); // Ensure any previous PM2 processes are killed
      console.log('💣 Previous PM2 processes killed.');

      // await runYarn('prepare-dev');

      const args = require('minimist')(process.argv.slice(2));
      runYarn(args.dev ? 'dev-fast' : 'start-fast', line => {
        if (line.includes('Service Started: core')) {
          resolveWhenCoreReady(); // ✅
        }
      })
      console.log('☕ Booting with mode:', args.dev ? 'dev-fast' : 'start-fast');
      console.log('⏳ Waiting for core service to start...');
      await coreStarted;
      console.log('✅ Core service started.');

      const initialUrl = args.initialUrl || 'http://localhost:8000/workspace/boards';
      console.log('⏳ Waiting for port 8000...');
      await waitForPortHttp(initialUrl);

      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Port 8000 ready. Opening main window...');
      createMainWindow(args.fullscreen, initialUrl);
    } catch (err) {
      console.log(`❌ Startup failed: ${err.message}`);
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
      logWindow.webContents.send('log-window:show-logs');
      logWindow.show();
      logWindow.focus();
    }
  });

  ipcMain.on('open-window', (event, { window }) => {
    const browserWindow = new BrowserWindow({
      width: 1100,
      height: 800,
      title: window,
      autoHideMenuBar: true,
      resizable: true,
      scrollBounce: false,
      webPreferences: {
        preload: path.join(__dirname, "windows", window, 'preload.js'),
      }
    });

    browserWindow.loadFile(path.join(__dirname, "windows", window, 'renderer.html'));
  })

  ipcMain.on('download-asset', (event, { url, assetName }) => {
    // save to downloads: app.getPath('downloads')
    console.log("downloading asset:", assetName)
    const filePath = path.join(__dirname, "data", "assets", assetName + '.zip');
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('asset download complete:', filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => { });
      console.error('error downloading asset:', err.message);
    });
  })
}