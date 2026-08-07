import { useState } from 'react'
import Interview from './pages/Interview'
import Landing from './pages/Landing'

export default function App() {
  const [view, setView] = useState<'landing' | 'interview'>('landing')

  if (view === 'interview') {
    return <Interview onExit={() => setView('landing')} />
  }

  return <Landing onStart={() => setView('interview')} />
}
