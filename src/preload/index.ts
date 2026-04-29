import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// безопасный API для renderer
const api = {}


// Use contextBridge APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)

    contextBridge.exposeInMainWorld('electronAPI', {
      openSettings: () => {
        console.log('openSettings')
        ipcRenderer.send('open-settings')
      }
    })

    contextBridge.exposeInMainWorld('settingsAPI', {
      get: () => ipcRenderer.invoke('settings:get'),
      set: (data: { date: string; color: string }) => ipcRenderer.send('settings:set', data),
      reset: () => ipcRenderer.send('settings:reset'),
      onUpdate: (cb: (data: any) => void) => {
        const listener = (_: any, data: any) => cb(data)

        ipcRenderer.on('settings:updated', listener)

        return () => {
          ipcRenderer.removeListener('settings:updated', listener)
        }
      }
    })

    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Preload error:', error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
