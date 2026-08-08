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
    <div className="flex flex-col justify-center py-6">
      <p className="font-display italic text-ink-muted">
        Select a candidate
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-0.02em]">
        Who&apos;s being interviewed?
      </h2>
      <p className="mt-3 text-sm text-ink-muted">
        The interviewer will probe this profile&apos;s weakest areas.
      </p>

      <div className="mt-10 border-t border-rule">
        {candidates.map((candidate) => {
          const { skipped, struggled } = weakSpots(candidate)
          return (
            <button
              key={`${candidate.member.role}-${candidate.member.experience}`}
              type="button"
              onClick={() => onSelect(candidate)}
              className="group flex w-full items-center justify-between gap-6 border-b border-rule py-6 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <div className="min-w-0">
                <p className="font-display text-xl font-medium">
                  {candidate.member.role}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {candidate.member.experience} year
                  {candidate.member.experience === 1 ? '' : 's'} ·{' '}
                  {candidate.signals.missionsCompleted} missions completed ·{' '}
                  {candidate.signals.commitDays} commit days
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skipped > 0 && (
                    <span className="border border-rule-strong px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted">
                      {skipped} skipped
                    </span>
                  )}
                  {struggled > 0 && (
                    <span className="border border-accent px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
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
              <span className="shrink-0 text-sm font-medium text-ink-muted transition-colors group-hover:text-accent">
                Select
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
