import { useEffect, useRef, useState } from 'react'
import './Header.css'

const navLinks = [
  { label: 'Home', href: '/', active: true },
  { label: 'Team', href: '/#team' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'News', href: '/#news' },
  { label: 'Community', href: '/#community' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  const close = () => setOpen(false)

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape, and on click outside the header
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) close()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container site-header__inner">
        <div className="header-right">
          <div className={`nav-backdrop ${open ? 'nav-backdrop--open' : ''}`} onClick={close} />

          <nav
            className={`nav ${open ? 'nav--open' : ''}`}
            aria-label="Primary"
            aria-hidden={!open}
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a className={link.active ? 'is-active' : ''} href={link.href} onClick={close}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <button className="btn btn-primary btn-block nav-cta" type="button" onClick={close}>
              Join the Titans
            </button>
          </nav>

          <button className="btn btn-primary header-cta" type="button">
            Join the Titans
          </button>

          <button
            className={`nav-toggle ${open ? 'nav-toggle--open' : ''}`}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
