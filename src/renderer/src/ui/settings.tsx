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

      <hr />

      <div>
        <p>Текущая версия: {version}</p>

        <p>Статус: {updateStatus}</p>

        {latestVersion && <p>Последняя версия: {latestVersion}</p>}
      </div>
    </div>
  )
}
