const { app, BrowserWindow } = require('electron')
const express = require('express');

process.chdir(__dirname);

const dev = process.env.NODE_ENV === 'development';
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
  win.loadURL(`http://localhost:${PORT}/screen`+(dev?'':'.html'))
  //win.webContents.openDevTools()
}

app.whenReady().then(() => {
  prepare().then(() => {
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);

      createWindow()
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    });
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})