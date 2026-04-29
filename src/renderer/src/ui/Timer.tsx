import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

const format = (n: number) => n.toString().padStart(2, '0')

function getTimeParts(diff: number) {
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  return { days, hours, minutes, seconds }
}

export default function Timer() {
  const [endDate, setEndDate] = useState<string | null>(null)
  const [time, setTime] = useState({
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    done: false
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const clickCount = useRef(0)
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    window.settingsAPI.get().then((data) => {
      setEndDate(data.date)
    })

    const unsubscribe = window.settingsAPI.onUpdate((data) => {
      setEndDate(data.date)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!endDate) return

    const update = () => {
      const end = dayjs(endDate)
      const diff = end.diff(dayjs(), 'second')

      if (diff <= 0) {
        setTime((prev) => ({ ...prev, done: true }))
        return false
      }

      const { days, hours, minutes, seconds } = getTimeParts(diff)

      setTime({
        days,
        hours: format(hours),
        minutes: format(minutes),
        seconds: format(seconds),
        done: false
      })

      return true
    }

    update()

    intervalRef.current = setInterval(() => {
      const ok = update()
      if (!ok && intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [endDate])


  const handleClick = () => {
    clickCount.current += 1

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }

    clickTimeout.current = setTimeout(() => {
      clickCount.current = 0
    }, 500)

    if (clickCount.current === 3) {
      window.electronAPI.openSettings()
      clickCount.current = 0
    }
  }
  return (
    <div className="timer" onClick={handleClick}>
      {time.done ? (
        <div className="done">🎉 Done</div>
      ) : (
        <>
          <div className="days">
            <span className="value">{time.days}</span>
            <span className="label">days</span>
          </div>

          <div className="clock">
            <span>{time.hours}</span>:<span>{time.minutes}</span>:<span>{time.seconds}</span>
          </div>
        </>
      )}
    </div>
  )
}
