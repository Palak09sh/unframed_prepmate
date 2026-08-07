import { useCallback, useEffect, useRef, useState } from 'react'
import ChatBubble from './components/ChatBubble'
import ChatInput from './components/ChatInput'
import EmptyState from './components/EmptyState'
import ErrorState from './components/ErrorState'
import FeedbackCard from './components/FeedbackCard'
import TypingIndicator from './components/TypingIndicator'
import { sendInterviewRequest } from './lib/interview'
import { SAMPLE_CANDIDATE } from './lib/mockInterview'
import type { ChatMessage, Feedback } from './lib/types'

type Phase = 'starting' | 'chatting' | 'sending' | 'done' | 'error'

let idCounter = 0
const nextId = () => `msg-${++idCounter}`

export default function App() {
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const [phase, setPhase] = useState<Phase>('starting')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState<string | null>(null)

  const startedRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const runRequest = useCallback(
    async function runRequest(
      body: Parameters<typeof sendInterviewRequest>[0],
    ) {
      setPhase('message' in body ? 'sending' : 'starting')
      setError(null)
      try {
        const res = await sendInterviewRequest(body)
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            content: res.reply,
            createdAt: Date.now(),
          },
        ])
        if (res.done) {
          setFeedback(res.feedback ?? null)
          setPhase('done')
        } else {
          setPhase('chatting')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unexpected error.')
        setPhase('error')
      }
    },
    [],
  )

  // Start the interview on load (per role prompt #1).
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    runRequest({ sessionId, candidate: SAMPLE_CANDIDATE })
  }, [runRequest, sessionId])

  // Keep the latest message scrolled into view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages, phase])

  function startNewInterview() {
    idCounter = 0
    setMessages([])
    setFeedback(null)
    setError(null)
    setLastMessage(null)
    setSessionId(crypto.randomUUID())
  }

  function handleSubmit(message: string) {
    setLastMessage(message)
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', content: message, createdAt: Date.now() },
    ])
    runRequest({ sessionId, message })
  }

  function handleRetry() {
    if (lastMessage !== null) {
      runRequest({ sessionId, message: lastMessage })
    } else {
      runRequest({ sessionId, candidate: SAMPLE_CANDIDATE })
    }
  }

  const busy = phase === 'starting' || phase === 'sending'

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4 pt-4">
      <header className="mb-4 flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex size-9 items-center justify-center rounded-full bg-indigo-600 text-lg">
          🎙️
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">AI Interview</h1>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {SAMPLE_CANDIDATE.member.role} · {SAMPLE_CANDIDATE.member.experience}{' '}
            yr
          </p>
        </div>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            phase === 'done'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              phase === 'done' ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}
          />
          {phase === 'done' ? 'Complete' : 'Live'}
        </span>
      </header>

      <main
        aria-label="Interview chat"
        className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4"
      >
        {phase === 'starting' && messages.length === 0 && (
          <EmptyState candidate={SAMPLE_CANDIDATE} />
        )}

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {busy && <TypingIndicator />}

        {phase === 'error' && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {phase === 'done' && feedback && <FeedbackCard feedback={feedback} />}

        <div ref={bottomRef} />
      </main>

      <footer className="border-t border-zinc-200 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-zinc-800">
        {phase === 'done' ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Interview complete. Thank you!
            </p>
            <button
              type="button"
              onClick={startNewInterview}
              className="rounded-2xl border border-zinc-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Start a new interview
            </button>
          </div>
        ) : (
          <ChatInput disabled={busy} onSubmit={handleSubmit} />
        )}
      </footer>
    </div>
  )
}
