import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let settingsWindow: BrowserWindow | null = null

export function openSettingsWindow(): void {
  if (settingsWindow) {
    settingsWindow.focus()
    return
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  settingsWindow = new BrowserWindow({
    width: 520,
    height: 500,

    resizable: false,
    maximizable: false,

    title: 'Настройки',
    show: false,

    backgroundColor: '#161625',

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  settingsWindow.setPosition(Math.floor(width / 2 - 260), Math.floor(height / 2 - 240))

  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show()
  })

  settingsWindow.setMenuBarVisibility(false)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/settings`)
    settingsWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'settings'
    })
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}
