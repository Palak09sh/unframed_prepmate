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
    <section className="border-t border-rule bg-paper-raised/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
          Why practice here
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight">
          An interview that knows what you actually studied
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
          {features.map(({ title, body }) => (
            <div key={title} className="bg-paper-raised p-7">
              <h3 className="font-display text-xl font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
