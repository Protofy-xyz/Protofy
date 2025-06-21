const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('logAPI', {
  onLog: (callback) => {
    ipcRenderer.on('log', (_event, message) => {
      callback(message);
    });
  },
  onShowLogs: (callback) => ipcRenderer.on('log-window:show-logs', callback),
});

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => shell.openExternal(url)
});