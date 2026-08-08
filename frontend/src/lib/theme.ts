export type Theme = 'light' | 'dark'

export function getStoredTheme(): Theme | null {
  const saved = localStorage.getItem('theme')
  return saved === 'light' || saved === 'dark' ? saved : null
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getCurrentTheme(): Theme {
  return (
    getStoredTheme() ??
    (document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light')
  )
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
