import type { CheckIn, Message, Profile, Report, Verification } from './types'

const KEYS = {
  profile: 'sayhi.profile',
  checkin: 'sayhi.checkin',
  messages: 'sayhi.messages',
  verification: 'sayhi.verification',
  blocked: 'sayhi.blocked',
  reports: 'sayhi.reports',
  kept: 'sayhi.kept',
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / private-mode errors in the prototype */
  }
}

export const store = {
  getProfile: () => read<Profile>(KEYS.profile),
  saveProfile: (p: Profile) => write(KEYS.profile, p),

  getCheckIn: () => read<CheckIn>(KEYS.checkin),
  saveCheckIn: (c: CheckIn) => write(KEYS.checkin, c),
  clearCheckIn: () => localStorage.removeItem(KEYS.checkin),

  // messages are keyed by passenger id
  getMessages: (): Record<string, Message[]> => read<Record<string, Message[]>>(KEYS.messages) ?? {},
  saveMessages: (m: Record<string, Message[]>) => write(KEYS.messages, m),

  getVerification: () => read<Verification>(KEYS.verification),
  saveVerification: (v: Verification) => write(KEYS.verification, v),

  getBlocked: (): string[] => read<string[]>(KEYS.blocked) ?? [],
  saveBlocked: (ids: string[]) => write(KEYS.blocked, ids),

  getReports: (): Report[] => read<Report[]>(KEYS.reports) ?? [],
  saveReports: (r: Report[]) => write(KEYS.reports, r),

  // passenger ids of chats kept across a previous trip (mutual keep)
  getKept: (): string[] => read<string[]>(KEYS.kept) ?? [],
  saveKept: (ids: string[]) => write(KEYS.kept, ids),
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}
