import type {
  InterviewRequest,
  InterviewResponse,
} from './types'

/**
 * Real backend client. Hits POST {VITE_API_URL}/api/interview per the shared
 * contract. Used in Milestone 2; Milestone 1 runs against the mock client.
 */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function postInterview(
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
      detail = (await res.text()).slice(0, 200)
    } catch {
      // ignore body parse errors
    }
    throw new Error(`Interview request failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }

  return (await res.json()) as InterviewResponse
}
