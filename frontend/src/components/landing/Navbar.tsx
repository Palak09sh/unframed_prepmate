import ThemeToggle from '../ThemeToggle'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
]

interface NavbarProps {
  onStart: () => void
  onDashboard: () => void
}

export default function Navbar({ onStart, onDashboard }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur">
      <nav className="flex h-16 items-center gap-6 px-6 sm:px-10 lg:px-16">
        <a href="#top" className="font-display text-xl font-medium tracking-tight">
          The Interview
        </a>

        <div className="ml-auto hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted md:flex">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={onDashboard}
            className="transition-colors hover:text-accent"
          >
            Dashboard
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={onStart}
            className="bg-accent px-4 py-2 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-deep"
          >
            Start the interview
          </button>
        </div>
      </nav>
    </header>
  )
}
