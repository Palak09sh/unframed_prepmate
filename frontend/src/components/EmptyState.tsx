import type { Candidate } from '../lib/types'

export default function EmptyState({ candidate }: { candidate: Candidate }) {
  const skipped = candidate.missions
    .filter((m) => 'skipped' in m && m.skipped)
    .map((m) => m.title)

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm border border-rule bg-paper-raised p-8">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-rule-strong bg-rust font-display text-xl font-semibold text-paper-raised">
          Q
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">
          The interview
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium leading-tight">
          Your interview is ready
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {candidate.member.role} with {candidate.member.experience} year
          {candidate.member.experience === 1 ? '' : 's'} of experience. The
          interviewer will probe your weakest areas
          {skipped.length > 0 ? (
            <>
              {' '}
              — including <span className="font-medium text-ink">{skipped.join(', ')}</span>
            </>
          ) : (
            ''
          )}
          .
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-ink-faint">
          <span className="size-1.5 animate-pulse rounded-full bg-rust" />
          Starting now…
        </div>
      </div>
    </div>
  )
}
