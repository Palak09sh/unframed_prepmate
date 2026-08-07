const faqs = [
  {
    q: 'How does the AI know what to ask me?',
    a: 'The interviewer is given your curriculum and learning history (missions attempted, passed, or skipped) and prioritizes the days you struggled with — high-attempt or skipped missions are probed first.',
  },
  {
    q: 'How many questions will I get?',
    a: 'A minimum of eight technical questions spanning at least four curriculum days, with adaptive follow-ups based on your answers.',
  },
  {
    q: 'Will the questions feel like a real interview?',
    a: 'That is the goal. The interviewer reacts to what you say — asking follow-ups, switching topics, and wrapping up naturally — rather than reading a fixed script.',
  },
  {
    q: 'What happens when I finish?',
    a: 'You get structured feedback: a summary, your strengths, the gaps the interview surfaced, and suggested next steps.',
  },
  {
    q: 'Do I need to prepare anything?',
    a: 'No. Just pick a profile and start typing your answers. Your responses are compared against your own learning history, so there is nothing to set up.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
                >
                  ＋
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
