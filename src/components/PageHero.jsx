import { Link } from 'react-router-dom'
import './PageHero.css'

export default function PageHero({ crumbLabel, titleLine1, titleAccent, subtitle }) {
  return (
    <section className="page-hero">
      <img className="page-hero__bg" src="/assets/stadium_hero.png" alt="" />
      <div className="page-hero__scrim" />

      <div className="container page-hero__content">
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="is-current">{crumbLabel}</span>
        </nav>

        <h1 className="page-hero__title">
          {titleLine1} <span>{titleAccent}</span>
        </h1>

        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>
    </section>
  )
}
