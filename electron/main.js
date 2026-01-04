import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { createTerminal, writeToTerminal, resizeTerminal, killTerminal, killAllTerminals } from './terminal.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#111827',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // Required for node-pty
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
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
