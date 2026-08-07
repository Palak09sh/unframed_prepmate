export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            Powered by Claude
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Practice your technical interview, guided by AI
          </h1>
          <p className="mt-5 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            An AI interviewer probes your actual weak spots — based on your
            learning history — asks adaptive follow-ups, and delivers structured
            feedback. No scheduling, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStart}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Start your interview
            </button>
            <a
              href="#how-it-works"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              How it works
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>✓ 8+ questions</li>
            <li>✓ Adaptive follow-ups</li>
            <li>✓ Structured feedback</li>
          </ul>
        </div>

        {/* Static chat preview */}
        <div
          aria-hidden="true"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div className="flex size-8 items-center justify-center rounded-full bg-indigo-600 text-sm">
              🎙️
            </div>
            <div>
              <p className="text-sm font-medium">AI Interviewer</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Live</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              I see you attempted the RAG fundamentals mission a few times.
              Let&apos;s start there — walk me through a RAG pipeline.
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-white">
              Sure — you embed and index the docs, then retrieve relevant chunks
              and pass them to the model with the question.
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              Good. Now, how would you choose a chunk size for retrieval?
            </div>
            <div className="ml-auto flex justify-end rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-white">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-white/70" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
