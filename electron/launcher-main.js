const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

const PROJECTS_DIR = process.platform === 'darwin'
  ? path.join(app.getPath('userData'), 'vento-projects')
  : path.resolve('projects');

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

let mainWindow;

function createWindow() {
  const launcherPath = isDev ? 'http://localhost:3008/launcher':path.join(__dirname, 'launcher', 'index.html');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile(launcherPath);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Interceptar file:///public/* → ./launcher/public/*
  protocol.interceptFileProtocol('file', (request, callback) => {
    const parsedUrl = new URL(request.url);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // Si termina en /public/...
    if (pathname.includes('/public/')) {
      const relativePath = pathname.split('/public/')[1]; // e.g. fonts/foo.woff2
      const resolvedPath = path.join(__dirname, 'launcher', 'public', relativePath);
      callback({ path: resolvedPath });
    } else if(pathname.includes('/_next/')) {
      const relativePath = pathname.split('/_next/')[1]; // e.g. static/chunks/main.js
      const resolvedPath = path.join(__dirname, 'launcher', '_next', relativePath);
      callback({ path: resolvedPath });
    } else {
      callback({ path: pathname });
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});
