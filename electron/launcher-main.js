const { app, BrowserWindow, protocol, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

const isDev = process.argv.includes('--dev');
const PROJECTS_DIR = path.join(app.getPath('userData'), 'vento-projects');
const PROJECTS_FILE = path.join(PROJECTS_DIR, 'projects.json');

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

function readProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error reading projects.json:', err);
    return [];
  }
}

function writeProjects(projects) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing projects.json:', err);
  }
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
    allowRunningInsecureContent: isDev,
    preload: path.join(__dirname, 'preload-launcher.js'),
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

    console.log('Request for:', pathname);
    if (request.method === 'GET' && pathname === '/api/v1/projects') {
      const projects = readProjects();
      const responseBody = JSON.stringify({
        items: projects,
        total: projects.length,
        itemsPerPage: projects.length,
        page: 0,
        pages: 1
      });

      respond({
        mimeType: 'application/json',
        data: Buffer.from(responseBody)
      });
      return;
    } else if (
      request.method === 'GET' &&
      /^\/api\/v1\/projects\/[^\/]+\/delete$/.test(pathname)
    ) {
      const match = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/delete$/);
      const projectName = match?.[1];

      if (projectName) {
        const projects = readProjects();
        const updatedProjects = projects.filter(project => project.name !== projectName);
        writeProjects(updatedProjects);
        respond({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify({ success: true, message: 'Project deleted successfully' }))
        });
      } else {
        respond({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify({ success: false, message: 'Invalid project name' }))
        });
      }
      return;
    }
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

ipcMain.on('create-project', (event, newProject) => {
  const projects = readProjects();
  projects.push(newProject);
  writeProjects(projects);
  event.reply('create-project-done', { success: true });
});