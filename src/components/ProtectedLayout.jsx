import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../api'
import Sidebar from './Sidebar'

export default function ProtectedLayout() {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4fa]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
