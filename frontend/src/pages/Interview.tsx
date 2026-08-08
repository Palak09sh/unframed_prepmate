import { useCallback, useEffect, useRef, useState } from 'react'
import CandidatePicker from '../components/CandidatePicker'
import ChatBubble from '../components/ChatBubble'
import ChatInput from '../components/ChatInput'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FeedbackCard from '../components/FeedbackCard'
import ThemeToggle from '../components/ThemeToggle'
import TypingIndicator from '../components/TypingIndicator'
import { CANDIDATES } from '../lib/candidates'
import { sendInterviewRequest } from '../lib/interview'
import type { Candidate, ChatMessage, Feedback } from '../lib/types'

type Phase = 'selecting' | 'starting' | 'chatting' | 'sending' | 'done' | 'error'

interface InterviewProps {
  onExit: () => void
  onDashboard: () => void
}

let idCounter = 0
const nextId = () => `msg-${++idCounter}`

export default function Interview({ onExit, onDashboard }: InterviewProps) {
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
  const questionsAsked = messages.filter((m) => m.role === 'assistant').length
  const weakSpots = candidate?.missions.filter(
    (m) =>
      ('skipped' in m && m.skipped) || ('attempts' in m && m.attempts >= 3),
  )

  return (
    <div className="flex h-dvh bg-paper">
      {/* Session rail — hidden on small screens, keeps the thread the star */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-rule lg:flex">
        <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
          <div className="flex size-8 items-center justify-center bg-accent font-display text-sm font-semibold text-paper-raised">
            Q
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Session context</p>
            <p className="text-xs text-ink-muted">
              {phase === 'done' ? 'Complete' : 'Live interview'}
            </p>
          </div>
        </div>

        <div className="chat-scroll flex-1 overflow-y-auto px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
            Candidate
          </p>
          {candidate ? (
            <>
              <p className="mt-2 font-display text-lg font-medium">
                {candidate.member.role}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {candidate.member.experience} yr ·{' '}
                {candidate.signals.missionsCompleted} missions completed
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">Not selected yet</p>
          )}

          <div className="my-6 h-px bg-rule" />

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
            Progress
          </p>
          <p className="mt-2 font-display text-2xl font-medium">
            {questionsAsked}
            <span className="text-sm text-ink-muted"> / 8+</span>
          </p>
          <p className="text-xs text-ink-muted">questions asked</p>
          <div className="mt-3 w-full bg-paper-sunk">
            <div
              className="bg-accent transition-all"
              style={{
                height: '2px',
                width: `${Math.min(100, (questionsAsked / 8) * 100)}%`,
              }}
            />
          </div>

          <div className="my-6 h-px bg-rule" />

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
            Probing next
          </p>
          {weakSpots && weakSpots.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {weakSpots.map((m) => (
                <li
                  key={m.day}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="text-ink-muted">{m.title}</span>
                  <span className="shrink-0 text-xs uppercase tracking-[0.08em] text-accent">
                    {'skipped' in m ? 'skipped' : 'high-attempt'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">
              No weak spots on file — balanced coverage.
            </p>
          )}
        </div>

        <div className="border-t border-rule px-5 py-4">
          <button
            type="button"
            onClick={onDashboard}
            className="link-underline text-sm text-ink"
          >
            Dashboard
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-rule px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={onExit}
            aria-label="Back to home"
            className="flex size-9 items-center justify-center border border-rule text-lg transition-colors hover:bg-paper-sunk"
          >
            ←
          </button>
          <div className="flex size-9 items-center justify-center bg-accent font-display text-sm font-semibold text-paper-raised">
            Q
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-medium tracking-tight">
              PrepMate
            </h1>
            <p className="truncate text-xs text-ink-muted">
              {candidate
                ? `${candidate.member.role} · ${candidate.member.experience} yr`
                : 'Select a candidate to begin'}
            </p>
          </div>
          {candidate && (
            <span
              className={`ml-auto inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${
                phase === 'done'
                  ? 'border-olive text-olive'
                  : 'border-rule text-ink-muted'
              }`}
            >
              <span
                className={`size-1.5 ${
                  phase === 'done' ? 'bg-olive' : 'bg-accent'
                }`}
              />
              {phase === 'done' ? 'Complete' : 'Live'}
            </span>
          )}
          <button
            type="button"
            onClick={onDashboard}
            className="link-underline ml-3 hidden text-sm text-ink sm:block lg:hidden"
          >
            Dashboard
          </button>
          <ThemeToggle />
        </header>

        <main
          aria-label="Interview chat"
          className="chat-scroll flex-1 overflow-y-auto"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6 sm:px-8">
            {phase === 'selecting' && (
              <CandidatePicker candidates={CANDIDATES} onSelect={handleSelect} />
            )}

            {phase === 'starting' && messages.length === 0 && candidate && (
              <EmptyState candidate={candidate} />
            )}

            {messages.map((message, i) => {
              const prev = messages[i - 1]
              const grouped =
                prev !== undefined && prev.role === message.role
              return (
                <ChatBubble
                  key={message.id}
                  message={message}
                  grouped={grouped}
                />
              )
            })}

            {busy && <TypingIndicator />}

            {phase === 'error' && error && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {phase === 'done' && feedback && (
              <FeedbackCard feedback={feedback} />
            )}

            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="border-t border-rule px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {phase === 'done' ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-ink-muted">
                  Interview complete. Thank you!
                </p>
                <button
                  type="button"
                  onClick={startNewInterview}
                  className="link-underline text-sm font-medium text-ink"
                >
                  Start a new interview
                </button>
              </div>
            ) : showChat ? (
              <ChatInput disabled={busy} onSubmit={handleSubmit} />
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  )
}
