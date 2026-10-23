const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('recordsAPI', {
  list: () => ipcRenderer.invoke('records:list'),
  save: (record) => ipcRenderer.invoke('records:save', record),
  remove: (id) => ipcRenderer.invoke('records:delete', id)
});
