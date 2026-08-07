import type { ChatMessage } from '../lib/types'

const time = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`animate-message-in flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm"
        >
          🎙️
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-indigo-600 text-white'
            : 'rounded-bl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`mt-1.5 text-[11px] leading-none ${
            isUser
              ? 'text-indigo-200'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {time(message.createdAt)}
        </p>
      </div>
      {isUser && (
        <div
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-xs font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
        >
          You
        </div>
      )}
    </div>
  )
}
