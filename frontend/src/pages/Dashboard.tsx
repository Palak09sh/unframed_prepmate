import ThemeToggle from '../components/ThemeToggle'

/**
 * Demo data, shaped like what the backend feedback would accumulate. Real
 * wiring to persisted sessions is out of scope (sessions are in-memory).
 */
const SESSIONS = [
  {
    id: '1',
    date: 'Aug 8, 2026',
    role: 'AI Engineer',
    questions: 10,
    score: 74,
    days: ['Day 5 · RAG', 'Day 8 · Agents'],
  },
  {
    id: '2',
    date: 'Aug 5, 2026',
    role: 'Web Developer',
    questions: 9,
    score: 68,
    days: ['Day 6 · Accessibility', 'Day 9 · Performance'],
  },
  {
    id: '3',
    date: 'Jul 31, 2026',
    role: 'Data Scientist',
    questions: 8,
    score: 81,
    days: ['Day 13 · MLOps', 'Day 16 · Storytelling'],
  },
]

const avgScore = Math.round(
  SESSIONS.reduce((sum, s) => sum + s.score, 0) / SESSIONS.length,
)

interface DashboardProps {
  onExit: () => void
  onStart: () => void
}

export default function Dashboard({ onExit, onStart }: DashboardProps) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur">
        <nav className="flex h-16 items-center gap-6 px-6 sm:px-10 lg:px-16">
          <button
            type="button"
            onClick={onExit}
            className="font-display text-xl font-medium tracking-tight transition-colors hover:text-accent"
          >
            PrepMate
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="bg-accent px-4 py-2 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-deep"
            >
              Start practice
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display italic text-ink-muted">
              Dashboard
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Your practice, at a glance
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              Three sessions in. Your score is trending up, but RAG retrieval
              keeps coming back as a gap — make it the focus of your next run.
            </p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="bg-accent px-6 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-deep"
          >
            New interview
          </button>
        </div>

        {/* Key numbers — accent only on the one number that matters most */}
        <div className="mt-12 grid grid-cols-2 border-t border-rule lg:grid-cols-4">
          <div className="border-b border-r border-rule px-6 py-7 sm:px-8 lg:border-b-0">
            <p className="font-display text-4xl font-medium tracking-tight">
              {SESSIONS.length}
            </p>
            <p className="mt-2 text-sm text-ink-muted">sessions completed</p>
          </div>
          <div className="border-b border-rule px-6 py-7 sm:px-8 lg:border-b-0">
            <p className="font-display text-4xl font-medium tracking-tight text-accent">
              {avgScore}
            </p>
            <p className="mt-2 text-sm text-ink-muted">average score</p>
          </div>
          <div className="border-b border-r border-rule px-6 py-7 sm:px-8 lg:border-b-0">
            <p className="font-display text-4xl font-medium tracking-tight">4</p>
            <p className="mt-2 text-sm text-ink-muted">curriculum days covered</p>
          </div>
          <div className="border-b border-rule px-6 py-7 sm:px-8 lg:border-b-0">
            <p className="font-display text-4xl font-medium tracking-tight text-ink">
              RAG
            </p>
            <p className="mt-2 text-sm text-ink-muted">weakest area</p>
          </div>
        </div>

        {/* Score over time */}
        <section className="mt-16 border-t border-rule pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">
              Score over sessions
            </h2>
            <p className="text-sm text-ink-muted">
              Latest run highlighted
            </p>
          </div>
          <div className="mt-8 flex h-44 items-end gap-6 border-b border-rule pb-6 sm:gap-10">
            {SESSIONS.map((s, i) => {
              const latest = i === SESSIONS.length - 1
              return (
                <div key={s.id} className="flex h-full flex-1 flex-col justify-end">
                  <p className="mb-2 text-center font-display text-sm font-medium">
                    {s.score}
                  </p>
                  <div
                    className={`w-full ${latest ? 'bg-accent' : 'bg-ink'}`}
                    style={{ height: `${s.score}%` }}
                    title={`${s.role} · ${s.score}`}
                  />
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    {s.date.split(',')[0]}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Past sessions */}
        <section className="mt-16 border-t border-rule pt-10">
          <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">
            Past sessions
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                  <th className="pb-3 pr-6 font-medium">Date</th>
                  <th className="pb-3 pr-6 font-medium">Profile</th>
                  <th className="pb-3 pr-6 font-medium">Questions</th>
                  <th className="pb-3 pr-6 font-medium">Days covered</th>
                  <th className="pb-3 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {SESSIONS.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-rule transition-colors hover:bg-paper-sunk"
                  >
                    <td className="py-4 pr-6 text-ink-muted">{s.date}</td>
                    <td className="py-4 pr-6 font-medium">{s.role}</td>
                    <td className="py-4 pr-6 text-ink-muted">{s.questions}</td>
                    <td className="py-4 pr-6 text-ink-muted">{s.days.join(' · ')}</td>
                    <td className="py-4 text-right font-display text-lg font-medium">
                      {s.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
