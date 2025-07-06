const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
  downloadAsset: (url, assetName) => {
    ipcRenderer.send('download-asset', { url, assetName })
  }
});