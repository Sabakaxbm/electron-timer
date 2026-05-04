import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow } from 'electron'

function sendToAll(channel: string, data: any) {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(channel, data)
  })
}

export function initAutoUpdater() {
  if (!app.isPackaged) return

  autoUpdater.logger = console
  autoUpdater.autoDownload = false

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'Sabakaxbm',
    repo: 'electron-timer',
    private: false
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available', info.version)

    sendToAll('update:available', {
      version: info.version
    })
  })

  autoUpdater.on('update-not-available', () => {
    sendToAll('update:none', {})
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendToAll('update:downloaded', {
      version: info.version
    })

    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', (err) => {
    console.error('Updater error:', err)

    sendToAll('update:error', err.message)
  })
}
