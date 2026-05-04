import { useState, useEffect } from 'react'

export function UpdateButton() {
  const [availableVersion, setAvailableVersion] = useState('')
  const [status, setStatus] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  // check on mount (optional)
  const checkUpdate = async () => {
    setStatus('Проверка...')

    const res = await window.appVersion.checkForUpdates()

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
    })

    return () => {
      unsubProgress?.()
      unsubDownloaded?.()
      unsubAvailable?.()
      unsubError?.()
    }
  }, [])

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={checkUpdate}>Проверить обновления</button>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>{status}</div>

      {availableVersion && !downloading && (
        <button onClick={downloadUpdate} style={{ marginTop: 8 }}>
          Скачать обновление ({availableVersion})
        </button>
      )}

      {downloading && (
        <div style={{ marginTop: 10 }}>
          <div>Скачивание: {progress}%</div>

          <div
            style={{
              height: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#4f7cff',
                transition: 'width 0.2s ease'
              }}
            />
          </div>
        </div>
      )}

      {progress === 100 && (
        <button style={{ marginTop: 10 }} onClick={() => window.appVersion.installUpdate()}>
          Установить и перезапустить
        </button>
      )}
    </div>
  )
}
