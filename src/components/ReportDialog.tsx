import { useState } from 'react'
import type { Passenger } from '../types'
import { REPORT_REASONS } from '../types'
import { Button } from './ui'

/**
 * Modal dialog for reporting a passenger. Optionally blocks them at the same
 * time. Used from both Discover cards and the Chat header.
 */
export function ReportDialog({
  passenger,
  onSubmit,
  onClose,
}: {
  passenger: Passenger
  onSubmit: (reason: string, details: string, alsoBlock: boolean) => void
  onClose: () => void
}) {
  const [reason, setReason] = useState<string>('')
  const [details, setDetails] = useState('')
  const [alsoBlock, setAlsoBlock] = useState(true)

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 p-3" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-800">Report {passenger.name}</h3>
        <p className="mt-1 text-sm text-slate-500">
          Reports are confidential and help keep SayHi safe. Choose a reason:
        </p>

        <div className="mt-4 space-y-2">
          {REPORT_REASONS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ring-1 transition ${
                reason === r ? 'bg-brand-50 ring-brand-500/40' : 'bg-slate-50 ring-transparent hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="reason"
                className="h-4 w-4 accent-brand-600"
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              <span className="text-sm text-slate-700">{r}</span>
            </label>
          ))}
        </div>

        <textarea
          className="mt-3 w-full resize-none rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 outline-none ring-1 ring-transparent focus:bg-white focus:ring-brand-500"
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add details (optional)"
        />

        <label className="mt-3 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-600"
            checked={alsoBlock}
            onChange={(e) => setAlsoBlock(e.target.checked)}
          />
          <span className="text-sm text-slate-700">Also block {passenger.name}</span>
        </label>

        <div className="mt-4 flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!reason} onClick={() => onSubmit(reason, details, alsoBlock)}>
            Submit report
          </Button>
        </div>
      </div>
    </div>
  )
}
