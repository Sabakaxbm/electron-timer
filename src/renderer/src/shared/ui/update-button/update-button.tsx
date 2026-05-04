import { useState, useEffect } from 'react'
import './index.css'

export function UpdateButton() {
  const [availableVersion, setAvailableVersion] = useState('')
  const [status, setStatus] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [checking, setChecking] = useState(false)

  const checkUpdate = async () => {
    setChecking(true)
    setStatus('Проверка обновлений  ')

    const res = await window.appVersion.checkForUpdates()

    setChecking(false)

    if (res.status === 'available') {
      setAvailableVersion(res.version)
      setStatus('Доступно обновление')
    }

    if (res.status === 'none') {
      setStatus('Обновлений нет')
    }

    if (res.status === 'error') {
      setStatus('Ошибка: ' + res.message)
    }

    if (res.status === 'timeout') {
      setStatus('Таймаут проверки')
    }
  }

  const downloadUpdate = () => {
    setDownloading(true)
    setProgress(0)
    setStatus('Скачивание...')
    window.appVersion.downloadUpdate()
  }

  useEffect(() => {
    const unsubProgress = window.appVersion.onDownloadProgress((percent) => {
      setProgress(Math.round(percent))
    })

    const unsubDownloaded = window.appVersion.onDownloaded((data) => {
      setDownloading(false)
      setProgress(100)
      setStatus(`Скачано: ${data.version}`)
    })

    const unsubAvailable = window.appVersion.onUpdateAvailable((data) => {
      setAvailableVersion(data.version)
    })

    const unsubError = window.appVersion.onUpdateError((msg) => {
      setStatus('Ошибка: ' + msg)
      setDownloading(false)
      setChecking(false)
    })

    return () => {
      unsubProgress?.()
      unsubDownloaded?.()
      unsubAvailable?.()
      unsubError?.()
    }
  }, [])

  return (
    <div className="update">
      <button className="update__check" onClick={checkUpdate} disabled={checking}>
        Проверить обновления
      </button>

      <div className="update__status">
        {status}
        {checking && <span className="loader"> ●</span>}
      </div>

      {availableVersion && !downloading && (
        <button className="update__download" onClick={downloadUpdate}>
          Скачать обновление ({availableVersion})
        </button>
      )}

      {downloading && (
        <div className="update__progress">
          <div className="update__text">Скачивание: {progress}%</div>

          <div className="update__bar">
            <div className="update__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {progress === 100 && (
        <button className="update__install" onClick={() => window.appVersion.installUpdate()}>
          Установить и перезапустить
        </button>
      )}
    </div>
  )
}
