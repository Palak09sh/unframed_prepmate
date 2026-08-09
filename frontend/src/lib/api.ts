import type {
  InterviewRequest,
  InterviewResponse,
} from './types'

/**
 * Live backend client. POSTs to {VITE_API_URL}/api/interview per the shared
 * contract (docs/00_SHARED_CONTEXT.md). The backend defaults to port 8080
 * locally (application.yml: ${PORT:8080}); override with VITE_API_URL when
 * deployed. Non-2xx responses carry {"error": "..."} — surface that message.
 */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export async function sendInterviewRequestReal(
  body: InterviewRequest,
): Promise<InterviewResponse> {
  const res = await fetch(`${API_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const text = await res.text()
      try {
        const parsed = JSON.parse(text)
        if (parsed && typeof parsed.error === 'string') detail = parsed.error
      } catch {
        detail = text.slice(0, 200)
      }
    } catch {
      // body unreadable — fall back to the status code only
    }
    throw new Error(`Interview failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }

  return (await res.json()) as InterviewResponse
}
