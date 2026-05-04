import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import Settings from '@renderer/ui/settings/settings'

const mockGet = vi.fn()
const mockSet = vi.fn()
const mockReset = vi.fn()
const mockGetVersion = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  mockGet.mockResolvedValue({
    date: '2025-01-01T10:00',
    color: '#ffffff'
  })

  mockGetVersion.mockResolvedValue('1.0.4')

  window.settingsAPI.get = mockGet
  window.settingsAPI.set = mockSet
  window.settingsAPI.reset = mockReset

  window.appVersion.getVersion = mockGetVersion
})

describe('Settings', () => {
  it('renders header and version', async () => {
    render(<Settings />)

    expect(screen.getByText('Settings')).toBeInTheDocument()

    expect(await screen.findByText(/Текущая версия:\s*1\.0\.4/)).toBeInTheDocument()
  })

  it('loads settings from API', async () => {
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2025-01-01T10:00')).toBeInTheDocument()
    })
  })

  it('updates color input', async () => {
    const user = userEvent.setup()

    render(<Settings />)

    const colorInput = await screen.findByDisplayValue('#ffffff')

    await user.click(colorInput)

    fireEvent.change(colorInput, {
      target: { value: '#000000' }
    })

    expect(colorInput).toHaveValue('#000000')
  })

  it('calls save API', async () => {
    const user = userEvent.setup()

    render(<Settings />)

    await user.click(screen.getByText('Save'))

    expect(mockSet).toHaveBeenCalledTimes(1)
  })

  it('calls reset API and reloads data', async () => {
    const user = userEvent.setup()

    render(<Settings />)

    await user.click(screen.getByText('Reset'))

    expect(mockReset).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalled()
  })
})
