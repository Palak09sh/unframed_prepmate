export default function Cta({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="border-2 border-ink px-6 py-14 text-center sm:px-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
          Your turn
        </p>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Ready to see how you&apos;d do?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-ink-muted">
          Start a practice interview now and get personalized, structured
          feedback in minutes.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 border border-ink bg-ink px-8 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-rust hover:border-rust"
        >
          Start your interview
        </button>
      </div>
    </section>
  )
}
