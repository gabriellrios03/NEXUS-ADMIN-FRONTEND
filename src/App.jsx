import { useEffect, useState } from 'react'

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
      if (!isAuthenticated || activeSection !== 'usuarios') {
        return
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUsersError('No hay token disponible. Inicia sesión de nuevo.')
        return
      }

      setUsersLoading(true)
      setUsersError('')

      try {
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'GET',
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ([]))

        if (!response.ok) {
          setUsersError('No se pudieron cargar los usuarios.')
          return
        }

        if (Array.isArray(data)) {
          setUsers(data)
          setUsersTotal(data.length)
          return
        }

        if (Array.isArray(data?.users)) {
          setUsers(data.users)
          setUsersTotal(Number(data?.total) || data.users.length)
          return
        }

        setUsers([])
        setUsersTotal(0)
      } catch {
        setUsersError('Error de conexión al cargar usuarios.')
      } finally {
        setUsersLoading(false)
      }
    }

    const fetchAvailableRoles = async () => {
      if (!isAuthenticated || activeSection !== 'usuarios') {
        return
      }

      const token = localStorage.getItem('auth_token')
      setAvailableRolesLoading(true)
      setAvailableRolesError('')

      try {
        const response = await fetch('http://localhost:3000/api/roles', {
          method: 'GET',
          headers: {
            accept: '*/*',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        const data = await response.json().catch(() => ([]))

        if (!response.ok) {
          setAvailableRolesError('No se pudieron cargar los roles disponibles.')
          return
        }

        if (Array.isArray(data)) {
          setAvailableRoles(data)
          return
        }

        if (Array.isArray(data?.roles)) {
          setAvailableRoles(data.roles)
          return
        }

        setAvailableRoles([])
      } catch {
        setAvailableRolesError('Error de conexión al cargar roles disponibles.')
      } finally {
        setAvailableRolesLoading(false)
      }
    }

    fetchUsers()
    fetchAvailableRoles()
  }, [activeSection, isAuthenticated])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setMessage(data?.message || 'Credenciales inválidas o error del servidor.')
        return
      }

      const token = data?.access_token || data?.token || ''
      if (token) {
        localStorage.setItem('auth_token', token)
      }

      setActiveSection('dashboard')
      setIsAuthenticated(true)
    } catch {
      setMessage('No se pudo conectar con la API en localhost:3000.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
    setActiveSection('dashboard')
    setPassword('')
    setShowPassword(false)
    setMessage('')
    setUsers([])
    setUsersTotal(0)
    setUsersError('')
    setNewUserNombre('')
    setNewUserEmail('')
    setNewUserPassword('')
    setCreateUserLoading(false)
    setCreateUserMessage('')
    setAssignIdUsuario('')
    setAssignIdRol('')
    setAssignIdMaster('')
    setAssignIdEmpresaVendedora('')
    setAvailableRoles([])
    setAvailableRolesLoading(false)
    setAvailableRolesError('')
    setAssignRoleLoading(false)
    setAssignRoleMessage('')
    setSelectedUserRoles([])
    setRolesTotal(0)
    setRolesLoading(false)
    setRolesError('')
    setSelectedUserId(null)
  }

  const handleViewRoles = async (userId) => {
    if (!userId) {
      setRolesError('Usuario sin ID válido.')
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setRolesError('No hay token disponible. Inicia sesión de nuevo.')
      return
    }

    setSelectedUserId(userId)
    setRolesLoading(true)
    setRolesError('')
    setSelectedUserRoles([])
    setRolesTotal(0)

    try {
      const response = await fetch(`http://localhost:3000/api/roles/user/${userId}`, {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ([]))

      if (!response.ok) {
        setRolesError('No se pudieron cargar los roles del usuario.')
        return
      }

      if (Array.isArray(data)) {
        setSelectedUserRoles(data)
        setRolesTotal(data.length)
        return
      }

      if (Array.isArray(data?.roles)) {
        setSelectedUserRoles(data.roles)
        setRolesTotal(Number(data?.total) || data.roles.length)
        return
      }

      if (data && typeof data === 'object') {
        setSelectedUserRoles([data])
        setRolesTotal(1)
        return
      }

      setSelectedUserRoles([])
      setRolesTotal(0)
    } catch {
      setRolesError('Error de conexión al cargar roles.')
    } finally {
      setRolesLoading(false)
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setCreateUserMessage('No hay token disponible. Inicia sesión de nuevo.')
      return
    }

    setCreateUserLoading(true)
    setCreateUserMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: newUserNombre,
          email: newUserEmail,
          password: newUserPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCreateUserMessage(data?.message || 'No se pudo crear el usuario.')
        return
      }

      setCreateUserMessage('Usuario creado exitosamente.')
      setNewUserNombre('')
      setNewUserEmail('')
      setNewUserPassword('')

      setUsersLoading(true)
      setUsersError('')

      try {
        const usersResponse = await fetch('http://localhost:3000/api/users', {
          method: 'GET',
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        })

        const usersData = await usersResponse.json().catch(() => ([]))

        if (!usersResponse.ok) {
          setUsersError('No se pudieron actualizar los usuarios.')
          return
        }

        if (Array.isArray(usersData)) {
          setUsers(usersData)
          setUsersTotal(usersData.length)
          return
        }

        if (Array.isArray(usersData?.users)) {
          setUsers(usersData.users)
          setUsersTotal(Number(usersData?.total) || usersData.users.length)
          return
        }

        setUsers([])
        setUsersTotal(0)
      } catch {
        setUsersError('Error de conexión al actualizar usuarios.')
      } finally {
        setUsersLoading(false)
      }
    } catch {
      setCreateUserMessage('Error de conexión al crear el usuario.')
    } finally {
      setCreateUserLoading(false)
    }
  }

  const handleAssignRole = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setAssignRoleMessage('No hay token disponible. Inicia sesión de nuevo.')
      return
    }

    setAssignRoleLoading(true)
    setAssignRoleMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/roles/assign', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idUsuario: Number(assignIdUsuario),
          idRol: Number(assignIdRol),
          idMaster: Number(assignIdMaster),
          idEmpresaVendedora: Number(assignIdEmpresaVendedora),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setAssignRoleMessage(data?.message || 'No se pudo asignar el rol.')
        return
      }

      setAssignRoleMessage('Rol asignado exitosamente.')
      const userId = Number(assignIdUsuario)
      setSelectedUserId(userId)
      setAssignIdUsuario('')
      setAssignIdRol('')
      setAssignIdMaster('')
      setAssignIdEmpresaVendedora('')

      if (userId) {
        handleViewRoles(userId)
      }
    } catch {
      setAssignRoleMessage('Error de conexión al asignar el rol.')
    } finally {
      setAssignRoleLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-slate-900 p-6 text-white">
            <h2 className="text-lg font-semibold">Nexus Admin</h2>
            <nav className="mt-8 space-y-2">
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium ${
                  activeSection === 'dashboard' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('usuarios')}
                className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium ${
                  activeSection === 'usuarios' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                Usuarios
              </button>
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
            >
              Logout
            </button>
          </aside>

          <section className="flex flex-1 items-center justify-center p-6">
            {activeSection === 'dashboard' ? (
              <div className="rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Bienvenido logeado exitoso</h1>
              </div>
            ) : (
              <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm">
                <h1 className="mb-4 text-2xl font-semibold text-slate-900">Usuarios</h1>
                <form onSubmit={handleCreateUser} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 text-sm font-semibold text-slate-800">Crear nuevo usuario</h2>
                  <div className="grid gap-3 md:grid-cols-3">
                    <input
                      type="text"
                      value={newUserNombre}
                      onChange={(event) => setNewUserNombre(event.target.value)}
                      placeholder="Nombre"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(event) => setNewUserEmail(event.target.value)}
                      placeholder="Email"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(event) => setNewUserPassword(event.target.value)}
                      placeholder="Password"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={createUserLoading}
                      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {createUserLoading ? 'Creando...' : 'Crear usuario'}
                    </button>
                    {createUserMessage && <p className="text-sm text-slate-700">{createUserMessage}</p>}
                  </div>
                </form>

                <form onSubmit={handleAssignRole} className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 text-sm font-semibold text-slate-800">Asignar rol a usuario</h2>
                  {availableRolesLoading && <p className="mb-3 text-sm text-slate-600">Cargando roles...</p>}
                  {availableRolesError && <p className="mb-3 text-sm text-red-600">{availableRolesError}</p>}
                  <div className="grid gap-3 md:grid-cols-4">
                    <input
                      type="number"
                      min="1"
                      value={assignIdUsuario}
                      onChange={(event) => setAssignIdUsuario(event.target.value)}
                      placeholder="idUsuario"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                    <select
                      value={assignIdRol}
                      onChange={(event) => setAssignIdRol(event.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      {availableRoles.map((role, index) => (
                        <option key={role.Id ?? role.id ?? role.IdRol ?? role.idRol ?? index} value={role.Id ?? role.id ?? role.IdRol ?? role.idRol}>
                          {role.NombreRol ?? role.nombreRol ?? role.Nombre ?? role.nombre ?? 'Rol'}
                          {role.CodigoRol ? ` (${role.CodigoRol})` : ''}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={assignIdMaster}
                      onChange={(event) => setAssignIdMaster(event.target.value)}
                      placeholder="idMaster"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={assignIdEmpresaVendedora}
                      onChange={(event) => setAssignIdEmpresaVendedora(event.target.value)}
                      placeholder="idEmpresaVendedora"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={assignRoleLoading}
                      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {assignRoleLoading ? 'Asignando...' : 'Asignar rol'}
                    </button>
                    {assignRoleMessage && <p className="text-sm text-slate-700">{assignRoleMessage}</p>}
                  </div>
                </form>

                {!usersLoading && !usersError && (
                  <p className="mb-4 text-sm text-slate-600">Total: {usersTotal}</p>
                )}

                {usersLoading && <p className="text-sm text-slate-600">Cargando usuarios...</p>}
                {usersError && <p className="text-sm text-red-600">{usersError}</p>}

                {!usersLoading && !usersError && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-slate-200 text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="border-b border-slate-200 px-3 py-2">ID</th>
                          <th className="border-b border-slate-200 px-3 py-2">Nombre</th>
                          <th className="border-b border-slate-200 px-3 py-2">Email</th>
                          <th className="border-b border-slate-200 px-3 py-2">Activo</th>
                          <th className="border-b border-slate-200 px-3 py-2">Fecha Alta</th>
                          <th className="border-b border-slate-200 px-3 py-2">Roles</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-3 py-3 text-slate-500">
                              Sin usuarios disponibles.
                            </td>
                          </tr>
                        ) : (
                          users.map((user, index) => (
                            <tr key={user.Id ?? user.id ?? user._id ?? index} className="odd:bg-white even:bg-slate-50">
                              <td className="border-b border-slate-100 px-3 py-2">{user.Id ?? user.id ?? user._id ?? '-'}</td>
                              <td className="border-b border-slate-100 px-3 py-2">{user.Nombre ?? user.nombre ?? user.name ?? '-'}</td>
                              <td className="border-b border-slate-100 px-3 py-2">{user.Email ?? user.email ?? '-'}</td>
                              <td className="border-b border-slate-100 px-3 py-2">{user.Activo ?? user.activo ?? '-'}</td>
                              <td className="border-b border-slate-100 px-3 py-2">{user.FechaAlta ?? user.fechaAlta ?? '-'}</td>
                              <td className="border-b border-slate-100 px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewRoles(user.Id ?? user.id ?? user._id)}
                                  className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                                >
                                  Ver roles
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {(rolesLoading || rolesError || selectedUserRoles.length > 0) && (
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-base font-semibold text-slate-800">Roles del usuario {selectedUserId ?? '-'}</h2>
                      {!rolesLoading && !rolesError && (
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                          Total roles: {rolesTotal}
                        </span>
                      )}
                    </div>
                    {rolesLoading && <p className="text-sm text-slate-600">Cargando roles...</p>}
                    {rolesError && <p className="text-sm text-red-600">{rolesError}</p>}
                    {!rolesLoading && !rolesError && selectedUserRoles.length === 0 && (
                      <p className="text-sm text-slate-600">Sin roles disponibles.</p>
                    )}
                    {!rolesLoading && !rolesError && selectedUserRoles.length > 0 && (
                      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="bg-slate-100 text-slate-700">
                            <tr>
                              <th className="border-b border-slate-200 px-3 py-2">Usuario</th>
                              <th className="border-b border-slate-200 px-3 py-2">Email</th>
                              <th className="border-b border-slate-200 px-3 py-2">Código Rol</th>
                              <th className="border-b border-slate-200 px-3 py-2">Nombre Rol</th>
                              <th className="border-b border-slate-200 px-3 py-2">Master</th>
                              <th className="border-b border-slate-200 px-3 py-2">Empresa Vendedora</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUserRoles.map((role, index) => (
                              <tr key={role.Id ?? role.IdRol ?? index} className="odd:bg-white even:bg-slate-50">
                                <td className="border-b border-slate-100 px-3 py-2">{role.NombreUsuario ?? '-'}</td>
                                <td className="border-b border-slate-100 px-3 py-2">{role.Email ?? '-'}</td>
                                <td className="border-b border-slate-100 px-3 py-2">{role.CodigoRol ?? '-'}</td>
                                <td className="border-b border-slate-100 px-3 py-2">{role.NombreRol ?? '-'}</td>
                                <td className="border-b border-slate-100 px-3 py-2">{role.NombreMaster ?? 'Sin master'}</td>
                                <td className="border-b border-slate-100 px-3 py-2">
                                  {role.NombreEmpresaVendedora ?? 'Sin empresa vendedora'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-slate-600">Nexus Admin</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none ring-blue-500 focus:ring-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.58 10.58a2 2 0 102.83 2.83M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.17-2.65 3.99-4.69 5.16M6.53 6.53C4.57 7.7 2.97 9.45 2 12c.61 1.34 1.43 2.56 2.42 3.62"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>
    </main>
  )
}

export default App
