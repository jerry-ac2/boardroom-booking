import React from 'react'
import { cn } from '../../lib/utils'

const VARIANT_CLASSES = {
  default: 'ui-button--default',
  outline: 'ui-button--outline',
}

const Button = React.forwardRef(function Button(
  { className, variant = 'default', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('ui-button', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  )
})

export { Button }
