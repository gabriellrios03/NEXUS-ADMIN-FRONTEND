import { NavLink, useNavigate } from 'react-router-dom'
import { IconDashboard, IconUsers, IconShield, IconLogout, IconBolt } from './ui'
import { clearToken } from '../api'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/usuarios', label: 'Usuarios', Icon: IconUsers },
  { to: '/masters', label: 'Masters', Icon: IconShield },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
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
