import { useState } from 'react'
import { applyTheme, getCurrentTheme } from '../lib/theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getCurrentTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex size-9 items-center justify-center rounded-full border border-rule text-base text-ink transition-colors hover:bg-paper-sunk"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
