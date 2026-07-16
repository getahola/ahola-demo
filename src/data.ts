import type { Departure, Passenger, TicketInfo } from './types'

export const INTERESTS = [
  'Games',
  'AI / Tech',
  'Career',
  'Books',
  'Coffee',
  'Language exchange',
  'Quiet company',
  'Travel tips',
  'Music',
  'Startups',
  'Food',
  'Sports',
] as const

export const AVATARS = ['🦊', '🐼', '🦉', '🐙', '🦄', '🐳', '🐝', '🦔', '🐢', '🦁', '🐧', '🐨']

/**
 * Simulated GPS result: the station, platform tracks and the train the user is
 * about to board. In production this comes from a geolocation lookup matched
 * against the live departure board (e.g. DB Timetables API).
 */
export const DETECTED_STATION = {
  name: 'München Hbf',
  city: 'Munich',
  accuracy: 8, // metres
  tracks: ['4', '5', '6'],
}

export const DETECTED_DEPARTURE: Departure = {
  trainNumber: 'ICE 1008',
  type: 'ICE',
  to: 'Münster (Westf)',
  track: '5',
  coaches: 12,
}

/**
 * Simulated result of parsing a DB ticket QR/Aztec code on-device. In production
 * only the trip fields below are extracted — the ticket image, passenger name
 * and payment data are never read or stored.
 */
export const DETECTED_TICKET: TicketInfo = {
  trainNumber: 'ICE 1008',
  date: new Date().toISOString().slice(0, 10),
  from: 'München Hbf',
  to: 'Münster (Westf)',
  coach: '12',
  seat: '43',
  travelClass: '2nd',
}

/**
 * Ordered stops served by ICE 1008. In production this comes from the timetable
 * for the checked-in train; here it lets us simulate passengers boarding at
 * later stations as the trip progresses.
 */
export const ROUTE_STOPS = [
  'München Hbf',
  'Augsburg Hbf',
  'Nürnberg Hbf',
  'Würzburg Hbf',
  'Frankfurt (Main) Hbf',
  'Münster (Westf)',
]

/** Stops between the user's origin and destination, inclusive. */
export function routeStops(checkIn: { from: string; to: string }): string[] {
  const a = ROUTE_STOPS.indexOf(checkIn.from)
  const b = ROUTE_STOPS.indexOf(checkIn.to)
  if (a === -1 || b === -1) return [checkIn.from, checkIn.to].filter(Boolean)
  return ROUTE_STOPS.slice(Math.min(a, b), Math.max(a, b) + 1)
}

/**
 * Mock passengers that appear "already checked in" on any train the user joins.
 * In production these come from the check-in service filtered by trainNumber+date.
 */
export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: 'p1',
    name: 'Lena',
    avatar: '🦊',
    bio: 'Data scientist, always up for a good debate.',
    interests: ['AI / Tech', 'Coffee', 'Startups'],
    lookingFor: 'Would love to talk about where AI is heading. Coffee in the bord bistro?',
    available: true,
    coach: '7',
    ticketVerified: true,
    leavesAt: 'Nürnberg Hbf',
  },
  {
    id: 'p2',
    name: 'Marco',
    avatar: '🐼',
    bio: 'Chess addict travelling for work.',
    interests: ['Games', 'Books', 'Career'],
    lookingFor: 'Looking for a chess or cards partner between Frankfurt and Munich.',
    available: true,
    coach: '12',
  },
  {
    id: 'p3',
    name: 'Sofia',
    avatar: '🦉',
    bio: 'Learning German, native Spanish speaker.',
    interests: ['Language exchange', 'Music', 'Food'],
    lookingFor: 'Language tandem? I help with Spanish, you help with my German. :)',
    available: true,
    coach: '9',
    ticketVerified: true,
    boardsAt: 'Augsburg Hbf',
    leavesAt: 'Frankfurt (Main) Hbf',
  },
  {
    id: 'p4',
    name: 'Jonas',
    avatar: '🐙',
    bio: 'Founder, building a climate startup.',
    interests: ['Startups', 'AI / Tech', 'Career', 'Coffee'],
    lookingFor: 'Happy to swap founder stories or just geek out about tech.',
    available: true,
    coach: '7',
    ticketVerified: true,
  },
  {
    id: 'p5',
    name: 'Amira',
    avatar: '🦄',
    bio: 'Reader of everything. Introvert-friendly.',
    interests: ['Books', 'Quiet company', 'Travel tips'],
    lookingFor: 'Quiet company is nice too — book recommendations very welcome.',
    available: true,
    coach: '14',
    boardsAt: 'Nürnberg Hbf',
    leavesAt: 'Frankfurt (Main) Hbf',
  },
  {
    id: 'p6',
    name: 'Tom',
    avatar: '🐳',
    bio: 'Weekend footballer, full-time optimist.',
    interests: ['Sports', 'Games', 'Music'],
    lookingFor: 'Anyone for a quick quiz game or football chat?',
    available: true,
    coach: '3',
    boardsAt: 'Würzburg Hbf',
  },
  {
    id: 'p7',
    name: 'Nia',
    avatar: '🐝',
    bio: 'Illustrator, sketching strangers on trains (with permission!).',
    interests: ['Music', 'Coffee', 'Travel tips'],
    lookingFor: 'Short trip today — up for a quick coffee and a chat before Augsburg.',
    available: true,
    coach: '5',
    leavesAt: 'Augsburg Hbf',
  },
  {
    id: 'p8',
    name: 'David',
    avatar: '🦔',
    bio: 'PhD student, commuting between labs.',
    interests: ['AI / Tech', 'Books', 'Career'],
    lookingFor: 'Always keen to nerd out about research or swap paper recommendations.',
    available: true,
    coach: '11',
    ticketVerified: true,
    boardsAt: 'Nürnberg Hbf',
  },
  {
    id: 'p9',
    name: 'Yuki',
    avatar: '🐢',
    bio: 'Photographer chasing golden-hour light out the window.',
    interests: ['Travel tips', 'Food', 'Quiet company'],
    lookingFor: 'Happy to share hidden-gem spots along the route.',
    available: true,
    coach: '8',
    boardsAt: 'Würzburg Hbf',
    leavesAt: 'Frankfurt (Main) Hbf',
  },
  {
    id: 'p10',
    name: 'Elias',
    avatar: '🐧',
    bio: 'Musician heading to a gig up north.',
    interests: ['Music', 'Games', 'Coffee'],
    lookingFor: 'Anyone into indie music? Would love recommendations for the ride.',
    available: true,
    coach: '2',
    boardsAt: 'Frankfurt (Main) Hbf',
  },
  {
    id: 'p11',
    name: 'Priya',
    avatar: '🐨',
    bio: 'Product designer, sketchbook always open.',
    interests: ['Startups', 'AI / Tech', 'Coffee', 'Career'],
    lookingFor: 'Down to talk design, startups, or the best on-board coffee.',
    available: true,
    coach: '10',
    ticketVerified: true,
  },
]
