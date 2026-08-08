export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule-strong bg-rust font-display text-sm font-semibold text-paper-raised"
      >
        Q
      </div>
      <div className="flex items-center gap-1.5 border border-rule bg-paper-raised px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-ink-muted" />
      </div>
    </div>
  )
}
