import { useState } from 'react'
import type { CheckIn } from '../types'
import { Button, Card, Field, inputClass } from './ui'
import { GpsCheckIn } from './GpsCheckIn'

const POPULAR = ['ICE 597', 'ICE 692', 'ICE 1006', 'IC 2023', 'ICE 373']

export function CheckInForm({ onCheckIn }: { onCheckIn: (c: CheckIn, ticketVerified?: boolean) => void }) {
  const today = new Date().toISOString().slice(0, 10)
  const [mode, setMode] = useState<'gps' | 'manual'>('gps')
  const [trainNumber, setTrainNumber] = useState('')
  const [date, setDate] = useState(today)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [coach, setCoach] = useState('')

  const canCheckIn = trainNumber.trim().length > 0 && date.length > 0

  const submit = () => {
    if (!canCheckIn) return
    onCheckIn({
      trainNumber: trainNumber.trim().toUpperCase(),
      date,
      from: from.trim(),
      to: to.trim(),
      coach: coach.trim() || undefined,
    })
  }

  if (mode === 'gps') {
    return <GpsCheckIn onDetected={onCheckIn} onManual={() => setMode('manual')} />
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => setMode('gps')}
        className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-800"
      >
        ← 📍 Detect with GPS
      </button>
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Check in to your train</h2>
        <p className="text-sm text-slate-500">You'll only be visible to others checked in to the same train.</p>
      </div>

      <Field label="Train number">
        <input
          className={inputClass}
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          placeholder="e.g. ICE 597"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        {POPULAR.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrainNumber(t)}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Coach (optional)">
          <input className={inputClass} value={coach} onChange={(e) => setCoach(e.target.value)} placeholder="e.g. 7" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="From (optional)">
          <input className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Frankfurt" />
        </Field>
        <Field label="To (optional)">
          <input className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} placeholder="München" />
        </Field>
      </div>

      <Card className="bg-brand-50 ring-brand-100">
        <p className="text-sm text-brand-800">
          🔒 Privacy first: your profile is only discoverable while you're checked in, and you can leave any time.
        </p>
      </Card>

      <Button onClick={submit} disabled={!canCheckIn}>
        Check in & see who's aboard
      </Button>
    </div>
  )
}
