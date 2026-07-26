import { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckIn, Passenger, Profile } from '../types'
import { MOCK_PASSENGERS, routeStops } from '../data'
import { isDemoMode } from '../demo'
import { t, ppl, tInterest, passengerBio, passengerLookingFor } from '../i18n'
import { Avatar, Button, Card, Tag } from './ui'
import { PassengerMenu } from './PassengerMenu'
import { SubscribeModal } from './SubscribeModal'

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
  const [subscribeFor, setSubscribeFor] = useState<Passenger | null>(null)
  const demo = isDemoMode()

  // In the demo, "Say hi" can't open a real chat — nudge to the waitlist instead.
  const handleSayHi = (p: Passenger) => (demo ? setSubscribeFor(p) : onOpenChat(p))

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
    <div className="space-y-4">
      <div className="rounded-2xl bg-teal p-3.5 text-white shadow-sm ring-1 ring-black/10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] uppercase tracking-wide text-brand-100">{t('checkedIn')}</span>
              {profile.ticketVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-100 ring-1 ring-emerald-300/40">
                  {t('ticketVerified')}
                </span>
              )}
              {profile.hideCoach && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-brand-100">
                  {t('coachHidden')}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-base font-semibold">{checkIn.trainNumber}</p>
            {checkIn.from && checkIn.to && (
              <p className="text-sm text-brand-100">
                {checkIn.from} → {checkIn.to}
              </p>
            )}
            <p className="text-xs text-brand-100">
              {checkIn.date}
              {checkIn.coach
                ? profile.hideCoach
                  ? ` · ${t('coachHiddenInline')}`
                  : ` · ${t('coachInline', { coach: checkIn.coach })}${
                      checkIn.seat ? `, ${t('seatInline', { seat: checkIn.seat })}` : ''
                    }`
                : ''}
            </p>
          </div>
          <button
            onClick={onLeave}
            disabled={demo}
            title={demo ? t('disabledPreview') : undefined}
            className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/15"
          >
            {t('leave')}
          </button>
        </div>

        <div className="mt-2.5 flex items-center gap-3 border-t border-white/15 pt-2.5">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              🚉 {atDestination ? t('arrivingAt') : t('nowAt')} {currentStop}
            </p>
            <p className="mt-0.5 text-xs text-brand-100">
              {atDestination ? t('finalStop') : t('nextStop', { stop: nextStop })}
            </p>
          </div>
          {!atDestination && (
            <button
              onClick={advance}
              className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
            >
              {t('nextStopBtn')}
            </button>
          )}
        </div>

        {justBoardedIds.length > 0 && (
          <p className="mt-2 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-medium text-emerald-100">
            {t('justCheckedIn', { n: justBoardedIds.length, ppl: ppl(justBoardedIds.length), stop: currentStop })}
          </p>
        )}

        {justLeftNames.length > 0 && (
          <p className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-brand-100">
            {t('gotOff', { n: justLeftNames.length, ppl: ppl(justLeftNames.length), stop: currentStop })}
          </p>
        )}
      </div>

      {!profile.available ? (
        <div className="rounded-2xl bg-amber-50 p-5 text-center ring-1 ring-amber-200">
          <div className="mb-2 text-4xl">🙈</div>
          <h3 className="text-base font-semibold text-slate-800">{t('discoverOffTitle')}</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-600">
            {t('discoverOffText')}
          </p>
          <button
            onClick={onEnableDiscover}
            className="mt-4 rounded-xl bg-koralle px-4 py-2.5 text-sm font-medium text-white hover:bg-koralle-600"
          >
            {t('turnOnDiscover')}
          </button>
        </div>
      ) : atDestination ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mb-3 text-5xl">🎉</div>
          <h3 className="text-lg font-semibold text-slate-800">{t('arrivedTitle', { stop: currentStop })}</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">
            {t('arrivedText', { train: checkIn.trainNumber })}
          </p>
          <p className="mx-auto mt-3 max-w-xs text-sm text-slate-500">
            {t('arrivedBye')}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
        <Tag label={t('filterAll')} active={filter === null} onClick={() => setFilter(null)} />
        {profile.interests.map((i) => (
          <Tag key={i} label={tInterest(i)} active={filter === i} onClick={() => setFilter(filter === i ? null : i)} />
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
          {t('verifiedOnly')}
        </button>
      </div>

      {matches.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('bestMatches')}
          </h3>
          {matches.map(({ passenger, shared }) => (
            <PassengerCard
              key={passenger.id}
              passenger={passenger}
              shared={shared}
              connected={connectedIds.includes(passenger.id)}
              justBoarded={justBoardedIds.includes(passenger.id)}
              onOpenChat={() => handleSayHi(passenger)}
              onBlock={() => onBlock(passenger)}
              onReport={() => onReport(passenger)}
            />
          ))}
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('alsoOnTrain')}</h3>
          {others.map(({ passenger, shared }) => (
            <PassengerCard
              key={passenger.id}
              passenger={passenger}
              shared={shared}
              connected={connectedIds.includes(passenger.id)}
              justBoarded={justBoardedIds.includes(passenger.id)}
              onOpenChat={() => handleSayHi(passenger)}
              onBlock={() => onBlock(passenger)}
              onReport={() => onReport(passenger)}
            />
          ))}
        </section>
      )}

      {ranked.length === 0 && (
        <p className="py-8 text-center text-slate-400">{t('noMatch')}</p>
      )}
        </>
      )}

      {subscribeFor && (
        <SubscribeModal name={subscribeFor.name} onClose={() => setSubscribeFor(null)} />
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
        <Avatar emoji={passenger.avatar} photo={passenger.photo} name={passenger.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-800">{passenger.name}</p>
            {shared.length > 0 && (
              <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800">
                {t('inCommon', { n: shared.length })}
              </span>
            )}
            <div className="ml-auto shrink-0">
              <PassengerMenu onBlock={onBlock} onReport={onReport} />
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {justBoarded && (
              <span
                title={t('justBoardedAt', { stop: passenger.boardsAt ?? '' })}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
              >
                {t('justBoarded')}
              </span>
            )}
            {passenger.ticketVerified && (
              <span
                title={t('ticketVerifiedTitle')}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
              >
                {t('verified')}
              </span>
            )}
            {passenger.coach &&
              (connected ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {t('coachCard', { coach: passenger.coach })}
                </span>
              ) : (
                <span
                  title={t('coachRevealTitle')}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400"
                >
                  {t('coachHiddenCard')}
                </span>
              ))}
          </div>
          <p className="mt-1.5 text-sm text-slate-500">{passengerBio(passenger.id, passenger.bio)}</p>
          <p className="mt-1 text-sm text-slate-700">“{passengerLookingFor(passenger.id, passenger.lookingFor)}”</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {passenger.interests.map((i) => (
              <Tag key={i} label={tInterest(i)} highlight={shared.includes(i)} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button onClick={onOpenChat}>
          {t('sayHi')}
        </Button>
      </div>
    </Card>
  )
}
