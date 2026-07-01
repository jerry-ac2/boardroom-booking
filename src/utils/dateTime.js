const DISPLAY_LOCALE = 'en-US'

function toValidDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatDate(value) {
  const date = toValidDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date)
}

export function formatTime(value) {
  const date = toValidDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatDateTime(value) {
  const date = toValidDate(value)
  if (!date) return ''

  return `${formatDate(date)} ${formatTime(date)}`
}

export function formatDateTimeRange(start, end) {
  return `${formatDateTime(start)} - ${formatDateTime(end)}`
}

export function getDateFromLocalValue(value) {
  if (!value) return null

  const [datePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)

  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

export function getDateTimeFromLocalValue(value) {
  if (!value) return null

  const [datePart, timePart = '00:00'] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.slice(0, 5).split(':').map(Number)

  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null
  }

  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

export function getTimePartFromLocalValue(value) {
  if (!value || !value.includes('T')) return ''
  return value.split('T')[1]?.slice(0, 5) || ''
}

export function formatTimeFromTimeString(time) {
  if (!time) return ''

  const [hour, minute] = time.split(':').map(Number)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return ''

  return formatTime(new Date(2000, 0, 1, hour, minute))
}

export function parse12HourTime(value) {
  const match = value
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?$/i)

  if (!match) return ''

  const hour = Number(match[1])
  const minute = Number(match[2] || '0')
  const period = match[3].toLowerCase()

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return ''

  const hour24 = period === 'p' ? (hour % 12) + 12 : hour % 12
  return `${pad(hour24)}:${pad(minute)}`
}

export function combineDateAndTime(date, time) {
  const validDate = toValidDate(date)
  if (!validDate || !time) return ''

  const datePart = [
    validDate.getFullYear(),
    pad(validDate.getMonth() + 1),
    pad(validDate.getDate()),
  ].join('-')

  return `${datePart}T${time}`
}

export function formatLocalDateTimeValue(value) {
  const date = toValidDate(value)
  if (!date) return ''

  return combineDateAndTime(
    date,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}
