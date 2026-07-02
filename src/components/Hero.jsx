import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <img className="hero__bg" src="/assets/stadium_hero.png" alt="Tezpur Titans home stadium at dusk" />
      <div className="hero__scrim" />

      <img className="hero__logo" src="/assets/logo.png" alt="Tezpur Titans" />

      <div className="container hero__content">
        <p className="eyebrow">Welcome to Tezpur Titans</p>
        <h1 className="hero__title">
          Built for <br />
          the <span>Brave.</span>
        </h1>
        <p className="hero__subtitle">
          The official home of Tezpur Titans—where passion, performance, and pride come together
          to build a lasting legacy.
        </p>

        <div className="hero__actions">
          <button className="btn btn-primary" type="button">
            Explore the Team <span aria-hidden="true">→</span>
          </button>
          <button className="btn btn-outline" type="button">
            Join the Titans
          </button>
        </div>
        <div className="hero__card">
          <img src='/assets/icons/people_icon.png' className="hero__card-icon" aria-hidden="true" alt="icon" />
            
          <h3>A New Era of Cricket</h3>
          <p>Uniting talent, culture and community to shape the future of cricket in Tezpur.</p>
        </div>
      </div>

      
    </section>
  )
}
