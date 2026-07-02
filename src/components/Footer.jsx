import { useState } from 'react'
import './Footer.css'

const columns = [
  {
    title: 'Quick Links',
    links: ['Home', 'Team', 'Gallery', 'News', 'Campus Ambassador', 'Contact'],
  },
  {
    title: 'Community',
    links: ['Become a Volunteer', 'Fan Zone', 'Partners', 'Events'],
  },
  {
    title: 'Help',
    links: ['FAQs', 'Terms & Conditions', 'Privacy Policy'],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="site-footer" id="contact">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__top">
            <img src="/assets/logo.png" alt="Tezpur Titans" className="site-footer__mark" />
            <p className="site-footer__tagline">
              Built for the Brave. Driven by Passion. United by Pride.
            </p>
          </div>

          <div className="site-footer__social">
            <a href="#instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.5 8.5h2V5.6c-.35-.05-1.55-.16-2.95-.16-2.92 0-4.92 1.84-4.92 5.2v2.66H6.3v3.3h2.83V21h3.32v-7.4h2.72l.43-3.3h-3.15v-2.3c0-.96.26-1.5 1.55-1.5z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a href="#twitter" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 4.5h3.6l4 5.45 4.6-5.45H19l-6.1 7.15L19.5 19.5h-3.6l-4.3-5.85-4.95 5.85H4.4l6.5-7.65L5 4.5z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a href="#youtube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.6 7.8a2.5 2.5 0 0 0-1.76-1.77C17.3 5.6 12 5.6 12 5.6s-5.3 0-6.84.43A2.5 2.5 0 0 0 3.4 7.8 26 26 0 0 0 3 12a26 26 0 0 0 .4 4.2 2.5 2.5 0 0 0 1.76 1.77c1.54.43 6.84.43 6.84.43s5.3 0 6.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 21 12a26 26 0 0 0-.4-4.2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M10.3 9.6 14.9 12l-4.6 2.4V9.6z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div className="site-footer__col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="site-footer__col site-footer__newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe for the latest updates and announcements.</p>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault()
              setEmail('')
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer__bottom container">
        <p>© 2025 Tezpur Titans. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
