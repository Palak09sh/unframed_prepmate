import { mockInterview } from './mockInterview'
import { postInterview } from './api'
import type { InterviewRequest, InterviewResponse } from './types'

/**
 * Single seam the UI talks to. Milestone 1 uses the mock client so the app
 * runs without a backend. Milestone 2: switch App.tsx to use
 * sendInterviewRequestReal (the fetch-backed postInterview) instead.
 */
export const sendInterviewRequest: (
  req: InterviewRequest,
) => Promise<InterviewResponse> = mockInterview

/** The real backend client, ready for Milestone 2 wiring. */
export const sendInterviewRequestReal: (
  req: InterviewRequest,
) => Promise<InterviewResponse> = postInterview
