import Store from 'electron-store'
export type SettingsStore = {
  date: string
  color: string
}

export const store = new Store<SettingsStore>({
  defaults: {
    date: '2026-05-08T00:00:00',
    color: '#ffffff'
  }
})
