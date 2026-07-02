import React from 'react'
import Spinner from './Spinner'
import { cn } from '../lib/utils'

export default function LoadingButton({
  children,
  isLoading,
  disabled,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn('btn loading-button', className, isLoading && 'loading')}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={14} /> <span className="loading-button__label">Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
