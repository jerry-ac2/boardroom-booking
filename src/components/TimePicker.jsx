import React from 'react'
import { formatTimeFromTimeString } from '../utils/dateTime'

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']
const PERIODS = ['AM', 'PM']

function dateToParts(date) {
  if (!date) {
    return {
      hour: '',
      minute: '00',
      period: 'AM',
    }
  }

  const hour24 = date.getHours()
  const hour12 = hour24 % 12 || 12

  return {
    hour: String(hour12).padStart(2, '0'),
    minute: String(date.getMinutes()).padStart(2, '0'),
    period: hour24 >= 12 ? 'PM' : 'AM',
  }
}

function partsToDate(currentDate, hour, minute, period) {
  if (!currentDate || !hour || !minute || !period) return undefined

  let nextHour = Number(hour) % 12
  if (period === 'PM') nextHour += 12

  const nextDate = new Date(currentDate)
  nextDate.setHours(nextHour, Number(minute), 0, 0)
  return nextDate
}

export default function TimePicker({ date, setDate }) {
  const { hour, minute, period } = dateToParts(date)

  function handlePartChange(nextParts) {
    const nextDate = partsToDate(
      date || new Date(),
      nextParts.hour ?? hour,
      nextParts.minute ?? minute,
      nextParts.period ?? period
    )

    if (nextDate) setDate(nextDate)
  }

  return (
    <div className="time-picker">
      <select
        className="input time-picker__select"
        aria-label="Hour"
        value={hour}
        onChange={(event) => handlePartChange({ hour: event.target.value })}
      >
        <option value="">Hour</option>
        {HOURS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        className="input time-picker__select"
        aria-label="Minute"
        value={minute}
        onChange={(event) => handlePartChange({ minute: event.target.value })}
      >
        {MINUTES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        className="input time-picker__select"
        aria-label="AM or PM"
        value={period}
        onChange={(event) => handlePartChange({ period: event.target.value })}
      >
        {PERIODS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="time-picker__preview">
        {date ? formatTimeFromTimeString(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`) : 'Select time'}
      </span>
    </div>
  )
}
