const { app, BrowserWindow } = require('electron')
const next = require('next')
const express = require('express');

//TODO: copy @types/react y @types/node with a postbuild hook in electron-bulder
process.chdir(__dirname);

const dev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const PORT = 7777;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  win.loadURL(`http://localhost:${PORT}`)
  //win.webContents.openDevTools()
}

app.whenReady().then(() => {
  nextApp.prepare().then(() => {
    const server = express();
  
    server.all('*', (req, res) => {
      return handle(req, res);
    });
  

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