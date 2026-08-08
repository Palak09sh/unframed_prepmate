interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="border border-danger bg-paper-sunk px-4 py-3 text-sm text-ink">
      <p className="font-medium text-danger">Something went wrong.</p>
      <p className="mt-0.5 break-words text-ink-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 border border-danger px-3 py-1.5 text-xs font-medium transition-colors hover:bg-paper-raised"
      >
        Retry
      </button>
    </div>
  )
}
