import type { Candidate } from '../lib/types'

export default function EmptyState({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="text-4xl">🎙️</div>
      <h2 className="text-xl font-semibold">Your interview is ready</h2>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        {candidate.member.role} with {candidate.member.experience} year
        {candidate.member.experience === 1 ? '' : 's'} of experience. The
        interviewer will probe your weakest areas — including{' '}
        {candidate.missions
          .filter((m) => 'skipped' in m && m.skipped)
          .map((m) => m.title)
          .join(', ') || 'your past missions'}.
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Starting now…
      </p>
    </div>
  )
}
