import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronRight, ClipboardCheck, Clock3, Download, LayoutDashboard, LogOut, Plus, ShieldCheck } from 'lucide-react'
import { get, post } from '../api'
import DateTimePicker from '../components/DateTimePicker'
import DailySchedule from '../components/DailySchedule'
import StatusBadge from '../components/StatusBadge'
import ConfirmationDialog from '../components/ConfirmationDialog'
import Spinner from '../components/Spinner'
import { formatDate, formatDateTime, formatTime } from '../utils/dateTime'

function beginningOfToday() {
  const now = new Date()
  now.setHours(9, 0, 0, 0)
  return now.toISOString().slice(0, 16)
}

export default function Dashboard() {
  const staff = useMemo(() => JSON.parse(localStorage.getItem('staff') || 'null'), [])
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [start, setStart] = useState(beginningOfToday)
  const [end, setEnd] = useState('')
  const [purpose, setPurpose] = useState('')
  const [formError, setFormError] = useState('')

  async function loadBookings() {
    setLoadingBookings(true)
    const response = await get('/booking/my', { silent: true })
    if (response.ok) setBookings(response.data?.bookings || response.data || [])
    setLoadingBookings(false)
  }

  useEffect(() => { loadBookings() }, [])

  async function submitBooking(event) {
    event.preventDefault()
    setFormError('')
    if (!start || !end || !purpose.trim()) return setFormError('Add a meeting purpose, start time, and end time to submit this request.')
    if (new Date(end) <= new Date(start)) return setFormError('The meeting end time must be later than the start time.')
    setSubmitting(true)
    const response = await post('/booking/book', { start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), purpose: purpose.trim() })
    setSubmitting(false)
    if (!response.ok) {
      const conflicts = response.data?.conflicts
      return setFormError(conflicts?.length ? `The selected time conflicts with ${conflicts.length} existing request${conflicts.length === 1 ? '' : 's'}. Please choose another meeting window.` : (response.data?.message || 'We could not submit this booking request.'))
    }
    setPurpose('')
    setEnd('')
    loadBookings()
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('staff')
    navigate('/login')
  }

  const pending = bookings.filter((item) => item.status === 'pending').length
  const approved = bookings.filter((item) => item.status === 'approved' || item.status === 'confirmed').length
  const nextBooking = bookings.filter((item) => new Date(item.end_time) >= new Date()).sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0]

  return <div className="app-shell">
    <aside className="app-sidebar" aria-label="Primary navigation">
      <Link to="/dashboard" className="brand-lockup"><img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" /><span><b>Boardroom</b><small>MD Office</small></span></Link>
      <nav className="side-nav"><Link className="side-nav__item side-nav__item--active" to="/dashboard"><LayoutDashboard /> Overview</Link><a className="side-nav__item" href="#new-request"><Plus /> New request</a><a className="side-nav__item" href="#my-bookings"><CalendarDays /> My bookings</a>{staff?.isAdmin && <Link className="side-nav__item" to="/admin"><ShieldCheck /> Approval centre</Link>}</nav>
      <div className="sidebar-foot"><div className="profile-initial">{(staff?.name || 'S').slice(0, 1)}</div><div><strong>{staff?.name || 'FAAN Staff'}</strong><span>{staff?.directorate || 'Staff account'}</span></div></div>
    </aside>
    <main className="app-main">
      <header className="workspace-header"><div><p className="eyebrow">Managing Director’s Office</p><h1>Boardroom operations</h1></div><div className="header-actions">{staff?.isAdmin && <Link to="/admin" className="quiet-link">Review requests <ChevronRight /></Link>}<button className="icon-button" onClick={() => setLogoutOpen(true)} aria-label="Log out"><LogOut /></button></div></header>
      <section className="welcome-strip"><div><span className="welcome-strip__mark"><ClipboardCheck /></span><div><p>Good day, {staff?.name?.split(' ')[0] || 'colleague'}.</p><span>Plan, request, and track official boardroom engagements from one place.</span></div></div><span className="room-label"><span /> MD Boardroom · Room 01</span></section>
      <section className="metric-grid" aria-label="Booking summary"><article><span>Upcoming meetings</span><strong>{approved}</strong><small>Approved or confirmed</small></article><article><span>Requests awaiting decision</span><strong>{pending}</strong><small>We’ll notify you when reviewed</small></article><article className="metric-grid__next"><span>Next scheduled meeting</span><strong>{nextBooking ? formatDate(nextBooking.start_time) : 'No meeting scheduled'}</strong><small>{nextBooking ? `${formatTime(nextBooking.start_time)} · ${nextBooking.purpose}` : 'Submit a request to reserve the boardroom'}</small></article></section>
      <div className="dashboard-layout">
        <section id="new-request" className="surface booking-surface"><div className="section-heading"><div><p className="eyebrow">New booking request</p><h2>Reserve the MD Boardroom</h2></div><span className="section-step">01 / 01</span></div><p className="section-intro">Requests are reviewed by the MD Office team. Check availability before selecting your meeting window.</p><form onSubmit={submitBooking}><div className="form-grid"><DateTimePicker label="Meeting starts" value={start} onChange={setStart} /><DateTimePicker label="Meeting ends" value={end} onChange={setEnd} minDate={start ? new Date(start) : undefined} /></div><label className="field-label" htmlFor="meeting-purpose">Meeting purpose</label><textarea id="meeting-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Aviation safety directorate briefing…" rows="4" /><div className="request-footer"><span className="availability-note"><Clock3 /> Standard meeting slot: 30 minutes minimum</span><button className="primary-button" disabled={submitting}>{submitting ? <><Spinner size={15} /> Submitting…</> : <>Submit request <ChevronRight /></>}</button></div>{formError && <p className="form-error" role="alert">{formError}</p>}</form></section>
        <aside className="availability-panel"><DailySchedule date={start ? start.split('T')[0] : null} /><div className="availability-legend"><span><i className="legend-open" /> Available</span><span><i className="legend-pending" /> Pending</span><span><i className="legend-booked" /> Reserved</span></div></aside>
      </div>
      <section id="my-bookings" className="surface bookings-surface"><div className="section-heading"><div><p className="eyebrow">Your activity</p><h2>My booking requests</h2></div><span className="records-count">{bookings.length} record{bookings.length === 1 ? '' : 's'}</span></div>{loadingBookings ? <div className="booking-loading"><Spinner /> Loading requests…</div> : bookings.length === 0 ? <div className="empty-state"><CalendarDays /><h3>No requests yet</h3><p>Your boardroom requests will appear here with their approval status.</p><a href="#new-request">Create a booking request <ChevronRight /></a></div> : <div className="booking-list">{bookings.map((booking) => <article className="booking-row" key={booking.id}><div className="booking-date"><strong>{new Date(booking.start_time).getDate()}</strong><span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(booking.start_time))}</span></div><div className="booking-detail"><strong>{booking.purpose}</strong><span>{formatDateTime(booking.start_time)} – {formatTime(booking.end_time)}</span></div><StatusBadge status={booking.status} />{booking.status === 'approved' && <a className="calendar-link" href={`${import.meta.env.VITE_API_URL || 'https://boardroom-backend-m7cz.onrender.com'}/booking/booking/${booking.id}/ics`}><Download /> Calendar</a>}</article>)}</div>}</section>
    </main>
    <ConfirmationDialog open={logoutOpen} title="Log out of Boardroom" description="You will need to sign in again to access booking information." confirmLabel="Log out" cancelLabel="Stay signed in" onConfirm={logout} onCancel={() => setLogoutOpen(false)} />
  </div>
}
