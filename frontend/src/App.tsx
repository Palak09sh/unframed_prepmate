import { useCallback, useEffect, useRef, useState } from 'react'
import CandidatePicker from './components/CandidatePicker'
import ChatBubble from './components/ChatBubble'
import ChatInput from './components/ChatInput'
import EmptyState from './components/EmptyState'
import ErrorState from './components/ErrorState'
import FeedbackCard from './components/FeedbackCard'
import TypingIndicator from './components/TypingIndicator'
import { CANDIDATES } from './lib/candidates'
import { sendInterviewRequest } from './lib/interview'
import type { Candidate, ChatMessage, Feedback } from './lib/types'

type Phase = 'selecting' | 'starting' | 'chatting' | 'sending' | 'done' | 'error'

let idCounter = 0
const nextId = () => `msg-${++idCounter}`

export default function App() {
  const [phase, setPhase] = useState<Phase>('selecting')
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
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

  function handleSelect(selected: Candidate) {
    setCandidate(selected)
    setSessionId(crypto.randomUUID())
    setPhase('starting')
    // Wait for the new sessionId to be set before firing the start request.
    setMessages([])
    setFeedback(null)
    setError(null)
  }

  // Kick off the interview once a candidate is chosen.
  useEffect(() => {
    if (startedRef.current || phase !== 'starting' || !candidate || !sessionId) {
      return
    }
    startedRef.current = true
    runRequest({ sessionId, candidate })
  }, [phase, candidate, sessionId, runRequest])

  // Keep the latest message scrolled into view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages, phase])

  function startNewInterview() {
    idCounter = 0
    startedRef.current = false
    setPhase('selecting')
    setCandidate(null)
    setSessionId(null)
    setMessages([])
    setFeedback(null)
    setError(null)
    setLastMessage(null)
  }

  function handleSubmit(message: string) {
    if (!sessionId) return
    setLastMessage(message)
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', content: message, createdAt: Date.now() },
    ])
    runRequest({ sessionId, message })
  }

  function handleRetry() {
    if (!candidate) return
    if (lastMessage !== null && sessionId) {
      runRequest({ sessionId, message: lastMessage })
    } else if (sessionId) {
      runRequest({ sessionId, candidate })
    }
  }

  const busy = phase === 'starting' || phase === 'sending'
  const showChat =
    phase === 'chatting' || phase === 'sending' || phase === 'error'

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4 pt-4">
      <header className="mb-4 flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex size-9 items-center justify-center rounded-full bg-indigo-600 text-lg">
          🎙️
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">AI Interview</h1>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {candidate
              ? `${candidate.member.role} · ${candidate.member.experience} yr`
              : 'Select a candidate to begin'}
          </p>
        </div>
        {candidate && (
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
        )}
      </header>

      <main
        aria-label="Interview chat"
        className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4"
      >
        {phase === 'selecting' && (
          <CandidatePicker candidates={CANDIDATES} onSelect={handleSelect} />
        )}

        {phase === 'starting' && messages.length === 0 && candidate && (
          <EmptyState candidate={candidate} />
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
        ) : showChat ? (
          <ChatInput disabled={busy} onSubmit={handleSubmit} />
        ) : null}
      </footer>
    </div>
  )
}
