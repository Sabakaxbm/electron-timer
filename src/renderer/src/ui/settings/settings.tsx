import { useEffect, useState } from 'react'
import { UpdateButton } from '@renderer/shared/ui/update-button/update-button'

export default function Settings() {
  const [date, setDate] = useState('')
  const [color, setColor] = useState('')
  const [version, setVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [checkingUpdate, setCheckingUpdate] = useState(false)

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
    window.appVersion.getVersion().then(setVersion)

    const runCheck = async () => {
      setCheckingUpdate(true)

      const res = await window.appVersion.checkForUpdates()

      setCheckingUpdate(false)

      if (res.status === 'available') {
        setLatestVersion(res.version)
        setUpdateStatus('Доступно обновление')
      }

      if (res.status === 'none') {
        setUpdateStatus('Обновлений нет')
      }

      if (res.status === 'error') {
        setUpdateStatus('Ошибка: ' + res.message)
      }

      if (res.status === 'timeout') {
        setUpdateStatus('Проверка заняла слишком много времени')
      }
    }

    runCheck()

    const unsub1 = window.appVersion.onUpdateAvailable((data) => {
      setLatestVersion(data.version)
      setUpdateStatus('Доступно обновление')
      setCheckingUpdate(false)
    })

    const unsub2 = window.appVersion.onNoUpdate(() => {
      setUpdateStatus('Обновлений нет')
      setCheckingUpdate(false)
    })

    const unsub3 = window.appVersion.onUpdateError((msg) => {
      setUpdateStatus('Ошибка: ' + msg)
      setCheckingUpdate(false)
    })

    return () => {
      unsub1?.()
      unsub2?.()
      unsub3?.()
    }
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

      <div className="status">
        Статус: {updateStatus}
        {checkingUpdate && <span className="loader"> Проверка...</span>}
      </div>

      {latestVersion && (
        <div className="badge">
          Последняя версия: {latestVersion}
          {checkingUpdate && <span className="loader"> Проверка...</span>}
        </div>
      )}

      <UpdateButton />
    </div>
  )
}
