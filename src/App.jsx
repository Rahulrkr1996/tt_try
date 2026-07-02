import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import CampusLogin from './pages/CampusLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campus/login" element={<CampusLogin />} />
          <Route
            path="/campus/dashboard"
            element={
              <ProtectedRoute role="ambassador">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}
