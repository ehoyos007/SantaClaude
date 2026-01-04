import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import Store from 'electron-store'
import { createTerminal, writeToTerminal, resizeTerminal, killTerminal, killAllTerminals } from './terminal.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize electron-store for persistent storage
const store = new Store({
  name: 'claude-code-projects',
  defaults: {
    projects: []
  }
})

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow

// Create native macOS menu
function createMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu:new-project')
          }
        },
        { type: 'separator' },
        { role: 'close' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Claude Code Documentation',
          click: async () => {
            const { shell } = await import('electron')
            shell.openExternal('https://docs.anthropic.com/en/docs/claude-code')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#FAF9F7', // Claude cream background
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // Required for node-pty
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  killAllTerminals()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  killAllTerminals()
})

// IPC Handlers for terminal
ipcMain.handle('terminal:create', async (event, { cwd, command }) => {
  const terminalId = createTerminal(cwd, command, (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal:data', { terminalId, data })
    }
  }, () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal:exit', { terminalId })
    }
  })
  return terminalId
})

ipcMain.handle('terminal:write', async (event, { terminalId, data }) => {
  writeToTerminal(terminalId, data)
})

ipcMain.handle('terminal:resize', async (event, { terminalId, cols, rows }) => {
  resizeTerminal(terminalId, cols, rows)
})

ipcMain.handle('terminal:kill', async (event, { terminalId }) => {
  killTerminal(terminalId)
})

// IPC Handlers for electron-store
ipcMain.handle('store:get', async (event, key) => {
  return store.get(key)
})

ipcMain.handle('store:set', async (event, { key, value }) => {
  store.set(key, value)
  return true
})

ipcMain.handle('store:delete', async (event, key) => {
  store.delete(key)
  return true
})
