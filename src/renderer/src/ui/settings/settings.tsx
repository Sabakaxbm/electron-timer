import { useEffect, useState } from 'react'

export default function Settings() {
  const [date, setDate] = useState('')
  const [color, setColor] = useState('')
  const [version, setVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')

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

  useEffect(() => {
    window.settingsAPI.get().then((data) => {
      setDate(data.date)
      setColor(data.color)
    })

    window.appVersion.getVersion().then(setVersion)

    window.appVersion.onUpdateAvailable((data) => {
      setLatestVersion(data.version)
      console.log(1)
      setUpdateStatus('Доступно обновление')
    })

    window.appVersion.onNoUpdate(() => {
      console.log(2)
      setUpdateStatus('Обновлений нет')
    })

    window.appVersion.onUpdateError((msg) => {
      console.log(3)
      setUpdateStatus('Ошибка: ' + msg)
    })
  }, [])

  return (
    <div className="container">
      <h1>Settings</h1>

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

      <div className="version">Текущая версия: {version}</div>

      <div className="status">Статус: {updateStatus}</div>

      {latestVersion && <div className="badge">Последняя версия: {latestVersion}</div>}
    </div>
  )
}
