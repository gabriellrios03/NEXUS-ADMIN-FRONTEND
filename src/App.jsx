import { useEffect, useState } from 'react'

/* ─── Icon components ─── */
function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconEye({ open }) {
  if (!open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

/* ─── Shared UI primitives ─── */
function StatusBadge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-[#dbeafe] text-[#2563eb]',
    success: 'bg-[#dcfce7] text-[#16a34a]',
    error: 'bg-[#fee2e2] text-[#dc2626]',
    neutral: 'bg-[#f1f5f9] text-[#475569]',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${isSuccess ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]' : 'border-[#fecaca] bg-[#fef2f2] text-[#991b1b]'}`}>
      <span className="mt-0.5">{isSuccess ? <IconCheck /> : <IconAlert />}</span>
      <span className="flex-1 leading-relaxed">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 leading-none">×</button>
    </div>
  )
}

function FormInput({ label, id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#0f172a]">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className="w-full rounded-lg border border-[#e2e8f4] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
      />
    </div>
  )
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

/* ─── Sidebar ─── */
function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
    { id: 'usuarios', label: 'Usuarios', Icon: IconUsers },
  ]

  return (
    <aside className="flex h-screen w-60 flex-col bg-[#0f172a]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#1e293b]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-bold text-white">Nexus</span>
          <span className="ml-1 text-sm font-bold text-[#2563eb]">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Menu</p>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-[#60a5fa]' : ''}>
                <Icon />
              </span>
              {label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[#1e293b] pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:bg-[#1e293b] hover:text-white"
        >
          <IconLogout />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}

/* ─── Dashboard Section ─── */
function DashboardSection() {
  const stats = [
    { label: 'Usuarios activos', value: '—', icon: IconUsers, color: 'bg-[#dbeafe] text-[#2563eb]' },
    { label: 'Roles asignados', value: '—', icon: IconShield, color: 'bg-[#e0f2fe] text-[#0284c7]' },
    { label: 'Sesion iniciada', value: 'Admin', icon: IconUser, color: 'bg-[#dcfce7] text-[#16a34a]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2563eb]">Panel de control</p>
        <h1 className="mt-1 text-2xl font-bold text-[#0f172a]">Bienvenido de vuelta</h1>
        <p className="mt-1 text-sm text-[#475569]">Desde aqui puedes gestionar los usuarios y roles del sistema.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-[#e2e8f4] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#475569]">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{value}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#e2e8f4] bg-white p-6">
        <h2 className="text-sm font-semibold text-[#0f172a]">Acceso rapido</h2>
        <p className="mt-1 text-sm text-[#475569]">Navega a la seccion de Usuarios para crear, listar y asignar roles.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#dbeafe] bg-[#f0f7ff] px-4 py-2 text-sm font-medium text-[#2563eb]">
            <IconUsers />
            Gestionar usuarios
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f4] bg-[#f7f9fd] px-4 py-2 text-sm font-medium text-[#475569]">
            <IconShield />
            Asignar roles
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Users Section ─── */
function UsersSection({
  users, usersTotal, usersLoading, usersError,
  newUserNombre, setNewUserNombre,
  newUserEmail, setNewUserEmail,
  newUserPassword, setNewUserPassword,
  createUserLoading, createUserMessage, setCreateUserMessage,
  handleCreateUser,
  availableRoles, availableRolesLoading, availableRolesError,
  assignIdUsuario, setAssignIdUsuario,
  assignIdRol, setAssignIdRol,
  assignIdMaster, setAssignIdMaster,
  assignIdEmpresaVendedora, setAssignIdEmpresaVendedora,
  assignRoleLoading, assignRoleMessage, setAssignRoleMessage,
  handleAssignRole,
  selectedUserId, selectedUserRoles, rolesTotal, rolesLoading, rolesError,
  handleViewRoles,
}) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAssignForm, setShowAssignForm] = useState(false)

  const createMsgType = createUserMessage?.toLowerCase().includes('exit') ? 'success' : 'error'
  const assignMsgType = assignRoleMessage?.toLowerCase().includes('exit') ? 'success' : 'error'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2563eb]">Administracion</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0f172a]">Usuarios</h1>
          {!usersLoading && !usersError && (
            <p className="mt-1 text-sm text-[#475569]">{usersTotal} usuario{usersTotal !== 1 ? 's' : ''} registrado{usersTotal !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setShowCreateForm(f => !f); setShowAssignForm(false) }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${showCreateForm ? 'bg-[#0f172a] text-white' : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'}`}
          >
            <IconUser />
            Nuevo usuario
          </button>
          <button
            type="button"
            onClick={() => { setShowAssignForm(f => !f); setShowCreateForm(false) }}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${showAssignForm ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#e2e8f4] bg-white text-[#0f172a] hover:bg-[#f7f9fd]'}`}
          >
            <IconShield />
            Asignar rol
          </button>
        </div>
      </div>

      {/* Create user form */}
      {showCreateForm && (
        <div className="mb-5 rounded-xl border border-[#e2e8f4] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0f172a]">Crear nuevo usuario</h2>
          <form onSubmit={handleCreateUser}>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormInput
                label="Nombre"
                id="new-nombre"
                type="text"
                value={newUserNombre}
                onChange={(e) => setNewUserNombre(e.target.value)}
                placeholder="Nombre completo"
                required
              />
              <FormInput
                label="Email"
                id="new-email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
              <FormInput
                label="Contrasena"
                id="new-password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={createUserLoading}>
                {createUserLoading ? 'Creando...' : 'Crear usuario'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-[#e2e8f4] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] hover:bg-[#f7f9fd]"
              >
                Cancelar
              </button>
            </div>
            {createUserMessage && (
              <div className="mt-3">
                <Toast message={createUserMessage} type={createMsgType} onClose={() => setCreateUserMessage('')} />
              </div>
            )}
          </form>
        </div>
      )}

      {/* Assign role form */}
      {showAssignForm && (
        <div className="mb-5 rounded-xl border border-[#e2e8f4] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0f172a]">Asignar rol a usuario</h2>
          {availableRolesLoading && (
            <div className="mb-3 flex items-center gap-2 text-sm text-[#475569]">
              <Spinner /> Cargando roles disponibles...
            </div>
          )}
          {availableRolesError && (
            <div className="mb-3">
              <Toast message={availableRolesError} type="error" onClose={() => {}} />
            </div>
          )}
          <form onSubmit={handleAssignRole}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormInput
                label="ID Usuario"
                id="assign-usuario"
                type="number"
                min="1"
                value={assignIdUsuario}
                onChange={(e) => setAssignIdUsuario(e.target.value)}
                placeholder="1"
                required
              />
              <div>
                <label htmlFor="assign-rol" className="mb-1.5 block text-sm font-medium text-[#0f172a]">Rol</label>
                <select
                  id="assign-rol"
                  value={assignIdRol}
                  onChange={(e) => setAssignIdRol(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#e2e8f4] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                >
                  <option value="">Selecciona un rol</option>
                  {availableRoles.map((role, i) => (
                    <option key={role.Id ?? role.id ?? role.IdRol ?? role.idRol ?? i} value={role.Id ?? role.id ?? role.IdRol ?? role.idRol}>
                      {role.NombreRol ?? role.nombreRol ?? role.Nombre ?? role.nombre ?? 'Rol'}
                      {role.CodigoRol ? ` (${role.CodigoRol})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput
                label="ID Master"
                id="assign-master"
                type="number"
                min="1"
                value={assignIdMaster}
                onChange={(e) => setAssignIdMaster(e.target.value)}
                placeholder="1"
                required
              />
              <FormInput
                label="ID Empresa Vendedora"
                id="assign-empresa"
                type="number"
                min="1"
                value={assignIdEmpresaVendedora}
                onChange={(e) => setAssignIdEmpresaVendedora(e.target.value)}
                placeholder="1"
                required
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={assignRoleLoading}>
                {assignRoleLoading ? 'Asignando...' : 'Asignar rol'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setShowAssignForm(false)}
                className="rounded-lg border border-[#e2e8f4] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] hover:bg-[#f7f9fd]"
              >
                Cancelar
              </button>
            </div>
            {assignRoleMessage && (
              <div className="mt-3">
                <Toast message={assignRoleMessage} type={assignMsgType} onClose={() => setAssignRoleMessage('')} />
              </div>
            )}
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="rounded-xl border border-[#e2e8f4] bg-white overflow-hidden">
        {usersLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-[#475569]">
            <Spinner /> Cargando usuarios...
          </div>
        )}
        {usersError && (
          <div className="px-6 py-4">
            <Toast message={usersError} type="error" onClose={() => {}} />
          </div>
        )}
        {!usersLoading && !usersError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f4] bg-[#f7f9fd]">
                  {['ID', 'Nombre', 'Email', 'Activo', 'Fecha Alta', 'Roles'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-sm text-[#94a3b8]">
                      Sin usuarios disponibles.
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => {
                    const uid = user.Id ?? user.id ?? user._id ?? i
                    const isActive = user.Activo ?? user.activo
                    const activeStr = isActive === true || isActive === 1 || isActive === 'true' || isActive === 'Si' ? 'Activo' : isActive === false || isActive === 0 || isActive === 'false' || isActive === 'No' ? 'Inactivo' : String(isActive ?? '—')
                    return (
                      <tr key={uid} className="transition hover:bg-[#f7f9fd]">
                        <td className="px-4 py-3 font-mono text-xs text-[#475569]">{uid}</td>
                        <td className="px-4 py-3 font-medium text-[#0f172a]">{user.Nombre ?? user.nombre ?? user.name ?? '—'}</td>
                        <td className="px-4 py-3 text-[#475569]">{user.Email ?? user.email ?? '—'}</td>
                        <td className="px-4 py-3">
                          <StatusBadge variant={activeStr === 'Activo' ? 'success' : activeStr === 'Inactivo' ? 'error' : 'neutral'}>
                            {activeStr}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-[#475569]">
                          {user.FechaAlta ?? user.fechaAlta ? new Date(user.FechaAlta ?? user.fechaAlta).toLocaleDateString('es-MX') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleViewRoles(uid)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8f4] bg-white px-3 py-1.5 text-xs font-semibold text-[#2563eb] transition hover:border-[#2563eb] hover:bg-[#f0f7ff]"
                          >
                            <IconShield />
                            Ver roles
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User roles panel */}
      {(rolesLoading || rolesError || selectedUserRoles.length > 0) && (
        <div className="mt-5 rounded-xl border border-[#e2e8f4] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f4] bg-[#f7f9fd] px-5 py-3">
            <div className="flex items-center gap-2">
              <IconShield />
              <span className="text-sm font-semibold text-[#0f172a]">Roles del usuario</span>
              {selectedUserId && (
                <StatusBadge variant="default">ID {selectedUserId}</StatusBadge>
              )}
            </div>
            {!rolesLoading && !rolesError && (
              <StatusBadge variant="neutral">{rolesTotal} rol{rolesTotal !== 1 ? 'es' : ''}</StatusBadge>
            )}
          </div>
          {rolesLoading && (
            <div className="flex items-center gap-2 px-5 py-8 text-sm text-[#475569]">
              <Spinner /> Cargando roles...
            </div>
          )}
          {rolesError && (
            <div className="px-5 py-4">
              <Toast message={rolesError} type="error" onClose={() => {}} />
            </div>
          )}
          {!rolesLoading && !rolesError && selectedUserRoles.length === 0 && (
            <p className="px-5 py-6 text-sm text-[#94a3b8]">Sin roles asignados.</p>
          )}
          {!rolesLoading && !rolesError && selectedUserRoles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f4]">
                    {['Usuario', 'Email', 'Codigo Rol', 'Nombre Rol', 'Master', 'Empresa Vendedora'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {selectedUserRoles.map((role, i) => (
                    <tr key={role.Id ?? role.IdRol ?? i} className="hover:bg-[#f7f9fd]">
                      <td className="px-4 py-3 font-medium text-[#0f172a]">{role.NombreUsuario ?? '—'}</td>
                      <td className="px-4 py-3 text-[#475569]">{role.Email ?? '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge variant="default">{role.CodigoRol ?? '—'}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0f172a]">{role.NombreRol ?? '—'}</td>
                      <td className="px-4 py-3 text-[#475569]">{role.NombreMaster ?? 'Sin master'}</td>
                      <td className="px-4 py-3 text-[#475569]">{role.NombreEmpresaVendedora ?? 'Sin empresa'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Login Page ─── */
function LoginPage({ email, setEmail, password, setPassword, showPassword, setShowPassword, isLoading, message, handleSubmit }) {
  return (
    <main className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb] shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#0f172a]">
            <span className="text-[#2563eb]">Nexus</span> Admin
          </h1>
          <p className="mt-1 text-sm text-[#475569]">Inicia sesion para continuar</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e2e8f4] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#0f172a]">
                Contrasena
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-[#e2e8f4] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#94a3b8] transition hover:text-[#475569]"
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#2563eb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Entrando...' : 'Iniciar sesion'}
            </button>
          </form>

          {message && (
            <div className="mt-4">
              <Toast message={message} type="error" onClose={() => {}} />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#94a3b8]">
          Nexus Admin &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}

/* ─── API config ─── */
const API_BASE = 'https://nonmarrying-garish-tenisha.ngrok-free.app'
const API_HEADERS = {
  accept: '*/*',
  'ngrok-skip-browser-warning': '1',
}

/* ─── Root App ─── */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('auth_token')))
  const [activeSection, setActiveSection] = useState('dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [newUserNombre, setNewUserNombre] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [createUserMessage, setCreateUserMessage] = useState('')
  const [assignIdUsuario, setAssignIdUsuario] = useState('')
  const [assignIdRol, setAssignIdRol] = useState('')
  const [assignIdMaster, setAssignIdMaster] = useState('')
  const [assignIdEmpresaVendedora, setAssignIdEmpresaVendedora] = useState('')
  const [availableRoles, setAvailableRoles] = useState([])
  const [availableRolesLoading, setAvailableRolesLoading] = useState(false)
  const [availableRolesError, setAvailableRolesError] = useState('')
  const [assignRoleLoading, setAssignRoleLoading] = useState(false)
  const [assignRoleMessage, setAssignRoleMessage] = useState('')
  const [selectedUserRoles, setSelectedUserRoles] = useState([])
  const [rolesTotal, setRolesTotal] = useState(0)
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || activeSection !== 'usuarios') return
      const token = localStorage.getItem('auth_token')
      if (!token) { setUsersError('No hay token disponible. Inicia sesion de nuevo.'); return }
      setUsersLoading(true); setUsersError('')
      try {
        const res = await fetch(`${API_BASE}/api/users`, { headers: { ...API_HEADERS, Authorization: `Bearer ${token}` } })
        const data = await res.json().catch(() => ([]))
        if (!res.ok) { setUsersError('No se pudieron cargar los usuarios.'); return }
        if (Array.isArray(data)) { setUsers(data); setUsersTotal(data.length); return }
        if (Array.isArray(data?.users)) { setUsers(data.users); setUsersTotal(Number(data?.total) || data.users.length); return }
        setUsers([]); setUsersTotal(0)
      } catch { setUsersError('Error de conexion al cargar usuarios.') }
      finally { setUsersLoading(false) }
    }

    const fetchAvailableRoles = async () => {
      if (!isAuthenticated || activeSection !== 'usuarios') return
      const token = localStorage.getItem('auth_token')
      setAvailableRolesLoading(true); setAvailableRolesError('')
      try {
        const res = await fetch(`${API_BASE}/api/roles`, { headers: { ...API_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
        const data = await res.json().catch(() => ([]))
        if (!res.ok) { setAvailableRolesError('No se pudieron cargar los roles disponibles.'); return }
        if (Array.isArray(data)) { setAvailableRoles(data); return }
        if (Array.isArray(data?.roles)) { setAvailableRoles(data.roles); return }
        setAvailableRoles([])
      } catch { setAvailableRolesError('Error de conexion al cargar roles disponibles.') }
      finally { setAvailableRolesLoading(false) }
    }

    fetchUsers()
    fetchAvailableRoles()
  }, [activeSection, isAuthenticated])

  const handleSubmit = async (event) => {
    event.preventDefault(); setIsLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { ...API_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setMessage(data?.message || 'Credenciales invalidas o error del servidor.'); return }
      const token = data?.access_token || data?.token || ''
      if (token) localStorage.setItem('auth_token', token)
      setActiveSection('dashboard'); setIsAuthenticated(true)
    } catch { setMessage('No se pudo conectar con la API.') }
    finally { setIsLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token'); setIsAuthenticated(false); setActiveSection('dashboard')
    setPassword(''); setShowPassword(false); setMessage(''); setUsers([]); setUsersTotal(0)
    setUsersError(''); setNewUserNombre(''); setNewUserEmail(''); setNewUserPassword('')
    setCreateUserLoading(false); setCreateUserMessage(''); setAssignIdUsuario(''); setAssignIdRol('')
    setAssignIdMaster(''); setAssignIdEmpresaVendedora(''); setAvailableRoles([])
    setAvailableRolesLoading(false); setAvailableRolesError(''); setAssignRoleLoading(false)
    setAssignRoleMessage(''); setSelectedUserRoles([]); setRolesTotal(0); setRolesLoading(false)
    setRolesError(''); setSelectedUserId(null)
  }

  const handleViewRoles = async (userId) => {
    if (!userId) { setRolesError('Usuario sin ID valido.'); return }
    const token = localStorage.getItem('auth_token')
    if (!token) { setRolesError('No hay token disponible. Inicia sesion de nuevo.'); return }
    setSelectedUserId(userId); setRolesLoading(true); setRolesError(''); setSelectedUserRoles([]); setRolesTotal(0)
    try {
      const res = await fetch(`${API_BASE}/api/roles/user/${userId}`, { headers: { ...API_HEADERS, Authorization: `Bearer ${token}` } })
      const data = await res.json().catch(() => ([]))
      if (!res.ok) { setRolesError('No se pudieron cargar los roles del usuario.'); return }
      if (Array.isArray(data)) { setSelectedUserRoles(data); setRolesTotal(data.length); return }
      if (Array.isArray(data?.roles)) { setSelectedUserRoles(data.roles); setRolesTotal(Number(data?.total) || data.roles.length); return }
      if (data && typeof data === 'object') { setSelectedUserRoles([data]); setRolesTotal(1); return }
      setSelectedUserRoles([]); setRolesTotal(0)
    } catch { setRolesError('Error de conexion al cargar roles.') }
    finally { setRolesLoading(false) }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('auth_token')
    if (!token) { setCreateUserMessage('No hay token disponible. Inicia sesion de nuevo.'); return }
    setCreateUserLoading(true); setCreateUserMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, { method: 'POST', headers: { ...API_HEADERS, 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ nombre: newUserNombre, email: newUserEmail, password: newUserPassword }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setCreateUserMessage(data?.message || 'No se pudo crear el usuario.'); return }
      setCreateUserMessage('Usuario creado exitosamente.'); setNewUserNombre(''); setNewUserEmail(''); setNewUserPassword('')
      setUsersLoading(true); setUsersError('')
      try {
        const ur = await fetch(`${API_BASE}/api/users`, { headers: { ...API_HEADERS, Authorization: `Bearer ${token}` } })
        const ud = await ur.json().catch(() => ([]))
        if (!ur.ok) { setUsersError('No se pudieron actualizar los usuarios.'); return }
        if (Array.isArray(ud)) { setUsers(ud); setUsersTotal(ud.length); return }
        if (Array.isArray(ud?.users)) { setUsers(ud.users); setUsersTotal(Number(ud?.total) || ud.users.length); return }
        setUsers([]); setUsersTotal(0)
      } catch { setUsersError('Error de conexion al actualizar usuarios.') }
      finally { setUsersLoading(false) }
    } catch { setCreateUserMessage('Error de conexion al crear el usuario.') }
    finally { setCreateUserLoading(false) }
  }

  const handleAssignRole = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('auth_token')
    if (!token) { setAssignRoleMessage('No hay token disponible. Inicia sesion de nuevo.'); return }
    setAssignRoleLoading(true); setAssignRoleMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/roles/assign`, { method: 'POST', headers: { ...API_HEADERS, 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ idUsuario: Number(assignIdUsuario), idRol: Number(assignIdRol), idMaster: Number(assignIdMaster), idEmpresaVendedora: Number(assignIdEmpresaVendedora) }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setAssignRoleMessage(data?.message || 'No se pudo asignar el rol.'); return }
      setAssignRoleMessage('Rol asignado exitosamente.')
      const uid = Number(assignIdUsuario)
      setSelectedUserId(uid); setAssignIdUsuario(''); setAssignIdRol(''); setAssignIdMaster(''); setAssignIdEmpresaVendedora('')
      if (uid) handleViewRoles(uid)
    } catch { setAssignRoleMessage('Error de conexion al asignar el rol.') }
    finally { setAssignRoleLoading(false) }
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        showPassword={showPassword} setShowPassword={setShowPassword}
        isLoading={isLoading} message={message} handleSubmit={handleSubmit}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4fa]">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        {activeSection === 'dashboard' ? (
          <DashboardSection />
        ) : (
          <UsersSection
            users={users} usersTotal={usersTotal} usersLoading={usersLoading} usersError={usersError}
            newUserNombre={newUserNombre} setNewUserNombre={setNewUserNombre}
            newUserEmail={newUserEmail} setNewUserEmail={setNewUserEmail}
            newUserPassword={newUserPassword} setNewUserPassword={setNewUserPassword}
            createUserLoading={createUserLoading} createUserMessage={createUserMessage} setCreateUserMessage={setCreateUserMessage}
            handleCreateUser={handleCreateUser}
            availableRoles={availableRoles} availableRolesLoading={availableRolesLoading} availableRolesError={availableRolesError}
            assignIdUsuario={assignIdUsuario} setAssignIdUsuario={setAssignIdUsuario}
            assignIdRol={assignIdRol} setAssignIdRol={setAssignIdRol}
            assignIdMaster={assignIdMaster} setAssignIdMaster={setAssignIdMaster}
            assignIdEmpresaVendedora={assignIdEmpresaVendedora} setAssignIdEmpresaVendedora={setAssignIdEmpresaVendedora}
            assignRoleLoading={assignRoleLoading} assignRoleMessage={assignRoleMessage} setAssignRoleMessage={setAssignRoleMessage}
            handleAssignRole={handleAssignRole}
            selectedUserId={selectedUserId} selectedUserRoles={selectedUserRoles} rolesTotal={rolesTotal}
            rolesLoading={rolesLoading} rolesError={rolesError}
            handleViewRoles={handleViewRoles}
          />
        )}
      </main>
    </div>
  )
}

export default App
