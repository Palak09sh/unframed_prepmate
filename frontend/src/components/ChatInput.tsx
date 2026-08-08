import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'

interface ChatInputProps {
  disabled?: boolean
  onSubmit: (message: string) => void
}

export default function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function send() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function handleChange() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          handleChange()
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your answer… (Enter to send)"
        aria-label="Your answer"
        className="max-h-40 min-h-11 flex-1 resize-none border border-rule bg-paper-raised px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-rust focus:ring-2 focus:ring-rust/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-11 shrink-0 border border-rule-strong bg-rust px-5 text-sm font-medium text-paper-raised transition-colors hover:bg-rust-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  )
}
