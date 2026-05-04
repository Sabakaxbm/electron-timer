import { vi } from 'vitest'

export function createWindowMock() {
  return {
    settingsAPI: {
      get: vi.fn().mockResolvedValue({
        date: '2025-01-01T10:00',
        color: '#ffffff'
      }),
      set: vi.fn(),
      reset: vi.fn(),
      onUpdate: vi.fn()
    },

    appVersion: {
      getVersion: vi.fn().mockResolvedValue('1.0.4'),

      checkForUpdates: vi.fn().mockResolvedValue({
        status: 'none'
      }),

      downloadUpdate: vi.fn(),
      installUpdate: vi.fn(),

      onUpdateAvailable: vi.fn(),
      onNoUpdate: vi.fn(),
      onUpdateError: vi.fn(),

      onDownloadProgress: vi.fn(),
      onDownloaded: vi.fn()
    },

    electronAPI: {
      openSettings: vi.fn()
    }
  }
}
