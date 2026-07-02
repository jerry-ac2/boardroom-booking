import React from 'react'
import { cn } from '../lib/utils'

export default function Skeleton({ className, style }) {
  return <div className={cn('skeleton', className)} style={style} aria-hidden="true" />
}
