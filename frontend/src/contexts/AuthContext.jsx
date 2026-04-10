import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

/**
 * Provides auth state to the entire tree.
 *
 * user  = null  → still loading (checking cookie on mount)
 * user  = false → confirmed logged out
 * user  = {...} → authenticated user object { id, email, first_name, last_name }
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, verify the httpOnly cookie is still valid by calling /me.
  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data.data.user)
      })
      .catch(() => setUser(false))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password)
    const me = await getMe()
    setUser(me)
    return me
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
