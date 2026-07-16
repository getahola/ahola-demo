import { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckIn } from '../types'
import { DETECTED_DEPARTURE, DETECTED_STATION } from '../data'
import { Button, Card } from './ui'
import { TicketScan } from './TicketScan'

type Phase = 'idle' | 'locating' | 'found' | 'ticket'

const STEPS = [
  'Getting a GPS fix…',
  `You're at ${DETECTED_STATION.name}`,
  'Scanning the platform…',
  `Found you on Track ${DETECTED_DEPARTURE.track}`,
]

function TrackRow({ track, active }: { track: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${active ? 'bg-brand-50 ring-1 ring-brand-500/30' : ''}`}>
      <span className={`w-16 text-sm font-semibold ${active ? 'text-brand-700' : 'text-slate-400'}`}>Track {track}</span>
      <div className="relative flex-1">
        <div className={`h-1 rounded-full ${active ? 'bg-brand-500' : 'bg-slate-200'}`} />
        {active && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg">🚄</span>}
      </div>
      {active && (
        <span className="flex items-center gap-1 text-xs font-medium text-brand-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" /> You
        </span>
      )}
    </div>
  )
}

export function GpsCheckIn({
  onDetected,
  onManual,
}: {
  onDetected: (c: CheckIn, ticketVerified?: boolean) => void
  onManual: () => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [step, setStep] = useState(0)
  const timers = useRef<number[]>([])

  const departs = useMemo(
    () => new Date(Date.now() + 4 * 60 * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    [],
  )

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const locate = () => {
    setPhase('locating')
    setStep(0)
    // Best-effort real permission prompt; the prototype resolves to the mock station either way.
    navigator.geolocation?.getCurrentPosition(
      () => {},
      () => {},
    )
    STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i), i * 900))
    })
    timers.current.push(window.setTimeout(() => setPhase('found'), STEPS.length * 900 + 400))
  }

  const checkIn = () => {
    onDetected({
      trainNumber: DETECTED_DEPARTURE.trainNumber,
      date: new Date().toISOString().slice(0, 10),
      from: DETECTED_STATION.name,
      to: DETECTED_DEPARTURE.to,
    })
  }

  if (phase === 'idle') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Check in to your train</h2>
          <p className="text-sm text-slate-500">Let location find the train you're boarding — no typing.</p>
        </div>

        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/30" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-4xl ring-1 ring-brand-500/20">
              📍
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Find your train automatically</p>
            <p className="mt-1 text-sm text-slate-500">
              We'll detect your station, platform and the train about to depart.
            </p>
          </div>
          <Button onClick={locate}>📍 Use my location</Button>
        </Card>

        <button onClick={onManual} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
          Enter train details manually instead
        </button>
      </div>
    )
  }

  if (phase === 'locating') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Locating you…</h2>
          <p className="text-sm text-slate-500">Keep your phone still while we get a fix.</p>
        </div>

        <Card className="flex flex-col items-center gap-6 py-12 text-center">
          <div className="relative h-32 w-32">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/20" />
            <span className="absolute inset-5 animate-ping rounded-full bg-brand-400/30 [animation-delay:200ms]" />
            <span className="absolute inset-10 rounded-full bg-brand-500/20" />
            <span className="absolute inset-0 flex items-center justify-center text-4xl">🛰️</span>
          </div>

          <p className="h-5 text-sm font-medium text-brand-700">{STEPS[step]}</p>

          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'ticket') {
    return <TicketScan onConfirm={(c) => onDetected(c, true)} onCancel={() => setPhase('found')} />
  }

  // phase === 'found'
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
        <span>✅ Location confirmed · ±{DETECTED_STATION.accuracy} m</span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="font-semibold">{DETECTED_STATION.name}</span>
          </div>
          <span className="text-xs text-brand-100">GPS</span>
        </div>
        <div className="space-y-1 p-3">
          {DETECTED_STATION.tracks.map((t) => (
            <TrackRow key={t} track={t} active={t === DETECTED_DEPARTURE.track} />
          ))}
        </div>
      </Card>

      <Card className="ring-1 ring-brand-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                {DETECTED_DEPARTURE.type}
              </span>
              <span className="text-lg font-semibold text-slate-800">{DETECTED_DEPARTURE.trainNumber}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Boarding at Track {DETECTED_DEPARTURE.track} · {DETECTED_DEPARTURE.coaches} coaches
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Departs</p>
            <p className="text-lg font-semibold text-slate-800">{departs}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-700">{DETECTED_STATION.name}</span>
          <span className="flex-1 border-t border-dashed border-slate-300" />
          <span>🚄</span>
          <span className="flex-1 border-t border-dashed border-slate-300" />
          <span className="font-medium text-slate-700">{DETECTED_DEPARTURE.to}</span>
        </div>
      </Card>

      <Button onClick={checkIn}>Check in to {DETECTED_DEPARTURE.trainNumber} →</Button>

      <button
        onClick={() => setPhase('ticket')}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
      >
        📷 Scan ticket for a ✓ verified badge
      </button>

      <button onClick={onManual} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
        Not your train? Search manually
      </button>
    </div>
  )
}
