import type { CheckIn, Profile, Verification } from './types'

/**
 * Landing-page preview mode — activated via `?demo=1` (e.g. demo.ahola.app/?demo=1).
 *
 * This keeps the normal demo.ahola.app experience completely separate: without the
 * flag the app runs its full flow (verify → profile → check-in). With the flag the
 * visitor is dropped straight into the app as a pre-configured passenger ("Quokka")
 * who is already checked in on ICE 1008 from Munich to Münster. Nothing is persisted
 * to localStorage in this mode (see store.ts), so each embed load starts fresh and
 * never interferes with a real session.
 */
export const isDemoMode = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).has('demo')
  } catch {
    return false
  }
}

export const DEMO_VERIFICATION: Verification = {
  email: 'quokka@demo.ahola.app',
  verifiedAt: Date.now(),
  ageConfirmed: true,
  guidelinesAccepted: true,
}

export const DEMO_PROFILE: Profile = {
  id: 'quokka-demo',
  name: 'Quokka',
  avatar: '🦘',
  bio: 'Unterwegs von München nach Münster — Lust auf ein nettes Gespräch.',
  interests: ['Coffee', 'Travel tips', 'AI / Tech'],
  lookingFor: 'A good chat to pass the ride',
  available: true,
  ticketVerified: true,
}

export const DEMO_CHECKIN: CheckIn = {
  trainNumber: 'ICE 1008',
  date: new Date().toISOString().slice(0, 10),
  from: 'München Hbf',
  to: 'Münster (Westf)',
  coach: '7',
  seat: '21',
}
