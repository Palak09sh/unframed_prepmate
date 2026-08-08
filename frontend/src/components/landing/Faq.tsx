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
    <section id="faq" className="border-b border-rule">
      <div className="grid lg:grid-cols-12">
        <div className="px-6 py-16 sm:px-10 sm:py-24 lg:col-span-4 lg:border-r lg:px-16">
          <p className="font-display italic text-ink-muted">
            Questions &amp; answers
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            Frequently asked
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">
            Everything candidates usually ask before starting their first
            practice interview.
          </p>
        </div>

        <div className="px-6 py-16 sm:px-10 sm:py-24 lg:col-span-8 lg:px-14">
          <div>
            {faqs.map(({ q, a }, i) => (
              <details
                key={q}
                className="group border-b border-rule first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium [&::-webkit-details-marker]:hidden">
                  <span className="flex gap-4">
                    <span className="font-display text-sm italic text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{q}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink-faint transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pl-8 text-sm leading-relaxed text-ink-muted">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
