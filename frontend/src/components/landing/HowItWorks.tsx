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
    <section id="how-it-works" className="border-b border-rule">
      <div className="px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
        <p className="font-display italic text-ink-muted">
          How it works
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          Three steps to actionable feedback
        </h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-12">
          {steps.map(({ title, body }, i) => (
            <li key={title} className="border-t-2 border-rule-strong pt-6">
              <p className="font-display text-sm italic text-accent">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-xl font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
