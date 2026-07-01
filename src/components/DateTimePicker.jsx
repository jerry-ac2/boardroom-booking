import React, { useEffect, useState } from 'react'
import { add, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import TimePicker from './TimePicker'
import { cn } from '../lib/utils'
import {
  formatLocalDateTimeValue,
  getDateTimeFromLocalValue,
} from '../utils/dateTime'

export default function DateTimePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}) {
  const [date, setDate] = useState(() => getDateTimeFromLocalValue(value))

  useEffect(() => {
    setDate(getDateTimeFromLocalValue(value))
  }, [value])

  function commit(nextDate) {
    setDate(nextDate)
    onChange(formatLocalDateTimeValue(nextDate))
  }

  function handleSelect(newDay) {
    if (!newDay) return

    if (!date) {
      const newDate = new Date(newDay)
      newDate.setHours(0, 0, 0, 0)
      commit(newDate)
      return
    }

    const diff = newDay.getTime() - date.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    commit(add(date, { days: Math.ceil(diffInDays) }))
  }

  function handleTimeChange(nextDate) {
    commit(nextDate)
  }

  return (
    <div className="">
      <label>{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outlineb "
            className={cn('date-time-picker__trigger', !date && 'date-time-picker__trigger--empty')}
          >
            <CalendarIcon className="date-time-picker__icon" aria-hidden="true" />
            {date ? format(date, 'PPP p') : <span>Pick {label.toLowerCase()} date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="date-time-picker__content">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            disabled={[
              minDate ? { before: minDate } : undefined,
              maxDate ? { after: maxDate } : undefined,
            ].filter(Boolean)}
            defaultMonth={date || undefined}
          />
          <div className="date-time-picker__time-panel">
            <TimePicker date={date} setDate={handleTimeChange} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
