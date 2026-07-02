import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Mail, ShieldCheck, User as UserIcon, Users } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { adminApi, ApiError } from '../lib/api.js'
import './Dashboard.css'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [ambassadors, setAmbassadors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await adminApi.ambassadors()
        if (!cancelled) setAmbassadors(res?.data || [])
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load ambassadors.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/campus/login?tab=login', { replace: true })
  }

  return (
    <>
      <PageHero
        crumbLabel="Admin"
        titleLine1="Admin"
        titleAccent="Dashboard"
        subtitle="Signed in as an administrator."
      />

      <div className="container">
        <section className="dashboard-card">
          <div className="dashboard-card__row">
            <span className="dashboard-card__icon" aria-hidden="true">
              <ShieldCheck size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className="dashboard-card__label">Role</p>
              <p className="dashboard-card__value">Admin</p>
            </div>
          </div>

          <div className="dashboard-card__row">
            <span className="dashboard-card__icon" aria-hidden="true">
              <UserIcon size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className="dashboard-card__label">Full Name</p>
              <p className="dashboard-card__value">{user?.full_name}</p>
            </div>
          </div>

          <div className="dashboard-card__row">
            <span className="dashboard-card__icon" aria-hidden="true">
              <Mail size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className="dashboard-card__label">Email</p>
              <p className="dashboard-card__value">{user?.email}</p>
            </div>
          </div>

          <button className="btn btn-primary" type="button" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </section>

        <section className="dashboard-panel admin-table-panel">
          <p className="dashboard-panel__eyebrow">Campus Ambassadors</p>
          <h2 className="dashboard-panel__title">
            <Users size={20} strokeWidth={1.8} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            All Applicants ({ambassadors.length})
          </h2>

          {error && <p className="form-alert" role="alert">{error}</p>}

          {loading ? (
            <p className="route-loading">Loading ambassadors…</p>
          ) : ambassadors.length === 0 ? (
            <p className="dashboard-card__label">No ambassadors have registered yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Bio</th>
                    <th>Resume</th>
                    <th>Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {ambassadors.map((a) => (
                    <tr key={a.id}>
                      <td>{a.user?.full_name || '—'}</td>
                      <td>{a.user?.email || '—'}</td>
                      <td>{a.phone || '—'}</td>
                      <td>{a.college?.name || '—'}</td>
                      <td className="admin-table__bio" title={a.bio}>{a.bio || '—'}</td>
                      <td>
                        {a.resume_file?.url ? (
                          <a href={a.resume_file.url} target="_blank" rel="noreferrer">View</a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        {a.photo_file?.url ? (
                          <a href={a.photo_file.url} target="_blank" rel="noreferrer">View</a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
