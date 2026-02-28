import { useState, useEffect } from 'react'
import { API_BASE, API_HEADERS, getToken } from '../api'
import {
  SectionHeader, Card, Toast, FormInput, PrimaryButton, SecondaryButton, Spinner, IconSearch,
} from '../components/ui'

function authH() {
  const token = getToken()
  return { ...API_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function IconOffice() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  )
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [tableSearch, setTableSearch] = useState('')

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createMsg, setCreateMsg] = useState('')

  // Edit modal
  const [editEmpresa, setEditEmpresa] = useState(null) // { Id, Nombre }
  const [editNombre, setEditNombre] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg, setEditMsg] = useState('')

  async function fetchEmpresas() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/empresas`, { headers: authH() })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError('No se pudieron cargar las empresas.'); return }
      if (Array.isArray(data?.empresas)) {
        setEmpresas(data.empresas)
        setTotal(Number(data.total) || data.empresas.length)
        return
      }
      if (Array.isArray(data)) { setEmpresas(data); setTotal(data.length); return }
      setEmpresas([]); setTotal(0)
    } catch { setError('Error de conexion al cargar empresas.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEmpresas() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateLoading(true)
    setCreateMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/empresas`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newNombre }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setCreateMsg(data?.message || 'No se pudo crear la empresa.'); return }
      setCreateMsg('Empresa creada exitosamente.')
      setNewNombre('')
      fetchEmpresas()
    } catch { setCreateMsg('Error de conexion.') }
    finally { setCreateLoading(false) }
  }

  function openEdit(empresa) {
    setEditEmpresa(empresa)
    setEditNombre(empresa.Nombre ?? empresa.nombre ?? '')
    setEditMsg('')
  }

  function closeEdit() {
    setEditEmpresa(null)
    setEditNombre('')
    setEditMsg('')
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!editEmpresa) return
    const id = editEmpresa.Id ?? editEmpresa.id
    setEditLoading(true)
    setEditMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/empresas/${id}`, {
        method: 'PATCH',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setEditMsg(data?.message || 'No se pudo editar la empresa.'); return }
      setEditMsg('Empresa editada exitosamente.')
      fetchEmpresas()
      setTimeout(() => closeEdit(), 1200)
    } catch { setEditMsg('Error de conexion.') }
    finally { setEditLoading(false) }
  }

  const filtered = tableSearch.trim()
    ? empresas.filter((e) =>
        (e.Nombre ?? e.nombre ?? '').toLowerCase().includes(tableSearch.toLowerCase()) ||
        String(e.Id ?? e.id ?? '').includes(tableSearch)
      )
    : empresas

  const createMsgType = createMsg?.toLowerCase().includes('exit') ? 'success' : 'error'
  const editMsgType = editMsg?.toLowerCase().includes('exit') ? 'success' : 'error'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          label="Administracion"
          title="Empresas Vendedoras"
          subtitle={
            !loading && !error
              ? `${total} empresa${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''}`
              : undefined
          }
        />
        <button
          type="button"
          onClick={() => setShowCreate((f) => !f)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            showCreate
              ? 'bg-[#0f172a] text-white'
              : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
          }`}
        >
          <IconOffice />
          Nueva empresa
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="mb-5 p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0f172a]">Crear nueva empresa vendedora</h2>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Nombre"
                id="new-empresa-nombre"
                type="text"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                placeholder="Ej. Empresa Demo"
                required
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={createLoading}>
                {createLoading ? 'Creando...' : 'Crear empresa'}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => { setShowCreate(false); setCreateMsg('') }}>
                Cancelar
              </SecondaryButton>
            </div>
            {createMsg && (
              <div className="mt-3">
                <Toast message={createMsg} type={createMsgType} onClose={() => setCreateMsg('')} />
              </div>
            )}
          </form>
        </Card>
      )}

      {/* Table card */}
      <Card className="overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-2 border-b border-[#e2e8f4] px-4 py-3">
          <IconSearch />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Buscar por nombre o ID..."
            className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none"
          />
          {tableSearch && (
            <button
              type="button"
              onClick={() => setTableSearch('')}
              className="text-xs text-[#94a3b8] hover:text-[#475569]"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Loading / error */}
        {loading && (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-[#475569]">
            <Spinner /> Cargando empresas...
          </div>
        )}
        {error && (
          <div className="px-6 py-4">
            <Toast message={error} type="error" onClose={() => setError('')} />
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f4] bg-[#f7f9fd]">
                  {['ID', 'Nombre', 'Acciones'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-5 py-12 text-center text-sm text-[#94a3b8]">
                      {tableSearch ? 'Sin resultados para tu busqueda.' : 'Sin empresas registradas.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, i) => (
                    <tr key={emp.Id ?? emp.id ?? i} className="transition hover:bg-[#f7f9fd]">
                      <td className="px-5 py-3.5 font-mono text-xs text-[#475569]">
                        #{emp.Id ?? emp.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#0f172a]">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                            <IconOffice />
                          </span>
                          {emp.Nombre ?? emp.nombre}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => openEdit(emp)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#475569] transition hover:border-[#2563eb] hover:text-[#2563eb]"
                        >
                          <IconEdit />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && (
              <div className="border-t border-[#f1f5f9] px-5 py-3 text-xs text-[#94a3b8]">
                Mostrando {filtered.length} de {total} empresa{total !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {editEmpresa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-1 text-base font-bold text-[#0f172a]">Editar empresa</h2>
            <p className="mb-5 text-xs text-[#94a3b8]">
              ID #{editEmpresa.Id ?? editEmpresa.id}
            </p>
            <form onSubmit={handleEdit}>
              <FormInput
                label="Nombre"
                id="edit-empresa-nombre"
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <PrimaryButton type="submit" loading={editLoading}>
                  {editLoading ? 'Guardando...' : 'Guardar cambios'}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={closeEdit}>
                  Cancelar
                </SecondaryButton>
              </div>
              {editMsg && (
                <div className="mt-3">
                  <Toast message={editMsg} type={editMsgType} onClose={() => setEditMsg('')} />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
