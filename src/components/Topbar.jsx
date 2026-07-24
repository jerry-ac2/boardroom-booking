import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Topbar() {
  const { pathname } = useLocation()
  if (pathname === '/dashboard' || pathname === '/admin') return null
  return <header className="public-header"><div className="public-header__inner"><span>Federal Airports Authority of Nigeria</span><span>MD Office · Boardroom Booking</span></div></header>
}
