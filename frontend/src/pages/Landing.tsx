import Cta from '../components/landing/Cta'
import Faq from '../components/landing/Faq'
import Features from '../components/landing/Features'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Navbar from '../components/landing/Navbar'

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar onStart={onStart} />
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
