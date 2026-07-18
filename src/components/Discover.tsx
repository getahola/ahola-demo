import { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckIn, Passenger, Profile } from '../types'
import { MOCK_PASSENGERS, routeStops } from '../data'
import { Avatar, Button, Card, Tag } from './ui'
import { PassengerMenu } from './PassengerMenu'

function sharedInterests(a: string[], b: string[]): string[] {
  return a.filter((i) => b.includes(i))
}

// How long (compressed) between simulated station stops. Real trips take much
// longer; we speed it up so new passengers visibly "board" during a demo.
const STOP_INTERVAL_MS = 14000

export function Discover({
  profile,
  checkIn,
  blockedIds,
  connectedIds,
  onOpenChat,
  onLeave,
  onBlock,
  onReport,
  onConnectedLeaving,
  onEnableDiscover,
}: {
  profile: Profile
  checkIn: CheckIn
  blockedIds: string[]
  connectedIds: string[]
  onOpenChat: (p: Passenger) => void
  onLeave: () => void
  onBlock: (p: Passenger) => void
  onReport: (p: Passenger) => void
  onConnectedLeaving: (passengers: Passenger[], station: string) => void
  onEnableDiscover: () => void
}) {
  const [filter, setFilter] = useState<string | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const stops = useMemo(() => routeStops(checkIn), [checkIn])
  const [stopIndex, setStopIndex] = useState(0)
  const [justBoardedIds, setJustBoardedIds] = useState<string[]>([])
  const [justLeftNames, setJustLeftNames] = useState<string[]>([])
  const prevStopRef = useRef(0)

  // Which stop a passenger boards at (0 = origin).
  const boardingStopOf = (p: Passenger) => {
    if (!p.boardsAt) return 0
    const i = stops.indexOf(p.boardsAt)
    return i < 0 ? 0 : i
  }

  // Which stop a passenger gets off at (last stop = rides to the end).
  const leavingStopOf = (p: Passenger) => {
    if (!p.leavesAt) return stops.length - 1
    const i = stops.indexOf(p.leavesAt)
    return i < 0 ? stops.length - 1 : i
  }

  const advance = () => setStopIndex((i) => Math.min(i + 1, stops.length - 1))

  // When the train reaches a new stop, work out who boarded and who got off.
  useEffect(() => {
    const prev = prevStopRef.current
    if (stopIndex === prev) return
    const onboardBefore = (p: Passenger) =>
      boardingStopOf(p) <= prev && leavingStopOf(p) > prev && !blockedIds.includes(p.id)
    const boarding = MOCK_PASSENGERS.filter(
      (p) => boardingStopOf(p) === stopIndex && leavingStopOf(p) > stopIndex && !blockedIds.includes(p.id),
    )
    const leaving = MOCK_PASSENGERS.filter((p) => onboardBefore(p) && leavingStopOf(p) === stopIndex)
    setJustBoardedIds(boarding.map((p) => p.id))
    setJustLeftNames(leaving.map((p) => p.name))
    const leavingConnected = leaving.filter((p) => connectedIds.includes(p.id))
    if (leavingConnected.length > 0) onConnectedLeaving(leavingConnected, stops[stopIndex])
    prevStopRef.current = stopIndex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopIndex])

  // Auto-progress along the route until the destination.
  useEffect(() => {
    if (stopIndex >= stops.length - 1) return
    const t = setTimeout(advance, STOP_INTERVAL_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopIndex, stops.length])

  const currentStop = stops[stopIndex]
  const nextStop = stops[stopIndex + 1]
  const atDestination = stopIndex >= stops.length - 1

  const ranked = useMemo(() => {
    return MOCK_PASSENGERS.filter((p) => !blockedIds.includes(p.id))
      .filter((p) => boardingStopOf(p) <= stopIndex && leavingStopOf(p) > stopIndex)
      .map((p) => ({
        passenger: p,
        shared: sharedInterests(profile.interests, p.interests),
      }))
      .filter((r) => (filter ? r.passenger.interests.includes(filter) : true))
      .filter((r) => (verifiedOnly ? r.passenger.ticketVerified : true))
      .sort((a, b) => b.shared.length - a.shared.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.interests, filter, verifiedOnly, blockedIds, stopIndex, stops])

  const matches = ranked.filter((r) => r.shared.length > 0)
  const others = ranked.filter((r) => r.shared.length === 0)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-700 p-4 text-white shadow-sm ring-1 ring-brand-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-brand-100">Checked in</p>
            <p className="text-lg font-semibold">
              {checkIn.trainNumber}
              {checkIn.from && checkIn.to ? ` · ${checkIn.from} → ${checkIn.to}` : ''}
            </p>
            <p className="text-sm text-brand-100">
              {checkIn.date}
              {checkIn.coach
                ? profile.hideCoach
                  ? ' · Coach hidden'
                  : ` · Coach ${checkIn.coach}${checkIn.seat ? `, Seat ${checkIn.seat}` : ''}`
                : ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.ticketVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-medium text-emerald-100 ring-1 ring-emerald-300/40">
                  ✓ Ticket verified
                </span>
              )}
              {profile.hideCoach && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-brand-100">
                  🔒 Coach hidden
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onLeave}
            className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
          >
            Leave
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-white/15 pt-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              🚉 {atDestination ? 'Arriving at' : 'Now at'} {currentStop}
            </p>
            <p className="mt-0.5 text-xs text-brand-100">
              {atDestination ? 'Final stop — your trip is ending soon' : `Next stop · ${nextStop}`}
            </p>
          </div>
          {!atDestination && (
            <button
              onClick={advance}
              className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
            >
              ⏭ Next stop
            </button>
          )}
        </div>

        {justBoardedIds.length > 0 && (
          <p className="mt-2 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-medium text-emerald-100">
            🆕 {justBoardedIds.length} passenger{justBoardedIds.length > 1 ? 's' : ''} just checked in at{' '}
            {currentStop}
          </p>
        )}

        {justLeftNames.length > 0 && (
          <p className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-brand-100">
            👋 {justLeftNames.length} passenger{justLeftNames.length > 1 ? 's' : ''} got off at {currentStop}
          </p>
        )}
      </div>

      {!profile.available ? (
        <div className="rounded-2xl bg-amber-50 p-5 text-center ring-1 ring-amber-200">
          <div className="mb-2 text-4xl">🙈</div>
          <h3 className="text-base font-semibold text-slate-800">Discover me is off</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-600">
            You're in Do Not Disturb, so other passengers are hidden — and you don't appear to them
            either. Your existing chats still work.
          </p>
          <button
            onClick={onEnableDiscover}
            className="mt-4 rounded-xl bg-koralle px-4 py-2.5 text-sm font-medium text-white hover:bg-koralle-600"
          >
            🙋 Turn on Discover me
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
        <Tag label="All" active={filter === null} onClick={() => setFilter(null)} />
        {profile.interests.map((i) => (
          <Tag key={i} label={i} active={filter === i} onClick={() => setFilter(filter === i ? null : i)} />
        ))}
        <button
          type="button"
          onClick={() => setVerifiedOnly((v) => !v)}
          className={`rounded-full px-3 py-1 text-sm transition active:scale-95 ${
            verifiedOnly
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          }`}
        >
          ✓ Verified only
        </button>
      </div>

      {matches.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Best matches for you
          </h3>
          {matches.map(({ passenger, shared }) => (
            <PassengerCard
              key={passenger.id}
              passenger={passenger}
              shared={shared}
              connected={connectedIds.includes(passenger.id)}
              justBoarded={justBoardedIds.includes(passenger.id)}
              onOpenChat={() => onOpenChat(passenger)}
              onBlock={() => onBlock(passenger)}
              onReport={() => onReport(passenger)}
            />
          ))}
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Also on this train</h3>
          {others.map(({ passenger, shared }) => (
            <PassengerCard
              key={passenger.id}
              passenger={passenger}
              shared={shared}
              connected={connectedIds.includes(passenger.id)}
              justBoarded={justBoardedIds.includes(passenger.id)}
              onOpenChat={() => onOpenChat(passenger)}
              onBlock={() => onBlock(passenger)}
              onReport={() => onReport(passenger)}
            />
          ))}
        </section>
      )}

      {ranked.length === 0 && (
        <p className="py-8 text-center text-slate-400">No passengers match that filter.</p>
      )}
        </>
      )}
    </div>
  )
}

function PassengerCard({
  passenger,
  shared,
  connected,
  justBoarded,
  onOpenChat,
  onBlock,
  onReport,
}: {
  passenger: Passenger
  shared: string[]
  connected: boolean
  justBoarded: boolean
  onOpenChat: () => void
  onBlock: () => void
  onReport: () => void
}) {
  return (
    <Card>
      <div className="flex gap-3">
        <Avatar emoji={passenger.avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{passenger.name}</p>
            {justBoarded && (
              <span
                title={`Just boarded at ${passenger.boardsAt}`}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700"
              >
                🆕 Just boarded
              </span>
            )}
            {passenger.ticketVerified && (
              <span
                title="Ticket verified"
                className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700"
              >
                ✓ Verified
              </span>
            )}
            {passenger.coach &&
              (connected ? (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                  Coach {passenger.coach}
                </span>
              ) : (
                <span
                  title="Exact coach is revealed once you connect"
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-400"
                >
                  🔒 Coach hidden
                </span>
              ))}
            {shared.length > 0 && (
              <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-xs font-medium text-brand-800">
                {shared.length} in common
              </span>
            )}
            <div className="ml-auto">
              <PassengerMenu onBlock={onBlock} onReport={onReport} />
            </div>
          </div>
          <p className="text-sm text-slate-500">{passenger.bio}</p>
          <p className="mt-1 text-sm text-slate-700">“{passenger.lookingFor}”</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {passenger.interests.map((i) => (
              <Tag key={i} label={i} highlight={shared.includes(i)} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button onClick={onOpenChat}>
          👋 Say hi
        </Button>
      </div>
    </Card>
  )
}
