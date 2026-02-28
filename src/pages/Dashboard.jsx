import { useNavigate } from 'react-router-dom'
import { IconUsers, IconShield, IconUser, SectionHeader, Card } from '../components/ui'

const stats = [
  { label: 'Usuarios activos', value: '—', Icon: IconUsers, color: 'bg-[#dbeafe] text-[#2563eb]' },
  { label: 'Roles asignados', value: '—', Icon: IconShield, color: 'bg-[#e0f2fe] text-[#0284c7]' },
  { label: 'Sesion iniciada', value: 'Admin', Icon: IconUser, color: 'bg-[#dcfce7] text-[#16a34a]' },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <SectionHeader
        label="Panel de control"
        title="Bienvenido de vuelta"
        subtitle="Desde aqui puedes gestionar los usuarios y roles del sistema."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#475569]">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{value}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-[#0f172a]">Acceso rapido</h2>
        <p className="mt-1 text-sm text-[#475569]">
          Navega a la seccion de Usuarios para crear, listar y asignar roles.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="flex items-center gap-2 rounded-lg border border-[#dbeafe] bg-[#f0f7ff] px-4 py-2 text-sm font-medium text-[#2563eb] transition hover:bg-[#dbeafe]"
          >
            <IconUsers />
            Gestionar usuarios
          </button>
          <button
            type="button"
            onClick={() => navigate('/masters')}
            className="flex items-center gap-2 rounded-lg border border-[#e2e8f4] bg-[#f7f9fd] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#e2e8f4]"
          >
            <IconShield />
            Ver masters
          </button>
        </div>
      </Card>
    </div>
  )
}
