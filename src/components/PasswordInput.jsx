import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../lib/utils'

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  name,
  autoComplete = 'current-password',
  error,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const type = showPassword ? 'text' : 'password'

  return (
    <div className={cn('input-group', error && 'input-group--error')}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="password-input-wrapper">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
