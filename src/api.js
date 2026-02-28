export const API_BASE = 'http://localhost:3000'

export const API_HEADERS = {
  accept: '*/*',
}

export function authHeaders(token) {
  return {
    ...API_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Token ──────────────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  localStorage.setItem('auth_token', token)
}

export function clearToken() {
  localStorage.removeItem('auth_token')
}

// ── Session (user + roles from login response) ────────────────────────────
export function setSession(data) {
  const firstRole = Array.isArray(data?.roles) && data.roles.length > 0 ? data.roles[0] : null

  const session = {
    codigoRol:           firstRole?.CodigoRol           ?? '',
    idMaster:            firstRole?.IdMaster            != null ? firstRole.IdMaster            : '',
    idEmpresaVendedora:  firstRole?.IdEmpresaVendedora  != null ? firstRole.IdEmpresaVendedora  : '',
    userId:              data?.user?.id                 ?? '',
    nombre:              data?.user?.nombre             ?? '',
    email:               data?.user?.email              ?? '',
  }

  localStorage.setItem('nexus_session', JSON.stringify(session))
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem('nexus_session') || '{}')
  } catch {
    return {}
  }
}

export function clearSession() {
  localStorage.removeItem('nexus_session')
}
