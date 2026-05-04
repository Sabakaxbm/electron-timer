import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: {
      openSettings: () => void
    }
    settingsAPI: {
      get: () => Promise<{ date: string; color: string }>
      set: (data: { date: string; color: string }) => void
      reset: () => void
      onUpdate(cb: (data: { date: string; color: string }) => void): () => void
    }
    appVersion: {
      getVersion: () => Promise<string>
      onUpdateAvailable: (cb: (data: { version: string }) => void) => void
      onNoUpdate: (cb: () => void) => void
      onUpdateError: (cb: (msg: string) => void) => void
    }
  }
}
