import { ElectronAPI } from '@electron-toolkit/preload'

export interface SettingsData {
  date: string
  color: string
}

export interface UpdateAvailableData {
  version: string
}

export type UpdateStatus =
  | { status: 'available'; version: string }
  | { status: 'none' }
  | { status: 'error'; message: string }
  | { status: 'timeout' }

declare global {
  interface Window {
    electron: ElectronAPI

    api: unknown

    electronAPI: {
      openSettings: () => void
    }

    settingsAPI: {
      get: () => Promise<SettingsData>
      set: (data: SettingsData) => void
      reset: () => void
      onUpdate: (cb: (data: SettingsData) => void) => () => void
    }

    appVersion: {
      getVersion: () => Promise<string>

      checkForUpdates: () => Promise<UpdateStatus>

      onUpdateAvailable: (
        cb: (data: UpdateAvailableData) => void
      ) => () => void

      onNoUpdate: (
        cb: () => void
      ) => () => void

      onUpdateError: (
        cb: (msg: string) => void
      ) => () => void

      onDownloadProgress: (
        cb: (percent: number) => void
      ) => () => void

      onDownloaded: (
        cb: (data: { version: string }) => void
      ) => () => void

      downloadUpdate: () => void
      installUpdate: () => void
    }
  }
}

export {}
