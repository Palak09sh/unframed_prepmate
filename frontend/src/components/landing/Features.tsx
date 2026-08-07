const features = [
  {
    icon: '🧠',
    title: 'Adaptive follow-ups',
    body: 'The interviewer reacts to your actual answers — drilling in where you are vague, not just reading a scripted quiz.',
  },
  {
    icon: '📚',
    title: 'Built on your curriculum',
    body: 'Questions are grounded in what you actually studied, prioritized by your weak spots — skipped missions and high-attempt days.',
  },
  {
    icon: '📋',
    title: 'Structured feedback',
    body: 'Get a clear summary, strengths, gaps, and suggested next steps the moment the interview wraps.',
  },
  {
    icon: '⚡',
    title: 'Instant and unlimited',
    body: 'No scheduling, no waitlists. Start a practice interview anytime and run as many as you like.',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight">Why practice here</h2>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          A realistic technical interview that knows your learning history and
          targets exactly what you need to work on.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map(({ icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-xl dark:bg-indigo-950"
              >
                {icon}
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
