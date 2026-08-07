import type { Candidate } from '../lib/types'

export default function EmptyState({ candidate }: { candidate: Candidate }) {
  const skipped = candidate.missions
    .filter((m) => 'skipped' in m && m.skipped)
    .map((m) => m.title)

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-600 text-3xl">
          🎙️
        </div>
        <h2 className="mb-2 text-lg font-semibold">Your interview is ready</h2>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {candidate.member.role} with {candidate.member.experience} year
          {candidate.member.experience === 1 ? '' : 's'} of experience. The
          interviewer will probe your weakest areas
          {skipped.length > 0 ? (
            <>
              {' '}
              — including <span className="font-medium">{skipped.join(', ')}</span>
            </>
          ) : (
            ''
          )}
          .
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="size-1.5 animate-pulse rounded-full bg-indigo-500" />
          Starting now…
        </div>
      </div>
    </div>
  )
}
