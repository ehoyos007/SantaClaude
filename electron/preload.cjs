const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal operations
  createTerminal: (cwd, command) => ipcRenderer.invoke('terminal:create', { cwd, command }),
  writeTerminal: (terminalId, data) => ipcRenderer.invoke('terminal:write', { terminalId, data }),
  resizeTerminal: (terminalId, cols, rows) => ipcRenderer.invoke('terminal:resize', { terminalId, cols, rows }),
  killTerminal: (terminalId) => ipcRenderer.invoke('terminal:kill', { terminalId }),

  // Terminal event listeners
  onTerminalData: (callback) => {
    const handler = (event, { terminalId, data }) => callback(terminalId, data)
    ipcRenderer.on('terminal:data', handler)
    return () => ipcRenderer.removeListener('terminal:data', handler)
  },
  onTerminalExit: (callback) => {
    const handler = (event, { terminalId }) => callback(terminalId)
    ipcRenderer.on('terminal:exit', handler)
    return () => ipcRenderer.removeListener('terminal:exit', handler)
  },

  // Storage operations (electron-store)
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, value) => ipcRenderer.invoke('store:set', { key, value }),
  storeDelete: (key) => ipcRenderer.invoke('store:delete', key),

  // Check if running in Electron
  isElectron: true
})
