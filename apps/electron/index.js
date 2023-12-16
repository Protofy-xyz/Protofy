const { app, BrowserWindow, protocol } = require('electron')
const express = require('express');
const path = require('path')

const dev = process.env.NODE_ENV === 'development';
if(dev) {
  process.chdir(__dirname); //next needs to be in the correct directory
}

let handle;
let prepare;
let server;
const PORT = 7777;

if(dev) {
  const next = require('next')
  const nextApp = next({ dev })
  handle = nextApp.getRequestHandler()
  prepare = () => nextApp.prepare()
  server = express()
  server.all('*', (req, res) => {
    return handle(req, res);
  });
} else {
  prepare = async () => true
  server = express()
  server.use(express.static('./.next/server/pages'));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  if(dev) {
    win.loadURL(`http://localhost:${PORT}/screen`)
  } else {
    win.loadFile(path.join(__dirname, '.next/server/pages/screen.html'))
  }
 
  //win.webContents.openDevTools()
}

app.whenReady().then(() => {
  if(!dev) {
    protocol.interceptFileProtocol('file', (request, callback) => {
      let url = request.url.substr(7); // Eliminar 'file://'
      if (url.endsWith('.html')) {
        // html files don't need any path fix
        const pth = path.normalize(url)
        console.log('html path: ', pth )
        callback({ path: pth });
      } else {
        if (process.platform === 'win32') {
          url = url.replace(/^\/[a-zA-Z]:\/+/, '');
        }
  
        url = url.replace(/^_next/,'.next')
        console.log('clean url: ', url)
        url = url.startsWith('/') ? url.substr(1) : url;
        const resourcePath = path.join(__dirname, url.startsWith('.next')? '.' : '.next/server/pages', url);
        console.log('resource path: ', resourcePath);
        callback({ path: resourcePath });
      }
    });
  }

  prepare().then(() => {
    if(dev) {
      //start dev server
      server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
  
        createWindow()
        app.on('activate', function () {
          if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
      });
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})