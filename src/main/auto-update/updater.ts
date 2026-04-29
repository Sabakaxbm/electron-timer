import { autoUpdater } from 'electron-updater'

export function initAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    console.log('Update available')
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded')
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
  })
}
