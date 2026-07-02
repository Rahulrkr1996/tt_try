// Thin fetch wrapper around the Tezpur Titans backend (tezpur_titans_be).
//
// Auth model used by the backend:
//   - POST /auth/login and /auth/register return a short-lived JSON access_token
//     AND set an httpOnly `refresh_token` cookie (scoped to /auth).
//   - The access token is sent as `Authorization: Bearer <token>` on every
//     protected request and is kept in memory only (never localStorage) to
//     limit XSS exposure.
//   - When the access token expires (or on page reload, since memory is
//     cleared), we call POST /auth/refresh — the browser sends the httpOnly
//     cookie automatically (requires `credentials: 'include'`) and we get a
//     new access token back.

const API_BASE_URL = 'https://tezpur-titans-be.onrender.com/api/v1' //|| 'http://localhost:8080/api/v1'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token || null
}

export function getAccessToken() {
  return accessToken
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    // The backend attaches a stable machine-readable `code` inside
    // `error` (e.g. { code: 'EMAIL_EXISTS' }) so the frontend never has
    // to pattern-match raw SQL/driver error strings.
    this.code = (details && typeof details === 'object' && details.code) || null
  }
}

// Maps stable backend error codes to the copy we want to show the user.
// Falls back to the backend's own `message` when a code isn't recognised.
const ERROR_MESSAGES = {
  EMAIL_EXISTS: 'User not found. Try logging in with this email instead.',
  UNAUTHORIZED: 'Your session has expired or you are not authorized. Please log in again.',
  FORBIDDEN: "You don't have permission to do that.",
}

// Returns the user-facing message for an ApiError, preferring a known
// code mapping over the raw backend message.
export function friendlyErrorMessage(err) {
  if (err instanceof ApiError) {
    if (err.code && ERROR_MESSAGES[err.code]) return ERROR_MESSAGES[err.code]
    if (err.status === 401) return ERROR_MESSAGES.UNAUTHORIZED
    if (err.status === 403) return ERROR_MESSAGES.FORBIDDEN
    return err.message
  }
  return 'Something went wrong. Please try again.'
}

let refreshPromise = null

// Calls /auth/refresh using the httpOnly cookie. De-duplicated so parallel
// 401s don't fire multiple refresh requests at once.
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST', auth: false })
      .then((body) => {
        setAccessToken(body?.data?.access_token || null)
        return accessToken
      })
      .catch((err) => {
        setAccessToken(null)
        throw err
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function rawRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include', // send/receive the refresh_token cookie
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  let parsed = null
  const text = await res.text()
  if (text) {
    try {
      parsed = JSON.parse(text)
    } catch {
      // non-JSON response body, ignore
    }
  }

  if (!res.ok) {
    throw new ApiError(parsed?.message || `Request failed (${res.status})`, res.status, parsed?.error)
  }

  return parsed
}

// Public request helper: automatically retries once via /auth/refresh on a 401.
async function request(path, options = {}) {
  const { auth = true } = options
  try {
    return await rawRequest(path, options)
  } catch (err) {
    if (auth && err instanceof ApiError && err.status === 401) {
      await refreshAccessToken()
      return rawRequest(path, options)
    }
    throw err
  }
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST', auth: false }),
  refresh: refreshAccessToken,
  me: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload, auth: false }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: payload }),
}

export const profileApi = {
  get: () => request('/profile'),
  update: (payload) => request('/profile', { method: 'PUT', body: payload }),
  setPhoto: (fileId) => request('/profile/photo', { method: 'POST', body: { file_id: fileId } }),
  setResume: (fileId) => request('/profile/resume', { method: 'POST', body: { file_id: fileId } }),
}

export const collegesApi = {
  list: () => request('/colleges', { auth: false }),
}

// Uploads a file (multipart) and returns the created file record's id/url.
// Not JSON, so it bypasses the rawRequest() JSON body handling.
export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const headers = { Accept: 'application/json' }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  let res
  try {
    res = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: fd,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  const text = await res.text()
  const parsed = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new ApiError(parsed?.message || `Upload failed (${res.status})`, res.status, parsed?.error)
  }
  return parsed?.data
}

export const adminApi = {
  ambassadors: () => request('/admin/ambassadors'),
}

export { API_BASE_URL, request }
