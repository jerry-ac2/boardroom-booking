import React, { useEffect, useState } from 'react'
import { get } from '../api'
import Spinner from './Spinner'
import { formatTimeFromTimeString } from '../utils/dateTime'

function formatSlotTime(isoString) {
  const d = new Date(isoString)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return formatTimeFromTimeString(`${hh}:${mm}`)
}

function statusLabel(slot) {
  if (slot.available) return 'Available'
  if (slot.status === 'approved') return 'Booked'
  if (slot.status === 'pending') return 'Pending'
  return 'Unavailable'
}

function statusClass(slot) {
  if (slot.available) return 'daily-schedule__slot--available'
  if (slot.status === 'approved') return 'daily-schedule__slot--booked'
  if (slot.status === 'pending') return 'daily-schedule__slot--pending'
  return 'daily-schedule__slot--unavailable'
}

export default function DailySchedule({ date }) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchedDate, setFetchedDate] = useState(null)

  useEffect(() => {
    if (!date) {
      setSlots([])
      setFetchedDate(null)
      return
    }

    let cancelled = false

    async function fetchSlots() {
      setLoading(true)
      const res = await get(`/booking/rooms/1/available?date=${date}`, { silent: true })
      if (cancelled) return
      setLoading(false)
      if (res.ok && res.data && res.data.slots) {
        setSlots(res.data.slots)
        setFetchedDate(date)
      } else {
        setSlots([])
        setFetchedDate(date)
      }
    }

    fetchSlots()
    return () => { cancelled = true }
  }, [date])

  // No date selected
  if (!date) {
    return (
      <div className="daily-schedule">
        <h4 className="daily-schedule__title">Daily Availability</h4>
        <p className="daily-schedule__empty">Pick a start date to view available time slots.</p>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="daily-schedule">
        <h4 className="daily-schedule__title">Daily Availability</h4>
        <div className="daily-schedule__loading">
          <Spinner size={18} />
          <span>Loading slots…</span>
        </div>
      </div>
    )
  }

  // Format the display date
  const displayDate = fetchedDate
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(fetchedDate + 'T00:00:00'))
    : ''

  return (
    <div className="daily-schedule">
      <h4 className="daily-schedule__title">Daily Availability</h4>
      {displayDate && <p className="daily-schedule__date">{displayDate}</p>}
      {slots.length === 0 ? (
        <p className="daily-schedule__empty">No slot data available for this date.</p>
      ) : (
        <div className="daily-schedule__grid">
          {slots.map((slot, i) => (
            <div key={i} className={`daily-schedule__slot ${statusClass(slot)}`}>
              <span className="daily-schedule__slot-time">
                {formatSlotTime(slot.start)} – {formatSlotTime(slot.end)}
              </span>
              <span className="daily-schedule__slot-status">
                <span className="daily-schedule__dot" aria-hidden="true" />
                {statusLabel(slot)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
