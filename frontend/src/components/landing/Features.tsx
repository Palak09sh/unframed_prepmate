const features = [
  {
    title: 'Adaptive follow-ups',
    body: 'The interviewer reacts to your actual answers — drilling in where you are vague, not reading a scripted quiz.',
  },
  {
    title: 'Built on your curriculum',
    body: 'Questions are grounded in what you actually studied, prioritized by your weak spots — skipped missions and high-attempt days.',
  },
  {
    title: 'Structured feedback',
    body: 'A clear summary, strengths, gaps, and suggested next steps the moment the interview wraps.',
  },
  {
    title: 'Instant and unlimited',
    body: 'No scheduling, no waitlists. Start a practice interview anytime and run as many as you like.',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-b border-rule">
      <div className="grid lg:grid-cols-12">
        <div className="px-6 py-16 sm:px-10 sm:py-24 lg:col-span-4 lg:border-r lg:px-16">
          <p className="font-display italic text-ink-muted">
            Why practice here
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
            An interview that knows what you actually studied
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink-muted">
            Every question is derived from the curriculum and your own progress
            data — nothing generic, nothing out of nowhere.
          </p>
        </div>

        <div className="lg:col-span-8">
          {features.map(({ title, body }, i) => (
            <div
              key={title}
              className="grid gap-3 border-b border-rule px-6 py-10 last:border-b-0 sm:grid-cols-12 sm:gap-6 sm:px-10 lg:px-14"
            >
              <p className="font-display text-sm italic text-accent sm:col-span-2">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display text-xl font-medium sm:col-span-4">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted sm:col-span-6">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
