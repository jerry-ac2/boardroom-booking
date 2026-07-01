import React from 'react'

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  canceled: 'bg-red-100 text-red-800 border-red-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
}

function formatStatus(status) {
  if (!status) return 'Unknown'
  return status
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  const style = STATUS_STYLES[key] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {formatStatus(status)}
    </span>
  )
}
