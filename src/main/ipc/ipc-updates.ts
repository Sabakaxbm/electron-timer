import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

let updateResolve: ((value: any) => void) | null = null
let timeout: NodeJS.Timeout | null = null

export function registerAppUpdateIpc() {
  ipcMain.handle('app:check-for-updates', async () => {
    return new Promise((resolve) => {
      updateResolve = resolve

      timeout = setTimeout(() => {
        resolve({ status: 'timeout' })
        cleanup()
      }, 5000)

      autoUpdater.checkForUpdates()
    })
  })

  ipcMain.handle('app:download-update', async () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.handle('app:install-update', async () => {
    autoUpdater.quitAndInstall()
  })

  // EVENTS (ОДИН РАЗ, ГЛОБАЛЬНО)

  autoUpdater.on('update-available', (info) => {
    updateResolve?.({ status: 'available', version: info.version })
    cleanup()
  })

  autoUpdater.on('update-not-available', () => {
    updateResolve?.({ status: 'none' })
    cleanup()
  })

  autoUpdater.on('error', (err) => {
    updateResolve?.({ status: 'error', message: err.message })
    cleanup()
  })

  autoUpdater.on('download-progress', (progress) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('update:progress', progress.percent)
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('update:downloaded', {
        version: info.version
      })
    })
  })
}

function cleanup() {
  if (timeout) clearTimeout(timeout)
  timeout = null
  updateResolve = null
}
