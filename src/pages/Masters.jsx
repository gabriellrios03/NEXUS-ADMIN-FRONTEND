import { useState, useEffect } from 'react'
import { API_BASE, API_HEADERS, getToken } from '../api'
import {
  SectionHeader, Card, Toast, FormInput, PrimaryButton, Spinner,
} from '../components/ui'

function authH() {
  const token = getToken()
  return { ...API_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

export default function MastersPage() {
  const [masters, setMasters] = useState([])
  const [mastersTotal, setMastersTotal] = useState(0)
  const [mastersLoading, setMastersLoading] = useState(false)
  const [mastersError, setMastersError] = useState('')

  const [newMasterNombre, setNewMasterNombre] = useState('')
  const [createMasterLoading, setCreateMasterLoading] = useState(false)
  const [createMasterMessage, setCreateMasterMessage] = useState('')

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

  useEffect(() => {
    fetchMasters()
  }, [])

  async function handleCreateMaster(event) {
    event.preventDefault()
    setCreateMasterLoading(true)
    setCreateMasterMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/masters`, {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newMasterNombre }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setCreateMasterMessage(data?.message || 'No se pudo crear el master.'); return }
      setCreateMasterMessage('Master creado exitosamente.')
      setNewMasterNombre('')
      fetchMasters()
    } catch { setCreateMasterMessage('Error de conexion al crear el master.') }
    finally { setCreateMasterLoading(false) }
  }

  const createMsgType = createMasterMessage?.toLowerCase().includes('exit') ? 'success' : 'error'

  return (
    <div className="p-8">
      <SectionHeader
        label="Administracion"
        title="Masters"
        subtitle={!mastersLoading && !mastersError ? `${mastersTotal} master${mastersTotal !== 1 ? 's' : ''} registrado${mastersTotal !== 1 ? 's' : ''}` : undefined}
      />

      {/* Create master form */}
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
              placeholder="Nombre del master"
              required
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <PrimaryButton type="submit" loading={createMasterLoading}>
              {createMasterLoading ? 'Creando...' : 'Crear master'}
            </PrimaryButton>
          </div>
          {createMasterMessage && (
            <div className="mt-3">
              <Toast message={createMasterMessage} type={createMsgType} onClose={() => setCreateMasterMessage('')} />
            </div>
          )}
        </form>
      </Card>

      {/* Masters table */}
      <Card className="overflow-hidden">
        {mastersLoading && (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-[#475569]">
            <Spinner /> Cargando masters...
          </div>
        )}
        {mastersError && (
          <div className="px-6 py-4">
            <Toast message={mastersError} type="error" onClose={() => {}} />
          </div>
        )}
        {!mastersLoading && !mastersError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f4] bg-[#f7f9fd]">
                  {['ID', 'Nombre'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#475569]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {masters.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-4 py-12 text-center text-sm text-[#94a3b8]">Sin masters disponibles.</td>
                  </tr>
                ) : (
                  masters.map((master, i) => (
                    <tr key={master.Id ?? i} className="transition hover:bg-[#f7f9fd]">
                      <td className="px-4 py-3 font-mono text-xs text-[#475569]">{master.Id}</td>
                      <td className="px-4 py-3 font-medium text-[#0f172a]">{master.Nombre}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
