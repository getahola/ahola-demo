import type { CheckIn, Profile } from '../types'
import { isDemoMode } from '../demo'
import { Card } from './ui'

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-brand-600' : 'bg-slate-300'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
      />
    </span>
  )
}

export function Settings({
  profile,
  checkIn,
  blockedCount,
  onToggleHideCoach,
  onToggleAvailable,
  onEndTrip,
}: {
  profile: Profile
  checkIn: CheckIn | null
  blockedCount: number
  onToggleHideCoach: () => void
  onToggleAvailable: () => void
  onEndTrip: () => void
}) {
  const demo = isDemoMode()
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Privacy and account preferences.</p>
      </div>

      <section className="space-y-2">
        <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Privacy</h3>
        <Card className="divide-y divide-slate-100 p-0">
          <button onClick={onToggleHideCoach} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
            <span className="text-xl">🔒</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">Hide my coach</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {profile.hideCoach ? 'Stays hidden even after you connect' : 'Shown only after you connect'}
              </p>
            </div>
            <Toggle on={!!profile.hideCoach} />
          </button>

          <button onClick={onToggleAvailable} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
            <span className="text-xl">{profile.available ? '🙋' : '🙈'}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">Discover me</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {profile.available
                  ? 'You can see others and they can see you'
                  : "Do not disturb — you're hidden and can't see others"}
              </p>
            </div>
            <Toggle on={profile.available} />
          </button>
        </Card>
      </section>

      <section className="space-y-2">
        <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Account</h3>
        <Card className="divide-y divide-slate-100 p-0">
          <div className="flex items-center gap-3 p-4">
            <span className="text-xl">🎫</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Ticket verification</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {profile.ticketVerified ? 'Verified for this trip' : 'Not verified — scan on check-in'}
              </p>
            </div>
            {profile.ticketVerified && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">✓</span>
            )}
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="text-xl">🚫</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Blocked passengers</p>
              <p className="mt-0.5 text-xs text-slate-500">People you've blocked stay hidden</p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{blockedCount}</span>
          </div>
        </Card>
      </section>

      {checkIn && (
        <section className="space-y-2">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Current trip</h3>
          <Card>
            <p className="text-sm font-medium text-slate-800">{checkIn.trainNumber}</p>
            <p className="text-xs text-slate-500">
              {checkIn.from} → {checkIn.to}
            </p>
            <button
              onClick={onEndTrip}
              disabled={demo}
              title={demo ? 'Disabled in this preview' : undefined}
              className="mt-3 w-full rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-rose-50"
            >
              🏁 End trip / I've arrived
            </button>
            {demo && (
              <p className="mt-2 text-center text-xs text-slate-400">Disabled in this preview</p>
            )}
          </Card>
        </section>
      )}
    </div>
  )
}
