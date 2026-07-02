import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Circle,
  Share2,
  MessageCircle,
  Shirt,
  Ticket,
  Award,
  GraduationCap,
  Phone,
  PenLine,
  Upload,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { profileApi, collegesApi, uploadFile, ApiError } from '../lib/api.js'
import './Dashboard.css'
import './CampusLogin.css'

const nextSteps = [
  {
    title: 'Application received',
    text: "You're registered as a Tezpur Titans Campus Ambassador.",
    done: true,
  },
  {
    title: 'Application under review',
    text: "Our team is reviewing your profile. We'll notify you by email once it's processed.",
    done: false,
  },
  {
    title: 'Get onboarded',
    text: 'Once approved, you\u2019ll receive onboarding details, your ambassador kit, and campaign access.',
    done: false,
  },
]

const perks = [
  { icon: Shirt, text: 'Exclusive merchandise' },
  { icon: Ticket, text: 'Event access' },
  { icon: Award, text: 'Leadership certificate' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [colleges, setColleges] = useState([])
  const [profile, setProfile] = useState({ collegeId: '', phone: '', bio: '' })
  const [resumeName, setResumeName] = useState('')
  const [photoName, setPhotoName] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [collegesRes, profileRes] = await Promise.all([collegesApi.list(), profileApi.get()])
        if (cancelled) return
        setColleges(collegesRes?.data?.items || [])
        const p = profileRes?.data
        if (p) {
          setProfile({
            collegeId: p.college_id || '',
            phone: p.phone || '',
            bio: p.bio || '',
          })
          setResumeName(p.resume_file?.url ? 'Resume on file' : '')
          setPhotoName(p.photo_file?.url ? 'Photo on file' : '')
        }
      } catch {
        // dashboard still works without this — user can retry via the save button
      } finally {
        if (!cancelled) setProfileLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const updateProfileField = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }))
    setProfileSaved(false)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSaved(false)
    setProfileSaving(true)
    try {
      await profileApi.update({
        college_id: profile.collegeId || null,
        phone: profile.phone,
        bio: profile.bio,
      })
      setProfileSaved(true)
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Could not save your profile. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeName(file.name)
    setProfileError('')
    try {
      const uploaded = await uploadFile(file)
      await profileApi.setResume(uploaded.id)
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Resume upload failed. Please try again.')
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoName(file.name)
    setProfileError('')
    try {
      const uploaded = await uploadFile(file)
      await profileApi.setPhoto(uploaded.id)
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Photo upload failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/campus/login?tab=login', { replace: true })
  }

  return (
    <>
      <PageHero
        crumbLabel="Dashboard"
        titleLine1="Welcome,"
        titleAccent={user?.full_name || 'Ambassador'}
        subtitle="This is your Campus Ambassador home. Track your application and get ready to represent the Titans."
      />

      <div className="container dashboard-grid">
        <section className="dashboard-card">
          <div className="dashboard-card__row">
            <span className="dashboard-card__icon" aria-hidden="true">
              <UserIcon size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className="dashboard-card__label">Role</p>
              <p className="dashboard-card__value">Student</p>
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

        <div className="dashboard-side">
          <section className="dashboard-panel dashboard-panel--form">
            <p className="dashboard-panel__eyebrow">Ambassador Application</p>
            <h2 className="dashboard-panel__title">Complete Your Profile</h2>
            <p className="register-card__sub" style={{ color: 'var(--color-text-dim)' }}>
              Add a few more details so we can review your application.
            </p>

            <form onSubmit={handleProfileSubmit} noValidate>
              {profileError && (
                <p className="form-alert" role="alert">
                  <AlertCircle size={15} strokeWidth={1.8} aria-hidden="true" />
                  {profileError}
                </p>
              )}

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <GraduationCap size={17} strokeWidth={1.8} />
                </span>
                <select
                  value={profile.collegeId}
                  onChange={updateProfileField('collegeId')}
                  disabled={!profileLoaded}
                  defaultValue=""
                >
                  <option value="">Select your College / University</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <Phone size={17} strokeWidth={1.8} />
                </span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={updateProfileField('phone')}
                />
              </label>

              <label className="textfield">
                <span className="textfield__head">
                  <span className="field__icon" aria-hidden="true">
                    <PenLine size={17} strokeWidth={1.8} />
                  </span>
                  Why do you want to be a Campus Ambassador?
                </span>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Share your motivation, ideas and how you can contribute."
                  value={profile.bio}
                  onChange={updateProfileField('bio')}
                />
                <span className="textfield__count">{profile.bio.length}/500</span>
              </label>

              <label className="upload-field">
                <span className="field__icon" aria-hidden="true">
                  <Upload size={17} strokeWidth={1.8} />
                </span>
                <span className="upload-field__text">
                  <strong>Upload your Resume</strong>
                  <small>PDF, DOC or DOCX</small>
                </span>
                <span className="upload-field__btn">{resumeName || 'Choose File'}</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
              </label>

              <label className="upload-field">
                <span className="field__icon" aria-hidden="true">
                  <Upload size={17} strokeWidth={1.8} />
                </span>
                <span className="upload-field__text">
                  <strong>Upload a Profile Photo</strong>
                  <small>JPG or PNG</small>
                </span>
                <span className="upload-field__btn">{photoName || 'Choose File'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>

              <button className="btn btn-primary btn-block" type="submit" disabled={profileSaving}>
                {profileSaving ? 'Saving…' : 'Save Details'}
              </button>

              {profileSaved && (
                <p className="register-card__secure">
                  <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />
                  Profile details saved.
                </p>
              )}
            </form>
          </section>

          <section className="dashboard-panel">
            <p className="dashboard-panel__eyebrow">Your Progress</p>
            <h2 className="dashboard-panel__title">What&rsquo;s Next</h2>

            <ul className="status-list">
              {nextSteps.map((step) => (
                <li key={step.title} className={`status-list__item${step.done ? ' is-done' : ''}`}>
                  <span className="status-list__icon" aria-hidden="true">
                    {step.done ? (
                      <CheckCircle2 size={20} strokeWidth={1.8} />
                    ) : (
                      <Circle size={20} strokeWidth={1.8} />
                    )}
                  </span>
                  <div>
                    <p className="status-list__title">{step.title}</p>
                    <p className="status-list__text">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="dashboard-panel">
            <p className="dashboard-panel__eyebrow">Ambassador Perks</p>
            <h2 className="dashboard-panel__title">Waiting For You</h2>

            <ul className="perk-list">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="perk-list__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="dashboard-panel__actions">
              <a
                className="btn btn-outline"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <Share2 size={16} strokeWidth={1.8} />
                Share on Instagram
              </a>
              <a className="btn btn-outline" href="mailto:ambassador@tezpurtitans.com">
                <MessageCircle size={16} strokeWidth={1.8} />
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
