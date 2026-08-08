import type { ChatMessage } from '../lib/types'

const time = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

interface ChatBubbleProps {
  message: ChatMessage
  /** Hide the avatar + timestamp for consecutive messages from the same speaker. */
  grouped?: boolean
}

export default function ChatBubble({ message, grouped }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`animate-message-in flex items-start gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule-strong bg-rust font-display text-sm font-semibold text-paper-raised"
        >
          Q
        </div>
      )}
      <div className={`flex max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!grouped && (
          <p
            className={`mb-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
              isUser ? 'text-ink-muted' : 'text-rust'
            }`}
          >
            {isUser ? 'A.' : 'Q.'}
          </p>
        )}
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-ink text-paper-raised'
              : 'border border-rule bg-paper-raised text-ink'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {!grouped && (
          <p className="mt-1 text-[11px] text-ink-faint">{time(message.createdAt)}</p>
        )}
      </div>
      {isUser && (
        <div
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule-strong bg-paper-sunk font-display text-sm font-semibold text-ink"
        >
          A
        </div>
      )}
    </div>
  )
}
