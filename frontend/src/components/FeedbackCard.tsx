import type { Feedback } from '../lib/types'

const SECTIONS: {
  key: 'strengths' | 'gaps' | 'next'
  title: string
  icon: string
  accent: string
  dot: string
}[] = [
  {
    key: 'strengths',
    title: 'Strengths',
    icon: '✅',
    accent: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  {
    key: 'gaps',
    title: 'Areas to improve',
    icon: '🔧',
    accent: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  {
    key: 'next',
    title: 'Suggested next steps',
    icon: '🚀',
    accent: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
  },
]

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="animate-message-in rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h3 className="text-base font-semibold">Interview feedback</h3>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {feedback.summary}
      </p>
      <div className="grid gap-5 sm:grid-cols-3">
        {SECTIONS.map(({ key, title, icon, accent, dot }) => (
          <section key={key}>
            <h4 className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${accent}`}>
              <span aria-hidden="true">{icon}</span>
              {title}
            </h4>
            <ul className="space-y-1.5">
              {feedback[key].map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span aria-hidden="true" className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
