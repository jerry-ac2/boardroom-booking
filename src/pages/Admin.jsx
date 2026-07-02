import React, { useEffect, useState } from 'react'
import { get, post } from '../api'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { formatDateTime, formatDateTimeRange } from '../utils/dateTime'

export default function Admin(){
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{ loadAll() }, [])

  async function loadAll(){
    const r = await get('/admin/bookings')
    if(!r.ok){
      if(r.status===401){ toast.error('Session expired'); localStorage.removeItem('token'); localStorage.removeItem('staff'); navigate('/login') }
      return
    }
    setBookings(r.data || [])
  }

  async function approve(id){ const r = await post('/admin/bookings/approve', { id }); if(r.ok) loadAll() }
  async function reject(id){ const r = await post('/admin/bookings/reject', { id }); if(r.ok) loadAll() }
  async function batchApprove(){ const ids = getSelectedIds(); if(!ids.length) return toast.warn('Select at least one booking'); const r = await post('/admin/bookings/batch/approve', { ids }); if(r.ok) loadAll() }
  async function batchReject(){ const ids = getSelectedIds(); if(!ids.length) return toast.warn('Select at least one booking'); const reason = prompt('Optional reason'); const r = await post('/admin/bookings/batch/reject', { ids, reason }); if(r.ok) loadAll() }

  function getSelectedIds(){
    return Array.from(document.querySelectorAll('#all-bookings tbody input[type=checkbox]:checked')).map(i=>parseInt(i.value,10))
  }

  async function removeBooking(id){
    if(!confirm('Cancel this booking?')) return
    const r = await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:3000'}/admin/bookings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
    const data = await r.json().catch(()=>({}))
    if(!r.ok){ toast.error(data.message || 'Failed'); return }
    toast.success('Booking cancelled')
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
      <div style={{display:'flex',alignItems:'center',gap:12}} className='justify-between'>
        <h2>Admin Dashboard</h2>
        <button className="btn w-4/12" onClick={()=>navigate('/dashboard')}>Back to Dashboard</button>
      </div>
      <div className="table-responsive">
        <table id="all-bookings" className="w-full border-collapse">
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
              <tr><td colSpan={8} className="text-center">No bookings yet</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td><input type="checkbox" value={b.id} /></td>
                <td>{b.name}</td>
                <td>{b.directorate}</td>
                <td>{formatDateTime(b.start_time)}</td>
                <td>{formatDateTime(b.end_time)}</td>
                <td>{b.purpose}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className='flex flex-col gap-3 items-center justify-center'>
                  {b.status==='pending' && (
                    <>
                      <button className="approve-btn" onClick={()=>approve(b.id)}>Approve</button>
                      <button className="reject-btn" onClick={()=>reject(b.id)}>Reject</button>
                    </>
                  )}
                  <button className="reject-btn bg-white text-black border-2 border-black" onClick={()=>removeBooking(b.id)}>Cancel</button>
                  {/* <a href={`http://localhost:3000/booking/booking/${b.id}/ics`} style={{marginLeft:8}}>ICS</a> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button className="export-btn" onClick={exportAllExcel}>Export All Bookings (Excel)</button>
        <button className="export-btn" onClick={exportAllPDF}>Export PDF</button>
      </div>
    </div>
  )
}
