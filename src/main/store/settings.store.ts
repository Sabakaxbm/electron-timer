import Store from 'electron-store'

export const store = new Store({
  defaults: {
    date: '2026-05-08T00:00:00',
    color: '#ffffff'
  }
})
