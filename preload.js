const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('logAPI', {
  onLog: (callback) => {
    ipcRenderer.on('log', (_event, message) => {
      callback(message);
    });
  }
});