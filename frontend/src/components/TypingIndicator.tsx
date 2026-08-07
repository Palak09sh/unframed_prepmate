export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
        <span className="size-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-zinc-400" />
      </div>
    </div>
  )
}
