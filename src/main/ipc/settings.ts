import { BrowserWindow, ipcMain } from 'electron'
import { SettingsStore, store } from '../store/settings/settings.store'
import { openSettingsWindow } from '../windows/settings-window'

export function registerSettingsIpc() {
  ipcMain.on('open-settings', () => {
    openSettingsWindow()
  })

  ipcMain.handle('settings:get', (): SettingsStore => {
    return store.store
  })

  ipcMain.on('settings:set', (_, data: SettingsStore) => {
    store.set(data)

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('settings:updated', data)
    })
  })

  ipcMain.on('settings:reset', () => {
    store.clear()
  })
}
