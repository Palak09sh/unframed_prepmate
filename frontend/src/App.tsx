import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import Landing from './pages/Landing'

type View = 'landing' | 'interview' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('landing')

  if (view === 'interview') {
    return (
      <Interview onExit={() => setView('landing')} onDashboard={() => setView('dashboard')} />
    )
  }

  if (view === 'dashboard') {
    return (
      <Dashboard onExit={() => setView('landing')} onStart={() => setView('interview')} />
    )
  }

  return (
    <Landing
      onStart={() => setView('interview')}
      onDashboard={() => setView('dashboard')}
    />
  )
}
