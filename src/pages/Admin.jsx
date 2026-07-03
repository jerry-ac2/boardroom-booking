import React, { useEffect, useState } from 'react'
import { get, post } from '../api'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import ConfirmationDialog from '../components/ConfirmationDialog'
import Skeleton from '../components/Skeleton'
import { FaCheck, FaTimes, FaTrash, FaFileExcel, FaFilePdf } from 'react-icons/fa'
import { formatDateTime, formatDateTimeRange } from '../utils/dateTime'

export default function Admin(){
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingCancelId, setPendingCancelId] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{ loadAll() }, [])

  async function loadAll(){
    setLoading(true)
    const r = await get('/admin/bookings')
    setLoading(false)
    if(!r.ok){
      if(r.status===401){ toast.error('Session expired'); localStorage.removeItem('token'); localStorage.removeItem('staff'); navigate('/login') }
      return
    }
    setBookings(r.data || [])
  }

  async function approve(id){
    setBusyId(id)
    const r = await post('/admin/bookings/approve', { id })
    setBusyId(null)
    if(r.ok) loadAll()
  }

  async function reject(id){
    setBusyId(id)
    const r = await post('/admin/bookings/reject', { id })
    setBusyId(null)
    if(r.ok) loadAll()
  }

  async function batchApprove(){
    const ids = getSelectedIds()
    if(!ids.length) return toast.warn('Select at least one booking')
    const r = await post('/admin/bookings/batch/approve', { ids })
    if(r.ok) loadAll()
  }

  function getSelectedIds(){
    return Array.from(document.querySelectorAll('#all-bookings tbody input[type=checkbox]:checked')).map(i=>parseInt(i.value,10))
  }

  function handleCancel(id){
    setPendingCancelId(id)
    setConfirmOpen(true)
  }

  async function confirmCancel(){
    if (!pendingCancelId) return
    setBusyId(pendingCancelId)
    setConfirmOpen(false)
    const r = await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:3000'}/admin/bookings/${pendingCancelId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
    setBusyId(null)
    const data = await r.json().catch(()=>({}))
    if(!r.ok){ toast.error(data.message || 'Failed'); return }
    toast.success('Booking cancelled')
    setPendingCancelId(null)
    loadAll()
  }

  function exportAllExcel(){
    const table = document.getElementById('all-bookings')
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Bookings' })
    XLSX.writeFile(wb, 'Boardroom_Bookings.xlsx')
  }

  function exportAllPDF(){
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(12)
    let y = 20
    bookings.forEach(b=>{
      doc.text(`${b.name||''} ${b.department||''} ${formatDateTimeRange(b.start_time, b.end_time)} ${b.purpose||''}`, 14, y)
      y += 8
      if(y>260){ doc.addPage(); y=20 }
    })
    doc.save('Boardroom_Bookings.pdf')
  }

  return (
    <div className="admin-container p-6">
      <div className="faan-logo"><img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" /></div>
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn admin-back-button" onClick={()=>navigate('/dashboard')}>Back to Dashboard</button>
      </div>
      <div className="table-responsive">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <table id="all-bookings" className="w-full border-collapse admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Staff Name</th>
                <th>Department</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length===0 ? (
                <tr><td colSpan={8} className="text-center">No bookings yet. Use the dashboard to add new bookings.</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id}>
                  <td data-label="Select"><input type="checkbox" value={b.id} /></td>
                  <td data-label="Staff Name">{b.name}</td>
                  <td data-label="Department">{b.directorate}</td>
                  <td data-label="Start">{formatDateTime(b.start_time)}</td>
                  <td data-label="End">{formatDateTime(b.end_time)}</td>
                  <td data-label="Purpose">{b.purpose}</td>
                  <td data-label="Status"><StatusBadge status={b.status} /></td>
                  <td data-label="Action" className='actions'>
                    {b.status==='pending' && (
                      <>
                        <button className="approve-btn" onClick={()=>approve(b.id)} disabled={busyId === b.id}>
                          <span className="icon-left"><FaCheck /></span> {busyId === b.id ? 'Working…' : 'Approve'}
                        </button>
                        <button className="reject-btn" onClick={()=>reject(b.id)} disabled={busyId === b.id}>
                          <span className="icon-left"><FaTimes /></span> {busyId === b.id ? 'Working…' : 'Reject'}
                        </button>
                      </>
                    )}
                    <button
                      className="reject-btn bg-white text-black border-2 border-black"
                      onClick={() => handleCancel(b.id)}
                      disabled={busyId === b.id}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="admin-actions btn-group">
        <button className="export-btn" onClick={exportAllExcel}><span className="icon-left"><FaFileExcel /></span>Export All Bookings (Excel)</button>
        <button className="export-btn" onClick={exportAllPDF}><span className="icon-left"><FaFilePdf /></span>Export PDF</button>
      </div>
      <ConfirmationDialog
        open={confirmOpen}
        title="Cancel booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, cancel booking"
        cancelLabel="No, keep booking"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
