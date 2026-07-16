import { useEffect, useRef, useState } from 'react'
import type { Passenger } from '../types'
import { Avatar, Button } from './ui'

type Status = 'idle' | 'pending' | 'kept' | 'declined' | 'removed'

// Prototype: simulate the other person's wish. In production this is their real
// choice — a chat is only kept when BOTH people opt in.
function otherWantsToKeep(index: number): boolean {
  return index % 2 === 0
}

export function LeaveNotice({
  passengers,
  station,
  onDone,
}: {
  passengers: Passenger[]
  station: string
  onDone: (keptIds: string[]) => void
}) {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(passengers.map((p) => [p.id, 'idle' as Status])),
  )
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const request = (passenger: Passenger, index: number) => {
    setStatuses((s) => ({ ...s, [passenger.id]: 'pending' }))
    timers.current.push(
      window.setTimeout(() => {
        setStatuses((s) => ({
          ...s,
          [passenger.id]: otherWantsToKeep(index) ? 'kept' : 'declined',
        }))
      }, 1300),
    )
  }

  const decline = (passenger: Passenger) => {
    setStatuses((s) => ({ ...s, [passenger.id]: 'removed' }))
  }

  const anyPending = Object.values(statuses).some((s) => s === 'pending')
  const anyIdle = Object.values(statuses).some((s) => s === 'idle')
  const keptIds = passengers.filter((p) => statuses[p.id] === 'kept').map((p) => p.id)
  const names = passengers.map((p) => p.name)
  const multiple = passengers.length > 1

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-2xl">
        <div>
          <div className="mb-1 text-3xl">🚉</div>
          <h2 className="text-lg font-semibold text-slate-800">
            {names.join(' & ')} {multiple ? 'are' : 'is'} getting off at {station}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Want to keep the chat after they leave the train? It stays only if{' '}
            <span className="font-medium text-slate-700">both of you</span> agree.
          </p>
        </div>

        <ul className="space-y-2">
          {passengers.map((passenger, index) => {
            const status = statuses[passenger.id]
            return (
              <li
                key={passenger.id}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100"
              >
                <Avatar emoji={passenger.avatar} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{passenger.name}</p>
                  <p className="mt-0.5 text-xs">
                    {status === 'idle' && <span className="text-slate-400">Keep this chat?</span>}
                    {status === 'pending' && (
                      <span className="text-amber-600">Waiting for {passenger.name}…</span>
                    )}
                    {status === 'kept' && (
                      <span className="text-emerald-600">✓ You both kept it — chat stays</span>
                    )}
                    {status === 'declined' && (
                      <span className="text-slate-400">{passenger.name} didn't keep it — chat removed</span>
                    )}
                    {status === 'removed' && (
                      <span className="text-slate-400">You removed this chat</span>
                    )}
                  </p>
                </div>
                {status === 'idle' && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => decline(passenger)}
                      className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
                    >
                      No thanks
                    </button>
                    <button
                      onClick={() => request(passenger, index)}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                    >
                      Keep chat
                    </button>
                  </div>
                )}
                {status === 'pending' && (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
                )}
                {status === 'kept' && <span className="shrink-0 text-lg">💚</span>}
                {(status === 'declined' || status === 'removed') && (
                  <span className="shrink-0 text-lg">🗑️</span>
                )}
              </li>
            )
          })}
        </ul>

        <Button onClick={() => onDone(keptIds)} disabled={anyPending || anyIdle}>
          {keptIds.length > 0
            ? `Done — keep ${keptIds.length} chat${keptIds.length > 1 ? 's' : ''}`
            : 'Done'}
        </Button>
      </div>
    </div>
  )
}
