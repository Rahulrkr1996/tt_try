import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Ambassador.css'

export default function Ambassador() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // The old inline sign-up form is gone — the whole section is now just a
  // call to action that sends people to the real campus login/register
  // page, where the actual form (and validation, and error handling) lives.
  const goToRegister = () => navigate('/campus/login')
  const goToLogin = () => navigate('/campus/login?tab=login')

  return (
    <section
      className={`ambassador-cta ${inView ? 'ambassador-cta--visible' : ''}`}
      id="ambassador"
      ref={sectionRef}
    >
      <img className="ambassador-cta__bg" src="/assets/stadium_hero.png" alt="" aria-hidden="true" />
      <div className="ambassador-cta__scrim" />

      <div className="ambassador-cta__content">
        <p className="eyebrow ambassador-cta__anim" style={{ '--delay': '0s' }}>
          Campus Ambassador Program · Write the Next Chapter
        </p>

        <h2 className="ambassador-cta__title ambassador-cta__anim" style={{ '--delay': '0.1s' }}>
          Join the
          <br />
          <span>Titans.</span>
        </h2>

        <p className="ambassador-cta__subtitle ambassador-cta__anim" style={{ '--delay': '0.2s' }}>
          Represent Tezpur Titans on your campus. Build the community, create impact, and
          unlock exclusive rewards — your journey starts with an account.
        </p>

        <div className="ambassador-cta__actions ambassador-cta__anim" style={{ '--delay': '0.3s' }}>
          <button className="btn btn-primary ambassador-cta__btn" type="button" onClick={goToRegister}>
            Become a Titan <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className="ambassador-cta__login-prompt ambassador-cta__anim" style={{ '--delay': '0.4s' }}>
          Already registered?{' '}
          <button type="button" className="ambassador-cta__login-link" onClick={goToLogin}>
            Login here
          </button>
        </p>
      </div>
    </section>
  )
}
