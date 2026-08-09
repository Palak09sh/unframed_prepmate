export default function Cta({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-ink text-paper">
      <div className="flex flex-col items-center px-6 py-20 text-center sm:px-10 sm:py-28">
        <p className="font-display italic text-accent">
          Your turn
        </p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
          Ready to see how you&apos;d do?
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-paper/70">
          Start a practice interview now and get personalized, structured
          feedback in minutes.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-9 bg-accent px-6 py-2.5 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-deep"
        >
          Start your interview
        </button>
      </div>
    </section>
  )
}
