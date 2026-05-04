import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UpdateAvailable, UpdateDownloaded } from './types'

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

    contextBridge.exposeInMainWorld('appVersion', {
      getVersion: () => ipcRenderer.invoke('app:get-version'),

      checkForUpdates: () => ipcRenderer.invoke('app:check-for-updates'),

      downloadUpdate: () => ipcRenderer.invoke('app:download-update'),

      installUpdate: () => ipcRenderer.invoke('app:install-update'),

      onUpdateAvailable: (cb: (data: UpdateAvailable) => void) => {
        const handler = (_: Electron.IpcRendererEvent, data: UpdateAvailable) => cb(data)
        ipcRenderer.on('update:available', handler)
        return () => ipcRenderer.removeListener('update:available', handler)
      },

      onNoUpdate: (cb: () => void) => {
        const handler = () => cb()
        ipcRenderer.on('update:none', handler)
        return () => ipcRenderer.removeListener('update:none', handler)
      },

      onUpdateError: (cb: (msg: string) => void) => {
        const handler = (_: Electron.IpcRendererEvent, msg: string) => cb(msg)
        ipcRenderer.on('update:error', handler)
        return () => ipcRenderer.removeListener('update:error', handler)
      },

      onDownloadProgress: (cb: (percent: number) => void) => {
        const handler = (_: Electron.IpcRendererEvent, percent: number) => cb(percent)
        ipcRenderer.on('update:progress', handler)
        return () => ipcRenderer.removeListener('update:progress', handler)
      },

      onDownloaded: (cb: (data: UpdateDownloaded) => void) => {
        const handler = (_: Electron.IpcRendererEvent, data: UpdateDownloaded) => cb(data)
        ipcRenderer.on('update:downloaded', handler)
        return () => ipcRenderer.removeListener('update:downloaded', handler)
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
