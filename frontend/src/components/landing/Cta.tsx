export default function Cta({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-14 text-center text-white sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-white/10"
        />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see how you&apos;d do?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Start a practice interview now and get personalized, structured
            feedback in minutes.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
          >
            Start your interview
          </button>
        </div>
      </div>
    </section>
  )
}
