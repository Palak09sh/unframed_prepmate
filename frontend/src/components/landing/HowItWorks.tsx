const steps = [
  {
    step: '1',
    title: 'Pick a profile',
    body: 'Choose a candidate whose learning history you want to be quizzed on.',
  },
  {
    step: '2',
    title: 'Get interviewed',
    body: 'Answer adaptive questions across your weakest curriculum areas — the interviewer follows your leads.',
  },
  {
    step: '3',
    title: 'Read your feedback',
    body: 'Walk away with strengths, gaps, and concrete next steps to study.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
      <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Three steps from landing to actionable feedback.
      </p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map(({ step, title, body }) => (
          <li key={step} className="relative">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              {step}
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
