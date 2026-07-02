import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../api'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

export default function Signup(){
  const [staff_no, setStaffNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [directorate, setDirectorate] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const doSignup = async () => {
    if(!staff_no || !name || !directorate || !password || !email){ toast.warn('Please fill all fields'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { toast.warn('Please enter a valid email address'); return }
    const r = await post('/auth/register', { staff_no, name, directorate, password, email })
    if(!r.ok) return
    const staff = r.data.staff
    const token = r.data.token
    if (token) localStorage.setItem('token', token)
    if (staff) localStorage.setItem('staff', JSON.stringify(staff))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-4.5/12 flex flex-col gap-3">
        <div className="faan-logo"><img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" /></div>
        <h2>Staff Signup</h2>
        <div className='flex gap-3'>
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <input className="input" placeholder="Directorate" value={directorate} onChange={e=>setDirectorate(e.target.value)} />
        <input className="input" placeholder="Staff ID" value={staff_no} onChange={e=>setStaffNo(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" onClick={doSignup} disabled={loading}>{loading ? <><Spinner size={14} /> <span style={{marginLeft:8}}>Signing up...</span></> : 'Sign Up'}</button>
      </div>
    </div>
  )
}
