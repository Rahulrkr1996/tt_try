import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container">
        <About />
      </div>
    </>
  )
}
