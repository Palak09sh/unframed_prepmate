interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      <p className="font-medium">Something went wrong.</p>
      <p className="mt-0.5 break-words">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-lg border border-red-400 px-3 py-1.5 text-xs font-medium hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900"
      >
        Retry
      </button>
    </div>
  )
}
