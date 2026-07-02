import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, setAccessToken } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // `initializing` covers the one-time silent-refresh attempt on page load.
  const [initializing, setInitializing] = useState(true)

  // On first load there's no access token in memory (page reload wipes it),
  // so we try to silently trade the httpOnly refresh cookie for a new one.
  // If that fails, the user is simply logged out — no error shown.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await authApi.refresh()
        const me = await authApi.me()
        if (!cancelled) setUser(me?.data ?? null)
      } catch {
        setAccessToken(null)
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setInitializing(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const body = await authApi.login({ email, password })
    setAccessToken(body?.data?.access_token || null)
    setUser(body?.data?.user ?? null)
    return body?.data?.user ?? null
  }, [])

  const register = useCallback(async ({ email, password, fullName }) => {
    const body = await authApi.register({ email, password, full_name: fullName })
    setAccessToken(body?.data?.access_token || null)
    setUser(body?.data?.user ?? null)
    return body?.data?.user ?? null
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await authApi.me()
    setUser(me?.data ?? null)
    return me?.data ?? null
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      initializing,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, initializing, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
