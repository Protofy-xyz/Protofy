const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('logAPI', {
  onLog: (callback) => {
    ipcRenderer.on('log', (_event, message) => {
      callback(message);
    });
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => shell.openExternal(url)
});