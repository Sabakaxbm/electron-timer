import { useEffect, useState } from 'react'

export default function Settings() {
  const [date, setDate] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    window.settingsAPI.get().then((data) => {
      setDate(data.date)
      setColor(data.color)
    })
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
    <div>
      <h1>Settings</h1>

      <div>
        <label>Date</label>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <label>Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>

      <button onClick={save}>Save</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
