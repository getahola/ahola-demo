import { useEffect, useRef, useState } from 'react'

/**
 * Small overflow ("…") menu with safety actions: Block and Report.
 */
export function PassengerMenu({ onBlock, onReport }: { onBlock: () => void; onReport: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="More options"
      >
        <span className="text-lg leading-none">⋯</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-40 w-36 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onReport()
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            🚩 Report
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onBlock()
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            🚫 Block
          </button>
        </div>
      )}
    </div>
  )
}
