import type { Feedback } from '../lib/types'

const SECTIONS: {
  key: 'strengths' | 'gaps' | 'next'
  title: string
  color: string
  marker: string
}[] = [
  { key: 'strengths', title: 'Strengths', color: 'text-olive', marker: '+' },
  { key: 'gaps', title: 'Areas to improve', color: 'text-danger', marker: '−' },
  { key: 'next', title: 'Suggested next steps', color: 'text-ink', marker: '→' },
]

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="animate-message-in border border-rule bg-paper-raised">
      <div className="border-b border-rule px-6 py-5">
        <p className="font-display text-sm italic text-ink-muted">
          Reporter&apos;s notes
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium leading-tight tracking-[-0.01em]">
          Interview feedback
        </h3>
      </div>
      <p className="border-l-2 border-accent px-6 py-5 text-sm leading-relaxed text-ink-muted">
        {feedback.summary}
      </p>
      <div className="grid divide-y divide-rule border-t border-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {SECTIONS.map(({ key, title, color, marker }) => (
          <section key={key} className="px-6 py-5">
            <h4
              className={`border-b border-rule pb-2 text-xs font-medium uppercase tracking-[0.14em] ${color}`}
            >
              {title}
            </h4>
            <ul className="mt-3 space-y-2.5">
              {feedback[key].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                >
                  <span aria-hidden="true" className={`shrink-0 font-display ${color}`}>
                    {marker}
                  </span>
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
