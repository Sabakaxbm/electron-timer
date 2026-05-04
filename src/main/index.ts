import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './windows/main-window'
import { registerSettingsIpc } from './ipc/settings'
import { initAutoUpdater } from './auto-update/updater'
import { registerAppIpc } from './ipc/app'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerAppIpc()
  registerSettingsIpc()

  createMainWindow()
  initAutoUpdater()
})
