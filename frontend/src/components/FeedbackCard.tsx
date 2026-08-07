import type { Feedback } from '../lib/types'

function Section({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'strengths' | 'gaps' | 'next'
}) {
  const dotColor =
    tone === 'strengths'
      ? 'bg-emerald-500'
      : tone === 'gaps'
        ? 'bg-amber-500'
        : 'bg-indigo-500'

  return (
    <section>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dotColor}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-1 text-base font-semibold">Interview feedback</h3>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {feedback.summary}
      </p>
      <div className="grid gap-5 sm:grid-cols-3">
        <Section title="Strengths" items={feedback.strengths} tone="strengths" />
        <Section title="Gaps" items={feedback.gaps} tone="gaps" />
        <Section title="Suggested next steps" items={feedback.next} tone="next" />
      </div>
    </div>
  )
}
