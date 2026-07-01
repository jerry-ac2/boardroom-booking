import React from 'react'

export default function Spinner({ size = 16 }){
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 50 50" className="inline-block align-middle">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#fff" strokeOpacity="0.2" />
      <path d="M45 25a20 20 0 0 1-20 20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}
