import type { Candidate } from '../lib/types'

interface CandidatePickerProps {
  candidates: Candidate[]
  onSelect: (candidate: Candidate) => void
}

function weakSpots(candidate: Candidate) {
  const skipped = candidate.missions.filter((m) => 'skipped' in m).length
  const struggled = candidate.missions.filter(
    (m) => 'attempts' in m && m.attempts >= 3,
  ).length
  return { skipped, struggled }
}

export default function CandidatePicker({
  candidates,
  onSelect,
}: CandidatePickerProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-indigo-600 text-3xl">
          🎙️
        </div>
        <h2 className="text-lg font-semibold">Who&apos;s being interviewed?</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Pick a candidate to start their interview.
        </p>
      </div>

      <div className="grid w-full max-w-md gap-3">
        {candidates.map((candidate) => {
          const { skipped, struggled } = weakSpots(candidate)
          return (
            <button
              key={`${candidate.member.role}-${candidate.member.experience}`}
              type="button"
              onClick={() => onSelect(candidate)}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-indigo-500 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{candidate.member.role}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {candidate.member.experience} year
                  {candidate.member.experience === 1 ? '' : 's'} ·{' '}
                  {candidate.signals.missionsCompleted} missions completed ·{' '}
                  {candidate.signals.commitDays} commit days
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skipped > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {skipped} skipped
                    </span>
                  )}
                  {struggled > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800 dark:bg-red-950 dark:text-red-300">
                      {struggled} high-attempt
                    </span>
                  )}
                  {skipped === 0 && struggled === 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      balanced profile
                    </span>
                  )}
                </div>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 text-lg text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
              >
                →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
