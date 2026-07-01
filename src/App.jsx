import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Topbar from './components/Topbar'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <>
      <Topbar />
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute requireAdmin={true}><Admin/></ProtectedRoute>} />
      </Routes>
    </>
  )
}
