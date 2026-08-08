export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl font-medium tracking-tight">
            The Interview
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            AI-powered technical interview practice with structured, actionable
            feedback.
          </p>
        </div>

        <nav className="flex gap-16 text-sm">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
              Product
            </p>
            <ul className="space-y-3 text-ink-muted">
              <li>
                <a href="#features" className="transition-colors hover:text-rust">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-rust">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-rust">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-rule py-5 text-center text-xs text-ink-faint">
        The Interview · Built for the ABTalks Hackathon · Powered by Claude
      </div>
    </footer>
  )
}
