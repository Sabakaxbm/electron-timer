import Store from 'electron-store'
import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'

type SettingsStore = {
  date: string
  color: string
}

const testDir = path.resolve('.tmp-test-store')

function createStore() {
  return new Store<SettingsStore>({
    cwd: testDir,
    defaults: {
      date: '2026-01-01',
      color: '#ffffff'
    }
  })
}

beforeEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true })
})

describe('electron-store (real)', () => {
  it('returns default values on first init', () => {
    const store = createStore()

    expect(store.get('date')).toBe('2026-01-01')
    expect(store.get('color')).toBe('#ffffff')
  })

  it('persists data between instances', () => {
    const store = createStore()

    store.set('color', '#000')

    const newStore = createStore()

    expect(newStore.get('color')).toBe('#000')
  })

  it('updates multiple fields independently', () => {
    const store = createStore()

    store.set('date', '2026-05-04')
    store.set('color', '#111111')

    expect(store.store).toEqual({
      date: '2026-05-04',
      color: '#111111'
    })
  })

  it('does not lose untouched fields', () => {
    const store = createStore()

    store.set('date', '2026-12-12')

    expect(store.store).toEqual({
      date: '2026-12-12',
      color: '#ffffff'
    })
  })

  it('overwrites value multiple times', () => {
    const store = createStore()

    store.set('color', '#111')
    store.set('color', '#222')
    store.set('color', '#333')

    expect(store.get('color')).toBe('#333')
  })

  it('clears store and restores defaults', () => {
    const store = createStore()

    store.set('color', '#000')
    store.set('date', '2026-10-10')

    store.clear()

    expect(store.get('color')).toBe('#ffffff')
    expect(store.get('date')).toBe('2026-01-01')
  })

  it('restores defaults after clear + reinit', () => {
    const store = createStore()

    store.clear()

    const newStore = createStore()

    expect(newStore.get('color')).toBe('#ffffff')
    expect(newStore.get('date')).toBe('2026-01-01')
  })
})
