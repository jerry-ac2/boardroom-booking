import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, requireAdmin=false }){
  const staff = JSON.parse(localStorage.getItem('staff')||'null')
  if(!staff) return <Navigate to="/login" replace />
  if(requireAdmin && !staff.isAdmin) return <Navigate to="/dashboard" replace />
  return children
}
