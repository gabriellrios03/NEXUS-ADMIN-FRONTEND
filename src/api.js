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

export function getToken() {
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  localStorage.setItem('auth_token', token)
}

export function clearToken() {
  localStorage.removeItem('auth_token')
}
