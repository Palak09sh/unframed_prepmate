import { sendInterviewRequestReal } from './api'
import type { InterviewRequest, InterviewResponse } from './types'

/**
 * Single seam the UI talks to — always the live backend. First request posts
 * {sessionId, candidate}, follow-ups post {sessionId, message}; the final
 * response carries done:true + feedback. Contract per docs/00_SHARED_CONTEXT.md.
 */
export const sendInterviewRequest: (
  req: InterviewRequest,
) => Promise<InterviewResponse> = sendInterviewRequestReal
