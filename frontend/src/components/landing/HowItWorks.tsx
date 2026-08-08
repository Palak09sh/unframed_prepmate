const steps = [
  {
    title: 'Pick a profile',
    body: 'Choose a candidate whose learning history you want to be quizzed on.',
  },
  {
    title: 'Get interviewed',
    body: 'Answer adaptive questions across your weakest curriculum areas — the interviewer follows your leads.',
  },
  {
    title: 'Read your feedback',
    body: 'Walk away with strengths, gaps, and concrete next steps to study.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
        How it works
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
        Three steps to actionable feedback
      </h2>
      <ol className="mt-12 grid gap-12 sm:grid-cols-3">
        {steps.map(({ title, body }, i) => (
          <li key={title} className="border-t-2 border-rule-strong pt-5">
            <p className="font-display text-sm italic text-rust">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-display text-xl font-medium">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
