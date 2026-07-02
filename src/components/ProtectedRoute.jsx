import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { roleHome, roleName } from '../lib/roles.js'

// Wrap a route with this to require login. Pass `role="admin"` to also
// require that specific role — any other logged-in user gets bounced to
// their own home instead of seeing the page.
export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <div className="route-loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/campus/login?tab=login" replace state={{ from: location }} />
  }

  if (role && roleName(user) !== role) {
    return <Navigate to={roleHome(user)} replace />
  }

  return children
}
