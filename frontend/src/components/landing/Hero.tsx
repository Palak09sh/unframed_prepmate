export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section
      id="top"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
            A calmer way to practice
          </p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Your technical interview, conducted by an interviewer who reads your
            history
          </h1>
          <div className="mt-6 h-px w-16 bg-rust" />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            The AI probes your actual weak spots — the missions you skipped or
            struggled with — asks adaptive follow-ups, and closes with
            structured feedback. No scheduling, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStart}
              className="border border-rule-strong bg-rust px-6 py-3 text-sm font-medium text-paper-raised transition-colors hover:bg-rust-deep"
            >
              Start your interview
            </button>
            <a
              href="#how-it-works"
              className="border border-rule px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-sunk"
            >
              How it works
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <li>8+ questions</li>
            <li>Adaptive follow-ups</li>
            <li>Structured feedback</li>
          </ul>
        </div>

        {/* Static Q&A preview */}
        <div
          aria-hidden="true"
          className="border border-rule bg-paper-raised p-6 shadow-[0_1px_0_var(--rule)]"
        >
          <div className="mb-5 flex items-center justify-between border-b border-rule pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full border border-rule-strong bg-rust font-display text-sm font-semibold text-paper-raised">
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
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="max-w-[90%]">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-rust">
                Q.
              </p>
              <div className="border-l-2 border-rule-strong pl-3 text-ink">
                I see you attempted the RAG fundamentals mission a few times.
                Let&apos;s start there — walk me through a RAG pipeline.
              </div>
            </div>
            <div className="ml-auto max-w-[90%]">
              <p className="mb-1 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                A.
              </p>
              <div className="bg-ink px-3 py-2.5 text-right text-paper-raised">
                Sure — embed and index the docs, retrieve relevant chunks, pass
                them to the model with the question.
              </div>
            </div>
            <div className="max-w-[90%]">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-rust">
                Q.
              </p>
              <div className="border-l-2 border-rule-strong pl-3 text-ink">
                Good. Now, how would you choose a chunk size?
              </div>
            </div>
            <div className="ml-auto max-w-[90%]">
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
    </section>
  )
}
