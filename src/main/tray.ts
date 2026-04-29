import { app, BrowserWindow, Menu, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'
import { openSettingsWindow } from './setting-window'

let tray: Tray | null = null

export function createTray(): void {
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Настройки',
      click: () => openSettingsWindow()
    },
    {
      type: 'separator'
    },
    {
      label: 'Выход',
      click: () => app.quit()
    }
  ])

  tray.setToolTip('Моё приложение')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      win.isVisible() ? win.hide() : win.show()
    }
  })
}
