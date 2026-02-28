import { useState, useEffect } from 'react'
import { API_BASE, API_HEADERS, getToken } from '../api'
import {
  SectionHeader, Card, Toast, FormInput, PrimaryButton, SecondaryButton,
  Spinner, StatusBadge, IconUser, IconShield,
} from '../components/ui'

function authH() {
  const token = getToken()
  return { ...API_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')

  const [availableRoles, setAvailableRoles] = useState([])
  const [availableRolesLoading, setAvailableRolesLoading] = useState(false)
  const [availableRolesError, setAvailableRolesError] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserNombre, setNewUserNombre] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [createUserMessage, setCreateUserMessage] = useState('')

  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignIdUsuario, setAssignIdUsuario] = useState('')
  const [assignIdRol, setAssignIdRol] = useState('')
  const [assignIdMaster, setAssignIdMaster] = useState('')
  const [assignIdEmpresaVendedora, setAssignIdEmpresaVendedora] = useState('')
  const [assignRoleLoading, setAssignRoleLoading] = useState(false)
  const [assignRoleMessage, setAssignRoleMessage] = useState('')

  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedUserRoles, setSelectedUserRoles] = useState([])
  const [rolesTotal, setRolesTotal] = useState(0)
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState('')

  async function fetchUsers() {
    setUsersLoading(true)
    setUsersError('')
    try {
      const res = await fetch(`${API_BASE}/api/users`, { headers: authH() })
      const data = await res.json().catch(() => [])
      if (!res.ok) { setUsersError('No se pudieron cargar los usuarios.'); return }
      if (Array.isArray(data)) { setUsers(data); setUsersTotal(data.length); return }
      if (Array.isArray(data?.users)) { setUsers(data.users); setUsersTotal(Number(data?.total) || data.users.length); return }
      setUsers([]); setUsersTotal(0)
    } catch { setUsersError('Error de conexion al cargar usuarios.') }
    finally { setUsersLoading(false) }
  }

  async function fetchAvailableRoles() {
    setAvailableRolesLoading(true)
    setAvailableRolesError('')
    try {
      const res = await fetch(`${API_BASE}/api/roles`, { headers: authH() })
      const data = await res.json().catch(() => [])
      if (!res.ok) { setAvailableRolesError('No se pudieron cargar los roles.'); return }
      if (Array.isArray(data)) { setAvailableRoles(data); return }
      if (Array.isArray(data?.roles)) { setAvailableRoles(data.roles); return }
      setAvailableRoles([])
    } catch { setAvailableRolesError('Error de conexion al cargar roles.') }
    finally { setAvailableRolesLoading(false) }
  }

  useEffect(() => {
    fetchUsers()
    fetchAvailableRoles()
  }, [])

  async function handleCreateUser(event) {
    event.preventDefault()
    setCreateUserLoading(true)
    setCreateUserMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newUserNombre, email: newUserEmail, password: newUserPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setCreateUserMessage(data?.message || 'No se pudo crear el usuario.'); return }
      setCreateUserMessage('Usuario creado exitosamente.')
      setNewUserNombre(''); setNewUserEmail(''); setNewUserPassword('')
      fetchUsers()
    } catch { setCreateUserMessage('Error de conexion al crear el usuario.') }
    finally { setCreateUserLoading(false) }
  }

  async function handleAssignRole(event) {
    event.preventDefault()
    setAssignRoleLoading(true)
    setAssignRoleMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/roles/assign`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: Number(assignIdUsuario),
          idRol: Number(assignIdRol),
          idMaster: Number(assignIdMaster),
          idEmpresaVendedora: Number(assignIdEmpresaVendedora),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setAssignRoleMessage(data?.message || 'No se pudo asignar el rol.'); return }
      setAssignRoleMessage('Rol asignado exitosamente.')
      const uid = Number(assignIdUsuario)
      setAssignIdUsuario(''); setAssignIdRol(''); setAssignIdMaster(''); setAssignIdEmpresaVendedora('')
      if (uid) handleViewRoles(uid)
    } catch { setAssignRoleMessage('Error de conexion al asignar el rol.') }
    finally { setAssignRoleLoading(false) }
  }

  async function handleViewRoles(userId) {
    if (!userId) { setRolesError('Usuario sin ID valido.'); return }
    setSelectedUserId(userId)
    setRolesLoading(true)
    setRolesError('')
    setSelectedUserRoles([])
    setRolesTotal(0)
    try {
      const res = await fetch(`${API_BASE}/api/roles/user/${userId}`, { headers: authH() })
      const data = await res.json().catch(() => [])
      if (!res.ok) { setRolesError('No se pudieron cargar los roles del usuario.'); return }
      if (Array.isArray(data)) { setSelectedUserRoles(data); setRolesTotal(data.length); return }
      if (Array.isArray(data?.roles)) { setSelectedUserRoles(data.roles); setRolesTotal(Number(data?.total) || data.roles.length); return }
      if (data && typeof data === 'object') { setSelectedUserRoles([data]); setRolesTotal(1); return }
      setSelectedUserRoles([]); setRolesTotal(0)
    } catch { setRolesError('Error de conexion al cargar roles.') }
    finally { setRolesLoading(false) }
  }

  const createMsgType = createUserMessage?.toLowerCase().includes('exit') ? 'success' : 'error'
  const assignMsgType = assignRoleMessage?.toLowerCase().includes('exit') ? 'success' : 'error'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          label="Administracion"
          title="Usuarios"
          subtitle={!usersLoading && !usersError ? `${usersTotal} usuario${usersTotal !== 1 ? 's' : ''} registrado${usersTotal !== 1 ? 's' : ''}` : undefined}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setShowCreateForm((f) => !f); setShowAssignForm(false) }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${showCreateForm ? 'bg-[#0f172a] text-white' : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'}`}
          >
            <IconUser />
            Nuevo usuario
          </button>
          <button
            type="button"
            onClick={() => { setShowAssignForm((f) => !f); setShowCreateForm(false) }}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${showAssignForm ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#e2e8f4] bg-white text-[#0f172a] hover:bg-[#f7f9fd]'}`}
          >
            <IconShield />
            Asignar rol
          </button>
        </div>
      </div>

      {/* Create user form */}
      {showCreateForm && (
        <Card className="mb-5 p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0f172a]">Crear nuevo usuario</h2>
          <form onSubmit={handleCreateUser}>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormInput label="Nombre" id="new-nombre" type="text" value={newUserNombre} onChange={(e) => setNewUserNombre(e.target.value)} placeholder="Nombre completo" required />
              <FormInput label="Email" id="new-email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
              <FormInput label="Contrasena" id="new-password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={createUserLoading}>
                {createUserLoading ? 'Creando...' : 'Crear usuario'}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowCreateForm(false)}>Cancelar</SecondaryButton>
            </div>
            {createUserMessage && (
              <div className="mt-3">
                <Toast message={createUserMessage} type={createMsgType} onClose={() => setCreateUserMessage('')} />
              </div>
            )}
          </form>
        </Card>
      )}

      {/* Assign role form */}
      {showAssignForm && (
        <Card className="mb-5 p-6">
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
              <div>
                <label htmlFor="assign-usuario" className="mb-1.5 block text-sm font-medium text-[#0f172a]">Usuario</label>
                <select
                  id="assign-usuario"
                  value={assignIdUsuario}
                  onChange={(e) => setAssignIdUsuario(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#e2e8f4] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user, i) => {
                    const uid = user.Id ?? user.id ?? user._id ?? i
                    return (
                      <option key={uid} value={uid}>
                        {user.Nombre ?? user.nombre ?? user.name ?? 'Usuario'} — {user.Email ?? user.email ?? ''}
                      </option>
                    )
                  })}
                </select>
              </div>
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
              <FormInput label="ID Master" id="assign-master" type="number" min="1" value={assignIdMaster} onChange={(e) => setAssignIdMaster(e.target.value)} placeholder="1" required />
              <FormInput label="ID Empresa Vendedora" id="assign-empresa" type="number" min="1" value={assignIdEmpresaVendedora} onChange={(e) => setAssignIdEmpresaVendedora(e.target.value)} placeholder="1" required />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={assignRoleLoading}>
                {assignRoleLoading ? 'Asignando...' : 'Asignar rol'}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowAssignForm(false)}>Cancelar</SecondaryButton>
            </div>
            {assignRoleMessage && (
              <div className="mt-3">
                <Toast message={assignRoleMessage} type={assignMsgType} onClose={() => setAssignRoleMessage('')} />
              </div>
            )}
          </form>
        </Card>
      )}

      {/* Users table */}
      <Card className="overflow-hidden">
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
                    <td colSpan="6" className="px-4 py-12 text-center text-sm text-[#94a3b8]">Sin usuarios disponibles.</td>
                  </tr>
                ) : (
                  users.map((user, i) => {
                    const uid = user.Id ?? user.id ?? user._id ?? i
                    const isActive = user.Activo ?? user.activo
                    const activeStr =
                      isActive === true || isActive === 1 || isActive === 'true' || isActive === 'Si'
                        ? 'Activo'
                        : isActive === false || isActive === 0 || isActive === 'false' || isActive === 'No'
                        ? 'Inactivo'
                        : String(isActive ?? '—')
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
                          {user.FechaAlta ?? user.fechaAlta
                            ? new Date(user.FechaAlta ?? user.fechaAlta).toLocaleDateString('es-MX')
                            : '—'}
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
      </Card>

      {/* User roles panel */}
      {(rolesLoading || rolesError || selectedUserRoles.length > 0) && (
        <Card className="mt-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f4] bg-[#f7f9fd] px-5 py-3">
            <div className="flex items-center gap-2">
              <IconShield />
              <span className="text-sm font-semibold text-[#0f172a]">Roles del usuario</span>
              {selectedUserId && <StatusBadge variant="default">ID {selectedUserId}</StatusBadge>}
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
                      <td className="px-4 py-3"><StatusBadge variant="default">{role.CodigoRol ?? '—'}</StatusBadge></td>
                      <td className="px-4 py-3 font-medium text-[#0f172a]">{role.NombreRol ?? '—'}</td>
                      <td className="px-4 py-3 text-[#475569]">{role.NombreMaster ?? 'Sin master'}</td>
                      <td className="px-4 py-3 text-[#475569]">{role.NombreEmpresaVendedora ?? 'Sin empresa'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
