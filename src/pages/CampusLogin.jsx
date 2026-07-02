import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  User,
  Mail,
  ShieldCheck,
  Shirt,
  Ticket,
  Award,
  Users,
  TrendingUp,
  Gift,
  Lock,
  AlertCircle,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { friendlyErrorMessage } from '../lib/api.js'
import { roleHome } from '../lib/roles.js'
import './CampusLogin.css'

const benefits = [
  {
    icon: Shirt,
    title: 'Exclusive Merchandise',
    text: 'Get official Tezpur Titans merchandise.',
  },
  {
    icon: Ticket,
    title: 'Event Access',
    text: 'Access to exclusive events, matches and experiences.',
  },
  {
    icon: Award,
    title: 'Leadership Certificate',
    text: 'Earn a certificate of recognition.',
  },
  {
    icon: Users,
    title: 'Networking Opportunities',
    text: 'Connect with like-minded people and industry experts.',
  },
  {
    icon: TrendingUp,
    title: 'Skill Development',
    text: 'Enhance your leadership, communication and organization skills.',
  },
  {
    icon: Gift,
    title: 'Rewards & Recognition',
    text: 'Unlock exciting rewards and top performer recognition.',
  },
]

export default function CampusLogin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'login' ? 'login' : 'register'
  const [activeTab, setActiveTab] = useState(initialTab)
  const navigate = useNavigate()
  const { login, register, user, isAuthenticated } = useAuth()
  const { showError } = useToast()

  useEffect(() => {
    if (isAuthenticated) navigate(roleHome(user), { replace: true })
  }, [isAuthenticated, user, navigate])

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)

  // NOTE: every self-signup becomes a "student" (ambassador) account — the
  // backend always assigns that role on /auth/register. Admin accounts are
  // provisioned directly (e.g. via the seed script / database), not through
  // this public form, since admin access shouldn't be self-service.
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const switchTab = (tab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    setSearchParams(params, { replace: true })
  }

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const updateLoginField = (field) => (e) => {
    setLoginForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRegisterError('')

    if (form.password.length < 8) {
      setRegisterError('Password must be at least 8 characters long.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setRegisterError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setRegisterError('Please accept the Terms & Conditions to continue.')
      return
    }

    setRegisterLoading(true)
    try {
      const user = await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      })

      // College, phone, bio, resume, etc. are collected later from the
      // ambassador dashboard, not at registration time.
      navigate(roleHome(user), { replace: true })
    } catch (err) {
      const message = friendlyErrorMessage(err)
      setRegisterError(message)
      showError(message)
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const user = await login({ email: loginForm.email, password: loginForm.password })
      navigate(roleHome(user), { replace: true })
    } catch (err) {
      const message = friendlyErrorMessage(err)
      setLoginError(message)
      showError(message)
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <>
      <PageHero
        crumbLabel="Campus Ambassador"
        titleLine1="Lead the Titans."
        titleAccent="Shape the Future."
        subtitle="Join our Campus Ambassador Program and represent Tezpur Titans on your campus. Build your leadership skills, create impact, and unlock exclusive rewards."
      />

      <div className="container">
        <section className="campus-register">
          <div className="register-card">
            <div className="auth-tabs" role="tablist" aria-label="Campus Ambassador Access">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                className={`auth-tabs__btn${activeTab === 'login' ? ' is-active' : ''}`}
                onClick={() => switchTab('login')}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                className={`auth-tabs__btn${activeTab === 'register' ? ' is-active' : ''}`}
                onClick={() => switchTab('register')}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' ? (
              <>
                <p className="eyebrow">Campus Ambassador Program</p>
                <h2 className="register-card__title">
                  Welcome <span>Back</span>
                </h2>
                <p className="register-card__sub">
                  Login with your registered email or phone number to access your dashboard.
                </p>

                <form onSubmit={handleLoginSubmit} noValidate>
                  {loginError && (
                    <p className="form-alert" role="alert">
                      <AlertCircle size={15} strokeWidth={1.8} aria-hidden="true" />
                      {loginError}
                    </p>
                  )}

                  <label className="field field--full">
                    <span className="field__icon" aria-hidden="true">
                      <Mail size={17} strokeWidth={1.8} />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={loginForm.email}
                      onChange={updateLoginField('email')}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="field field--full">
                    <span className="field__icon" aria-hidden="true">
                      <Lock size={17} strokeWidth={1.8} />
                    </span>
                    <input
                      type="password"
                      placeholder="Password *"
                      value={loginForm.password}
                      onChange={updateLoginField('password')}
                      autoComplete="current-password"
                      required
                    />
                  </label>

                  <div className="login-row">
                    <label className="form-check form-check--inline">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <a className="login-row__forgot" href="#forgot-password">
                      Forgot Password?
                    </a>
                  </div>

                  <button className="btn btn-primary btn-block" type="submit" disabled={loginLoading}>
                    {loginLoading ? 'Logging in…' : 'Login'}
                  </button>

                  <p className="register-card__secure">
                    <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />
                    Your information is safe with us and will never be shared.
                  </p>

                  <p className="auth-switch">
                    New to the program?{' '}
                    <button type="button" className="auth-switch__link" onClick={() => switchTab('register')}>
                      Register now
                    </button>
                  </p>
                </form>
              </>
            ) : (
              <>
                <p className="eyebrow">Campus Ambassador Program</p>
                <h2 className="register-card__title">
                  Register <span>Now</span>
                </h2>
                <p className="register-card__sub">
                  Create your account in a few seconds — you can complete your ambassador
                  application from the dashboard right after.
                </p>

            <form onSubmit={handleSubmit} noValidate>
              {registerError && (
                <p className="form-alert" role="alert">
                  <AlertCircle size={15} strokeWidth={1.8} aria-hidden="true" />
                  {registerError}
                </p>
              )}

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <User size={17} strokeWidth={1.8} />
                </span>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.fullName}
                  onChange={updateField('fullName')}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <Mail size={17} strokeWidth={1.8} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={updateField('email')}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <Lock size={17} strokeWidth={1.8} />
                </span>
                <input
                  type="password"
                  placeholder="Password (min 8 characters) *"
                  value={form.password}
                  onChange={updateField('password')}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label className="field field--full">
                <span className="field__icon" aria-hidden="true">
                  <Lock size={17} strokeWidth={1.8} />
                </span>
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label className="form-check">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <a href="#terms">Terms &amp; Conditions</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>

              <button className="btn btn-primary btn-block" type="submit" disabled={registerLoading}>
                {registerLoading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="register-card__sub" style={{ marginTop: 4 }}>
                You can add your college, phone, resume and other details from your
                dashboard right after you sign up.
              </p>

              <p className="register-card__secure">
                <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />
                Your information is safe with us and will never be shared.
              </p>

              <p className="auth-switch">
                Already registered?{' '}
                <button type="button" className="auth-switch__link" onClick={() => switchTab('login')}>
                  Login
                </button>
              </p>
            </form>
              </>
            )}
          </div>

          <aside className="register-aside">
            <p className="eyebrow">Why Join Us?</p>
            <h3 className="register-aside__title">Ambassador Benefits</h3>

            <ul className="benefit-list">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="benefit-list__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                </li>
              ))}
            </ul>

            <div className="contact-box">
              <p className="contact-box__title">Have Questions?</p>
              <p className="contact-box__text">
                We&rsquo;re here to help! Reach out to us anytime.
              </p>
              <a className="contact-box__link" href="mailto:ambassador@tezpurtitans.com">
                <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
                ambassador@tezpurtitans.com
              </a>
            </div>
          </aside>
        </section>
      </div>
    </>
  )
}
