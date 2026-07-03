import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { post } from '../api'
import PasswordInput from '../components/PasswordInput'
import LoadingButton from '../components/LoadingButton'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup(){
  const [staff_no, setStaffNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [directorate, setDirectorate] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function validate(values) {
    const nextErrors = {}
    if (!values.name) nextErrors.name = 'Enter your full name.'
    if (!values.email) nextErrors.email = 'Enter your email address.'
    else if (!emailRegex.test(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (!values.directorate) nextErrors.directorate = 'Enter your directorate.'
    if (!values.staff_no) nextErrors.staff_no = 'Enter your staff ID.'
    if (!values.password) nextErrors.password = 'Create a password.'
    else if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate({ name, email, directorate, staff_no, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    const r = await post('/auth/register', { staff_no, name, directorate, password, email })
    setLoading(false)
    if (!r.ok) {
      setErrors({ form: r.data?.message || 'Signup failed. Please try again.' })
      return
    }
    const staff = r.data.staff
    const token = r.data.token
    if (token) localStorage.setItem('token', token)
    if (staff) localStorage.setItem('staff', JSON.stringify(staff))
    navigate('/dashboard')
  }

  function handleFieldChange(field, value) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'directorate') setDirectorate(value)
    if (field === 'staff_no') setStaffNo(value)
    if (field === 'password') setPassword(value)
  }

  const isFormValid =
    name.trim().length > 0 &&
    emailRegex.test(email) &&
    directorate.trim().length > 0 &&
    staff_no.trim().length > 0 &&
    password.length >= 8

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-lg px-4 flex flex-col gap-3">
        <div className="faan-logo"><img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" /></div>
        <h2>Staff Signup</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className='flex flex-col gap-3'>
            <div className="input-group">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                className="input"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, ...validate({ name, email, directorate, staff_no, password }) }))}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'signup-name-error' : undefined}
              />
              {errors.name && <p id="signup-name-error" className="field-error" role="alert">{errors.name}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, ...validate({ name, email, directorate, staff_no, password }) }))}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'signup-email-error' : undefined}
              />
              {errors.email && <p id="signup-email-error" className="field-error" role="alert">{errors.email}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="signup-directorate">Directorate</label>
              <input
                id="signup-directorate"
                className="input"
                type="text"
                placeholder="Directorate"
                value={directorate}
                onChange={(e) => handleFieldChange('directorate', e.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, ...validate({ name, email, directorate, staff_no, password }) }))}
                autoComplete="organization"
                aria-invalid={Boolean(errors.directorate)}
                aria-describedby={errors.directorate ? 'signup-directorate-error' : undefined}
              />
              {errors.directorate && <p id="signup-directorate-error" className="field-error" role="alert">{errors.directorate}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="signup-staffno">Staff ID</label>
              <input
                id="signup-staffno"
                className="input"
                type="text"
                placeholder="Staff ID"
                value={staff_no}
                onChange={(e) => handleFieldChange('staff_no', e.target.value)}
                onBlur={() => setErrors((current) => ({ ...current, ...validate({ name, email, directorate, staff_no, password }) }))}
                autoComplete="organization-title"
                aria-invalid={Boolean(errors.staff_no)}
                aria-describedby={errors.staff_no ? 'signup-staffno-error' : undefined}
              />
              {errors.staff_no && <p id="signup-staffno-error" className="field-error" role="alert">{errors.staff_no}</p>}
            </div>
            <PasswordInput
              id="signup-password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              onBlur={() => setErrors((current) => ({ ...current, ...validate({ name, email, directorate, staff_no, password }) }))}
              placeholder="Password"
              error={errors.password}
              autoComplete="new-password"
            />
            {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
            <LoadingButton type="submit" isLoading={loading} disabled={!isFormValid} className="w-full">
              Sign Up
            </LoadingButton>
          </div>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/login" className="underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  )
}
