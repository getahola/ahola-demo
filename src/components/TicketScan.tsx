import { useEffect, useRef, useState } from 'react'
import type { CheckIn } from '../types'
import { DETECTED_TICKET } from '../data'
import { Button, Card } from './ui'

type Phase = 'scan' | 'reading' | 'done'

export function TicketScan({ onConfirm, onCancel }: { onConfirm: (c: CheckIn) => void; onCancel: () => void }) {
  const [phase, setPhase] = useState<Phase>('scan')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const start = () => {
    setPhase('reading')
    timers.current.push(window.setTimeout(() => setPhase('done'), 1800))
  }

  const confirm = () => {
    onConfirm({
      trainNumber: DETECTED_TICKET.trainNumber,
      date: DETECTED_TICKET.date,
      from: DETECTED_TICKET.from,
      to: DETECTED_TICKET.to,
      coach: DETECTED_TICKET.coach,
      seat: DETECTED_TICKET.seat,
    })
  }

  if (phase !== 'done') {
    const reading = phase === 'reading'
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Scan your ticket</h2>
          <p className="text-sm text-slate-500">
            Point at the QR / Aztec code on your DB ticket to earn a verified badge.
          </p>
        </div>

        <Card className="flex flex-col items-center gap-5 bg-slate-900 py-10 ring-slate-800">
          <div className="relative h-52 w-52">
            {/* corner brackets */}
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-brand-400" />
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-brand-400" />
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-brand-400" />
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-brand-400" />
            {/* mock ticket QR */}
            <div className="absolute inset-6 flex items-center justify-center rounded-lg bg-white text-6xl">
              🎫
            </div>
            {/* scanning laser */}
            {reading && (
              <span className="absolute inset-x-6 top-6 h-0.5 animate-[scan_1.6s_ease-in-out_infinite] bg-brand-400 shadow-[0_0_12px_2px_rgba(45,212,191,0.8)]" />
            )}
          </div>
          <p className="h-5 text-sm font-medium text-brand-300">
            {reading ? 'Reading ticket…' : 'Align the code inside the frame'}
          </p>
        </Card>

        {!reading && <Button onClick={start}>Simulate scan</Button>}

        <p className="text-center text-xs text-slate-400">
          🔒 Parsed on your device. We never store your ticket image, name or payment details.
        </p>

        <button onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>

        <style>{`@keyframes scan { 0%,100% { transform: translateY(0) } 50% { transform: translateY(150px) } }`}</style>
      </div>
    )
  }

  // phase === 'done'
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
        <span>✅ Ticket verified</span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between bg-emerald-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <span>🎫</span>
            <span className="font-semibold">Valid ticket</span>
          </div>
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs">{DETECTED_TICKET.travelClass} class</span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700">{DETECTED_TICKET.from}</span>
            <span className="flex-1 border-t border-dashed border-slate-300" />
            <span>🚄</span>
            <span className="flex-1 border-t border-dashed border-slate-300" />
            <span className="font-medium text-slate-700">{DETECTED_TICKET.to}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-slate-100 py-2">
              <p className="text-xs text-slate-400">Train</p>
              <p className="font-semibold text-slate-800">{DETECTED_TICKET.trainNumber}</p>
            </div>
            <div className="rounded-lg bg-slate-100 py-2">
              <p className="text-xs text-slate-400">Coach</p>
              <p className="font-semibold text-slate-800">{DETECTED_TICKET.coach}</p>
            </div>
            <div className="rounded-lg bg-slate-100 py-2">
              <p className="text-xs text-slate-400">Seat</p>
              <p className="font-semibold text-slate-800">{DETECTED_TICKET.seat}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-emerald-50 ring-emerald-100">
        <p className="text-sm text-emerald-800">
          You'll get a <span className="font-semibold">✓ Ticket verified</span> badge on your profile, and we'll place
          you in Coach {DETECTED_TICKET.coach}.
        </p>
      </Card>

      <Button onClick={confirm}>Check in with verified badge →</Button>

      <button onClick={onCancel} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">
        Wrong ticket? Scan again
      </button>
    </div>
  )
}
