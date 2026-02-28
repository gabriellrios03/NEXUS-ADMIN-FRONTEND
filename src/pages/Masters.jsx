import { useState, useEffect, useRef } from 'react'
import { API_BASE, API_HEADERS, getToken } from '../api'
import {
  SectionHeader, Card, Toast, FormInput, PrimaryButton, SecondaryButton,
  Spinner, IconSearch, IconShield,
} from '../components/ui'

function authH() {
  const token = getToken()
  return { ...API_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

/* ─── Icon Building (for Masters) ───────────────────────────────────────── */
function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}

export default function MastersPage() {
  const [masters, setMasters] = useState([])
  const [mastersTotal, setMastersTotal] = useState(0)
  const [mastersLoading, setMastersLoading] = useState(false)
  const [mastersError, setMastersError] = useState('')

  const [tableSearch, setTableSearch] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newMasterNombre, setNewMasterNombre] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createMessage, setCreateMessage] = useState('')

  async function fetchMasters() {
    setMastersLoading(true)
    setMastersError('')
    try {
      const res = await fetch(`${API_BASE}/api/masters`, { headers: authH() })
      const data = await res.json().catch(() => [])
      if (!res.ok) { setMastersError('No se pudieron cargar los masters.'); return }
      if (Array.isArray(data?.masters)) {
        setMasters(data.masters)
        setMastersTotal(Number(data?.total) || data.masters.length)
        return
      }
      if (Array.isArray(data)) { setMasters(data); setMastersTotal(data.length); return }
      setMasters([]); setMastersTotal(0)
    } catch { setMastersError('Error de conexion al cargar masters.') }
    finally { setMastersLoading(false) }
  }

  useEffect(() => { fetchMasters() }, [])

  async function handleCreateMaster(event) {
    event.preventDefault()
    setCreateLoading(true)
    setCreateMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/masters`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newMasterNombre }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setCreateMessage(data?.message || 'No se pudo crear el master.'); return }
      setCreateMessage('Master creado exitosamente.')
      setNewMasterNombre('')
      fetchMasters()
    } catch { setCreateMessage('Error de conexion al crear el master.') }
    finally { setCreateLoading(false) }
  }

  const filtered = tableSearch.trim()
    ? masters.filter((m) =>
        (m.Nombre ?? m.nombre ?? '').toLowerCase().includes(tableSearch.toLowerCase()) ||
        String(m.Id ?? m.id ?? '').includes(tableSearch)
      )
    : masters

  const createMsgType = createMessage?.toLowerCase().includes('exit') ? 'success' : 'error'

  return (
    <div className="p-8">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          label="Administracion"
          title="Masters"
          subtitle={
            !mastersLoading && !mastersError
              ? `${mastersTotal} master${mastersTotal !== 1 ? 's' : ''} registrado${mastersTotal !== 1 ? 's' : ''}`
              : undefined
          }
        />
        <button
          type="button"
          onClick={() => setShowCreateForm((f) => !f)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            showCreateForm
              ? 'bg-[#0f172a] text-white'
              : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
          }`}
        >
          <IconBuilding />
          Nuevo master
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <Card className="mb-5 p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0f172a]">Crear nuevo master</h2>
          <form onSubmit={handleCreateMaster}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Nombre"
                id="new-master-nombre"
                type="text"
                value={newMasterNombre}
                onChange={(e) => setNewMasterNombre(e.target.value)}
                placeholder="Ej. MTY CONSULTORES"
                required
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" loading={createLoading}>
                {createLoading ? 'Creando...' : 'Crear master'}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </SecondaryButton>
            </div>
            {createMessage && (
              <div className="mt-3">
                <Toast message={createMessage} type={createMsgType} onClose={() => setCreateMessage('')} />
              </div>
            )}
          </form>
        </Card>
      )}

      {/* Table card */}
      <Card className="overflow-hidden">
        {/* Search bar */}
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

        {/* States */}
        {mastersLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-[#475569]">
            <Spinner /> Cargando masters...
          </div>
        )}
        {mastersError && (
          <div className="px-6 py-4">
            <Toast message={mastersError} type="error" onClose={() => setMastersError('')} />
          </div>
        )}

        {/* Table */}
        {!mastersLoading && !mastersError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f4] bg-[#f7f9fd]">
                  {['ID', 'Nombre'].map((h) => (
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
                    <td colSpan="2" className="px-5 py-12 text-center text-sm text-[#94a3b8]">
                      {tableSearch ? 'Sin resultados para tu busqueda.' : 'Sin masters registrados.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((master, i) => (
                    <tr key={master.Id ?? master.id ?? i} className="transition hover:bg-[#f7f9fd]">
                      <td className="px-5 py-3.5 font-mono text-xs text-[#475569]">
                        #{master.Id ?? master.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#0f172a]">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                            <IconBuilding />
                          </span>
                          {master.Nombre ?? master.nombre}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer count */}
            {filtered.length > 0 && (
              <div className="border-t border-[#f1f5f9] px-5 py-3 text-xs text-[#94a3b8]">
                Mostrando {filtered.length} de {mastersTotal} master{mastersTotal !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
