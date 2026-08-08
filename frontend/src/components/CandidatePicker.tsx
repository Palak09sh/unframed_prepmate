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
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
          Select a candidate
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium leading-tight">
          Who&apos;s being interviewed?
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          The interviewer will probe this profile&apos;s weakest areas.
        </p>
      </div>

      <div className="grid w-full max-w-md gap-4">
        {candidates.map((candidate) => {
          const { skipped, struggled } = weakSpots(candidate)
          return (
            <button
              key={`${candidate.member.role}-${candidate.member.experience}`}
              type="button"
              onClick={() => onSelect(candidate)}
              className="group flex items-center justify-between gap-4 border border-rule bg-paper-raised p-5 text-left transition-colors hover:border-rust hover:bg-rust-tint focus:outline-none focus:ring-2 focus:ring-rust/40"
            >
              <div className="min-w-0">
                <p className="font-display text-lg font-medium">{candidate.member.role}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {candidate.member.experience} year
                  {candidate.member.experience === 1 ? '' : 's'} ·{' '}
                  {candidate.signals.missionsCompleted} missions completed ·{' '}
                  {candidate.signals.commitDays} commit days
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {skipped > 0 && (
                    <span className="border border-rule-strong px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                      {skipped} skipped
                    </span>
                  )}
                  {struggled > 0 && (
                    <span className="border border-rust px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-rust">
                      {struggled} high-attempt
                    </span>
                  )}
                  {skipped === 0 && struggled === 0 && (
                    <span className="border border-olive px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-olive">
                      balanced
                    </span>
                  )}
                </div>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-xl text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-rust"
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
