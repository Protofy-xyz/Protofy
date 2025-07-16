const { app, BrowserWindow, protocol, session } = require('electron');
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
  const launcherUrl = isDev
    ? 'http://localhost:8000/launcher'
    : `file://${path.join(__dirname, 'launcher', 'index.html')}`;

  const webPreferences = {
    contextIsolation: true,
    nodeIntegration: false,
    webSecurity: !isDev,
    allowRunningInsecureContent: isDev
  };

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    title: 'Vento Launcher',
    autoHideMenuBar: true,
    webPreferences
  });

  mainWindow.loadURL(launcherUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);


app.whenReady().then(async () => {
  protocol.registerBufferProtocol('app', async (request, respond) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const projects = [
      {
        name: 'Project 1',
        version: '1.0',
        status: 'downloaded',
        description: 'This is a sample project for demonstration purposes.'
      }, 
      {
        name: 'Project 2',
        version: '1.1',
        status: 'pending',
        description: 'This is another sample project with a different status.'
      }
    ]
    if (pathname.startsWith('/api/v1/projects')) {
      // Simula una API con JSON
      const responseBody = JSON.stringify({items: projects, total: projects.length, itemsPerPage: projects.length, page: 0, pages: 1});
      respond({
        mimeType: 'application/json',
        data: Buffer.from(responseBody)
      });
      return;
    }

    // Si es un archivo estático
    if (pathname.startsWith('/launcher/')) {
      const filePath = path.join(__dirname, pathname);
      respond({ path: filePath });
      return;
    }

    // Not found
    respond({ statusCode: 404, data: Buffer.from('not found') });
  });

  if (!isDev) {
    // Interceptar rutas file:// en producción
    protocol.interceptFileProtocol('file', (request, callback) => {
      const parsedUrl = new URL(request.url);
      const pathname = decodeURIComponent(parsedUrl.pathname);

      if (pathname.includes('/public/')) {
        const relativePath = pathname.split('/public/')[1];
        const resolvedPath = path.join(__dirname, 'launcher', 'public', relativePath);
        callback({ path: resolvedPath });
      } else if (pathname.includes('/_next/')) {
        const relativePath = pathname.split('/_next/')[1];
        const resolvedPath = path.join(__dirname, 'launcher', '_next', relativePath);
        callback({ path: resolvedPath });
      } else {
        callback({ path: pathname });
      }
    });
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});
