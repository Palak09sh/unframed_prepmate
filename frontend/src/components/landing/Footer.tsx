export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="grid gap-10 px-6 py-14 sm:grid-cols-3 sm:px-10 lg:px-16">
        <div>
          <p className="font-display text-xl font-medium tracking-tight">
            PrepMate
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            AI-powered technical interview practice with structured, actionable
            feedback.
          </p>
        </div>

        <nav className="text-sm">
          <p className="mb-4 font-display text-sm italic text-ink-faint">
            Product
          </p>
          <ul className="space-y-3 text-ink-muted">
            <li>
              <a href="#features" className="transition-colors hover:text-ink">
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-ink"
              >
                How it works
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-ink">
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-4 font-display text-sm italic text-ink-faint">
            Built for
          </p>
          <ul className="space-y-3 text-ink-muted">
            <li>ABTalks Hackathon</li>
            <li>Powered by Claude</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule px-6 py-5 text-xs text-ink-faint sm:px-10 lg:px-16">
        <span>PrepMate</span>
        <span>© 2026 · PrepMate</span>
      </div>
    </footer>
  )
}
