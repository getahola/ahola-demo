export interface Profile {
  id: string
  name: string
  avatar: string // emoji
  bio: string
  interests: string[]
  lookingFor: string
  available: boolean
  ticketVerified?: boolean // scanned a valid DB ticket for this trip
  hideCoach?: boolean // never share exact coach with others, even after connecting
}

export interface CheckIn {
  trainNumber: string
  date: string // YYYY-MM-DD
  from: string
  to: string
  coach?: string
  seat?: string
}

export interface TicketInfo {
  trainNumber: string
  date: string
  from: string
  to: string
  coach: string
  seat: string
  travelClass: '1st' | '2nd'
}

export interface Passenger extends Profile {
  coach?: string
  boardsAt?: string // station where this passenger checks in; omitted = boards at origin
  leavesAt?: string // station where this passenger gets off; omitted = rides to the end
}

export interface Departure {
  trainNumber: string
  type: 'ICE' | 'IC'
  to: string
  track: string
  coaches: number
}

export interface Message {
  id: string
  fromId: string // passenger id or 'me'
  text: string
  ts: number
}

export interface Verification {
  email: string
  verifiedAt: number
  ageConfirmed: boolean // 18+
  guidelinesAccepted: boolean
}

export interface Report {
  id: string
  passengerId: string
  passengerName: string
  reason: string
  details?: string
  ts: number
}

export const REPORT_REASONS = [
  'Harassment or hate',
  'Spam or scam',
  'Inappropriate messages',
  'Fake profile',
  'Other',
] as const

export type View = 'verify' | 'landing' | 'onboarding' | 'checkin' | 'discover' | 'chat' | 'inbox'

export type Tab = 'home' | 'messages' | 'profile' | 'settings'
