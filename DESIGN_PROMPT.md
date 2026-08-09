# Master Prompt — AI-Interview Agent UI

Use this as a single prompt to Claude (build directly in code — React + Tailwind) to generate the full product UI.

---

## Product Context

Build the UI for **AI-Interview Agent**, a web app where candidates practice job interviews with an AI interviewer. End users are candidates preparing for interviews — not recruiters. Build these three surfaces:

1. **Landing page** — marketing/entry point
2. **Chat panel** — the live interview, full-width standalone page (not a side panel, not docked inside the dashboard)
3. **Dashboard** — candidate's home base: past sessions, progress, scores, upcoming practice

---

## Non-Negotiable Design Rules

**Layout**
- Every page must use the **full viewport width**. Do not wrap content in a centered `max-w-*` container the way default AI-generated UIs do. Content can have internal columns/grids/margins, but the page itself spans edge to edge — think of how a real product dashboard (Linear, Vercel, Notion) uses the whole screen, not a boxed card floating in the middle.
- Layout should read as **linear and minimal**: clear horizontal/vertical rhythm, generous whitespace used deliberately (not decoratively), no floating cards-on-cards, no unnecessary nested containers or shadows-on-shadows.
- Avoid the "generic AI-generated SaaS" look: no centered hero with a giant rounded gradient blob, no 3-icon-feature-grid-in-a-card cliché, no emoji-as-icons, no glassmorphism.

**Color**
- **Muted single-accent-on-neutral** system. Neutral base (grays/off-whites), light mode default. One restrained accent color used sparingly (buttons, active states, key data points) — not a bright SaaS blue, not a gradient, nothing warm/orange/pink-toned. Think ink, slate, graphite, with one deliberate accent (e.g. a muted forest, deep teal, or muted indigo — pick one and justify it).
- **No gradients anywhere.** Flat fills only. No warm color temperature — stay cool/neutral throughout (this includes shadows: cool gray shadows, not warm brown-tinted ones).

**Typography**
- **Editorial serif + sans mix**: a serif for headlines/section titles (something with character — not Times New Roman default), a clean sans for body/UI text/data. The pairing should feel considered and editorial, like a well-designed publication or a design-forward product (e.g. Linear's blog, a fintech annual report), not a template.
- Type scale should carry hierarchy — don't lean on color or boxes to separate sections when type weight/size can do it.

**General**
- No rounded-everything default Tailwind aesthetic — be intentional about corner radius (sharp or very slightly rounded, consistently applied, not `rounded-2xl` on every div by default).
- No stock icon-in-a-circle patterns repeated everywhere.
- Interactions and states (hover, active, focus) should feel precise, not bouncy/springy by default.

---

## Page-by-Page Requirements

### 1. Landing Page
- Full-width hero — no centered boxed hero. Headline in serif, supporting copy in sans.
- Communicate: what the product does (AI-run mock interviews), who it's for (candidates), and a clear primary CTA (start practicing / sign up).
- Include sections for: how it works, and a proof/credibility section — no generic testimonial-card grid; be intentional.
- Full-width layout throughout, not a single centered column.

### 2. Chat Panel (Interview Session)
- Full-width standalone page — this is the primary product experience, treat it as such, not a cramped chat widget.
- Core structure: message thread (AI interviewer + candidate), input area, and light session context (e.g. which question/stage they're on) — without turning it into a busy dashboard. Keep it focused on the conversation.
- Consider how full width is used meaningfully here (e.g. thread column with breathing room on either side that still isn't a hard-capped centered card, or a subtle side rail for session progress) rather than stretching chat bubbles edge-to-edge awkwardly.

### 3. Dashboard
- Full-width grid: past interview sessions, scores/progress over time, and next-steps/CTA to start a new practice session.
- Data-forward — this is where the serif/sans hierarchy and the single accent color should do real work (e.g. accent used only for the one number/action that matters most on screen).

---

## Deliverable Format

Build as React components with Tailwind CSS. Single accent color and full type scale should be defined once (as CSS variables or a Tailwind theme extension) and reused consistently across all three pages — not redefined per page.