const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    createProject: (project) => ipcRenderer.send('create-project', project),
    onProjectCreated: (callback) => ipcRenderer.on('create-project-done', (event, data) => callback(data))
});