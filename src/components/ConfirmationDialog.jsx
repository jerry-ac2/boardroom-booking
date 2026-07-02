import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './ui/button'

const mount = () => {
  const portalRoot = document.getElementById('modal-root')
  if (portalRoot) return portalRoot
  const root = document.createElement('div')
  root.id = 'modal-root'
  document.body.appendChild(root)
  return root
}

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  children,
}) {
  const dialogRef = useRef(null)
  const firstButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    if (!open) return
    previousActiveElement.current = document.activeElement
    const timer = window.setTimeout(() => {
      firstButtonRef.current?.focus()
    }, 0)

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousActiveElement.current?.focus()
      window.clearTimeout(timer)
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
      <div className="dialog-panel" ref={dialogRef}>
        <div className="dialog-header">
          <h2 id="dialog-title">{title}</h2>
          <button className="dialog-close" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">
          <p id="dialog-description">{description}</p>
          {children}
        </div>
        <div className="dialog-actions">
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button onClick={onConfirm} ref={firstButtonRef}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    mount(),
  )
}
