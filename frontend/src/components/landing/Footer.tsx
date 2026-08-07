export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-sm"
            >
              🎙️
            </span>
            AI Interview
          </div>
          <p className="mt-3 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            AI-powered technical interview practice with structured, actionable
            feedback.
          </p>
        </div>

        <nav className="flex gap-16 text-sm">
          <div>
            <p className="mb-3 font-medium">Product</p>
            <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
              <li>
                <a href="#features" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-zinc-200 py-5 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        Built for the ABTalks Hackathon · Powered by Claude
      </div>
    </footer>
  )
}
