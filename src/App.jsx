import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedLayout from './components/ProtectedLayout'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import UsersPage from './pages/Users'
import MastersPage from './pages/Masters'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected — wrapped inside sidebar layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/masters" element={<MastersPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
