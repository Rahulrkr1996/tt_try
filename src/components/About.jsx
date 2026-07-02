import { useEffect, useRef, useState } from 'react'
import './About.css'

const pillars = [
  {
    icon: '/assets/icons/flag_icon.png',
    title: 'Our Vision',
    text: 'To build a competitive cricketing franchise that inspires generations and puts Tezpur on the map.',
  },
  {
    icon: '/assets/icons/dartboard_icon.png',
    title: 'Our Mission',
    text: 'To nurture local talent, promote the sport at the grassroots level, and create opportunities for growth.',
  },
  {
    icon: '/assets/icons/people_icon.png',
    title: 'Our Values',
    text: 'Discipline. Unity. Respect. Passion. These values shape everything we do.',
  },
  {
    icon: '/assets/icons/shake_icon.png',
    title: 'Our Promise',
    text: 'To play with passion, act with integrity, and represent Tezpur with pride in everything we do.',
  },
]

function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.15, ...options }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, inView]
}

export default function About() {
  const [sectionRef, inView] = useInView()

  return (
    <section
      className={`about${inView ? ' in-view' : ''}`}
      id="team"
      ref={sectionRef}
    >
      {/* ── Animated background layer ── */}
      <div className="about__bg" aria-hidden="true">
        <div className="about__orb about__orb--1" />
        <div className="about__orb about__orb--2" />
        <div className="about__orb about__orb--3" />
        <div className="about__pulse" />
        <div className="about__pulse about__pulse--2" />
        <div className="about__streak" />
        <div className="about__grain" />
        <div className="about__vignette" />
      </div>

      <div className="about__copy">
        <p className="eyebrow">About Us</p>
        <h2 className="about__title">
          <span className="about__title-line">
            <span>One Team.</span>
          </span>
          <br />
          <span className="about__title-line">
            <span>One Identity.</span>
          </span>
        </h2>
        <p className="about__text">
          Tezpur Titans is a newly established cricket franchise with a mission to develop talent,
          inspire communities, and bring pride to Tezpur and beyond.
        </p>
        <p className="about__text">
          We are more than a team — we are a movement driven by discipline, unity, and the spirit
          of our people.
        </p>
        <a className="about__link" href="#story">
          Discover Our Story <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="about__emblem">
        <img src="/assets/spartan.png" alt="Tezpur Titans Spartan emblem" />
      </div>

      <div className="about__pillars">
        {pillars.map((p, i) => (
          <div className="pillar" key={p.title}>
            <img src={p.icon} className="pillar__icon" aria-hidden="true" alt="icon" />
            <div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
            {i < pillars.length - 1 && <div className="pillar__divider" />}
          </div>
        ))}
      </div>
    </section>
  )
}