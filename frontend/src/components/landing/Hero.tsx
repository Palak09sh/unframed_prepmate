const stats = [
  { value: '8+', label: 'questions per interview' },
  { value: '4+', label: 'curriculum days covered' },
  { value: 'Adaptive', label: 'follow-ups, not a script' },
  { value: '0', label: 'scheduling or waitlists' },
]

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="border-b border-rule">
      <div className="grid lg:grid-cols-12">
        {/* Headline column */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-24 lg:col-span-7 lg:px-16">
          <p className="font-display italic text-ink-muted">
            A calmer way to practice
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl">
            Your technical interview, run by an interviewer who reads your
            history
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            The AI probes the missions you skipped or struggled with, asks
            adaptive follow-ups, and closes with structured feedback. No
            scheduling, no pressure.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStart}
              className="bg-accent px-6 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-deep"
            >
              Start your interview
            </button>
            <a
              href="#how-it-works"
              className="link-underline py-2.5 text-sm font-medium text-ink"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Transcript column */}
        <div className="border-t border-rule px-6 py-16 sm:px-10 sm:py-24 lg:col-span-5 lg:border-l lg:border-t-0 lg:px-14">
          <div className="flex items-center justify-between border-b border-rule pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center bg-accent font-display text-sm font-semibold text-paper-raised">
                Q
              </div>
              <div>
                <p className="text-sm font-medium">The Interviewer</p>
                <p className="text-xs text-ink-muted">Live</p>
              </div>
            </div>
            <span className="text-xs uppercase tracking-[0.14em] text-ink-faint">
              Transcript
            </span>
          </div>

          <div aria-hidden="true" className="space-y-5 pt-6 text-sm leading-relaxed">
            <div className="max-w-[92%]">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                Q.
              </p>
              <div className="border-l-2 border-rule-strong pl-3 text-ink">
                I see you attempted the RAG fundamentals mission a few times.
                Let&apos;s start there — walk me through a RAG pipeline.
              </div>
            </div>
            <div className="ml-auto max-w-[92%]">
              <p className="mb-1 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                A.
              </p>
              <div className="bg-ink px-3 py-2.5 text-right text-paper-raised">
                Sure — embed and index the docs, retrieve relevant chunks, pass
                them to the model with the question.
              </div>
            </div>
            <div className="max-w-[92%]">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                Q.
              </p>
              <div className="border-l-2 border-rule-strong pl-3 text-ink">
                Good. Now, how would you choose a chunk size?
              </div>
            </div>
            <div className="ml-auto max-w-[92%]">
              <p className="mb-1 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                A.
              </p>
              <div className="flex items-center justify-end gap-1.5 bg-ink px-3 py-2.5">
                <span className="size-1.5 animate-bounce rounded-full bg-paper-raised/70 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-paper-raised/70 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-paper-raised/70" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data strip */}
      <div className="grid grid-cols-2 border-t border-rule lg:grid-cols-4">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="border-b border-rule px-6 py-7 last:border-b-0 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:last:border-r-0"
          >
            <p className="font-display text-3xl font-medium tracking-tight">
              {value}
            </p>
            <p className="mt-2 text-sm text-ink-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
