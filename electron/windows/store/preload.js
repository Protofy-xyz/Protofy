const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
  downloadAsset: (url, assetName) => {
    ipcRenderer.send('download-asset', { url, assetName })
  }
});

// contextBridge.exposeInMainWorld('electronAPI', {
//   onAssetDownloaded: (callback) => ipcRenderer.on('asset-downloaded', (_event, data) => callback(data)),
// });