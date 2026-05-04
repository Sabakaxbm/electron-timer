import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'
import { createWindowMock } from './mocks/window'

beforeEach(() => {
  const mock = createWindowMock()

  Object.defineProperty(window, 'settingsAPI', {
    value: mock.settingsAPI,
    writable: true
  })

  Object.defineProperty(window, 'appVersion', {
    value: mock.appVersion,
    writable: true
  })

  Object.defineProperty(window, 'electronAPI', {
    value: mock.electronAPI,
    writable: true
  })

  vi.resetAllMocks()
})
