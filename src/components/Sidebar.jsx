import { NavLink, useNavigate } from 'react-router-dom'
import { IconDashboard, IconUsers, IconShield, IconLogout, IconBolt } from './ui'
import { clearToken, clearSession } from '../api'

function IconOfficeNav() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01" />
    </svg>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/usuarios', label: 'Usuarios', Icon: IconUsers },
  { to: '/masters', label: 'Masters', Icon: IconShield },
  { to: '/empresas', label: 'Empresas', Icon: IconOfficeNav },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    clearSession()
    navigate('/login')
  }

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col bg-[#0f172a]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-[#1e293b] px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb]">
          <IconBolt />
        </div>
        <div>
          <span className="text-sm font-bold text-white">Nexus</span>
          <span className="ml-1 text-sm font-bold text-[#2563eb]">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Menu</p>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-[#60a5fa]' : ''}>
                  <Icon />
                </span>
                {label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#1e293b] px-3 pb-4 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:bg-[#1e293b] hover:text-white"
        >
          <IconLogout />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
