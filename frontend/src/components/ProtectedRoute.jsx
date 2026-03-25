import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Wraps any route that requires authentication.
 * - While the auth check is in flight: renders a loading indicator.
 * - If unauthenticated: redirects to /login, preserving the attempted path
 *   so the user can be sent back there after a successful login.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
