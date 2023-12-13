const { app, BrowserWindow } = require('electron')
const next = require('next')
const express = require('express');
const path = require('path');

process.chdir(path.join(__dirname, 'apps/next'));
//const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ 
  dev:true
})

const handle = nextApp.getRequestHandler()
const PORT = 3000;

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