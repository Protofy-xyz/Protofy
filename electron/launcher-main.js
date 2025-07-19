const { app, BrowserWindow, protocol, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

const isDev = process.argv.includes('--dev');
const PROJECTS_DIR = path.join(app.getPath('userData'), 'vento-projects');
console.log('Projects directory:', PROJECTS_DIR);
const PROJECTS_FILE = path.join(PROJECTS_DIR, 'projects.json');

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

function readProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
      return projects.map(project => {
        return {
          ...project,
          status: fs.existsSync(path.join(PROJECTS_DIR, project.name)) ? 'downloaded' : 'pending',
        }
      })
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
      /^\/api\/v1\/projects\/[^\/]+\/download$/.test(pathname)
    ) {
      const match = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/download$/);
      const projectName = match?.[1];

      //read project to get version
      const projects = readProjects();
      const project = projects.find(p => p.name === projectName);
      if (!project) {
        respond({
          statusCode: 404,
          data: Buffer.from('Project not found')
        });
        return;
      }

      //get zip url from github
      const url = 'https://api.github.com/repos/Protofy-xyz/Vento/releases/tags/v' + project.version
      const response = await fetch(url)
      const data = await response.json()
      const zipBallUrl = data?.assets[0]?.browser_download_url;
      if (!zipBallUrl) {
        respond({
          statusCode: 404,
          data: Buffer.from('Release not found')
        });
        return;
      }

      //download the zip file to PROJECTS_DIR
      const zipFilePath = path.join(PROJECTS_DIR, `${projectName}.zip`);
      const zipResponse = await fetch(zipBallUrl);
      if (!zipResponse.ok) {
        respond({
          statusCode: zipResponse.status,
          data: Buffer.from('Failed to download project zip')
        });
        return;
      }
      const arrayBuffer = await zipResponse.arrayBuffer();
      const zipBuffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(zipFilePath, zipBuffer);
      console.log('Project downloaded:', zipFilePath);

      //extract the zip file with adm-zip
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(zipFilePath);
      const extractPath = path.join(PROJECTS_DIR);
      zip.extractAllTo(extractPath, true);
      console.log('Project extracted to:', extractPath);
      //rename the extracted folder to the project name
      const extractedFolderName = zip.getEntries()[0].entryName.split('/')[0];
      const extractedFolderPath = path.join(extractPath, extractedFolderName);
      const projectFolderPath = path.join(PROJECTS_DIR, projectName);
      fs.renameSync(extractedFolderPath, projectFolderPath);
      console.log('Project folder renamed to:', projectFolderPath);
      //remove the zip file
      fs.unlinkSync(zipFilePath);
      console.log('Zip file removed:', zipFilePath);

      //run the removeDevMode script inside the project folder
      const removeDevModeScript = path.join(projectFolderPath, 'scripts', 'removeDevMode.js');
      require(removeDevModeScript);
      console.log('removeDevMode script executed');

      //run the download-binaries script inside the project folder
      const downloadBinariesScript = path.join(projectFolderPath, 'scripts', 'download-bins.js');
      require(downloadBinariesScript)(AdmZip, require('tar'))
      console.log('download-bins script executed');
      //reply to the renderer process
      respond({
        mimeType: 'application/json',
        data: Buffer.from(JSON.stringify({ success: true, message: 'done' }))
      });

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
        const projectPath = path.join(PROJECTS_DIR, projectName);
        if (fs.existsSync(projectPath)) {
          fs.rmSync(projectPath, { recursive: true, force: true });
          console.log('Project deleted:', projectPath);
        }
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
    } else if (
      request.method === 'GET' &&
      /^\/api\/v1\/projects\/[^\/]+\/run$/.test(pathname)
    ) {
      const match = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/run$/);
      const projectName = match?.[1];

      //read project to get version
      const projects = readProjects();
      const project = projects.find(p => p.name === projectName);
      if (!project) {
        respond({
          statusCode: 404,
          data: Buffer.from('Project not found')
        });
        return;
      }


      const projectFolderPath = path.join(PROJECTS_DIR, projectName);
      require(projectFolderPath+'/electron/main.js');
      //reply to the renderer process
      respond({
        mimeType: 'application/json',
        data: Buffer.from(JSON.stringify({ success: true, message: 'done' }))
      });

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
  app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});

ipcMain.on('create-project', (event, newProject) => {
  const projects = readProjects();
  projects.push({
    ...newProject,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  writeProjects(projects);
  event.reply('create-project-done', { success: true });
});