import { useEffect, useState } from 'react'
import { UpdateButton } from '@renderer/shared/ui/update-button/update-button'

export default function Settings() {
  const [date, setDate] = useState('')
  const [color, setColor] = useState('')
  const [version, setVersion] = useState('')

  useEffect(() => {
    window.settingsAPI.get().then((data) => {
      setDate(data.date)
      setColor(data.color)
    })

    window.appVersion.getVersion().then(setVersion)
  }, [])

  const save = () => {
    window.settingsAPI.set({ date, color })
  }

  const reset = () => {
    window.settingsAPI.reset()
    window.settingsAPI.get().then((data) => {
      setDate(data.date)
      setColor(data.color)
    })
  }

  return (
    <div className="container">
      <div className="settings-header">
        <h1>Settings</h1>

        <div>
          Текущая версия: {version}
        </div>
      </div>

      <label>Date</label>
      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

      <label>Color</label>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

      <div className="buttons">
        <button className="save" onClick={save}>
          Save
        </button>

        <button className="reset" onClick={reset}>
          Reset
        </button>
      </div>

      <hr />

      <UpdateButton />
    </div>
  )
}
