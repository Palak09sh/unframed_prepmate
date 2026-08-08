import ThemeToggle from '../ThemeToggle'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-xl font-medium tracking-tight">
          The Interview
        </a>

        <div className="ml-auto hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted sm:flex">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-rust"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={onStart}
            className="border border-rule-strong bg-rust px-4 py-2 text-sm font-medium text-paper-raised transition-colors hover:bg-rust-deep"
          >
            Start the interview
          </button>
        </div>
      </nav>
    </header>
  )
}
