import Cta from '../components/landing/Cta'
import Faq from '../components/landing/Faq'
import Features from '../components/landing/Features'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Navbar from '../components/landing/Navbar'

interface LandingProps {
  onStart: () => void
  onDashboard: () => void
}

export default function Landing({ onStart, onDashboard }: LandingProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar onStart={onStart} onDashboard={onDashboard} />
      <main className="flex-1">
        <Hero onStart={onStart} />
        <Features />
        <HowItWorks />
        <Faq />
        <Cta onStart={onStart} />
      </main>
      <Footer />
    </div>
  )
}
