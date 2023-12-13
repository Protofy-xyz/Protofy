const { app, BrowserWindow } = require('electron')
const next = require('next')
const express = require('express');

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  win.loadURL(`http://localhost:3000`)
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  nextApp.prepare().then(() => {
    const server = express();
  
    server.all('*', (req, res) => {
      return handle(req, res);
    });
  
    const PORT = dev?3000:4000;
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