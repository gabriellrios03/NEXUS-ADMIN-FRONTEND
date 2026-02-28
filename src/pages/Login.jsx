import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { API_BASE, API_HEADERS, setToken, getToken } from '../api'
import { FormInput, Spinner, Toast, IconEye, IconBolt } from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()

  if (getToken()) return <Navigate to="/dashboard" replace />

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { ...API_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data?.message || 'Credenciales invalidas o error del servidor.')
        return
      }
      const token = data?.access_token || data?.token || ''
      if (token) setToken(token)
      navigate('/dashboard')
    } catch {
      setMessage('No se pudo conectar con la API en localhost:3000.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f4fa] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb] shadow-md">
            <span className="text-white"><IconBolt /></span>
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Entrando...' : 'Iniciar sesion'}
            </button>
          </form>

          {message && (
            <div className="mt-4">
              <Toast message={message} type="error" onClose={() => setMessage('')} />
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
