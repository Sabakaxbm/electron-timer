import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const end = dayjs('2026-05-08T00:00:00')

const format = (n: number) => n.toString().padStart(2, '0')

function getTimeParts(diff: number) {
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  return { days, hours, minutes, seconds }
}

export default function Timer() {
  const [time, setTime] = useState({
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    done: false
  })

  useEffect(() => {
    const update = () => {
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

    const interval = setInterval(() => {
      const shouldContinue = update()
      if (!shouldContinue) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (time.done) {
    return <div className="done">🎉 Done</div>
  }

  return (
    <div className="timer">
      <div className="days">
        <span className="value">{time.days}</span>
        <span className="label">days</span>
      </div>

      <div className="clock">
        <span>{time.hours}</span>:<span>{time.minutes}</span>:<span>{time.seconds}</span>
      </div>
    </div>
  )
}
