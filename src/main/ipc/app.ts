import { ipcMain, app } from 'electron'

export function registerAppIpc() {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })
}
